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
