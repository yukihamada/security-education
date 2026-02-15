import { NextRequest, NextResponse } from "next/server";

// Default voice ID placeholder — replace with your cloned voice ID
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

interface TTSRequestBody {
  text: string;
  voiceId?: string;
  lessonSlug: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API key is not configured" },
        { status: 503 }
      );
    }

    const body: TTSRequestBody = await request.json();
    const { text, voiceId, lessonSlug } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "text is required and must be a string" },
        { status: 400 }
      );
    }

    if (!lessonSlug || typeof lessonSlug !== "string") {
      return NextResponse.json(
        { error: "lessonSlug is required and must be a string" },
        { status: 400 }
      );
    }

    // Limit text length to prevent abuse (ElevenLabs has its own limits too)
    if (text.length > 5000) {
      return NextResponse.json(
        { error: "text must be 5000 characters or fewer" },
        { status: 400 }
      );
    }

    const selectedVoiceId = voiceId || DEFAULT_VOICE_ID;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2", // Best for Japanese
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
      console.error(
        `ElevenLabs API error (${response.status}):`,
        errorText
      );
      return NextResponse.json(
        { error: "Failed to generate audio from ElevenLabs" },
        { status: response.status }
      );
    }

    // Stream the audio response back to the client
    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=86400, immutable",
        "X-Lesson-Slug": lessonSlug,
      },
    });
  } catch (error) {
    console.error("TTS generation error:", error);
    return NextResponse.json(
      { error: "Internal server error during audio generation" },
      { status: 500 }
    );
  }
}
