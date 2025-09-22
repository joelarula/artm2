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
        const imgFile = path.join(imgDir, data.key + '.png');
        // Determine extension from photo field if possible
        let ext = 'png';
        if (typeof data.photo === 'string' && data.photo.includes('.')) {
          ext = data.photo.split('.').pop();
        }
        // Generate link (should match your migrate.js logic)
        let link = typeof data.name === 'string' ? data.name.replace(/\s+/g, '-').toLowerCase() : '';
        const newFileName = link + '.' + ext;
        const destFile = path.join(photosDir, newFileName);
        if (fs.existsSync(imgFile)) {
          console.log('  Image exists:', imgFile);
          found++;
          fs.copyFileSync(imgFile, destFile);
        } else {
          console.log('  Image missing:', imgFile);
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
