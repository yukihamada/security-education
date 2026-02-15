/**
 * Batch audio generation script for DojoC courses
 *
 * Reads all course content and generates audio for each lesson
 * using the ElevenLabs API.
 *
 * Usage:
 *   npx tsx src/scripts/generate-audio.ts
 *
 * Environment variables:
 *   ELEVENLABS_API_KEY  - Required. Your ElevenLabs API key
 *   ELEVENLABS_VOICE_ID - Optional. Custom voice ID (defaults to placeholder)
 */

import * as fs from "fs";
import * as path from "path";

// We import the courses data directly since tsx can resolve path aliases
// If path aliases don't resolve, use relative path
let courses: Array<{
  slug: string;
  title: string;
  freePreviewContent: string;
  curriculum: Array<{
    number: number;
    title: string;
    content?: string;
  }>;
}>;

async function loadCourses() {
  try {
    const mod = await import("../data/courses");
    courses = mod.courses;
  } catch {
    // Fallback: try relative path resolution
    const mod = await import(
      path.resolve(__dirname, "../data/courses")
    );
    courses = mod.courses;
  }
}

const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^\d+\.\s/gm, "")
    .replace(/^-\s/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function generateAudio(
  text: string,
  voiceId: string,
  apiKey: string
): Promise<Buffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `ElevenLabs API error (${response.status}): ${errorText}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error(
      "Error: ELEVENLABS_API_KEY environment variable is not set."
    );
    console.error(
      "Usage: ELEVENLABS_API_KEY=your_key npx tsx src/scripts/generate-audio.ts"
    );
    process.exit(1);
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;

  await loadCourses();

  const publicDir = path.resolve(
    __dirname,
    "../../public/audio/courses"
  );

  console.log("=== DojoC Audio Generation Script ===");
  console.log(`Voice ID: ${voiceId}`);
  console.log(`Output directory: ${publicDir}`);
  console.log(`Found ${courses.length} course(s)\n`);

  let totalGenerated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const course of courses) {
    const courseDir = path.join(publicDir, course.slug);
    fs.mkdirSync(courseDir, { recursive: true });

    console.log(`\n--- Course: ${course.title} ---`);

    // Generate audio for the free preview content (lesson 1)
    const previewAudioPath = path.join(courseDir, "1.mp3");

    if (fs.existsSync(previewAudioPath)) {
      console.log(`  [SKIP] Lesson 1 (free preview) - already exists`);
      totalSkipped++;
    } else {
      const plainText = stripMarkdown(course.freePreviewContent);

      if (plainText.length === 0) {
        console.log(`  [SKIP] Lesson 1 (free preview) - no content`);
        totalSkipped++;
      } else {
        try {
          console.log(
            `  [GEN]  Lesson 1 (free preview) - ${plainText.length} chars...`
          );
          const audioBuffer = await generateAudio(
            plainText,
            voiceId,
            apiKey
          );
          fs.writeFileSync(previewAudioPath, audioBuffer);
          console.log(
            `         Saved: ${previewAudioPath} (${(audioBuffer.byteLength / 1024).toFixed(1)} KB)`
          );
          totalGenerated++;

          // Rate limit: wait between API calls
          await sleep(1000);
        } catch (err) {
          console.error(
            `  [ERROR] Lesson 1 (free preview): ${err instanceof Error ? err.message : err}`
          );
          totalErrors++;
        }
      }
    }

    // Generate audio for other lessons that have content
    for (const lesson of course.curriculum) {
      if (lesson.number === 1) continue; // Already handled above

      const lessonAudioPath = path.join(
        courseDir,
        `${lesson.number}.mp3`
      );

      if (fs.existsSync(lessonAudioPath)) {
        console.log(
          `  [SKIP] Lesson ${lesson.number}: ${lesson.title} - already exists`
        );
        totalSkipped++;
        continue;
      }

      if (!lesson.content) {
        console.log(
          `  [SKIP] Lesson ${lesson.number}: ${lesson.title} - no content`
        );
        totalSkipped++;
        continue;
      }

      const plainText = stripMarkdown(lesson.content);

      if (plainText.length === 0) {
        console.log(
          `  [SKIP] Lesson ${lesson.number}: ${lesson.title} - empty after stripping`
        );
        totalSkipped++;
        continue;
      }

      try {
        console.log(
          `  [GEN]  Lesson ${lesson.number}: ${lesson.title} - ${plainText.length} chars...`
        );
        const audioBuffer = await generateAudio(
          plainText,
          voiceId,
          apiKey
        );
        fs.writeFileSync(lessonAudioPath, audioBuffer);
        console.log(
          `         Saved: ${lessonAudioPath} (${(audioBuffer.byteLength / 1024).toFixed(1)} KB)`
        );
        totalGenerated++;

        // Rate limit: wait between API calls
        await sleep(1000);
      } catch (err) {
        console.error(
          `  [ERROR] Lesson ${lesson.number}: ${err instanceof Error ? err.message : err}`
        );
        totalErrors++;
      }
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Generated: ${totalGenerated}`);
  console.log(`Skipped:   ${totalSkipped}`);
  console.log(`Errors:    ${totalErrors}`);
  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
