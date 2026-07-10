document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('student-category');
    const formulaGroup = document.getElementById('formula-group');
    const formulaSelect = document.getElementById('student-formula');
    const inputsContainer = document.getElementById('dynamic-inputs-container');
    const calcBtn = document.getElementById('calc-student-btn');
    const clearBtn = document.getElementById('clear-student-btn');
    const resultContainer = document.getElementById('student-result');
    const solutionSteps = document.getElementById('student-solution-steps');

    const formulas = {
        arithmetic: [
            { id: 'add', name: 'Addition (x + y)', inputs: ['x', 'y'], solve: (v) => `${v.x} + ${v.y} = <b>${v.x + v.y}</b>` },
            { id: 'sub', name: 'Subtraction (x - y)', inputs: ['x', 'y'], solve: (v) => `${v.x} - ${v.y} = <b>${v.x - v.y}</b>` },
            { id: 'mul', name: 'Multiplication (x × y)', inputs: ['x', 'y'], solve: (v) => `${v.x} × ${v.y} = <b>${v.x * v.y}</b>` },
            { id: 'div', name: 'Division (x / y)', inputs: ['x', 'y'], solve: (v) => v.y === 0 ? 'Cannot divide by zero.' : `${v.x} ÷ ${v.y} = <b>${v.x / v.y}</b>` },
            { id: 'percent', name: 'Percentage (%)', inputs: ['Value', 'Total'], solve: (v) => `Formula: (Value / Total) × 100<br>Step 1: ${v.Value} / ${v.Total} = ${v.Value / v.Total}<br>Step 2: ${v.Value / v.Total} × 100 = <b>${((v.Value / v.Total) * 100).toFixed(2)}%</b>` },
            { id: 'profitloss', name: 'Profit & Loss', inputs: ['Cost Price (CP)', 'Selling Price (SP)'], solve: (v) => {
                if (v['Selling Price (SP)'] > v['Cost Price (CP)']) {
                    const profit = v['Selling Price (SP)'] - v['Cost Price (CP)'];
                    return `Formula: Profit = SP - CP<br>Step 1: ${v['Selling Price (SP)']} - ${v['Cost Price (CP)']}<br>Result: <b>Profit of ${profit}</b>`;
                } else if (v['Cost Price (CP)'] > v['Selling Price (SP)']) {
                    const loss = v['Cost Price (CP)'] - v['Selling Price (SP)'];
                    return `Formula: Loss = CP - SP<br>Step 1: ${v['Cost Price (CP)']} - ${v['Selling Price (SP)']}<br>Result: <b>Loss of ${loss}</b>`;
                } else {
                    return `SP and CP are equal. <b>No Profit, No Loss.</b>`;
                }
            }},
            { id: 'si', name: 'Simple Interest (SI)', inputs: ['Principal (P)', 'Rate (R) %', 'Time (T) years'], solve: (v) => {
                const si = (v['Principal (P)'] * v['Rate (R) %'] * v['Time (T) years']) / 100;
                return `Formula: SI = (P × R × T) / 100<br>Step 1: (${v['Principal (P)']} × ${v['Rate (R) %']} × ${v['Time (T) years']}) / 100<br>Step 2: ${(v['Principal (P)'] * v['Rate (R) %'] * v['Time (T) years'])} / 100<br>Result: <b>SI = ${si}</b>`;
            }},
            { id: 'ci', name: 'Compound Interest (CI)', inputs: ['Principal (P)', 'Rate (R) %', 'Time (T) years'], solve: (v) => {
                const p = v['Principal (P)'], r = v['Rate (R) %'], t = v['Time (T) years'];
                const amount = p * Math.pow((1 + r/100), t);
                const ci = amount - p;
                return `Formula: CI = P(1 + R/100)^T - P<br>Step 1: Amount = ${p}(1 + ${r}/100)^${t}<br>Step 2: Amount = ${p}(${1 + r/100})^${t} = ${amount.toFixed(2)}<br>Step 3: CI = ${amount.toFixed(2)} - ${p}<br>Result: <b>CI = ${ci.toFixed(2)}</b>`;
            }}
        ],
        algebra: [
            { id: 'linear', name: 'Linear Equation (ax + b = 0)', inputs: ['a', 'b'], solve: (v) => {
                if (v.a === 0) return 'Coefficient "a" cannot be zero in a linear equation.';
                const x = -v.b / v.a;
                return `Formula: ax + b = 0 &rarr; x = -b/a<br>Step 1: ${v.a}x + ${v.b} = 0<br>Step 2: ${v.a}x = ${-v.b}<br>Step 3: x = ${-v.b} / ${v.a}<br>Result: <b>x = ${x}</b>`;
            }},
            { id: 'quadratic', name: 'Quadratic Equation (ax² + bx + c = 0)', inputs: ['a', 'b', 'c'], solve: (v) => {
                if (v.a === 0) return 'Coefficient "a" cannot be zero in a quadratic equation.';
                const d = (v.b * v.b) - (4 * v.a * v.c);
                let steps = `Formula: x = (-b ± √(b² - 4ac)) / 2a<br>`;
                steps += `Step 1 (Discriminant D): b² - 4ac = (${v.b})² - 4(${v.a})(${v.c}) = ${v.b*v.b} - ${4*v.a*v.c} = ${d}<br>`;
                if (d < 0) {
                    steps += `Since D < 0, the roots are complex.<br>`;
                    const real = (-v.b / (2*v.a)).toFixed(2);
                    const img = (Math.sqrt(Math.abs(d)) / (2*v.a)).toFixed(2);
                    steps += `Result: <b>x = ${real} ± ${img}i</b>`;
                } else if (d === 0) {
                    const x = -v.b / (2*v.a);
                    steps += `Since D = 0, there is one real root.<br>x = -${v.b} / ${2*v.a}<br>`;
                    steps += `Result: <b>x = ${x}</b>`;
                } else {
                    const root = Math.sqrt(d);
                    const x1 = (-v.b + root) / (2*v.a);
                    const x2 = (-v.b - root) / (2*v.a);
                    steps += `Since D > 0, there are two real roots. √D = ${root.toFixed(2)}<br>`;
                    steps += `x₁ = (-${v.b} + ${root.toFixed(2)}) / ${2*v.a} = ${x1.toFixed(2)}<br>`;
                    steps += `x₂ = (-${v.b} - ${root.toFixed(2)}) / ${2*v.a} = ${x2.toFixed(2)}<br>`;
                    steps += `Result: <b>x = ${x1.toFixed(2)} or x = ${x2.toFixed(2)}</b>`;
                }
                return steps;
            }}
        ],
        geometry: [
            { id: 'square', name: 'Square (Area & Perimeter)', inputs: ['Side (a)'], solve: (v) => {
                const a = v['Side (a)'];
                return `<b>Area:</b> a² = ${a} × ${a} = <b>${a*a}</b><br><b>Perimeter:</b> 4a = 4 × ${a} = <b>${4*a}</b>`;
            }},
            { id: 'rect', name: 'Rectangle (Area & Perimeter)', inputs: ['Length (l)', 'Breadth (b)'], solve: (v) => {
                const l = v['Length (l)'], b = v['Breadth (b)'];
                return `<b>Area:</b> l × b = ${l} × ${b} = <b>${l*b}</b><br><b>Perimeter:</b> 2(l + b) = 2(${l} + ${b}) = 2(${l+b}) = <b>${2*(l+b)}</b>`;
            }},
            { id: 'triangle', name: 'Triangle Area (Base & Height)', inputs: ['Base (b)', 'Height (h)'], solve: (v) => {
                const b = v['Base (b)'], h = v['Height (h)'];
                return `Formula: Area = ½ × b × h<br>Step 1: ½ × ${b} × ${h}<br>Step 2: 0.5 × ${b*h}<br>Result: <b>Area = ${0.5*b*h}</b>`;
            }},
            { id: 'heron', name: 'Triangle Area (Heron\'s Formula)', inputs: ['Side a', 'Side b', 'Side c'], solve: (v) => {
                const a = v['Side a'], b = v['Side b'], c = v['Side c'];
                const s = (a + b + c) / 2;
                const d = s * (s-a) * (s-b) * (s-c);
                if (d <= 0) return 'Invalid triangle sides. The sum of any two sides must be greater than the third.';
                const area = Math.sqrt(d);
                return `Formula: s = (a+b+c)/2, Area = √[s(s-a)(s-b)(s-c)]<br>Step 1: s = (${a}+${b}+${c})/2 = ${s}<br>Step 2: Area = √[${s}(${s-a})(${s-b})(${s-c})]<br>Step 3: Area = √[${d}]<br>Result: <b>Area = ${area.toFixed(2)}</b>`;
            }},
            { id: 'circle', name: 'Circle (Area & Circumference)', inputs: ['Radius (r)'], solve: (v) => {
                const r = v['Radius (r)'];
                const pi = Math.PI;
                return `<b>Area:</b> πr² = π × ${r}² = ${pi.toFixed(4)} × ${r*r} = <b>${(pi*r*r).toFixed(2)}</b><br><b>Circumference:</b> 2πr = 2 × π × ${r} = 2 × ${pi.toFixed(4)} × ${r} = <b>${(2*pi*r).toFixed(2)}</b>`;
            }}
        ],
        trigonometry: [
            { id: 'trig_basic', name: 'Basic Trigonometry (sin, cos, tan)', inputs: ['Angle in Degrees (θ)'], solve: (v) => {
                const deg = v['Angle in Degrees (θ)'];
                const rad = deg * (Math.PI / 180);
                return `Angle θ = ${deg}°<br>sin(${deg}°) = <b>${Math.sin(rad).toFixed(4)}</b><br>cos(${deg}°) = <b>${Math.cos(rad).toFixed(4)}</b><br>tan(${deg}°) = <b>${Math.tan(rad).toFixed(4)}</b>`;
            }}
        ],
        statistics: [
            { id: 'mean', name: 'Mean (Average)', inputs: ['Values (comma separated)'], type: 'text', solve: (v) => {
                const str = v['Values (comma separated)'];
                const arr = str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                if (arr.length === 0) return 'Please enter valid numbers.';
                const sum = arr.reduce((a, b) => a + b, 0);
                return `Formula: Mean = Sum / Count<br>Step 1: Sum = ${arr.join(' + ')} = ${sum}<br>Step 2: Count = ${arr.length}<br>Result: ${sum} / ${arr.length} = <b>${(sum/arr.length).toFixed(2)}</b>`;
            }}
        ]
    };

    let currentFormula = null;

    categorySelect.addEventListener('change', (e) => {
        const cat = e.target.value;
        formulaSelect.innerHTML = '<option value="" disabled selected>Select Formula</option>';
        if (formulas[cat]) {
            formulas[cat].forEach((form, index) => {
                const opt = document.createElement('option');
                opt.value = index;
                opt.textContent = form.name;
                formulaSelect.appendChild(opt);
            });
            formulaGroup.style.display = 'block';
        }
        inputsContainer.innerHTML = '';
        calcBtn.disabled = true;
        resultContainer.style.display = 'none';
    });

    formulaSelect.addEventListener('change', (e) => {
        const cat = categorySelect.value;
        const index = e.target.value;
        currentFormula = formulas[cat][index];
        
        inputsContainer.innerHTML = '';
        currentFormula.inputs.forEach(inputName => {
            const group = document.createElement('div');
            group.className = 'input-group';
            
            const label = document.createElement('label');
            label.textContent = inputName;
            
            const input = document.createElement('input');
            input.type = currentFormula.type === 'text' ? 'text' : 'number';
            input.className = 'custom-input';
            if(input.type === 'number') input.step = 'any';
            input.id = `input-${inputName.replace(/[^a-zA-Z0-9]/g, '')}`;
            input.placeholder = `Enter ${inputName}`;
            
            group.appendChild(label);
            group.appendChild(input);
            inputsContainer.appendChild(group);
        });
        
        calcBtn.disabled = false;
        resultContainer.style.display = 'none';
    });

    calcBtn.addEventListener('click', () => {
        if (!currentFormula) return;
        
        let values = {};
        let isValid = true;
        
        currentFormula.inputs.forEach(inputName => {
            const inputEl = document.getElementById(`input-${inputName.replace(/[^a-zA-Z0-9]/g, '')}`);
            const val = inputEl.value;
            if (val.trim() === '') isValid = false;
            
            if (currentFormula.type === 'text') {
                values[inputName] = val;
            } else {
                values[inputName] = parseFloat(val);
            }
        });
        
        if (!isValid) return; // Handled by global validation if needed, but we check here too.
        
        const stepsHtml = currentFormula.solve(values);
        solutionSteps.innerHTML = stepsHtml;
        resultContainer.style.display = 'block';
    });

    clearBtn.addEventListener('click', () => {
        const inputs = inputsContainer.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
        resultContainer.style.display = 'none';
    });
});
