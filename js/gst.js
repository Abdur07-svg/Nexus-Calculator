document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('calc-gst-btn');
    const clearBtn = document.getElementById('clear-gst-btn');
    const resultContainer = document.getElementById('gst-result');
    
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const amountInput = document.getElementById('gst-amount').value;
            const rate = parseFloat(document.getElementById('gst-rate').value);
            const type = document.getElementById('gst-type').value;
            
            if (!amountInput || isNaN(amountInput) || amountInput <= 0) {
                return; // Handled by global validation
            }
            
            const amount = parseFloat(amountInput);
            
            let netAmount = 0;
            let totalGst = 0;
            let grossAmount = 0;
            
            if (type === 'add') {
                // GST is added to the base amount
                netAmount = amount;
                totalGst = amount * (rate / 100);
                grossAmount = netAmount + totalGst;
            } else {
                // GST is removed from the total amount
                grossAmount = amount;
                netAmount = grossAmount / (1 + (rate / 100));
                totalGst = grossAmount - netAmount;
            }
            
            const cgst = totalGst / 2;
            const sgst = totalGst / 2;
            const halfRate = rate / 2;
            
            // Format numbers to Indian currency style (₹)
            const formatCurrency = (num) => {
                return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            };
            
            document.getElementById('res-net').textContent = formatCurrency(netAmount);
            document.getElementById('res-cgst').textContent = formatCurrency(cgst);
            document.getElementById('res-sgst').textContent = formatCurrency(sgst);
            document.getElementById('res-total-gst').textContent = formatCurrency(totalGst);
            document.getElementById('res-gross').textContent = formatCurrency(grossAmount);
            
            document.getElementById('res-cgst-rate').textContent = halfRate;
            document.getElementById('res-sgst-rate').textContent = halfRate;
            
            resultContainer.style.display = 'block';
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.getElementById('gst-amount').value = '';
            document.getElementById('gst-rate').value = '18';
            document.getElementById('gst-type').value = 'add';
            resultContainer.style.display = 'none';
            
            const errorMsg = document.querySelector('.global-error-msg');
            if (errorMsg) errorMsg.remove();
        });
    }
});
