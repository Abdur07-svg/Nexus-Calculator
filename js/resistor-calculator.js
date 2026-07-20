document.addEventListener('DOMContentLoaded', () => {
    const band1 = document.getElementById('band1');
    const band2 = document.getElementById('band2');
    const multiplier = document.getElementById('multiplier');
    const tolerance = document.getElementById('tolerance');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultBox = document.getElementById('result-box');
    const resultValue = document.getElementById('result-value');
    const resultTolerance = document.getElementById('result-tolerance');


    function formatResistance(ohms) {
        if (ohms >= 1000000) {
            return (ohms / 1000000).toFixed(ohms % 1000000 === 0 ? 0 : 2) + ' MΩ';
        } else if (ohms >= 1000) {
            return (ohms / 1000).toFixed(ohms % 1000 === 0 ? 0 : 2) + ' kΩ';
        }
        return ohms.toFixed(ohms % 1 !== 0 ? 2 : 0) + ' Ω';
    }

    calcBtn.addEventListener('click', () => {
        const val1 = parseInt(band1.value);
        const val2 = parseInt(band2.value);
        const mult = parseFloat(multiplier.value);
        const tol = parseFloat(tolerance.value);

        const baseValue = (val1 * 10) + val2;
        const finalValue = baseValue * mult;

        resultValue.textContent = formatResistance(finalValue);
        resultTolerance.textContent = `Tolerance: ±${tol}%`;
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        band1.value = '1'; // Brown
        band2.value = '0'; // Black
        multiplier.value = '100'; // Red
        tolerance.value = '5'; // Gold

        resultBox.classList.remove('active');
    });
});
