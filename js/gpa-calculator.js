document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const addCourseBtn = document.getElementById('add-course-btn');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        } else {
            alert(msg);
        }
    }
    const mainGpa = document.getElementById('main-gpa');
    const detailedGpa = document.getElementById('detailed-gpa');

    const gradePoints = {
        'A+': 4.3, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0 
    };

    const generateGradeOptions = () => {
        let options = '';
        for (const grade in gradePoints) {
            options += `<option value="${grade}">${grade}</option>`;
        }
        return options;
    };

    function addCourseRow() {
        const row = document.createElement('div');
        row.className = 'course-row';
        row.innerHTML = `
            <input type="text" placeholder="Name (Optional)" class="course-name">
            <input type="number" placeholder="Credits" value="3" min="1" step="0.5" class="course-credits">
            <select class="course-grade">
                ${generateGradeOptions()}
            </select>
            <button class="remove-btn"><i class="fa-solid fa-xmark"></i></button>
        `;

        row.querySelector('.remove-btn').addEventListener('click', () => {
            row.remove();
        });

        courseList.appendChild(row);
    }

    // Add 4 initial rows
    for (let i = 0; i < 4; i++) {
        addCourseRow();
    }

    addCourseBtn.addEventListener('click', addCourseRow);

    function calculateGPA() {
        if(errorMsg) errorMsg.style.display = 'none';
        const rows = courseList.querySelectorAll('.course-row');
        let totalCredits = 0;
        let totalPoints = 0;

        rows.forEach(row => {
            const creditsStr = row.querySelector('.course-credits').value;
            const grade = row.querySelector('.course-grade').value;
            
            const credits = parseFloat(creditsStr);
            if (!isNaN(credits) && credits > 0) {
                const points = gradePoints[grade] || 0;
                totalCredits += credits;
                totalPoints += (credits * points);
            }
        });

        if (totalCredits === 0) {
            mainGpa.textContent = '0.00';
            detailedGpa.textContent = 'Total Credits: 0';
            return;
        }

        const gpa = totalPoints / totalCredits;
        mainGpa.textContent = gpa.toFixed(2);
        detailedGpa.textContent = `Total Credits: ${totalCredits}`;
    }

    calcBtn.addEventListener('click', calculateGPA);

    clearBtn.addEventListener('click', () => {
        if(errorMsg) errorMsg.style.display = 'none';
        courseList.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            addCourseRow();
        }
        mainGpa.textContent = '0.00';
        detailedGpa.textContent = 'Total Credits: 0';
    });
});
