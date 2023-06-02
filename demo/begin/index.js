const fs = require('fs');
const acorn = require('acorn');
const MagicString = require('magic-string');

const code = fs.readFileSync('./source.js').toString();

const ast = acorn.parse(code, {
  // 使用的模块化方法
  sourceType: 'module',
  // 使用es7标准
  ecmaVersion: 7,
});

// 遍历 => 查找变量声明
const declarations = {};

ast.body
  .filter(({ type }) => {
    return type === 'VariableDeclaration';
  })
  .map((node) => {
    declarations[node.declarations[0].id.name] = node;
  });

// 遍历 => 将声明放在调用前
const statments = [];

ast.body
  .filter(({ type }) => {
    return type !== 'VariableDeclaration';
  })
  .map((node) => {
    statments.push(declarations[node.expression.callee.name]);
    statments.push(node);
  });

// 导出
const m = new MagicString(code);
// console.log(m.toString());
statments.map((node) => {
  // console.log(node);
  console.log(m.snip(node.start, node.end).toString());
  console.log('---------');
});
