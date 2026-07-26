document.addEventListener('DOMContentLoaded', () => {
    const inputA = document.getElementById('val-A');
    const inputB = document.getElementById('val-B');
    const inputC = document.getElementById('val-C');
    const input_a = document.getElementById('val-a');
    const input_b = document.getElementById('val-b');
    const input_c = document.getElementById('val-c');
    
    const angleUnit = document.getElementById('angle-unit');
    const unitSymbols = document.querySelectorAll('.unit-symbol');

    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultArea = document.getElementById('result-area');
    const resultPerimeter = document.getElementById('result-perimeter');
    const errorMsg = document.getElementById('error-msg');

    // Update unit symbols
    angleUnit.addEventListener('change', () => {
        const unit = angleUnit.value === 'degree' ? '&deg;' : 'rad';
        unitSymbols.forEach(el => el.innerHTML = unit);
    });

    function getVal(input) {
        if (input.value.trim() === '') return null;
        const val = parseFloat(input.value);
        return isNaN(val) ? null : val;
    }

    function setVal(input, val) {
        input.value = formatNumber(val);
    }

    function degToRad(deg) { return deg * Math.PI / 180; }
    function radToDeg(rad) { return rad * 180 / Math.PI; }

    function calculateTriangle() {
        let A = getVal(inputA);
        let B = getVal(inputB);
        let C = getVal(inputC);
        let a = getVal(input_a);
        let b = getVal(input_b);
        let c = getVal(input_c);

        const isDeg = angleUnit.value === 'degree';

        // Convert angles to radians for internal calculation
        if (isDeg) {
            if (A !== null) A = degToRad(A);
            if (B !== null) B = degToRad(B);
            if (C !== null) C = degToRad(C);
        }

        try {
            errorMsg.style.display = 'none';
            resultBox.classList.remove('active');

            // Count given values
            const givens = [A, B, C, a, b, c].filter(x => x !== null).length;
            const givenSides = [a, b, c].filter(x => x !== null).length;

            if (givens < 3 || givenSides === 0) {
                throw "Please provide at least 3 values, including at least one side length.";
            }

            // Iterative solver
            let changed = true;
            let iterations = 0;
            
            while (changed && iterations < 10) {
                changed = false;
                
                // 1. Sum of angles = PI
                if (A !== null && B !== null && C === null) { C = Math.PI - A - B; changed = true; }
                if (A !== null && C !== null && B === null) { B = Math.PI - A - C; changed = true; }
                if (B !== null && C !== null && A === null) { A = Math.PI - B - C; changed = true; }
                
                // 2. Law of Sines: a/sin(A) = b/sin(B) = c/sin(C)
                const ratio = (a && A) ? (a / Math.sin(A)) : (b && B) ? (b / Math.sin(B)) : (c && C) ? (c / Math.sin(C)) : null;
                
                if (ratio) {
                    if (A && !a) { a = ratio * Math.sin(A); changed = true; }
                    if (B && !b) { b = ratio * Math.sin(B); changed = true; }
                    if (C && !c) { c = ratio * Math.sin(C); changed = true; }
                    
                    if (a && !A && ratio >= a) { A = Math.asin(a / ratio); changed = true; }
                    if (b && !B && ratio >= b) { B = Math.asin(b / ratio); changed = true; }
                    if (c && !C && ratio >= c) { C = Math.asin(c / ratio); changed = true; }
                }

                // 3. Law of Cosines
                // Sides
                if (b !== null && c !== null && A !== null && a === null) { a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(A)); changed = true; }
                if (a !== null && c !== null && B !== null && b === null) { b = Math.sqrt(a*a + c*c - 2*a*c*Math.cos(B)); changed = true; }
                if (a !== null && b !== null && C !== null && c === null) { c = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(C)); changed = true; }
                
                // Angles
                if (a !== null && b !== null && c !== null) {
                    if (A === null) { A = Math.acos((b*b + c*c - a*a) / (2*b*c)); changed = true; }
                    if (B === null) { B = Math.acos((a*a + c*c - b*b) / (2*a*c)); changed = true; }
                    if (C === null) { C = Math.acos((a*a + b*b - c*c) / (2*a*b)); changed = true; }
                }
                
                iterations++;
            }

            if (A === null || B === null || C === null || a === null || b === null || c === null) {
                throw "Not enough information to solve the triangle. Ensure the provided values form a valid triangle.";
            }

            // Validate
            if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(A) || isNaN(B) || isNaN(C)) {
                throw "Invalid triangle resulting in undefined values.";
            }
            if (a + b <= c || a + c <= b || b + c <= a) {
                throw "The sides cannot form a valid triangle.";
            }
            if (Math.abs(A + B + C - Math.PI) > 0.01) {
                throw "The angles do not sum to 180 degrees.";
            }

            // Populate empty fields
            if (!getVal(inputA)) setVal(inputA, isDeg ? radToDeg(A) : A);
            if (!getVal(inputB)) setVal(inputB, isDeg ? radToDeg(B) : B);
            if (!getVal(inputC)) setVal(inputC, isDeg ? radToDeg(C) : C);
            if (!getVal(input_a)) setVal(input_a, a);
            if (!getVal(input_b)) setVal(input_b, b);
            if (!getVal(input_c)) setVal(input_c, c);

            // Calculate Area and Perimeter
            const perimeter = a + b + c;
            const s = perimeter / 2;
            const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

            resultArea.textContent = formatNumber(area);
            resultPerimeter.textContent = formatNumber(perimeter);
            
            resultBox.classList.add('active');
            
        } catch (err) {
            showError(err);
        }
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        resultBox.classList.remove('active');
    }

    function formatNumber(num) {
        if (Number.isInteger(num)) {
            return num.toString();
        }
        return num.toFixed(4).replace(/\.?0+$/, ''); // Max 4 decimal places, trim trailing zeros
    }

    calcBtn.addEventListener('click', calculateTriangle);

    clearBtn.addEventListener('click', () => {
        inputA.value = '';
        inputB.value = '';
        inputC.value = '';
        input_a.value = '';
        input_b.value = '';
        input_c.value = '';
        errorMsg.style.display = 'none';
        resultBox.classList.remove('active');
    });

    // Hide error on typing
    [inputA, inputB, inputC, input_a, input_b, input_c].forEach(input => {
        input.addEventListener('input', () => {
            errorMsg.style.display = 'none';
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateTriangle();
            }
        });
    });
});
