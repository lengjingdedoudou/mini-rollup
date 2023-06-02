const Scope = require('../scope');

describe('测试 Scope', () => {
  it('简单父子关系', () => {
    const root = new Scope({});
    root.add('a');
    const child = new Scope({
      parent: root,
    });
    child.add('b');
    expect(child.contains('b')).toBe(true);
    expect(child.contains('a')).toBe(true);
    expect(child.findDefiningScope('a')).toEqual(root);
    expect(child.findDefiningScope('b')).toEqual(child);
  });
});
