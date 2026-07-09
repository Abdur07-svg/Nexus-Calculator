document?.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeSwitch = document.getElementById('theme-switch');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        htmlElement.setAttribute('data-theme', 'light');
        if (themeSwitch) themeSwitch.checked = true;
    }

    if (themeSwitch) {
        themeSwitch?.addEventListener('change', () => {
                if (themeSwitch.checked) {
                    htmlElement.setAttribute('data-theme', 'light');
                    localStorage.setItem('theme', 'light');
                } else {
                    htmlElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                }
            });
    }

    // Sound Toggle Logic
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    let soundEnabled = true;

    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playClickSound() {
        if (!soundEnabled) return;
        initAudio();
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    }

    if (soundToggleBtn) {
        soundToggleBtn?.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundIcon.classList.remove('fa-volume-xmark');
                soundIcon.classList.add('fa-volume-up');
                soundToggleBtn.classList.remove('muted');
                playClickSound();
            } else {
                soundIcon.classList.remove('fa-volume-up');
                soundIcon.classList.add('fa-volume-xmark');
                soundToggleBtn.classList.add('muted');
            }
        });
    }

    // Scientific Mode Toggle
    const scientificToggleBtn = document.getElementById('scientific-toggle-btn');
    const calculator = document.querySelector('.calculator');
    const angleToggle = document.getElementById('angle-toggle');
    const angleBtns = document.querySelectorAll('.angle-btn');
    let isScientific = false;
    let isDeg = true;

    if (scientificToggleBtn) {
        scientificToggleBtn?.addEventListener('click', () => {
            playClickSound();
            isScientific = !isScientific;
            if (isScientific) {
                calculator.classList.add('scientific-mode');
                scientificToggleBtn.classList.add('active');
                if (angleToggle) angleToggle.style.display = 'flex';
            } else {
                calculator.classList.remove('scientific-mode');
                scientificToggleBtn.classList.remove('active');
                if (angleToggle) angleToggle.style.display = 'none';
            }
        });
    }

    angleBtns.forEach(btn => {
        btn?.addEventListener('click', () => {
            playClickSound();
            angleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            isDeg = btn.dataset.angle === 'deg';
        });
    });

    // Calculator Logic
    const previousOperandTextElement = document.getElementById('previous-operand');
    const currentOperandTextElement = document.getElementById('current-operand');
    
    let displayStr = '0';
    let previousStr = '';
    let memory = 0;
    let lastAns = 0;
    let shouldResetScreen = false;

    function updateDisplay() {
        if (currentOperandTextElement) {
            currentOperandTextElement.innerText = displayStr || '0';
            // Dynamic font sizing
            const currentLen = currentOperandTextElement.innerText.length;
            if (currentLen > 18) {
                currentOperandTextElement.style.fontSize = '1.2rem';
            } else if (currentLen > 12) {
                currentOperandTextElement.style.fontSize = '1.8rem';
            } else if (currentLen > 9) {
                currentOperandTextElement.style.fontSize = '2.2rem';
            } else {
                currentOperandTextElement.style.fontSize = '3rem';
            }
        }
        if (previousOperandTextElement) {
            previousOperandTextElement.innerText = previousStr;
        }
    }

    function appendStr(str) {
        if (displayStr === '0' || displayStr === 'Error' || shouldResetScreen) {
            if (['×', '÷', '+', '-', '^', '^2', '^3', '^(1/', '^(-1)', '!', '%'].includes(str)) {
                // If operator, keep previous answer
                displayStr = displayStr === 'Error' ? '0' : displayStr;
            } else {
                displayStr = '';
            }
            shouldResetScreen = false;
        }
        displayStr += str;
        updateDisplay();
    }

    function deleteLast() {
        if (displayStr === 'Error' || shouldResetScreen) {
            displayStr = '0';
            shouldResetScreen = false;
        } else {
            displayStr = displayStr.slice(0, -1);
            if (displayStr === '') displayStr = '0';
        }
        updateDisplay();
    }

    function clear() {
        displayStr = '0';
        previousStr = '';
        updateDisplay();
    }

    function calculate() {
        if (displayStr === 'Error') return;
        
        previousStr = displayStr + ' =';
        
        let expr = displayStr;
        // Basic replacements
        expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E');
        // Replace Ans
        expr = expr.replace(/Ans/g, '(' + lastAns + ')');
        // Percentages
        expr = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
        // Factorials (simple regex for integers)
        expr = expr.replace(/(\d+)!/g, 'factorial($1)');
        
        // Implicit multiplication
        expr = expr.replace(/(\d+)\s*\(/g, '$1*('); // 4( -> 4*(
        expr = expr.replace(/\)\s*(\d+)/g, ')*$1'); // )4 -> )*4
        expr = expr.replace(/\)\s*\(/g, ')*(');     // )( -> )*(
        expr = expr.replace(/(\d+)\s*(sin|cos|tan|asin|acos|atan|log|ln|sqrt|cbrt|π|Math\.E)/g, '$1*$2'); // 4sin -> 4*sin
        expr = expr.replace(/\)\s*(sin|cos|tan|asin|acos|atan|log|ln|sqrt|cbrt|π|Math\.E)/g, ')*$1'); // )sin -> )*sin
        
        // Fix JS Unary Minus before exponentiation (e.g., -4**2 throws error)
        expr = expr.replace(/(^|[×÷+\-*\/^(])-\s*(\d+(?:\.\d+)?|\([^)]+\))/g, '$1(0-1)*$2');

        // Powers
        expr = expr.replace(/\^/g, '**');

        const mathHelpers = `
            const sin = (x) => Math.sin(isDeg ? x * Math.PI / 180 : x);
            const cos = (x) => Math.cos(isDeg ? x * Math.PI / 180 : x);
            const tan = (x) => Math.tan(isDeg ? x * Math.PI / 180 : x);
            const asin = (x) => isDeg ? Math.asin(x) * 180 / Math.PI : Math.asin(x);
            const acos = (x) => isDeg ? Math.acos(x) * 180 / Math.PI : Math.acos(x);
            const atan = (x) => isDeg ? Math.atan(x) * 180 / Math.PI : Math.atan(x);
            const log = Math.log10;
            const ln = Math.log;
            const sqrt = Math.sqrt;
            const cbrt = Math.cbrt;
            const factorial = (n) => { 
                n = parseInt(n);
                if (n < 0) return NaN; 
                if (n === 0) return 1; 
                let res = 1; 
                for(let i=1; i<=n; i++) res*=i; 
                return res; 
            };
        `;

        try {
            // Check for unclosed parentheses and close them
            const openParens = (expr.match(/\(/g) || []).length;
            const closeParens = (expr.match(/\)/g) || []).length;
            if (openParens > closeParens) {
                expr += ')'.repeat(openParens - closeParens);
            }

            const toEval = `
                ${mathHelpers}
                return ${expr};
            `;
            
            const func = new Function('isDeg', toEval);
            let result = func(isDeg);
            
            if (!isFinite(result) || isNaN(result)) {
                displayStr = 'Error';
            } else {
                // Fix floating point precision
                result = Math.round(result * 1e12) / 1e12;
                displayStr = result.toString();
                lastAns = result;
            }
        } catch (e) {
            displayStr = e.message;
        }
        
        shouldResetScreen = true;
        updateDisplay();
    }

    // Button event listeners
    document.querySelectorAll('.btn-number, .btn-operator, .btn-sci, .btn-action, .btn-equal').forEach(btn => {
        btn?.addEventListener('click', () => {
            playClickSound();
            
            if (btn.classList.contains('btn-number')) {
                appendStr(btn.dataset.number);
            } 
            else if (btn.classList.contains('btn-operator')) {
                appendStr(btn.dataset.operator);
            }
            else if (btn.classList.contains('btn-sci')) {
                const sci = btn.dataset.sci;
                const funcMap = {
                    'sin': 'sin(', 'cos': 'cos(', 'tan': 'tan(',
                    'asin': 'asin(', 'acos': 'acos(', 'atan': 'atan(',
                    'ln': 'ln(', 'log': 'log(', 'sqrt': 'sqrt(', 'cbrt': 'cbrt(',
                    'pi': 'π', 'e': 'e', '(': '(', ')': ')',
                    'x-pow-2': '^2', 'x-pow-3': '^3', 'x-pow-y': '^',
                    'e-pow-x': 'e^', '10-pow-x': '10^', 'y-root-x': '^(1/',
                    '1-over-x': '^(-1)', 'fact': '!', 'rnd': 'Math.random()',
                    'exp': 'E'
                };
                if (funcMap[sci]) {
                    appendStr(funcMap[sci]);
                }
            }
            else if (btn.classList.contains('btn-equal')) {
                calculate();
            }
            else if (btn.classList.contains('btn-action')) {
                const action = btn.dataset.action;
                if (action === 'clear') clear();
                else if (action === 'delete') deleteLast();
                else if (action === 'calculate') calculate();
                else if (action === 'percent') appendStr('%');
                else if (action === 'sign') appendStr('(-');
                else if (action === 'ans') appendStr('Ans');
                else if (action === 'mc') {
                    memory = 0;
                }
                else if (action === 'm-plus') {
                    if (displayStr !== 'Error') {
                        try { calculate(); } catch(e){}
                        memory += parseFloat(displayStr) || 0;
                        shouldResetScreen = true;
                    }
                }
                else if (action === 'm-minus') {
                    if (displayStr !== 'Error') {
                        try { calculate(); } catch(e){}
                        memory -= parseFloat(displayStr) || 0;
                        shouldResetScreen = true;
                    }
                }
                else if (action === 'mr') {
                    appendStr(memory.toString());
                }
            }
        });
    });

    // Background Blobs and Parallax (Removed parallax effect)

    // Keyboard Support
    window?.addEventListener('keydown', (e) => {
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
            return;
        }
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '=', 'Enter', 'Backspace', 'Escape', 'Delete', '+', '-', '*', '/', '%', '(', ')', '^'];
        if (allowedKeys.includes(e.key)) {
            playClickSound();
            
            if (e.key >= '0' && e.key <= '9' || e.key === '.' || e.key === '(' || e.key === ')' || e.key === '^' || e.key === '%') {
                appendStr(e.key);
            }
            if (e.key === '=' || e.key === 'Enter') {
                e.preventDefault();
                calculate();
            }
            if (e.key === 'Backspace') {
                deleteLast();
            }
            if (e.key === 'Delete' || e.key === 'Escape') {
                clear();
            }
            if (e.key === '+' || e.key === '-') {
                appendStr(e.key);
            }
            if (e.key === '*') {
                appendStr('×');
            }
            if (e.key === '/') {
                e.preventDefault();
                appendStr('÷');
            }
        }
    });

    // App Navigation Logic
    const navBtns = document.querySelectorAll('.nav-btn');
    const calcViews = document.querySelectorAll('.calc-view');

    navBtns.forEach(btn => {
        btn?.addEventListener('click', () => {
            playClickSound();
            // Remove active from all nav buttons and views
            navBtns.forEach(b => b.classList.remove('active'));
            calcViews.forEach(v => v.classList.remove('active'));
            
            // Add active to clicked nav button and corresponding view
            btn.classList.add('active');
            const viewId = btn.dataset.view;
            document.getElementById(viewId).classList.add('active');
        });
    });

    // Main Dashboard Tab Navigation Logic
    const mainNavTabs = document.querySelectorAll('.nav-tab');
    const mainTabViews = document.querySelectorAll('.tab-view');

    // Restore active tab from sessionStorage if available
    const savedTab = sessionStorage.getItem('activeDashboardTab');
    if (savedTab && mainNavTabs.length > 0) {
        mainNavTabs.forEach(t => t.classList.remove('active'));
        mainTabViews.forEach(v => v.classList.remove('active-view'));
        
        const targetTab = document.querySelector(`.nav-tab[data-target="${savedTab}"]`);
        const targetView = document.getElementById(savedTab);
        
        if (targetTab) targetTab.classList.add('active');
        if (targetView) targetView.classList.add('active-view');
    }

    mainNavTabs.forEach(tab => {
        tab?.addEventListener('click', () => {
            playClickSound();
            mainNavTabs.forEach(t => t.classList.remove('active'));
            mainTabViews.forEach(v => v.classList.remove('active-view'));
            
            tab.classList.add('active');
            const targetId = tab.dataset.target;
            const targetView = document.getElementById(targetId);
            if (targetView) targetView.classList.add('active-view');

            // Save to sessionStorage
            sessionStorage.setItem('activeDashboardTab', targetId);
        });
    });

    // BMI Calculator Logic
    const btnCalcBmi = document.getElementById('calc-bmi-btn');
    const inputBmiHeight = document.getElementById('bmi-height');
    const inputBmiWeight = document.getElementById('bmi-weight');
    const bmiResultContainer = document.getElementById('bmi-result-container');
    const bmiScoreDisplay = document.getElementById('bmi-score');
    const bmiCategoryDisplay = document.getElementById('bmi-category');
    const bmiMarker = document.getElementById('bmi-marker');

    if (btnCalcBmi) {
        btnCalcBmi?.addEventListener('click', () => {
            playClickSound();
            const heightCm = parseFloat(inputBmiHeight.value);
            const weightKg = parseFloat(inputBmiWeight.value);
            
            if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return;
            
            const heightM = heightCm / 100;
            const bmi = weightKg / (heightM * heightM);
            const bmiRounded = bmi.toFixed(1);
            
            bmiScoreDisplay.textContent = bmiRounded;
            
            let category = '';
            let color = '';
            let percent = 0;
            
            if (bmi < 18.5) {
                category = 'Underweight';
                color = '#3b82f6';
                percent = (bmi / 18.5) * 25;
            } else if (bmi < 25) {
                category = 'Normal Weight';
                color = '#22c55e';
                percent = 25 + ((bmi - 18.5) / 6.5) * 25;
            } else if (bmi < 30) {
                category = 'Overweight';
                color = '#eab308';
                percent = 50 + ((bmi - 25) / 5) * 25;
            } else {
                category = 'Obese';
                color = '#ef4444';
                percent = 75 + Math.min(((bmi - 30) / 10) * 25, 25);
            }
            
            bmiCategoryDisplay.textContent = category;
            bmiScoreDisplay.style.color = color;
            bmiMarker.style.left = `${Math.min(Math.max(percent, 0), 100)}%`;
            
            bmiResultContainer.style.display = 'block';
        });
    }

    // Age Calculator Logic
    const btnCalcAge = document.getElementById('calc-age-btn');
    const inputAgeDob = document.getElementById('age-dob');
    const inputAgeTarget = document.getElementById('age-target');
    const ageResultContainer = document.getElementById('age-result-container');
    
    if (inputAgeTarget) {
        // Set default target date to today
        const today = new Date();
    if (inputAgeTarget) inputAgeTarget.value = today.toISOString().split('T')[0];
    }
    
    if (btnCalcAge) {
        btnCalcAge?.addEventListener('click', () => {
            playClickSound();
            if (!inputAgeDob.value || !inputAgeTarget.value) return;
            
            const dob = new Date(inputAgeDob.value);
            const target = new Date(inputAgeTarget.value);
            
            if (dob > target) {
                alert("Date of birth cannot be after the target date!");
                return;
            }
            
            let years = target.getFullYear() - dob.getFullYear();
            let months = target.getMonth() - dob.getMonth();
            let days = target.getDate() - dob.getDate();
            
            if (days < 0) {
                months--;
                // Get days in previous month
                const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
                days += prevMonth.getDate();
            }
            
            if (months < 0) {
                years--;
                months += 12;
            }
            
            document.getElementById('age-years').textContent = years;
            document.getElementById('age-months').textContent = months;
            document.getElementById('age-days').textContent = days;
            
            // Calculate totals
            const diffTime = Math.abs(target - dob);
            const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const totalWeeks = (totalDays / 7).toFixed(1);
            const totalMonths = (years * 12) + months;
            
            document.getElementById('age-total-months').textContent = totalMonths;
            document.getElementById('age-total-weeks').textContent = totalWeeks;
            document.getElementById('age-total-days').textContent = totalDays;
            
            ageResultContainer.style.display = 'block';
        });
    }

    // Accordion Logic for Dashboard Categories removed as per user request to keep them fixed

    // Dashboard Search Functionality
    const searchInput = document.getElementById('dashboard-search');
    if (searchInput) {
        searchInput?.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const categories = document.querySelectorAll('.category-card');
            
            categories.forEach(card => {
                let hasVisibleLink = false;
                const links = card.querySelectorAll('.calculator-list li');
                const categoryTitle = card.querySelector('.category-title').textContent.toLowerCase();
                
                // If query matches category title, show all links
                const categoryMatches = categoryTitle.includes(query);

                links.forEach(li => {
                    const text = li.textContent.toLowerCase();
                    if (categoryMatches || text.includes(query)) {
                        li.style.display = '';
                        hasVisibleLink = true;
                    } else {
                        li.style.display = 'none';
                    }
                });

                if (hasVisibleLink) {
                    card.style.display = '';
                    if (query.length > 0) {
                        card.classList.add('expanded');
                    } else {
                        card.classList.remove('expanded');
                        links.forEach(li => li.style.display = '');
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    updateDisplay();
});

document?.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href]').forEach(link => {
        if (link.hostname === window.location.hostname && link.getAttribute('href') !== '#' && !link.getAttribute('href').startsWith('javascript:')) {
            link?.addEventListener('click', (e) => {
                e.preventDefault();
                const wrapper = document.querySelector('.calculator-wrapper') || document.querySelector('.dashboard-wrapper');
                if (wrapper) {
                    wrapper.classList.add('page-exit');
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 150);
                } else {
                    window.location.href = link.href;
                }
            });
        }
    });
});

