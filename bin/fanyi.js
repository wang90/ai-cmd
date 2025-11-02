#!/usr/bin/env node
import { Command } from 'commander';
import translateWord from '../src/translate.js';
import fs from 'fs';
import path from 'path';

const program = new Command();
const configPath = path.resolve(process.env.HOME || process.env.USERPROFILE, '.fanyi-config.json');

// 初始化配置文件
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({ from: 'auto', to: 'zh' }, null, 2));
}

// 帮助命令
program
  .name('fanyi')
  .description('一个命令行翻译工具')
  .version('1.0.0')
  .option('-trans', '设置翻译语言')
  .argument('[text...]', '要翻译的文字')
  .action(async (text, options) => {
    if (options.trans) {
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question('请输入目标语言代码 (例如 zh/en/jp)：', (lang) => {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        config.to = lang;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(`✅ 已设置目标语言为：${lang}`);
        rl.close();
      });
      return;
    }

    const query = text.join(' ');
    if (!query) {
      program.outputHelp();
      return;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const result = await translateWord(query, config);
    console.log(`🔤 ${query} -> ${result}`);
  });

program.parse();