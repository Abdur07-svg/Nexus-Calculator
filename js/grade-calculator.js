document.addEventListener('DOMContentLoaded', () => {
    const currentGrade = document.getElementById('current-grade');
    const targetGrade = document.getElementById('target-grade');
    const examWeight = document.getElementById('exam-weight');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        
        const current = parseFloat(currentGrade.value);
        const target = parseFloat(targetGrade.value);
        const weight = parseFloat(examWeight.value);

        if (isNaN(current) || isNaN(target) || isNaN(weight)) {
            errorMsg.textContent = 'Please enter valid numbers for all fields.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        if (weight <= 0 || weight > 100) {
            errorMsg.textContent = 'Final Exam Weight must be between 1% and 100%.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        // Formula: Target = Current * (1 - Weight) + Exam * Weight
        // Exam = (Target - Current * (1 - Weight)) / Weight
        const w = weight / 100;
        const required = (target - current * (1 - w)) / w;

        let statusText = "";
        let statusColor = "var(--text-primary)";

        if (required > 100) {
            statusText = "This might be impossible without extra credit.";
            statusColor = "#ff5252";
        } else if (required <= 0) {
            statusText = "You already achieved your target grade!";
            statusColor = "#4CAF50";
        } else {
            statusText = "You can do this. Good luck!";
            statusColor = "#FF9800";
        }

        detailedRes.innerHTML = `
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">You need to score</div>
            <div style="font-size: 32px; font-weight: 700; color: var(--btn-operator-color); margin-bottom: 10px;">
                ${Math.max(0, required).toFixed(2)}%
            </div>
            <div style="font-size: 16px; font-weight: 500; color: ${statusColor};">
                ${statusText}
            </div>
        `;

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        currentGrade.value = '';
        targetGrade.value = '';
        examWeight.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
