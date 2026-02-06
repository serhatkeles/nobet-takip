// ==================== STORAGE ====================
function getStorageKey() {
    return `nobet_${selectedYear}_${selectedMonth}`;
}

function saveToStorage() {
    const data = {
        selectedNurses: [...selectedNurses],
        shiftData: shiftData
    };
    localStorage.setItem(getStorageKey(), JSON.stringify(data));
}

function loadFromStorage() {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
        try {
            const data = JSON.parse(saved);
            selectedNurses = new Set(data.selectedNurses || ALL_NURSES);
            shiftData = data.shiftData || {};
        } catch (e) {
            selectedNurses = new Set(ALL_NURSES);
            shiftData = {};
        }
    } else {
        selectedNurses = new Set(ALL_NURSES);
        shiftData = {};
    }
}
