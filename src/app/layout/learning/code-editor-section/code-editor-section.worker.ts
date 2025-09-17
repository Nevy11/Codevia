/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  try {
    const result = eval(data);
    postMessage({ success: true, result });
  } catch (error: string | any) {
    postMessage({ success: false, error: error.toString() });
  }
});
