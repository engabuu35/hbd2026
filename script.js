// ===== MILESTONE DATA =====
const milestones = {
    1: {
        title: "Januari 2020",
        subtitle: "Pertemuan Pertama",
        description: "Ini adalah momen ketika semuanya dimulai. Pertemuan yang tidak terduga yang mengubah segalanya. Hari itu, tanpa kita sadari, adalah awal dari perjalanan indah yang akan kita lalui bersama.",
        details: "Tempat: [Lokasi placeholder]\nCuaca: [Cuaca placeholder]\nPerasaan: Excited dan nervous di saat yang bersamaan!"
    },
    2: {
        title: "Maret 2020",
        subtitle: "Momen Spesial",
        description: "Momen yang membuat kita semakin dekat. Waktu berjalan begitu cepat ketika kita bersama, dan setiap detiknya terasa berharga. Ini adalah saat di mana kita mulai memahami satu sama lain lebih dalam.",
        details: "Aktivitas: [Aktivitas placeholder]\nMakanan favorit: [Makanan placeholder]\nLagu yang diputar: LANY - ILYSB"
    },
    3: {
        title: "Juli 2021",
        subtitle: "Petualangan Bersama",
        description: "Petualangan pertama kita yang tak terlupakan! Dari pagi hingga malam, kita menciptakan kenangan yang akan selalu tersimpan di hati. Tawa, cerita, dan momen-momen kecil yang membuat hari itu sempurna.",
        details: "Destinasi: [Destinasi placeholder]\nHighlight: [Highlight placeholder]\nQuote: 'Adventure is out there!'"
    },
    4: {
        title: "Desember 2022",
        subtitle: "Kenangan Indah",
        description: "Akhir tahun yang penuh makna. Kita merayakan pencapaian, berbagi mimpi, dan membuat rencana untuk masa depan. Momen ini mengingatkan kita betapa beruntungnya kita memiliki satu sama lain.",
        details: "Perayaan: [Perayaan placeholder]\nHadiah: [Hadiah placeholder]\nResolusi: Lebih banyak petualangan di tahun depan!"
    },
    5: {
        title: "Juni 2023",
        subtitle: "Pencapaian Besar",
        description: "Momen kebanggaan! Kita merayakan pencapaian yang luar biasa. Semua kerja keras, dukungan, dan doa akhirnya membuahkan hasil. Ini adalah bukti bahwa bersama, kita bisa meraih apapun.",
        details: "Pencapaian: [Pencapaian placeholder]\nPerasaan: Sangat bangga dan bahagia!\nPesan: 'We did it!'"
    },
    6: {
        title: "2024",
        subtitle: "Tahun Penuh Makna",
        description: "Tahun ini penuh dengan pembelajaran, pertumbuhan, dan kenangan baru. Setiap tantangan kita hadapi bersama, setiap kebahagiaan kita rayakan bersama. Dan sekarang, kita merayakan hari istimewamu!",
        details: "Highlight tahun ini: [Highlight placeholder]\nPelajaran: [Pelajaran placeholder]\nHarapan: Tahun depan akan lebih baik lagi!"
    }
};

// ===== SCROLL-BASED BACKGROUND TRANSITION =====
let currentSection = null;

function updateBackground() {
    const sections = document.querySelectorAll('.album-section');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const album = section.dataset.album;
            
            if (currentSection !== album) {
                currentSection = album;
                updateBodyColor(album);
                updateAudioPlayer(album);
            }
        }
    });
}

function updateBodyColor(album) {
    const colors = {
        'lany': '#f5f1e8',
        'ggbbxx': '#ebe5dc',
        'soft': '#e8e4dc',
        'mamaboy': '#d4a574',
        'blur': '#2b5a9e',
        'malibu': '#c77b8a'
    };
    
    document.body.style.backgroundColor = colors[album] || '#f5f1e8';
}

let currentAudio = null;

function updateAudioPlayer(album) {
    const players = {
        'lany': 'player-lany',
        'ggbbxx': 'player-ggbbxx',
        'soft': 'player-soft',
        'mamaboy': 'player-mamaboy',
        'blur': 'player-blur',
        'malibu': 'player-malibu'
    };
    
    const newPlayer = document.getElementById(players[album]);
    
    // If switching to a different player
    if (currentAudio && currentAudio !== newPlayer) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    // Set new current player
    currentAudio = newPlayer;
    
    // Auto-play if music is enabled
    if (currentAudio && musicPlaying) {
        currentAudio.play().catch(err => {
            console.log('Auto-play prevented:', err);
        });
    }
}

// ===== TIMELINE MODAL =====
const modal = document.getElementById('timelineModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.querySelector('.modal-overlay');

function openModal(milestoneId) {
    const milestone = milestones[milestoneId];
    
    if (milestone) {
        modalBody.innerHTML = `
            <h2>${milestone.subtitle}</h2>
            <h3>${milestone.title}</h3>
            <div class="modal-image">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
            </div>
            <p>${milestone.description}</p>
            <p style="white-space: pre-line; background: rgba(0,0,0,0.05); padding: 1rem; border-radius: 8px; margin-top: 1rem;">${milestone.details}</p>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== MUSIC CONTROL =====
const musicToggle = document.getElementById('musicToggle');
let musicPlaying = false;

musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
        // Pause current audio
        if (currentAudio) {
            currentAudio.pause();
        }
        musicToggle.classList.remove('playing');
        musicPlaying = false;
    } else {
        // Play current audio
        if (currentAudio) {
            currentAudio.play().catch(err => {
                console.log('Play prevented:', err);
            });
        }
        musicToggle.classList.add('playing');
        musicPlaying = true;
    }
});

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initial background color
    updateBackground();
    
    // Scroll event for background transition
    window.addEventListener('scroll', updateBackground);
    
    // Timeline item clicks
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', () => {
            const milestoneId = item.dataset.milestone;
            openModal(milestoneId);
        });
    });
    
    // Modal close events
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
});

// Observe photo items
document.querySelectorAll('.photo-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
});
