import { Injectable } from '@angular/core';
import { Folders } from './folders';

@Injectable({
  providedIn: 'root',
})
export class CodeEditorSectionService {
  findFolder(data: Folders[], targetName: string): Folders | null {
    console.log('folders data: ', data);
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
