const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'generated');
if (fs.existsSync(output)) {
  console.error('generated/ already exists. Move it aside before reproducing so existing work is preserved.');
  process.exit(1);
}

function run(command, args, cwd) {
  console.log('$ ' + [command, ...args].join(' '));
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('npx', ['--yes', '@voxgig/create-sdkgen@0.30.6', 'frankfurter', '-d', path.join(root, 'openapi.json'), '-o', output, '--no-install'], root);
const build = path.join(output, '.sdk');
fs.copyFileSync(path.join(root, 'config', 'toolchain-package.json'), path.join(build, 'package.json'));
fs.copyFileSync(path.join(root, 'config', 'toolchain-package-lock.json'), path.join(build, 'package-lock.json'));
fs.copyFileSync(path.join(root, 'config', 'project.aontu'), path.join(build, 'model', 'project.aontu'));
run('npm', ['ci', '--no-audit', '--no-fund'], build);
const generator = path.join(build, 'node_modules', '@voxgig', 'sdkgen', 'bin', 'voxgig-sdkgen');
run(process.execPath, [generator, 'target', 'add', 'ts'], build);
run(process.execPath, [generator, 'feature', 'add', 'test'], build);
run('npm', ['run', 'generate'], build);
const target = path.join(output, 'ts');
fs.copyFileSync(path.join(root, 'ts', 'package-lock.json'), path.join(target, 'package-lock.json'));
run('npm', ['ci', '--no-audit', '--no-fund'], target);
run('npm', ['run', 'build'], target);
run('npm', ['test'], target);
run(process.execPath, [generator, 'doctor'], build);
console.log('Generated and verified under ' + output + '. Nothing was published.');
