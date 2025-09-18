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
import { SupabaseClientService } from '../../../supabase-client.service';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule,
  ],
  templateUrl: './code-editor-section.component.html',
  styleUrl: './code-editor-section.component.scss',
})
export class CodeEditorSectionComponent implements OnInit {
  isBrowser = false;
  code: string = `console.log("Hello world")`;
  result: string = '';
  private themechangeService = inject(ThemeChangeService);
  private supabaseService = inject(SupabaseClientService);
  private matsnackbar = inject(MatSnackBar);
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
  async runCode() {
    // this.matsnackbar.open('This button is yet to be implemented', 'Close', {
    //   duration: 2000,
    // });
    if (this.isBrowser) {
      const worker = new Worker(
        new URL('./code-editor-section.worker', import.meta.url)
      );
      worker.postMessage(this.code);
      worker.onmessage = ({ data }) => {
        if (data.success) {
          this.matsnackbar.open(`${data.output}`, 'Close', {
            duration: 2000,
          });
          console.log('Result:', data.output); // 4
        } else {
          this.matsnackbar.open(
            `Error while executing code: ${data.error}`,
            'Close',
            { duration: 2000 }
          );
          console.error('Error:', data.error);
        }
      };
    } else {
      this.matsnackbar.open('This button is yet to be implemented', 'Close', {
        duration: 2000,
      });
    }
  }
  resetCode() {
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
  async new_folder() {
    await this.supabaseService.createOrUpdateFolder('New Folder');
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
