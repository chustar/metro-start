const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(repoRoot, 'html', 'start.html');
const distSrc = path.join(repoRoot, 'dist', 'chrome', 'metro-start.js');
const demoDir = path.join(repoRoot, 'demo');
const demoDist = path.join(demoDir, 'dist');

if (!fs.existsSync(htmlPath)) {
    console.error('html/start.html not found');
    process.exit(1);
}

if (!fs.existsSync(distSrc)) {
    console.error('Built bundle not found at', distSrc);
    console.error('Run `npm run build` first or run `npm run build:demo` which runs build then this script.');
    process.exit(1);
}

// Sample data to populate localStorage for demo
const sampleData = {
    todos: [
        { name: 'Try the demo mode', done: false },
        { name: 'Add a todo', done: false },
        { name: 'Mark one done', done: true }
    ],
    currentTheme: {
        themeContent: {
            'font-chooser': 'system',
            baseColor: '#88aaff',
            mainColor: '#ffffff',
            titleColor: '#333333',
            optionsColor: '#ff5500',
            backgroundColor: '#0f1723',
            'background-chooser': 'none'
        },
        title: 'Demo Theme',
        author: 'Demo'
    },
    themesLocal: [],
    weather: {
        city: 'Vancouver, CA',
        currentTemp: 16,
        highTemp: 20,
        lowTemp: 12,
        condition: 'partly cloudy',
        units: 'celsius',
        visible: true
    },
    page: 'todos'
};

function ensureDir(p) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

ensureDir(demoDir);
ensureDir(demoDist);

// Create sample-data.js which sets localStorage keys
const sampleJs = Object.keys(sampleData).map(k => {
    return `localStorage.setItem(${JSON.stringify(k)}, ${JSON.stringify(JSON.stringify(sampleData[k]))});`;
}).join('\n');

fs.writeFileSync(path.join(demoDir, 'sample-data.js'), sampleJs, 'utf8');
console.log('Wrote demo/sample-data.js');

// Copy the built bundle to demo/dist
fs.copyFileSync(distSrc, path.join(demoDist, 'metro-start.js'));
console.log('Copied bundle to demo/dist/metro-start.js');

// Read start.html and modify it for demo usage: insert sample-data.js and point script to dist/metro-start.js
let html = fs.readFileSync(htmlPath, 'utf8');

// Insert sample-data.js before the metro-start script tag and update script src
html = html.replace(/<script src=['"]metro-start.js['"]><\/script>/, `<script src="sample-data.js"></script>\n    <script src="dist/metro-start.js"></script>`);

fs.writeFileSync(path.join(demoDir, 'index.html'), html, 'utf8');
console.log('Wrote demo/index.html');

console.log('\nDemo build complete. Open demo/index.html in a browser to try the app without installing as an extension.');
