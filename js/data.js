// ==================== DATA ====================
const ALL_NURSES = [
    'Fatma Keleş', 'Tuğçe Baştürk', 'Meral Tanyeli', 'Ulviye Çaylak',
    'Ayşe Ünal Söylemez', 'Filiz Çetinkaya', 'Nilüfer Karakoç', 'Ayşe Ayazlı',
    'Şeniz Çelik', 'Seher Beğce', 'Semre Elbeyi', 'Burcu Mardin',
    'Dilara Gürdal', 'Gül Görhan', 'Muharrem Özden', 'Kürşat Solak'
];

const MONTHS_TR = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

let currentScreen = 1;
let selectedMonth = new Date().getMonth();
let selectedYear = new Date().getFullYear();
let selectedNurses = new Set(ALL_NURSES);
let shiftData = {};
let monthInputCallback = null;

function getSortedNurses() {
    return [...ALL_NURSES].sort((a, b) => a.localeCompare(b, 'tr'));
}

function getInitials(name) {
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}
