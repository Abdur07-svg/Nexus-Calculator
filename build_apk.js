const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'www');

console.log('🔄 Step 1: Copying updated files to www folder...');
if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir);

const ignoreDirs = ['node_modules', 'android', 'www', '.git', 'dist', '.gemini'];
const ignoreFiles = ['package.json', 'package-lock.json', 'capacitor.config.json', 'capacitor.config.ts', 'build_apk.js', 'app-debug.apk', '.gitignore'];

function copyRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            if (ignoreDirs.includes(entry.name)) continue;
            if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
            copyRecursive(srcPath, destPath);
        } else {
            if (ignoreFiles.includes(entry.name) || entry.name.endsWith('.md') || entry.name.endsWith('.py')) continue;
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

copyRecursive(srcDir, destDir);
console.log('✅ Files copied successfully.\n');

console.log('🔄 Step 2: Syncing updates with Android project...');
try {
    execSync('npx cap sync', { stdio: 'inherit' });
    console.log('✅ Android project synced successfully.\n');
} catch (e) {
    console.error('❌ Failed to sync capacitor:', e.message);
    process.exit(1);
}

console.log('🔄 Step 3: Building new APK (This may take a minute)...');
try {
    const isWin = process.platform === 'win32';
    const gradleCmd = isWin ? 'cd android && .\\gradlew assembleDebug' : 'cd android && ./gradlew assembleDebug';
    execSync(gradleCmd, { stdio: 'inherit' });
    console.log('✅ APK built successfully.\n');
} catch (e) {
    console.error('❌ Failed to build APK:', e.message);
    process.exit(1);
}

console.log('🔄 Step 4: Copying new APK to main folder...');
const apkSrc = path.join(__dirname, 'android/app/build/outputs/apk/debug/app-debug.apk');
const apkDest = path.join(__dirname, 'app-debug.apk');
if (fs.existsSync(apkSrc)) {
    fs.copyFileSync(apkSrc, apkDest);
    console.log('🎉 Update complete! The new app-debug.apk is ready in your folder.');
} else {
    console.error('❌ Failed to find the generated APK.');
}
