export interface FileData {
  user_id: string;
  folder_name: string;
  file_name: string;
  file_type: string;
  lines: string[];
  children?: any[];
}
