// ===== TRACK DATA WITH ALBUM COVERS =====
const tracks = {
    '1975': { name: 'About You', artist: 'The 1975', album: 'Being Funny in a Foreign Language', cover: 'img/being-funny.jpg' },
    'honne': { name: 'Location Unknown', artist: 'HONNE, BEKA', album: 'Location Unknown', cover: 'img/honne.png' },
    'mamaboy': { name: 'you!', artist: 'LANY', album: "Mama's Boy", cover: 'img/mamaboy.jpg' },
    'hindia': { name: 'Cincin', artist: 'Hindia', album: 'Cincin', cover: 'img/hindia.jpg' },
    'james': { name: 'A Thousand Years', artist: 'James Arthur', album: 'Back from the Edge', cover: 'img/james.jpg' },
};

// ===== ANNIVERSARY MILESTONE DATA =====
const milestones = {
    1: {
        title: "BAKSO BANGKOK",
        description: "Siapa yang cita-citanya curi curi waktu buat ketemu trs makan bakso, dan siapa yang cita citanya motornya gak bisa di start pas mau balik WKWKWKWK.<br> <b>Jujur agak asin baksonya tapi manis kenangannya.</b>",
    },
    2: {
        title: "WIDUDA SMA",
        description: "Pake outfit yang serasi gini serasa kek mau nikahan yahh (walaupun satu angkatan outfitnya sama sihh). <br> <b>Di hidup ini kadang kita juga ikut menanggung ketololan orang lain yaa hmmmm (aku masih dendam, emot marah)</b>",
    },
    3: {
        title: "UNKNOWN COFFE",
        description: "Hari-hari terakhir sebelum beranjak ke Jakarta, disisi lain bahagia keterima STIS, di sisi satunya berarti harus berpisah. <br> <b>Tidak apa apa sayang, untuk sekarang sejauh ini tempat memisahkan kita, untuk selanjutnya kita selalu bersama</b>",
    },
    4: {
        title: "SKYDECK SARINAH",
        description: "Jakarta dengan kenangannya, Jakarta dengan momen berharganya, Jakarta dengan keindahannya. <br> <b>kapan lagi yaa kita main di Jakarta (emot sedih)</b>",
    },
    5: {
        description: "<b>Dan tidak terasa sudah 7 tahun bersama🤍.</b>",
    }
};

// ===== AUDIO PLAYER VARIABLES =====
let currentSection = null;
let currentAudio = null;
let musicPlaying = false;

// DOM Elements
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const trackNameEl = document.getElementById('trackName');
const trackArtistEl = document.getElementById('trackArtist');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const progressBar = document.querySelector('.progress-bar');

// ===== SCROLL-BASED BACKGROUND TRANSITION =====
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
                updateTrackInfo(album);
            }
        }
    });
}

function updateBodyColor(album) {
    const colors = {
        '1975': '#f5f1e8',
        'honne': '#ebe5dc',
        'james': '#e8e4dc',
        'mamaboy': '#d4a574',
        'hindia': '#2b5a9e',
        'malibu': '#c77b8a'
    };
    document.body.style.backgroundColor = colors[album] || '#f5f1e8';
}

function updateAudioPlayer(album) {
    const players = {
        '1975': 'player-1975',
        'honne': 'player-honne',
        'mamaboy': 'player-mamaboy',
        'hindia': 'player-hindia',
        'james': 'player-james'
    };
    
    const newPlayer = document.getElementById(players[album]);
    if (!newPlayer) return;

    // Stop all other players first to avoid overlapping audio
    Object.values(players).forEach(playerId => {
        const player = document.getElementById(playerId);
        if (player && player !== newPlayer) {
            player.pause();
            player.currentTime = 0;
            player.volume = 0.4; // Reset to default
        }
    });

    currentAudio = newPlayer;
    
    // Set volume based on album
    let maxVol = 0.5;
    if (album === '1975') {
        maxVol = 0.60; // Sound of Rain is louder
    } else if (album === 'honne') {
        maxVol = 0.8; // dna (the older you get) is medium-loud
    } else if (album === 'hindia') {
        maxVol = 0.45; // dna (the older you get) is medium-loud
    } 
    
    currentAudio.volume = maxVol;

    // Auto-play next track if music was already playing
    if (musicPlaying) {
        currentAudio.currentTime = 0;
        
        const attemptPlay = () => {
            currentAudio.play().then(() => {
                // Track is now playing
            }).catch(err => {
                // Retry after a short delay if autoplay is blocked
                setTimeout(attemptPlay, 200);
            });
        };
        
        attemptPlay();
    }
}

