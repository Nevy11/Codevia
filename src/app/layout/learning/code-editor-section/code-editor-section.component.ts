import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ThemeChangeService } from '../../../theme-change.service';

@Component({
  selector: 'nevy11-code-editor-section',
  imports: [FormsModule, MonacoEditorModule],
  templateUrl: './code-editor-section.component.html',
  styleUrl: './code-editor-section.component.scss',
})
export class CodeEditorSectionComponent implements OnInit {
  code: string = `// Write your code here`;
  themechangeService = inject(ThemeChangeService);

  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
  };
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
}
