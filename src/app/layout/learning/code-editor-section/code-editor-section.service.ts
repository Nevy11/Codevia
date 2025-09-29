// import { Injectable } from '@angular/core';
// import { Folders } from './folders';

// @Injectable({
//   providedIn: 'root',
// })
// export class CodeEditorSectionService {
//   private search_results = 0;
//   private folder_name_selected = '';
//   findFolderOrFile(
//     data: Folders[],
//     targetName: string
//   ): Folders | { name: string } | null {
//     for (const folder of data) {
//       // Match folder name (case-insensitive)
//       if (folder.name.toLowerCase() === targetName.toLowerCase()) {
//         return folder;
//       }

//       // If the folder has children, search inside
//       if (folder.children) {
//         for (const child of folder.children) {
//           // If the child is a nested folder, search recursively
//           if ('children' in child) {
//             const found = this.findFolderOrFile([child], targetName);
//             if (found) return found;
//           } else {
//             // It's a file, match ignoring extension
//             const fileNameWithoutExt = child.name.split('.')[0].toLowerCase();
//             if (fileNameWithoutExt === targetName.toLowerCase()) {
//               return child;
//             }
//           }
//         }
//       }
//     }

//     return null;
//   }

//   addChild(data: Folders[], parentName: string, newChild: Folders): boolean {
//     const parentFolder = this.findFolderOrFile(data, parentName);

//     // Ensure we're adding only to a folder
//     if (!parentFolder || !('children' in parentFolder)) return false;

//     if (!parentFolder.children) parentFolder.children = [];
//     parentFolder.children.push(newChild);

//     return true;
//   }

//   removeChild(data: Folders[], parentName: string, childName: string): boolean {
//     const parentFolder = this.findFolderOrFile(data, parentName);

//     // Ensure parent exists and has children
//     if (
//       !parentFolder ||
//       !('children' in parentFolder) ||
//       !parentFolder.children
//     ) {
//       return false;
//     }

//     const initialLength = parentFolder.children.length;

//     parentFolder.children = parentFolder.children.filter((child) => {
//       // If it's a file, match name ignoring extension
//       if (!('children' in child)) {
//         const fileNameWithoutExt = child.name.split('.')[0].toLowerCase();
//         return fileNameWithoutExt !== childName.toLowerCase();
//       }
//       // If it's a folder, match directly
//       return child.name.toLowerCase() !== childName.toLowerCase();
//     });

//     return parentFolder.children.length !== initialLength;
//   }

//   get_initial_data(): Folders[] {
//     return EXAMPLE_DATA;
//   }

//   setSearchResults(results: number) {
//     this.search_results = results;
//   }

//   getSearchResults() {
//     return this.search_results;
//   }

//   setfolder_name_selected(name: string) {
//     this.folder_name_selected = name;
//   }

//   getfolder_name_selected() {
//     return this.folder_name_selected;
//   }
// }
// const EXAMPLE_DATA: Folders[] = [
//   {
//     name: 'CodeVia',
//     children: [
//       { name: 'Python.py' },
//       { name: 'javascript.js' },
//       { name: 'typescript.ts' },
//     ],
//   },
//   {
//     name: 'lessons',
//     children: [
//       {
//         name: 'week1',
//         children: [{ name: 'intro.sh' }, { name: 'loop.sh' }],
//       },
//       {
//         name: 'week2',
//         children: [{ name: 'if.sh' }, { name: 'switch.sh' }],
//       },
//     ],
//   },
// ];

// // Today's task
// // 1. ctrl + enter => run code .... Done
// // 2. ctrl + s => save code
// // 3. ctrl + f => find in file
// // in monaco code editor
// // Create a method to add new files and folders

import { Injectable } from '@angular/core';
import { Folders } from './folders';
import { FileData } from './file-data';

@Injectable({
  providedIn: 'root',
})
export class CodeEditorSectionService {
  private search_results = 0;
  private folder_name_selected = '';
  private fileDataList: FileData[] = []; // Store metadata for files

  /** ---------------------------------
   * Find Folder or File Recursively
   * --------------------------------- */
  findFolderOrFile(data: Folders[], targetName: string): Folders | null {
    for (const folder of data) {
      if (folder.name.toLowerCase() === targetName.toLowerCase()) {
        return folder;
      }

      if (folder.type === 'folder' && folder.children) {
        const found = this.findFolderOrFile(folder.children, targetName);
        if (found) return found;
      }
    }
    return null;
  }

  /** ---------------------------------
   * Add a Child File or Folder
   * --------------------------------- */
  addChild(data: Folders[], parentName: string, newChild: Folders): boolean {
    const parentFolder = this.findFolderOrFile(data, parentName);

    if (!parentFolder || parentFolder.type !== 'folder') return false;

    if (!parentFolder.children) parentFolder.children = [];
    parentFolder.children.push(newChild);

    return true;
  }

