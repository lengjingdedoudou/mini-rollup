const Module = require('../ast/module');
describe('测试 Module', () => {
  describe('构造方法', () => {
    describe('imports', () => {
      it('单个import', () => {
        const code = `import {a as aa} from '../module'`;
        const module = new Module({ code });
        expect(module.imports).toEqual({
          aa: {
            localName: 'aa',
            name: 'a',
            source: '../module',
          },
        });
      });

      it('多个import', () => {
        const code = `import {a as aa,b} from '../moduleA'
        import {c} from '../moduleB'
        `;
        const module = new Module({ code });
        expect(module.imports).toEqual({
          aa: {
            localName: 'aa',
            name: 'a',
            source: '../moduleA',
          },
          b: {
            localName: 'b',
            name: 'b',
            source: '../moduleA',
          },
          c: {
            localName: 'c',
            name: 'c',
            source: '../moduleB',
          },
        });
      });
    });

    describe('exports', () => {
      it('单个export', () => {
        const code = `export const a = 1`;
        const module = new Module({ code });
        expect(module.exports['a'].localName).toBe('a');
        expect(module.exports['a'].node).toBe(module.ast.body[0]);
        expect(module.exports['a'].expression).toBe(module.ast.body[0].declaration);
      });
    });

    describe('definitions  ', () => {
      it('单个变量', () => {
        const code = `const a = 1`;
        const module = new Module({ code });
        expect(module.definitions).toEqual({
          a: module.ast.body[0],
        });
      });
    });
  });
  describe('ExpandAllStatement', () => {
    it('基础', () => {
      const code = `const a = () => 1
      const b = () => 2
      const t = () => 4
      a()
      t()
      `;
      const module = new Module({ code });
      const statements = module.expandAllStatement();
      console.log(statements);
      // expect(statements.length).toBe(4);
      expect(module.code.snip(statements[0].start, statements[0].end).toString()).toEqual(`const a = () => 1`);
    });
  });
});
