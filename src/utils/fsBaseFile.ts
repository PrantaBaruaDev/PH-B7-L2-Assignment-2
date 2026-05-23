import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

function ensureDir() {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
}

export function write(file: string, data: string) {
  ensureDir();

  const filePath = path.join(logDir, file);
  fs.appendFileSync(filePath, data + "\n");
}
