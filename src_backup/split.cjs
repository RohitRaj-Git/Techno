const fs = require('fs');
const path = require('path');

const text = fs.readFileSync(path.join(__dirname, 'bundle.txt'), 'utf8').replace(/\r\n/g, '\n');
const parts = text.split(/^#### FILE: (.+)$/m);

for (let i = 1; i < parts.length; i += 2) {
    const file = parts[i].trim();
    const content = parts[i + 1].replace(/^\n/, '').replace(/\n+$/, '') + '\n';
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    console.log('wrote', file);
}