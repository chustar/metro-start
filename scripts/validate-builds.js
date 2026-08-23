import {existsSync} from 'node:fs';
import {join} from 'node:path';

const root = join(import.meta.dir, '..');
const targets = ['chrome', 'firefox', 'xcode'];

for (const target of targets) {
    const directory = join(root, 'dist', target);
    for (const name of ['manifest.json', 'metro-start.js', 'start.html']) {
        if (!existsSync(join(directory, name))) {
            throw new Error(`${target} build is missing ${name}`);
        }
    }
}

const firefox = await Bun.file(
    join(root, 'dist', 'firefox', 'manifest.json')
).json();
if (firefox.manifest_version !== 2 || firefox.host_permissions) {
    throw new Error('Firefox manifest permissions were not converted to V2');
}
if (!firefox.permissions.includes('*://api.metro-start.com/*')) {
    throw new Error('Firefox manifest is missing the weather host permission');
}

const xcodeJavaScript = new Bun.Glob('*.js').scanSync({
    cwd: join(root, 'dist', 'xcode'),
    onlyFiles: true,
});
if ([...xcodeJavaScript].length !== 1) {
    throw new Error('Xcode build must contain exactly one JavaScript bundle');
}

console.log('Validated Chrome, Firefox, and Xcode extension artifacts.');
