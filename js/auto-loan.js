document?.addEventListener('DOMContentLoaded', () => {
    const priceIn = document.getElementById('auto-price');
    const downIn = document.getElementById('auto-down');
    const termIn = document.getElementById('auto-term');
    const rateIn = document.getElementById('auto-rate');
    const btnCalc = document.getElementById('calc-auto-btn');
    const resContainer = document.getElementById('auto-result-container');
    const monthlyOut = document.getElementById('auto-monthly');
    const details = document.getElementById('auto-details');

    btnCalc?.addEventListener('click', () => {
        const price = parseFloat(priceIn.value) || 0;
        const down = parseFloat(downIn.value) || 0;
        const term = parseFloat(termIn.value) || 0;
        const rate = parseFloat(rateIn.value) || 0;
        const currency = document.getElementById('currency-selector') ? document.getElementById('currency-selector').value : '$';


        if (price <= 0 || term <= 0) {
            monthlyOut.textContent = 'Error';
            details.innerHTML = '<p style="color:#ef4444; border:none; justify-content:center;">Price and term must be greater than 0.</p>';
            resContainer.style.display = 'block';
            return;
        }

        const principal = price - down;
        if (principal <= 0) {
            monthlyOut.textContent = currency + '0.00';
            details.innerHTML = '<p style="color:#ef4444; border:none; justify-content:center;">Down payment covers the full price.</p>';
            resContainer.style.display = 'block';
            return;
        }

        let monthlyPayment = 0;
        let totalInterest = 0;
        
        if (rate > 0) {
            const monthlyRate = (rate / 100) / 12;
            monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
            totalInterest = (monthlyPayment * term) - principal;
        } else {
            monthlyPayment = principal / term;
            totalInterest = 0;
        }

        const totalPaid = principal + totalInterest + down;

        monthlyOut.textContent = currency + monthlyPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        details.innerHTML = `
            <p style="border-bottom: 1px solid var(--calc-border); padding-bottom: 5px;">Total Principal: <span>${currency}${principal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
            <p style="border-bottom: 1px solid var(--calc-border); padding-bottom: 5px;">Total Interest: <span>${currency}${totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
            <p style="padding-top: 5px;">Total Cost (with down): <span>${currency}${totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
        `;
        resContainer.style.display = 'block';
    });
});


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
