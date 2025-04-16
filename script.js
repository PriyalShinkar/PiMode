// Calculator State
const calculator = {
    currentValue: '0',
    previousValue: '',
    operation: null,
    memory: 0,
    history: [],
    isScientificMode: false,
    expression: '',
    lastResult: null,
    lastOperation: null,
    parenthesesCount: 0,
    inParentheses: false
};

// Constants
const CONSTANTS = {
    PI: Math.PI,
    E: Math.E
};

// Easter Eggs and Fun Messages
const FUN_MESSAGES = [
    "Wow, that's a big number! 🌟",
    "Math is fun! 🎮",
    "You're a math wizard! 🧙‍♂️",
    "Calculating the meaning of life... 🤔",
    "Infinite possibilities! ♾️",
    "Math is like a puzzle! 🧩",
    "You're on fire! 🔥",
    "Keep calculating! 💪"
];

// Theme Management
const themes = {
    light: 'light',
    dark: 'dark',
    neon: 'neon',
    retro: 'retro'
};

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    initializeCalculator();
    setupEventListeners();
    setupThemeSwitcher();
    setupModeToggle();
    setupPanels();
    setupUtilities();
    setupQuiz();
});

// Initialize calculator display and state
function initializeCalculator() {
    updateDisplay();
    updateExpressionPreview();
}

// Setup all event listeners
function setupEventListeners() {
    // Number buttons
    document.querySelectorAll('.btn.number').forEach(button => {
        button.addEventListener('click', () => {
            // If we just performed a scientific function, clear the current value
            if (calculator.lastOperation === 'function') {
                calculator.currentValue = '0';
                calculator.lastOperation = null;
            }
            handleNumber(button.textContent);
        });
    });

    // Operator buttons
    document.querySelectorAll('.btn.operator').forEach(button => {
        button.addEventListener('click', () => handleOperator(button.dataset.action));
    });

    // Function buttons (scientific mode)
    document.querySelectorAll('.btn.function').forEach(button => {
        button.addEventListener('click', () => {
            calculator.lastOperation = 'function';
            handleFunction(button.dataset.action);
        });
    });

    // Special buttons (parentheses and constants)
    document.querySelectorAll('.btn.special').forEach(button => {
        button.addEventListener('click', () => {
            calculator.lastOperation = 'special';
            handleSpecial(button.dataset.action);
        });
    });

    // Memory buttons
    document.querySelectorAll('.btn.memory').forEach(button => {
        button.addEventListener('click', () => handleMemory(button.dataset.action));
    });

    // Clear buttons
    document.querySelectorAll('[data-action="clear"]').forEach(button => {
        button.addEventListener('click', clearCalculator);
    });

    // All Clear buttons
    document.querySelectorAll('[data-action="all-clear"]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.currentValue = '0';
            calculator.previousValue = '';
            calculator.operation = null;
            calculator.expression = '';
            calculator.memory = 0;
            updateDisplay();
            updateExpressionPreview();
        });
    });

    // Backspace buttons
    document.querySelectorAll('[data-action="backspace"]').forEach(button => {
        button.addEventListener('click', () => {
            if (calculator.currentValue.length > 1) {
                calculator.currentValue = calculator.currentValue.slice(0, -1);
            } else {
                calculator.currentValue = '0';
            }
            updateDisplay();
            updateExpressionPreview();
        });
    });

    // Equals buttons
    document.querySelectorAll('[data-action="equals"]').forEach(button => {
        button.addEventListener('click', calculateResult);
    });
}

// Handle number input
function handleNumber(num) {
    if (calculator.currentValue === '0' && num !== '.') {
        calculator.currentValue = num;
    } else if (num === '.' && !calculator.currentValue.includes('.')) {
        calculator.currentValue += num;
    } else if (num !== '.') {
        calculator.currentValue += num;
    }
    updateDisplay();
    updateExpressionPreview();
}

// Handle operator input
function handleOperator(operator) {
    if (calculator.operation && calculator.previousValue) {
        calculateResult();
    }
    calculator.previousValue = calculator.currentValue;
    calculator.operation = operator;
    calculator.currentValue = '0';
    updateDisplay();
    updateExpressionPreview();
}

