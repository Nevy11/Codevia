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
  private currentFile: Folders | null = null;
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

  createNewFolder(dataSource: Folders[], folderName: string): boolean {
    const parentFolder = this.findFolderOrFile(dataSource, folderName);

    if (!parentFolder || parentFolder.type !== 'folder') return false;

    if (!parentFolder.children) parentFolder.children = [];

    parentFolder.children.push({
      name: '',
      type: 'folder',
      children: [],
      isEditing: true, // 👈 allows UI to render input
    });

    return true;
  }
  createNewRootFolder(dataSource: Folders[]): boolean {
    if (!dataSource) return false;

    dataSource.push({
      name: '',
      type: 'folder',
      children: [],
      isEditing: true, // 👈 UI: editable input
    });

    return true;
  }
  getcurrentFile() {
    return this.currentFile;
  }
  setcurrentFile(file: Folders | null) {
    this.currentFile = file;
  }
}

const EXAMPLE_DATA: Folders[] = [
  {
    name: 'CodeVia',
    type: 'folder',
    children: [
      {
        name: 'Python.py',
        type: 'file',
        content: 'print("Hello from Python!")',
      },
      {
        name: 'javascript.js',
        type: 'file',
        content: 'console.log("Hello from JS");',
      },
      {
        name: 'typescript.ts',
        type: 'file',
        content: 'console.log("Hello from TS");',
      },
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
          { name: 'intro.sh', type: 'file', content: 'echo "Week 1: Intro"' },
          {
            name: 'loop.sh',
            type: 'file',
            content: 'for i in 1 2 3; do echo $i; done',
          },
        ],
      },
      {
        name: 'week2',
        type: 'folder',
        children: [
          {
            name: 'if.sh',
            type: 'file',
            content: 'if [ $x -eq 1 ]; then echo "One"; fi',
          },
          {
            name: 'switch.sh',
            type: 'file',
            content: 'case $x in 1) echo "One";; esac',
          },
        ],
      },
    ],
  },
];
