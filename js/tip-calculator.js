document.addEventListener('DOMContentLoaded', () => {
    const billInput = document.getElementById('bill');
    const tipInput = document.getElementById('tip');
    const splitInput = document.getElementById('split');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        } else {
            alert(msg);
        }
    }
    const resultBox = document.getElementById('result-box');
    
    const tipAmountDisplay = document.getElementById('tip-amount');
    const totalAmountDisplay = document.getElementById('total-amount');
    const perPersonDisplay = document.getElementById('per-person');

    const currencySelect = document.getElementById('currency');

    function calculateTip() {
        if(errorMsg) errorMsg.style.display = 'none';
        const bill = parseFloat(billInput.value);
        const tipAmount = parseFloat(tipInput.value);
        let split = parseInt(splitInput.value);
        const curr = currencySelect.value;

        if (isNaN(bill) || bill < 0) {
            showError('Please enter a valid bill amount.');
            return;
        }

        if (isNaN(tipAmount) || tipAmount < 0) {
            showError('Please enter a valid tip amount.');
            return;
        }

        if (isNaN(split) || split < 1) {
            split = 1;
            splitInput.value = 1;
        }

        const totalAmount = bill + tipAmount;
        const perPerson = totalAmount / split;

        tipAmountDisplay.textContent = `${curr}${tipAmount.toFixed(2)}`;
        totalAmountDisplay.textContent = `${curr}${totalAmount.toFixed(2)}`;
        perPersonDisplay.textContent = `${curr}${perPerson.toFixed(2)}`;
        
        resultBox.classList.add('active');
    }

    function clearData() {
        billInput.value = '';
        tipInput.value = '0';
        splitInput.value = '1';
        resultBox.classList.remove('active');
    }

    calcBtn.addEventListener('click', calculateTip);
    clearBtn.addEventListener('click', clearData);
});