// Handle scientific functions
function handleFunction(func) {
    const value = parseFloat(calculator.currentValue);
    let result;

    // Check for invalid input
    if (isNaN(value)) {
        calculator.currentValue = 'Error';
        updateDisplay();
        updateExpressionPreview();
        return;
    }

    try {
        switch (func) {
            case 'sin':
                // Convert degrees to radians and calculate sin
                result = Math.sin((value * Math.PI) / 180);
                break;
            case 'cos':
                // Convert degrees to radians and calculate cos
                result = Math.cos((value * Math.PI) / 180);
                break;
            case 'tan':
                // Convert degrees to radians and calculate tan
                result = Math.tan((value * Math.PI) / 180);
                break;
            case 'log':
                // Check for valid input for logarithm
                if (value <= 0) {
                    throw new Error('Invalid input for logarithm');
                }
                result = Math.log10(value);
                break;
            case 'ln':
                // Check for valid input for natural logarithm
                if (value <= 0) {
                    throw new Error('Invalid input for natural logarithm');
                }
                result = Math.log(value);
                break;
            case 'factorial':
                result = calculateFactorial(value);
                break;
            default:
                throw new Error('Unknown function');
        }

        // Round the result to 8 decimal places to avoid floating point issues
        result = Math.round(result * 100000000) / 100000000;
        
        // Check if the result is valid
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid result');
        }

        // Add to history
        const expression = `${func}(${calculator.currentValue})`;
        calculator.history.push({
            expression,
            result: result.toString()
        });

        // Store the result and update display
        calculator.currentValue = result.toString();
        calculator.previousValue = '';
        calculator.operation = null;
        updateDisplay();
        updateExpressionPreview();
        updateHistory();

    } catch (error) {
        calculator.currentValue = 'Error';
        calculator.previousValue = '';
        calculator.operation = null;
        updateDisplay();
        updateExpressionPreview();
    }
}

// Handle memory operations
function handleMemory(action) {
    switch (action) {
        case 'mc':
            calculator.memory = 0;
            break;
        case 'mr':
            calculator.currentValue = calculator.memory.toString();
            break;
        case 'm-plus':
            calculator.memory += parseFloat(calculator.currentValue);
            break;
        case 'm-minus':
            calculator.memory -= parseFloat(calculator.currentValue);
            break;
    }
    updateDisplay();
}

// Calculate factorial
function calculateFactorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Calculate the final result
function calculateResult() {
    if (!calculator.operation && !calculator.previousValue) {
        // If there's no operation, just keep the current value
        return;
    }

    try {
        // Handle expressions with parentheses
        let expression = calculator.previousValue;
        if (calculator.operation) {
            expression += getOperatorSymbol(calculator.operation) + calculator.currentValue;
        } else {
            expression = calculator.currentValue;
        }

        // Replace implicit multiplication (e.g., (2+3)6 becomes (2+3)*6)
        expression = expression.replace(/\)(\d+)/g, ')*$1');
        expression = expression.replace(/\)([eπ])/g, ')*$1');
        expression = expression.replace(/(\d+)\(/g, '$1*(');
        expression = expression.replace(/([eπ])\(/g, '$1*(');

        // Evaluate the expression
        let result;
        try {
            // Use Function constructor to safely evaluate the expression
            result = new Function('return ' + expression)();
        } catch (error) {
            throw new Error('Invalid expression');
        }

        // Check for invalid results
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid result');
        }

        // Add to history
        calculator.history.push({
            expression: expression,
            result: result.toString()
        });

        // Show fun message for large numbers
        if (Math.abs(result) > 1000000) {
            showFunMessage();
        }

        calculator.lastResult = result;
        calculator.currentValue = result.toString();
        calculator.operation = null;
        calculator.previousValue = '';
        updateDisplay();
        updateExpressionPreview();
        updateHistory();

    } catch (error) {
        calculator.currentValue = 'Error';
        calculator.operation = null;
        calculator.previousValue = '';
        updateDisplay();
        updateExpressionPreview();
    }
}

