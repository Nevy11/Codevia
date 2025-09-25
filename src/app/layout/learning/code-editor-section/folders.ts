// export interface Folders {
//   name: string;
//   children?: Folders[];
// }
// Folders interface
export interface Folders {
  name: string;
  type: 'folder' | 'file'; // <-- identify if it's a folder or file
  children?: Folders[];
  isEditing?: boolean; // <-- used when creating a new file
}
