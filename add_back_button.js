const fs = require('fs');
const path = require('path');

const dirs = ['financial', 'fitness', 'math', 'other'];

const backButtonHTML = `
        <div class="top-nav-bar">
            <a href="../index.html" class="back-btn">
                <i class="fas fa-arrow-left"></i>
                <span>Back</span>
            </a>
        </div>`;

dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Check if it already has the back button
            if (!content.includes('class="back-btn"')) {
                // Insert after <div class="calculator-wrapper">
                content = content.replace('<div class="calculator-wrapper">', '<div class="calculator-wrapper">\n' + backButtonHTML);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated ${file}`);
            }
        });
    }
});
