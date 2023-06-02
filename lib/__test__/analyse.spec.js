const analyse = require('../analyse');
const MagicString = require('magic-string');
const acorn = require('acorn');
function getCode(code) {
  const ast = acorn.parse(code, {
    // 使用的模块化方法
    sourceType: 'module',
    // 使用es7标准
    ecmaVersion: 7,
  });

  const magicString = new MagicString(code);

  return { ast, magicString };
}

describe('测试 analyse', () => {
  it('单语句', () => {
    const { ast, magicString } = getCode('const a = 1');
    analyse(ast, magicString);
    ast._scope; // 全局作用域
    expect(ast._scope.contains('a')).toBe(true);
    expect(ast._scope.findDefiningScope('a')).toEqual(ast._scope);
    expect(ast.body[0]._defines).toEqual({ a: true });
  });

  it('_dependsOn', () => {
    const { ast, magicString } = getCode(`const a = 1 
    function f() {
      const b = 2;
    }
    `);
    analyse(ast, magicString);
    expect(ast.body[0]._dependsOn).toEqual({ a: true });
    expect(ast.body[1]._dependsOn).toEqual({ f: true, b: true });
  });
});
