// import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
// import { ThemeChangeService } from '../../../theme-change.service';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { isPlatformBrowser } from '@angular/common';

// @Component({
//   selector: 'nevy11-code-editor-section',
//   imports: [
//     FormsModule,
//     MonacoEditorModule,
//     MatButtonModule,
//     MatSnackBarModule,
//   ],
//   templateUrl: './code-editor-section.component.html',
//   styleUrl: './code-editor-section.component.scss',
// })
// export class CodeEditorSectionComponent implements OnInit {
//   isBrowser = false;
//   code: string = `// Write your code here`;
//   themechangeService = inject(ThemeChangeService);
//   matsnackbar = inject(MatSnackBar);
//   editorOptions = {
//     theme: 'vs-dark',
//     language: 'javascript',
//     automaticLayout: true,
//   };
//   themeSub: any;
//   constructor(@Inject(PLATFORM_ID) platformId: Object) {
//     this.isBrowser = isPlatformBrowser(platformId);
//   }
//   ngOnInit() {
//     this.themechangeService.loadTheme();
//     this.themeSub = this.themechangeService.theme$.subscribe((theme) => {
//       this.editorOptions = {
//         ...this.editorOptions,
//         theme: theme === 'dark' ? 'vs-dark' : 'vs-light',
//       };
//     });
//   }
//   runCode() {
//     this.matsnackbar.open('Code executed successfully!', 'Close', {
//       duration: 2000,
//     });
//   }
//   resetCode() {
//     this.code = `// Write your code here`;
//   }
//   downloadCode() {
//     this.matsnackbar.open('Code downloaded successfully!', 'Close', {
//       duration: 2000,
//     });
//   }
// }
import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ThemeChangeService } from '../../../theme-change.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

interface FileNode {
  name: string;
  children?: FileNode[];
}

const TREE_DATA: FileNode[] = [
  {
    name: 'src',
    children: [
      { name: 'app.component.ts' },
      { name: 'app.component.html' },
      { name: 'app.component.scss' },
    ],
  },
  {
    name: 'assets',
    children: [{ name: 'logo.png' }],
  },
];

@Component({
  selector: 'nevy11-code-editor-section',
  imports: [
    FormsModule,
    MonacoEditorModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTreeModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  templateUrl: './code-editor-section.component.html',
  styleUrl: './code-editor-section.component.scss',
})
export class CodeEditorSectionComponent implements OnInit {
  isBrowser = false;
  code: string = `// Write your code here`;
  themechangeService = inject(ThemeChangeService);
  matsnackbar = inject(MatSnackBar);

  // Monaco editor config
  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
  };

  // File explorer tree
  // File explorer tree
  treeControl = new NestedTreeControl<FileNode>((node) => node.children ?? []);

  dataSource = new MatTreeNestedDataSource<FileNode>();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.dataSource.data = TREE_DATA;
  }

  themeSub: any;

  ngOnInit() {
    this.themechangeService.loadTheme();
    this.themeSub = this.themechangeService.theme$.subscribe((theme) => {
      this.editorOptions = {
        ...this.editorOptions,
        theme: theme === 'dark' ? 'vs-dark' : 'vs-light',
      };
    });
  }

  hasChild = (_: number, node: FileNode) =>
    !!node.children && node.children.length > 0;

  // Button actions
  runCode() {
    this.matsnackbar.open('Code executed successfully!', 'Close', {
      duration: 2000,
    });
  }

  resetCode() {
    this.code = `// Write your code here`;
  }

  downloadCode() {
    this.matsnackbar.open('Code downloaded successfully!', 'Close', {
      duration: 2000,
    });
  }

  // When clicking a file, load its "content" into Monaco
  openFile(node: FileNode) {
    if (!node.children) {
      this.code = `// Opened file: ${node.name}\n\n// Start coding here...`;
    }
  }
}
