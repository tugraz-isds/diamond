class TreeNode {
  children: TreeNode[] = [];
  answerCount = 0;

  constructor(trees: any[], public data: any, public level: number) {
    const [directChildren, rest] = trees.reduce((result, node) => {
      result[node.parent === data.id ? 0 : 1].push(node);
      return result;
    }, [[], []]);

    directChildren.forEach(child => { this.children.push(new TreeNode(rest, child, level + 1)); });
  }

  fillTree(tests: any[]) {
    for (const test of tests) {
      const countNodeSelectedInTest = test.results.filter(result => result.answer === this.data.id).length;
      this.answerCount += countNodeSelectedInTest;
    }
    this.children.forEach(child => {
      child.fillTree(tests);
    });
  }

  hasAnswerInPath() {
    if (this.answerCount > 0) { return true; }

    for (const child of this.children) {
      if (child.hasAnswerInPath()) { return true; }
    }
    return false;
  }

  getDepthFirstArray() {
    const currentArray: TreeNode[] = [this];
    for (const child of this.children) {
      const childArray = child.getDepthFirstArray();
      currentArray.push(...childArray);
    }
    return currentArray;
  }

}

export default TreeNode;
