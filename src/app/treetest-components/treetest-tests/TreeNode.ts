export type PathPoint = {
  node: TreeNode,
  direction: 'in' | 'out' | 'repeat' | 'start'
};

class TreeNode {
  children: TreeNode[] = [];
  answerCount: number[] = [];
  root: TreeNode;

  constructor(trees: any[], public data: any, public level: number, root?: TreeNode) {
    const [directChildren, rest] = trees.reduce((result, node) => {
      result[node.parent === data.id ? 0 : 1].push(node);
      return result;
    }, [[], []]);
    this.root = root ? root : this;
    directChildren.forEach(child => { this.children.push(new TreeNode(rest, child, level + 1, this.root)); });
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

  retrievePath(clicks: any[]): PathPoint[] {
    if (clicks.length === 0) { return []; }
    const pathPoint: PathPoint = {
      node: undefined,
      direction: 'in'
    };
    if (this.data.id === clicks[0].id) {
      pathPoint.node = this;
      pathPoint.direction = 'repeat';
    }
    if (!pathPoint.node) {
      pathPoint.node = this.findNodeById(clicks[0].id);
      pathPoint.direction = 'in';
    }
    if (!pathPoint.node) {
      pathPoint.node = this.root.findNodeById(clicks[0].id);
      pathPoint.direction = 'out';
    }
    return [pathPoint, ...pathPoint.node.retrievePath(clicks.slice(1))];
  }

  findNodeById(id: string): TreeNode | undefined {
    if (this.data.id === id) { return this; }
    for (const child of this.children) {
      const node = child.findNodeById(id);
      if (node) {
        return node;
      }
    }
    return undefined;
  }
}

export default TreeNode;