  /** ---------------------------------
   * Remove a Child by Name
   * --------------------------------- */
  removeChild(data: Folders[], parentName: string, childName: string): boolean {
    const parentFolder = this.findFolderOrFile(data, parentName);

    if (
      !parentFolder ||
      parentFolder.type !== 'folder' ||
      !parentFolder.children
    ) {
      return false;
    }

    const initialLength = parentFolder.children.length;

    parentFolder.children = parentFolder.children.filter((child) => {
      return child.name.toLowerCase() !== childName.toLowerCase();
    });

    return parentFolder.children.length !== initialLength;
  }

  // Create a New File in a Folder

  createNewFile(dataSource: Folders[]): boolean {
    const folderName = this.folder_name_selected;

    if (!folderName) return false;

    const folder = this.findFolderOrFile(dataSource, folderName);

    if (!folder || folder.type !== 'folder') return false;

    if (!folder.children) folder.children = [];

    // Add placeholder file for UI editing
    folder.children.push({
      name: '',
      type: 'file',
      isEditing: true, // <-- UI will display editable input
    });

    // ❌ Do NOT add metadata here anymore
    return true;
  }

  /** ---------------------------------
   * File Metadata Helpers
   * --------------------------------- */
  addFileData(fileData: FileData) {
    this.fileDataList.push(fileData);
  }

  getFileDataList() {
    return this.fileDataList;
  }

  /** ---------------------------------
   * Folder Selection Helpers
   * --------------------------------- */
  setfolder_name_selected(name: string) {
    this.folder_name_selected = name;
  }

  getfolder_name_selected() {
    return this.folder_name_selected;
  }

  /** ---------------------------------
   * Search Result Helpers
   * --------------------------------- */
  setSearchResults(results: number) {
    this.search_results = results;
  }

  getSearchResults() {
    return this.search_results;
  }

  get_initial_data(): Folders[] {
    return EXAMPLE_DATA;
  }

  finalizeNewFile(
    dataSource: Folders[],
    newFileName: string,
    fileType: string
  ): boolean {
    const folderName = this.folder_name_selected;

    console.log('Foldername selected:', folderName);
    console.log('New file name:', newFileName.trim());

    if (!folderName || !newFileName.trim()) return false;

    const folder = this.findFolderOrFile(dataSource, folderName);

    if (!folder || folder.type !== 'folder' || !folder.children) return false;

    console.log('Found folder:', folder);

    // Find the placeholder file
    const placeholder = folder.children.find(
      (child) => child.isEditing === true
    );

    if (!placeholder) return false;

    console.log('Found placeholder:', placeholder);

    // Update the placeholder file
    placeholder.name = `${newFileName}.${fileType}`;
    placeholder.type = 'file';
    placeholder.isEditing = false;

    // Also create metadata entry
    const newFileData: FileData = {
      folder_name: folderName,
      file_name: newFileName,
      file_type: fileType,
      lines: [],
    };

    this.fileDataList.push(newFileData);

    return true;
  }

  /** ---------------------------------
   * Delete a Specific File by Name
   * --------------------------------- */
  deleteFile(
    dataSource: Folders[],
    folderName: string,
    fileName: string
  ): boolean {
    const parentFolder = this.findFolderOrFile(dataSource, folderName);

    if (
      !parentFolder ||
      parentFolder.type !== 'folder' ||
      !parentFolder.children
    ) {
      return false;
    }

    const initialLength = parentFolder.children.length;

    // ✅ Replace with a new array reference
    parentFolder.children = parentFolder.children.filter(
      (child) => !(child.type === 'file' && child.name === fileName)
    );

    return parentFolder.children.length !== initialLength; // true if something was deleted
  }
}

const EXAMPLE_DATA: Folders[] = [
  {
    name: 'CodeVia',
    type: 'folder',
    children: [
      { name: 'Python.py', type: 'file' },
      { name: 'javascript.js', type: 'file' },
      { name: 'typescript.ts', type: 'file' },
    ],
  },
  {
    name: 'lessons',
    type: 'folder',
    children: [
      {
        name: 'week1',
        type: 'folder',
        children: [
          { name: 'intro.sh', type: 'file' },
          { name: 'loop.sh', type: 'file' },
        ],
      },
      {
        name: 'week2',
        type: 'folder',
        children: [
          { name: 'if.sh', type: 'file' },
          { name: 'switch.sh', type: 'file' },
        ],
      },
    ],
  },
];

//  When someone clicks a file it creates the file two times
