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
  private themechangeService = inject(ThemeChangeService);
  private supabaseService = inject(SupabaseClientService);
  private matsnackbar = inject(MatSnackBar);
  private codeEditorService = inject(CodeEditorSectionService);
  isBrowser = false;
  number_of_search_results = this.codeEditorService.getSearchResults();
  code: string = `
  let x = 5;
  let y = 10;
  console.log("Sum:", x + y);
  z = x * y;
  console.log("z: ", z)
  `;
  result: string = '';
  logs: string[] = [];

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
          // this.matsnackbar.open(`${output}`, 'Close', {
          //   duration: 2000,
          // });
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
  newFile() {
    const success = this.codeEditorService.createNewFile(this.dataSource);
    if (!success) {
      this.matsnackbar.open('Select a valid folder first!', 'Close', {
        duration: 2000,
      });
      return;
    }
    // Refresh UI
    this.dataSource = [...this.dataSource];
    this.matsnackbar.open('New file placeholder created', 'Close', {
      duration: 1500,
    });
  }

  async new_folder() {
    await this.supabaseService.createOrUpdateFolder('New Folder');
  }

  // A function to add custom keybindings to the monaco editor
  async onEditorInit(editor: any) {
    if (!this.isBrowser) {
      return; // Prevent Monaco code from running on the server
    }
    const monaco = await import('monaco-editor');
    // Store the editor instance if you need it later
    // this.editorInstance = editor;
    console.log('Editor instance:', editor);
    console.log('Monaco instance:', monaco);
    // You can now use the `monaco` object to access Monaco Editor APIs
    // Add custom keybinding: Ctrl + Enter to runCode()
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      this.runCode();
    });
  }

  /// a function to read the name of the folder selected
  onNodeToggle(node: Folders, isExpanded: boolean) {
    if (!isExpanded) {
      // This means the node is about to open
      console.log('Node opened:', node.name);
      this.codeEditorService.setfolder_name_selected(node.name);
      this.matsnackbar.open(`Opened folder: ${node.name}`, 'Close', {
        duration: 2000,
      });
    } else {
      // This means the node is about to close
      console.log('Node closed:', node.name);
      this.matsnackbar.open(`Closed folder: ${node.name}`, 'Close', {
        duration: 2000,
      });
    }
  }

  // finishEditing(node: Folders) {
  //   if (!node.name.trim()) {
  //     this.matsnackbar.open('File name cannot be empty', 'Close', {
  //       duration: 2000,
  //     });
  //     return;
  //   }

  //   node.isEditing = false;

  //   // Update FileData entry
  //   const fileType = node.name.includes('.')
  //     ? node.name.split('.').pop() || ''
  //     : '';

  //   // this.codeEditorService.updateFileData(node.name, fileType);

  //   this.matsnackbar.open(`File "${node.name}" created successfully`, 'Close', {
  //     duration: 2000,
  //   });
  // }

  cancelEditing(node: Folders) {
    // Remove placeholder if user cancels
    const folder = this.codeEditorService.findFolderOrFile(
      this.dataSource,
      this.codeEditorService.getfolder_name_selected()
    );
    if (folder?.children) {
      folder.children = folder.children.filter((child) => child !== node);
      this.dataSource = [...this.dataSource];
    }
  }

  private editingInProgress = false;

  finishEditing(node: Folders) {
    // If already processing, do nothing
    if (this.editingInProgress) return;
    this.editingInProgress = true;

    // Validate the file name
    if (!node.name || !node.name.trim()) {
      this.matsnackbar.open('File name cannot be empty.', 'Close', {
        duration: 2000,
      });
      this.editingInProgress = false;
      return;
    }

    // Extract file name and type
    const lastDotIndex = node.name.lastIndexOf('.');
    const fileNameWithoutExt =
      lastDotIndex !== -1 ? node.name.slice(0, lastDotIndex) : node.name;
    const fileType =
      lastDotIndex !== -1 ? node.name.slice(lastDotIndex + 1) : 'txt';

    // Call the service
    const success = this.codeEditorService.finalizeNewFile(
      this.dataSource,
      fileNameWithoutExt,
      fileType
    );

    if (success) {
      this.matsnackbar.open(
        `File "${node.name}" created successfully.`,
        'Close',
        { duration: 2000 }
      );
      this.dataSource = [...this.dataSource]; // Refresh the tree
    } else {
      this.matsnackbar.open(
        'Failed to create file. Please select a valid folder.',
        'Close',
        {
          duration: 2000,
        }
      );
    }

    // Allow editing again after a short delay
    setTimeout(() => (this.editingInProgress = false), 100);
  }
}
