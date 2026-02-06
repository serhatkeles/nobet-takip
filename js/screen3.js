// ==================== SCREEN 3: SUMMARY ====================
function renderSummary() {
    const container = document.getElementById('summaryContainer');
    container.innerHTML = '';

    const activeNurses = getSortedNurses().filter(n => selectedNurses.has(n));

    activeNurses.forEach(name => {
        const shifts = (shiftData[name] || []).filter(s => s.day && s.hours);

        if (shifts.length === 0) return;

        // Sort by day
        shifts.sort((a, b) => a.day - b.day);

        let dayTotal = 0;
        let nightTotal = 0;

        shifts.forEach(s => {
            const h = parseFloat(s.hours) || 0;
            if (s.type === 'gunduz') dayTotal += h;
            else nightTotal += h;
        });

        const card = document.createElement('div');
        card.className = 'summary-card';

        let tableRows = '';
        shifts.forEach(s => {
            const typeClass = s.type === 'gunduz' ? 'day' : 'night';
            const typeLabel = s.type === 'gunduz' ? 'Gündüz' : 'Gece';
            tableRows += `
                <tr>
                    <td>${s.day}. gün</td>
                    <td>${s.hours} saat</td>
                    <td><span class="type-badge ${typeClass}">${typeLabel}</span></td>
                </tr>
            `;
        });

        card.innerHTML = `
            <div class="summary-card-header">
                <div class="avatar-sm">${getInitials(name)}</div>
                <div class="name">${name}</div>
                <div class="header-actions">
                    <button class="btn-edit-nurse" title="Düzenle" data-edit-nurse="${name}">&#9998;</button>
                    <span class="summary-chevron">&#9654;</span>
                </div>
            </div>
            <div class="summary-totals">
                <div class="summary-total-item">
                    <div class="total-label">Gündüz</div>
                    <div class="total-value day-color">${dayTotal}</div>
                    <div class="total-unit">saat</div>
                </div>
                <div class="summary-total-item">
                    <div class="total-label">Gece</div>
                    <div class="total-value night-color">${nightTotal}</div>
                    <div class="total-unit">saat</div>
                </div>
                <div class="summary-total-item">
                    <div class="total-label">Toplam</div>
                    <div class="total-value total-color">${dayTotal + nightTotal}</div>
                    <div class="total-unit">saat</div>
                </div>
            </div>
            <div class="summary-card-body">
                <table class="summary-table">
                    <thead>
                        <tr>
                            <th>Tarih</th>
                            <th>Süre</th>
                            <th>Tip</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;

        // Toggle detail table on header click
        const header = card.querySelector('.summary-card-header');
        header.addEventListener('click', (e) => {
            // Don't toggle if edit button was clicked
            if (e.target.closest('.btn-edit-nurse')) return;
            card.classList.toggle('open');
        });

        // Edit button
        const editBtn = card.querySelector('.btn-edit-nurse');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const nurseName = editBtn.dataset.editNurse;
            renderShiftEntry();
            goToScreen(2);
            setTimeout(() => scrollToNurse(nurseName), 200);
        });

        container.appendChild(card);
    });
}
