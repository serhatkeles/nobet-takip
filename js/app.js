// ==================== INIT ====================
function init() {
    setupEventListeners();

    const savedMonth = localStorage.getItem('nobet_current_month');
    if (savedMonth) {
        try {
            const parsed = JSON.parse(savedMonth);
            selectedMonth = parsed.month;
            selectedYear = parsed.year;
        } catch(e) {}
        loadFromStorage();
        renderNurseGrid();
        updateMonthLabel();
        updateSelectedCount();
    } else {
        showMonthInput(function(month, year) {
            selectedMonth = month;
            selectedYear = year;
            localStorage.setItem('nobet_current_month', JSON.stringify({ month, year }));
            loadFromStorage();
            renderNurseGrid();
            updateMonthLabel();
            updateSelectedCount();
        });
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    document.getElementById('selectAll').addEventListener('click', () => {
        selectedNurses = new Set(ALL_NURSES);
        renderNurseGrid();
        updateSelectedCount();
        saveToStorage();
    });

    document.getElementById('deselectAll').addEventListener('click', () => {
        selectedNurses.clear();
        renderNurseGrid();
        updateSelectedCount();
        saveToStorage();
    });

    // Reset month button & modal
    document.getElementById('btnResetMonth').addEventListener('click', showResetModal);
    document.getElementById('modalCancel').addEventListener('click', hideResetModal);
    document.getElementById('modalConfirm').addEventListener('click', resetForNewMonth);

    // Close modal on overlay click
    document.getElementById('resetModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) hideResetModal();
    });

    // Month input confirm
    document.getElementById('monthInputConfirm').addEventListener('click', confirmMonthInput);
    document.getElementById('monthTextInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') confirmMonthInput();
    });

    // Initial bottom bar
    updateBottomBar();
}

// ==================== SERVICE WORKER ====================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(r => r.unregister());
    });
    if ('caches' in window) {
        caches.keys().then(keys => {
            keys.forEach(k => caches.delete(k));
        });
    }
}

// ==================== START ====================
init();