// Get operator symbol for display
function getOperatorSymbol(operator) {
    const symbols = {
        'add': '+',
        'subtract': '−',
        'multiply': '×',
        'divide': '÷',
        'power': '^',
        'percent': '%',
        'sqrt': '√'
    };
    return symbols[operator] || operator;
}

// Clear calculator state
function clearCalculator() {
    calculator.currentValue = '0';
    calculator.previousValue = '';
    calculator.operation = null;
    calculator.expression = '';
    updateDisplay();
    updateExpressionPreview();
}

// Update the display
function updateDisplay() {
    document.querySelector('.result').textContent = calculator.currentValue;
}

// Update expression preview
function updateExpressionPreview() {
    let preview = '';
    if (calculator.previousValue) {
        preview += calculator.previousValue;
    }
    if (calculator.operation) {
        preview += ` ${getOperatorSymbol(calculator.operation)} `;
    }
    if (calculator.currentValue !== '0') {
        preview += calculator.currentValue;
    }
    document.querySelector('.expression-preview').textContent = preview;
}

// Setup theme switcher
function setupThemeSwitcher() {
    document.querySelectorAll('.theme-btn').forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('calculator-theme', theme);
        });
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('calculator-theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
}

// Setup mode toggle
function setupModeToggle() {
    document.querySelectorAll('.mode-btn').forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.mode;
            calculator.isScientificMode = mode === 'scientific';
            
            // Update UI
            document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            document.querySelector('.basic-mode').classList.toggle('hidden', calculator.isScientificMode);
            document.querySelector('.scientific-mode').classList.toggle('hidden', !calculator.isScientificMode);
        });
    });
}

// Setup panels (history, utilities, quiz)
function setupPanels() {
    const sidePanels = document.querySelector('.side-panels');
    
    // Mode toggle button
    document.querySelector('.mode-toggle-btn').addEventListener('click', () => {
        sidePanels.classList.toggle('active');
        // Show mode panel by default when opening side panels
        if (sidePanels.classList.contains('active')) {
            document.querySelector('.mode-panel').style.display = 'block';
            document.querySelector('.history-panel').style.display = 'none';
            document.querySelector('.utilities-panel').style.display = 'none';
            document.querySelector('.quiz-panel').style.display = 'none';
        }
    });

    // History toggle button
    document.querySelector('.history-toggle').addEventListener('click', () => {
        sidePanels.classList.toggle('active');
        // Show history panel when history toggle is clicked
        if (sidePanels.classList.contains('active')) {
            document.querySelector('.mode-panel').style.display = 'none';
            document.querySelector('.history-panel').style.display = 'block';
            document.querySelector('.utilities-panel').style.display = 'none';
            document.querySelector('.quiz-panel').style.display = 'none';
        }
    });

    // Utilities toggle button
    document.querySelector('.utilities-toggle').addEventListener('click', () => {
        sidePanels.classList.toggle('active');
        // Show utilities panel when utilities toggle is clicked
        if (sidePanels.classList.contains('active')) {
            document.querySelector('.mode-panel').style.display = 'none';
            document.querySelector('.history-panel').style.display = 'none';
            document.querySelector('.utilities-panel').style.display = 'block';
            document.querySelector('.quiz-panel').style.display = 'none';
        }
    });

    // Quiz toggle button
    document.querySelector('.quiz-toggle').addEventListener('click', () => {
        sidePanels.classList.toggle('active');
        // Show quiz panel when quiz toggle is clicked
        if (sidePanels.classList.contains('active')) {
            document.querySelector('.mode-panel').style.display = 'none';
            document.querySelector('.history-panel').style.display = 'none';
            document.querySelector('.utilities-panel').style.display = 'none';
            document.querySelector('.quiz-panel').style.display = 'block';
        }
    });

    // Close side panels when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidePanels.contains(e.target) && 
            !e.target.closest('.mode-toggle-btn') && 
            !e.target.closest('.history-toggle') && 
            !e.target.closest('.utilities-toggle') && 
            !e.target.closest('.quiz-toggle')) {
            sidePanels.classList.remove('active');
        }
    });
}

