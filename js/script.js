class Calculator {
    constructor(expressionElement, resultElement) {
        this.expressionElement = expressionElement;
        this.resultElement = resultElement;
        this.history = [];
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.expression = '';
        this.result = '0';
        this.isFinished = false;
        this.updateDisplay();
    }

    delete() {
        if (this.isFinished) {
            this.clear();
            return;
        }
        if (this.expression === '') return;
        this.expression = this.expression.toString().slice(0, -1);
        this.calculateLiveResult();
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.isFinished) {
            this.expression = '';
            this.isFinished = false;
        }
        
        // Prevent multiple decimals in the current number
        if (number === '.') {
            const parts = this.expression.split(/[\+\−\×\÷]/);
            const currentPart = parts[parts.length - 1];
            if (currentPart.includes('.')) return;
        }
        
        // Prevent leading zeros issues
        if (this.expression === '' && (number === '00' || number === '0')) {
            this.expression = '0';
            this.calculateLiveResult();
            this.updateDisplay();
            return;
        }
        
        if (this.expression === '0' && number !== '.') {
            this.expression = number;
        } else {
            this.expression += number;
        }
        
        this.calculateLiveResult();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.isFinished) {
            this.expression = this.result;
            this.isFinished = false;
        }

        if (this.expression === '') {
            if (operation === '−' || operation === '-') {
                this.expression = '−';
                this.updateDisplay();
            }
            return;
        }
        
        const lastChar = this.expression.slice(-1);

        if (['+', '−', '×', '÷'].includes(lastChar)) {
            // Replace last operation
            this.expression = this.expression.slice(0, -1) + operation;
        } else {
            this.expression += operation;
        }
        
        this.updateDisplay();
    }
    
    applyPercent() {
        if (this.expression === '') return;
        
        try {
            // Very simple percentage calculation based on the current live result or expression
            let evalExpr = this.expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
            if (['+', '-', '*', '/'].includes(evalExpr.slice(-1))) {
                evalExpr = evalExpr.slice(0, -1);
            }
            const result = new Function('return ' + evalExpr)();
            const percentResult = result / 100;
            this.expression = percentResult.toString();
            this.result = '';
            this.updateDisplay();
        } catch (e) {
            // Ignore error if expression is incomplete
        }
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res;
    }

    toRad(val) {
        const isDeg = document.querySelector('input[name="angle"]:checked').value === 'deg';
        return isDeg ? val * (Math.PI / 180) : val;
    }

    toDeg(val) {
        const isDeg = document.querySelector('input[name="angle"]:checked').value === 'deg';
        return isDeg ? val * (180 / Math.PI) : val;
    }

    formatExpressionForEval(expr) {
        let evalExpr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        
        if (['+', '-', '*', '/'].includes(evalExpr.slice(-1))) {
            evalExpr = evalExpr.slice(0, -1);
        }

        evalExpr = evalExpr.replace(/π/g, 'Math.PI');
        evalExpr = evalExpr.replace(/e/g, 'Math.E');
        
        // Custom root formatting
        evalExpr = evalExpr.replace(/(\d+(?:\.\d+)?)y√(\d+(?:\.\d+)?|\([^)]+\))/g, 'Math.pow($2, 1/$1)');
        evalExpr = evalExpr.replace(/³√\(/g, 'Math.cbrt(');
        evalExpr = evalExpr.replace(/√\(/g, 'Math.sqrt(');
        
        evalExpr = evalExpr.replace(/\^/g, '**');
        
        evalExpr = evalExpr.replace(/log\(/g, 'Math.log10(');
        evalExpr = evalExpr.replace(/ln\(/g, 'Math.log(');
        evalExpr = evalExpr.replace(/(\d+)!/g, 'fact($1)');

        return evalExpr;
    }

    evaluateExpression(evalExpr) {
        return new Function(
            'fact', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 
            'return ' + evalExpr
        )(
            this.factorial,
            (v) => Math.sin(this.toRad(v)),
            (v) => Math.cos(this.toRad(v)),
            (v) => Math.tan(this.toRad(v)),
            (v) => this.toDeg(Math.asin(v)),
            (v) => this.toDeg(Math.acos(v)),
            (v) => this.toDeg(Math.atan(v))
        );
    }

    calculateLiveResult() {
        if (this.expression === '' || this.expression === '−') {
            this.result = '0';
            return;
        }

        try {
            let evalExpr = this.formatExpressionForEval(this.expression);
            const result = this.evaluateExpression(evalExpr);
            
            // Format result (prevent very long decimals)
            if (result !== undefined && !isNaN(result)) {
                // Round to 8 decimal places max to avoid floating point issues
                this.result = (Math.round(result * 100000000) / 100000000).toString();
            } else {
                this.result = '';
            }
        } catch (error) {
            // Silent catch for incomplete expressions while typing
            this.result = '';
        }
    }

    calculateFinal() {
        if (this.expression === '') return;
        
        try {
            let evalExpr = this.formatExpressionForEval(this.expression);
            const result = this.evaluateExpression(evalExpr);
            
            if (result !== undefined && !isNaN(result)) {
                const finalResult = Math.round(result * 100000000) / 100000000;
                
                // Add to history
                this.history.unshift({
                    expression: this.expression + '=',
                    result: finalResult.toString()
                });
                this.renderHistory();

                // Animate history icon
                const historyBtn = document.getElementById('history-btn');
                historyBtn.classList.remove('history-add-anim');
                void historyBtn.offsetWidth; // trigger reflow
                historyBtn.classList.add('history-add-anim');

                this.result = finalResult.toString();
                this.isFinished = true;
            }
        } catch (error) {
            this.result = 'Error';
        }
        
        this.updateDisplay();
    }

    adjustFontSize(element, defaultSize) {
        element.style.fontSize = defaultSize + 'px';
        let currentSize = defaultSize;
        const MIN_FONT_SIZE = 24; // Minimum readable font size
        // Decrease font size if text overflows (scrollWidth > clientWidth)
        while (element.scrollWidth > element.clientWidth + 1 && currentSize > MIN_FONT_SIZE) {
            currentSize -= 1;
            element.style.fontSize = currentSize + 'px';
        }
    }

    formatWithCommas(str) {
        if (!str) return '';
        return str.replace(/\d+(?:\.\d*)?/g, (match) => {
            const parts = match.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join('.');
        });
    }

    updateDisplay() {
        this.expressionElement.innerText = this.formatWithCommas(this.expression);
        this.resultElement.innerText = this.formatWithCommas(this.result);
        
        // Toggle active states
        if (this.isFinished) {
            this.expressionElement.classList.remove('active');
            this.resultElement.classList.add('active');
        } else {
            this.expressionElement.classList.add('active');
            this.resultElement.classList.remove('active');
        }
        
        // Apply dynamic font resizing
        this.adjustFontSize(this.expressionElement, this.isFinished ? 28 : 48);
        this.adjustFontSize(this.resultElement, this.isFinished ? 48 : 28);
    }
    renderHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<div style="color: #888; text-align: center; margin-top: 20px;">No history yet</div>';
            return;
        }

        this.history.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('history-item');
            
            const exprDiv = document.createElement('div');
            exprDiv.classList.add('hist-expr');
            exprDiv.innerText = item.expression;
            
            const resDiv = document.createElement('div');
            resDiv.classList.add('hist-res');
            resDiv.innerText = item.result;
            
            itemDiv.appendChild(exprDiv);
            itemDiv.appendChild(resDiv);
            
            // Allow clicking history to load it
            itemDiv.addEventListener('click', () => {
                this.expression = item.expression.slice(0, -1); // Remove the '=' sign
                this.result = item.result;
                this.isFinished = true;
                this.updateDisplay();
                document.getElementById('history-modal').classList.remove('active');
            });
            
            historyList.appendChild(itemDiv);
        });
    }
}

