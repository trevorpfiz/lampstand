declare module 'unist-util-flatmap' {
  import type { Node, Parent } from 'unist';

  function flatMap(
    tree: Node,
    fn: (node: Node, index: number, parent: Parent | null) => Node[]
  ): Node;

  export default flatMap;
}
