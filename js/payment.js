document?.addEventListener('DOMContentLoaded', () => {
    const amtIn = document.getElementById('pay-amount');
    const yearsIn = document.getElementById('pay-years');
    const rateIn = document.getElementById('pay-rate');
    const btnCalc = document.getElementById('calc-pay-btn');
    const resContainer = document.getElementById('pay-result-container');
    const monthlyOut = document.getElementById('pay-monthly');
    const details = document.getElementById('pay-details');

    btnCalc?.addEventListener('click', () => {
        const principal = parseFloat(amtIn.value) || 0;
        const years = parseFloat(yearsIn.value) || 0;
        const rate = parseFloat(rateIn.value) || 0;
        const currency = document.getElementById('currency-selector') ? document.getElementById('currency-selector').value : '$';

        if (principal <= 0 || years <= 0) {
            monthlyOut.textContent = 'Error';
            details.innerHTML = '<p style="color:#ef4444; border:none; justify-content:center;">Amount and Years must be positive numbers.</p>';
            resContainer.style.display = 'block';
            return;
        }

        const months = years * 12;
        let monthlyPayment = 0;
        let totalInterest = 0;

        if (rate > 0) {
            const monthlyRate = (rate / 100) / 12;
            monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
            totalInterest = (monthlyPayment * months) - principal;
        } else {
            monthlyPayment = principal / months;
            totalInterest = 0;
        }

        const totalPaid = principal + totalInterest;

        monthlyOut.textContent = currency + monthlyPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        details.innerHTML = `
            <p style="border-bottom: 1px solid var(--calc-border); padding-bottom: 5px;">Total Principal: <span>${currency}${principal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
            <p style="border-bottom: 1px solid var(--calc-border); padding-bottom: 5px;">Total Interest: <span>${currency}${totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
            <p style="padding-top: 5px;">Total Cost: <span>${currency}${totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
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