const expressionElement = document.getElementById('expression');
const resultElement = document.getElementById('result');
const calculator = new Calculator(expressionElement, resultElement);

// Event Listeners for buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        const value = button.dataset.value;

        // Visual feedback
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);

        if (value !== undefined) {
            calculator.appendNumber(value);
        } else if (action === 'clear') {
            calculator.clear();
        } else if (action === 'delete') {
            calculator.delete();
        } else if (action === 'percent') {
            calculator.applyPercent();
        } else if (action === 'calculate') {
            calculator.calculateFinal();
        } else if (action === 'sci') {
            // Handle scientific button inputs
            const sciValue = button.dataset.value;
            if (sciValue) {
                calculator.expression += sciValue;
            }
            calculator.calculateLiveResult();
            calculator.updateDisplay();
        } else {
            // Operator buttons
            const operator = button.innerText;
            calculator.chooseOperation(operator);
        }
    });
});

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        calculator.appendNumber(e.key);
    }
    if (e.key === '+' || e.key === '-') {
        calculator.chooseOperation(e.key);
    }
    if (e.key === '*') {
        calculator.chooseOperation('×');
    }
    if (e.key === '/') {
        calculator.chooseOperation('÷');
    }
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.calculateFinal();
    }
    if (e.key === 'Backspace') {
        calculator.delete();
    }
    if (e.key === 'Escape') {
        calculator.clear();
    }
    if (e.key === '%') {
        calculator.applyPercent();
    }
});

