import { TreeModel, TreeNode } from '@circlon/angular-tree-component';

interface CustomNodeFields {
  name?: string;
  location?: string;
  rating?: number;
  date?: Date;
  tags?: string[];
}

export type Node = Partial<TreeNode> & CustomNodeFields;

/* type of the tree object displayed on app */
export interface Tree {
  treeModel: TreeModel;
}
