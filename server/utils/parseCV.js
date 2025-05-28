import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import mammoth from "mammoth";

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const extractCVText = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist: " + filePath);
  }

  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist/legacy/build/pdf.mjs");
    // Use __dirname to construct the worker path and convert to file:// URL
    GlobalWorkerOptions.workerSrc = pathToFileURL(
      path.join(__dirname, "../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs")
    ).href;

    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await getDocument({ data }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      text += pageText + "\n";
    }

    return text;
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error("Unsupported file type.");
};