function updateTrackInfo(album) {
    const track = tracks[album];
    if (track) {
        trackNameEl.textContent = track.name;
        trackArtistEl.textContent = track.artist;
        
        // Update album cover
        const albumImage = document.getElementById('albumImage');
        const albumPlaceholder = document.querySelector('.album-placeholder');
        
        if (track.cover) {
            albumImage.src = track.cover;
            albumImage.onload = function() {
                albumImage.classList.add('loaded');
                if (albumPlaceholder) albumPlaceholder.style.display = 'none';
            };
            albumImage.onerror = function() {
                albumImage.classList.remove('loaded');
                if (albumPlaceholder) albumPlaceholder.style.display = 'flex';
            };
        }
    }
}

// ===== FORMAT TIME =====
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===== UPDATE PROGRESS =====
function updateProgress() {
    if (currentAudio && currentAudio.duration) {
        const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(currentAudio.currentTime);
        totalTimeEl.textContent = formatTime(currentAudio.duration);
    }
}

// ===== PLAY/PAUSE CONTROLS =====
playBtn.addEventListener('click', () => {
    if (musicPlaying) {
        if (currentAudio) currentAudio.pause();
        playBtn.classList.remove('playing');
        musicPlaying = false;
    } else {
        if (currentAudio) {
            currentAudio.play().catch(err => console.log('Play prevented:', err));
        }
        playBtn.classList.add('playing');
        musicPlaying = true;
    }
});

// ===== PREV/NEXT CONTROLS =====
const albumOrder = ['1975', 'honne', 'mamaboy', 'hindia', 'james'];

prevBtn.addEventListener('click', () => {
    if (!currentSection) return;
    const currentIndex = albumOrder.indexOf(currentSection);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : albumOrder.length - 1;
    const targetAlbum = albumOrder[prevIndex];
    
    scrollToSection(targetAlbum);
});

nextBtn.addEventListener('click', () => {
    if (!currentSection) return;
    const currentIndex = albumOrder.indexOf(currentSection);
    const nextIndex = currentIndex < albumOrder.length - 1 ? currentIndex + 1 : 0;
    const targetAlbum = albumOrder[nextIndex];
    
    scrollToSection(targetAlbum);
});

function scrollToSection(album) {
    const section = document.querySelector(`[data-album="${album}"]`);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== PROGRESS BAR CLICK =====
progressBar.addEventListener('click', (e) => {
    if (currentAudio && currentAudio.duration) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        currentAudio.currentTime = percent * currentAudio.duration;
    }
});

// ===== TIMELINE MODAL =====
const modal = document.getElementById('timelineModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.querySelector('.modal-overlay');

function openModal(milestoneId, imageSrc) {
    const milestone = milestones[milestoneId];
    if (!milestone) return;

    modalBody.innerHTML = `
        <div class="modal-photo">
            <img src="${imageSrc}" alt="Memory">
        </div>
        <p class="modal-description">${milestone.description}</p>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}


function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all audio elements
    const audioElements = document.querySelectorAll('audio:not(#fireworkSound)');
    audioElements.forEach(audio => {
        audio.volume = 0.4;
        audio.pause();
        audio.currentTime = 0;
    });

    // Start music on page load
    musicPlaying = true;
    playBtn.classList.add('playing');

    // Trigger initial update
    updateBackground();
    
    // Setup scroll listener
    window.addEventListener('scroll', updateBackground);
    
    // Audio progress update
    setInterval(() => {
        if (currentAudio && !currentAudio.paused) {
            updateProgress();
        }
    }, 100);
    
    // Timeline clicks
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const imgSrc = img ? img.src : '';
            openModal(item.dataset.milestone, imgSrc);
        });
    });

    
    // Modal events
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
});

// ===== INTERSECTION OBSERVER =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.timeline-item, .photo-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
});
