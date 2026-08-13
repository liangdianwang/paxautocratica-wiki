import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

function gitHead() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "local";
  }
}

const candidate = process.env.BUILD_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || gitHead();
const version = /^[0-9a-f]{40}$/.test(candidate) ? candidate : "local";
const output = resolve("public/version.txt");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${version}\n`, "utf8");
console.log(`version.txt=${version}`);
