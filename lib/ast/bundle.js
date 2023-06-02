const path = require('path');
const fs = require('fs');
const Module = require('./module');
const MagicString = require('magic-string');
class Bundle {
  constructor({ entry }) {
    // 有没有以.js结尾都让它以.js结尾
    this.entryPath = entry.replace(/\.js$/, '') + '.js';
    this.modules = [];
  }

  /**
   *
   * @param {*} importee 被调用者
   * @param {*} importer 调用者
   * @description main.js import foo.js (importee foo , importer main.js)
   */
  fetchModule(importee, importer) {
    // 路径计算
    let router;
    if (!importer) {
      // 主模块
      router = importee;
    } else {
      // 计算相对于importer的路径
      if (path.isAbsolute(importee)) {
        router = importee;
      } else {
        // 相对路径
        router = path.resolve(path.dirname(importer), importee.replace(/\.js$/, '') + '.js');
      }
    }

    if (router) {
      // 读取代码
      const code = fs.readFileSync(router, 'utf-8').toString();
      const module = new Module({
        code,
        path: router,
        bundle: this, // 上下文
      });

      return module;
    }
  }

  build(outputFileName) {
    const entryModule = this.fetchModule(this.entryPath);
    this.statements = entryModule.expandAllStatement();
    // 生成代码
    const { code } = this.generate();
    fs.writeFileSync(outputFileName, code, 'utf-8');
  }

  generate() {
    const magicString = new MagicString.Bundle();
    this.statements.forEach((statement) => {
      const source = statement._source.clone();
      if (statement.type === 'ExportNameDeclaration') {
        source.remove(statement.start, statement.declaration.start);
      }
      magicString.addSource({
        content: source,
        separator: '\n',
      });
    });
    return { code: magicString.toString() };
  }
}

module.exports = Bundle;
