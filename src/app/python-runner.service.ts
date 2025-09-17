import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class PythonRunnerService {
  private wasm: any;

  private async initWasm() {
    if (!this.wasm) {
      // Import the WASM loader from the public folder
      // const wasmModule = await import('../../public/wasm/wasm_rust');

      // const wasmModule = await import(
      // new URL('/wasm/wasm_rust.js', window.location.origin).toString()

      // );

      const wasmModule = await import(
        /* @vite-ignore */ '../../public/wasm/wasm_rust.js'
      );

      this.wasm = await wasmModule.default();
    }
  }

  // Function to send Python code to Rust and get back a response
  async sendPythonCode(code: string): Promise<string> {
    await this.initWasm();

    if (!this.wasm || !this.wasm.run_python_from_angular) {
      throw new Error('WASM module not properly initialized');
    }

    return this.wasm.run_python_from_angular(code);
  }
}
