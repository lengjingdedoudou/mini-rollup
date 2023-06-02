class Scope {
  constructor(options) {
    this.parent = options.parent;
    this.names = options.names;
  }

  /**
   * 变量名字
   * @param {*} name
   */
  add(name) {
    if (this.names) {
      this.names.push(name);
    } else {
      this.names = [name];
    }
  }

  /**
   * 判断变量是否被声明
   * 变量名字
   * @param {*} name
   * @return 是否被声明
   */
  contains(name) {
    return !!this.findDefiningScope(name);
  }

  /**
   * 返回变量所在的作用域
   * @param {*} name
   */
  findDefiningScope(name) {
    if (this.names.includes(name)) {
      return this;
    } else if (this.parent) {
      return this.parent.findDefiningScope(name);
    }

    return null;
  }
}

module.exports = Scope;
