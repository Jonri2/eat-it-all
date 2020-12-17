import { TreeModel, TreeNode } from '@circlon/angular-tree-component';

/* App specific fields a tree node should carry */
interface CustomNodeFields {
  name?: string;
  location?: string;
  rating?: number;
  date?: Date;
  tags?: string[];
  children?: Node[];
  isTag?: boolean;
  isVisible?: boolean;
}

/* A custom tree node
ref typescript docs: https://www.typescriptlang.org/docs/handbook/utility-types.html
*/
export type Node = Partial<Omit<TreeNode, 'children'>> & CustomNodeFields;

/* type of the tree object displayed on app */
export interface Tree {
  treeModel: TreeModel;
}

export interface Filter {
  food: boolean;
  tags: boolean;
}
