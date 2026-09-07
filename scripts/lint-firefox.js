const expectedWarnings = new Map([
    ['UNSUPPORTED_API', 9],
    ['UNSAFE_VAR_ASSIGNMENT', 1],
]);

const webExt = Bun.spawn([
    Bun.argv[0],
    'x',
    'web-ext',
    'lint',
    '--source-dir',
    'dist/firefox',
    '--output',
    'json',
    '--boring',
], {
    env: {...Bun.env, NO_UPDATE_NOTIFIER: '1'},
    stdout: 'pipe',
    stderr: 'inherit',
});

const report = await new Response(webExt.stdout).json();
const exitCode = await webExt.exited;
const warningCounts = new Map();

for (const warning of report.warnings) {
    warningCounts.set(warning.code, (warningCounts.get(warning.code) || 0) + 1);
    console.warn(`${warning.code}: ${warning.message} (${warning.file})`);
}

const unexpectedWarnings = [...warningCounts].filter(
    ([code, count]) => expectedWarnings.get(code) !== count
);
const missingExpectedWarnings = [...expectedWarnings].filter(
    ([code, count]) => warningCounts.get(code) !== count
);

if (
    exitCode !== 0 ||
    report.summary.errors > 0 ||
    report.summary.notices > 0 ||
    unexpectedWarnings.length > 0 ||
    missingExpectedWarnings.length > 0
) {
    console.error(JSON.stringify(report, null, 2));
    throw new Error('Firefox lint found new or changed findings.');
}

console.log(
    `Firefox lint passed with ${report.summary.warnings} known compatibility warnings.`
);
