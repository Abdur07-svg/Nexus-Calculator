document?.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality (shared across all pages)
    const themeSwitch = document.getElementById('theme-switch');
    const htmlElement = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
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

    // Sound toggle functionality (mock)
    const soundBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    let soundEnabled = true;

    soundBtn?.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            soundIcon.className = 'fas fa-volume-up';
        } else {
            soundIcon.className = 'fas fa-volume-mute';
        }
    });

    // Mortgage Calculator Logic
    const calcBtn = document.getElementById('calc-mortgage-btn');
    const resultContainer = document.getElementById('mortgage-result-container');

    const homePriceInput = document.getElementById('home-price');
    const downPaymentInput = document.getElementById('down-payment');
    const loanTermInput = document.getElementById('loan-term');
    const interestRateInput = document.getElementById('interest-rate');

    const monthlyPaymentEl = document.getElementById('monthly-payment');
    const totalPrincipalEl = document.getElementById('total-principal');
    const totalInterestEl = document.getElementById('total-interest');
    const totalCostEl = document.getElementById('total-cost');

    function formatCurrency(num) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }

    calcBtn?.addEventListener('click', () => {
        const homePrice = parseFloat(homePriceInput.value) || 0;
        const downPayment = parseFloat(downPaymentInput.value) || 0;
        const loanTermYears = parseFloat(loanTermInput.value) || 0;
        const annualRate = parseFloat(interestRateInput.value) || 0;
        const currency = document.getElementById('currency-selector') ? document.getElementById('currency-selector').value : '$';


        if (homePrice <= 0 || loanTermYears <= 0) {
            alert("Please enter a valid home price and loan term.");
            return;
        }

        const principal = homePrice - downPayment;
        const monthlyRate = (annualRate / 100) / 12;
        const totalPayments = loanTermYears * 12;

        let monthlyPayment = 0;
        let totalInterest = 0;
        let totalCost = 0;

        if (principal <= 0) {
            monthlyPayment = 0;
        } else if (annualRate === 0) {
            monthlyPayment = principal / totalPayments;
            totalInterest = 0;
            totalCost = principal;
        } else {
            const mathPower = Math.pow(1 + monthlyRate, totalPayments);
            monthlyPayment = principal * (monthlyRate * mathPower) / (mathPower - 1);
            totalCost = monthlyPayment * totalPayments;
            totalInterest = totalCost - principal;
        }

        monthlyPaymentEl.textContent = currency + formatCurrency(monthlyPayment);
        totalPrincipalEl.textContent = currency + formatCurrency(principal);
        totalInterestEl.textContent = currency + formatCurrency(totalInterest);
        totalCostEl.textContent = currency + formatCurrency(totalCost);

        resultContainer.style.display = 'block';
    });
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
