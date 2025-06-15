// backend/vercel-build.js
const { build } = require('@vercel/node');
const { execSync } = require('child_process');

module.exports = async () => {
  // 1. 安装依赖
  execSync('npm install', { stdio: 'inherit' });
  
  // 2. 编译 TypeScript
  execSync('npx tsc', { stdio: 'inherit' });
  
  // 3. 调用默认构建流程
  await build({
    files: ['dist/**/*.js'], // 使用编译后的文件
    entrypoint: 'dist/index.js', // 入口文件
    workPath: process.cwd(),
  });
};