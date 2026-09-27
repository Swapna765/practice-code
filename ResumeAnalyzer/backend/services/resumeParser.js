import fs from "fs";
import { PDFParse } from "pdf-parse";

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
      data: dataBuffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    if (!result.text || !result.text.trim()) {
      throw new Error("Could not extract text from the PDF");
    }

    return result.text.trim();
  } catch (error) {
    console.error("PDF parsing error:", error.message);
    throw new Error("Failed to extract text from resume");
  }
};

export default extractTextFromPDF;