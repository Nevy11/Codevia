import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CodeEditorSectionService } from '../code-editor-section.service';
import { Folders } from '../folders';

@Component({
  selector: 'nevy11-file-search-bar',
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './file-search-bar.component.html',
  styleUrl: './file-search-bar.component.scss',
})
export class FileSearchBarComponent implements OnInit {
  searchQuery: string = '';
  found!: any;
  private codeEditorService = inject(CodeEditorSectionService);

  data = this.codeEditorService.get_initial_data();
  ngOnInit(): void {
    console.log('Input data:', this.data);
  }
  onSearch() {
    console.log('Search term:', this.searchQuery);
    this.found = this.codeEditorService.findFolder(this.data, this.searchQuery);
    console.log('Found:', this.found);
  }

  clearSearch() {
    this.searchQuery = '';
  }
}
