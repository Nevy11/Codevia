import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ThemeChangeService } from '../../../theme-change.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { Folders } from './folders';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';

@Component({
  selector: 'nevy11-code-editor-section',
  imports: [
    FormsModule,
    MonacoEditorModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTreeModule,
  ],
  templateUrl: './code-editor-section.component.html',
  styleUrl: './code-editor-section.component.scss',
})
export class CodeEditorSectionComponent implements OnInit {
  isBrowser = false;
  code: string = `// Write your code here`;
  themechangeService = inject(ThemeChangeService);
  matsnackbar = inject(MatSnackBar);
  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
  };
  themeSub: any;
  dataSource = EXAMPLE_DATA;
  childrenAccessor = (node: Folders) => node.children ?? [];
  hasChild = (_: number, node: Folders) =>
    !!node.children && node.children.length > 0;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnInit() {
    this.themechangeService.loadTheme();
    this.themeSub = this.themechangeService.theme$.subscribe((theme) => {
      this.editorOptions = {
        ...this.editorOptions,
        theme: theme === 'dark' ? 'vs-dark' : 'vs-light',
      };
    });
  }
  runCode() {
    this.matsnackbar.open('This button is yet to be implemented', 'Close', {
      duration: 2000,
    });
  }
  resetCode() {
    this.matsnackbar.open('This button is yet to be implemented', 'Close', {
      duration: 2000,
    });
    this.code = `// Write your code here`;
  }
  downloadCode() {
    this.matsnackbar.open('This button is yet to be implemented', 'Close', {
      duration: 2000,
    });
  }
  new_file() {
    this.matsnackbar.open('This button is yet to be implemented', 'Close', {
      duration: 2000,
    });
  }
  new_folder() {
    this.matsnackbar.open('This button is yet to be implemented', 'Close', {
      duration: 2000,
    });
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
