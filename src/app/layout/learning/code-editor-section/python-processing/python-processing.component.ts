import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nevy11-python-processing',
  imports: [],
  templateUrl: './python-processing.component.html',
  styleUrl: './python-processing.component.scss',
})
export class PythonProcessingComponent implements OnInit {
  result!: string;

  async ngOnInit() {
    console.log('PythonProcessingComponent initialized');
  }
}
