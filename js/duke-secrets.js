// ===== DUKE NUKEM SEO ARSENAL - SECRETS SYSTEM =====
// Persistent sitewide secrets tracker - Like Duke 3D's hidden areas!

(function() {
    'use strict';

    // ===== THE 6 SECRETS =====
    const SECRETS = {
        shake_it_baby: {
            id: 'shake_it_baby',
            name: 'SHAKE IT BABY',
            desc: 'Click Duke\'s face in the HUD 3 times',
            icon: '💃',
            reward: '+50 SEO Points'
        },
        konami_duke: {
            id: 'konami_duke',
            name: 'KONAMI DUKE',
            desc: 'Type the secret code: DUKE',
            icon: '🎮',
            reward: 'God Mode Activated'
        },
        generous_tipper: {
            id: 'generous_tipper',
            name: 'GENEROUS TIPPER',
            desc: 'Make it rain on the 404 page (50+ bills)',
            icon: '💵',
            reward: 'Money Never Sleeps'
        },
        mass_murderer: {
            id: 'mass_murderer',
            name: 'MASS MURDERER',
            desc: 'Reach 100 total frags',
            icon: '💀',
            reward: 'Alien Genocide Medal'
        },
        weapon_master: {
            id: 'weapon_master',
            name: 'WEAPON MASTER',
            desc: 'Fire all 8 weapons at least once',
            icon: '🔫',
            reward: 'Full Arsenal Unlocked'
        },
        music_lover: {
            id: 'music_lover',
            name: 'MUSIC LOVER',
            desc: 'Listen to Grabbag theme for 60+ seconds',
            icon: '🎵',
            reward: 'Hail to the King!'
        }
    };

    // ===== SECRETS STATE =====
    const secretsState = {
        unlocked: JSON.parse(localStorage.getItem('duke_secrets_unlocked') || '[]'),
        // Progress tracking for each secret
        progress: JSON.parse(localStorage.getItem('duke_secrets_progress') || JSON.stringify({
            duke_face_clicks: 0,
            duke_code_typed: false,
            money_pile_count: parseInt(localStorage.getItem('duke_404_money_pile') || '0'),
            total_frags: parseInt(localStorage.getItem('duke_total_kills') || '0'),
            weapons_fired: JSON.parse(localStorage.getItem('duke_weapons_fired') || '[]'),
            music_time: parseInt(localStorage.getItem('duke_music_time') || '0')
        }))
    };

    // ===== SAVE PROGRESS =====
    function saveProgress() {
        localStorage.setItem('duke_secrets_unlocked', JSON.stringify(secretsState.unlocked));
        localStorage.setItem('duke_secrets_progress', JSON.stringify(secretsState.progress));
    }

    // ===== CHECK IF SECRET UNLOCKED =====
    function isSecretUnlocked(secretId) {
        return secretsState.unlocked.includes(secretId);
    }

    // ===== UNLOCK A SECRET =====
    function unlockSecret(secretId) {
        if (isSecretUnlocked(secretId)) return false;

        const secret = SECRETS[secretId];
        if (!secret) return false;

        secretsState.unlocked.push(secretId);
        saveProgress();

        // Show the secret unlock celebration!
        showSecretUnlocked(secret);

        // Play the secret found sound
        playSecretSound();

        // Update the HUD
        updateSecretsHUD();

        console.log(`[DUKE SECRETS] ${secret.name} UNLOCKED! (${secretsState.unlocked.length}/6)`);

        // Check if all secrets found
        if (secretsState.unlocked.length === 6) {
            setTimeout(() => showAllSecretsFound(), 3000);
        }

        return true;
    }

    // ===== SECRET UNLOCK CELEBRATION =====
    function showSecretUnlocked(secret) {
        const overlay = document.createElement('div');
        overlay.className = 'secret-unlock-overlay';
        overlay.innerHTML = `
            <div class="secret-unlock-content">
                <div class="secret-unlock-flash"></div>
                <div class="secret-unlock-icon">${secret.icon}</div>
                <div class="secret-unlock-title">SECRET AREA FOUND!</div>
                <div class="secret-unlock-name">${secret.name}</div>
                <div class="secret-unlock-desc">${secret.desc}</div>
                <div class="secret-unlock-reward">${secret.reward}</div>
                <div class="secret-unlock-count">${secretsState.unlocked.length}/6 SECRETS</div>
            </div>
        `;

        // Inject styles if not present
        injectSecretStyles();

        document.body.appendChild(overlay);

        // Animate in
        setTimeout(() => overlay.classList.add('active'), 50);

        // Remove after animation
        setTimeout(() => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 500);
        }, 4000);
    }

    // ===== ALL SECRETS FOUND CELEBRATION =====
    function showAllSecretsFound() {
        const overlay = document.createElement('div');
        overlay.className = 'secret-unlock-overlay all-secrets';
        overlay.innerHTML = `
            <div class="secret-unlock-content">
                <div class="secret-unlock-flash"></div>
                <div class="secret-unlock-icon">👑</div>
                <div class="secret-unlock-title">100% SECRETS!</div>
                <div class="secret-unlock-name">HAIL TO THE KING!</div>
                <div class="secret-unlock-desc">You found all 6 secrets!</div>
                <div class="secret-unlock-reward">You're the Duke of SEO!</div>
            </div>
        `;

        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('active'), 50);

        // Play special voice
        if (window.DukeGame && window.DukeGame.playVoice) {
            window.DukeGame.playVoice('hailToTheKing');
        }

        setTimeout(() => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 500);
        }, 5000);
    }

    // ===== PLAY SECRET FOUND SOUND =====
    function playSecretSound() {
        // Try to use DukeGame's voice system
        if (window.DukeGame && window.DukeGame.playVoice) {
            window.DukeGame.playVoice('groovy');
        } else {
            // Fallback: play pickup sound
            const pickup = document.getElementById('pickupSound');
            if (pickup) {
                pickup.volume = 0.6;
                pickup.currentTime = 0;
                pickup.play().catch(() => {});
            }
        }
    }

    // ===== UPDATE SECRETS HUD =====
    function updateSecretsHUD() {
        const secretsCount = document.getElementById('hudSecrets');
        const secretsTotal = document.getElementById('hudSecretsTotal');

        if (secretsCount) {
            secretsCount.textContent = secretsState.unlocked.length;
        }
        if (secretsTotal) {
            secretsTotal.textContent = '6';
        }

        // Also update any secrets display elements
        const secretsDisplay = document.querySelectorAll('.secrets-found');
        secretsDisplay.forEach(el => {
            el.textContent = secretsState.unlocked.length;
        });
    }

    // ===== INJECT SECRET STYLES =====
    function injectSecretStyles() {
        if (document.getElementById('duke-secrets-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'duke-secrets-styles';
        styles.textContent = `
            .secret-unlock-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                opacity: 0;
                transition: opacity 0.5s ease;
                pointer-events: none;
            }

            .secret-unlock-overlay.active {
                opacity: 1;
            }

            .secret-unlock-content {
                text-align: center;
                position: relative;
            }

            .secret-unlock-flash {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 400px;
                height: 400px;
                transform: translate(-50%, -50%);
                background: radial-gradient(circle, rgba(255, 204, 0, 0.4) 0%, transparent 70%);
                animation: secretFlashPulse 1s ease-out;
                pointer-events: none;
            }

            @keyframes secretFlashPulse {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            }

            .secret-unlock-icon {
                font-size: 5rem;
                margin-bottom: 1rem;
                animation: secretIconBounce 0.5s ease-out;
                filter: drop-shadow(0 0 30px currentColor);
            }

            @keyframes secretIconBounce {
                0% { transform: scale(0) rotate(-180deg); }
                50% { transform: scale(1.3) rotate(10deg); }
                100% { transform: scale(1) rotate(0deg); }
            }

            .secret-unlock-title {
                font-family: 'Press Start 2P', monospace;
                font-size: 1.5rem;
                color: #ffcc00;
                text-shadow: 0 0 20px #ffcc00, 0 0 40px #ff6600;
                margin-bottom: 0.5rem;
                animation: secretTextGlow 1s ease-in-out infinite alternate;
            }

            @keyframes secretTextGlow {
                from { text-shadow: 0 0 20px #ffcc00, 0 0 40px #ff6600; }
                to { text-shadow: 0 0 30px #ffcc00, 0 0 60px #ff6600, 0 0 80px #ff0000; }
            }

            .secret-unlock-name {
                font-family: 'Press Start 2P', monospace;
                font-size: 1rem;
                color: #ff6c2c;
                text-shadow: 0 0 15px #ff6c2c;
                margin-bottom: 1rem;
            }

            .secret-unlock-desc {
                font-family: 'Press Start 2P', monospace;
                font-size: 0.5rem;
                color: #888;
                margin-bottom: 0.5rem;
            }

            .secret-unlock-reward {
                font-family: 'Press Start 2P', monospace;
                font-size: 0.6rem;
                color: #00ff00;
                text-shadow: 0 0 10px #00ff00;
                margin-top: 1rem;
            }

            .secret-unlock-count {
                font-family: 'Press Start 2P', monospace;
                font-size: 0.6rem;
                color: #c09030;
                margin-top: 1.5rem;
            }

            .secret-unlock-overlay.all-secrets .secret-unlock-title {
                color: #ff0000;
                font-size: 2rem;
            }

            .secret-unlock-overlay.all-secrets .secret-unlock-icon {
                font-size: 8rem;
                animation: crownSpin 2s linear infinite;
            }

            @keyframes crownSpin {
                0% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.1) rotate(5deg); }
                50% { transform: scale(1) rotate(0deg); }
                75% { transform: scale(1.1) rotate(-5deg); }
                100% { transform: scale(1) rotate(0deg); }
            }

            /* Enhanced DUKE code effect */
            .duke-code-effect {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 99998;
            }

            .duke-code-letter {
                position: absolute;
                font-family: 'Press Start 2P', monospace;
                font-size: 8rem;
                color: #ff6c2c;
                text-shadow: 0 0 30px #ff6c2c, 0 0 60px #ff0000;
                animation: dukeLetter 1s ease-out forwards;
            }

            @keyframes dukeLetter {
                0% { transform: scale(0) rotate(-360deg); opacity: 0; }
                50% { transform: scale(1.5) rotate(0deg); opacity: 1; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }

            /* Secrets HUD display style */
            .hud-secrets {
                color: #ffcc00 !important;
            }
        `;
        document.head.appendChild(styles);
    }

    // ===== SECRET TRACKERS =====

    // Secret 1: Shake It Baby - Duke face clicks
    let dukeFaceClickCount = 0;
    let lastDukeFaceClick = 0;

    function trackDukeFaceClick() {
        if (isSecretUnlocked('shake_it_baby')) return;

        const now = Date.now();
        // Reset if more than 2 seconds between clicks
        if (now - lastDukeFaceClick > 2000) {
            dukeFaceClickCount = 0;
        }
        lastDukeFaceClick = now;
        dukeFaceClickCount++;

        secretsState.progress.duke_face_clicks = dukeFaceClickCount;
        saveProgress();

        if (dukeFaceClickCount >= 3) {
            unlockSecret('shake_it_baby');
            // Trigger the babes easter egg if DukeGame is available
            if (window.DukeGame && typeof window.triggerBabesEasterEgg === 'function') {
                window.triggerBabesEasterEgg();
            }
        }
    }

    // Secret 2: Enhanced DUKE code
    let dukeCodeBuffer = '';

    function trackKeyPress(key) {
        if (isSecretUnlocked('konami_duke')) return;

        dukeCodeBuffer += key.toUpperCase();
        if (dukeCodeBuffer.length > 10) {
            dukeCodeBuffer = dukeCodeBuffer.slice(-10);
        }

        if (dukeCodeBuffer.includes('DUKE')) {
            unlockSecret('konami_duke');
            showEnhancedDukeEffect();
            dukeCodeBuffer = '';
        }
    }

    function showEnhancedDukeEffect() {
        const container = document.createElement('div');
        container.className = 'duke-code-effect';

        const letters = ['D', 'U', 'K', 'E'];
        const positions = [
            { top: '30%', left: '20%' },
            { top: '20%', left: '40%' },
            { top: '30%', left: '60%' },
            { top: '20%', left: '80%' }
        ];

        letters.forEach((letter, i) => {
            setTimeout(() => {
                const el = document.createElement('div');
                el.className = 'duke-code-letter';
                el.textContent = letter;
                el.style.top = positions[i].top;
                el.style.left = positions[i].left;
                container.appendChild(el);

                // Play stomp sound for each letter
                const stomp = document.getElementById('bootsSound');
                if (stomp) {
                    stomp.volume = 0.5;
                    stomp.currentTime = 0;
                    stomp.play().catch(() => {});
                }
            }, i * 200);
        });

        document.body.appendChild(container);

        // Final effect - flash and voice
        setTimeout(() => {
            if (window.DukeGame && window.DukeGame.playVoice) {
                window.DukeGame.playVoice('bubblegum');
            }
            // Screen flash
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #ff6c2c;
                pointer-events: none;
                z-index: 999999;
                animation: flashFade 0.5s ease-out forwards;
            `;
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 500);
        }, 1000);

        // Remove letters
        setTimeout(() => container.remove(), 3000);
    }

    // Secret 3: Generous Tipper (404 money pile)
    function trackMoneyPile(count) {
        if (isSecretUnlocked('generous_tipper')) return;

        secretsState.progress.money_pile_count = count;
        localStorage.setItem('duke_404_money_pile', count.toString());
        saveProgress();

        if (count >= 50) {
            unlockSecret('generous_tipper');
        }
    }

    // Secret 4: Mass Murderer (100 frags)
    function trackFrags(totalFrags) {
        if (isSecretUnlocked('mass_murderer')) return;

        secretsState.progress.total_frags = totalFrags;
        saveProgress();

        if (totalFrags >= 100) {
            unlockSecret('mass_murderer');
        }
    }

    // Secret 5: Weapon Master (fire all 8 weapons)
    const ALL_WEAPONS = ['boot', 'pistol', 'shotgun', 'chaingun', 'rpg', 'pipebomb', 'devastator', 'freezer'];

    function trackWeaponFired(weaponKey) {
        if (isSecretUnlocked('weapon_master')) return;

        if (!secretsState.progress.weapons_fired.includes(weaponKey)) {
            secretsState.progress.weapons_fired.push(weaponKey);
            localStorage.setItem('duke_weapons_fired', JSON.stringify(secretsState.progress.weapons_fired));
            saveProgress();
        }

        // Check if all weapons fired
        const allFired = ALL_WEAPONS.every(w => secretsState.progress.weapons_fired.includes(w));
        if (allFired) {
            unlockSecret('weapon_master');
        }
    }

    // Secret 6: Music Lover (60+ seconds of theme)
    let musicStartTime = 0;
    let musicAccumulatedTime = parseInt(localStorage.getItem('duke_music_time') || '0');
    let musicCheckInterval = null;

    function trackMusicStart() {
        if (isSecretUnlocked('music_lover')) return;

        musicStartTime = Date.now();

        // Check periodically
        if (musicCheckInterval) clearInterval(musicCheckInterval);
        musicCheckInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - musicStartTime) / 1000);
            const total = musicAccumulatedTime + elapsed;
            secretsState.progress.music_time = total;

            if (total >= 60) {
                unlockSecret('music_lover');
                clearInterval(musicCheckInterval);
            }
        }, 1000);
    }

    function trackMusicStop() {
        if (musicStartTime > 0) {
            const elapsed = Math.floor((Date.now() - musicStartTime) / 1000);
            musicAccumulatedTime += elapsed;
            localStorage.setItem('duke_music_time', musicAccumulatedTime.toString());
            secretsState.progress.music_time = musicAccumulatedTime;
            saveProgress();
        }
        musicStartTime = 0;
        if (musicCheckInterval) {
            clearInterval(musicCheckInterval);
            musicCheckInterval = null;
        }
    }

    // ===== SETUP TRACKERS =====
    function setupTrackers() {
        // Duke face clicks
        document.addEventListener('click', (e) => {
            const dukeFace = e.target.closest('.hud-face, #dukeFace, .duke-face-container img');
            if (dukeFace) {
                trackDukeFaceClick();
            }
        });

        // Key presses for DUKE code
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            trackKeyPress(e.key);
        });

        // Check initial frag count
        const savedKills = parseInt(localStorage.getItem('duke_total_kills') || '0');
        if (savedKills >= 100 && !isSecretUnlocked('mass_murderer')) {
            unlockSecret('mass_murderer');
        }

        // Check initial money pile (for 404 page)
        const savedMoney = parseInt(localStorage.getItem('duke_404_money_pile') || '0');
        if (savedMoney >= 50 && !isSecretUnlocked('generous_tipper')) {
            unlockSecret('generous_tipper');
        }

        // Music tracking
        const bgMusic = document.getElementById('bgMusic') || document.querySelector('audio[src*="grabbag"]');
        if (bgMusic) {
            bgMusic.addEventListener('play', trackMusicStart);
            bgMusic.addEventListener('pause', trackMusicStop);
            bgMusic.addEventListener('ended', trackMusicStop);

            // If already playing
            if (!bgMusic.paused) {
                trackMusicStart();
            }
        }
    }

    // ===== GET SECRETS STATUS =====
    function getSecretsStatus() {
        return {
            total: 6,
            found: secretsState.unlocked.length,
            unlocked: secretsState.unlocked,
            secrets: SECRETS,
            progress: secretsState.progress
        };
    }

    // ===== EXPOSE GLOBAL API =====
    window.DukeSecrets = {
        unlockSecret,
        isSecretUnlocked,
        getSecretsStatus,
        trackMoneyPile,
        trackFrags,
        trackWeaponFired,
        updateSecretsHUD,
        SECRETS
    };

    // ===== INITIALIZE =====
    function init() {
        injectSecretStyles();
        setupTrackers();
        updateSecretsHUD();

        console.log(`[DUKE SECRETS] Initialized. ${secretsState.unlocked.length}/6 secrets found.`);
        console.log('[DUKE SECRETS] Secrets:', Object.keys(SECRETS).map(k =>
            (isSecretUnlocked(k) ? '✓ ' : '○ ') + SECRETS[k].name
        ).join(', '));
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
