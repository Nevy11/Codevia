/// <reference lib="webworker" />

import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

addEventListener('message', ({ data }) => {
  try {
    const code = data;

    // STEP 1: Parse the code into an AST
    const ast = acorn.parse(code, { ecmaVersion: 2020 });

    console.log('AST generated:', ast);

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

    // STEP 3: Capture logs like a custom console
    const capturedLogs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
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

    // STEP 4: Wrap code to inject custom console and capture the last result
    const wrappedCode = `
      (function(console) {
        ${code}
      })(customConsole);
    `;

    // STEP 5: Execute user code
    let finalResult: any;
    try {
      finalResult = new Function('customConsole', wrappedCode)(customConsole);
    } catch (err: any) {
      capturedLogs.push('[RUNTIME ERROR] ' + err.toString());
      throw err;
    }

    // STEP 6: Return logs + last evaluated result
    postMessage({
      success: true,
      logs: capturedLogs,
      result: finalResult !== undefined ? finalResult : null,
    });
  } catch (error: any) {
    postMessage({ success: false, error: error.toString() });
  }
});
