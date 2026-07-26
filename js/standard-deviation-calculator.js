document.addEventListener('DOMContentLoaded', () => {
    const dataInput = document.getElementById('data-input');
    const calcMode = document.getElementById('calc-mode');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultMainSd = document.getElementById('result-main-sd');
    const mainResultLabel = document.getElementById('main-result-label');
    const resultAltSd = document.getElementById('result-alt-sd');
    const altResultLabel = document.getElementById('alt-result-label');
    
    const resultMean = document.getElementById('result-mean');
    const resultVariance = document.getElementById('result-variance');
    const resultCount = document.getElementById('result-count');
    const errorMsg = document.getElementById('error-msg');

    function calculateStandardDeviation() {
        // Parse the input data
        const rawData = dataInput.value.split(/[\s,]+/).filter(item => item.trim() !== '');
        
        const data = rawData.map(num => parseFloat(num)).filter(num => !isNaN(num));

        if (data.length < 2) {
            showError("Please enter at least two valid numbers to calculate standard deviation.");
            return;
        }

        errorMsg.style.display = 'none';

        const n = data.length;
        const mean = data.reduce((acc, val) => acc + val, 0) / n;
        
        const sumOfSquaredDifferences = data.reduce((acc, val) => {
            const diff = val - mean;
            return acc + (diff * diff);
        }, 0);

        const popVariance = sumOfSquaredDifferences / n;
        const sampleVariance = sumOfSquaredDifferences / (n - 1);

        const popSd = Math.sqrt(popVariance);
        const sampleSd = Math.sqrt(sampleVariance);

        const mode = calcMode.value;

        // Display results based on mode
        if (mode === 'sample') {
            mainResultLabel.textContent = "Sample Standard Deviation (s)";
            resultMainSd.textContent = formatNumber(sampleSd);
            
            altResultLabel.textContent = "Population SD (σ)";
            resultAltSd.textContent = formatNumber(popSd);
            
            // Variance label could be updated too, let's keep it simple
            document.querySelector('#result-variance').previousElementSibling.textContent = "Sample Variance (s²)";
            resultVariance.textContent = formatNumber(sampleVariance);
        } else {
            mainResultLabel.textContent = "Population Standard Deviation (σ)";
            resultMainSd.textContent = formatNumber(popSd);
            
            altResultLabel.textContent = "Sample SD (s)";
            resultAltSd.textContent = formatNumber(sampleSd);
            
            document.querySelector('#result-variance').previousElementSibling.textContent = "Population Variance (σ²)";
            resultVariance.textContent = formatNumber(popVariance);
        }

        resultMean.textContent = formatNumber(mean);
        resultCount.textContent = n.toString();
        
        resultBox.classList.add('active');
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

    calcBtn.addEventListener('click', calculateStandardDeviation);
    
    // Hide error message when user starts typing again
    dataInput.addEventListener('input', () => {
        errorMsg.style.display = 'none';
    });

    clearBtn.addEventListener('click', () => {
        dataInput.value = '';
        errorMsg.style.display = 'none';
        resultBox.classList.remove('active');
        dataInput.focus();
    });
});
