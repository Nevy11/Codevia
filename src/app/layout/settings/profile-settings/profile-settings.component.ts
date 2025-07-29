import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'nevy11-profile-settings',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
})
export class ProfileSettingsComponent implements OnInit {
  isEditing = false;

  name = '';
  email = '';
  bio = '';
  avatarUrl = '/about/laptop.jpg';
  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.name = localStorage.getItem('profile_name') || '';
    this.email = localStorage.getItem('profile_email') || '';
    this.bio = localStorage.getItem('profile_bio') || '';
    this.avatarUrl =
      localStorage.getItem('profile_avatar') || '/about/laptop.jpg';
  }

  saveProfile() {
    localStorage.setItem('profile_name', this.name);
    localStorage.setItem('profile_email', this.email);
    localStorage.setItem('profile_bio', this.bio);
    localStorage.setItem('profile_avatar', this.avatarUrl);
  }
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  cancelEdit() {
    this.loadProfile(); // reload old values
    this.isEditing = false;
  }
}
