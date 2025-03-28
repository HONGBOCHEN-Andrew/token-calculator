import { env } from "~/env.mjs";
import { openSourceModels, tempLlama3HackGetRevision } from "~/models";
import fs from "node:fs";
import { resolve } from "path";
import { z } from "zod";
import path from "path";

const publicDir = resolve(process.cwd(), "public");

async function download(modelName: string, file: string) {
  const filePath = resolve(publicDir, "hf", modelName, file);
  const dirPath = path.dirname(filePath);

  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${filePath}`);
      return;
    }

    const response = await fetch(
      `https://huggingface.co/${modelName}/resolve/main/${file}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.warn(`Warning: Failed to fetch ${file} for ${modelName}`);
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    fs.writeFileSync(filePath, uint8Array);
    console.log(`Writing to ${filePath}`);
  } catch (error) {
    console.warn(`Warning: Error downloading ${file} for ${modelName}:`, error);
  }
}

async function downloadAll() {
  for (const modelName of Object.values(openSourceModels.Values)) {
    const [orgId, modelId] = z
      .tuple([z.string(), z.string()])
      .parse(modelName.split("/"));

    const rev = tempLlama3HackGetRevision(modelName);

    for (const file of ["tokenizer.json", "tokenizer_config.json"]) {
      await download(modelName, file);
    }
  }
}

downloadAll();
