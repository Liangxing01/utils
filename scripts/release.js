const fs = require('fs');
const path = require('path');
// 控制台答应颜色文字包
const chalk = require('chalk');
// 版本号管理的包
const semver = require('semver');
// 命令行交互工具包
const { prompt } = require('enquirer');
const execa = require('execa');
const currentVersion = require('../package.json').version;

const versionIncrements = [
    'patch',
    'minor',
    'major'
];

const tags = [
    'latest',
    'next'
]

const inc = (i) => semver.inc(currentVersion, i);
const bin = (name) => path.resolve(__dirname, `../node_modules/.bin/${name}`);
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts });
const step = (msg) => console.log(chalk.cyan(msg));

async function main() {
    let targetVersion;

    const { release } = await prompt({
        type: 'select',
        name: 'release',
        message: 'Select release type',
        choices: versionIncrements.map((i) => `${i}(${inc(i)})`).concat(['custom'])
    });

    if (release === 'custom') {
        targetVersion = (await prompt({
            type: 'input',
            name: 'version',
            message: 'Input custom version',
            initial: currentVersion
        })).version
    } else {
        targetVersion = release.match(/\((.*)\)/)[1];
    }

    const { tag } = await prompt({
        type: 'select',
        name: 'tag',
        message: 'Select tag type',
        choices: tags
    });

    const { tagOk } = await prompt({
        type: 'confirm',
        name: 'tagOk',
        message: `Releasing v${targetVersion} with the "${tag}" tag. Confirm?`
    })

    if (!tagOk) {
        return;
    }

    // step('\n Running tests');
    // await run('yarn', ['test']);

    step('\nUpdating the package version...')
    updatePackage(targetVersion)

    step('\nCommitting changes...')
    await run('git', ['add', '-A'])
    await run('git', ['commit', '-m', `release: v${targetVersion}`])

    // // Publish the package.
    // step('\nPublishing the package...')
    // await run('yarn', [
    //     'publish', '--tag', tag, '--new-version', targetVersion, '--no-commit-hooks',
    //     '--no-git-tag-version'
    // ])

    // Push to GitHub.
    step('\nPushing to GitHub...')
    await run('git', ['tag', `v${targetVersion}`])
    await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
    await run('git', ['push'])

}


function updatePackage(version) {
    const pkgPath = path.resolve(path.resolve(__dirname, '..', 'package.json'));
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    
    pkg.version = version;

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

main().catch((err) => console.error(err))