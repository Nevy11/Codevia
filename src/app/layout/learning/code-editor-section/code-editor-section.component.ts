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
import { MatTooltipModule } from '@angular/material/tooltip';
import { TerminalComponent } from './terminal/terminal.component';
import { FileSearchBarComponent } from './file-search-bar/file-search-bar.component';
import { CodeEditorSectionService } from './code-editor-section.service';
import { MatInputModule } from '@angular/material/input';
import { NoFileSelectedComponent } from './no-file-selected/no-file-selected.component';
import { SupabaseClientService } from '../../../supabase-client.service';

declare const monaco: any;

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
    MatInputModule,
    NoFileSelectedComponent,
  ],
  templateUrl: './code-editor-section.component.html',
  styleUrl: './code-editor-section.component.scss',
})
export class CodeEditorSectionComponent implements OnInit {
  private themechangeService = inject(ThemeChangeService);
  private matsnackbar = inject(MatSnackBar);
  private codeEditorService = inject(CodeEditorSectionService);
  private supabaseService = inject(SupabaseClientService);
  private currentFile: Folders | null = null;
  private editingInProgress = false;

  isEditorEnabled: boolean = false;

  isBrowser = false;
  number_of_search_results = this.codeEditorService.getSearchResults();

  code: string = `// Write your code here`;
  result: string = '';
  logs: string[] = [];
  startup: string = `// Write your code here`;

