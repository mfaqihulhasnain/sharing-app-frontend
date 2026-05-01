import fs from "node:fs";
import path from "node:path";

function resolveGitDir(projectRoot) {
  const dotGitPath = path.join(projectRoot, ".git");

  if (!fs.existsSync(dotGitPath)) {
    return null;
  }

  const dotGitStats = fs.statSync(dotGitPath);
  if (dotGitStats.isDirectory()) {
    return dotGitPath;
  }

  const gitFileContent = fs.readFileSync(dotGitPath, "utf8").trim();
  const gitDirPrefix = "gitdir:";
  if (!gitFileContent.toLowerCase().startsWith(gitDirPrefix)) {
    return null;
  }

  const gitDirPath = gitFileContent.slice(gitDirPrefix.length).trim();
  return path.resolve(projectRoot, gitDirPath);
}

function resolveGitBranch(projectRoot) {
  try {
    const gitDir = resolveGitDir(projectRoot);
    if (!gitDir) {
      return null;
    }

    const headPath = path.join(gitDir, "HEAD");
    const headContent = fs.readFileSync(headPath, "utf8").trim();

    const refPrefix = "ref:";
    if (!headContent.toLowerCase().startsWith(refPrefix)) {
      return null;
    }

    const ref = headContent.slice(refPrefix.length).trim();
    const headsPrefix = "refs/heads/";
    if (!ref.startsWith(headsPrefix)) {
      return null;
    }

    return ref.slice(headsPrefix.length);
  } catch {
    return null;
  }
}

function resolveDistDir() {
  if (process.env.NEXT_DIST_DIR) {
    return process.env.NEXT_DIST_DIR;
  }

  const branch = resolveGitBranch(process.cwd());
  if (!branch) {
    return ".next";
  }

  const safeBranch = branch
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");

  return `.next-${safeBranch}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  distDir: resolveDistDir(),
};

export default nextConfig;
