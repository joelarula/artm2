const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, 'data', 'db', 'paintings');
const imgDir = path.join(__dirname, 'source', 'data', 'catalog', 'original');
const photosDir = path.join(__dirname, 'data', 'db','photos');

if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
}

let found = 0;
let missing = 0;
let missingNames = [];

fs.readdir(jsonDir, (err, files) => {
  if (err) {
    console.error('Failed to read JSON directory:', err);
    process.exit(1);
  }
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(jsonDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      try {
        const data = JSON.parse(content);
        console.log('Name:', data.name);
        // Determine extension by checking for actual file in imgDir
        const possibleExts = ['png', 'jpg', 'jpeg', 'webp'];
        let foundImgFile = null;
        let ext = null;
        for (const e of possibleExts) {
          const candidate = path.join(imgDir, data.key + '.' + e);
          if (fs.existsSync(candidate)) {
            foundImgFile = candidate;
            ext = e;
            break;
          }
        }
        // Generate link (should match your migrate.js logic)
        let link = typeof data.name === 'string' ? data.name.replace(/\s+/g, '-').toLowerCase() : '';
        if (ext) {
          const newFileName = link + '.' + ext;
          const destFile = path.join(photosDir, newFileName);
          console.log('  Image exists:', foundImgFile);
          found++;
          fs.copyFileSync(foundImgFile, destFile);
        } else {
          console.log('  Image missing for key:', data.key);
          missing++;
          missingNames.push(data.name);
        }
      } catch (e) {
        console.error('Invalid JSON in', file);
      }
    }
  });
  console.log('Total JSON files with matching image:', found);
  console.log('Total missing images:', missing);
  if (missingNames.length > 0) {
    console.log('Missing image names:', missingNames);
  }
});
