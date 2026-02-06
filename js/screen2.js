// ==================== SCREEN 2: SHIFT ENTRY ====================
function renderShiftEntry() {
    const container = document.getElementById('shiftContainer');
    container.innerHTML = '';

    const activeNurses = getSortedNurses().filter(n => selectedNurses.has(n));

    activeNurses.forEach(name => {
        if (!shiftData[name]) {
            shiftData[name] = [];
        }

        const card = document.createElement('div');
        card.className = 'shift-nurse-card';

        const shiftCount = shiftData[name].length;

        card.innerHTML = `
            <div class="shift-nurse-header">
                <div class="nurse-info">
                    <div class="avatar-sm">${getInitials(name)}</div>
                    <div class="name">${name}</div>
                </div>
                <div class="header-right">
                    <input type="number" class="shift-count-input" inputmode="numeric"
                           min="1" max="31" placeholder="Kaç?"
                           title="Nöbet sayısı girin"
                           data-nurse-count="${name}">
                    <button class="btn-count-confirm" title="Nöbet oluştur">&#10003;</button>
                    <div class="shift-count-badge ${shiftCount === 0 ? 'empty' : ''}">${shiftCount}</div>
                    <span class="chevron-icon">&#9654;</span>
                </div>
            </div>
            <div class="shift-nurse-body" data-nurse="${name}">
                ${shiftCount === 0 ? '<div class="empty-shifts-msg">Henüz nöbet eklenmedi</div>' : ''}
            </div>
        `;

        container.appendChild(card);

        const body = card.querySelector('.shift-nurse-body');
        const header = card.querySelector('.shift-nurse-header');

        // Toggle open/close on header click
        header.addEventListener('click', (e) => {
            // Don't toggle when clicking the count input
            if (e.target.classList.contains('shift-count-input')) return;
            card.classList.toggle('open');
        });

        // Shift count input + confirm button
        const countInput = card.querySelector('.shift-count-input');
        const countConfirmBtn = card.querySelector('.btn-count-confirm');
        countInput.addEventListener('click', (e) => e.stopPropagation());
        countConfirmBtn.addEventListener('click', (e) => e.stopPropagation());

        function applyShiftCount() {
            const desired = parseInt(countInput.value);
            if (isNaN(desired) || desired < 1) return;
            const current = shiftData[name].length;
            if (desired > current) {
                const toAdd = desired - current;
                for (let i = 0; i < toAdd; i++) {
                    shiftData[name].push({ day: '', hours: '', type: 'gunduz' });
                }
                rebuildNurseShifts(card, name);
                card.classList.add('open');
                saveToStorage();
            }
            countInput.value = '';
        }

        countInput.addEventListener('change', applyShiftCount);
        countConfirmBtn.addEventListener('click', applyShiftCount);

        // Render existing shifts
        shiftData[name].forEach((shift, idx) => {
            body.appendChild(createShiftRow(name, idx, shift));
        });

        // Add shift button
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-add-shift';
        addBtn.innerHTML = '<span style="font-size:20px">+</span> Nöbet Ekle';
        addBtn.addEventListener('click', () => {
            shiftData[name].push({ day: '', hours: '', type: 'gunduz' });
            rebuildNurseShifts(card, name);
            card.classList.add('open');
            saveToStorage();
        });
        body.appendChild(addBtn);

        // Save/close button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn-save-section';
        saveBtn.textContent = 'Kaydet';
        saveBtn.addEventListener('click', () => {
            saveToStorage();
            card.classList.remove('open');
            updateShiftBadge(card, name);
        });
        body.appendChild(saveBtn);

        // If there are existing shifts, open the card
        if (shiftCount > 0) {
            // Keep closed by default
        }
    });
}

function rebuildNurseShifts(card, nurseName) {
    const body = card.querySelector('.shift-nurse-body');
    const addBtn = body.querySelector('.btn-add-shift');
    const saveBtn = body.querySelector('.btn-save-section');

    // Remove all shift rows and empty message
    body.querySelectorAll('.shift-entry').forEach(r => r.remove());
    body.querySelector('.empty-shifts-msg')?.remove();

    if (shiftData[nurseName].length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-shifts-msg';
        emptyMsg.textContent = 'Henüz nöbet eklenmedi';
        body.insertBefore(emptyMsg, addBtn);
    } else {
        shiftData[nurseName].forEach((s, i) => {
            body.insertBefore(createShiftRow(nurseName, i, s), addBtn);
        });
    }
    updateShiftBadge(card, nurseName);
}

function createShiftRow(nurseName, index, shift) {
    const row = document.createElement('div');
    row.className = 'shift-entry';
    row.dataset.index = index;

    row.innerHTML = `
        <div class="shift-field">
            <label>Gün</label>
            <input type="number" inputmode="numeric" min="1" max="31"
                   value="${shift.day || ''}"
                   data-field="day">
        </div>
        <div class="shift-field">
            <label>Saat</label>
            <input type="number" inputmode="numeric" min="1" max="24"
                   value="${shift.hours || ''}"
                   data-field="hours">
        </div>
        <div class="shift-field">
            <label>Tip</label>
            <div class="shift-type-toggle">
                <button class="shift-type-btn ${shift.type === 'gunduz' ? 'active-day' : ''}"
                        data-type="gunduz">Gündüz</button>
                <button class="shift-type-btn ${shift.type === 'gece' ? 'active-night' : ''}"
                        data-type="gece">Gece</button>
            </div>
        </div>
        <button class="btn-delete-shift" title="Sil">&times;</button>
    `;

    // Input events
    row.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
            const field = input.dataset.field;
            let val = parseInt(input.value);
            if (field === 'day' && val > 31) val = 31;
            if (field === 'day' && val < 1) val = 1;
            if (field === 'hours' && val > 24) val = 24;
            if (field === 'hours' && val < 1) val = 1;
            if (!isNaN(val)) {
                input.value = val;
                shiftData[nurseName][index][field] = val;
            } else {
                shiftData[nurseName][index][field] = '';
            }
            saveToStorage();
        });
    });

    // Type toggle
    row.querySelectorAll('.shift-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            row.querySelector('.active-day')?.classList.remove('active-day');
            row.querySelector('.active-night')?.classList.remove('active-night');
            const type = btn.dataset.type;
            btn.classList.add(type === 'gunduz' ? 'active-day' : 'active-night');
            shiftData[nurseName][index].type = type;
            saveToStorage();
        });
    });

    // Delete
    row.querySelector('.btn-delete-shift').addEventListener('click', () => {
        shiftData[nurseName].splice(index, 1);
        const card = row.closest('.shift-nurse-card');
        rebuildNurseShifts(card, nurseName);
        saveToStorage();
    });

    return row;
}

function updateShiftBadge(card, nurseName) {
    const badge = card.querySelector('.shift-count-badge');
    const count = shiftData[nurseName].length;
    badge.textContent = count;
    badge.className = 'shift-count-badge' + (count === 0 ? ' empty' : '');
}

function scrollToNurse(name) {
    const el = document.querySelector(`[data-nurse="${name}"]`);
    if (el) {
        const card = el.closest('.shift-nurse-card');
        if (card) {
            card.classList.add('open');
            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
}
