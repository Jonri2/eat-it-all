import { TreeModel, TreeNode } from '@circlon/angular-tree-component';

/* App specific fields a tree node should carry */
interface CustomNodeFields {
  name?: string;
  location?: string;
  rating?: number;
  date?: Date;
  tags?: string[];
}

/* A custom tree node */
export type Node = Partial<TreeNode> & CustomNodeFields;

/* type of the tree object displayed on app */
export interface Tree {
  treeModel: TreeModel;
}
