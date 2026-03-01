// Coding challenges — 1-3 per unit where coding practice is relevant.
// Each challenge runs in Pyodide (in-browser Python) so only pure-Python is used.
// Test code is appended after the user's code and prints __TEST_RESULTS__<json>.

export const codingQuestions = [
  // ─── Unit 1: Python Fundamentals ──────────────────────────────────────────
  {
    id: 'py-flatten-list',
    unitId: 'python-fundamentals',
    title: 'Flatten a Nested List',
    description:
      'Implement a function that recursively flattens an arbitrarily nested list into a single flat list.',
    difficulty: 'easy',
    starterCode: `def flatten(nested_list):
    """Flatten a nested list into a single list.

    Examples:
        flatten([1, [2, 3], [4, [5, 6]]]) -> [1, 2, 3, 4, 5, 6]
        flatten([[1], [[2]], [[[3]]]]) -> [1, 2, 3]
    """
    result = []
    for item in nested_list:
        # TODO: check if item is a list and handle accordingly
        pass
    return result
`,
    solutionCode: `def flatten(nested_list):
    result = []
    for item in nested_list:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result
`,
    hints: [
      'Use isinstance(item, list) to check if an element is itself a list.',
      'If the item IS a list, recursively call flatten() on it and extend the result.',
      'If the item is NOT a list, simply append it to result.',
    ],
    testCode: `import json
results = []
try:
    r = flatten([1, [2, 3], [4, [5, 6]]])
    results.append({"name": "Basic nested list", "passed": r == [1, 2, 3, 4, 5, 6], "expected": "[1, 2, 3, 4, 5, 6]", "actual": str(r)})
    r = flatten([])
    results.append({"name": "Empty list", "passed": r == [], "expected": "[]", "actual": str(r)})
    r = flatten([1, 2, 3])
    results.append({"name": "Already flat", "passed": r == [1, 2, 3], "expected": "[1, 2, 3]", "actual": str(r)})
    r = flatten([[[[1]]]])
    results.append({"name": "Deeply nested", "passed": r == [1], "expected": "[1]", "actual": str(r)})
    r = flatten([1, [2, [3, [4, [5]]]]])
    results.append({"name": "Progressive nesting", "passed": r == [1, 2, 3, 4, 5], "expected": "[1, 2, 3, 4, 5]", "actual": str(r)})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },
  {
    id: 'py-memoize-decorator',
    unitId: 'python-fundamentals',
    title: 'Build a Memoization Decorator',
    description:
      'Create a decorator called `memoize` that caches the results of a function based on its arguments, so repeated calls with the same arguments return instantly.',
    difficulty: 'medium',
    starterCode: `def memoize(func):
    """Decorator that caches function results.

    Usage:
        @memoize
        def expensive(n):
            return n * n

        expensive(5)  # computes
        expensive(5)  # returns cached result
    """
    # TODO: create a cache dictionary and a wrapper function
    pass
`,
    solutionCode: `def memoize(func):
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper
`,
    hints: [
      'Create a dictionary called cache inside the decorator (before the wrapper).',
      'The wrapper function should check if args is already a key in cache.',
      'Use *args to accept any positional arguments; tuples are hashable so they work as dict keys.',
    ],
    testCode: `import json
results = []
try:
    call_count = 0
    @memoize
    def square(n):
        global call_count
        call_count += 1
        return n * n
    r1 = square(4)
    results.append({"name": "square(4) == 16", "passed": r1 == 16, "expected": "16", "actual": str(r1)})
    r2 = square(4)
    results.append({"name": "Cached (called once)", "passed": call_count == 1, "expected": "1 call", "actual": str(call_count) + " calls"})
    r3 = square(5)
    results.append({"name": "square(5) == 25", "passed": r3 == 25, "expected": "25", "actual": str(r3)})
    results.append({"name": "Two distinct calls", "passed": call_count == 2, "expected": "2 calls", "actual": str(call_count) + " calls"})

    @memoize
    def add(a, b):
        return a + b
    results.append({"name": "Multi-arg add(2,3)==5", "passed": add(2,3) == 5, "expected": "5", "actual": str(add(2,3))})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Unit 2: Probability & Statistics ─────────────────────────────────────
  {
    id: 'stats-descriptive',
    unitId: 'probability-statistics',
    title: 'Descriptive Statistics from Scratch',
    description:
      'Implement functions to calculate the mean, variance, and standard deviation of a list of numbers without using any libraries.',
    difficulty: 'easy',
    starterCode: `def mean(data):
    """Return the arithmetic mean of data."""
    # TODO: sum all values and divide by count
    pass

def variance(data):
    """Return the population variance of data."""
    # TODO: compute mean, then average of squared differences
    pass

def std_dev(data):
    """Return the population standard deviation of data."""
    # TODO: square root of variance
    pass
`,
    solutionCode: `def mean(data):
    return sum(data) / len(data)

def variance(data):
    m = mean(data)
    return sum((x - m) ** 2 for x in data) / len(data)

def std_dev(data):
    return variance(data) ** 0.5
`,
    hints: [
      'Mean is simply sum(data) / len(data).',
      'Variance: first compute the mean, then for each value compute (x - mean)², then average those squared differences.',
      'Standard deviation is just the square root of variance: variance ** 0.5.',
    ],
    testCode: `import json
results = []
try:
    data = [2, 4, 4, 4, 5, 5, 7, 9]
    m = mean(data)
    results.append({"name": "mean([2,4,4,4,5,5,7,9])==5.0", "passed": m == 5.0, "expected": "5.0", "actual": str(m)})
    v = variance(data)
    results.append({"name": "variance == 4.0", "passed": v == 4.0, "expected": "4.0", "actual": str(v)})
    s = std_dev(data)
    results.append({"name": "std_dev == 2.0", "passed": s == 2.0, "expected": "2.0", "actual": str(s)})
    results.append({"name": "mean([10]) == 10", "passed": mean([10]) == 10, "expected": "10", "actual": str(mean([10]))})
    results.append({"name": "variance([5,5,5]) == 0", "passed": variance([5,5,5]) == 0.0, "expected": "0.0", "actual": str(variance([5,5,5]))})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },
  {
    id: 'stats-bayes',
    unitId: 'probability-statistics',
    title: "Bayes' Theorem Calculator",
    description:
      "Implement Bayes' theorem: given P(A), P(B|A), and P(B), compute P(A|B). Then implement a function that computes the posterior for a disease test scenario.",
    difficulty: 'medium',
    starterCode: `def bayes(p_a, p_b_given_a, p_b):
    """Apply Bayes' theorem to compute P(A|B).

    P(A|B) = P(B|A) * P(A) / P(B)
    """
    # TODO: implement
    pass

def disease_test_posterior(prevalence, sensitivity, specificity):
    """Given a positive test result, what is the probability of having the disease?

    Args:
        prevalence:   P(disease) — e.g. 0.01 for 1%
        sensitivity:  P(positive | disease) — true positive rate
        specificity:  P(negative | no disease) — true negative rate

    Returns:
        P(disease | positive test)
    """
    # TODO: compute P(positive) first, then apply Bayes
    pass
`,
    solutionCode: `def bayes(p_a, p_b_given_a, p_b):
    return (p_b_given_a * p_a) / p_b

def disease_test_posterior(prevalence, sensitivity, specificity):
    p_disease = prevalence
    p_pos_given_disease = sensitivity
    p_pos_given_no_disease = 1 - specificity
    p_positive = (p_pos_given_disease * p_disease) + (p_pos_given_no_disease * (1 - p_disease))
    return bayes(p_disease, p_pos_given_disease, p_positive)
`,
    hints: [
      "Bayes' formula is straightforward: P(A|B) = P(B|A) × P(A) / P(B).",
      'For the disease test: P(positive) = P(pos|disease)×P(disease) + P(pos|no disease)×P(no disease).',
      'P(pos|no disease) is the false positive rate = 1 − specificity.',
    ],
    testCode: `import json
results = []
try:
    r = bayes(0.01, 0.9, 0.059)
    results.append({"name": "Basic Bayes", "passed": abs(r - 0.15254237288135594) < 1e-6, "expected": "~0.1525", "actual": f"{r:.6f}"})
    r = bayes(0.5, 0.5, 0.5)
    results.append({"name": "Equal priors", "passed": abs(r - 0.5) < 1e-6, "expected": "0.5", "actual": f"{r:.6f}"})
    r = disease_test_posterior(0.01, 0.99, 0.99)
    results.append({"name": "Disease test (1% prevalence, 99% sens/spec)", "passed": abs(r - 0.5) < 0.01, "expected": "~0.50", "actual": f"{r:.4f}"})
    r = disease_test_posterior(0.001, 0.95, 0.95)
    results.append({"name": "Rare disease", "passed": abs(r - 0.01866) < 0.001, "expected": "~0.0187", "actual": f"{r:.4f}"})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Unit 3: Linear Algebra & Calculus ────────────────────────────────────
  {
    id: 'linalg-matmul',
    unitId: 'math-foundations',
    title: 'Matrix Multiplication from Scratch',
    description:
      'Implement matrix multiplication for two 2-D lists (matrices). Validate dimensions and compute the dot product of rows and columns.',
    difficulty: 'medium',
    starterCode: `def matmul(A, B):
    """Multiply two matrices A and B.

    Args:
        A: list of lists (m x n)
        B: list of lists (n x p)
    Returns:
        list of lists (m x p)
    Raises:
        ValueError if dimensions are incompatible
    """
    rows_a, cols_a = len(A), len(A[0])
    rows_b, cols_b = len(B), len(B[0])

    # TODO: check dimension compatibility
    # TODO: create result matrix of zeros
    # TODO: compute each element as the dot product of row i of A and col j of B
    pass
`,
    solutionCode: `def matmul(A, B):
    rows_a, cols_a = len(A), len(A[0])
    rows_b, cols_b = len(B), len(B[0])
    if cols_a != rows_b:
        raise ValueError(f"Incompatible dimensions: {rows_a}x{cols_a} and {rows_b}x{cols_b}")
    result = [[0] * cols_b for _ in range(rows_a)]
    for i in range(rows_a):
        for j in range(cols_b):
            for k in range(cols_a):
                result[i][j] += A[i][k] * B[k][j]
    return result
`,
    hints: [
      'Dimensions: if A is m×n and B is n×p, result is m×p. cols_a must equal rows_b.',
      'Create the result matrix: [[0] * cols_b for _ in range(rows_a)].',
      'Each element result[i][j] = sum(A[i][k] * B[k][j] for k in range(cols_a)).',
    ],
    testCode: `import json
results = []
try:
    A = [[1, 2], [3, 4]]
    B = [[5, 6], [7, 8]]
    r = matmul(A, B)
    results.append({"name": "2x2 × 2x2", "passed": r == [[19, 22], [43, 50]], "expected": "[[19,22],[43,50]]", "actual": str(r)})
    A = [[1, 2, 3]]
    B = [[4], [5], [6]]
    r = matmul(A, B)
    results.append({"name": "1x3 × 3x1 = 1x1", "passed": r == [[32]], "expected": "[[32]]", "actual": str(r)})
    I = [[1, 0], [0, 1]]
    r = matmul([[3, 4], [5, 6]], I)
    results.append({"name": "Identity multiply", "passed": r == [[3, 4], [5, 6]], "expected": "[[3,4],[5,6]]", "actual": str(r)})
    try:
        matmul([[1, 2]], [[1, 2]])
        results.append({"name": "Dimension error raised", "passed": False, "expected": "ValueError", "actual": "No error"})
    except ValueError:
        results.append({"name": "Dimension error raised", "passed": True, "expected": "ValueError", "actual": "ValueError"})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Unit 4: ML Fundamentals ──────────────────────────────────────────────
  {
    id: 'ml-knn',
    unitId: 'ml-fundamentals',
    title: 'K-Nearest Neighbors Classifier',
    description:
      'Implement a simple KNN classifier from scratch. Given training data, find the k closest points to a query using Euclidean distance, and return the majority class.',
    difficulty: 'medium',
    starterCode: `def euclidean_distance(a, b):
    """Compute Euclidean distance between two points (lists)."""
    # TODO: implement
    pass

def knn_predict(X_train, y_train, query, k=3):
    """Predict the class of query using k-nearest neighbors.

    Args:
        X_train: list of feature vectors [[x1, x2], ...]
        y_train: list of labels [0, 1, 1, 0, ...]
        query:   single feature vector [x1, x2]
        k:       number of neighbors

    Returns:
        predicted class label
    """
    # TODO: compute distances from query to all training points
    # TODO: find the k nearest neighbors
    # TODO: return the majority class among them
    pass
`,
    solutionCode: `def euclidean_distance(a, b):
    return sum((ai - bi) ** 2 for ai, bi in zip(a, b)) ** 0.5

def knn_predict(X_train, y_train, query, k=3):
    distances = [(euclidean_distance(x, query), y) for x, y in zip(X_train, y_train)]
    distances.sort(key=lambda t: t[0])
    neighbors = [label for _, label in distances[:k]]
    return max(set(neighbors), key=neighbors.count)
`,
    hints: [
      'Euclidean distance: sqrt(sum((a_i - b_i)² for each dimension)).',
      'Pair each training point with its distance to the query, then sort by distance.',
      'Take the first k labels and return the most common one (majority vote).',
    ],
    testCode: `import json
results = []
try:
    X = [[1, 1], [1, 2], [2, 1], [8, 8], [9, 8], [8, 9]]
    y = [0, 0, 0, 1, 1, 1]
    r = knn_predict(X, y, [2, 2], k=3)
    results.append({"name": "Near cluster 0", "passed": r == 0, "expected": "0", "actual": str(r)})
    r = knn_predict(X, y, [8, 7], k=3)
    results.append({"name": "Near cluster 1", "passed": r == 1, "expected": "1", "actual": str(r)})
    d = euclidean_distance([0, 0], [3, 4])
    results.append({"name": "Distance 3-4-5 triangle", "passed": abs(d - 5.0) < 1e-6, "expected": "5.0", "actual": f"{d:.4f}"})
    r = knn_predict(X, y, [5, 5], k=1)
    results.append({"name": "k=1 midpoint", "passed": r in [0, 1], "expected": "0 or 1", "actual": str(r)})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },
  {
    id: 'ml-gradient-descent',
    unitId: 'ml-fundamentals',
    title: 'Linear Regression via Gradient Descent',
    description:
      'Implement simple linear regression (y = wx + b) trained with gradient descent. Given x and y data, learn the optimal weight and bias.',
    difficulty: 'hard',
    starterCode: `def linear_regression_gd(X, y, lr=0.01, epochs=1000):
    """Train a simple linear model y = w*x + b using gradient descent.

    Args:
        X: list of input values
        y: list of target values
        lr: learning rate
        epochs: number of training iterations

    Returns:
        (w, b) — learned weight and bias
    """
    w = 0.0
    b = 0.0
    n = len(X)

    for _ in range(epochs):
        # TODO: compute predictions
        # TODO: compute gradients dw and db
        # TODO: update w and b
        pass

    return w, b
`,
    solutionCode: `def linear_regression_gd(X, y, lr=0.01, epochs=1000):
    w = 0.0
    b = 0.0
    n = len(X)
    for _ in range(epochs):
        predictions = [w * x + b for x in X]
        dw = (-2 / n) * sum((yi - pi) * xi for xi, yi, pi in zip(X, y, predictions))
        db = (-2 / n) * sum(yi - pi for yi, pi in zip(y, predictions))
        w -= lr * dw
        b -= lr * db
    return w, b
`,
    hints: [
      'Prediction for each point: pred_i = w * X_i + b.',
      'Gradient for w: dw = (-2/n) * Σ (y_i - pred_i) * X_i.',
      'Gradient for b: db = (-2/n) * Σ (y_i - pred_i). Then update: w -= lr * dw, b -= lr * db.',
    ],
    testCode: `import json
results = []
try:
    X = [1, 2, 3, 4, 5]
    y = [2, 4, 6, 8, 10]
    w, b = linear_regression_gd(X, y, lr=0.01, epochs=5000)
    results.append({"name": "y=2x: w ≈ 2", "passed": abs(w - 2.0) < 0.1, "expected": "~2.0", "actual": f"{w:.4f}"})
    results.append({"name": "y=2x: b ≈ 0", "passed": abs(b) < 0.1, "expected": "~0.0", "actual": f"{b:.4f}"})
    X2 = [1, 2, 3, 4, 5]
    y2 = [3, 5, 7, 9, 11]
    w2, b2 = linear_regression_gd(X2, y2, lr=0.01, epochs=5000)
    results.append({"name": "y=2x+1: w ≈ 2", "passed": abs(w2 - 2.0) < 0.15, "expected": "~2.0", "actual": f"{w2:.4f}"})
    results.append({"name": "y=2x+1: b ≈ 1", "passed": abs(b2 - 1.0) < 0.15, "expected": "~1.0", "actual": f"{b2:.4f}"})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Unit 5: Deep Learning ────────────────────────────────────────────────
  {
    id: 'dl-activations',
    unitId: 'deep-learning',
    title: 'Activation Functions',
    description:
      'Implement the three most common neural network activation functions: ReLU, Sigmoid, and Tanh — from scratch using only basic math.',
    difficulty: 'easy',
    starterCode: `import math

def relu(x):
    """Rectified Linear Unit: max(0, x)"""
    # TODO: implement
    pass

def sigmoid(x):
    """Sigmoid: 1 / (1 + e^(-x))"""
    # TODO: implement
    pass

def tanh(x):
    """Hyperbolic tangent: (e^x - e^(-x)) / (e^x + e^(-x))"""
    # TODO: implement
    pass
`,
    solutionCode: `import math

def relu(x):
    return max(0, x)

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

def tanh(x):
    return (math.exp(x) - math.exp(-x)) / (math.exp(x) + math.exp(-x))
`,
    hints: [
      'ReLU is the simplest: return max(0, x).',
      'Sigmoid: use math.exp(-x) for e^(-x).',
      'Tanh: compute e^x and e^(-x) separately, then (e^x - e^(-x)) / (e^x + e^(-x)).',
    ],
    testCode: `import json, math
results = []
try:
    results.append({"name": "relu(5)==5", "passed": relu(5) == 5, "expected": "5", "actual": str(relu(5))})
    results.append({"name": "relu(-3)==0", "passed": relu(-3) == 0, "expected": "0", "actual": str(relu(-3))})
    results.append({"name": "relu(0)==0", "passed": relu(0) == 0, "expected": "0", "actual": str(relu(0))})
    s = sigmoid(0)
    results.append({"name": "sigmoid(0)==0.5", "passed": abs(s - 0.5) < 1e-6, "expected": "0.5", "actual": f"{s:.6f}"})
    s = sigmoid(100)
    results.append({"name": "sigmoid(100)≈1", "passed": abs(s - 1.0) < 1e-6, "expected": "~1.0", "actual": f"{s:.6f}"})
    t = tanh(0)
    results.append({"name": "tanh(0)==0", "passed": abs(t) < 1e-6, "expected": "0.0", "actual": f"{t:.6f}"})
    t = tanh(2)
    results.append({"name": "tanh(2)≈0.964", "passed": abs(t - math.tanh(2)) < 1e-4, "expected": f"{math.tanh(2):.4f}", "actual": f"{t:.4f}"})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },
  {
    id: 'dl-forward-pass',
    unitId: 'deep-learning',
    title: 'Single-Layer Forward Pass',
    description:
      'Implement the forward pass of a single fully-connected layer: output = activation(X · W + b). Use your own matrix/vector math.',
    difficulty: 'hard',
    starterCode: `import math

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

def forward(X, W, b, activation='sigmoid'):
    """Compute the forward pass of a single dense layer.

    Args:
        X: input matrix (batch_size x input_dim) — list of lists
        W: weight matrix (input_dim x output_dim) — list of lists
        b: bias vector (output_dim,) — list
        activation: 'sigmoid' or 'relu'

    Returns:
        output matrix (batch_size x output_dim) — list of lists
    """
    batch_size = len(X)
    input_dim = len(X[0])
    output_dim = len(b)

    # TODO: compute Z = X · W + b  (matrix multiply then add bias)
    # TODO: apply activation function element-wise
    pass
`,
    solutionCode: `import math

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

def forward(X, W, b, activation='sigmoid'):
    batch_size = len(X)
    input_dim = len(X[0])
    output_dim = len(b)
    Z = [[0.0] * output_dim for _ in range(batch_size)]
    for i in range(batch_size):
        for j in range(output_dim):
            val = b[j]
            for k in range(input_dim):
                val += X[i][k] * W[k][j]
            Z[i][j] = val
    act = sigmoid if activation == 'sigmoid' else lambda x: max(0, x)
    return [[act(Z[i][j]) for j in range(output_dim)] for i in range(batch_size)]
`,
    hints: [
      'Matrix multiply: Z[i][j] = sum(X[i][k] * W[k][j] for k) + b[j].',
      'Create the Z matrix first with all zeros, then fill in each element.',
      'Apply the activation function to every element of Z to get the final output.',
    ],
    testCode: `import json, math
results = []
try:
    X = [[1, 0], [0, 1]]
    W = [[0.5, -0.5], [0.5, -0.5]]
    b = [0, 0]
    r = forward(X, W, b, 'relu')
    results.append({"name": "ReLU forward shape", "passed": len(r) == 2 and len(r[0]) == 2, "expected": "2x2", "actual": f"{len(r)}x{len(r[0]) if r else '?'}"})
    results.append({"name": "ReLU clips negatives", "passed": all(r[i][j] >= 0 for i in range(2) for j in range(2)), "expected": "all >= 0", "actual": str(r)})
    X2 = [[0, 0]]
    W2 = [[1], [1]]
    b2 = [0]
    r2 = forward(X2, W2, b2, 'sigmoid')
    results.append({"name": "sigmoid(0)=0.5", "passed": abs(r2[0][0] - 0.5) < 1e-6, "expected": "0.5", "actual": f"{r2[0][0]:.4f}"})
    X3 = [[1, 2]]
    W3 = [[1], [1]]
    b3 = [1]
    r3 = forward(X3, W3, b3, 'sigmoid')
    expected = 1.0 / (1.0 + math.exp(-4))
    results.append({"name": "sigmoid(1*1+2*1+1)=σ(4)", "passed": abs(r3[0][0] - expected) < 1e-4, "expected": f"{expected:.4f}", "actual": f"{r3[0][0]:.4f}"})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Unit 6: NLP ──────────────────────────────────────────────────────────
  {
    id: 'nlp-bow',
    unitId: 'nlp',
    title: 'Bag-of-Words Representation',
    description:
      'Implement a bag-of-words vectorizer. Given a corpus (list of documents), build a vocabulary and convert each document into a count vector.',
    difficulty: 'easy',
    starterCode: `def build_vocab(corpus):
    """Build a sorted vocabulary (list of unique words) from a corpus.

    Args:
        corpus: list of strings (documents)
    Returns:
        sorted list of unique lowercase words
    """
    # TODO: split each doc, lowercase, collect unique words, sort
    pass

def bow_vectorize(document, vocab):
    """Convert a single document to a bag-of-words count vector.

    Args:
        document: a string
        vocab: sorted list of words (from build_vocab)
    Returns:
        list of ints (word counts), same length as vocab
    """
    # TODO: count occurrences of each vocab word in the document
    pass
`,
    solutionCode: `def build_vocab(corpus):
    words = set()
    for doc in corpus:
        for word in doc.lower().split():
            words.add(word)
    return sorted(words)

def bow_vectorize(document, vocab):
    words = document.lower().split()
    return [words.count(w) for w in vocab]
`,
    hints: [
      'Split each document with .split() and convert to lowercase with .lower().',
      'Use a set to collect unique words across all documents, then sort the set.',
      'For vectorization, count how many times each vocab word appears in the document.',
    ],
    testCode: `import json
results = []
try:
    corpus = ["the cat sat", "the dog sat", "the cat and the dog"]
    vocab = build_vocab(corpus)
    results.append({"name": "Vocab has right words", "passed": set(vocab) == {"the", "cat", "sat", "dog", "and"}, "expected": "5 unique words", "actual": str(vocab)})
    results.append({"name": "Vocab is sorted", "passed": vocab == sorted(vocab), "expected": "sorted", "actual": str(vocab)})
    v = bow_vectorize("the cat sat", vocab)
    results.append({"name": "Vector length matches vocab", "passed": len(v) == len(vocab), "expected": str(len(vocab)), "actual": str(len(v))})
    idx_the = vocab.index("the")
    idx_cat = vocab.index("cat")
    results.append({"name": "'the' count in 'the cat sat'", "passed": v[idx_the] == 1, "expected": "1", "actual": str(v[idx_the])})
    v2 = bow_vectorize("the cat and the dog", vocab)
    results.append({"name": "'the' count=2 in last doc", "passed": v2[idx_the] == 2, "expected": "2", "actual": str(v2[idx_the])})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Unit 8: Feature Engineering ──────────────────────────────────────────
  {
    id: 'fe-normalization',
    unitId: 'feature-engineering',
    title: 'Normalization & Standardization',
    description:
      'Implement min-max normalization (scales to [0, 1]) and z-score standardization (mean 0, std 1) for a list of values.',
    difficulty: 'easy',
    starterCode: `def min_max_normalize(data):
    """Scale data to [0, 1] range.

    Formula: (x - min) / (max - min)
    """
    # TODO: implement
    pass

def z_score_standardize(data):
    """Standardize data to have mean=0 and std=1.

    Formula: (x - mean) / std
    """
    # TODO: implement
    pass
`,
    solutionCode: `def min_max_normalize(data):
    mn, mx = min(data), max(data)
    rng = mx - mn
    if rng == 0:
        return [0.0] * len(data)
    return [(x - mn) / rng for x in data]

def z_score_standardize(data):
    m = sum(data) / len(data)
    v = sum((x - m) ** 2 for x in data) / len(data)
    s = v ** 0.5
    if s == 0:
        return [0.0] * len(data)
    return [(x - m) / s for x in data]
`,
    hints: [
      'Min-max: find min and max of data, then (x - min) / (max - min) for each x.',
      'Z-score: compute mean and std first, then (x - mean) / std for each x.',
      'Handle edge case: if all values are the same, return all zeros to avoid division by zero.',
    ],
    testCode: `import json
results = []
try:
    r = min_max_normalize([1, 2, 3, 4, 5])
    results.append({"name": "Min-max: min→0", "passed": abs(r[0]) < 1e-9, "expected": "0.0", "actual": str(r[0])})
    results.append({"name": "Min-max: max→1", "passed": abs(r[-1] - 1.0) < 1e-9, "expected": "1.0", "actual": str(r[-1])})
    results.append({"name": "Min-max: mid→0.5", "passed": abs(r[2] - 0.5) < 1e-9, "expected": "0.5", "actual": str(r[2])})
    z = z_score_standardize([2, 4, 4, 4, 5, 5, 7, 9])
    mean_z = sum(z) / len(z)
    std_z = (sum((x - mean_z) ** 2 for x in z) / len(z)) ** 0.5
    results.append({"name": "Z-score: mean ≈ 0", "passed": abs(mean_z) < 1e-6, "expected": "~0", "actual": f"{mean_z:.6f}"})
    results.append({"name": "Z-score: std ≈ 1", "passed": abs(std_z - 1.0) < 1e-6, "expected": "~1", "actual": f"{std_z:.6f}"})
    r2 = min_max_normalize([5, 5, 5])
    results.append({"name": "Constant data → zeros", "passed": r2 == [0.0, 0.0, 0.0], "expected": "[0,0,0]", "actual": str(r2)})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Unit 9: Model Evaluation ─────────────────────────────────────────────
  {
    id: 'eval-metrics',
    unitId: 'model-evaluation',
    title: 'Classification Metrics from Scratch',
    description:
      'Implement accuracy, precision, recall, and F1 score from scratch given lists of true labels and predicted labels.',
    difficulty: 'easy',
    starterCode: `def accuracy(y_true, y_pred):
    """Fraction of correct predictions."""
    # TODO: implement
    pass

def precision(y_true, y_pred, positive=1):
    """Precision = TP / (TP + FP)"""
    # TODO: implement
    pass

def recall(y_true, y_pred, positive=1):
    """Recall = TP / (TP + FN)"""
    # TODO: implement
    pass

def f1_score(y_true, y_pred, positive=1):
    """F1 = 2 * precision * recall / (precision + recall)"""
    # TODO: implement
    pass
`,
    solutionCode: `def accuracy(y_true, y_pred):
    correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)
    return correct / len(y_true)

def precision(y_true, y_pred, positive=1):
    tp = sum(1 for t, p in zip(y_true, y_pred) if t == positive and p == positive)
    fp = sum(1 for t, p in zip(y_true, y_pred) if t != positive and p == positive)
    return tp / (tp + fp) if (tp + fp) > 0 else 0.0

def recall(y_true, y_pred, positive=1):
    tp = sum(1 for t, p in zip(y_true, y_pred) if t == positive and p == positive)
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == positive and p != positive)
    return tp / (tp + fn) if (tp + fn) > 0 else 0.0

def f1_score(y_true, y_pred, positive=1):
    p = precision(y_true, y_pred, positive)
    r = recall(y_true, y_pred, positive)
    return 2 * p * r / (p + r) if (p + r) > 0 else 0.0
`,
    hints: [
      'Accuracy: count how many y_true[i] == y_pred[i], divide by total.',
      'TP = both true and pred are positive. FP = pred positive but true negative. FN = true positive but pred negative.',
      'F1 is the harmonic mean: 2 * P * R / (P + R). Handle the case where P + R = 0.',
    ],
    testCode: `import json
results = []
try:
    yt = [1, 1, 0, 0, 1, 0, 1, 1]
    yp = [1, 0, 0, 0, 1, 1, 1, 0]
    a = accuracy(yt, yp)
    results.append({"name": "Accuracy = 5/8", "passed": abs(a - 5/8) < 1e-6, "expected": "0.625", "actual": f"{a:.4f}"})
    p = precision(yt, yp)
    results.append({"name": "Precision = 3/4", "passed": abs(p - 3/4) < 1e-6, "expected": "0.75", "actual": f"{p:.4f}"})
    r = recall(yt, yp)
    results.append({"name": "Recall = 3/5", "passed": abs(r - 3/5) < 1e-6, "expected": "0.6", "actual": f"{r:.4f}"})
    f = f1_score(yt, yp)
    expected_f1 = 2 * 0.75 * 0.6 / (0.75 + 0.6)
    results.append({"name": f"F1 ≈ {expected_f1:.4f}", "passed": abs(f - expected_f1) < 1e-4, "expected": f"{expected_f1:.4f}", "actual": f"{f:.4f}"})
    results.append({"name": "Perfect accuracy", "passed": accuracy([1,0,1],[1,0,1]) == 1.0, "expected": "1.0", "actual": str(accuracy([1,0,1],[1,0,1]))})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Unit 10: SQL & Data ──────────────────────────────────────────────────
  {
    id: 'data-group-by',
    unitId: 'sql-data',
    title: 'Implement GROUP BY in Python',
    description:
      'Simulate a SQL GROUP BY operation: given a list of rows (dicts), group by a key column and compute aggregate functions (count, sum, average) on a value column.',
    difficulty: 'medium',
    starterCode: `def group_by_aggregate(rows, group_col, value_col):
    """Group rows by group_col and compute aggregates on value_col.

    Args:
        rows: list of dicts, e.g. [{"dept": "eng", "salary": 100}, ...]
        group_col: key to group by, e.g. "dept"
        value_col: key to aggregate, e.g. "salary"

    Returns:
        dict of {group_value: {"count": N, "sum": S, "avg": A}}
    """
    # TODO: implement
    pass
`,
    solutionCode: `def group_by_aggregate(rows, group_col, value_col):
    groups = {}
    for row in rows:
        key = row[group_col]
        val = row[value_col]
        if key not in groups:
            groups[key] = {"count": 0, "sum": 0}
        groups[key]["count"] += 1
        groups[key]["sum"] += val
    for key in groups:
        groups[key]["avg"] = groups[key]["sum"] / groups[key]["count"]
    return groups
`,
    hints: [
      'Create a dictionary where keys are the unique values of group_col.',
      'For each row, add to the running count and sum for that group.',
      'After processing all rows, compute avg = sum / count for each group.',
    ],
    testCode: `import json
results = []
try:
    data = [
        {"dept": "eng", "salary": 100},
        {"dept": "eng", "salary": 120},
        {"dept": "eng", "salary": 140},
        {"dept": "sales", "salary": 80},
        {"dept": "sales", "salary": 90},
    ]
    r = group_by_aggregate(data, "dept", "salary")
    results.append({"name": "eng count=3", "passed": r["eng"]["count"] == 3, "expected": "3", "actual": str(r["eng"]["count"])})
    results.append({"name": "eng sum=360", "passed": r["eng"]["sum"] == 360, "expected": "360", "actual": str(r["eng"]["sum"])})
    results.append({"name": "eng avg=120", "passed": abs(r["eng"]["avg"] - 120) < 1e-6, "expected": "120", "actual": str(r["eng"]["avg"])})
    results.append({"name": "sales count=2", "passed": r["sales"]["count"] == 2, "expected": "2", "actual": str(r["sales"]["count"])})
    results.append({"name": "sales avg=85", "passed": abs(r["sales"]["avg"] - 85) < 1e-6, "expected": "85", "actual": str(r["sales"]["avg"])})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Unit 18: Recommendation Systems ──────────────────────────────────────
  {
    id: 'recsys-cosine-sim',
    unitId: 'recommendation-systems',
    title: 'Cosine Similarity for Recommendations',
    description:
      'Implement cosine similarity between two vectors and use it to find the most similar items in a ratings matrix.',
    difficulty: 'medium',
    starterCode: `def cosine_similarity(a, b):
    """Compute cosine similarity between two vectors.

    cos(a, b) = (a · b) / (||a|| * ||b||)
    """
    # TODO: implement dot product, magnitudes, then similarity
    pass

def most_similar(item_index, ratings_matrix, top_n=3):
    """Find the top_n most similar items to item_index.

    Args:
        item_index: index of the target item
        ratings_matrix: list of lists where each row is an item's ratings
        top_n: number of similar items to return

    Returns:
        list of (item_index, similarity_score) tuples, sorted by similarity desc
    """
    # TODO: implement
    pass
`,
    solutionCode: `def cosine_similarity(a, b):
    dot = sum(ai * bi for ai, bi in zip(a, b))
    mag_a = sum(ai ** 2 for ai in a) ** 0.5
    mag_b = sum(bi ** 2 for bi in b) ** 0.5
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)

def most_similar(item_index, ratings_matrix, top_n=3):
    target = ratings_matrix[item_index]
    similarities = []
    for i, row in enumerate(ratings_matrix):
        if i == item_index:
            continue
        sim = cosine_similarity(target, row)
        similarities.append((i, sim))
    similarities.sort(key=lambda x: x[1], reverse=True)
    return similarities[:top_n]
`,
    hints: [
      'Dot product: sum(a_i * b_i for each i). Magnitude: sqrt(sum(x_i² for each i)).',
      'Handle the edge case where magnitude is 0 (zero vector).',
      'For most_similar, compute cosine similarity of the target item with every other item, then sort descending.',
    ],
    testCode: `import json
results = []
try:
    s = cosine_similarity([1, 0, 0], [1, 0, 0])
    results.append({"name": "Identical vectors = 1", "passed": abs(s - 1.0) < 1e-6, "expected": "1.0", "actual": f"{s:.4f}"})
    s = cosine_similarity([1, 0], [0, 1])
    results.append({"name": "Orthogonal vectors = 0", "passed": abs(s) < 1e-6, "expected": "0.0", "actual": f"{s:.4f}"})
    s = cosine_similarity([1, 2, 3], [2, 4, 6])
    results.append({"name": "Proportional vectors = 1", "passed": abs(s - 1.0) < 1e-6, "expected": "1.0", "actual": f"{s:.4f}"})
    matrix = [[5, 4, 1], [4, 5, 1], [1, 1, 5], [1, 0, 5]]
    sims = most_similar(0, matrix, top_n=2)
    results.append({"name": "Most similar to item 0 is item 1", "passed": sims[0][0] == 1, "expected": "item 1", "actual": f"item {sims[0][0]}"})
    results.append({"name": "Returns top_n items", "passed": len(sims) == 2, "expected": "2", "actual": str(len(sims))})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Unit 12: Big Data / SQL ──────────────────────────────────────────────
  {
    id: 'sql-window-rank',
    unitId: 'sql-data',
    title: 'Implement Window RANK in Python',
    description:
      'Simulate a SQL window function: given a list of rows, implement RANK() OVER (PARTITION BY group ORDER BY score DESC). Each row should get a rank within its partition.',
    difficulty: 'medium',
    starterCode: `def rank_within_groups(rows, partition_col, order_col):
    """Assign a rank to each row within its partition, ordered by order_col descending.

    Ties get the same rank, and the next rank skips (standard competition ranking).

    Args:
        rows: list of dicts, e.g. [{"dept": "eng", "name": "Alice", "score": 95}, ...]
        partition_col: key to partition by, e.g. "dept"
        order_col: key to order by (descending), e.g. "score"

    Returns:
        list of dicts — original rows with an added "rank" key
    """
    # TODO: implement
    pass
`,
    solutionCode: `def rank_within_groups(rows, partition_col, order_col):
    groups = {}
    for i, row in enumerate(rows):
        key = row[partition_col]
        if key not in groups:
            groups[key] = []
        groups[key].append((i, row))
    result = [None] * len(rows)
    for key, members in groups.items():
        members.sort(key=lambda x: x[1][order_col], reverse=True)
        rank = 1
        for pos, (orig_idx, row) in enumerate(members):
            if pos > 0 and members[pos][1][order_col] < members[pos - 1][1][order_col]:
                rank = pos + 1
            new_row = dict(row)
            new_row["rank"] = rank
            result[orig_idx] = new_row
    return result
`,
    hints: [
      'Group rows by the partition column into a dictionary of lists.',
      'Sort each group by the order column in descending order.',
      'Assign ranks: rank starts at 1. If the current value equals the previous, keep the same rank. Otherwise, set rank = position + 1 (competition ranking).',
    ],
    testCode: `import json
results = []
try:
    data = [
        {"dept": "eng", "name": "Alice", "score": 95},
        {"dept": "eng", "name": "Bob", "score": 90},
        {"dept": "eng", "name": "Carol", "score": 95},
        {"dept": "sales", "name": "Dave", "score": 80},
        {"dept": "sales", "name": "Eve", "score": 85},
    ]
    r = rank_within_groups(data, "dept", "score")
    alice = next(x for x in r if x["name"] == "Alice")
    bob = next(x for x in r if x["name"] == "Bob")
    carol = next(x for x in r if x["name"] == "Carol")
    eve = next(x for x in r if x["name"] == "Eve")
    dave = next(x for x in r if x["name"] == "Dave")
    results.append({"name": "Alice rank=1 (tied top)", "passed": alice["rank"] == 1, "expected": "1", "actual": str(alice["rank"])})
    results.append({"name": "Carol rank=1 (tied top)", "passed": carol["rank"] == 1, "expected": "1", "actual": str(carol["rank"])})
    results.append({"name": "Bob rank=3 (skip after tie)", "passed": bob["rank"] == 3, "expected": "3", "actual": str(bob["rank"])})
    results.append({"name": "Eve rank=1 in sales", "passed": eve["rank"] == 1, "expected": "1", "actual": str(eve["rank"])})
    results.append({"name": "Dave rank=2 in sales", "passed": dave["rank"] == 2, "expected": "2", "actual": str(dave["rank"])})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Deep-ML Inspired: Softmax ──────────────────────────────────────────
  {
    id: 'dl-softmax',
    unitId: 'deep-learning',
    title: 'Softmax from Scratch',
    description:
      'Implement the softmax function that converts a vector of raw scores (logits) into a probability distribution. Handle numerical stability.',
    difficulty: 'medium',
    starterCode: `import math

def softmax(logits):
    """Compute softmax probabilities from raw logits.

    softmax(x_i) = exp(x_i) / sum(exp(x_j) for all j)

    Important: Subtract the max logit for numerical stability.

    Args:
        logits: list of floats (raw scores)
    Returns:
        list of floats (probabilities that sum to 1)
    """
    # TODO: implement with numerical stability
    pass
`,
    solutionCode: `import math

def softmax(logits):
    max_logit = max(logits)
    exps = [math.exp(x - max_logit) for x in logits]
    total = sum(exps)
    return [e / total for e in exps]
`,
    hints: [
      'Subtract the maximum logit from all values before exponentiating to prevent overflow.',
      'Compute exp(x_i - max) for each logit, then divide each by the sum of all exps.',
      'The output should be a valid probability distribution: all values in [0, 1] and summing to 1.',
    ],
    testCode: `import json, math
results = []
try:
    r = softmax([1.0, 2.0, 3.0])
    results.append({"name": "Sum to 1", "passed": abs(sum(r) - 1.0) < 1e-6, "expected": "1.0", "actual": f"{sum(r):.6f}"})
    results.append({"name": "Largest logit → largest prob", "passed": r[2] > r[1] > r[0], "expected": "r[2]>r[1]>r[0]", "actual": f"{r[0]:.3f},{r[1]:.3f},{r[2]:.3f}"})
    r2 = softmax([0.0, 0.0, 0.0])
    results.append({"name": "Equal logits → uniform", "passed": all(abs(p - 1/3) < 1e-6 for p in r2), "expected": "all 0.333", "actual": str([f"{p:.3f}" for p in r2])})
    r3 = softmax([1000, 1001, 1002])
    results.append({"name": "Large logits (stability)", "passed": abs(sum(r3) - 1.0) < 1e-6, "expected": "1.0", "actual": f"{sum(r3):.6f}"})
    r4 = softmax([10, 0])
    results.append({"name": "Dominant logit ≈ 1", "passed": r4[0] > 0.999, "expected": ">0.999", "actual": f"{r4[0]:.6f}"})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Deep-ML Inspired: Cross-Entropy Loss ───────────────────────────────
  {
    id: 'dl-cross-entropy',
    unitId: 'deep-learning',
    title: 'Cross-Entropy Loss from Scratch',
    description:
      'Implement binary cross-entropy loss and categorical cross-entropy loss from scratch. These are the most common loss functions for classification.',
    difficulty: 'medium',
    starterCode: `import math

def binary_cross_entropy(y_true, y_pred):
    """Compute binary cross-entropy loss.

    BCE = -1/n * sum(y*log(p) + (1-y)*log(1-p))

    Args:
        y_true: list of true labels (0 or 1)
        y_pred: list of predicted probabilities (0 to 1)
    Returns:
        float: average loss
    """
    # TODO: implement (clip predictions to avoid log(0))
    pass

def categorical_cross_entropy(y_true_onehot, y_pred):
    """Compute categorical cross-entropy loss.

    CCE = -1/n * sum(sum(y_ij * log(p_ij)))

    Args:
        y_true_onehot: list of one-hot vectors, e.g. [[1,0,0],[0,1,0]]
        y_pred: list of probability vectors, e.g. [[0.7,0.2,0.1],[0.1,0.8,0.1]]
    Returns:
        float: average loss
    """
    # TODO: implement
    pass
`,
    solutionCode: `import math

def binary_cross_entropy(y_true, y_pred):
    eps = 1e-15
    n = len(y_true)
    total = 0.0
    for y, p in zip(y_true, y_pred):
        p = max(eps, min(1 - eps, p))
        total += y * math.log(p) + (1 - y) * math.log(1 - p)
    return -total / n

def categorical_cross_entropy(y_true_onehot, y_pred):
    eps = 1e-15
    n = len(y_true_onehot)
    total = 0.0
    for true_vec, pred_vec in zip(y_true_onehot, y_pred):
        for y, p in zip(true_vec, pred_vec):
            p = max(eps, p)
            total += y * math.log(p)
    return -total / n
`,
    hints: [
      'Clip predictions to a tiny epsilon (e.g. 1e-15) to avoid log(0) which is -infinity.',
      'Binary CE: for each sample, compute y*log(p) + (1-y)*log(1-p), sum, negate, and average.',
      'Categorical CE: for each sample, sum y_j * log(p_j) over all classes, then negate and average over all samples.',
    ],
    testCode: `import json, math
results = []
try:
    bce = binary_cross_entropy([1, 0, 1], [0.9, 0.1, 0.8])
    expected = -(math.log(0.9) + math.log(0.9) + math.log(0.8)) / 3
    results.append({"name": "BCE basic", "passed": abs(bce - expected) < 1e-4, "expected": f"{expected:.4f}", "actual": f"{bce:.4f}"})
    bce_perfect = binary_cross_entropy([1, 0], [1.0, 0.0])
    results.append({"name": "BCE perfect preds ≈ 0", "passed": bce_perfect < 0.01, "expected": "~0", "actual": f"{bce_perfect:.6f}"})
    bce_bad = binary_cross_entropy([1, 0], [0.01, 0.99])
    results.append({"name": "BCE bad preds → high loss", "passed": bce_bad > 2.0, "expected": ">2.0", "actual": f"{bce_bad:.4f}"})
    cce = categorical_cross_entropy([[1,0,0],[0,1,0]], [[0.7,0.2,0.1],[0.1,0.8,0.1]])
    results.append({"name": "CCE basic", "passed": 0 < cce < 1, "expected": "0 < loss < 1", "actual": f"{cce:.4f}"})
    cce_perfect = categorical_cross_entropy([[1,0],[0,1]], [[1.0,0.0],[0.0,1.0]])
    results.append({"name": "CCE perfect ≈ 0", "passed": cce_perfect < 0.01, "expected": "~0", "actual": f"{cce_perfect:.6f}"})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Deep-ML Inspired: TF-IDF ──────────────────────────────────────────
  {
    id: 'nlp-tfidf',
    unitId: 'nlp',
    title: 'TF-IDF from Scratch',
    description:
      'Implement Term Frequency-Inverse Document Frequency (TF-IDF) scoring. Given a corpus of documents, compute TF-IDF weights for each term in each document.',
    difficulty: 'hard',
    starterCode: `import math

def compute_tf(document):
    """Compute term frequency for each word in a document.

    TF(t, d) = count(t in d) / total_words_in_d

    Args:
        document: string
    Returns:
        dict mapping word -> TF score
    """
    # TODO: implement
    pass

def compute_idf(corpus):
    """Compute inverse document frequency for each word in the corpus.

    IDF(t) = log(N / df(t)) where N is total docs and df(t) is docs containing t

    Args:
        corpus: list of strings (documents)
    Returns:
        dict mapping word -> IDF score
    """
    # TODO: implement
    pass

def compute_tfidf(corpus):
    """Compute TF-IDF for each document in the corpus.

    Args:
        corpus: list of strings (documents)
    Returns:
        list of dicts, each mapping word -> TF-IDF score
    """
    # TODO: implement using compute_tf and compute_idf
    pass
`,
    solutionCode: `import math

def compute_tf(document):
    words = document.lower().split()
    n = len(words)
    freq = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1
    return {w: count / n for w, count in freq.items()}

def compute_idf(corpus):
    n_docs = len(corpus)
    df = {}
    for doc in corpus:
        seen = set(doc.lower().split())
        for w in seen:
            df[w] = df.get(w, 0) + 1
    return {w: math.log(n_docs / count) for w, count in df.items()}

def compute_tfidf(corpus):
    idf = compute_idf(corpus)
    result = []
    for doc in corpus:
        tf = compute_tf(doc)
        tfidf = {w: tf_val * idf.get(w, 0) for w, tf_val in tf.items()}
        result.append(tfidf)
    return result
`,
    hints: [
      'TF: split the document, count each word, divide by total number of words in the document.',
      'IDF: for each word, count how many documents contain it (document frequency), then IDF = log(N / df).',
      'TF-IDF: for each document, multiply each word\'s TF by its IDF. Words common across all documents get low scores.',
    ],
    testCode: `import json, math
results = []
try:
    corpus = ["the cat sat on the mat", "the dog sat on the log", "cats and dogs"]
    tf = compute_tf("the cat sat on the mat")
    results.append({"name": "TF of 'the' = 2/6", "passed": abs(tf["the"] - 2/6) < 1e-6, "expected": f"{2/6:.4f}", "actual": f"{tf['the']:.4f}"})
    results.append({"name": "TF of 'cat' = 1/6", "passed": abs(tf["cat"] - 1/6) < 1e-6, "expected": f"{1/6:.4f}", "actual": f"{tf['cat']:.4f}"})
    idf = compute_idf(corpus)
    results.append({"name": "IDF of 'the' (in 2 docs) = log(3/2)", "passed": abs(idf["the"] - math.log(3/2)) < 1e-6, "expected": f"{math.log(3/2):.4f}", "actual": f"{idf['the']:.4f}"})
    results.append({"name": "IDF of 'cats' (in 1 doc) = log(3)", "passed": abs(idf["cats"] - math.log(3)) < 1e-6, "expected": f"{math.log(3):.4f}", "actual": f"{idf['cats']:.4f}"})
    tfidf = compute_tfidf(corpus)
    results.append({"name": "TF-IDF returns list of dicts", "passed": len(tfidf) == 3 and isinstance(tfidf[0], dict), "expected": "3 dicts", "actual": f"{len(tfidf)} items"})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Deep-ML Inspired: Decision Tree Stump ──────────────────────────────
  {
    id: 'ml-decision-stump',
    unitId: 'ml-fundamentals',
    title: 'Decision Tree Stump (Gini Impurity)',
    description:
      'Implement a decision stump — a single-level decision tree that finds the best feature and threshold to split data, using Gini impurity as the splitting criterion.',
    difficulty: 'hard',
    starterCode: `def gini_impurity(labels):
    """Compute Gini impurity of a list of labels.

    Gini = 1 - sum(p_i^2 for each class i)

    Args:
        labels: list of class labels
    Returns:
        float: Gini impurity (0 = pure, 0.5 = max for binary)
    """
    # TODO: implement
    pass

def best_split(X, y):
    """Find the best feature and threshold to split the data.

    Try every feature and every midpoint between sorted unique values.
    Choose the split that minimizes weighted Gini impurity of the children.

    Args:
        X: list of feature vectors (list of lists)
        y: list of labels
    Returns:
        (best_feature_index, best_threshold, best_gini)
    """
    # TODO: implement
    pass
`,
    solutionCode: `def gini_impurity(labels):
    n = len(labels)
    if n == 0:
        return 0.0
    counts = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    return 1 - sum((c / n) ** 2 for c in counts.values())

def best_split(X, y):
    n = len(y)
    n_features = len(X[0])
    best_feat = 0
    best_thresh = 0
    best_gini = float('inf')
    for feat in range(n_features):
        values = sorted(set(row[feat] for row in X))
        for i in range(len(values) - 1):
            threshold = (values[i] + values[i + 1]) / 2
            left_y = [y[j] for j in range(n) if X[j][feat] <= threshold]
            right_y = [y[j] for j in range(n) if X[j][feat] > threshold]
            if not left_y or not right_y:
                continue
            weighted_gini = (len(left_y) / n) * gini_impurity(left_y) + (len(right_y) / n) * gini_impurity(right_y)
            if weighted_gini < best_gini:
                best_gini = weighted_gini
                best_feat = feat
                best_thresh = threshold
    return best_feat, best_thresh, best_gini
`,
    hints: [
      'Gini impurity: count frequency of each class, compute p_i = count_i / total, then 1 - sum(p_i^2).',
      'For each feature, sort unique values and try midpoints as thresholds.',
      'Weighted Gini = (n_left/n) * gini(left) + (n_right/n) * gini(right). Find the split with the lowest.',
    ],
    testCode: `import json
results = []
try:
    g = gini_impurity([0, 0, 0])
    results.append({"name": "Pure set → Gini=0", "passed": abs(g) < 1e-6, "expected": "0.0", "actual": f"{g:.4f}"})
    g = gini_impurity([0, 1])
    results.append({"name": "50/50 binary → Gini=0.5", "passed": abs(g - 0.5) < 1e-6, "expected": "0.5", "actual": f"{g:.4f}"})
    g = gini_impurity([0, 1, 2])
    expected_g = 1 - 3 * (1/3)**2
    results.append({"name": "3-class uniform", "passed": abs(g - expected_g) < 1e-6, "expected": f"{expected_g:.4f}", "actual": f"{g:.4f}"})
    X = [[1], [2], [3], [4], [5], [6]]
    y = [0, 0, 0, 1, 1, 1]
    feat, thresh, gini = best_split(X, y)
    results.append({"name": "Perfect split found", "passed": abs(gini) < 1e-6, "expected": "0.0", "actual": f"{gini:.4f}"})
    results.append({"name": "Threshold between 3 and 4", "passed": 3 < thresh < 4, "expected": "3.5", "actual": f"{thresh:.1f}"})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SQL CODING CHALLENGES — run via Pyodide's built-in sqlite3 module
  // Each challenge has language: 'sql' and a setupCode with DDL + seed data.
  // Test code is Python that uses `user_sql` (string) and `_setup_db()` helper.
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── SQL 1: Duplicate Emails (Easy) ─────────────────────────────────────
  {
    id: 'sql-duplicate-emails',
    unitId: 'sql-data',
    language: 'sql',
    title: 'Find Duplicate Emails',
    description:
      'Write a SQL query to find all email addresses that appear more than once in the emails table. Return the email and the number of times it appears, ordered by count descending.',
    difficulty: 'easy',
    setupCode: `CREATE TABLE emails (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL
);

INSERT INTO emails VALUES (1, 'alice@example.com');
INSERT INTO emails VALUES (2, 'bob@example.com');
INSERT INTO emails VALUES (3, 'alice@example.com');
INSERT INTO emails VALUES (4, 'charlie@example.com');
INSERT INTO emails VALUES (5, 'bob@example.com');
INSERT INTO emails VALUES (6, 'bob@example.com');`,
    starterCode: `-- Find emails that appear more than once.
-- Return columns: email, count
-- Order by count descending.

SELECT`,
    solutionCode: `SELECT email, COUNT(*) as count
FROM emails
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY count DESC;`,
    hints: [
      'Use GROUP BY on the email column to group rows by email address.',
      'Use HAVING COUNT(*) > 1 to filter groups where the email appears more than once.',
      'Use ORDER BY count DESC (or ORDER BY COUNT(*) DESC) to sort by frequency.',
    ],
    testCode: `results = []
try:
    conn = _setup_db()
    cur = conn.cursor()
    cur.execute(user_sql)
    rows = cur.fetchall()
    cols = [desc[0].lower() for desc in cur.description]

    results.append({"name": "Query executes without error", "passed": True, "expected": "no error", "actual": "no error"})

    results.append({"name": "Returns exactly 2 duplicate emails", "passed": len(rows) == 2, "expected": "2 rows", "actual": f"{len(rows)} rows"})

    emails_found = [r[0] for r in rows]
    results.append({"name": "Includes bob@example.com", "passed": "bob@example.com" in emails_found, "expected": "bob@example.com present", "actual": str(emails_found)})
    results.append({"name": "Includes alice@example.com", "passed": "alice@example.com" in emails_found, "expected": "alice@example.com present", "actual": str(emails_found)})

    bob_row = [r for r in rows if r[0] == 'bob@example.com']
    results.append({"name": "bob@example.com count is 3", "passed": len(bob_row) == 1 and bob_row[0][1] == 3, "expected": "3", "actual": str(bob_row[0][1]) if bob_row else "not found"})

    results.append({"name": "Ordered by count descending", "passed": len(rows) >= 2 and rows[0][1] >= rows[1][1], "expected": "descending order", "actual": f"first={rows[0][1]}, second={rows[1][1]}" if len(rows) >= 2 else "too few rows"})

    conn.close()
except Exception as e:
    results.append({"name": "Query execution", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── SQL 2: Second Highest Salary (Medium) ──────────────────────────────
  {
    id: 'sql-second-highest-salary',
    unitId: 'sql-data',
    language: 'sql',
    title: 'Second Highest Salary',
    description:
      'Write a SQL query to find the second highest distinct salary from the employees table. Return it as a column named "second_highest_salary". If there is no second highest salary, the query should still return one row with NULL.',
    difficulty: 'medium',
    setupCode: `CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  salary INTEGER NOT NULL
);

INSERT INTO employees VALUES (1, 'Alice', 100000);
INSERT INTO employees VALUES (2, 'Bob', 120000);
INSERT INTO employees VALUES (3, 'Carol', 120000);
INSERT INTO employees VALUES (4, 'Dave', 90000);
INSERT INTO employees VALUES (5, 'Eve', 110000);`,
    starterCode: `-- Find the second highest DISTINCT salary.
-- Return column: second_highest_salary
-- If no second highest exists, return NULL.

SELECT`,
    solutionCode: `SELECT MAX(salary) AS second_highest_salary
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);`,
    hints: [
      'The highest salary is MAX(salary). The second highest is the MAX of everything below that.',
      'Use a subquery: WHERE salary < (SELECT MAX(salary) FROM employees).',
      'Using MAX() on an empty result set returns NULL automatically, handling the edge case.',
    ],
    testCode: `results = []
try:
    conn = _setup_db()
    cur = conn.cursor()
    cur.execute(user_sql)
    rows = cur.fetchall()
    cols = [desc[0].lower() for desc in cur.description]

    results.append({"name": "Query executes without error", "passed": True, "expected": "no error", "actual": "no error"})

    results.append({"name": "Returns exactly 1 row", "passed": len(rows) == 1, "expected": "1 row", "actual": f"{len(rows)} rows"})

    has_col = any("second" in c and "salary" in c for c in cols)
    results.append({"name": "Column named second_highest_salary", "passed": has_col, "expected": "second_highest_salary", "actual": ", ".join(cols)})

    val = rows[0][0] if rows else None
    results.append({"name": "Second highest salary is 110000", "passed": val == 110000, "expected": "110000", "actual": str(val)})

    # Edge case: test with only one distinct salary
    cur.execute("DELETE FROM employees WHERE salary != 120000")
    conn.commit()
    cur.execute(user_sql)
    edge_rows = cur.fetchall()
    edge_val = edge_rows[0][0] if edge_rows else "no rows"
    results.append({"name": "Returns NULL when no second highest", "passed": edge_val is None, "expected": "None/NULL", "actual": str(edge_val)})

    conn.close()
except Exception as e:
    results.append({"name": "Query execution", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── SQL 3: Department Top Earners (Medium) ─────────────────────────────
  {
    id: 'sql-dept-top-earners',
    unitId: 'sql-data',
    language: 'sql',
    title: 'Top Earner in Each Department',
    description:
      'Write a SQL query to find the employee with the highest salary in each department. Return columns: department, name, salary. Order by department name alphabetically.',
    difficulty: 'medium',
    setupCode: `CREATE TABLE dept_employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  salary INTEGER NOT NULL
);

INSERT INTO dept_employees VALUES (1, 'Alice', 'Engineering', 120000);
INSERT INTO dept_employees VALUES (2, 'Bob', 'Engineering', 100000);
INSERT INTO dept_employees VALUES (3, 'Carol', 'Engineering', 115000);
INSERT INTO dept_employees VALUES (4, 'Dave', 'Marketing', 90000);
INSERT INTO dept_employees VALUES (5, 'Eve', 'Marketing', 95000);
INSERT INTO dept_employees VALUES (6, 'Frank', 'Sales', 85000);`,
    starterCode: `-- Find the highest-paid employee in each department.
-- Return columns: department, name, salary
-- Order by department alphabetically.

SELECT`,
    solutionCode: `SELECT e.department, e.name, e.salary
FROM dept_employees e
WHERE e.salary = (
    SELECT MAX(salary) FROM dept_employees
    WHERE department = e.department
)
ORDER BY e.department;`,
    hints: [
      'You need the maximum salary within each department — a correlated subquery or a self-join can achieve this.',
      'Correlated subquery approach: WHERE salary = (SELECT MAX(salary) FROM dept_employees WHERE department = e.department).',
      'Alternatively, join against a subquery that computes MAX(salary) GROUP BY department.',
    ],
    testCode: `results = []
try:
    conn = _setup_db()
    cur = conn.cursor()
    cur.execute(user_sql)
    rows = cur.fetchall()
    cols = [desc[0].lower() for desc in cur.description]

    results.append({"name": "Query executes without error", "passed": True, "expected": "no error", "actual": "no error"})

    results.append({"name": "Returns 3 rows (one per department)", "passed": len(rows) == 3, "expected": "3 rows", "actual": f"{len(rows)} rows"})

    depts = [r[0] for r in rows]
    results.append({"name": "All departments represented", "passed": set(depts) == {"Engineering", "Marketing", "Sales"}, "expected": "Engineering, Marketing, Sales", "actual": str(depts)})

    eng_row = [r for r in rows if r[0] == 'Engineering']
    results.append({"name": "Engineering top earner is Alice (120000)", "passed": len(eng_row) == 1 and eng_row[0][1] == 'Alice' and eng_row[0][2] == 120000, "expected": "Alice, 120000", "actual": f"{eng_row[0][1]}, {eng_row[0][2]}" if eng_row else "not found"})

    mkt_row = [r for r in rows if r[0] == 'Marketing']
    results.append({"name": "Marketing top earner is Eve (95000)", "passed": len(mkt_row) == 1 and mkt_row[0][1] == 'Eve' and mkt_row[0][2] == 95000, "expected": "Eve, 95000", "actual": f"{mkt_row[0][1]}, {mkt_row[0][2]}" if mkt_row else "not found"})

    results.append({"name": "Ordered by department alphabetically", "passed": depts == sorted(depts), "expected": "alphabetical order", "actual": str(depts)})

    conn.close()
except Exception as e:
    results.append({"name": "Query execution", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── SQL 4: Running Total / Cumulative Sum (Medium) ─────────────────────
  {
    id: 'sql-running-total',
    unitId: 'sql-data',
    language: 'sql',
    title: 'Cumulative Revenue (Running Total)',
    description:
      'Write a SQL query to calculate a running total of daily sales revenue, ordered by date. Return columns: sale_date, amount, running_total.',
    difficulty: 'medium',
    setupCode: `CREATE TABLE daily_sales (
  sale_date TEXT NOT NULL,
  amount INTEGER NOT NULL
);

INSERT INTO daily_sales VALUES ('2024-01-01', 100);
INSERT INTO daily_sales VALUES ('2024-01-02', 200);
INSERT INTO daily_sales VALUES ('2024-01-03', 150);
INSERT INTO daily_sales VALUES ('2024-01-04', 300);
INSERT INTO daily_sales VALUES ('2024-01-05', 250);`,
    starterCode: `-- Calculate a running total of sales ordered by date.
-- Return columns: sale_date, amount, running_total
-- Hint: use a window function.

SELECT`,
    solutionCode: `SELECT
    sale_date,
    amount,
    SUM(amount) OVER (ORDER BY sale_date) AS running_total
FROM daily_sales
ORDER BY sale_date;`,
    hints: [
      'A window function lets you compute an aggregate (like SUM) over a "window" of rows without collapsing them.',
      'SUM(amount) OVER (ORDER BY sale_date) computes a cumulative sum from the first row up to the current row.',
      'Make sure to ORDER BY sale_date in both the window clause and the outer query.',
    ],
    testCode: `results = []
try:
    conn = _setup_db()
    cur = conn.cursor()
    cur.execute(user_sql)
    rows = cur.fetchall()
    cols = [desc[0].lower() for desc in cur.description]

    results.append({"name": "Query executes without error", "passed": True, "expected": "no error", "actual": "no error"})

    results.append({"name": "Returns 5 rows", "passed": len(rows) == 5, "expected": "5 rows", "actual": f"{len(rows)} rows"})

    has_rt = any("running" in c or "cumul" in c or "total" in c for c in cols)
    results.append({"name": "Has running_total column", "passed": has_rt, "expected": "running_total column", "actual": ", ".join(cols)})

    expected_totals = [100, 300, 450, 750, 1000]
    actual_totals = [r[2] for r in rows] if len(rows) >= 5 else []
    results.append({"name": "First running total = 100", "passed": len(actual_totals) >= 1 and actual_totals[0] == 100, "expected": "100", "actual": str(actual_totals[0]) if actual_totals else "no data"})

    results.append({"name": "Third running total = 450", "passed": len(actual_totals) >= 3 and actual_totals[2] == 450, "expected": "450", "actual": str(actual_totals[2]) if len(actual_totals) >= 3 else "no data"})

    results.append({"name": "Final running total = 1000", "passed": len(actual_totals) >= 5 and actual_totals[4] == 1000, "expected": "1000", "actual": str(actual_totals[4]) if len(actual_totals) >= 5 else "no data"})

    conn.close()
except Exception as e:
    results.append({"name": "Query execution", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── SQL 5: User Retention (Hard) ───────────────────────────────────────
  {
    id: 'sql-user-retention',
    unitId: 'sql-data',
    language: 'sql',
    title: 'Monthly User Retention',
    description:
      'Write a SQL query to find users who were active in BOTH January 2024 and February 2024 (retained users). Return the user_id column only, ordered by user_id ascending.',
    difficulty: 'hard',
    setupCode: `CREATE TABLE user_activity (
  user_id INTEGER NOT NULL,
  activity_date TEXT NOT NULL
);

INSERT INTO user_activity VALUES (1, '2024-01-15');
INSERT INTO user_activity VALUES (1, '2024-02-10');
INSERT INTO user_activity VALUES (1, '2024-03-05');
INSERT INTO user_activity VALUES (2, '2024-01-20');
INSERT INTO user_activity VALUES (2, '2024-03-15');
INSERT INTO user_activity VALUES (3, '2024-02-01');
INSERT INTO user_activity VALUES (3, '2024-02-15');
INSERT INTO user_activity VALUES (3, '2024-03-01');
INSERT INTO user_activity VALUES (4, '2024-01-01');
INSERT INTO user_activity VALUES (4, '2024-02-28');
INSERT INTO user_activity VALUES (5, '2024-01-10');`,
    starterCode: `-- Find users active in BOTH January 2024 AND February 2024.
-- Return column: user_id
-- Order by user_id ascending.
-- Hint: SQLite date function strftime('%Y-%m', date) extracts year-month.

SELECT`,
    solutionCode: `SELECT DISTINCT a.user_id
FROM user_activity a
INNER JOIN user_activity b
  ON a.user_id = b.user_id
WHERE strftime('%Y-%m', a.activity_date) = '2024-01'
  AND strftime('%Y-%m', b.activity_date) = '2024-02'
ORDER BY a.user_id;`,
    hints: [
      'You need to find users present in two different months — a self-join or INTERSECT can achieve this.',
      'Self-join: JOIN user_activity a with user_activity b ON a.user_id = b.user_id, filtering a for Jan and b for Feb.',
      'Use strftime(\'%Y-%m\', activity_date) to extract year-month in SQLite. Use DISTINCT to avoid duplicate user_ids.',
    ],
    testCode: `results = []
try:
    conn = _setup_db()
    cur = conn.cursor()
    cur.execute(user_sql)
    rows = cur.fetchall()
    cols = [desc[0].lower() for desc in cur.description]

    results.append({"name": "Query executes without error", "passed": True, "expected": "no error", "actual": "no error"})

    user_ids = [r[0] for r in rows]
    results.append({"name": "Returns exactly 2 retained users", "passed": len(user_ids) == 2, "expected": "2 rows", "actual": f"{len(user_ids)} rows"})

    results.append({"name": "User 1 is retained (active Jan + Feb)", "passed": 1 in user_ids, "expected": "user_id 1 present", "actual": str(user_ids)})

    results.append({"name": "User 4 is retained (active Jan + Feb)", "passed": 4 in user_ids, "expected": "user_id 4 present", "actual": str(user_ids)})

    results.append({"name": "User 2 NOT retained (no Feb activity)", "passed": 2 not in user_ids, "expected": "user_id 2 absent", "actual": str(user_ids)})

    results.append({"name": "Ordered by user_id ascending", "passed": user_ids == sorted(user_ids), "expected": "ascending order", "actual": str(user_ids)})

    conn.close()
except Exception as e:
    results.append({"name": "Query execution", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },

  // ─── Unit 19: Time Series ─────────────────────────────────────────────────
  {
    id: 'ts-moving-average',
    unitId: 'time-series',
    title: 'Moving Average & Exponential Smoothing',
    description:
      'Implement simple moving average (SMA) and exponential moving average (EMA) for time series smoothing.',
    difficulty: 'easy',
    starterCode: `def simple_moving_average(data, window):
    """Compute simple moving average.

    For each position i (starting at window-1), average the previous
    'window' values. Return a list shorter than input by (window-1).
    """
    # TODO: implement
    pass

def exponential_moving_average(data, alpha=0.3):
    """Compute exponential moving average.

    EMA_0 = data[0]
    EMA_t = alpha * data[t] + (1 - alpha) * EMA_{t-1}

    Returns a list the same length as data.
    """
    # TODO: implement
    pass
`,
    solutionCode: `def simple_moving_average(data, window):
    result = []
    for i in range(window - 1, len(data)):
        avg = sum(data[i - window + 1 : i + 1]) / window
        result.append(avg)
    return result

def exponential_moving_average(data, alpha=0.3):
    result = [data[0]]
    for i in range(1, len(data)):
        ema = alpha * data[i] + (1 - alpha) * result[-1]
        result.append(ema)
    return result
`,
    hints: [
      'SMA: slide a window of size `window` across the data, averaging each window.',
      'The SMA result has length len(data) - window + 1.',
      'EMA: start with data[0], then each subsequent value is alpha * current + (1-alpha) * previous EMA.',
    ],
    testCode: `import json
results = []
try:
    r = simple_moving_average([1, 2, 3, 4, 5], 3)
    results.append({"name": "SMA length", "passed": len(r) == 3, "expected": "3", "actual": str(len(r))})
    results.append({"name": "SMA [1,2,3,4,5] w=3 first", "passed": abs(r[0] - 2.0) < 1e-6, "expected": "2.0", "actual": str(r[0])})
    results.append({"name": "SMA last = 4.0", "passed": abs(r[-1] - 4.0) < 1e-6, "expected": "4.0", "actual": str(r[-1])})
    e = exponential_moving_average([1, 2, 3, 4, 5], alpha=0.5)
    results.append({"name": "EMA length matches input", "passed": len(e) == 5, "expected": "5", "actual": str(len(e))})
    results.append({"name": "EMA first = data[0]", "passed": e[0] == 1, "expected": "1", "actual": str(e[0])})
    expected_2 = 0.5 * 2 + 0.5 * 1
    results.append({"name": "EMA second value", "passed": abs(e[1] - expected_2) < 1e-6, "expected": str(expected_2), "actual": str(e[1])})
except Exception as e:
    results.append({"name": "Runtime Error", "passed": False, "error": str(e)})
print("__TEST_RESULTS__" + json.dumps(results))
`,
  },
];
