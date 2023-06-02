function walk(ast, { enter, leave }) {
  visit(ast, null, enter, leave);
}

function visit(node, parent, enter, leave) {
  if (!node) return;
  if (enter) {
    enter.call(null, node, parent);
  }
  // 对象遍历
  const children = Object.keys(node).filter((key) => typeof node[key] === 'object');

  children.forEach((childrenKey) => {
    const child = node[childrenKey];
    visit(child, node, enter, leave);
  });

  if (leave) {
    leave(node, parent);
  }
}

module.exports = walk;
