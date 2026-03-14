const fs = require('fs');
const path = require('path');

const questionBanksDir = path.join(__dirname, 'question-banks');
const outputFile = path.join(__dirname, 'file-list.json');

const files = fs.readdirSync(questionBanksDir)
  .filter(file => file.endsWith('.md'))
  .map(file => ({
    file: 'question-banks/' + file,
    name: file.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2) + '\n');

console.log('Generated file-list.json with', files.length, 'files:');
files.forEach(f => console.log('  -', f.name));
