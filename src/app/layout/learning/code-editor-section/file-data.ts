// File data interface for specific file details
export interface FileData {
  folder_name: string;
  file_name: string;
  file_type: string;
  lines: string[];
  children?: any[];
}
