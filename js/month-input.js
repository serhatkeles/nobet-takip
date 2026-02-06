// ==================== MONTH INPUT ====================
const MONTHS_NORMALIZED = MONTHS_TR.map(m => m.toLowerCase()
    .replace(/ş/g,'s').replace(/ü/g,'u').replace(/ö/g,'o')
    .replace(/ç/g,'c').replace(/ı/g,'i').replace(/ğ/g,'g')
    .replace(/â/g,'a'));

function parseMonthInput(text) {
    text = text.trim().toLowerCase()
        .replace(/ş/g,'s').replace(/ü/g,'u').replace(/ö/g,'o')
        .replace(/ç/g,'c').replace(/ı/g,'i').replace(/ğ/g,'g')
        .replace(/â/g,'a');

    let foundMonth = -1;
    let foundYear = -1;

    for (let i = 0; i < MONTHS_NORMALIZED.length; i++) {
        if (text.includes(MONTHS_NORMALIZED[i])) {
            foundMonth = i;
            break;
        }
    }

    const yearMatch = text.match(/\b(20\d{2})\b/);
    if (yearMatch) {
        foundYear = parseInt(yearMatch[1]);
    }

    if (foundMonth === -1) return null;
    if (foundYear === -1) foundYear = new Date().getFullYear();

    return { month: foundMonth, year: foundYear };
}

function updateMonthLabel() {
    const label = `${MONTHS_TR[selectedMonth]} ${selectedYear}`;
    document.getElementById('monthLabel').textContent = label;
    document.getElementById('monthLabel2').textContent = label;
    document.getElementById('monthLabel3').textContent = label;
}

function showMonthInput(callback) {
    monthInputCallback = callback;
    const input = document.getElementById('monthTextInput');
    input.value = '';
    document.getElementById('monthInputError').textContent = '';
    document.getElementById('monthInputModal').classList.add('visible');
    setTimeout(() => input.focus(), 300);
}

function hideMonthInput() {
    document.getElementById('monthInputModal').classList.remove('visible');
    monthInputCallback = null;
}

function confirmMonthInput() {
    const input = document.getElementById('monthTextInput');
    const result = parseMonthInput(input.value);
    if (!result) {
        document.getElementById('monthInputError').textContent = 'Ay bulunamadi. Ornek: Subat 2026';
        return;
    }
    if (monthInputCallback) {
        monthInputCallback(result.month, result.year);
    }
    hideMonthInput();
}

// ==================== RESET / NEW MONTH ====================
function showResetModal() {
    document.getElementById('resetModal').classList.add('visible');
}

function hideResetModal() {
    document.getElementById('resetModal').classList.remove('visible');
}

function resetForNewMonth() {
    localStorage.removeItem(getStorageKey());
    localStorage.removeItem('nobet_current_month');
    hideResetModal();

    showMonthInput(function(month, year) {
        selectedMonth = month;
        selectedYear = year;
        localStorage.setItem('nobet_current_month', JSON.stringify({ month, year }));

        selectedNurses = new Set(ALL_NURSES);
        shiftData = {};

        updateMonthLabel();
        renderNurseGrid();
        updateSelectedCount();
        goToScreen(1);
    });
}
