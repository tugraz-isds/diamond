const path = require('path');
const fs = require('fs');
const { gitDescribeSync } = require('git-describe');
const { version } = require('./package.json');

const REPO_ABSPATH = __dirname;
const GIT_HASH_ABSPATH = path.join(REPO_ABSPATH, '/git-commit-hash.txt');
const VERSION_FILE_ABSPATH = path.join(REPO_ABSPATH, '/client/src/environments/version-info.ts');

let gitInfo = {};
let gitFailed = false;

try {
  const output = gitDescribeSync({
    dirtyMark: false,
    dirtySemver: false
  });
  gitInfo.hash = output.hash;
} catch(e) {
  console.log('Git describe failed');
  gitFailed = true;
}

if (gitFailed) {
  // read git commit hash from file
  const commitHash = fs.readFileSync(GIT_HASH_ABSPATH, { encoding: 'utf8', flag: 'r' });
  if (!commitHash) {
    throw new Error();
  }
  gitInfo.hash = commitHash.trim();
}

if (!gitInfo.hash) {
  console.log('Failed to extract git hash');
  throw new Error();
}

gitInfo.version = version;

console.log(JSON.stringify(gitInfo, null, 4));

const fileContent = `export const VERSION_INFO = ${JSON.stringify(gitInfo, null, 4)};\r\n`;

fs.writeFileSync(VERSION_FILE_ABSPATH, fileContent);

console.log(`Wrote version info ${gitInfo.version}-${gitInfo.hash} to ${path.relative(REPO_ABSPATH, VERSION_FILE_ABSPATH)}`);




