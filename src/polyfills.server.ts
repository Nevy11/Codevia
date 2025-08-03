// Fix for libraries expecting Node's global in an Edge runtime
(globalThis as any).global = globalThis;
