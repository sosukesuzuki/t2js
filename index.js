#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');

program
  .name('t2js')
  .description('Convert test262 tests to plain JavaScript')
  .argument('<file>', 'test262 test file to convert')
  .action(async (file) => {
    try {
      const test262Dir = process.env.LOCAL_TEST262_DIR;
      if (!test262Dir) {
        console.error('Error: LOCAL_TEST262_DIR environment variable is not set');
        process.exit(1);
      }

      // テストファイルのパスを解決
      const testFilePath = path.join(test262Dir, file);
      if (!await fs.pathExists(testFilePath)) {
        console.error(`Error: Test file not found: ${testFilePath}`);
        process.exit(1);
      }

      // テストファイルの読み込み
      const testContent = await fs.readFile(testFilePath, 'utf-8');

      // メタデータの解析
      const metadataMatch = testContent.match(/\/\*---\n([\s\S]*?)\n---\*\//);
      if (!metadataMatch) {
        console.error('Error: No metadata found in test file');
        process.exit(1);
      }

      const metadata = metadataMatch[1];
      const includesMatch = metadata.match(/includes:\s*\[(.*?)\]/);
      const includes = includesMatch ? includesMatch[1].split(',').map(f => f.trim().replace(/['"]/g, '')) : [];

      // harnessファイルの解決と結合
      let result = '';
      
      // assert.jsをデフォルトで追加
      const assertPath = path.join(test262Dir, 'harness/assert.js');
      if (!await fs.pathExists(assertPath)) {
        console.error(`Error: assert.js not found: ${assertPath}`);
        process.exit(1);
      }
      const assertContent = await fs.readFile(assertPath, 'utf-8');
      result += assertContent + '\n';
      
      // その他のharnessファイルの追加
      for (const include of includes) {
        const harnessPath = path.join(test262Dir, 'harness', include);
        if (!await fs.pathExists(harnessPath)) {
          console.error(`Error: Harness file not found: ${harnessPath}`);
          process.exit(1);
        }
        const harnessContent = await fs.readFile(harnessPath, 'utf-8');
        result += harnessContent + '\n';
      }

      // テストファイルの内容を追加（メタデータを除く）
      const testContentWithoutMetadata = testContent.replace(/\/\*---\n[\s\S]*?\n---\*\/\n/, '');
      result += testContentWithoutMetadata;

      // 結果を標準出力に出力
      console.log(result);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse(); 