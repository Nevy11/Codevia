import { Injectable } from '@angular/core';
import { Folders } from './folders';

@Injectable({
  providedIn: 'root',
})
export class CodeEditorSectionService {
  findFolder(data: Folders[], targetName: string): Folders | null {
    for (const folder of data) {
      if (folder.name === targetName) return folder;
      if (folder.children) {
        const found = this.findFolder(folder.children, targetName);
        if (found) return found;
      }
    }
    return null;
  }

  addChild(data: Folders[], parentName: string, newChild: Folders): boolean {
    const parentFolder = this.findFolder(data, parentName);
    if (!parentFolder) return false;

    if (!parentFolder.children) parentFolder.children = [];
    parentFolder.children.push(newChild);

    return true;
  }
  removeChild(data: Folders[], parentName: string, childName: string): boolean {
    const parentFolder = this.findFolder(data, parentName);
    if (!parentFolder || !parentFolder.children) return false;

    const initialLength = parentFolder.children.length;
    parentFolder.children = parentFolder.children.filter(
      (child) => child.name !== childName
    );

    return parentFolder.children.length !== initialLength;
  }
}
