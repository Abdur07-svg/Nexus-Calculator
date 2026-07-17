document.addEventListener('DOMContentLoaded', () => {
    const formulaInput = document.getElementById('formula');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const mainRes = document.getElementById('main-res');
    const detailedRes = document.getElementById('detailed-res');

    const atomicWeights = {
        H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007, O: 15.999, F: 18.998, Ne: 20.180,
        Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.95, K: 39.098, Ca: 40.078,
        Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38,
        Ga: 69.723, Ge: 72.630, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224,
        Nb: 92.906, Mo: 95.95, Tc: 98, Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41, In: 114.82, Sn: 118.71,
        Sb: 121.76, Te: 127.60, I: 126.90, Xe: 131.29, Cs: 132.91, Ba: 137.33, La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24,
        Pm: 145, Sm: 150.36, Eu: 151.96, Gd: 157.25, Tb: 158.93, Dy: 162.50, Ho: 164.93, Er: 167.26, Tm: 168.93, Yb: 173.05,
        Lu: 174.97, Hf: 178.49, Ta: 180.95, W: 183.84, Re: 186.21, Os: 190.23, Ir: 192.22, Pt: 195.08, Au: 196.97, Hg: 200.59,
        Tl: 204.38, Pb: 207.2, Bi: 208.98, Po: 209, At: 210, Rn: 222, Fr: 223, Ra: 226, Ac: 227, Th: 232.04, Pa: 231.04, U: 238.03
    };

    function parseFormula(formula) {
        let weight = 0;
        const regex = /([A-Z][a-z]*)(\d*)/g;
        let match;
        let composition = {};
        let isValid = true;
        let elementsParsed = 0;

        while ((match = regex.exec(formula)) !== null) {
            const element = match[1];
            const countStr = match[2];
            const count = countStr ? parseInt(countStr) : 1;

            if (atomicWeights[element]) {
                weight += atomicWeights[element] * count;
                composition[element] = (composition[element] || 0) + count;
                elementsParsed++;
            } else {
                isValid = false;
                break;
            }
        }

        // If no elements were parsed or formula had invalid chars between valid ones
        if (!isValid || elementsParsed === 0 || formula.replace(regex, '').trim() !== '') {
            return null;
        }

        return { weight, composition };
    }

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        const formula = formulaInput.value.trim();

        if (!formula) {
            errorMsg.textContent = 'Please enter a chemical formula.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        const result = parseFormula(formula);

        if (!result) {
            errorMsg.textContent = 'Invalid formula or unknown element (e.g. use correct capitalization: NaCl).';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        mainRes.innerHTML = `${result.weight.toLocaleString(undefined, {maximumFractionDigits: 3})} <span style="font-size:18px;">g/mol</span>`;
        
        let details = '<strong>Composition:</strong><br>';
        for (const [el, count] of Object.entries(result.composition)) {
            const elWeight = atomicWeights[el] * count;
            const percentage = (elWeight / result.weight) * 100;
            details += `${el}: ${count} atom(s) - ${percentage.toFixed(2)}%<br>`;
        }
        
        detailedRes.innerHTML = details;
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        formulaInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