  initial_data: Folders[] = this.codeEditorService.get_initial_data();
  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
  };
  themeSub: any;
  dataSource = this.codeEditorService.get_initial_data();
  childrenAccessor = (node: Folders) => node.children ?? [];

  hasChild = (_: number, node: Folders) => node.type === 'folder';
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnInit() {
    this.codeEditorService.loadAndCacheData().then(() => {
      this.dataSource = this.codeEditorService.get_cached_data();
    });
    this.themechangeService.loadTheme();
    this.themeSub = this.themechangeService.theme$.subscribe((theme) => {
      this.editorOptions = {
        ...this.editorOptions,
        theme: theme === 'dark' ? 'vs-dark' : 'vs-light',
      };
    });

    console.log('data source: ', this.dataSource);
  }
  async runCode() {
    if (this.isBrowser) {
      const worker = new Worker(
        new URL('./code-editor-section.worker', import.meta.url)
      );
      worker.postMessage(this.code);
      worker.onmessage = ({ data }) => {
        if (data.success) {
          this.logs = data.logs;
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
  openFile(node: Folders) {
    console.log('is editor enabled: ', this.isEditorEnabled);
    if (node.type === 'file') {
      this.codeEditorService.setcurrentFile(node);
      this.code = node.content || ''; // Load content into Monaco editor
      this.isEditorEnabled = true; // ✅ enable editor
      this.matsnackbar.open(`Opened file: ${node.name}`, 'Close', {
        duration: 2000,
      });
    }
    console.log('is editor enabled: ', this.isEditorEnabled);
  }

  resetCode() {
    this.currentFile = this.codeEditorService.getcurrentFile();

    if (this.currentFile) {
      this.code = '';
      this.currentFile.content = '';
      this.matsnackbar.open(
        `Code reset in file: ${this.currentFile.name}`,
        'Close',
        {
          duration: 1500,
        }
      );
    } else {
      this.isEditorEnabled = false; // ✅ disable editor
      this.matsnackbar.open('Error while clearing the file', 'Close', {
        duration: 2000,
      });
    }
  }

  downloadCode() {
    this.currentFile = this.codeEditorService.getcurrentFile();

    if (!this.currentFile) {
      this.matsnackbar.open('No file is open to download.', 'Close', {
        duration: 2000,
      });
      return;
    }

    const fileName = this.currentFile.name || 'untitled.txt';
    const fileContent = this.code || '';

    this.codeEditorService.downloadFile(fileName, fileContent);

    this.matsnackbar.open(`Downloaded: ${fileName}`, 'Close', {
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

  // A function to add custom keybindings to the monaco editor
  async onEditorInit(editor: any) {
    if (!this.isBrowser) {
      return; // Prevent Monaco code from running on the server
    }

    // Add custom keybinding for Ctrl+Enter to run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      this.runCode();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      this.saveCurrentFile();
    });
  }

  /// a function to read the name of the folder selected
  onNodeToggle(node: Folders, isExpanded: boolean) {
    if (isExpanded) {
      // This means the node is about to close
      console.log('Node closed:', node.name);
      this.matsnackbar.open(`Closed folder: ${node.name}`, 'Close', {
        duration: 2000,
      });
    } else {
      // This means the node is about to open
      console.log('Node opened:', node.name);
      this.codeEditorService.setfolder_name_selected(node.name);
      this.matsnackbar.open(`Opened folder: ${node.name}`, 'Close', {
        duration: 2000,
      });
    }
  }

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

  delete_file(node: Folders) {
    const folderName = this.codeEditorService.getfolder_name_selected();

    const deleted = this.codeEditorService.deleteFile(
      this.dataSource, // Root folder data
      folderName, // Parent folder where the file is
      node.name // File name to delete
    );

    if (deleted) {
      console.log(`File '${node.name}' deleted successfully!`);
      this.dataSource = [...this.dataSource];
    } else {
      console.log(`File '${node.name}' could not be deleted.`);
    }
  }

  async new_folder() {
    const folderName = this.codeEditorService.getfolder_name_selected();

    if (!folderName) {
      this.codeEditorService.createNewRootFolder(this.dataSource);
      this.dataSource = [...this.dataSource]; // Refresh UI
      this.matsnackbar.open('New root folder created successfully!', 'Close', {
        duration: 2000,
      });
      return;
    }

    const success = this.codeEditorService.createNewFolder(
      this.dataSource,
      folderName
    );

    if (success) {
      this.dataSource = [...this.dataSource]; // Refresh UI
      this.matsnackbar.open('New folder created successfully!', 'Close', {
        duration: 2000,
      });
    } else {
      this.matsnackbar.open('Failed to create folder.', 'Close', {
        duration: 2000,
      });
    }
  }
  // async new_folder() {
  //   const folderName = this.codeEditorService.getfolder_name_selected();
  //   console.log('Selected folder name:', folderName);
  //   if (!folderName) {
  //     // 🟢 Case 1: Creating a new root folder
  //     const newFolderName = 'New Folder'; // or open a dialog for a custom name
  //     const created = await this.supabaseService.createFolder(
  //       newFolderName,
  //       null
  //     );
  //     if (created) {
  //       this.codeEditorService.createNewRootFolder(this.dataSource);
  //       this.dataSource = [...this.dataSource]; // refresh UI
  //       this.matsnackbar.open(
  //         'New root folder created successfully!',
  //         'Close',
  //         {
  //           duration: 2000,
  //         }
  //       );
  //     } else {
  //       this.matsnackbar.open('Failed to create root folder.', 'Close', {
  //         duration: 2000,
  //       });
  //     }

  //     return;
  //   }
  //   console.log('Creating subfolder in:', folderName);
  //   // 🟢 Case 2: Creating a subfolder
  //   const newFolderName = 'New Folder'; // you can replace with user input
  //   const success = await this.codeEditorService.createNewFolder(
  //     this.dataSource,
  //     folderName,
  //     newFolderName
  //   );

  //   if (success) {
  //     this.dataSource = [...this.dataSource]; // Refresh UI
  //     this.matsnackbar.open('New folder created successfully!', 'Close', {
  //       duration: 2000,
  //     });
  //   } else {
  //     this.matsnackbar.open('Failed to create folder.', 'Close', {
  //       duration: 2000,
  //     });
  //   }
  // }

  // finishEditingFolder(node: Folders) {
  //   if (!node.name || !node.name.trim()) {
  //     this.matsnackbar.open('Folder name cannot be empty.', 'Close', {
  //       duration: 2000,
  //     });
  //     // this.cancelEditing(node);
  //     return;
  //   }

  //   node.isEditing = false;
  //   this.dataSource = [...this.dataSource]; // Refresh UI
  //   this.matsnackbar.open(
  //     `Folder "${node.name}" created successfully.`,
  //     'Close',
  //     {
  //       duration: 2000,
  //     }
  //   );
  // }
  async finishEditingFolder(node: Folders) {
    node.isEditing = false;
    const folderName = this.codeEditorService.getfolder_name_selected();
    console.log('Selected folder name:', folderName);
    if (!folderName) {
      // 🟢 Case 1: Creating a new root folder
      const newFolderName = node.name; // or open a dialog for a custom name
      const created = await this.supabaseService.createFolder(
        newFolderName,
        null
      );
      if (created) {
        this.codeEditorService.createNewRootFolder(this.dataSource);
        this.dataSource = [...this.dataSource]; // refresh UI
        this.matsnackbar.open(
          'New root folder created successfully!',
          'Close',
          {
            duration: 2000,
          }
        );
      } else {
        this.matsnackbar.open('Failed to create root folder.', 'Close', {
          duration: 2000,
        });
      }

      return;
    }
    console.log('Creating subfolder in:', folderName);
    // 🟢 Case 2: Creating a subfolder
    const newFolderName = node.name; // you can replace with user input
    const success = await this.codeEditorService.finalizeNewFolder(
      this.dataSource,
      folderName,
      newFolderName
    );

    if (success) {
      this.dataSource = [...this.dataSource]; // Refresh UI
      this.matsnackbar.open('New folder created successfully!', 'Close', {
        duration: 2000,
      });
    } else {
      this.matsnackbar.open('Failed to create folder.', 'Close', {
        duration: 2000,
      });
    }
  }

  saveCurrentFile() {
    this.currentFile = this.codeEditorService.getcurrentFile();

    if (this.currentFile) {
      this.currentFile.content = this.code;
      this.matsnackbar.open(`Saved: ${this.currentFile.name}`, 'Close', {
        duration: 1500,
      });
    } else {
      this.matsnackbar.open('No file is open to save.', 'Close', {
        duration: 2000,
      });
    }
  }
  get mergedEditorOptions() {
    return {
      ...this.editorOptions,
      readOnly: !this.isEditorEnabled,
    };
  }
}
