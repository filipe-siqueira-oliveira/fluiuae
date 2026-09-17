import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { copyLogos } from "logos-bancos-br/node";

const web_root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = resolve(web_root, "public/bank_logos");

const result = copyLogos({ dest: destination, format: "png", by: "ispb" });

console.log(`bank_logos: ${result.copied.length} logos copiados para public/bank_logos`);