// History Modal Event Listeners
const historyModal = document.getElementById('history-modal');
const historyBtn = document.getElementById('history-btn');
const closeHistoryBtn = document.getElementById('close-history');
const clearHistoryBtn = document.getElementById('clear-history');

historyBtn.addEventListener('click', () => {
    calculator.renderHistory();
    historyModal.classList.add('active');
});

closeHistoryBtn.addEventListener('click', () => {
    historyModal.classList.remove('active');
});

clearHistoryBtn.addEventListener('click', () => {
    calculator.history = [];
    calculator.renderHistory();
});
// Landscape Mode Toggle
const scientificBtn = document.getElementById('scientific-icon-btn');
const calcContainer = document.querySelector('.calculator-container');

function handleOrientationChange() {
    if (window.innerWidth > window.innerHeight) {
        calcContainer.classList.add('landscape-mode');
    } else {
        calcContainer.classList.remove('landscape-mode');
    }
}
window.addEventListener('resize', handleOrientationChange);
window.addEventListener('orientationchange', handleOrientationChange);
// Run once on load
setTimeout(handleOrientationChange, 100);

scientificBtn.addEventListener('click', async () => {
    try {
        if (window.ScreenOrientationPlugin) {
            const current = await window.ScreenOrientationPlugin.orientation();
            if (current.type.startsWith('portrait')) {
                await window.ScreenOrientationPlugin.lock({ orientation: 'landscape' });
            } else {
                await window.ScreenOrientationPlugin.unlock();
                // Alternatively, force to portrait then unlock
                await window.ScreenOrientationPlugin.lock({ orientation: 'portrait' });
                setTimeout(() => window.ScreenOrientationPlugin.unlock(), 500);
            }
        } else {
            // Fallback for web
            if (screen.orientation && screen.orientation.type.startsWith('portrait')) {
                await screen.orientation.lock('landscape');
            } else if (screen.orientation && screen.orientation.type.startsWith('landscape')) {
                await screen.orientation.lock('portrait');
            } else {
                calcContainer.classList.toggle('landscape-mode');
            }
        }
    } catch (err) {
        console.warn("Orientation lock failed:", err);
        calcContainer.classList.toggle('landscape-mode');
    }
});

// Sidebar Menu Toggle
const menuIconBtn = document.getElementById('menu-icon-btn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const closeSidebarBtn = document.getElementById('close-sidebar');
const categoriesToggle = document.getElementById('categories-toggle');
const categoriesSubmenu = document.getElementById('categories-submenu');

function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
}

menuIconBtn.addEventListener('click', toggleSidebar);
closeSidebarBtn.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', toggleSidebar);

// Accordion Toggle for Subcategories
categoriesToggle.addEventListener('click', () => {
    categoriesToggle.classList.toggle('expanded');
    categoriesSubmenu.classList.toggle('expanded');
});

const otherToggle = document.getElementById('other-toggle');
const otherSubmenu = document.getElementById('other-submenu');

if (otherToggle && otherSubmenu) {
    otherToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent triggering parent clicks
        otherToggle.classList.toggle('expanded');
        otherSubmenu.classList.toggle('expanded');
    });
}
