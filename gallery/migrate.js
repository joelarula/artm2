// save as printPhotos.js
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'source', 'data', 'db');
const outputDir = path.join(__dirname, 'data', 'db', 'paintings');
const imageDir = path.join(__dirname, 'source', 'data','catalog', 'original');
let count = 0;
let linkSet = new Set();
let duplicates = [];
let linkCount = {};

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(dir, (err, files) => {
  if (err) {
    console.error('Failed to read directory:', err);
    process.exit(1);
  }
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (file.endsWith('.json')) {
      const content = fs.readFileSync(filePath, 'utf8');
      try {
        const data = JSON.parse(content);
        if (data.photo) {
          let link = typeof data.name === 'string' ? data.name.replace(/\s+/g, '-').toLowerCase() : '';
          if (linkCount[link]) {
            linkCount[link]++;
            const numberedLink = link + '-' + linkCount[link];
            duplicates.push(numberedLink);
            link = numberedLink;
            var published = false;
          } else {
            linkCount[link] = 1;
            var published = data.published;
          }
          // Determine extension by checking for [key].png in imageDir
          let extension = null;
          const possibleExts = ['png', 'jpg', 'jpeg', 'webp'];
          for (const ext of possibleExts) {
            const imgPath = path.join(imageDir, `${data.key}.${ext}`);
            if (fs.existsSync(imgPath)) {
              extension = ext;
              break;
            }
          }
          let photoFile = data.photo;
          if (extension) {
            // Always use the found extension, regardless of original photo extension
            photoFile = `${link}.${extension}`;
          }
          const filtered = {
            key: data.key,
            name: data.name,
            photo: photoFile,
            author: data.author,
            category: Array.isArray(data.category) ? data.category : [data.category],
            published: published,
            link
          };
          if (linkCount[link] === 1) {
            const outPath = path.join(outputDir, link + '.json');
            fs.writeFileSync(outPath, JSON.stringify(filtered, null, 2), 'utf8');
          }
          console.log(filtered);
          count++;
        }
      } catch (e) {
        console.error('Invalid JSON in', file);
      }
    }
  });
  console.log(`Total files with photo attribute: ${count}`);
  if (duplicates.length > 0) {
    console.log('Duplicate links found:', duplicates);
  } else {
    console.log('No duplicate links found.');
  }
});