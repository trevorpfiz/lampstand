// tsx src/scripts/bible-converter.ts

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { convertBible } from "bible-converter";

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertZefaniaBible() {
  try {
    // Define input and output paths
    const INPUT_FILE = path.resolve(
      __dirname,
      // "../public/SF_2009-01-20_ENG_WEB_(WORLD ENGLISH BIBLE).xml",
      "../public/SF_2009-01-23_ENG_KJV_(KING JAMES VERSION).xml",
    );
    const OUTPUT_FOLDER = path.resolve(__dirname, "./converted");

    // Check if the output folder exists, create it if not
    try {
      await fs.access(OUTPUT_FOLDER);
    } catch {
      await fs.mkdir(OUTPUT_FOLDER, { recursive: true });
    }

    console.log(`Converting Bible file: ${INPUT_FILE}`);

    // Use the bible-converter package to convert the Zefania XML Bible
    await convertBible().zefania(INPUT_FILE, OUTPUT_FOLDER);

    console.log(`Conversion complete! Files saved to ${OUTPUT_FOLDER}`);
  } catch (error) {
    console.error("An error occurred during conversion:", error);
  }
}

// Run the conversion
void convertZefaniaBible();
