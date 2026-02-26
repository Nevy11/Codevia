import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Judge0SubmissionResponse } from './init-screen/judge0-submission-response';
import { rapidOutput } from './layout/learning/code-editor-section/code-editor-section';

@Injectable({
  providedIn: 'root',
})
export class RapidApiService {
  private url = 'https://judge0-ce.p.rapidapi.com/about';
  private baseUrl = 'https://judge0-ce.p.rapidapi.com';
  private headers = new HttpHeaders({
    'content-type': 'application/json',
    'x-rapidapi-key': 'f5878b00camsh889c64ea4495833p114649jsn6c414fa3cef7',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
  });

  constructor(private http: HttpClient) {}
  async getInfo(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.get(this.url, { headers: this.headers })
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  //  Submit Python code for execution
  async runPython(code: string, input: string = ''): Promise<rapidOutput> {
    console.log('SERVICE: runPython started');
    try {
      // Step 1: Submit code
      const submission = await firstValueFrom(
        this.http.post<Judge0SubmissionResponse>(
          `${this.baseUrl}/submissions?base64_encoded=false&wait=false`,
          {
            source_code: code,
            language_id: 71, // Python 3
            stdin: input,
          },
          { headers: this.headers }
        )
      );

      const token = submission['token'];
      console.log('Submission token:', token);

      // Step 2: Wait a bit and fetch results
      await new Promise((r) => setTimeout(r, 2000));

      const result = await firstValueFrom(
        this.http.get<rapidOutput>(`${this.baseUrl}/submissions/${token}`, {
          headers: this.headers,
        })
      );

      console.log('Execution result:', result);
      return result;
    } catch (error) {
      console.error('Error executing code:', error);
      throw error;
    }
  }
  // Submit Rust code for execution
  async runRust(code: string, input: string = ''): Promise<rapidOutput> {
    try {
      // Step 1: Submit code
      const submission = await firstValueFrom(
        this.http.post<Judge0SubmissionResponse>(
          `${this.baseUrl}/submissions?base64_encoded=false&wait=false`,
          {
            source_code: code,
            language_id: 73, // 🦀 Rust
            stdin: input,
          },
          { headers: this.headers }
        )
      );

      const token = submission['token'];
      console.log('Rust submission token:', token);

      // Step 2: Wait briefly before fetching results
      await new Promise((r) => setTimeout(r, 2000));

      const result = await firstValueFrom(
        this.http.get<rapidOutput>(`${this.baseUrl}/submissions/${token}`, {
          headers: this.headers,
        })
      );

      console.log('Rust execution result:', result);
      return result;
    } catch (error) {
      console.error('Error executing Rust code:', error);
      throw error;
    }
  }

  // 🇨 Submit C code for execution
  async runC(code: string, input: string = ''): Promise<rapidOutput> {
    try {
      const submission = await firstValueFrom(
        this.http.post<Judge0SubmissionResponse>(
          `${this.baseUrl}/submissions?base64_encoded=false&wait=false`,
          {
            source_code: code,
            language_id: 50, // 🇨 C (GCC)
            stdin: input,
          },
          { headers: this.headers }
        )
      );

      const token = submission.token;
      console.log('C submission token:', token);

      await new Promise((r) => setTimeout(r, 2000));

      const result = await firstValueFrom(
        this.http.get<rapidOutput>(`${this.baseUrl}/submissions/${token}`, {
          headers: this.headers,
        })
      );

      console.log('C execution result:', result);
      return result;
    } catch (error) {
      console.error('Error executing C code:', error);
      throw error;
    }
  }
  // 🇨➕➕ Submit C++ code for execution
  async runCpp(code: string, input: string = ''): Promise<rapidOutput> {
    try {
      const submission = await firstValueFrom(
        this.http.post<Judge0SubmissionResponse>(
          `${this.baseUrl}/submissions?base64_encoded=false&wait=false`,
          {
            source_code: code,
            language_id: 54, // 🇨➕➕ C++ (G++ 17)
            stdin: input,
          },
          { headers: this.headers }
        )
      );

      const token = submission.token;
      console.log('C++ submission token:', token);

      await new Promise((r) => setTimeout(r, 2000));

      const result = await firstValueFrom(
        this.http.get<rapidOutput>(`${this.baseUrl}/submissions/${token}`, {
          headers: this.headers,
        })
      );

      console.log('C++ execution result:', result);
      return result;
    } catch (error) {
      console.error('Error executing C++ code:', error);
      throw error;
    }
  }
  async runJava(code: string, input: string = ''): Promise<rapidOutput> {
  try {
    // 1. Encode source code and stdin to Base64
    const encodedCode = btoa(code);
    const encodedInput = btoa(input);

    // 2. Set base64_encoded=true in the URL
    const submission = await firstValueFrom(
      this.http.post<Judge0SubmissionResponse>(
        `${this.baseUrl}/submissions?base64_encoded=true&wait=false`,
        {
          source_code: encodedCode,
          language_id: 62, 
          stdin: encodedInput,
        },
        { headers: this.headers }
      )
    );

    const token = submission.token;
    await new Promise((r) => setTimeout(r, 2000));

    // 3. Fetch the result (still using base64_encoded=true)
    const result = await firstValueFrom(
      this.http.get<rapidOutput>(`${this.baseUrl}/submissions/${token}?base64_encoded=true`, {
        headers: this.headers,
      })
    );

    // 4. Decode the results before returning
    return {
      ...result,
      stdout: result.stdout ? atob(result.stdout) : null,
      stderr: result.stderr ? atob(result.stderr) : null,
      compile_output: result.compile_output ? atob(result.compile_output) : null,
    };
  } catch (error) {
    console.error('Error executing Java code:', error);
    throw error;
  }
}

  async runCSharp(code: string, input: string = ''): Promise<rapidOutput> {
    try {
      const submission = await firstValueFrom(
        this.http.post<Judge0SubmissionResponse>(
          `${this.baseUrl}/submissions?base64_encoded=false&wait=false`,
          {
            source_code: code,
            language_id: 51, // 🎯 C# (Mono 6.6.0.161)
            stdin: input,
          },
          { headers: this.headers }
        )
      );

      const token = submission.token;
      await new Promise((r) => setTimeout(r, 2000));

      return await firstValueFrom(
        this.http.get<rapidOutput>(`${this.baseUrl}/submissions/${token}`, {
          headers: this.headers,
        })
      );
    } catch (error) {
      console.error('Error executing C# code:', error);
      throw error;
    }
  }
}
