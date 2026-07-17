document.addEventListener('DOMContentLoaded', () => {
    const scoreInput = document.getElementById('score');
    const courseRatingInput = document.getElementById('course-rating');
    const slopeRatingInput = document.getElementById('slope-rating');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const mainRes = document.getElementById('main-res');
    const detailedRes = document.getElementById('detailed-res');

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        const score = parseFloat(scoreInput.value);
        const cr = parseFloat(courseRatingInput.value);
        const sr = parseFloat(slopeRatingInput.value);

        if (isNaN(score) || isNaN(cr) || isNaN(sr) || score <= 0 || cr <= 0 || sr <= 0) {
            errorMsg.textContent = 'Please enter valid positive numbers for all fields.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        // Handicap Differential formula: (Score - Course Rating) x 113 / Slope Rating
        let diff = ((score - cr) * 113) / sr;
        
        // Round to one decimal place per USGA rules
        diff = Math.round(diff * 10) / 10;

        mainRes.textContent = diff.toFixed(1);
        detailedRes.innerHTML = `This differential represents your performance for this specific round based on the course difficulty. Average your best differentials to find your official handicap index.`;
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        scoreInput.value = '';
        courseRatingInput.value = '';
        slopeRatingInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
