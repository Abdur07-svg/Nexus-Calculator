document.addEventListener('DOMContentLoaded', () => {
    const torqueInput = document.getElementById('torque');
    const torqueUnit = document.getElementById('torque-unit');
    const rpmInput = document.getElementById('rpm');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultBox = document.getElementById('result-box');
    const resultHp = document.getElementById('result-hp');
    const errorMsg = document.getElementById('error-msg');

    calcBtn.addEventListener('click', () => {
        let torque = parseFloat(torqueInput.value);
        const rpm = parseFloat(rpmInput.value);

        if (isNaN(torque) || isNaN(rpm) || torque < 0 || rpm < 0) {
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        // Convert Nm to lb-ft if necessary
        if (torqueUnit.value === 'nm') {
            torque = torque * 0.73756;
        }

        // Formula: HP = (Torque * RPM) / 5252
        const hp = (torque * rpm) / 5252;

        resultHp.textContent = `${Math.round(hp)} HP`;
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        torqueInput.value = '';
        rpmInput.value = '';
        torqueUnit.value = 'lb-ft';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
