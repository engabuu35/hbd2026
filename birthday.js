// ===== TRACK DATA WITH ALBUM COVERS =====
const tracks = {
    'lany': { name: 'ILYSB', artist: 'LANY', album: 'LANY', cover: 'img/lany.png' },
    'ggbbxx': { name: 'the older you get, the less you cry', artist: 'LANY', album: 'gg bb xx', cover: 'img/ggbbxx.jpg' },
    'soft': { name: 'Sound Of Rain', artist: 'LANY', album: 'Soft', cover: 'img/soft.jpg' },
    'mamaboy': { name: 'nobody else', artist: 'LANY', album: "Mama's Boy", cover: 'img/mamaboy.jpg' },
    'blur': { name: 'Alonica', artist: 'LANY', album: 'A Beautiful Blur', cover: 'img/blur.jpeg' },
    'malibu': { name: 'Let Me Know', artist: 'LANY', album: 'Malibu Nights', cover: 'img/malibu.jpg' }
};

// ===== BIRTHDAY MILESTONE DATA =====
const milestones = {
    1: {
        title: "2006",
        subtitle: "Lahir ke Dunia",
        description: "Awal dari perjalanan yang luar biasa. Hari di mana dunia menyambut kehadiranmu dengan penuh sukacita.",
        details: "Tempat lahir: [Lokasi placeholder]\nTanggal: [Tanggal placeholder]"
    },
    2: {
        title: "2012",
        subtitle: "Masuk SD",
        description: "Petualangan pendidikan pertama dimulai! Hari-hari penuh dengan pembelajaran dan teman baru.",
        details: "Sekolah: [Nama sekolah placeholder]"
    },
    3: {
        title: "2018",
        subtitle: "Masuk SMP",
        description: "Babak baru dalam kehidupan! Masa transisi yang penuh dengan perubahan.",
        details: "Sekolah: [Nama sekolah placeholder]"
    },
    4: {
        title: "2021",
        subtitle: "Masuk SMA",
        description: "Memasuki masa remaja yang penuh warna dengan banyak pencapaian!",
        details: "Sekolah: [Nama sekolah placeholder]"
    },
    5: {
        title: "2024",
        subtitle: "Masuk Kuliah",
        description: "Langkah besar menuju masa depan! Memulai perjalanan pendidikan tinggi.",
        details: "Kampus: [Nama kampus placeholder]"
    },
    6: {
        title: "2026",
        subtitle: "20 Tahun!",
        description: "Dua dekade kehidupan yang luar biasa! Selamat ulang tahun yang ke-20! 🎂",
        details: "Happy 20th Birthday!"
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
                updateAudioPlayer(album);
                updateTrackInfo(album);
            }
        }
    });
}

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
    if (album === 'soft') {
        maxVol = 0.75; // Sound of Rain is louder
    } else if (album === 'ggbbxx') {
        maxVol = 0.7; // The older you get is medium-loud
    } else if (album === 'mamaboy') {
        maxVol = 0.65; // The older you get is medium-loud
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
const albumOrder = ['lany', 'ggbbxx', 'blur', 'malibu', 'mamaboy', 'soft'];

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
        item.addEventListener('click', () => openModal(item.dataset.milestone));
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

// ===== CAKE INTERACTION =====
const cake = document.querySelector('.cake');
const flame = document.querySelector('.flame');
const cakeMessage = document.querySelector('.cake-message p');
const blowBtn = document.getElementById('blowCandleBtn');
const fireworkSound = document.getElementById('fireworkSound');
let candleBlown = false;

const blowCandle = () => {
    if (!candleBlown) {
        // Blow out the candle
        flame.classList.add('extinguished');
        candleBlown = true;
        
        // Disable button
        if (blowBtn) {
            blowBtn.disabled = true;
            blowBtn.innerText = "Sudah Ditiup! ✨";
        }
        
        // Play sound
        if (fireworkSound) {
            fireworkSound.volume = 0.8;
            fireworkSound.play().catch(e => console.log('Audio playback failed', e));
        }

        // Create smoke effect
        const candle = document.querySelector('.candle');
        if (candle) {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const smoke = document.createElement('div');
                    smoke.classList.add('smoke');
                    const randomX = Math.random() * 10 - 5;
                    smoke.style.transform = `translate(calc(-50% + ${randomX}px), 0)`;
                    candle.appendChild(smoke);
                    setTimeout(() => smoke.remove(), 2000);
                }, i * 200);
            }
        }
        
        // Update message
        if (cakeMessage) {
            cakeMessage.style.opacity = '0';
            setTimeout(() => {
                cakeMessage.innerText = "Yeyy! Semoga semua harapanmu terkabul Sayangg! 🎉❤️";
                cakeMessage.style.opacity = '1';
            }, 500);
        }

        // Fireworks Explosion (5 seconds)
        const cakeSection = document.getElementById('section-ggbbxx');
        if (cakeSection) {
            const createExplosion = (x, y) => {
                const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff4081', '#18ffff'];
                const particleCount = 100;
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('firework-particle');
                    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    particle.style.left = x;
                    particle.style.top = y;
                    
                    const angle = Math.random() * Math.PI * 2;
                    const velocity = 50 + Math.random() * 350;
                    const tx = Math.cos(angle) * velocity + 'px';
                    const ty = Math.sin(angle) * velocity + 'px';
                    
                    particle.style.setProperty('--tx', tx);
                    particle.style.setProperty('--ty', ty);
                    
                    const size = 3 + Math.random() * 5;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;

                    cakeSection.appendChild(particle);
                    setTimeout(() => particle.remove(), 1500);
                }
            };

            const duration = 5000;
            const explosionInterval = 300;
            
            // Initial burst
            createExplosion('50%', '50%');

            const intervalId = setInterval(() => {
                const x = (20 + Math.random() * 60) + '%';
                const y = (20 + Math.random() * 60) + '%';
                createExplosion(x, y);
            }, explosionInterval);

            // Balloon burst
            const createBalloons = () => {
                const balloonColors = ['#ff6b9d', '#ff9fb4', '#fce4ec', '#9287e3', '#79a8de'];
                for (let i = 0; i < 20; i++) {
                    setTimeout(() => {
                        const balloon = document.createElement('div');
                        balloon.classList.add('balloon');
                        balloon.style.backgroundColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
                        balloon.style.left = Math.random() * 100 + '%';
                        balloon.style.animationDuration = (4 + Math.random() * 4) + 's';
                        balloon.style.opacity = 0.6 + Math.random() * 0.4;
                        cakeSection.appendChild(balloon);
                        setTimeout(() => balloon.remove(), 8000);
                    }, i * 150);
                }
            };
            createBalloons();

            // Grand finale after 5s
            setTimeout(() => {
                clearInterval(intervalId);
                createExplosion('40%', '40%');
                createExplosion('60%', '40%');
                createExplosion('50%', '30%');
            }, duration);
        }
    }
};

if (blowBtn && flame) {
    blowBtn.addEventListener('click', blowCandle);
}

section.classList.add("active");

function spawnConfetti() {
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement("div");
        confetti.className = "firework-particle";
        confetti.style.setProperty("--tx", `${Math.random()*300 - 150}px`);
        confetti.style.setProperty("--ty", `${Math.random()*-300}px`);
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1000);
    }
}