// Update history display
function updateHistory() {
    const historyList = document.querySelector('.history-list');
    historyList.innerHTML = '';
    
    calculator.history.slice().reverse().forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item fade-in';
        historyItem.innerHTML = `
            <div class="expression">${item.expression}</div>
            <div class="result">= ${item.result}</div>
        `;
        historyList.appendChild(historyItem);
    });
}

// Show fun message
function showFunMessage() {
    const message = FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)];
    const messageElement = document.createElement('div');
    messageElement.className = 'fun-message rainbow-text';
    messageElement.textContent = message;
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

// Setup utilities (timer, converters)
function setupUtilities() {
    // Timer
    let timerInterval;
    let timerSeconds = 0;
    const timerDisplay = document.querySelector('.timer-display');
    
    document.querySelectorAll('.timer-btn').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            
            switch (action) {
                case 'start':
                    timerInterval = setInterval(() => {
                        timerSeconds++;
                        updateTimerDisplay();
                    }, 1000);
                    break;
                case 'stop':
                    clearInterval(timerInterval);
                    break;
                case 'reset':
                    timerSeconds = 0;
                    updateTimerDisplay();
                    break;
            }
        });
    });

    function updateTimerDisplay() {
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Number system converter
    const converterInput = document.querySelector('.converter-input');
    const converterType = document.querySelector('.converter-type');
    const converterResult = document.querySelector('.converter-result');

    function updateConverter() {
        const value = converterInput.value;
        const type = converterType.value;
        let result = '';

        try {
            switch (type) {
                case 'decimal':
                    result = `Binary: ${parseInt(value, 10).toString(2)}\nHex: ${parseInt(value, 10).toString(16)}\nOctal: ${parseInt(value, 10).toString(8)}`;
                    break;
                case 'binary':
                    result = `Decimal: ${parseInt(value, 2)}\nHex: ${parseInt(value, 2).toString(16)}\nOctal: ${parseInt(value, 2).toString(8)}`;
                    break;
                case 'hex':
                    result = `Decimal: ${parseInt(value, 16)}\nBinary: ${parseInt(value, 16).toString(2)}\nOctal: ${parseInt(value, 16).toString(8)}`;
                    break;
                case 'octal':
                    result = `Decimal: ${parseInt(value, 8)}\nBinary: ${parseInt(value, 8).toString(2)}\nHex: ${parseInt(value, 8).toString(16)}`;
                    break;
            }
        } catch (e) {
            result = 'Invalid input';
        }

        converterResult.textContent = result;
    }

    converterInput.addEventListener('input', updateConverter);
    converterType.addEventListener('change', updateConverter);

    // Unit converter
    const unitType = document.querySelector('.unit-type');
    const unitInputs = document.querySelector('.unit-converter-inputs');

    const unitConversions = {
        temperature: {
            units: ['Celsius', 'Fahrenheit', 'Kelvin'],
            convert: (value, from, to) => {
                let celsius;
                switch (from) {
                    case 'Celsius':
                        celsius = value;
                        break;
                    case 'Fahrenheit':
                        celsius = (value - 32) * 5/9;
                        break;
                    case 'Kelvin':
                        celsius = value - 273.15;
                        break;
                }
                switch (to) {
                    case 'Celsius':
                        return celsius;
                    case 'Fahrenheit':
                        return celsius * 9/5 + 32;
                    case 'Kelvin':
                        return celsius + 273.15;
                }
            }
        },
        weight: {
            units: ['Kilograms', 'Pounds', 'Ounces'],
            convert: (value, from, to) => {
                let kg;
                switch (from) {
                    case 'Kilograms':
                        kg = value;
                        break;
                    case 'Pounds':
                        kg = value * 0.453592;
                        break;
                    case 'Ounces':
                        kg = value * 0.0283495;
                        break;
                }
                switch (to) {
                    case 'Kilograms':
                        return kg;
                    case 'Pounds':
                        return kg * 2.20462;
                    case 'Ounces':
                        return kg * 35.274;
                }
            }
        },
        distance: {
            units: ['Meters', 'Feet', 'Inches'],
            convert: (value, from, to) => {
                let meters;
                switch (from) {
                    case 'Meters':
                        meters = value;
                        break;
                    case 'Feet':
                        meters = value * 0.3048;
                        break;
                    case 'Inches':
                        meters = value * 0.0254;
                        break;
                }
                switch (to) {
                    case 'Meters':
                        return meters;
                    case 'Feet':
                        return meters * 3.28084;
                    case 'Inches':
                        return meters * 39.3701;
                }
            }
        }
    };

    function updateUnitConverter() {
        const type = unitType.value;
        const conversion = unitConversions[type];
        
        unitInputs.innerHTML = conversion.units.map(unit => `
            <div class="unit-input">
                <label>${unit}</label>
                <input type="number" data-unit="${unit}" placeholder="Enter value">
            </div>
        `).join('');

        unitInputs.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const fromUnit = e.target.dataset.unit;
                
                unitInputs.querySelectorAll('input').forEach(otherInput => {
                    if (otherInput !== e.target) {
                        const toUnit = otherInput.dataset.unit;
                        otherInput.value = conversion.convert(value, fromUnit, toUnit).toFixed(2);
                    }
                });
            });
        });
    }

    unitType.addEventListener('change', updateUnitConverter);
    updateUnitConverter();
}

