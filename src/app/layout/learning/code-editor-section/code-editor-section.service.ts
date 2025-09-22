import { Injectable } from '@angular/core';
import { Folders } from './folders';

@Injectable({
  providedIn: 'root',
})
export class CodeEditorSectionService {
  // findFolder(data: Folders[], targetName: string): Folders | null {
  //   console.log('folders data: ', data);
  //   for (const folder of data) {
  //     if (folder.name.toLowerCase() === targetName.toLowerCase()) return folder;
  //     if (folder.children) {
  //       const found = this.findFolder(folder.children, targetName);
  //       if (found) return found;
  //     }
  //   }
  //   return null;
  // }

  findFolderOrFile(
    data: Folders[],
    targetName: string
  ): Folders | { name: string } | null {
    for (const folder of data) {
      // Match folder name (case-insensitive)
      if (folder.name.toLowerCase() === targetName.toLowerCase()) {
        return folder;
      }

      // If the folder has children, search inside
      if (folder.children) {
        for (const child of folder.children) {
          // If the child is a nested folder, search recursively
          if ('children' in child) {
            const found = this.findFolderOrFile([child], targetName);
            if (found) return found;
          } else {
            // It's a file, match ignoring extension
            const fileNameWithoutExt = child.name.split('.')[0].toLowerCase();
            if (fileNameWithoutExt === targetName.toLowerCase()) {
              return child;
            }
          }
        }
      }
    }

    return null;
  }

  addChild(data: Folders[], parentName: string, newChild: Folders): boolean {
    const parentFolder = this.findFolderOrFile(data, parentName);

    // Ensure we're adding only to a folder
    if (!parentFolder || !('children' in parentFolder)) return false;

    if (!parentFolder.children) parentFolder.children = [];
    parentFolder.children.push(newChild);

    return true;
  }

  removeChild(data: Folders[], parentName: string, childName: string): boolean {
    const parentFolder = this.findFolderOrFile(data, parentName);

    // Ensure parent exists and has children
    if (
      !parentFolder ||
      !('children' in parentFolder) ||
      !parentFolder.children
    ) {
      return false;
    }

    const initialLength = parentFolder.children.length;

    parentFolder.children = parentFolder.children.filter((child) => {
      // If it's a file, match name ignoring extension
      if (!('children' in child)) {
        const fileNameWithoutExt = child.name.split('.')[0].toLowerCase();
        return fileNameWithoutExt !== childName.toLowerCase();
      }
      // If it's a folder, match directly
      return child.name.toLowerCase() !== childName.toLowerCase();
    });

    return parentFolder.children.length !== initialLength;
  }

  get_initial_data(): Folders[] {
    return EXAMPLE_DATA;
  }
}
const EXAMPLE_DATA: Folders[] = [
  {
    name: 'CodeVia',
    children: [
      { name: 'Python.py' },
      { name: 'javascript.js' },
      { name: 'typescript.ts' },
    ],
  },
  {
    name: 'lessons',
    children: [
      {
        name: 'week1',
        children: [{ name: 'intro.sh' }, { name: 'loop.sh' }],
      },
      {
        name: 'week2',
        children: [{ name: 'if.sh' }, { name: 'switch.sh' }],
      },
    ],
  },
];
