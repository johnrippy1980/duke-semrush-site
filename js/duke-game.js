// ===== DUKE NUKEM SEO ARSENAL - GAME ENGINE =====
// All the interactive gameplay features

(function() {
    'use strict';

    // ===== GAME STATE =====
    const gameState = {
        killCount: parseInt(localStorage.getItem('duke_kills') || '0'),
        totalKills: parseInt(localStorage.getItem('duke_total_kills') || '0'),
        achievements: JSON.parse(localStorage.getItem('duke_achievements') || '[]'),
        currentWeapon: localStorage.getItem('duke_weapon') || 'shotgun',
        godMode: false,
        noclip: false,
        secretsFound: JSON.parse(localStorage.getItem('duke_secrets') || '[]'),
        bossDefeated: localStorage.getItem('duke_boss_defeated') === 'true',
        cheatBuffer: '',
        lastVoicePlayed: 0,
        voiceCooldown: 2000
    };

    // ===== VOICE CLIPS =====
    const dukeVoiceClips = {
        hailToTheKing: { id: 'voiceHailToTheKing', text: "Hail to the king, baby!" },
        comeGetSome: { id: 'voiceComeGetSome', text: "Come get some!" },
        damnImGood: { id: 'voiceDamnImGood', text: "Damn, I'm good!" },
        letsRock: { id: 'voiceLetsRock', text: "Let's rock!" },
        blowItOut: { id: 'voiceBlowItOut', text: "Blow it out your ass!" },
        pieceOfCake: { id: 'voicePieceOfCake', text: "Piece of cake!" },
        shakeItBaby: { id: 'voiceShakeItBaby', text: "Shake it, baby!" },
        cool: { id: 'voiceCool', text: "Cool!" },
        groovy: { id: 'voiceGroovy', text: "Groovy!" },
        bubblegum: { id: 'voiceBubblegum', text: "It's time to kick ass and chew bubblegum... and I'm all out of gum." },
        yourFace: { id: 'voiceYourFace', text: "Your face, your ass - what's the difference?" },
        ballsOfSteel: { id: 'voiceBallsOfSteel', text: "I've got balls of steel!" }
    };

    // ===== CHEAT CODES =====
    const cheatCodes = {
        'dnkroz': { name: 'God Mode', action: () => toggleGodMode() },
        'dngod': { name: 'God Mode', action: () => toggleGodMode() },
        'dnclip': { name: 'No Clip', action: () => toggleNoclip() },
        'dnstuff': { name: 'All Weapons', action: () => giveAllWeapons() },
        'dnkeys': { name: 'All Keys', action: () => unlockAllSecrets() },
        'dnitems': { name: 'Full Inventory', action: () => maxStats() },
        'dnweapons': { name: 'All Weapons', action: () => giveAllWeapons() },
        'dnhyper': { name: 'Steroids Mode', action: () => activateSteroids() },
        'dnview': { name: 'Secret View', action: () => revealSecrets() },
        'dnrate': { name: 'Show FPS', action: () => toggleFPS() },
        'dnbeta': { name: 'Beta Message', action: () => showBetaMessage() },
        'dnallen': { name: 'Spawn Alien', action: () => spawnBossAlien() }
    };

    // ===== ACHIEVEMENTS =====
    const achievementsList = {
        first_blood: { name: 'First Blood', desc: 'Kill your first alien', icon: '🩸' },
        alien_slayer: { name: 'Alien Slayer', desc: 'Kill 10 aliens', icon: '👽' },
        terminator: { name: 'Terminator', desc: 'Kill 50 aliens', icon: '🤖' },
        genocide: { name: 'Genocide', desc: 'Kill 100 aliens', icon: '💀' },
        secret_finder: { name: 'Secret Finder', desc: 'Find your first secret', icon: '🔍' },
        explorer: { name: 'Explorer', desc: 'Find all secrets', icon: '🗺️' },
        boss_killer: { name: 'Boss Killer', desc: 'Defeat the Battlelord', icon: '👑' },
        cheater: { name: 'Cheater', desc: 'Use a cheat code', icon: '🎮' },
        music_lover: { name: 'Music Lover', desc: 'Listen to Grabbag', icon: '🎵' },
        seo_master: { name: 'SEO Master', desc: 'Click all SEMrush links', icon: '🎯' }
    };

    // ===== ENEMIES =====
    const enemyTypes = [
        { name: 'pig-cop', hp: 30, points: 100, image: 'images/pig-cop.png', deathSound: 'death1' },
        { name: 'assault-trooper', hp: 20, points: 75, image: 'images/assault-trooper.png', deathSound: 'death1' },
        { name: 'octabrain', hp: 40, points: 150, image: 'images/octabrain.png', deathSound: 'death1' },
        { name: 'enforcer', hp: 50, points: 200, image: 'images/enforcer.png', deathSound: 'death1' }
    ];

    // ===== WEAPONS =====
    const weapons = {
        boot: { name: 'Mighty Boot', damage: 10, sound: 'stomp', icon: '<img src="images/boot-sprite.png" alt="Boot" style="height:24px;image-rendering:pixelated;">' },
        pistol: { name: 'Pistol', damage: 15, sound: 'shotgun', icon: '<img src="images/pistol-sprite.png" alt="Pistol" style="height:24px;image-rendering:pixelated;">' },
        shotgun: { name: 'Shotgun', damage: 40, sound: 'shotgun', icon: '<img src="images/shotgun-sprite.png" alt="Shotgun" style="height:24px;image-rendering:pixelated;">' },
        chaingun: { name: 'Chaingun Cannon', damage: 25, sound: 'shotgun', icon: '<img src="images/ripper-sprite.png" alt="Chaingun" style="height:24px;image-rendering:pixelated;">' },
        rpg: { name: 'RPG', damage: 100, sound: 'explosion', icon: '<img src="images/rpg-sprite.png" alt="RPG" style="height:24px;image-rendering:pixelated;">' },
        pipebomb: { name: 'Pipe Bomb', damage: 80, sound: 'explosion', icon: '<img src="images/pipebomb-sprite.png" alt="Pipebomb" style="height:24px;image-rendering:pixelated;">' },
        devastator: { name: 'Devastator', damage: 150, sound: 'explosion', icon: '<img src="images/devastator-sprite.png" alt="Devastator" style="height:24px;image-rendering:pixelated;">' },
        freezer: { name: 'Freezethrower', damage: 30, sound: 'shotgun', icon: '<img src="images/freezer-sprite.png" alt="Freezer" style="height:24px;image-rendering:pixelated;">' }
    };

    // ===== INITIALIZATION =====
    function init() {
        setupVoiceClips();
        setupCheatListener();
        setupEnemySpawner();
        setupSecretAreas();
        setupWeaponSelector();
        setupAchievements();
        setupExplosions();
        setupParallax();
        updateHUD();
        console.log('[Duke Game Engine] Initialized. Type cheat codes to activate!');
    }

    // ===== VOICE SYSTEM =====
    // Track currently playing audio for navigation delay
    let currentlyPlayingAudio = null;
    let pendingNavigation = null;

    function playVoice(clipKey) {
        const now = Date.now();
        if (now - gameState.lastVoicePlayed < gameState.voiceCooldown) return false;

        const clip = dukeVoiceClips[clipKey];
        if (!clip) return false;

        const audio = document.getElementById(clip.id);
        if (audio) {
            audio.volume = 0.7;
            audio.currentTime = 0;
            audio.play().catch(() => {});
            currentlyPlayingAudio = audio;
            gameState.lastVoicePlayed = now;
            showQuote(clip.text);

            // Clear reference when audio ends
            audio.onended = () => {
                if (currentlyPlayingAudio === audio) {
                    currentlyPlayingAudio = null;
                }
                // If there's a pending navigation, execute it
                if (pendingNavigation) {
                    const url = pendingNavigation;
                    pendingNavigation = null;
                    window.location.href = url;
                }
            };
            return true;
        }
        return false;
    }

    // Play voice and return a promise that resolves when done
    function playVoiceAsync(clipKey) {
        return new Promise((resolve) => {
            const clip = dukeVoiceClips[clipKey];
            if (!clip) {
                resolve();
                return;
            }

            const audio = document.getElementById(clip.id);
            if (audio) {
                audio.volume = 0.7;
                audio.currentTime = 0;

                const onEnded = () => {
                    audio.removeEventListener('ended', onEnded);
                    resolve();
                };
                audio.addEventListener('ended', onEnded);

                audio.play().catch(() => resolve());
                showQuote(clip.text);
            } else {
                resolve();
            }
        });
    }

    function playRandomVoice() {
        const keys = Object.keys(dukeVoiceClips);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return playVoice(randomKey);
    }

    function showQuote(text) {
        const quoteEl = document.getElementById('dukeQuote');
        if (quoteEl) {
            quoteEl.textContent = '"' + text + '"';
            quoteEl.classList.add('show');
            setTimeout(() => quoteEl.classList.remove('show'), 3000);
        }
    }

    function setupVoiceClips() {
        // Voice clips are already in HTML
    }

    // ===== CHEAT CODE SYSTEM =====
    function setupCheatListener() {
        document.addEventListener('keydown', (e) => {
            // Don't capture if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            gameState.cheatBuffer += e.key.toLowerCase();
            if (gameState.cheatBuffer.length > 10) {
                gameState.cheatBuffer = gameState.cheatBuffer.slice(-10);
            }

            // Check for cheat codes
            for (const [code, cheat] of Object.entries(cheatCodes)) {
                if (gameState.cheatBuffer.endsWith(code)) {
                    activateCheat(code, cheat);
                    gameState.cheatBuffer = '';
                    break;
                }
            }
        });
    }

    function activateCheat(code, cheat) {
        console.log(`[CHEAT] ${cheat.name} activated!`);
        showCheatMessage(cheat.name);
        cheat.action();
        unlockAchievement('cheater');

        // Play voice
        playVoice('damnImGood');

        // Visual effect
        flashScreen('#00ff00', 300);
    }

    function showCheatMessage(message) {
        const cheatDiv = document.createElement('div');
        cheatDiv.className = 'cheat-message';
        cheatDiv.innerHTML = `<span class="cheat-icon">🎮</span> ${message} ACTIVATED`;
        document.body.appendChild(cheatDiv);

        setTimeout(() => {
            cheatDiv.classList.add('fade-out');
            setTimeout(() => cheatDiv.remove(), 500);
        }, 2000);
    }

    function toggleGodMode() {
        gameState.godMode = !gameState.godMode;
        const hudHealth = document.getElementById('hudHealth');
        const hudArmor = document.getElementById('hudArmor');

        if (gameState.godMode) {
            if (hudHealth) hudHealth.textContent = '∞';
            if (hudArmor) hudArmor.textContent = '∞';
            document.body.classList.add('god-mode');
        } else {
            if (hudHealth) hudHealth.textContent = '100';
            if (hudArmor) hudArmor.textContent = '100';
            document.body.classList.remove('god-mode');
        }
    }

    function toggleNoclip() {
        gameState.noclip = !gameState.noclip;
        document.body.classList.toggle('noclip-mode', gameState.noclip);
    }

    function giveAllWeapons() {
        const weaponSelector = document.querySelector('.weapon-selector');
        if (weaponSelector) {
            weaponSelector.querySelectorAll('.weapon-slot').forEach(slot => {
                slot.classList.add('unlocked');
            });
        }
        const hudAmmo = document.getElementById('hudAmmo');
        if (hudAmmo) hudAmmo.textContent = '999';
    }

    function unlockAllSecrets() {
        gameState.secretsFound = ['secret1', 'secret2', 'secret3', 'secret4', 'secret5'];
        localStorage.setItem('duke_secrets', JSON.stringify(gameState.secretsFound));
        unlockAchievement('explorer');

        document.querySelectorAll('.secret-area').forEach(secret => {
            secret.classList.add('revealed');
        });
    }

    function maxStats() {
        const hudHealth = document.getElementById('hudHealth');
        const hudArmor = document.getElementById('hudArmor');
        const hudAmmo = document.getElementById('hudAmmo');

        if (hudHealth) hudHealth.textContent = '200';
        if (hudArmor) hudArmor.textContent = '200';
        if (hudAmmo) hudAmmo.textContent = '999';
    }

    function activateSteroids() {
        document.body.classList.add('steroids-mode');
        showQuote("I'm gonna rip off your head and shit down your neck!");

        setTimeout(() => {
            document.body.classList.remove('steroids-mode');
        }, 10000);
    }

    function revealSecrets() {
        document.querySelectorAll('.secret-area').forEach(secret => {
            secret.classList.add('hint-visible');
        });
    }

    function toggleFPS() {
        let fps = document.getElementById('fpsCounter');
        if (!fps) {
            fps = document.createElement('div');
            fps.id = 'fpsCounter';
            fps.className = 'fps-counter';
            document.body.appendChild(fps);

            let lastTime = performance.now();
            let frames = 0;

            function updateFPS() {
                frames++;
                const now = performance.now();
                if (now - lastTime >= 1000) {
                    fps.textContent = `FPS: ${frames}`;
                    frames = 0;
                    lastTime = now;
                }
                requestAnimationFrame(updateFPS);
            }
            updateFPS();
        } else {
            fps.remove();
        }
    }

    function showBetaMessage() {
        alert('Duke Nukem 3D v1.3D\n\nProgramming: Todd Replogle\nDesign: Allen H. Blum III\n\n"It\'s time to kick ass and chew bubblegum..."');
    }

    function spawnBossAlien() {
        spawnBoss();
    }

    // ===== ENEMY SYSTEM =====
    let enemySpawnInterval;
    let activeEnemies = [];

    function setupEnemySpawner() {
        // Spawn initial enemies
        for (let i = 0; i < 3; i++) {
            setTimeout(() => spawnEnemy(), i * 1000);
        }

        // Continuous spawning
        enemySpawnInterval = setInterval(() => {
            if (activeEnemies.length < 5 && Math.random() > 0.6) {
                spawnEnemy();
            }
        }, 3000);
    }

    function spawnEnemy() {
        const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const enemy = document.createElement('div');
        enemy.className = 'enemy-sprite';
        enemy.dataset.type = type.name;
        enemy.dataset.hp = type.hp;
        enemy.dataset.points = type.points;

        // Random position
        const x = 10 + Math.random() * 80;
        const y = 20 + Math.random() * 50;

        enemy.style.cssText = `
            position: fixed;
            left: ${x}%;
            top: ${y}%;
            width: 80px;
            height: 80px;
            background-image: url('${type.image}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            image-rendering: pixelated;
            cursor: crosshair;
            z-index: 100;
            transition: transform 0.1s;
            animation: enemyFloat 2s ease-in-out infinite;
            filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.5));
        `;

        enemy.addEventListener('click', (e) => killEnemy(e, enemy));

        document.body.appendChild(enemy);
        activeEnemies.push(enemy);

        // Move enemy randomly
        moveEnemy(enemy);
    }

    function moveEnemy(enemy) {
        if (!enemy.parentNode) return;

        const newX = 10 + Math.random() * 80;
        const newY = 20 + Math.random() * 50;

        enemy.style.transition = 'left 3s ease-in-out, top 3s ease-in-out';
        enemy.style.left = newX + '%';
        enemy.style.top = newY + '%';

        setTimeout(() => moveEnemy(enemy), 3000 + Math.random() * 2000);
    }

    function killEnemy(e, enemy) {
        e.stopPropagation();

        const weapon = weapons[gameState.currentWeapon];
        const hp = parseInt(enemy.dataset.hp);
        const damage = weapon.damage;
        const newHp = hp - damage;

        // Play weapon sound
        playSound(weapon.sound);

        // Screen shake
        shakeScreen();

        if (newHp <= 0) {
            // Enemy killed
            const points = parseInt(enemy.dataset.points);

            // Create explosion
            createExplosion(e.clientX, e.clientY);

            // Play death sound
            playSound('death1');

            // Update kills
            gameState.killCount++;
            gameState.totalKills++;
            localStorage.setItem('duke_kills', gameState.killCount);
            localStorage.setItem('duke_total_kills', gameState.totalKills);

            // Update HUD
            updateHUD();

            // Check achievements
            checkKillAchievements();

            // Random voice on kill
            if (Math.random() > 0.5) {
                const killVoices = ['comeGetSome', 'damnImGood', 'pieceOfCake', 'cool', 'groovy'];
                playVoice(killVoices[Math.floor(Math.random() * killVoices.length)]);
            }

            // Remove enemy
            enemy.classList.add('enemy-death');
            setTimeout(() => {
                enemy.remove();
                activeEnemies = activeEnemies.filter(e => e !== enemy);
            }, 300);
        } else {
            enemy.dataset.hp = newHp;
            enemy.classList.add('enemy-hit');
            setTimeout(() => enemy.classList.remove('enemy-hit'), 100);
        }
    }

    function checkKillAchievements() {
        if (gameState.totalKills >= 1) unlockAchievement('first_blood');
        if (gameState.totalKills >= 10) unlockAchievement('alien_slayer');
        if (gameState.totalKills >= 50) unlockAchievement('terminator');
        if (gameState.totalKills >= 100) unlockAchievement('genocide');
    }

    // ===== BOSS SYSTEM =====
    function spawnBoss() {
        if (document.querySelector('.boss-enemy')) return;

        const boss = document.createElement('div');
        boss.className = 'boss-enemy';
        boss.dataset.hp = 500;
        boss.dataset.maxHp = 500;
        boss.innerHTML = `
            <div class="boss-health-bar">
                <div class="boss-health-fill"></div>
            </div>
            <div class="boss-name">BATTLELORD</div>
        `;

        boss.style.cssText = `
            position: fixed;
            left: 50%;
            top: 30%;
            transform: translateX(-50%);
            width: 200px;
            height: 200px;
            background-image: url('images/battlelord.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            image-rendering: pixelated;
            cursor: crosshair;
            z-index: 150;
            filter: drop-shadow(0 0 30px rgba(255, 0, 0, 0.8));
            animation: bossPulse 1s ease-in-out infinite;
        `;

        boss.addEventListener('click', (e) => damageBoss(e, boss));

        document.body.appendChild(boss);

        // Boss entrance
        playVoice('letsRock');
        flashScreen('#ff0000', 500);
        showQuote("BATTLELORD: You will die, human!");
    }

    function damageBoss(e, boss) {
        e.stopPropagation();

        const weapon = weapons[gameState.currentWeapon];
        const hp = parseInt(boss.dataset.hp);
        const maxHp = parseInt(boss.dataset.maxHp);
        const newHp = hp - weapon.damage;

        playSound(weapon.sound);
        shakeScreen();
        createExplosion(e.clientX, e.clientY);

        if (newHp <= 0) {
            // Boss killed!
            gameState.bossDefeated = true;
            localStorage.setItem('duke_boss_defeated', 'true');
            unlockAchievement('boss_killer');

            // Big explosion
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    createExplosion(
                        e.clientX + (Math.random() - 0.5) * 200,
                        e.clientY + (Math.random() - 0.5) * 200
                    );
                }, i * 100);
            }

            playVoice('hailToTheKing');

            gameState.killCount += 10;
            gameState.totalKills += 10;
            updateHUD();

            boss.remove();
        } else {
            boss.dataset.hp = newHp;
            const healthPercent = (newHp / maxHp) * 100;
            const healthFill = boss.querySelector('.boss-health-fill');
            if (healthFill) healthFill.style.width = healthPercent + '%';

            boss.classList.add('boss-hit');
            setTimeout(() => boss.classList.remove('boss-hit'), 100);
        }
    }

    // ===== SECRET AREAS =====
    function setupSecretAreas() {
        // Add secret areas to the page
        const secretLocations = [
            { x: '5%', y: '60%', id: 'secret1', reward: 'atomic-health' },
            { x: '90%', y: '40%', id: 'secret2', reward: 'jetpack' },
            { x: '50%', y: '85%', id: 'secret3', reward: 'devastator' },
            { x: '15%', y: '25%', id: 'secret4', reward: 'steroids' },
            { x: '85%', y: '75%', id: 'secret5', reward: 'holoduke' }
        ];

        secretLocations.forEach(loc => {
            if (gameState.secretsFound.includes(loc.id)) return;

            const secret = document.createElement('div');
            secret.className = 'secret-area';
            secret.dataset.id = loc.id;
            secret.dataset.reward = loc.reward;
            secret.style.cssText = `
                position: fixed;
                left: ${loc.x};
                top: ${loc.y};
                width: 30px;
                height: 30px;
                cursor: pointer;
                z-index: 50;
                opacity: 0;
                transition: opacity 0.3s;
            `;

            secret.addEventListener('click', () => findSecret(secret, loc));

            // Subtle hint on hover near it
            secret.addEventListener('mouseenter', () => {
                secret.style.opacity = '0.3';
                secret.style.boxShadow = '0 0 20px #ffcc00';
            });
            secret.addEventListener('mouseleave', () => {
                secret.style.opacity = '0';
                secret.style.boxShadow = 'none';
            });

            document.body.appendChild(secret);
        });
    }

    function findSecret(element, location) {
        if (gameState.secretsFound.includes(location.id)) return;

        gameState.secretsFound.push(location.id);
        localStorage.setItem('duke_secrets', JSON.stringify(gameState.secretsFound));

        // Visual feedback
        createPickupEffect(element);
        playSound('pickup');
        playVoice('groovy');

        // Show secret found message
        showSecretMessage(location.reward);

        // Achievements
        if (gameState.secretsFound.length === 1) unlockAchievement('secret_finder');
        if (gameState.secretsFound.length >= 5) unlockAchievement('explorer');

        element.remove();
    }

    function showSecretMessage(reward) {
        const msg = document.createElement('div');
        msg.className = 'secret-message';
        msg.innerHTML = `<span class="secret-icon">🔍</span> SECRET AREA FOUND! <span class="secret-reward">${reward.toUpperCase()}</span>`;
        document.body.appendChild(msg);

        setTimeout(() => {
            msg.classList.add('fade-out');
            setTimeout(() => msg.remove(), 500);
        }, 3000);
    }

    // ===== WEAPON SELECTOR =====
    function setupWeaponSelector() {
        const selector = document.createElement('div');
        selector.className = 'weapon-selector';
        selector.innerHTML = `
            <div class="weapon-label">WEAPON:</div>
            ${Object.entries(weapons).map(([key, w]) => `
                <div class="weapon-slot ${key === gameState.currentWeapon ? 'active' : ''}" data-weapon="${key}" title="${w.name}">
                    ${w.icon}
                </div>
            `).join('')}
        `;

        selector.querySelectorAll('.weapon-slot').forEach(slot => {
            slot.addEventListener('click', () => selectWeapon(slot.dataset.weapon));
        });

        // Number keys for weapon selection
        document.addEventListener('keydown', (e) => {
            const num = parseInt(e.key);
            if (num >= 1 && num <= 8) {
                const weaponKeys = Object.keys(weapons);
                if (weaponKeys[num - 1]) {
                    selectWeapon(weaponKeys[num - 1]);
                }
            }
        });

        document.body.appendChild(selector);
    }

    function selectWeapon(weaponKey) {
        if (!weapons[weaponKey]) return;

        gameState.currentWeapon = weaponKey;
        localStorage.setItem('duke_weapon', weaponKey);

        document.querySelectorAll('.weapon-slot').forEach(slot => {
            slot.classList.toggle('active', slot.dataset.weapon === weaponKey);
        });

        playSound('pickup');
        showQuote(weapons[weaponKey].name + ' selected!');
    }

    // ===== ACHIEVEMENT SYSTEM =====
    function setupAchievements() {
        // Create achievement display container
        const container = document.createElement('div');
        container.id = 'achievementContainer';
        container.className = 'achievement-container';
        document.body.appendChild(container);
    }

    function unlockAchievement(id) {
        if (gameState.achievements.includes(id)) return;

        const achievement = achievementsList[id];
        if (!achievement) return;

        gameState.achievements.push(id);
        localStorage.setItem('duke_achievements', JSON.stringify(gameState.achievements));

        // Show achievement popup
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">ACHIEVEMENT UNLOCKED</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
        `;

        document.getElementById('achievementContainer').appendChild(popup);

        playSound('pickup');

        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 500);
        }, 4000);
    }

    // ===== EXPLOSION EFFECTS =====
    function setupExplosions() {
        // Preload explosion images/sounds
    }

    function createExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.className = 'explosion-effect';
        explosion.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 100px;
            pointer-events: none;
            z-index: 1000;
        `;

        // Create explosion particles
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 30;
            particle.style.cssText = `
                position: absolute;
                left: 50%;
                top: 50%;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, #ff6600, #ff0000, transparent);
                border-radius: 50%;
                animation: explodeParticle 0.5s ease-out forwards;
                --angle: ${angle}rad;
                --distance: ${distance}px;
            `;
            explosion.appendChild(particle);
        }

        document.body.appendChild(explosion);
        setTimeout(() => explosion.remove(), 500);
    }

    function createPickupEffect(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const effect = document.createElement('div');
        effect.className = 'pickup-effect';
        effect.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            color: #ffcc00;
            text-shadow: 0 0 20px #ffcc00;
            pointer-events: none;
            z-index: 1000;
            animation: pickupFloat 1s ease-out forwards;
        `;
        effect.textContent = '+1';

        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }

    // ===== PARALLAX SCROLLING =====
    function setupParallax() {
        const layers = [
            { class: 'parallax-stars', speed: 0.1 },
            { class: 'parallax-buildings-far', speed: 0.3 },
            { class: 'parallax-buildings-near', speed: 0.5 }
        ];

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            layers.forEach(layer => {
                const el = document.querySelector('.' + layer.class);
                if (el) {
                    el.style.transform = `translateY(${scrollY * layer.speed}px)`;
                }
            });
        });
    }

    // ===== UTILITY FUNCTIONS =====
    function playSound(soundId) {
        const audio = document.getElementById(soundId + 'Sound') || document.getElementById(soundId);
        if (audio) {
            audio.volume = 0.5;
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    }

    function shakeScreen() {
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 300);
    }

    function flashScreen(color, duration) {
        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            pointer-events: none;
            z-index: 10000;
            animation: flashFade ${duration}ms ease-out forwards;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), duration);
    }

    function updateHUD() {
        const killsEl = document.getElementById('hudKills');
        if (killsEl) killsEl.textContent = gameState.killCount;
        localStorage.setItem('dukeKillCount', gameState.killCount);
    }

    // ===== DELAYED NAVIGATION FOR AUDIO =====
    // Intercept internal link clicks to let audio finish playing
    function setupDelayedNavigation() {
        document.addEventListener('click', (e) => {
            // Find closest anchor tag
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // Only intercept internal links (not external, not hash-only)
            const isExternal = link.target === '_blank' || href.startsWith('http');
            const isHashOnly = href.startsWith('#');

            if (isExternal || isHashOnly) return;

            // Check if audio is currently playing
            if (currentlyPlayingAudio && !currentlyPlayingAudio.paused) {
                e.preventDefault();

                // Store the destination and navigate when audio ends
                pendingNavigation = href;

                // Also set a maximum wait time (2 seconds) in case audio is long
                setTimeout(() => {
                    if (pendingNavigation === href) {
                        pendingNavigation = null;
                        window.location.href = href;
                    }
                }, 2000);
            }
        });
    }

    // ===== EXPOSE GLOBAL API =====
    window.DukeGame = {
        playVoice,
        playVoiceAsync,
        playRandomVoice,
        spawnEnemy,
        spawnBoss,
        unlockAchievement,
        selectWeapon,
        gameState,
        // Allow checking if audio is playing
        isAudioPlaying: () => currentlyPlayingAudio && !currentlyPlayingAudio.paused
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setupDelayedNavigation();
        });
    } else {
        init();
        setupDelayedNavigation();
    }
})();
