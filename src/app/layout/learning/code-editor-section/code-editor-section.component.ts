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
import { TerminalComponent } from './terminal/terminal.component';
import { FileSearchBarComponent } from './file-search-bar/file-search-bar.component';
import { CodeEditorSectionService } from './code-editor-section.service';

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
    TerminalComponent,
    FileSearchBarComponent,
  ],
  templateUrl: './code-editor-section.component.html',
  styleUrl: './code-editor-section.component.scss',
})
export class CodeEditorSectionComponent implements OnInit {
  isBrowser = false;

  code: string = `
  let x = 5;
  let y = 10;
  console.log("Sum:", x + y);
  z = x * y;
  console.log("z: ", z)
  `;
  result: string = '';
  logs: string[] = [];
  private themechangeService = inject(ThemeChangeService);
  private supabaseService = inject(SupabaseClientService);
  private matsnackbar = inject(MatSnackBar);
  private codeEditorService = inject(CodeEditorSectionService);
  initial_data: Folders[] = this.codeEditorService.get_initial_data();
  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
  };
  themeSub: any;
  dataSource = this.codeEditorService.get_initial_data();
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
          let output = data.logs.join('\n');
          this.logs = data.logs;
          this.matsnackbar.open(`${output}`, 'Close', {
            duration: 2000,
          });
          console.log('', data.logs);

          console.log('Result:', data); // 4
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
