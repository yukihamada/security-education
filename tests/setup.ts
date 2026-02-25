import { afterAll } from "vitest";
import fs from "fs";
import path from "path";

// Use a test-specific database to avoid touching production data
const TEST_DB_DIR = path.join(process.cwd(), "data");
const TEST_DB_PATH = path.join(TEST_DB_DIR, "education.db");

// Ensure the data directory exists before any test runs
if (!fs.existsSync(TEST_DB_DIR)) {
  fs.mkdirSync(TEST_DB_DIR, { recursive: true });
}

// Clean up the test DB after all tests complete
afterAll(() => {
  try {
    // Remove WAL/SHM files too
    for (const suffix of ["", "-wal", "-shm"]) {
      const f = TEST_DB_PATH + suffix;
      if (fs.existsSync(f)) {
        fs.unlinkSync(f);
      }
    }
  } catch {
    // Ignore cleanup errors
  }
});
