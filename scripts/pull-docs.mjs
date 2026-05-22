import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, ".content");
const docsDir = join(contentDir, "docs");
const tmpDir = join(contentDir, ".tmp-docs");
const archive = join(tmpDir, "muxy-main.tar.gz");
const url = "https://codeload.github.com/muxy-app/muxy/tar.gz/refs/heads/main";

mkdirSync(tmpDir, { recursive: true });

try {
  console.log("Pulling docs from muxy-app/muxy...");
  execFileSync("curl", ["-L", "--fail", "--silent", "--show-error", "-o", archive, url], {
    stdio: "inherit",
  });

  rmSync(join(tmpDir, "muxy-main"), { recursive: true, force: true });
  execFileSync("tar", ["-xzf", archive, "-C", tmpDir], { stdio: "inherit" });

  const sourceDocs = join(tmpDir, "muxy-main", "docs");
  if (!existsSync(sourceDocs)) {
    throw new Error("The muxy repository does not contain a docs/ directory.");
  }

  rmSync(docsDir, { recursive: true, force: true });
  mkdirSync(contentDir, { recursive: true });
  cpSync(sourceDocs, docsDir, { recursive: true });

  console.log(`Docs cached in ${docsDir}`);
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}
