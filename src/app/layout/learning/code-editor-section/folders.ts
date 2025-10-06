export interface Folders {
  name: string;
  type: 'file' | 'folder';
  children?: Folders[];
  isEditing?: boolean;
  content?: string;
}
