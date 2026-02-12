// Part 2: ML Fundamentals, Deep Learning
export const questionsPart2 = [
  // ====== UNIT: ml-fundamentals ======
  // Lesson: ml-basics
  {
    id: 'ml-b-1', text: 'What is the bias-variance tradeoff?',
    options: ['Choosing between accuracy and speed', 'High bias means underfitting (too simple), high variance means overfitting (too complex); the goal is to find the balance that minimizes total error', 'Bias is always bad', 'Variance only matters for large datasets'],
    correctAnswer: 1, explanation: 'Bias measures how far off predictions are on average (underfitting). Variance measures how much predictions vary across datasets (overfitting). Total error = Bias² + Variance + Irreducible Error. The goal is minimizing this total.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ml-basics',
  },
  {
    id: 'ml-b-2', text: 'What is the difference between supervised and unsupervised learning?',
    options: ['Supervised is faster', 'Supervised learning uses labeled data to learn input-output mappings; unsupervised learning finds patterns in unlabeled data', 'Unsupervised is more accurate', 'They use the same algorithms'],
    correctAnswer: 1, explanation: 'Supervised learning trains on labeled data (input-output pairs) for tasks like classification and regression. Unsupervised learning discovers hidden patterns in unlabeled data (clustering, dimensionality reduction, anomaly detection).',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer', 'mlops_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ml-basics',
  },
  {
    id: 'ml-b-3', text: 'What is overfitting and how can it be prevented?',
    options: ['Training error is too high', 'When a model learns noise in training data rather than the underlying pattern, leading to poor generalization; prevented by regularization, cross-validation, more data, or simpler models', 'Overfitting improves accuracy', 'It only occurs with neural networks'],
    correctAnswer: 1, explanation: 'Overfitting occurs when a model memorizes training data (including noise) and fails to generalize. Prevention strategies include: regularization (L1/L2), cross-validation, early stopping, dropout, data augmentation, and using simpler models.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ml-basics',
  },
  {
    id: 'ml-b-4', text: 'What is regularization and why is it used?',
    options: ['Making data regular', 'Adding a penalty term to the loss function to discourage complex models and prevent overfitting', 'A data preprocessing step', 'Normalizing input features'],
    correctAnswer: 1, explanation: 'Regularization adds a penalty to the loss function based on model complexity. L1 (Lasso) adds |w|, promoting sparsity. L2 (Ridge) adds w², promoting small weights. Both reduce overfitting by constraining the model.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ml-basics',
  },
  {
    id: 'ml-b-5', text: 'What is cross-validation?',
    options: ['Validating data quality', 'A technique that partitions data into multiple folds, training on some and validating on others, to get a robust estimate of model performance', 'Using two different models', 'Comparing training and test accuracy'],
    correctAnswer: 1, explanation: 'K-fold cross-validation splits data into k folds, trains on k-1 folds and validates on the remaining fold, rotating k times. This gives a more reliable estimate of model performance than a single train-test split.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ml-basics',
  },
  {
    id: 'ml-b-6', text: 'What is the curse of dimensionality?',
    options: ['Having too many data points', 'As the number of features increases, the data becomes increasingly sparse, making it harder to find patterns and requiring exponentially more data', 'Neural networks being too deep', 'Memory constraints in computing'],
    correctAnswer: 1, explanation: 'In high dimensions, data points become sparse, distance metrics become less meaningful, and models need exponentially more data to generalize. This is why dimensionality reduction (PCA, feature selection) is important.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ml-basics',
  },
  {
    id: 'ml-b-7', text: 'What is the No Free Lunch theorem?',
    options: ['Training ML models is always expensive', 'No single algorithm works best for every problem; the best algorithm depends on the specific problem and data distribution', 'Deep learning is always the best approach', 'Ensemble methods always win'],
    correctAnswer: 1, explanation: 'The No Free Lunch theorem states that averaged over all possible problems, no algorithm is universally better than any other. This means algorithm selection should be guided by the specific problem, data, and domain knowledge.',
    difficulty: 'hard', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ml-basics',
  },
  {
    id: 'ml-b-8', text: 'What is the difference between a generative and discriminative model?',
    options: ['Generative models are always better', 'Generative models learn P(X,Y) and can generate new data; discriminative models learn P(Y|X) directly to make predictions', 'Discriminative models can generate data', 'They are the same'],
    correctAnswer: 1, explanation: 'Generative models (Naive Bayes, GANs, VAEs) model the joint distribution P(X,Y) and can generate new samples. Discriminative models (Logistic Regression, SVMs, Neural Nets) model P(Y|X) directly, often achieving better classification accuracy.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ml-basics',
  },
  {
    id: 'ml-b-9', text: 'What is semi-supervised learning?',
    options: ['Using half the training data', 'A learning paradigm that uses a small amount of labeled data combined with a large amount of unlabeled data', 'Training for half the epochs', 'Supervised learning with validation'],
    correctAnswer: 1, explanation: 'Semi-supervised learning leverages both labeled and unlabeled data. Common approaches include self-training, co-training, and graph-based methods. It is useful when labeling data is expensive but unlabeled data is abundant.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ml-basics',
  },
  {
    id: 'ml-b-10', text: 'What is transfer learning?',
    options: ['Moving data between databases', 'Using a model trained on one task as a starting point for a different but related task, leveraging learned representations', 'Transferring features manually', 'A type of data augmentation'],
    correctAnswer: 1, explanation: 'Transfer learning reuses a model pre-trained on a large dataset (e.g., ImageNet, large text corpora) as initialization for a new task. It is especially useful when the target dataset is small. Fine-tuning adjusts the pre-trained weights for the new task.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ml-basics',
  },

  // Lesson: regression
  {
    id: 'reg-1', text: 'What are the assumptions of linear regression?',
    options: ['No assumptions needed', 'Linearity, independence of errors, homoscedasticity (constant variance), normality of residuals, no multicollinearity', 'Only requires large data', 'Data must be standardized'],
    correctAnswer: 1, explanation: 'Key assumptions: (1) Linear relationship between X and Y, (2) Independence of residuals, (3) Homoscedasticity (constant error variance), (4) Normally distributed residuals, (5) No perfect multicollinearity among predictors.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'regression',
  },
  {
    id: 'reg-2', text: 'What is the difference between Ridge (L2) and Lasso (L1) regression?',
    options: ['They are the same', 'Ridge adds squared weights penalty (shrinks coefficients); Lasso adds absolute weights penalty (can zero out coefficients for feature selection)', 'Lasso is always better', 'Ridge is for classification'],
    correctAnswer: 1, explanation: 'Ridge (L2) adds λΣwᵢ² to the loss, shrinking all coefficients toward zero but rarely to exactly zero. Lasso (L1) adds λΣ|wᵢ|, which can drive coefficients to exactly zero, performing automatic feature selection.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'regression',
  },
  {
    id: 'reg-3', text: 'What is multicollinearity and how does it affect regression?',
    options: ['Having multiple target variables', 'When predictor variables are highly correlated, making coefficient estimates unstable and difficult to interpret', 'Having too many data points', 'A type of feature scaling'],
    correctAnswer: 1, explanation: 'Multicollinearity occurs when predictors are highly correlated. It inflates standard errors, makes individual coefficient estimates unreliable, and can lead to sign changes. VIF (Variance Inflation Factor) > 5-10 indicates problematic multicollinearity.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'regression',
  },
  {
    id: 'reg-4', text: 'What does R² (coefficient of determination) measure?',
    options: ['The correlation between variables', 'The proportion of variance in the dependent variable that is predictable from the independent variables', 'The accuracy of the model', 'The number of features needed'],
    correctAnswer: 1, explanation: 'R² = 1 - (SS_res/SS_tot) measures the proportion of variance explained by the model. R²=1 means perfect fit, R²=0 means the model is no better than predicting the mean. Adjusted R² accounts for the number of predictors.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'regression',
  },
  {
    id: 'reg-5', text: 'What is Elastic Net regularization?',
    options: ['A neural network architecture', 'A combination of L1 and L2 regularization that balances between Lasso and Ridge penalties', 'A preprocessing technique', 'A type of cross-validation'],
    correctAnswer: 1, explanation: 'Elastic Net combines L1 and L2 penalties: λ₁Σ|wᵢ| + λ₂Σwᵢ². It gets the benefits of both: feature selection from Lasso and coefficient shrinkage from Ridge. It handles correlated features better than Lasso alone.',
    difficulty: 'hard', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'regression',
  },
  {
    id: 'reg-6', text: 'What is polynomial regression?',
    options: ['Regression with polynomials as features', 'Extending linear regression by adding polynomial terms of the features to capture nonlinear relationships while remaining a linear model in terms of coefficients', 'A nonlinear optimization method', 'Regression for polynomial data only'],
    correctAnswer: 1, explanation: 'Polynomial regression adds polynomial terms (x², x³, etc.) as features. Despite having nonlinear features, it is still a linear model in its coefficients. It can capture nonlinear relationships but is prone to overfitting with high degrees.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large'], unitId: 'ml-fundamentals', lessonId: 'regression',
  },
  {
    id: 'reg-7', text: 'What is heteroscedasticity and why is it a problem?',
    options: ['A type of feature', 'When the variance of residuals is not constant across levels of the predictor, violating regression assumptions and leading to inefficient estimates', 'A data collection method', 'A type of overfitting'],
    correctAnswer: 1, explanation: 'Heteroscedasticity means residual variance changes across values of X. This violates the homoscedasticity assumption, making OLS estimates unbiased but inefficient, and standard errors unreliable. Solutions include weighted least squares or robust standard errors.',
    difficulty: 'hard', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'regression',
  },
  {
    id: 'reg-8', text: 'What is logistic regression and when is it used?',
    options: ['A regression for logarithmic data', 'A classification algorithm that models the probability of a binary outcome using the logistic (sigmoid) function', 'The same as linear regression', 'Only for continuous targets'],
    correctAnswer: 1, explanation: 'Despite its name, logistic regression is a classification algorithm. It models P(Y=1|X) using the sigmoid function σ(wᵀx + b). The output is a probability between 0 and 1. It uses cross-entropy loss and is trained via gradient descent or IRLS.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'regression',
  },
  {
    id: 'reg-9', text: 'How do you interpret coefficients in logistic regression?',
    options: ['Same as linear regression', 'A one-unit increase in a feature multiplies the odds of the positive class by e^(coefficient); the coefficient represents log-odds change', 'Coefficients have no interpretation', 'They represent probabilities directly'],
    correctAnswer: 1, explanation: 'In logistic regression, coefficients represent the change in log-odds for a one-unit increase in the predictor. exp(coefficient) gives the odds ratio. A coefficient of 0.5 means each unit increase multiplies the odds by e^0.5 ≈ 1.65.',
    difficulty: 'hard', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'regression',
  },
  {
    id: 'reg-10', text: 'What is the difference between MAE, MSE, and RMSE?',
    options: ['They measure the same thing', 'MAE is the average absolute error, MSE is the average squared error, RMSE is the square root of MSE; MSE/RMSE penalize large errors more heavily', 'RMSE is always the best metric', 'They are only for classification'],
    correctAnswer: 1, explanation: 'MAE = mean(|actual - predicted|), MSE = mean((actual - predicted)²), RMSE = √MSE. MSE/RMSE penalize large errors quadratically. MAE is more robust to outliers. RMSE is in the same units as the target variable.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'regression',
  },

  // Lesson: classification
  {
    id: 'cls-1', text: 'How does a decision tree make predictions?',
    options: ['Using gradient descent', 'By recursively splitting data based on feature thresholds that maximize information gain or minimize impurity', 'By computing distances', 'Using matrix operations'],
    correctAnswer: 1, explanation: 'Decision trees recursively split the data at each node using the feature and threshold that best separates the target classes (using metrics like Gini impurity or information gain). Predictions follow the path from root to leaf.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'classification',
  },
  {
    id: 'cls-2', text: 'What is the difference between Gini impurity and entropy for decision tree splitting?',
    options: ['They always give different results', 'Both measure impurity; Gini = 1 - Σpᵢ², Entropy = -Σpᵢlog₂(pᵢ); in practice they usually produce similar trees', 'Gini is always better', 'Entropy is only for binary classification'],
    correctAnswer: 1, explanation: 'Gini impurity and entropy both measure node impurity. Gini ranges from 0 to 0.5 (binary), entropy from 0 to 1. They usually produce similar trees; Gini is slightly faster to compute. Maximum impurity occurs when classes are equally distributed.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'classification',
  },
  {
    id: 'cls-3', text: 'How does K-Nearest Neighbors (KNN) work?',
    options: ['It builds a tree structure', 'It classifies a point based on the majority class of its K nearest neighbors in feature space, using a distance metric', 'It uses gradient descent', 'It requires training a model'],
    correctAnswer: 1, explanation: 'KNN is a lazy learning algorithm (no training phase). For a new point, it finds the K nearest points in the training set (using Euclidean, Manhattan, etc.) and assigns the majority class. K is a hyperparameter that affects bias-variance.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'classification',
  },
  {
    id: 'cls-4', text: 'What is a Support Vector Machine (SVM)?',
    options: ['A type of neural network', 'A classifier that finds the optimal hyperplane maximizing the margin between classes, with support vectors being the closest points to the boundary', 'A clustering algorithm', 'A dimensionality reduction technique'],
    correctAnswer: 1, explanation: 'SVM finds the hyperplane that maximizes the margin (distance) between the nearest points of different classes (support vectors). It can handle nonlinear boundaries using kernel functions (RBF, polynomial) that map data to higher dimensions.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'classification',
  },
  {
    id: 'cls-5', text: 'What is the kernel trick in SVM?',
    options: ['A preprocessing step', 'A technique that computes dot products in a higher-dimensional space without explicitly transforming the data, enabling nonlinear decision boundaries', 'A regularization method', 'A way to speed up training'],
    correctAnswer: 1, explanation: 'The kernel trick computes K(x,y) = φ(x)·φ(y) without explicitly computing the transformation φ. This enables SVMs to find nonlinear decision boundaries efficiently. Common kernels: RBF (Gaussian), polynomial, sigmoid.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'classification',
  },
  {
    id: 'cls-6', text: 'What is Naive Bayes and what makes it "naive"?',
    options: ['It is a simple algorithm', 'It applies Bayes theorem with the "naive" assumption that all features are conditionally independent given the class label', 'It ignores prior probabilities', 'It only works with text data'],
    correctAnswer: 1, explanation: 'Naive Bayes classifies using P(Y|X₁,...,Xₙ) ∝ P(Y)∏P(Xᵢ|Y), assuming features are conditionally independent given the class. Despite this often-violated assumption, it works surprisingly well for text classification and spam filtering.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'classification',
  },
  {
    id: 'cls-7', text: 'How do you handle imbalanced classes in classification?',
    options: ['Always use accuracy', 'Techniques include oversampling (SMOTE), undersampling, class weights, threshold tuning, and using appropriate metrics like F1, AUC-ROC, or precision-recall', 'Just collect more data', 'Imbalanced classes do not affect results'],
    correctAnswer: 1, explanation: 'Strategies include: SMOTE (synthetic oversampling), random undersampling, class weight adjustment, cost-sensitive learning, ensemble methods (BalancedBagging), and using metrics robust to imbalance (F1, AUC-PR, Matthews correlation coefficient).',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'classification',
  },
  {
    id: 'cls-8', text: 'What is the softmax function and when is it used?',
    options: ['A loss function', 'A function that converts a vector of real numbers into a probability distribution, used in multi-class classification output layers', 'A regularization technique', 'An activation for hidden layers'],
    correctAnswer: 1, explanation: 'Softmax(zᵢ) = e^zᵢ / Σe^zⱼ converts logits into probabilities that sum to 1. It is used in the output layer for multi-class classification. Combined with cross-entropy loss, it forms the standard approach for multi-class problems.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'classification',
  },
  {
    id: 'cls-9', text: 'What is the difference between one-vs-all (OvA) and one-vs-one (OvO) for multi-class classification?',
    options: ['They are identical', 'OvA trains one classifier per class vs. rest; OvO trains one classifier per pair of classes. OvA trains fewer models (C), OvO trains C(C-1)/2', 'OvO is always better', 'These are deep learning concepts'],
    correctAnswer: 1, explanation: 'OvA (One-vs-All) trains C binary classifiers, each distinguishing one class from all others. OvO (One-vs-One) trains C(C-1)/2 classifiers, one for each pair. OvO has more models but each trains on less data. OvA is more common.',
    difficulty: 'hard', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'classification',
  },
  {
    id: 'cls-10', text: 'What is the difference between hard and soft voting in ensemble classifiers?',
    options: ['Hard voting uses neural networks', 'Hard voting uses majority class vote; soft voting averages predicted probabilities and picks the class with highest average probability', 'Soft voting is for regression only', 'They always give the same result'],
    correctAnswer: 1, explanation: 'Hard voting: each classifier votes for a class, majority wins. Soft voting: each classifier outputs class probabilities, they are averaged, and the class with highest average probability wins. Soft voting often performs better when classifiers are well-calibrated.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'classification',
  },

  // Lesson: ensemble-methods
  {
    id: 'ens-1', text: 'What is bagging (Bootstrap Aggregating)?',
    options: ['A data collection method', 'Training multiple models on random bootstrap samples of the data and averaging their predictions to reduce variance', 'A feature selection technique', 'A type of gradient descent'],
    correctAnswer: 1, explanation: 'Bagging creates multiple bootstrap samples (sampling with replacement), trains a model on each, and aggregates predictions (averaging for regression, majority vote for classification). It reduces variance and helps prevent overfitting. Random Forest uses bagging.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ensemble-methods',
  },
  {
    id: 'ens-2', text: 'How does Random Forest improve upon a single decision tree?',
    options: ['It uses a deeper tree', 'It trains multiple trees on random subsets of data AND features, then aggregates predictions, reducing overfitting through decorrelation', 'It uses gradient descent', 'It only uses the best features'],
    correctAnswer: 1, explanation: 'Random Forest combines bagging with random feature selection at each split. Each tree sees a random subset of samples and features, decorrelating the trees. This ensemble approach dramatically reduces variance while maintaining low bias.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ensemble-methods',
  },
  {
    id: 'ens-3', text: 'What is gradient boosting?',
    options: ['Making gradient descent faster', 'Sequentially training weak learners where each new model focuses on correcting the errors (residuals) of the combined ensemble so far', 'A type of data augmentation', 'Random Forest with more trees'],
    correctAnswer: 1, explanation: 'Gradient boosting builds models sequentially. Each new model fits the negative gradient (residuals) of the loss function. The final prediction is a sum of all models. Popular implementations: XGBoost, LightGBM, CatBoost.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ensemble-methods',
  },
  {
    id: 'ens-4', text: 'What are the key hyperparameters in XGBoost?',
    options: ['Only learning rate', 'learning_rate (eta), max_depth, n_estimators, min_child_weight, subsample, colsample_bytree, reg_alpha, reg_lambda', 'Only n_estimators', 'XGBoost has no hyperparameters'],
    correctAnswer: 1, explanation: 'Key XGBoost hyperparameters: learning_rate (step size), max_depth (tree complexity), n_estimators (number of trees), subsample/colsample_bytree (randomness), min_child_weight (minimum leaf weight), reg_alpha/reg_lambda (L1/L2 regularization).',
    difficulty: 'hard', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ensemble-methods',
  },
  {
    id: 'ens-5', text: 'What is the difference between XGBoost, LightGBM, and CatBoost?',
    options: ['They are identical', 'XGBoost uses level-wise growth, LightGBM uses leaf-wise growth (faster), CatBoost handles categorical features natively and uses ordered boosting', 'LightGBM is always the best', 'CatBoost is only for categorical data'],
    correctAnswer: 1, explanation: 'XGBoost: level-wise tree growth, strong regularization. LightGBM: leaf-wise growth (faster, may overfit on small data), histogram-based. CatBoost: native categorical handling, ordered boosting to reduce prediction shift. Each has trade-offs.',
    difficulty: 'hard', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ensemble-methods',
  },
  {
    id: 'ens-6', text: 'What is stacking (stacked generalization)?',
    options: ['Stacking data vertically', 'Using predictions from multiple base models as features for a meta-learner that combines them optimally', 'Running the same model multiple times', 'A data preprocessing technique'],
    correctAnswer: 1, explanation: 'Stacking trains diverse base models, then uses their predictions as input features for a meta-learner (often logistic regression or simple model). This allows the meta-learner to learn the optimal way to combine the base models.',
    difficulty: 'hard', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ensemble-methods',
  },
  {
    id: 'ens-7', text: 'What is AdaBoost and how does it differ from gradient boosting?',
    options: ['They are the same', 'AdaBoost reweights misclassified samples at each step; gradient boosting fits new models to the residuals (negative gradient) of the loss function', 'AdaBoost is newer', 'Gradient boosting is a special case of AdaBoost'],
    correctAnswer: 1, explanation: 'AdaBoost adjusts sample weights: misclassified samples get higher weights so subsequent classifiers focus on them. Gradient boosting is more general: each model fits the negative gradient of any differentiable loss function.',
    difficulty: 'hard', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ensemble-methods',
  },
  {
    id: 'ens-8', text: 'Why does bagging reduce variance but not bias?',
    options: ['It always reduces both', 'Averaging multiple models with different training sets reduces random fluctuations (variance) but the average of biased models remains biased', 'Bagging increases variance', 'It reduces bias but not variance'],
    correctAnswer: 1, explanation: 'Bagging trains models on different bootstrap samples, each with different random variations. Averaging smooths out these variations (reducing variance). However, if each model has systematic bias, averaging them preserves that bias.',
    difficulty: 'hard', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ensemble-methods',
  },
  {
    id: 'ens-9', text: 'What is out-of-bag (OOB) error estimation in Random Forest?',
    options: ['Testing on a separate dataset', 'Each tree is evaluated on the ~37% of samples not included in its bootstrap sample, providing a built-in validation estimate without a separate test set', 'A type of cross-validation', 'Error from outlier samples'],
    correctAnswer: 1, explanation: 'In bagging, each bootstrap sample excludes ~37% of data points. OOB error evaluates each sample using only the trees that did NOT include it in training. This provides a free, unbiased estimate of generalization error without needing a separate validation set.',
    difficulty: 'hard', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ensemble-methods',
  },
  {
    id: 'ens-10', text: 'What is feature importance in tree-based models and how is it calculated?',
    options: ['It is based on correlation with the target', 'Typically measured by the total reduction in impurity (Gini/entropy) across all splits that use the feature, or by permutation importance', 'It ranks features alphabetically', 'It requires a separate algorithm'],
    correctAnswer: 1, explanation: 'Impurity-based importance sums the decrease in impurity (Gini/entropy) for all splits using a feature. Permutation importance measures the decrease in model performance when a feature\'s values are randomly shuffled. The latter is generally more reliable.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'ml-fundamentals', lessonId: 'ensemble-methods',
  },

  // ====== UNIT: deep-learning ======
  // Lesson: nn-basics
  {
    id: 'nn-1', text: 'What is an activation function and why is it necessary?',
    options: ['It controls learning rate', 'It introduces non-linearity into the network; without it, a multi-layer network would be equivalent to a single linear transformation', 'It prevents overfitting', 'It normalizes the output'],
    correctAnswer: 1, explanation: 'Activation functions introduce non-linearity. Without them, stacking linear layers f(Wx+b) would just produce another linear function. Non-linearity enables networks to learn complex patterns. Common: ReLU, sigmoid, tanh, GELU.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'nn-basics',
  },
  {
    id: 'nn-2', text: 'What is backpropagation?',
    options: ['Training data flowing backwards', 'An algorithm that computes gradients of the loss with respect to each weight by applying the chain rule from output to input layers', 'A type of regularization', 'Forward propagation in reverse order'],
    correctAnswer: 1, explanation: 'Backpropagation efficiently computes gradients using the chain rule. During the forward pass, activations are computed and stored. During the backward pass, gradients flow from the loss back through the network, enabling gradient-based optimization.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'nn-basics',
  },
  {
    id: 'nn-3', text: 'Why is ReLU preferred over sigmoid as an activation function in hidden layers?',
    options: ['ReLU outputs probabilities', 'ReLU avoids the vanishing gradient problem (gradient is 1 for positive inputs), is computationally cheap, and leads to sparse activations', 'Sigmoid is always better', 'ReLU was invented more recently'],
    correctAnswer: 1, explanation: 'ReLU(x) = max(0,x) has gradient 1 for positive inputs, avoiding vanishing gradients. It is computationally simple and produces sparse activations. Sigmoid saturates at extreme values (gradient → 0), causing vanishing gradients in deep networks.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'nn-basics',
  },
  {
    id: 'nn-4', text: 'What is dropout and how does it prevent overfitting?',
    options: ['Removing training samples', 'Randomly setting a fraction of neuron outputs to zero during training, forcing the network to learn redundant representations', 'Removing layers from the network', 'A type of weight initialization'],
    correctAnswer: 1, explanation: 'Dropout randomly zeroes out neurons during training with probability p (typically 0.2-0.5). This prevents co-adaptation of neurons, acts as ensemble regularization, and forces the network to be robust. At inference, all neurons are used with scaled weights.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'nn-basics',
  },
  {
    id: 'nn-5', text: 'What is batch normalization?',
    options: ['Normalizing the input data', 'Normalizing the inputs to each layer by subtracting the batch mean and dividing by batch standard deviation, with learnable scale and shift parameters', 'A type of dropout', 'Batching the training data'],
    correctAnswer: 1, explanation: 'Batch normalization normalizes layer inputs across the mini-batch: x̂ = (x - μ_batch) / σ_batch, then applies learnable parameters γ and β. It stabilizes training, allows higher learning rates, and acts as a mild regularizer.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'nn-basics',
  },
  {
    id: 'nn-6', text: 'What is the universal approximation theorem?',
    options: ['Any function can be approximated by linear regression', 'A neural network with a single hidden layer containing sufficient neurons can approximate any continuous function on a compact set to arbitrary accuracy', 'Deep networks are always better', 'Only CNNs can approximate functions'],
    correctAnswer: 1, explanation: 'The universal approximation theorem states that a feedforward network with at least one hidden layer and a non-linear activation can approximate any continuous function to any desired precision (given enough neurons). This does not guarantee efficient learning.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'deep-learning', lessonId: 'nn-basics',
  },
  {
    id: 'nn-7', text: 'What is the dying ReLU problem?',
    options: ['ReLU is being deprecated', 'Neurons with ReLU can get stuck outputting zero for all inputs if they enter the negative region, effectively "dying" and never recovering', 'ReLU outputs grow unbounded', 'ReLU causes memory leaks'],
    correctAnswer: 1, explanation: 'If a neuron\'s weights cause all inputs to be negative, ReLU always outputs 0, and the gradient is also 0. The neuron cannot update and is permanently inactive. Solutions include Leaky ReLU, PReLU, and ELU which have non-zero gradients for negative inputs.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'nn-basics',
  },
  {
    id: 'nn-8', text: 'What is weight initialization and why does it matter?',
    options: ['Always initialize to zero', 'Proper initialization (Xavier, He) prevents vanishing/exploding gradients by keeping activation variances stable across layers', 'Initialize to 1 always', 'Initialization does not affect training'],
    correctAnswer: 1, explanation: 'Bad initialization causes vanishing or exploding activations/gradients. Xavier initialization (for sigmoid/tanh) uses Var(w) = 1/n_in. He initialization (for ReLU) uses Var(w) = 2/n_in. Both maintain activation variance across layers.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'deep-learning', lessonId: 'nn-basics',
  },
  {
    id: 'nn-9', text: 'What is the difference between a loss function and a cost function?',
    options: ['They are always different', 'A loss function measures error on a single sample; the cost function is the average loss over the entire training set, often with regularization', 'Cost function is for regression only', 'Loss function includes regularization'],
    correctAnswer: 1, explanation: 'The loss function L(ŷ, y) measures error for a single prediction. The cost function J(θ) averages the loss over all training examples: J = (1/n)Σ L(ŷᵢ, yᵢ) + regularization. In practice, the terms are often used interchangeably.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large'], unitId: 'deep-learning', lessonId: 'nn-basics',
  },
  {
    id: 'nn-10', text: 'What is the exploding gradient problem and how is it addressed?',
    options: ['Gradients become too small', 'Gradients grow exponentially large during backpropagation, causing unstable training; addressed by gradient clipping, proper initialization, and batch normalization', 'A problem with large datasets', 'Only occurs in CNNs'],
    correctAnswer: 1, explanation: 'Exploding gradients occur when gradients multiply to very large values through many layers, causing weight updates to be enormous. Solutions: gradient clipping (capping gradient magnitude), careful initialization, batch normalization, and LSTM/GRU gates for RNNs.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'nn-basics',
  },

  // Lesson: cnn
  {
    id: 'cnn-1', text: 'What is a convolutional layer and what does it do?',
    options: ['A fully connected layer', 'It applies learnable filters (kernels) that slide across the input to detect local patterns like edges, textures, and shapes', 'A pooling operation', 'A normalization layer'],
    correctAnswer: 1, explanation: 'A convolutional layer applies small learnable filters that slide (convolve) across the input. Each filter detects specific local patterns. Early layers detect edges/textures, deeper layers detect complex features. This exploits spatial locality and weight sharing.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'cnn',
  },
  {
    id: 'cnn-2', text: 'What is pooling in CNNs?',
    options: ['Combining multiple models', 'A downsampling operation that reduces spatial dimensions while retaining important features, providing translation invariance', 'Adding noise to inputs', 'A type of activation function'],
    correctAnswer: 1, explanation: 'Pooling reduces spatial dimensions (height, width) while keeping the most important information. Max pooling takes the maximum value in each patch. Average pooling takes the average. It reduces computation and provides some translation invariance.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'cnn',
  },
  {
    id: 'cnn-3', text: 'What is the receptive field in a CNN?',
    options: ['The input image size', 'The region of the input that affects a particular neuron\'s output; it grows with each layer', 'The output feature map size', 'The number of filters'],
    correctAnswer: 1, explanation: 'The receptive field is the area of the original input that influences a given neuron. It grows with depth: each subsequent conv/pooling layer increases the receptive field. Understanding receptive fields is key to designing CNN architectures.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'cnn',
  },
  {
    id: 'cnn-4', text: 'What is a 1×1 convolution and why is it useful?',
    options: ['It does nothing', 'It performs channel-wise linear combination without changing spatial dimensions, used for dimensionality reduction and adding non-linearity', 'It always reduces spatial size', 'It is only used in ResNets'],
    correctAnswer: 1, explanation: '1×1 convolutions act as per-pixel fully connected layers across channels. They can reduce channel dimensions (bottleneck layers), add non-linearity, and mix information across channels without affecting spatial dimensions. Used in Inception, ResNet, etc.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'deep-learning', lessonId: 'cnn',
  },
  {
    id: 'cnn-5', text: 'What is a residual connection (skip connection) and why was it important?',
    options: ['Skipping training on some data', 'Adding the input of a block to its output (x + F(x)), enabling training of very deep networks by providing gradient shortcuts', 'A type of dropout', 'Connecting non-adjacent layers randomly'],
    correctAnswer: 1, explanation: 'Residual connections (ResNet) add the input directly to the output: y = F(x) + x. This creates gradient highways that allow training networks with 100+ layers. The network only needs to learn the residual F(x) = y - x, which is easier.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'cnn',
  },
  {
    id: 'cnn-6', text: 'How do you calculate the output size of a convolutional layer?',
    options: ['Always the same as input', 'Output = (Input - Kernel + 2×Padding) / Stride + 1', 'Output = Input × Kernel', 'Output = Input / Kernel'],
    correctAnswer: 1, explanation: 'The output spatial dimension = (W - K + 2P) / S + 1, where W is input size, K is kernel size, P is padding, and S is stride. For example, input 32×32, kernel 3×3, padding 1, stride 1 → output 32×32.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'cnn',
  },
  {
    id: 'cnn-7', text: 'What is transfer learning in the context of CNNs?',
    options: ['Moving weights between GPUs', 'Using a CNN pre-trained on a large dataset (like ImageNet) as a feature extractor or fine-tuning it for a new task with limited data', 'Training from scratch is always better', 'Only works with the same dataset'],
    correctAnswer: 1, explanation: 'CNN features learned on ImageNet transfer well to many vision tasks. Strategy: use pre-trained model as feature extractor (freeze layers) or fine-tune (unfreeze some/all layers). This drastically reduces data requirements and training time.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'cnn',
  },
  {
    id: 'cnn-8', text: 'What is depthwise separable convolution?',
    options: ['A standard 3×3 convolution', 'Separating a standard convolution into depthwise (spatial filtering per channel) and pointwise (1×1 cross-channel mixing), dramatically reducing parameters and computation', 'Only used for depth estimation', 'A type of pooling'],
    correctAnswer: 1, explanation: 'Depthwise separable convolution factors a standard convolution into: (1) depthwise: one filter per input channel, and (2) pointwise: 1×1 convolution to combine channels. This reduces computation by ~8-9× (for 3×3). Used in MobileNet, Xception.',
    difficulty: 'very_hard', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['faang'], unitId: 'deep-learning', lessonId: 'cnn',
  },
  {
    id: 'cnn-9', text: 'What is data augmentation in deep learning?',
    options: ['Adding more data to the dataset from external sources', 'Applying random transformations (rotation, flipping, cropping, color jitter) to training images to artificially increase dataset diversity and reduce overfitting', 'Duplicating the dataset', 'A database technique'],
    correctAnswer: 1, explanation: 'Data augmentation creates modified versions of training images through transformations (horizontal flip, rotation, scaling, color augmentation, cutout, mixup). This increases effective dataset size, reduces overfitting, and improves generalization.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'cnn',
  },
  {
    id: 'cnn-10', text: 'What is the difference between stride and dilation in convolutions?',
    options: ['They are the same thing', 'Stride controls step size of the filter; dilation inserts gaps between filter elements to increase receptive field without increasing parameters', 'Dilation reduces the filter size', 'Stride increases the receptive field more than dilation'],
    correctAnswer: 1, explanation: 'Stride determines how many pixels the filter moves per step (stride=2 halves spatial dimensions). Dilation inserts spaces between filter weights, expanding the receptive field without adding parameters. A 3×3 filter with dilation 2 has a 5×5 effective receptive field.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'deep-learning', lessonId: 'cnn',
  },

  // Lesson: rnn-sequence
  {
    id: 'rnn-1', text: 'What is a Recurrent Neural Network (RNN)?',
    options: ['A network that reuses layers', 'A neural network with connections that form cycles, allowing it to maintain hidden state and process sequential data', 'A deeper version of a CNN', 'A network that runs recursively on trees'],
    correctAnswer: 1, explanation: 'RNNs have recurrent connections that create a hidden state updated at each time step: h_t = f(W_h·h_{t-1} + W_x·x_t). This enables processing variable-length sequences while maintaining memory of past inputs.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'rnn-sequence',
  },
  {
    id: 'rnn-2', text: 'What problem does LSTM solve that vanilla RNNs cannot?',
    options: ['Speed issues', 'The vanishing gradient problem in long sequences, using gating mechanisms (forget, input, output gates) to control information flow and maintain long-term dependencies', 'Classification tasks', 'Image processing'],
    correctAnswer: 1, explanation: 'Vanilla RNNs struggle with long-term dependencies due to vanishing gradients. LSTMs use a cell state with three gates: forget gate (what to discard), input gate (what to store), and output gate (what to output). This enables learning over long sequences.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'rnn-sequence',
  },
  {
    id: 'rnn-3', text: 'What is a GRU and how does it differ from LSTM?',
    options: ['A completely different architecture', 'GRU simplifies LSTM by combining the forget and input gates into an update gate, using only 2 gates instead of 3, with comparable performance but fewer parameters', 'GRU is always better than LSTM', 'GRU has more parameters'],
    correctAnswer: 1, explanation: 'GRU (Gated Recurrent Unit) has 2 gates: reset gate and update gate (vs LSTM\'s 3). It merges the cell state and hidden state. GRUs have fewer parameters (faster training) and often perform comparably to LSTMs.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'rnn-sequence',
  },
  {
    id: 'rnn-4', text: 'What is teacher forcing in sequence models?',
    options: ['Forcing the model to learn faster', 'During training, feeding the ground-truth output from the previous time step as input to the next step, rather than the model\'s own prediction', 'A type of attention mechanism', 'Using a teacher model for distillation'],
    correctAnswer: 1, explanation: 'Teacher forcing uses the true target sequence as input during training (instead of the model\'s predictions). This speeds up convergence but can cause exposure bias—the model never sees its own errors during training, potentially performing worse at inference.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'deep-learning', lessonId: 'rnn-sequence',
  },
  {
    id: 'rnn-5', text: 'What is a bidirectional RNN?',
    options: ['An RNN that processes data twice', 'An RNN that processes the sequence in both forward and backward directions, capturing context from both past and future', 'A two-layer RNN', 'An RNN for classification only'],
    correctAnswer: 1, explanation: 'A bidirectional RNN runs two separate RNNs: one processes the sequence forward (left-to-right) and one backward (right-to-left). Their hidden states are concatenated, giving each position context from the entire sequence. Used in BERT-style models.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'rnn-sequence',
  },
  {
    id: 'rnn-6', text: 'What is the sequence-to-sequence (seq2seq) architecture?',
    options: ['Converting sequences to fixed vectors', 'An encoder-decoder architecture where an encoder processes the input sequence into a context vector, and a decoder generates the output sequence', 'A classification model', 'A type of attention mechanism'],
    correctAnswer: 1, explanation: 'Seq2seq uses an encoder to compress an input sequence into a fixed context vector, then a decoder generates the output sequence from this vector. Used in machine translation, summarization, and chatbots. Enhanced with attention mechanisms.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'rnn-sequence',
  },
  {
    id: 'rnn-7', text: 'What is the attention mechanism in the context of sequence models?',
    options: ['A regularization technique', 'A mechanism that allows the decoder to focus on different parts of the input sequence at each step, computing a weighted sum of encoder hidden states', 'Making the model pay attention to important features', 'A type of loss function'],
    correctAnswer: 1, explanation: 'Attention computes alignment scores between the decoder state and all encoder states, normalizes them (softmax), and creates a weighted sum (context vector). This allows the model to "attend" to relevant input parts, solving the information bottleneck of fixed context vectors.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'deep-learning', lessonId: 'rnn-sequence',
  },
  {
    id: 'rnn-8', text: 'What is beam search in sequence generation?',
    options: ['A random sampling method', 'A search algorithm that keeps the top-k most likely partial sequences at each step, balancing between greedy decoding and exhaustive search', 'A training algorithm', 'A type of attention'],
    correctAnswer: 1, explanation: 'Beam search maintains k (beam width) best candidate sequences at each step. At each position, it expands all candidates, scores them, and keeps the top k. Beam width=1 is greedy decoding. Larger beams explore more possibilities but are slower.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'deep-learning', lessonId: 'rnn-sequence',
  },
  {
    id: 'rnn-9', text: 'What is truncated backpropagation through time (TBPTT)?',
    options: ['A faster form of backpropagation', 'Limiting backpropagation to a fixed number of time steps to reduce computational cost and memory, while approximating the full gradient', 'Removing certain layers during backprop', 'A type of gradient clipping'],
    correctAnswer: 1, explanation: 'TBPTT limits gradient computation to a fixed window of time steps instead of the full sequence. This reduces memory and computation for long sequences at the cost of not capturing very long-range dependencies. It is a practical necessity for training RNNs on long sequences.',
    difficulty: 'very_hard', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['faang'], unitId: 'deep-learning', lessonId: 'rnn-sequence',
  },
  {
    id: 'rnn-10', text: 'Why have Transformers largely replaced RNNs for sequence modeling?',
    options: ['Transformers are simpler', 'Transformers process all positions in parallel (not sequential), have better long-range dependency modeling via self-attention, and scale better with modern hardware', 'RNNs are no longer supported', 'Transformers use less memory'],
    correctAnswer: 1, explanation: 'RNNs process tokens sequentially (cannot parallelize), struggle with long-range dependencies despite LSTM/GRU, and are slower to train. Transformers use self-attention to process all positions simultaneously, capture any-range dependencies, and exploit GPU parallelism.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'rnn-sequence',
  },

  // Lesson: training-optimization
  {
    id: 'train-1', text: 'What is learning rate scheduling?',
    options: ['Setting the learning rate to a constant', 'Adjusting the learning rate during training according to a schedule (step decay, cosine annealing, warmup) to improve convergence', 'Training at different times of day', 'A type of regularization'],
    correctAnswer: 1, explanation: 'Learning rate schedules reduce the learning rate during training. Common strategies: step decay (reduce by factor every N epochs), cosine annealing (smooth decrease), warmup (start low, increase, then decrease). These help reach better minima.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'training-optimization',
  },
  {
    id: 'train-2', text: 'What is early stopping?',
    options: ['Ending a project early', 'Monitoring validation loss during training and stopping when it starts to increase, preventing overfitting', 'Stopping at a fixed number of epochs', 'A way to speed up training'],
    correctAnswer: 1, explanation: 'Early stopping monitors validation performance during training. When validation loss stops improving (or starts increasing) for a patience period, training is stopped. This prevents overfitting by finding the right number of training iterations.',
    difficulty: 'easy', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'training-optimization',
  },
  {
    id: 'train-3', text: 'What is gradient clipping?',
    options: ['Removing small gradients', 'Capping the gradient magnitude to prevent exploding gradients, typically by scaling the gradient if its norm exceeds a threshold', 'A type of activation function', 'Clipping weights directly'],
    correctAnswer: 1, explanation: 'Gradient clipping prevents exploding gradients by scaling the gradient vector if its norm exceeds a threshold: if ||g|| > max_norm, g = g × (max_norm / ||g||). This is essential for training RNNs and is commonly used in Transformer training too.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'training-optimization',
  },
  {
    id: 'train-4', text: 'What is mixed precision training?',
    options: ['Using different optimizers', 'Training with both FP16 and FP32 precision to speed up computation and reduce memory while maintaining accuracy through loss scaling', 'Mixing different datasets', 'A type of data augmentation'],
    correctAnswer: 1, explanation: 'Mixed precision uses FP16 for most computations (2× speed, 50% memory) while keeping master weights in FP32 for accuracy. Loss scaling prevents underflow in FP16 gradients. Supported by NVIDIA GPUs via Tensor Cores, commonly used in modern training.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer', 'mlops_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'deep-learning', lessonId: 'training-optimization',
  },
  {
    id: 'train-5', text: 'What is knowledge distillation?',
    options: ['Summarizing research papers', 'Training a smaller "student" model to mimic the outputs (soft predictions) of a larger "teacher" model, compressing model size while retaining most performance', 'Extracting features manually', 'A data preprocessing step'],
    correctAnswer: 1, explanation: 'Knowledge distillation trains a compact student model using the soft probability outputs of a larger teacher model (temperature-scaled softmax). The student learns the teacher\'s "dark knowledge" about inter-class similarities, often outperforming a student trained on hard labels alone.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'deep-learning', lessonId: 'training-optimization',
  },
  {
    id: 'train-6', text: 'What is the difference between model parallelism and data parallelism?',
    options: ['They are the same', 'Data parallelism splits data across GPUs (each has full model); model parallelism splits the model across GPUs (each has part of the model)', 'Model parallelism is always faster', 'Data parallelism requires more memory per GPU'],
    correctAnswer: 1, explanation: 'Data parallelism: each GPU has a full model copy and processes different data batches, gradients are synchronized. Model parallelism: the model is split across GPUs (different layers on different GPUs). Data parallelism is simpler; model parallelism is needed for very large models.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer', 'mlops_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'deep-learning', lessonId: 'training-optimization',
  },
  {
    id: 'train-7', text: 'What is label smoothing?',
    options: ['Interpolating between labels', 'Replacing hard one-hot labels with soft labels (e.g., 0.9 for correct class, 0.1/(K-1) for others) to improve generalization and calibration', 'Smoothing the loss curve', 'A data augmentation technique'],
    correctAnswer: 1, explanation: 'Label smoothing replaces hard targets [0, 1] with soft targets [ε/K, 1-ε+ε/K]. This prevents the model from becoming overconfident, improves calibration, and acts as regularization. Commonly used with ε = 0.1.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'deep-learning', lessonId: 'training-optimization',
  },
  {
    id: 'train-8', text: 'What is the purpose of a warmup period in training?',
    options: ['Preloading data into memory', 'Starting with a very small learning rate and gradually increasing it to allow the model to stabilize before using the full learning rate', 'Training on easy examples first', 'GPU initialization'],
    correctAnswer: 1, explanation: 'Warmup starts with a very low learning rate and linearly increases it over a set number of steps. This is especially important for Transformers and large batch training, where a high initial learning rate can cause training instability before the model\'s statistics stabilize.',
    difficulty: 'medium', roles: ['ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'training-optimization',
  },
  {
    id: 'train-9', text: 'What is the difference between fine-tuning and feature extraction in transfer learning?',
    options: ['They are identical', 'Feature extraction freezes pre-trained layers and only trains new classifier layers; fine-tuning unfreezes some/all pre-trained layers and trains them with a small learning rate', 'Fine-tuning is always better', 'Feature extraction trains all layers'],
    correctAnswer: 1, explanation: 'Feature extraction: freeze all pre-trained weights, train only new task-specific layers. Fast but limited adaptation. Fine-tuning: unfreeze some/all layers and train with small learning rate. Better adaptation but risks overfitting on small datasets.',
    difficulty: 'medium', roles: ['data_scientist', 'ml_engineer', 'ai_engineer'], category: 'technical', companySizes: ['startup', 'midsize', 'large', 'faang'], unitId: 'deep-learning', lessonId: 'training-optimization',
  },
  {
    id: 'train-10', text: 'What is gradient accumulation and when is it useful?',
    options: ['Storing all gradients in memory', 'Accumulating gradients over multiple mini-batches before performing a weight update, effectively simulating a larger batch size with limited GPU memory', 'A type of optimizer', 'Accumulating weights over time'],
    correctAnswer: 1, explanation: 'Gradient accumulation runs forward/backward passes on multiple mini-batches, summing the gradients, then performs one weight update. This simulates training with larger batch sizes when GPU memory is limited, which is common with large models like LLMs.',
    difficulty: 'hard', roles: ['ml_engineer', 'ai_engineer', 'mlops_engineer'], category: 'technical', companySizes: ['large', 'faang'], unitId: 'deep-learning', lessonId: 'training-optimization',
  },
];