// Fix for mobile back-button (bfcache): remove page-exit animation when page is restored
window?.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        const wrapper = document.querySelector('.calculator-wrapper') || document.querySelector('.dashboard-wrapper');
        if (wrapper) {
            wrapper.classList.remove('page-exit');
        }
    }
});

// Global Enter-to-Calculate listener (Capture phase to run before plugins like Flatpickr)
document?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const activeElem = document.activeElement;
        if (activeElem && (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA')) {
            const container = activeElem.closest('.form-box') || activeElem.closest('.calc-view') || activeElem.closest('.calculator') || activeElem.closest('.calculator-wrapper');
            if (container) {
                const buttons = Array.from(container.querySelectorAll('button'));
                const calcBtn = buttons.find(btn => {
                    const id = btn.id ? btn.id.toLowerCase() : '';
                    const text = btn.innerText ? btn.innerText.toLowerCase() : '';
                    return (id.includes('calc') && id.includes('btn')) || text.includes('calculate') || text.includes('solve');
                });
                
                if (calcBtn) {
                    // Slight delay to allow plugins to update input values
                    setTimeout(() => {
                        calcBtn.click();
                    }, 50);
                }
            }
        }
    }
}, true);


// Global Enter key listener for all input fields to trigger the calculate button
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') return;
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const calculatorDiv = input.closest('.calculator');
                let calcBtn = null;
                if (calculatorDiv) {
                    calcBtn = calculatorDiv.querySelector('button.action-btn, button[id^="calc-"]');
                }
                
                if (!calcBtn) {
                    calcBtn = document.querySelector('button.action-btn, button[id^="calc-"]');
                }
                
                if (calcBtn) {
                    calcBtn.click();
                }
            }
        });
    });
});
