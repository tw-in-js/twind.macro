declare module '@babel/helper-annotate-as-pure' {
  import { Node, NodePath } from '@babel/core'
  export default function annotateAsPure(nodeOrPath: Node | NodePath): void
}
