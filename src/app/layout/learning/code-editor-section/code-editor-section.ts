export interface CodeEditorSection {}

export interface rapidOutput {
  stdout: null | string;
  time: string;
  memory: number;
  stderr: null | string;
  token: string;
  status: {
    description: string;
    id: number;
  };
  compile_output: null | string;
}
