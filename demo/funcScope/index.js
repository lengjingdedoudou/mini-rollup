const fs = require('fs');
const acorn = require('acorn');
const MagicString = require('magic-string');

const code = fs.readFileSync('./source.js').toString();

const ast = acorn.parse(code, {
  locations: true, // 索引位置
  ranges: true,
  // 使用的模块化方法
  sourceType: 'module',
  // 使用es7标准
  ecmaVersion: 7,
});

const walk = require('./walk');
let indent = 0; // 缩进
walk(ast, {
  enter(node) {
    if (node.type === 'VariableDeclarator') {
      console.log('%svar:', ' '.repeat(indent * 4), node.id.name);
    }

    if (node.type === 'FunctionDeclaration') {
      console.log('%sfun:', ' '.repeat(indent * 4), node.id.name);
      indent++;
    }
  },
  leave(node) {
    if (node.type === 'FunctionDeclaration') {
      indent--;
    }
  },
});
