// ==================== NAVIGATION ====================
function goToScreen(num) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen${num}`).classList.add('active');
    currentScreen = num;

    // Step dots
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById(`dot${i}`);
        dot.className = 'step-dot';
        if (i < num) dot.classList.add('done');
        if (i === num) dot.classList.add('active');
    }

    // Subtitle
    const titles = { 1: 'Hemşire Seçimi', 2: 'Nöbet Girişi', 3: 'Özet' };
    document.getElementById('headerSubtitle').textContent = titles[num];

    // Bottom bar
    updateBottomBar();

    // Scroll to top
    window.scrollTo(0, 0);
}

function updateBottomBar() {
    const bar = document.getElementById('bottomBar');

    if (currentScreen === 1) {
        bar.innerHTML = `<button class="btn-primary" id="btnNext" ${selectedNurses.size === 0 ? 'disabled' : ''}>Devam Et</button>`;
        bar.querySelector('#btnNext').addEventListener('click', () => {
            saveToStorage();
            renderShiftEntry();
            goToScreen(2);
        });
    } else if (currentScreen === 2) {
        bar.innerHTML = `
            <div class="btn-row">
                <button class="btn-secondary" id="btnBack">Geri</button>
                <button class="btn-primary" id="btnNext">Özeti Göster</button>
            </div>
        `;
        bar.querySelector('#btnBack').addEventListener('click', () => {
            saveToStorage();
            goToScreen(1);
        });
        bar.querySelector('#btnNext').addEventListener('click', () => {
            saveToStorage();
            renderSummary();
            goToScreen(3);
        });
    } else if (currentScreen === 3) {
        bar.innerHTML = `<button class="btn-secondary" id="btnBack" style="width:100%">Geri Dön</button>`;
        bar.querySelector('#btnBack').addEventListener('click', () => {
            goToScreen(2);
        });
    }
}
