import {
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ThemeChangeService } from '../../../theme-change.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { Folders } from './folders';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TerminalComponent } from './terminal/terminal.component';
import { FileSearchBarComponent } from './file-search-bar/file-search-bar.component';
import { CodeEditorSectionService } from './code-editor-section.service';
import { MatInputModule } from '@angular/material/input';
import { NoFileSelectedComponent } from './no-file-selected/no-file-selected.component';
import { SupabaseClientService } from '../../../supabase-client.service';
import { RapidApiService } from '../../../rapid-api.service';
import { CustomSnackBarService } from '../../../custom-snack-bar.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  private cdr = inject(ChangeDetectorRef);
  private foldername!: string;
  private parts!: string[];
  private rapidService = inject(RapidApiService);
  private output_code!: string | null;
  private customSnackBarService = inject(CustomSnackBarService);
  private breakpointObserver = inject(BreakpointObserver)
  isEditorEnabled: boolean = false;
  isMobile = false

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
  @ViewChild('sidenav') sidenav!: MatSidenav;
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
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
      
      // Auto-close sidenav when switching to mobile view
      if (this.isMobile && this.sidenav) {
        this.sidenav.close();
      } else if (!this.isMobile && this.sidenav) {
        this.sidenav.open();
      }
    });
  }

  async runCode() {
    console.log('Running code...');
    this.foldername = this.codeEditorService.getcurrentFile()?.name || '';
    this.parts = this.foldername.split('.');
    const extension =
      this.parts.length > 1 ? this.parts[this.parts.length - 1] : '';
    
    console.log('File extension:', extension);

    if (this.isBrowser) {
      if (extension == 'js') {
        const worker = new Worker(
          new URL('./code-editor-section.worker', import.meta.url)
        );
        worker.postMessage(this.code);
        worker.onmessage = ({ data }) => {
          if (data.success) {
            this.logs = data.logs;
          } else {
            // this.matsnackbar.open(`${data.error}`, 'Close', { duration: 2000 });
            this.customSnackBarService.open(`${data.error}`, `Close`, `error`);
            console.error('Error:', data.error);
          }
        };
      }
       else if (extension == 'ts') {
        try {
          const ts = await import('typescript');

          const transpiled = ts.transpileModule(this.code, {
            compilerOptions: {
              module: ts.ModuleKind.ESNext,
              target: ts.ScriptTarget.ES2020,
            },
            reportDiagnostics: true,
          });

          if (transpiled.diagnostics?.length) {
            const formatted = ts.formatDiagnosticsWithColorAndContext(
              transpiled.diagnostics,
              {
                getCanonicalFileName: (f) => f,
                getCurrentDirectory: () => '',
                getNewLine: () => '\n',
              }
            );

            this.customSnackBarService.open(
              'TypeScript errors detected',
              'Close',
              'error'
            );
            console.error(formatted);
            return;
          }

          // Run generated JS in worker
          const worker = new Worker(
            new URL('./code-editor-section.worker', import.meta.url)
          );

          worker.postMessage(transpiled.outputText);

          worker.onmessage = ({ data }) => {
            if (data.success) {
              this.logs = data.logs;
            } else {
              this.customSnackBarService.open(data.error, 'Close', 'error');
            }
          };
        } catch (err: any) {
          console.error('TypeScript transpilation or execution failed:', err);
          this.matsnackbar.open(
            `TypeScript error: ${err.message || err}`,
            'Close',
            { duration: 2000 }
          );
        }
      } 
      
      else if (['py', 'rs', 'c', 'java', 'cs', 'cpp', 'cc', 'cxx'].includes(extension)) {
        try {
          console.log('Attempting API call for:', extension)
          let result;
          
          if (extension === 'py') {
            result = await this.rapidService.runPython(this.code);
          } else if (extension === 'rs') {
            result = await this.rapidService.runRust(this.code);
          } else if (extension === 'c') {
            result = await this.rapidService.runC(this.code);
          }else if (extension === 'java') {
            result = await this.rapidService.runJava(this.code);
          } else if (extension === 'cs') {
            result = await this.rapidService.runCSharp(this.code);
          }
           else {
            result = await this.rapidService.runCpp(this.code);
          }

          console.log('Execution Result:', result);
          
          this.output_code = result.stdout;

          // if (this.output_code && this.output_code.trim() !== '') {
          //   this.logs = this.output_code.trim().split('\n');
          // } else {
          //   this.logs = ['Execution finished with no output.'];
          // }
          if (result.compile_output) {
            this.logs = result.compile_output.trim().split('\n');
          } 
          // 2. Check for Runtime Errors (common in Python)
          else if (result.stderr) {
            this.logs = result.stderr.trim().split('\n');
          } 
          // 3. Check for Standard Output
          else if (result.stdout) {
            this.logs = result.stdout.trim().split('\n');
          } 
          // 4. Fallback if code ran but produced nothing
          else {
            this.logs = [`Status: ${result.status?.description || 'Execution finished with no output.'}`];
          }
        } catch (error) {
          console.error('API Error:', error);
          this.customSnackBarService.open('Failed to run code via API', 'Close', 'error');
        }
      }
    } else {
      this.matsnackbar.open(
        `Extension .${extension} not supported`, 
        'Close',
         { duration: 2000 });
    }
    console.log('Run code function completed.');
  }

  openFile(node: Folders) {
    if (node.type === 'file') {
      this.codeEditorService.setcurrentFile(node);
      this.code = node.content || ''; // Load content into Monaco editor
      this.isEditorEnabled = true; // ✅ enable editor
      this.matsnackbar.open(`Opened file: ${node.name}`, 'Close', {
        duration: 2000,
      });
      if (this.isMobile) {
        this.sidenav.close();
      }
    }
  }

  resetCode() {
    this.currentFile = this.codeEditorService.getcurrentFile();

    if (this.currentFile) {
      this.code = '';
      this.currentFile.content = '';
      this.saveCurrentFile();
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
      this.matsnackbar.open(`Closed folder: ${node.name}`, 'Close', {
        duration: 2000,
      });
    } else {
      // This means the node is about to open
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
  

  async finishEditing(node: Folders) {
    // Prevent double-clicks or race conditions
    if (this.editingInProgress) return;
    this.editingInProgress = true;

    // Validate name
    if (!node.name || !node.name.trim()) {
      this.matsnackbar.open('File name cannot be empty.', 'Close', {
        duration: 2000,
      });
      this.editingInProgress = false;
      return;
    }

    // Extract file name and extension
    const lastDotIndex = node.name.lastIndexOf('.');
    const fileNameWithoutExt =
      lastDotIndex !== -1 ? node.name.slice(0, lastDotIndex) : node.name;
    const fileType =
      lastDotIndex !== -1 ? node.name.slice(lastDotIndex + 1) : 'txt';

    try {
      //  Await the async Supabase call
      const success = await this.codeEditorService.finalizeNewFile(
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

        // Refresh the dataSource to update your file tree
        this.dataSource = [...this.dataSource];
      } else {
        this.matsnackbar.open(
          'Failed to create file. Please select a valid folder.',
          'Close',
          { duration: 2000 }
        );
      }
    } catch (error) {
      console.error('Error during file creation:', error);
      this.matsnackbar.open(
        'An unexpected error occurred while creating the file.',
        'Close',
        { duration: 2000 }
      );
    } finally {
      // Allow editing again after a short delay
      setTimeout(() => (this.editingInProgress = false), 100);
    }
  }

  async delete_file(node: Folders) {
    const folderName = this.codeEditorService.getfolder_name_selected();

    try {
      const deleted = await this.codeEditorService.deleteFile(
        this.dataSource, // Root folder data
        folderName, // Parent folder name
        node.name // File name to delete
      );

      if (deleted) {
        console.log(`✅ File '${node.name}' deleted successfully!`);
        this.matsnackbar.open(
          `File '${node.name}' deleted successfully!`,
          'Close',
          { duration: 2000 }
        );
        // Refresh UI after deletion
        this.dataSource = [...this.dataSource];
      } else {
        console.warn(`⚠️ File '${node.name}' could not be deleted.`);
        this.matsnackbar.open(
          `Failed to delete file '${node.name}'.`,
          'Close',
          { duration: 2000 }
        );
      }
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      this.matsnackbar.open(
        `An error occurred while deleting file '${node.name}'.`,
        'Close',
        { duration: 2000 }
      );
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

  async finishEditingFolder(node: Folders) {
    node.isEditing = false;
    this.editingInProgress = false;
    this.cdr.detectChanges(); // 🔹 Forces UI refresh immediately

    const folderName = this.codeEditorService.getfolder_name_selected();

    if (!folderName) {
      const newFolderName = node.name;
      const created = await this.supabaseService.createFolder(
        newFolderName,
        null
      );
      if (created) {
        this.dataSource = [...this.dataSource];
        this.matsnackbar.open(
          'New root folder created successfully!',
          'Close',
          { duration: 2000 }
        );
      } else {
        this.matsnackbar.open('Failed to create root folder.', 'Close', {
          duration: 2000,
        });
      }
      return;
    }

    const newFolderName = node.name;
    const success = await this.codeEditorService.finalizeNewFolder(
      this.dataSource,
      folderName,
      newFolderName
    );

    if (success) {
      this.dataSource = [...this.dataSource];
      this.matsnackbar.open('New folder created successfully!', 'Close', {
        duration: 2000,
      });
    } else {
      this.matsnackbar.open('Failed to create folder.', 'Close', {
        duration: 2000,
      });
    }

    this.cdr.detectChanges(); // 🔹 Ensure view updates after async call too
  }

  async saveCurrentFile() {
    this.currentFile = this.codeEditorService.getcurrentFile();

    if (this.currentFile) {
      try {
        // Update local content
        this.currentFile.content = this.code;

        // Save to Supabase
        await this.supabaseService.updateFileContent(
          this.currentFile.name,
          this.code
        );

        // Notify success
        this.matsnackbar.open(`Saved: ${this.currentFile.name}`, 'Close', {
          duration: 1500,
        });
      } catch (error: any) {
        console.error('Error saving file:', error.message || error);
        this.matsnackbar.open(
          `Failed to save: ${this.currentFile.name}`,
          'Close',
          { duration: 2000 }
        );
      }
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

//  else if (extension == 'py') {
      //   this.rapidService
      //     .getInfo()
      //     .then((response) => {
      //       console.log('Rapid API response received in component:', response);
      //     })
      //     .catch((error) => {
      //       console.error('Error in Rapid API call:', error);
      //     });
      //   const result = this.rapidService.runPython(this.code);
      //   console.log('Output: ', result);
      //   console.log('output_code: ', (await result).stdout);
      //   this.output_code = (await result).stdout;

      //   if (this.output_code != null) {
      //     this.logs = [this.output_code];
      //     console.log('new log pushed: ', this.output_code);
      //   }
      // } else if (extension == 'rs') {
      //   const result = this.rapidService.runRust(this.code);
      //   console.log('Output: ', result);
      //   console.log('output_code: ', (await result).stdout);
      //   this.output_code = (await result).stdout;

      //   if (this.output_code != null) {
      //     this.logs = [this.output_code];
      //     console.log('new log pushed: ', this.output_code);
      //   }
      // }

      
      // else if (extension === 'c') {
      //   const result = this.rapidService.runC(this.code);
      //   this.output_code = (await result).stdout;
      //   this.logs = this.output_code ? [this.output_code] : [];
      // } else if (['cpp', 'cc', 'cxx'].includes(extension)) {
      //   const result = this.rapidService.runCpp(this.code);
      //   this.output_code = (await result).stdout;
      //   this.logs = this.output_code ? [this.output_code] : [];
      // } else {
      //   this.matsnackbar.open(
      //     `Running code for .${extension} files is not supported yet.`,
      //     'Close',
      //     { duration: 2000 }
      //   );
      //   return;
      // }