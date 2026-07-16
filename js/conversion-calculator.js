document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    const inputValue = document.getElementById('input-value');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    
    const resultBox = document.getElementById('result-box');
    const mainResult = document.getElementById('main-result');
    const detailedResult = document.getElementById('detailed-result');

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        }
    }

    const units = {
        length: {
            'm': { name: 'Meters (m)', factor: 1 },
            'km': { name: 'Kilometers (km)', factor: 1000 },
            'cm': { name: 'Centimeters (cm)', factor: 0.01 },
            'mm': { name: 'Millimeters (mm)', factor: 0.001 },
            'mi': { name: 'Miles (mi)', factor: 1609.344 },
            'yd': { name: 'Yards (yd)', factor: 0.9144 },
            'ft': { name: 'Feet (ft)', factor: 0.3048 },
            'in': { name: 'Inches (in)', factor: 0.0254 }
        },
        weight: {
            'kg': { name: 'Kilograms (kg)', factor: 1 },
            'g': { name: 'Grams (g)', factor: 0.001 },
            'mg': { name: 'Milligrams (mg)', factor: 0.000001 },
            'lb': { name: 'Pounds (lb)', factor: 0.45359237 },
            'oz': { name: 'Ounces (oz)', factor: 0.02834952 },
            't': { name: 'Metric Tons (t)', factor: 1000 }
        },
        area: {
            'm2': { name: 'Square Meters (m²)', factor: 1 },
            'km2': { name: 'Square Kilometers (km²)', factor: 1000000 },
            'ha': { name: 'Hectares (ha)', factor: 10000 },
            'ac': { name: 'Acres (ac)', factor: 4046.856 },
            'sqft': { name: 'Square Feet (sq ft)', factor: 0.092903 },
            'sqin': { name: 'Square Inches (sq in)', factor: 0.00064516 }
        },
        volume: {
            'l': { name: 'Liters (L)', factor: 1 },
            'ml': { name: 'Milliliters (mL)', factor: 0.001 },
            'm3': { name: 'Cubic Meters (m³)', factor: 1000 },
            'gal': { name: 'US Gallons (gal)', factor: 3.78541 },
            'qt': { name: 'US Quarts (qt)', factor: 0.946353 },
            'pt': { name: 'US Pints (pt)', factor: 0.473176 },
            'cup': { name: 'US Cups (cup)', factor: 0.24 },
            'floz': { name: 'US Fluid Ounces (fl oz)', factor: 0.0295735 }
        },
        temperature: {
            'c': { name: 'Celsius (°C)' },
            'f': { name: 'Fahrenheit (°F)' },
            'k': { name: 'Kelvin (K)' }
        }
    };

    function populateUnits() {
        const category = categorySelect.value;
        const currentUnits = units[category];
        
        fromUnit.innerHTML = '';
        toUnit.innerHTML = '';
        
        for (const [key, val] of Object.entries(currentUnits)) {
            const opt1 = document.createElement('option');
            opt1.value = key;
            opt1.textContent = val.name;
            fromUnit.appendChild(opt1);
            
            const opt2 = document.createElement('option');
            opt2.value = key;
            opt2.textContent = val.name;
            toUnit.appendChild(opt2);
        }
        
        // set default different selections if possible
        if (toUnit.options.length > 1) {
            toUnit.selectedIndex = 1;
        }
    }

    categorySelect.addEventListener('change', () => {
        populateUnits();
        resultBox.style.display = 'none';
        if(errorMsg) errorMsg.style.display = 'none';
    });

    // Initialize units
    populateUnits();

    function calculate() {
        if(errorMsg) errorMsg.style.display = 'none';
        
        const val = parseFloat(inputValue.value);
        if (isNaN(val)) {
            showError('Please enter a valid numeric value.');
            return;
        }
        
        const category = categorySelect.value;
        const from = fromUnit.value;
        const to = toUnit.value;
        
        let result = 0;
        
        if (category === 'temperature') {
            // Temperature requires specific formulas
            let inCelsius = 0;
            // Convert to Celsius first
            if (from === 'c') inCelsius = val;
            else if (from === 'f') inCelsius = (val - 32) * 5/9;
            else if (from === 'k') inCelsius = val - 273.15;
            
            // Convert Celsius to Target
            if (to === 'c') result = inCelsius;
            else if (to === 'f') result = (inCelsius * 9/5) + 32;
            else if (to === 'k') result = inCelsius + 273.15;
            
        } else {
            // Factor-based conversion (Base unit is factor 1)
            const fromFactor = units[category][from].factor;
            const toFactor = units[category][to].factor;
            
            // value in base unit
            const baseValue = val * fromFactor;
            result = baseValue / toFactor;
        }
        
        // Formatting
        let formattedResult = result;
        if (Math.abs(result) < 0.0001 || result > 1000000) {
            formattedResult = result.toExponential(4);
        } else {
            // max 6 decimal places, removing trailing zeros
            formattedResult = parseFloat(result.toFixed(6));
        }
        
        mainResult.textContent = formattedResult;
        detailedResult.textContent = `${val} ${units[category][from].name.split(' (')[0]} = ${formattedResult} ${units[category][to].name.split(' (')[0]}`;
        
        resultBox.style.display = 'block';
    }

    calcBtn.addEventListener('click', calculate);

    clearBtn.addEventListener('click', () => {
        inputValue.value = '';
        if(errorMsg) errorMsg.style.display = 'none';
        resultBox.style.display = 'none';
    });
});
