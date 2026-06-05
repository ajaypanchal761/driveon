import fs from 'fs';
import path from 'path';

function searchDir(dir, filter) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      if (file === 'node_modules' || file === '.git' || file === '.gemini' || file === 'build' || file === 'dist') {
        continue;
      }
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(searchDir(fullPath, filter));
      } else if (file.toLowerCase().includes(filter.toLowerCase())) {
        results.push(fullPath);
      }
    }
  } catch (e) {
    // Ignore errors
  }
  return results;
}

console.log(searchDir('E:\\Abhikaro-main', 'firebase'));
console.log(searchDir('E:\\Abhikaro-main', 'notification'));
process.exit(0);
