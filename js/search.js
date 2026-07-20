document.addEventListener('DOMContentLoaded', () => {
    // Inject the search overlay HTML into the body if it doesn't exist
    if (!document.getElementById('search-overlay')) {
        const overlayHTML = `
            <div class="search-overlay" id="search-overlay">
                <div class="search-container">
                    <div class="search-header">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="search-input" placeholder="Search calculators..." autocomplete="off">
                        <i class="fa-solid fa-xmark" id="close-search"></i>
                    </div>
                    <div class="search-results" id="search-results">
                        <!-- Results injected here -->
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
    }

    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeSearchBtn = document.getElementById('close-search');

    // Attach click listeners to all search buttons on the page
    const searchBtns = document.querySelectorAll('#search-btn, .fa-magnifying-glass[title="Search"]');
    searchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchInput.value = '';
            renderResults('');
            setTimeout(() => searchInput.focus(), 100);
        });
    });

    closeSearchBtn.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    // Close on overlay click
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });

    // Determine the base path for URLs depending on where we are
    // If the current path contains /other/, we need to adjust paths
    const isOtherDir = window.location.pathname.includes('/other/');
    const basePath = isOtherDir ? '../' : './';
    const otherPath = isOtherDir ? './' : 'other/';

    const calculators = [
        { name: 'Standard Calculator', icon: 'fa-calculator', url: basePath + 'index.html', real: true },
        { name: 'Age Calculator', icon: 'fa-calendar-days', url: otherPath + 'age-calculator.html', real: true },
        { name: 'Password Generator', icon: 'fa-key', url: otherPath + 'password-generator.html', real: true },
        { name: 'Tip Calculator', icon: 'fa-coins', url: otherPath + 'tip-calculator.html', real: true },
        { name: 'Time Calculator', icon: 'fa-clock', url: otherPath + 'time-calculator.html', real: true },
        { name: 'GPA Calculator', icon: 'fa-graduation-cap', url: otherPath + 'gpa-calculator.html', real: true },
        { name: 'Height Calculator', icon: 'fa-ruler-vertical', url: otherPath + 'height-calculator.html', real: true },
        { name: 'IP Subnet Calculator', icon: 'fa-network-wired', url: otherPath + 'ip-subnet-calculator.html', real: true },
        { name: 'Conversion Calculator', icon: 'fa-right-left', url: otherPath + 'conversion-calculator.html', real: true },
        { name: 'Voltage Drop Calculator', icon: 'fa-bolt', url: otherPath + 'voltage-drop-calculator.html', real: true },
        { name: 'Square Footage Calculator', icon: 'fa-vector-square', url: otherPath + 'square-footage-calculator.html', real: true },
        { name: 'Time Zone Calculator', icon: 'fa-globe', url: otherPath + 'time-zone-calculator.html', real: true },
        { name: 'GDP Calculator', icon: 'fa-chart-line', url: otherPath + 'gdp-calculator.html', real: true },
        { name: 'Horsepower Calculator', icon: 'fa-horse-head', url: otherPath + 'horsepower-calculator.html', real: true },
        { name: 'Stair Calculator', icon: 'fa-stairs', url: otherPath + 'stair-calculator.html', real: true },
        { name: 'Ohms Law Calculator', icon: 'fa-bolt', url: otherPath + 'ohms-law-calculator.html', real: true },
        { name: 'Shoe Size Conversion', icon: 'fa-shoe-prints', url: otherPath + 'shoe-size-conversion.html', real: true },
        { name: 'Mileage Calculator', icon: 'fa-car', url: otherPath + 'mileage-calculator.html', real: true },
        { name: 'Mass Calculator', icon: 'fa-weight-hanging', url: otherPath + 'mass-calculator.html', real: true },
        { name: 'Speed Calculator', icon: 'fa-gauge-high', url: otherPath + 'speed-calculator.html', real: true },
        { name: 'Molecular Weight Calculator', icon: 'fa-atom', url: otherPath + 'molecular-weight-calculator.html', real: true },
        { name: 'Golf Handicap Calculator', icon: 'fa-golf-ball-tee', url: otherPath + 'golf-handicap-calculator.html', real: true },
        { name: 'Tire Size Calculator', icon: 'fa-truck-monster', url: otherPath + 'tire-size-calculator.html', real: true },
        { name: 'Tile Calculator', icon: 'fa-table-cells', url: otherPath + 'tile-calculator.html', real: true },
        { name: 'Gravel Calculator', icon: 'fa-mound', url: otherPath + 'gravel-calculator.html', real: true },
        { name: 'Heat Index Calculator', icon: 'fa-temperature-high', url: otherPath + 'heat-index-calculator.html', real: true },
        { name: 'Bandwidth Calculator', icon: 'fa-wifi', url: otherPath + 'bandwidth-calculator.html', real: true },
        { name: 'URL Encode / Decode', icon: 'fa-link', url: otherPath + 'url-encode-decode.html', real: true },
        { name: 'Day Counter', icon: 'fa-calendar-check', url: otherPath + 'day-counter.html', real: true },
        { name: 'Date Calculator', icon: 'fa-calendar-alt', url: otherPath + 'date-calculator.html', real: true },
        { name: 'Hours Calculator', icon: 'fa-hourglass', url: otherPath + 'hours-calculator.html', real: true },
        { name: 'Grade Calculator', icon: 'fa-check-double', url: otherPath + 'grade-calculator.html', real: true },
        { name: 'Concrete Calculator', icon: 'fa-trowel-bricks', url: otherPath + 'concrete-calculator.html', real: true },
        { name: 'Bra Size Calculator', icon: 'fa-person-dress', url: otherPath + 'bra-size-calculator.html', real: true },
        { name: 'Dice Roller', icon: 'fa-dice', url: otherPath + 'dice-roller.html', real: true },
        { name: 'Fuel Cost Calculator', icon: 'fa-gas-pump', url: otherPath + 'fuel-cost-calculator.html', real: true },
        { name: 'BTU Calculator', icon: 'fa-fire', url: otherPath + 'btu-calculator.html', real: true },
        { name: 'Time Card Calculator', icon: 'fa-id-card', url: otherPath + 'time-card-calculator.html', real: true },
        { name: 'Love Calculator', icon: 'fa-heart', url: otherPath + 'love-calculator.html', real: true },
        { name: 'Gas Mileage Calculator', icon: 'fa-car-side', url: otherPath + 'gas-mileage-calculator.html', real: true },
        { name: 'Engine Horsepower Calculator', icon: 'fa-car-battery', url: otherPath + 'engine-horsepower-calculator.html', real: true },
        { name: 'Resistor Calculator', icon: 'fa-microchip', url: otherPath + 'resistor-calculator.html', real: true },
        { name: 'Electricity Calculator', icon: 'fa-plug', url: otherPath + 'electricity-calculator.html', real: true },
        { name: 'Density Calculator', icon: 'fa-cube', url: otherPath + 'density-calculator.html', real: true },
        { name: 'Weight Calculator', icon: 'fa-weight-scale', url: otherPath + 'weight-calculator.html', real: true },
        { name: 'Molarity Calculator', icon: 'fa-vial', url: otherPath + 'molarity-calculator.html', real: true },
        { name: 'Roman Numeral Converter', icon: 'fa-font', url: otherPath + 'roman-numeral-converter.html', real: true },
        { name: 'Sleep Calculator', icon: 'fa-bed', url: otherPath + 'sleep-calculator.html', real: true },
        { name: 'Roofing Calculator', icon: 'fa-house', url: otherPath + 'roofing-calculator.html', real: true },
        { name: 'Mulch Calculator', icon: 'fa-leaf', url: '#', real: false },
        { name: 'Wind Chill Calculator', icon: 'fa-wind', url: '#', real: false },
        { name: 'Dew Point Calculator', icon: 'fa-droplet', url: '#', real: false },
        { name: 'Base64 Encode / Decode', icon: 'fa-code', url: '#', real: false },
        { name: 'Time Duration Calculator', icon: 'fa-stopwatch', url: '#', real: false },
        { name: 'Day of the Week Calculator', icon: 'fa-calendar-day', url: '#', real: false }
    ];



    function renderResults(query) {
        searchResults.innerHTML = '';
        const q = query.toLowerCase().trim();
        
        if (q === '') {
            return; // Show nothing if search is empty
        }
        
        const filtered = calculators.filter(calc => calc.name.toLowerCase().includes(q));

        if (filtered.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No calculators found.</div>';
            return;
        }

        filtered.forEach(calc => {
            const item = document.createElement('a');
            item.className = 'search-item';
            item.href = calc.url;
            item.innerHTML = `
                <i class="fa-solid ${calc.icon}"></i>
                <span>${calc.name}</span>
            `;
            searchResults.appendChild(item);
        });
    }

    searchInput.addEventListener('input', (e) => {
        renderResults(e.target.value);
    });

    // --- Global Calculator UI Enhancements ---
    // 1. Hide error message immediately when the user starts typing/changing inputs
    document.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            const errorMsg = document.getElementById('error-msg') || document.querySelector('.error-msg');
            if (errorMsg) {
                errorMsg.style.display = 'none';
            }
        }
    });

    // 2. Ensure result box and error message are completely hidden when clicking any "Clear" button
    document.addEventListener('click', (e) => {
        if (e.target && (e.target.id === 'clear-btn' || e.target.classList.contains('btn-clear'))) {
            const errorMsg = document.getElementById('error-msg') || document.querySelector('.error-msg');
            if (errorMsg) {
                errorMsg.style.display = 'none';
            }
            
            const resultBox = document.getElementById('result-box') || document.querySelector('.result-box');
            if (resultBox) {
                resultBox.classList.remove('active');
                resultBox.style.display = 'none';
                
                // Reset display property inline in case it was explicitly set somewhere else
                setTimeout(() => {
                    resultBox.style.display = ''; // Fallback to css class behavior
                }, 10);
            }
            
            // For calculators that use detailed-res to show result
            const detailedRes = document.getElementById('detailed-res') || document.querySelector('.result-details');
            if (detailedRes) {
                detailedRes.innerHTML = '';
            }
        }
    });
});
