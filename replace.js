const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'other');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let replaceCount = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the specific onclick handler
    const target = "onclick=\"window.location.href='../index.html'\"";
    const replacement = "onclick=\"if(history.length > 1) { history.back(); } else { window.location.href='../index.html'; }\"";
    
    if (content.includes(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        replaceCount++;
    }
}

console.log(`Replaced in ${replaceCount} files.`);
