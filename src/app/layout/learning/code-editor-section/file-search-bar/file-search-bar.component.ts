import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CodeEditorSectionService } from '../code-editor-section.service';
import { Folders } from '../folders';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nevy11-file-search-bar',
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatListModule,
    CommonModule,
  ],
  templateUrl: './file-search-bar.component.html',
  styleUrl: './file-search-bar.component.scss',
})
export class FileSearchBarComponent implements OnInit {
  searchQuery: string = '';
  foundResults: any[] = [];

  private codeEditorService = inject(CodeEditorSectionService);

  data = this.codeEditorService.get_initial_data();

  ngOnInit(): void {}

  onSearch() {
    console.log('Search term:', this.searchQuery);

    // Call your service function to search
    const result = this.codeEditorService.findFolderOrFile(
      this.data,
      this.searchQuery
    );

    console.log('Found:', result);

    // If the service returns a single object, wrap it in an array
    this.foundResults = result ? [result] : [];

    if (result) {
      this.codeEditorService.setSearchResults(this.foundResults.length);
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.foundResults = [];
  }

  selectResult(result: any) {
    console.log('Selected file:', result);
    // Optional: do something when a file is selected
  }
}
