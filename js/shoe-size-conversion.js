document.addEventListener('DOMContentLoaded', () => {
    const ageGroup = document.getElementById('age-group');
    const regionSelect = document.getElementById('region');
    
    const adultInputs = document.getElementById('adult-inputs');
    const childInputs = document.getElementById('child-inputs');
    
    const sizeMen = document.getElementById('size-men');
    const sizeWomen = document.getElementById('size-women');
    const sizeChild = document.getElementById('size-child');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');
    const errorMsg = document.getElementById('error-msg');

    // Toggle inputs based on age group
    ageGroup.addEventListener('change', () => {
        if (ageGroup.value === 'adult') {
            adultInputs.style.display = 'flex';
            childInputs.style.display = 'none';
        } else {
            adultInputs.style.display = 'none';
            childInputs.style.display = 'flex';
        }
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });

    // Clear the other input when typing in one
    sizeMen.addEventListener('input', () => {
        if (sizeMen.value !== '') sizeWomen.value = '';
    });
    sizeWomen.addEventListener('input', () => {
        if (sizeWomen.value !== '') sizeMen.value = '';
    });

    calcBtn.addEventListener('click', convertShoeSize);

    clearBtn.addEventListener('click', () => {
        sizeMen.value = '';
        sizeWomen.value = '';
        sizeChild.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });

    function convertShoeSize() {
        errorMsg.style.display = 'none';
        const isAdult = ageGroup.value === 'adult';
        const region = regionSelect.value;
        
        let size, gender;
        if (isAdult) {
            if (sizeMen.value !== '') {
                gender = 'men';
                size = parseFloat(sizeMen.value);
            } else if (sizeWomen.value !== '') {
                gender = 'women';
                size = parseFloat(sizeWomen.value);
            } else {
                showError('Please enter a size for Men or Women.');
                return;
            }
        } else {
            if (sizeChild.value !== '') {
                gender = 'child';
                size = parseFloat(sizeChild.value);
            } else {
                showError('Please enter a size.');
                return;
            }
        }

        if (isNaN(size) || size <= 0) {
            showError('Please enter a valid size.');
            return;
        }

        let usMen, usWomen, uk, eu, jp, cn, lin, lcm, lmm;
        
        if (isAdult) {
            let baseUS; 
            if (gender === 'men') {
                if (region === 'us') baseUS = size;
                else if (region === 'uk') baseUS = size + 1;
                else if (region === 'eu') baseUS = size >= 39 ? size - 32 : (size - 28.5) / 1.5;
            } else if (gender === 'women') {
                if (region === 'us') baseUS = size - 1;
                else if (region === 'uk') baseUS = size + 1; 
                else if (region === 'eu') baseUS = size >= 39 ? size - 32 : (size - 28.5) / 1.5;
            }
            
            usMen = baseUS;
            usWomen = baseUS + 1;
            uk = baseUS - 1;
            eu = baseUS >= 7 ? 32 + baseUS : 28.5 + 1.5 * baseUS;
            cn = 28.5 + 1.5 * baseUS;
            jp = 19.25 + 0.75 * baseUS;
            lin = (baseUS + 22) / 3;
            
        } else {
            let usChild;
            if (region === 'us') usChild = size;
            else if (region === 'uk') usChild = size + 1;
            else if (region === 'eu') usChild = size - 17;
            
            usMen = usChild;
            usWomen = null;
            uk = usChild - 1;
            eu = usChild + 17;
            jp = usChild + 8;
            cn = eu;
            lin = (usChild + 11.67) / 3;
        }

        lcm = lin * 2.54;
        lmm = lcm * 10;

        let tableRows = '';
        if (!isAdult) {
            tableRows += `
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-secondary); font-weight: 500; width: 50%;">US/Canada</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-primary); font-weight: 600;">${usMen % 1 === 0 ? usMen : usMen.toFixed(1)}</td>
                </tr>
            `;
        } else {
            tableRows += `
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-secondary); font-weight: 500; width: 50%;">US/Canada (Men)</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-primary); font-weight: 600;">${usMen % 1 === 0 ? usMen : usMen.toFixed(1)}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-secondary); font-weight: 500;">US/Canada (Women)</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-primary); font-weight: 600;">${usWomen % 1 === 0 ? usWomen : usWomen.toFixed(1)}</td>
                </tr>
            `;
        }

        tableRows += `
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-secondary); font-weight: 500;">UK/India</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-primary); font-weight: 600;">${uk % 1 === 0 ? uk : uk.toFixed(1)}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-secondary); font-weight: 500;">EU</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-primary); font-weight: 600;">${eu % 1 === 0 ? eu : eu.toFixed(1)}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-secondary); font-weight: 500;">Japan/Mexico</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-primary); font-weight: 600;">${jp % 1 === 0 ? jp : jp.toFixed(1)}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-secondary); font-weight: 500;">China</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-primary); font-weight: 600;">${cn % 1 === 0 ? cn : cn.toFixed(1)}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-secondary); font-weight: 500; vertical-align: top;">Foot length</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--btn-operator-color); font-weight: 600;">
                        ${lin.toFixed(1)} inches<br>
                        ${lcm.toFixed(1)} cm<br>
                        ${Math.round(lmm)} mm
                    </td>
                </tr>
        `;

        resultBox.classList.add('active');
        detailedRes.innerHTML = `
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 15px;">
                ${tableRows}
            </table>
        `;
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        resultBox.classList.remove('active');
    }
});