// Setup quiz functionality
function setupQuiz() {
    let score = 0;
    const quizQuestion = document.querySelector('.quiz-question');
    const quizAnswer = document.querySelector('.quiz-answer');
    const quizSubmit = document.querySelector('.quiz-submit');
    const quizScore = document.querySelector('.quiz-score');

    function generateQuestion() {
        const operations = ['+', '-', '×'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2, answer;

        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * 100);
                num2 = Math.floor(Math.random() * 100);
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 100);
                num2 = Math.floor(Math.random() * num1);
                answer = num1 - num2;
                break;
            case '×':
                num1 = Math.floor(Math.random() * 12);
                num2 = Math.floor(Math.random() * 12);
                answer = num1 * num2;
                break;
        }

        quizQuestion.textContent = `${num1} ${operation} ${num2} = ?`;
        return answer;
    }

    let currentAnswer;

    function startNewQuestion() {
        currentAnswer = generateQuestion();
        quizAnswer.value = '';
    }

    quizSubmit.addEventListener('click', () => {
        const userAnswer = parseInt(quizAnswer.value);
        if (userAnswer === currentAnswer) {
            score++;
            quizScore.textContent = `Score: ${score}`;
            showFunMessage();
        }
        startNewQuestion();
    });

    startNewQuestion();
}

// Handle special buttons (parentheses and constants)
function handleSpecial(action) {
    switch (action) {
        case 'open-parenthesis':
            handleOpenParenthesis();
            break;
        case 'close-parenthesis':
            handleCloseParenthesis();
            break;
        case 'e':
            handleConstant('E');
            break;
        case 'pi':
            handleConstant('PI');
            break;
    }
    updateDisplay();
    updateExpressionPreview();
}

// Handle opening parenthesis
function handleOpenParenthesis() {
    if (calculator.currentValue === '0' || calculator.lastOperation === 'function') {
        // Start new parentheses
        calculator.currentValue = '(';
        calculator.inParentheses = true;
        calculator.parenthesesCount++;
    } else {
        // Start new parentheses after a number
        calculator.currentValue += '(';
        calculator.inParentheses = true;
        calculator.parenthesesCount++;
    }
}

// Handle closing parenthesis
function handleCloseParenthesis() {
    if (calculator.inParentheses) {
        // Close parentheses if we're inside them
        calculator.currentValue += ')';
        calculator.parenthesesCount--;
        if (calculator.parenthesesCount === 0) {
            calculator.inParentheses = false;
        }
    }
}

// Handle constants (e, π)
function handleConstant(constant) {
    if (calculator.currentValue === '0' || calculator.lastOperation === 'function') {
        calculator.currentValue = CONSTANTS[constant].toString();
    } else {
        calculator.currentValue += CONSTANTS[constant].toString();
    }
} 