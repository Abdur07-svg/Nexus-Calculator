document.addEventListener('DOMContentLoaded', () => {
    const numDiceInput = document.getElementById('num-dice');
    const sidesSelect = document.getElementById('sides');
    const modifierInput = document.getElementById('modifier');
    
    const rollBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');

    rollBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        
        let numDice = parseInt(numDiceInput.value);
        let sides = parseInt(sidesSelect.value);
        let modifier = parseInt(modifierInput.value) || 0;

        if (isNaN(numDice) || numDice < 1 || numDice > 100) {
            errorMsg.textContent = 'Please enter a valid number of dice (1 to 100).';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        let rolls = [];
        let sum = 0;

        for (let i = 0; i < numDice; i++) {
            let roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            sum += roll;
        }

        let total = sum + modifier;
        let modStr = modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : '';
        
        let diceHtml = rolls.map(r => `<div class="die">${r}</div>`).join('');

        detailedRes.innerHTML = `
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 15px;">Result (${numDice}d${sides}${modStr})</div>
            
            <div class="dice-grid">
                ${diceHtml}
            </div>

            <div style="font-size: 14px; color: var(--text-secondary); margin-top: 15px; margin-bottom: 5px;">Total Sum</div>
            <div style="font-size: 32px; font-weight: 700; color: var(--btn-operator-color);">
                ${total}
            </div>
            
            ${modifier !== 0 ? `<div style="font-size: 12px; color: var(--text-secondary); margin-top: 5px;">Base sum was ${sum}</div>` : ''}
        `;

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        numDiceInput.value = '1';
        sidesSelect.value = '6';
        modifierInput.value = '0';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
