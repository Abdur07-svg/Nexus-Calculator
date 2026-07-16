document.addEventListener('DOMContentLoaded', () => {
    const genderSelect = document.getElementById('gender');
    const regionSelect = document.getElementById('region');
    const sizeInput = document.getElementById('size');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');
    const errorMsg = document.getElementById('error-msg');

    function convertShoeSize() {
        errorMsg.style.display = 'none';
        const gender = genderSelect.value;
        const region = regionSelect.value;
        const size = parseFloat(sizeInput.value);

        if (isNaN(size) || size <= 0) {
            errorMsg.textContent = 'Please enter a valid size.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        let usMen, usWomen, uk, eu, jp, cn, lin, lcm, lmm;
        
        if (gender === 'men' || gender === 'women') {
            let baseUS; 
            if (gender === 'men') {
                if (region === 'us') baseUS = size;
                else if (region === 'uk') baseUS = size + 1;
                else if (region === 'eu') baseUS = (size - 28.5) / 1.5;
            } else if (gender === 'women') {
                if (region === 'us') baseUS = size - 1;
                else if (region === 'uk') baseUS = size + 1; 
                else if (region === 'eu') baseUS = (size - 28.5) / 1.5;
            }
            
            usMen = baseUS;
            usWomen = baseUS + 1;
            uk = baseUS - 1;
            eu = 28.5 + 1.5 * baseUS;
            jp = eu / 2 + 5;
            cn = eu;
            lin = (baseUS + 22) / 3;
            
        } else if (gender === 'child') {
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
        if (gender === 'child') {
            tableRows += `
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); font-weight: 500; width: 50%;">US/Canada</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); font-weight: 600;">${usMen % 1 === 0 ? usMen : usMen.toFixed(1)}</td>
                </tr>
            `;
        } else {
            tableRows += `
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); font-weight: 500; width: 50%;">US/Canada (Men)</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); font-weight: 600;">${usMen % 1 === 0 ? usMen : usMen.toFixed(1)}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); font-weight: 500;">US/Canada (Women)</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); font-weight: 600;">${usWomen % 1 === 0 ? usWomen : usWomen.toFixed(1)}</td>
                </tr>
            `;
        }

        tableRows += `
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); font-weight: 500;">UK/India</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); font-weight: 600;">${uk % 1 === 0 ? uk : uk.toFixed(1)}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); font-weight: 500;">EU</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); font-weight: 600;">${eu % 1 === 0 ? eu : eu.toFixed(1)}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); font-weight: 500;">Japan/Mexico</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); font-weight: 600;">${jp % 1 === 0 ? jp : jp.toFixed(1)}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); font-weight: 500;">China</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); font-weight: 600;">${cn % 1 === 0 ? cn : cn.toFixed(1)}</td>
                </tr>
                <tr>
                    <th style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); font-weight: 500; vertical-align: top;">Foot length</th>
                    <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--btn-operator-color); font-weight: 600;">
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

    calcBtn.addEventListener('click', convertShoeSize);

    clearBtn.addEventListener('click', () => {
        sizeInput.value = '';
        resultBox.classList.remove('active');
        detailedRes.innerHTML = '';
        errorMsg.style.display = 'none';
    });
});
