const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'data', 'db');
const categoriesDir = path.join(dbDir, 'categories');
const authorsDir = path.join(dbDir, 'authors');
const paintingsDir = path.join(dbDir, 'paintings');
const catalogPath = path.join(dbDir, 'catalog.json');
const menuPath = path.join(dbDir, 'menu.json');

// Helper to read all JSON files in a directory
function readJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = fs.readFileSync(path.join(dir, f), 'utf8');
      return JSON.parse(data);
    });
}

// 1. Collect all categories
const categories = readJsonFiles(categoriesDir);
// 2. Collect all authors
const authors = readJsonFiles(authorsDir);
// 3. Parse all paintings
const paintings = readJsonFiles(paintingsDir);

// 4. Add paintings under matching categories
const catalog = {};
// Build a map from category name to link for lookup
const nameToLink = {};
// Build a map from category key and link to the link
const keyOrLinkToLink = {};
categories.forEach(cat => {
  if (cat.link) {
    catalog[cat.link] = {
      ...cat,
      paintings: []
    };
    // Map both key and link to the link
    if (cat.key) {
      keyOrLinkToLink[cat.key.trim().toLowerCase()] = cat.link;
    }
    keyOrLinkToLink[cat.link.trim().toLowerCase()] = cat.link;
  }
});

paintings.forEach(painting => {
  if (Array.isArray(painting.category)) {
    painting.category.forEach(catVal => {
      const key = (catVal || '').trim().toLowerCase();
      const link = keyOrLinkToLink[key];
      if (link && catalog[link]) {
        catalog[link].paintings.push(painting);
      }
    });
  } else if (painting.category) {
    const key = (painting.category || '').trim().toLowerCase();
    const link = keyOrLinkToLink[key];
    if (link && catalog[link]) {
      catalog[link].paintings.push(painting);
    }
  }
});

// Optionally, you can also add authors info if needed
// For now, just categories with paintings

// 5. Write result to catalog.json
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');

// 6. Write menu.json with only categories (no paintings)
const menu = {};
Object.entries(catalog).forEach(([link, cat]) => {
  const { paintings, ...catData } = cat;
  menu[link] = catData;
});
fs.writeFileSync(menuPath, JSON.stringify(menu, null, 2), 'utf8');

console.log('Catalog written to', catalogPath);
console.log('Menu written to', menuPath);
