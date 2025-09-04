import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PythonRunnerService {
  private wasm: any;

  private async initWasm() {
    if (!this.wasm) {
      // Import WASM loader from assets
      const wasmModule = await import(
        '/media/nevy11/work/projects/ELearningProject/day8/Codevia/public/wasm/wasm_rust.js'
      );
      this.wasm = await wasmModule.default();
    }
  }

  // Function to send Python code to Rust and get back a response
  async sendPythonCode(code: string): Promise<string> {
    await this.initWasm();
    return this.wasm.run_python_from_angular(code);
  }
}
