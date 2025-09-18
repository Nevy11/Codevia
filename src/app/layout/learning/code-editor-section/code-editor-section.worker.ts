/// <reference lib="webworker" />

import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

addEventListener('message', ({ data }) => {
  try {
    const code = data;

    // STEP 1: Parse the code into an AST
    const ast = acorn.parse(code, { ecmaVersion: 2020 });

    console.log('AST generated:', ast);

    // STEP 2: Detect unsafe patterns BEFORE running
    let isUnsafe = false;
    walk.simple(ast, {
      CallExpression(node: any) {
        if (node.callee.name === 'eval') {
          console.warn('⚠️ Unsafe code: eval() detected');
          isUnsafe = true;
        }
      },
      Identifier(node: any) {
        if (node.name === 'window' || node.name === 'document') {
          console.warn('⚠️ Unsafe access to global object:', node.name);
          isUnsafe = true;
        }
      },
    });

    if (isUnsafe) {
      throw new Error('Unsafe code detected. Execution aborted.');
    }

    // STEP 3: Capture logs
    const capturedLogs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        // Join multiple arguments into a single string like real console.log
        capturedLogs.push(args.map((arg) => String(arg)).join(' '));
      },
      error: (...args: any[]) => {
        capturedLogs.push(
          '[ERROR] ' + args.map((arg) => String(arg)).join(' ')
        );
      },
      warn: (...args: any[]) => {
        capturedLogs.push('[WARN] ' + args.map((arg) => String(arg)).join(' '));
      },
    };

    // STEP 4: Wrap the code to inject our custom console
    const wrappedCode = `
      (function(console) {
        ${code}
      })(customConsole);
    `;

    // STEP 5: Execute the code safely
    const finalFunction = new Function('customConsole', wrappedCode);
    finalFunction(customConsole);

    // STEP 6: Return logs as the final output
    postMessage({ success: true, output: capturedLogs });
  } catch (error: any) {
    postMessage({ success: false, error: error.toString() });
  }
});
