// Lazy-loaded Pyodide singleton for in-browser Python execution.
// Loaded from CDN on first use (~10-15 MB); cached for subsequent runs.

let pyodideInstance = null;
let loadingPromise = null;

export async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    // Inject the Pyodide script tag if it hasn't been loaded yet
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load Pyodide from CDN'));
        document.head.appendChild(script);
      });
    }

    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
    });

    return pyodideInstance;
  })();

  return loadingPromise;
}

/**
 * Run Python code and capture stdout/stderr.
 * Returns { stdout, stderr, error }.
 */
export async function runPython(code, timeoutMs = 15000) {
  const pyodide = await getPyodide();

  // Set up stdout/stderr capture
  pyodide.runPython(`
import sys as __sys, io as __io
__captured_out = __io.StringIO()
__captured_err = __io.StringIO()
__sys.stdout = __captured_out
__sys.stderr = __captured_err
`);

  let error = null;
  try {
    // Use runPythonAsync so the event loop can breathe
    await Promise.race([
      pyodide.runPythonAsync(code),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('⏱ Timeout: code took longer than 15 seconds (possible infinite loop).')), timeoutMs),
      ),
    ]);
  } catch (e) {
    error = e.message || String(e);
  }

  let stdout = '';
  let stderr = '';
  try {
    stdout = pyodide.runPython('__captured_out.getvalue()');
    stderr = pyodide.runPython('__captured_err.getvalue()');
  } catch (_) {
    // If we can't read output, leave empty
  }

  // Restore standard streams
  try {
    pyodide.runPython(`
__sys.stdout = __sys.__stdout__
__sys.stderr = __sys.__stderr__
`);
  } catch (_) {}

  return { stdout: stdout || '', stderr: stderr || '', error };
}

/**
 * Run user code + test code and parse the __TEST_RESULTS__ JSON from stdout.
 * Returns { results: [{name, passed, expected?, actual?, error?}], stdout, error }.
 */
export async function runTests(userCode, testCode) {
  const fullCode = userCode + '\n\n' + testCode;
  const { stdout, stderr, error } = await runPython(fullCode);

  let results = null;
  const marker = '__TEST_RESULTS__';
  const idx = stdout.indexOf(marker);
  if (idx !== -1) {
    try {
      results = JSON.parse(stdout.slice(idx + marker.length).trim());
    } catch (_) {
      // Couldn't parse results
    }
  }

  // Strip the test results line from the displayed stdout
  const cleanStdout = idx !== -1 ? stdout.slice(0, idx).trimEnd() : stdout;

  return { results, stdout: cleanStdout, stderr, error };
}
