export interface TreeNode {
  id: string;
  name: string;
  type: 'factory' | 'workshop' | 'equipment' | 'meter';
  meterType?: 'electric' | 'water' | 'gas' | 'compressedAir' | 'argon' | 'co2' | 'heat';
  parentId: string | null;
  children: TreeNode[];
  icon?: string;
}

export interface TreeState {
  selectedNodeId: string | null;
  expandedNodeIds: string[];
  setSelectedNode: (id: string) => void;
  toggleExpandNode: (id: string) => void;
}