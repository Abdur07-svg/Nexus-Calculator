document.addEventListener('DOMContentLoaded', () => {
    const name1Input = document.getElementById('name1');
    const name2Input = document.getElementById('name2');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultBox = document.getElementById('result-box');
    const resultPercent = document.getElementById('result-percent');
    const resultMessage = document.getElementById('result-message');
    const errorMsg = document.getElementById('error-msg');

    function calculateLoveScore(name1, name2) {
        const str = (name1.toLowerCase().trim() + name2.toLowerCase().trim());
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash += str.charCodeAt(i);
        }
        // Generate a deterministic score between 0 and 99
        let score = (hash * 7) % 100;
        
        // Boost the score slightly so it's mostly positive
        if (score < 20) {
            score += 30;
        } else if (score > 90) {
            score = 100; // Perfect match!
        }
        return score;
    }

    function getLoveMessage(score) {
        if (score >= 90) return "A Match Made in Heaven! 💖";
        if (score >= 70) return "Very Strong Connection! 💕";
        if (score >= 50) return "There is Potential Here! 💘";
        if (score >= 30) return "Maybe Just Friends? 😅";
        return "Not Looking Good... 💔";
    }

    calcBtn.addEventListener('click', () => {
        const name1 = name1Input.value;
        const name2 = name2Input.value;

        if (!name1 || !name2) {
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        const score = calculateLoveScore(name1, name2);
        
        resultPercent.textContent = `${score}%`;
        resultMessage.textContent = getLoveMessage(score);
        
        // Dynamic coloring
        let color = '#ff5252'; // Default red
        if (score >= 70) {
            color = '#00e676'; // Green
        } else if (score >= 50) {
            color = '#ff9500'; // Orange
        }
        
        resultPercent.style.color = color;
        const heartIcon = document.querySelector('.heart-icon');
        if (heartIcon) {
            heartIcon.style.color = color;
        }
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        name1Input.value = '';
        name2Input.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
