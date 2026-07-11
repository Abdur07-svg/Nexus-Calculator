const fs = require('fs');
const path = require('path');

// Directories to copy
const dirsToCopy = ['financial', 'fitness', 'js', 'math', 'other', 'pages'];
// Files to copy
const filesToCopy = ['index.html', 'style.css'];

const srcDir = __dirname;
const destDir = path.join(__dirname, 'www');

// Create www directory if it doesn't exist
if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir);
}

// Function to copy a file
function copyFile(src, dest) {
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
    }
}

// Function to recursively copy a directory
function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    }
}

console.log('Building Capacitor web assets...');

// Copy specified files
filesToCopy.forEach(file => {
    copyFile(path.join(srcDir, file), path.join(destDir, file));
});

// Copy specified directories
dirsToCopy.forEach(dir => {
    copyDir(path.join(srcDir, dir), path.join(destDir, dir));
});

console.log('Build completed! Files copied to www folder.');
