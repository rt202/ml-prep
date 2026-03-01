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

  return parseTestResults(stdout, stderr, error);
}

/**
 * Run a SQL query against an in-memory SQLite database seeded with setupSql.
 * Prints results as a formatted ASCII table.
 */
export async function runSql(userSql, setupSql) {
  const code = `
import sqlite3

_conn = sqlite3.connect(':memory:')
_cur = _conn.cursor()
try:
    _cur.executescript(${JSON.stringify(setupSql)})
    _conn.commit()
except Exception as e:
    print(f"Setup Error: {e}")
    _conn.close()
    raise

try:
    _cur.execute(${JSON.stringify(userSql)})
    _rows = _cur.fetchall()
    _cols = [desc[0] for desc in _cur.description] if _cur.description else []
    if _cols and _rows:
        _widths = []
        for i, col in enumerate(_cols):
            max_data = max((len(str(row[i])) for row in _rows), default=0)
            _widths.append(max(len(str(col)), max_data))
        print(' | '.join(str(c).ljust(w) for c, w in zip(_cols, _widths)))
        print('-+-'.join('-' * w for w in _widths))
        for _row in _rows:
            print(' | '.join(str(v).ljust(w) for v, w in zip(_row, _widths)))
        print(f"\\n({len(_rows)} row{'s' if len(_rows) != 1 else ''})")
    elif _cols:
        print(' | '.join(_cols))
        print('(0 rows)')
    else:
        print("Query executed successfully (no result set returned)")
except Exception as e:
    print(f"SQL Error: {e}")
finally:
    _conn.close()
`;
  return await runPython(code);
}

/**
 * Grade a SQL query. Sets up user_sql as a Python string and a _setup_db()
 * helper, then runs the Python testCode which uses them.
 */
export async function runSqlTests(userSql, setupSql, testCode) {
  const preamble = [
    'import sqlite3, json',
    '',
    `user_sql = ${JSON.stringify(userSql)}`,
    '',
    'def _setup_db():',
    '    conn = sqlite3.connect(":memory:")',
    '    cur = conn.cursor()',
    `    cur.executescript(${JSON.stringify(setupSql)})`,
    '    conn.commit()',
    '    return conn',
    '',
  ].join('\n');

  const fullCode = preamble + '\n' + testCode;
  const { stdout, stderr, error } = await runPython(fullCode);

  return parseTestResults(stdout, stderr, error);
}

/** Shared helper to extract __TEST_RESULTS__ JSON from stdout. */
function parseTestResults(stdout, stderr, error) {
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

  const cleanStdout = idx !== -1 ? stdout.slice(0, idx).trimEnd() : stdout;

  return { results, stdout: cleanStdout, stderr, error };
}
