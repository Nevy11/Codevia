/// <reference lib="webworker" />

import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

addEventListener('message', ({ data }) => {
  try {
    const result = eval(data);
    const code = 'let x = 10 + 20;';
    const ast = acorn.parse(code, { ecmaVersion: 2020 });
    console.log(ast);

    walk.simple(ast, {
      VariableDeclaration(node) {
        console.log('Variable declaration:', node);
      },
      BinaryExpression(node) {
        console.log('Binary expression:', node);
      },
    });

    //  finding unsafe
    walk.simple(ast, {
      CallExpression(node: any) {
        if (node.callee.name === 'eval') {
          console.warn('⚠️ Unsafe code: eval() detected');
        }
      },
    });

    postMessage({ success: true, result });
  } catch (error: string | any) {
    postMessage({ success: false, error: error.toString() });
  }
});
