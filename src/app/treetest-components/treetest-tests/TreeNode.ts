class TreeNode {
  children: TreeNode[] = [];
  answerCount: number[] = [];

  constructor(trees: any[], public data: any, public level: number) {
    const [directChildren, rest] = trees.reduce((result, node) => {
      result[node.parent === data.id ? 0 : 1].push(node);
      return result;
    }, [[], []]);

    directChildren.forEach(child => { this.children.push(new TreeNode(rest, child, level + 1)); });
  }

  fillTree(tests: any[]) {
    for (const test of tests) {
      if (test.excluded) continue;
      while (test.results.length > this.answerCount.length) {
        this.answerCount.push(0);
      }
      test.results.forEach((result, index) => {
        if (result.answer === this.data.id) this.answerCount[index]++;
      });
    }
    this.children.forEach(child => {
      child.fillTree(tests);
    });
  }

  hasAnswerInPath() {
    for (const count of this.answerCount) {
      if (count > 0) return true;
    }

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
