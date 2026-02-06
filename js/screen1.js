// ==================== SCREEN 1: NURSE SELECTION ====================
function renderNurseGrid() {
    const grid = document.getElementById('nurseGrid');
    grid.innerHTML = '';

    const sortedNurses = getSortedNurses();

    sortedNurses.forEach(name => {
        const card = document.createElement('div');
        card.className = 'nurse-card' + (selectedNurses.has(name) ? ' selected' : '');
        card.innerHTML = `
            <div class="nurse-avatar">${getInitials(name)}</div>
            <div class="nurse-name">${name}</div>
            <div class="check-icon"></div>
        `;
        card.addEventListener('click', () => {
            if (selectedNurses.has(name)) {
                selectedNurses.delete(name);
            } else {
                selectedNurses.add(name);
            }
            card.classList.toggle('selected');
            updateSelectedCount();
            saveToStorage();
        });
        grid.appendChild(card);
    });
}

function updateSelectedCount() {
    const count = selectedNurses.size;
    document.getElementById('selectedCount').innerHTML =
        `<strong>${count}</strong> / ${ALL_NURSES.length} hemşire seçili`;

    const btn = document.getElementById('btnNext');
    if (currentScreen === 1 && btn) {
        btn.disabled = count === 0;
    }
}
