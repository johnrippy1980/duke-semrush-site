// ===== DUKE NUKEM SEO ARSENAL - GAME ENGINE =====
// All the interactive gameplay features

(function() {
    'use strict';

    // ===== BASE PATH (for subpages in /weapons/) =====
    const basePath = window.location.pathname.includes('/weapons/') ? '../' : '';

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
        voiceCooldown: 2000,
        // Kill combo system
        killCombo: 0,
        lastKillTime: 0,
        comboTimeout: 3000, // 3 seconds to chain kills
        // Mature content warning shown
        matureWarningShown: localStorage.getItem('duke_mature_warning') === 'true'
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
        ballsOfSteel: { id: 'voiceBallsOfSteel', text: "I've got balls of steel!" },
        // New one-liners from soundboard
        yippieKaiAy: { id: 'voiceYippieKaiAy', text: "Yippie kai-ay, motherf***er!" },
        whoWantsSome: { id: 'voiceWhoWantsSome', text: "Who wants some?" },
        damn: { id: 'voiceDamn', text: "Damn!" },
        whatAreYouWaiting: { id: 'voiceWhatAreYouWaiting', text: "What are you waiting for?" },
        getCrapOuttaHere: { id: 'voiceGetCrapOuttaHere', text: "Get that crap outta here!" },
        nobodySteals: { id: 'voiceNobodySteals', text: "Nobody steals our chicks and lives!" }
    };

    // ===== DYNAMIC VOICE CLIPS (loaded from files) =====
    const dynamicVoiceClips = [
        // Classic Duke 3D lines
        { file: 'duke-lines/yippie-kai-ay.mp3', text: "Yippie kai-ay!" },
        { file: 'duke-lines/come-get-some.mp3', text: "Come get some!" },
        { file: 'duke-lines/damn-im-good.mp3', text: "Damn, I'm good!" },
        { file: 'duke-lines/groovy.mp3', text: "Groovy!" },
        { file: 'duke-lines/hail-to-the-king.mp3', text: "Hail to the king, baby!" },
        { file: 'duke-lines/its-time-to-kick-ass.mp3', text: "It's time to kick ass!" },
        { file: 'duke-lines/lets-rock.mp3', text: "Let's rock!" },
        { file: 'duke-lines/shake-it-baby.mp3', text: "Shake it, baby!" },
        { file: 'duke-lines/what-are-you-waiting-for.mp3', text: "What are you waiting for?" },
        { file: 'duke-lines/your-face-your-ass.mp3', text: "Your face, your ass - what's the difference?" },
        { file: 'duke-lines/get-that-crap-outta-here.mp3', text: "Get that crap outta here!" },
        { file: 'duke-lines/nobody-steals-our-chicks.mp3', text: "Nobody steals our chicks!" },
        { file: 'duke-lines/who-wants-some.mp3', text: "Who wants some?" },
        { file: 'duke-lines/damn.mp3', text: "Damn!" },
        { file: 'duke-lines/cool.mp3', text: "Cool!" },
        // New iconic lines from vocal collection
        { file: 'duke-lines/bubblegum.mp3', text: "It's time to kick ass and chew bubblegum... and I'm all outta gum!" },
        { file: 'duke-lines/balls-of-steel.mp3', text: "I've got balls of steel!" },
        { file: 'duke-lines/rip-head-off.mp3', text: "I'll rip your head off and shit down your neck!" },
        { file: 'duke-lines/terminated.mp3', text: "Terminated!" },
        { file: 'duke-lines/rest-in-pieces.mp3', text: "Rest in pieces!" },
        { file: 'duke-lines/wasted.mp3', text: "Hmhmhm, wasted." },
        { file: 'duke-lines/eat-shit-and-die.mp3', text: "Eat shit and die!" },
        { file: 'duke-lines/die-son-of-a-bitch.mp3', text: "Die, you son of a bitch!" },
        { file: 'duke-lines/born-to-be-wild.mp3', text: "Born to be wiiiiild!" },
        // Requested iconic one-liners
        { file: 'duke-lines/disease-and-cure.mp3', text: "Hey, you're the disease, and I'm the cure!" },
        { file: 'duke-lines/mess-with-best.mp3', text: "Mess with the best, die like the rest!" },
        { file: 'duke-lines/birth-control.mp3', text: "You're an inspiration for birth control!" },
        { file: 'duke-lines/gotta-hurt.mp3', text: "Ewww... that's gotta hurt!" },
        { file: 'duke-lines/what-a-mess.mp3', text: "Heh heh heh... what a mess!" },
        // Additional classics from vocal collection
        { file: 'duke-lines/blow-it-out.mp3', text: "Blow it out your ass!" },
        { file: 'duke-lines/youre-ugly.mp3', text: "Damn. You're ugly." },
        { file: 'duke-lines/love-this-job.mp3', text: "Babes, bullets, bombs... damn, I love this job!" },
        { file: 'duke-lines/im-duke-nukem.mp3', text: "I'm Duke Nukem... and I'm coming to get the rest of you alien bastards!" }
    ];

    // ===== KILL COMBO TAUNTS (escalating aggression) =====
    const comboTaunts = [
        { kills: 2, text: "Double kill!", voice: 'comeGetSome' },
        { kills: 3, text: "TRIPLE KILL!", voice: 'damnImGood' },
        { kills: 4, text: "MULTI KILL!", voice: 'pieceOfCake' },
        { kills: 5, text: "KILLING SPREE!", voice: 'whoWantsSome' },
        { kills: 7, text: "RAMPAGE!", voice: 'letsRock' },
        { kills: 10, text: "UNSTOPPABLE!", voice: 'hailToTheKing' },
        { kills: 15, text: "GODLIKE!", voice: 'ballsOfSteel' },
        { kills: 20, text: "MASSACRE!", voice: 'blowItOut' }
    ];

    // ===== BLOOD/GIB PARTICLES =====
    const gibEmojis = ['🩸', '💀', '🦴', '🫀', '🧠', '👁️'];
    const bloodColors = ['#8B0000', '#DC143C', '#B22222', '#FF0000', '#CC0000'];

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
        'dnallen': { name: 'Spawn Alien', action: () => spawnBossAlien() },
        'dnbabes': { name: 'Strip Club', action: () => triggerBabesEasterEgg() }
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
        { name: 'pig-cop', hp: 30, points: 100, image: `${basePath}images/pig-cop.png`, deathSound: 'death1' },
        { name: 'assault-trooper', hp: 20, points: 75, image: `${basePath}images/assault-trooper.png`, deathSound: 'death1' },
        { name: 'octabrain', hp: 40, points: 150, image: `${basePath}images/octabrain.png`, deathSound: 'death1' },
        { name: 'enforcer', hp: 50, points: 200, image: `${basePath}images/enforcer.png`, deathSound: 'death1' }
    ];

    // ===== WEAPONS =====
    // Weapon fire sound files mapping
    const weaponFireSounds = {
        boot: 'mighty-boot.wav',
        pistol: 'pistol-fire.wav',
        shotgun: 'shotgun-fire.wav',
        chaingun: 'ripper-fire.wav',
        rpg: 'rpg-fire.wav',
        pipebomb: 'pipebomb-fire.wav',
        devastator: 'devastator-fire.wav',
        freezer: 'freezer-fire.wav'
    };

    const weapons = {
        boot: { name: 'Mighty Boot', damage: 10, sound: 'boot', icon: `<img src="${basePath}images/boot-sprite.png" alt="Boot" style="height:24px;image-rendering:pixelated;">` },
        pistol: { name: 'Pistol', damage: 15, sound: 'pistol', icon: `<img src="${basePath}images/pistol-sprite.png" alt="Pistol" style="height:24px;image-rendering:pixelated;">` },
        shotgun: { name: 'Shotgun', damage: 40, sound: 'shotgun', icon: `<img src="${basePath}images/shotgun-sprite.png" alt="Shotgun" style="height:24px;image-rendering:pixelated;">` },
        chaingun: { name: 'Chaingun Cannon', damage: 25, sound: 'chaingun', icon: `<img src="${basePath}images/ripper-sprite.png" alt="Chaingun" style="height:24px;image-rendering:pixelated;">` },
        rpg: { name: 'RPG', damage: 100, sound: 'rpg', icon: `<img src="${basePath}images/rpg-sprite.png" alt="RPG" style="height:24px;image-rendering:pixelated;">` },
        pipebomb: { name: 'Pipe Bomb', damage: 80, sound: 'pipebomb', icon: `<img src="${basePath}images/pipebomb-sprite.png" alt="Pipebomb" style="height:24px;image-rendering:pixelated;">` },
        devastator: { name: 'Devastator', damage: 150, sound: 'devastator', icon: `<img src="${basePath}images/devastator-sprite.png" alt="Devastator" style="height:24px;image-rendering:pixelated;">` },
        freezer: { name: 'Freezethrower', damage: 30, sound: 'freezer', icon: `<img src="${basePath}images/freezer-sprite.png" alt="Freezer" style="height:24px;image-rendering:pixelated;">` }
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
        setupEasterEggs();
        setupIdleAnimation();
        setupWeaponHoverSounds();
        updateHUD();

        // Show intro sequence on first visit (after a short delay)
        setTimeout(() => {
            showIntroSequence();
        }, 1000);

        console.log('[Duke Game Engine] Initialized. Type cheat codes to activate!');
        console.log('[Duke] Cheat codes: dnkroz, dnstuff, dnallen, dnbabes, dnhyper');
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
        // 50% chance to use dynamic voice clips (from files) if available
        if (dynamicVoiceClips.length > 0 && Math.random() < 0.5) {
            return playDynamicVoice();
        }
        const keys = Object.keys(dukeVoiceClips);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return playVoice(randomKey);
    }

    // Play a random voice clip from the dynamic clips (loaded from audio files)
    function playDynamicVoice() {
        const now = Date.now();
        if (now - gameState.lastVoicePlayed < gameState.voiceCooldown) return false;

        const clip = dynamicVoiceClips[Math.floor(Math.random() * dynamicVoiceClips.length)];
        if (!clip) return false;

        const audio = new Audio(`${basePath}audio/${clip.file}`);
        audio.volume = 0.7;
        audio.play().then(() => {
            currentlyPlayingAudio = audio;
            gameState.lastVoicePlayed = now;
            showQuote(clip.text);
        }).catch(() => {});

        return true;
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

        // Muzzle flash at click position (slightly offset toward player)
        showMuzzleFlash(e.clientX, e.clientY + 50);

        // Screen shake (heavier for explosive weapons)
        if (weapon.sound === 'explosion') {
            shakeScreen('heavy');
        } else {
            shakeScreen();
        }

        // Bullet impact at enemy
        showBulletImpact(e.clientX, e.clientY);

        if (newHp <= 0) {
            // Enemy killed
            const points = parseInt(enemy.dataset.points);

            // Create explosion
            createExplosion(e.clientX, e.clientY);

            // BLOOD AND GIBS!
            spawnBloodSplatter(e.clientX, e.clientY, 8);
            spawnGibs(e.clientX, e.clientY, 6);

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

            // Update kill combo - this handles voice and combo display
            const combo = updateKillCombo();

            // Only play random voice if not a combo milestone (combo system handles its own voices)
            if (!comboTaunts.find(t => t.kills === combo) && Math.random() > 0.7) {
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

            // Spawn some blood on hit (not death)
            spawnBloodSplatter(e.clientX, e.clientY, 3);

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
    let battlelordRoar = null;

    function playBattlelordRoar() {
        if (!battlelordRoar) {
            battlelordRoar = new Audio(`${basePath}audio/battlelord-roar.mp3`);
            battlelordRoar.volume = 0.6;
        }
        battlelordRoar.currentTime = 0;
        battlelordRoar.play().catch(() => {});
    }

    function spawnBoss() {
        if (document.querySelector('.boss-enemy')) return;

        const boss = document.createElement('div');
        boss.className = 'boss-enemy boss-spawning';
        boss.dataset.hp = 500;
        boss.dataset.maxHp = 500;
        boss.dataset.state = 'idle';
        boss.innerHTML = `
            <div class="boss-health-bar" style="opacity: 0;">
                <div class="boss-health-fill"></div>
            </div>
            <div class="boss-name" style="opacity: 0;">BATTLELORD</div>
        `;

        // Start small (pre-spawn size) then grow
        boss.style.cssText = `
            position: fixed;
            left: 50%;
            top: 30%;
            transform: translateX(-50%) scale(0.3);
            width: 300px;
            height: 300px;
            background-image: url('${basePath}images/battlelord.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            image-rendering: pixelated;
            cursor: crosshair;
            z-index: 150;
            filter: drop-shadow(0 0 30px rgba(255, 0, 0, 0.8));
            opacity: 0;
            transition: transform 1s ease-out, opacity 0.5s ease-in;
        `;

        boss.addEventListener('click', (e) => damageBoss(e, boss));

        document.body.appendChild(boss);

        // Play Battlelord roar immediately
        playBattlelordRoar();
        flashScreen('#ff0000', 300);

        // Animate spawn: fade in
        setTimeout(() => {
            boss.style.opacity = '1';
        }, 50);

        // Grow to full size
        setTimeout(() => {
            boss.style.transform = 'translateX(-50%) scale(1)';
            boss.classList.remove('boss-spawning');
            boss.classList.add('boss-active');
        }, 300);

        // Show health bar and name after spawn animation
        setTimeout(() => {
            const healthBar = boss.querySelector('.boss-health-bar');
            const bossName = boss.querySelector('.boss-name');
            if (healthBar) healthBar.style.opacity = '1';
            if (bossName) bossName.style.opacity = '1';

            // Start idle animation
            boss.style.animation = 'bossPulse 1s ease-in-out infinite';
            showQuote("AHREFS: Our backlink index is bigger! ...Wait, no it's not.");
        }, 1000);
    }

    function damageBoss(e, boss) {
        e.stopPropagation();

        const weapon = weapons[gameState.currentWeapon];
        const hp = parseInt(boss.dataset.hp);
        const maxHp = parseInt(boss.dataset.maxHp);
        const newHp = hp - weapon.damage;

        playSound(weapon.sound);
        shakeScreen('heavy'); // Always heavy for boss
        createExplosion(e.clientX, e.clientY);
        showMuzzleFlash(e.clientX, e.clientY + 50);
        showBulletImpact(e.clientX, e.clientY);
        spawnBloodSplatter(e.clientX, e.clientY, 4);

        if (newHp <= 0) {
            // Boss killed! Play "Blow it out your ass"
            gameState.bossDefeated = true;
            localStorage.setItem('boss_defeated', 'true');
            unlockAchievement('boss_killer');

            // Big explosion chain
            for (let i = 0; i < 15; i++) {
                setTimeout(() => {
                    createExplosion(
                        e.clientX + (Math.random() - 0.5) * 250,
                        e.clientY + (Math.random() - 0.5) * 250
                    );
                    // Extra blood and gibs!
                    spawnBloodSplatter(
                        e.clientX + (Math.random() - 0.5) * 300,
                        e.clientY + (Math.random() - 0.5) * 300,
                        5
                    );
                    spawnGibs(
                        e.clientX + (Math.random() - 0.5) * 200,
                        e.clientY + (Math.random() - 0.5) * 200,
                        4
                    );
                }, i * 80);
            }

            // Boss death animation - shrink and fade
            boss.style.transition = 'all 0.8s ease-in';
            boss.style.transform = 'translateX(-50%) scale(0.1) rotate(360deg)';
            boss.style.opacity = '0';
            boss.style.filter = 'brightness(5) drop-shadow(0 0 50px #ff0000)';

            // Play "Blow it out your ass!" - the iconic kill line
            playVoice('blowItOut');
            showQuote("Blow it out your ass!");

            gameState.killCount += 10;
            gameState.totalKills += 10;
            updateHUD();

            // Remove after animation
            setTimeout(() => boss.remove(), 800);
        } else {
            boss.dataset.hp = newHp;
            const healthPercent = (newHp / maxHp) * 100;
            const healthFill = boss.querySelector('.boss-health-fill');
            if (healthFill) healthFill.style.width = healthPercent + '%';

            // Pain state - make Battlelord react
            boss.classList.add('boss-hit');
            boss.classList.add('boss-pain');

            // Flash red and shake the boss
            boss.style.filter = 'brightness(3) hue-rotate(0deg) drop-shadow(0 0 40px #ff0000)';

            // Random pain reaction
            const painReactions = [
                'translateX(-50%) scale(1.1) rotate(-5deg)',
                'translateX(-50%) scale(0.95) rotate(5deg)',
                'translateX(-50%) scale(1.05) rotate(-3deg)'
            ];
            const randomPain = painReactions[Math.floor(Math.random() * painReactions.length)];
            boss.style.transform = randomPain;

            // Play roar occasionally when hit (20% chance)
            if (Math.random() < 0.2) {
                playBattlelordRoar();
            }

            // Return to normal after hit
            setTimeout(() => {
                boss.classList.remove('boss-hit');
                boss.classList.remove('boss-pain');
                boss.style.filter = 'drop-shadow(0 0 30px rgba(255, 0, 0, 0.8))';
                boss.style.transform = 'translateX(-50%) scale(1)';
            }, 150);

            // Show taunt quotes at health thresholds
            if (healthPercent < 25 && healthPercent > 20) {
                showQuote("AHREFS: SEMrush has... more tools?! Impossible!");
            } else if (healthPercent < 50 && healthPercent > 45) {
                showQuote("AHREFS: But our UI is orange! That counts for something!");
            } else if (healthPercent < 75 && healthPercent > 70) {
                showQuote("AHREFS: We have... uh... position tracking too!");
            }
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

        // Play the weapon's fire sound instead of generic pickup
        playWeaponFireSound(weaponKey);
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
        // Check if this is a weapon fire sound
        if (weaponFireSounds[soundId]) {
            playWeaponFireSound(soundId);
            return;
        }

        const audio = document.getElementById(soundId + 'Sound') || document.getElementById(soundId);
        if (audio) {
            audio.volume = 0.5;
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    }

    // Play weapon fire sound from audio files
    function playWeaponFireSound(weaponKey) {
        const soundFile = weaponFireSounds[weaponKey];
        if (!soundFile) return;

        const audio = new Audio(`${basePath}audio/${soundFile}`);
        audio.volume = 0.6;
        audio.play().catch(() => {});
    }

    // ===== SCREEN SHAKE EFFECTS =====
    function shakeScreen(intensity = 'normal') {
        document.body.classList.remove('screen-shake', 'screen-shake-heavy');
        // Force reflow to restart animation
        void document.body.offsetWidth;

        if (intensity === 'heavy') {
            document.body.classList.add('screen-shake-heavy');
            setTimeout(() => document.body.classList.remove('screen-shake-heavy'), 500);
        } else {
            document.body.classList.add('screen-shake');
            setTimeout(() => document.body.classList.remove('screen-shake'), 300);
        }
    }

    // ===== BLOOD SPLATTER EFFECTS =====
    function spawnBloodSplatter(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            const blood = document.createElement('div');
            blood.className = 'blood-splatter';
            blood.textContent = '🩸';

            // Randomize position around impact point
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;
            const scale = 0.5 + Math.random() * 1.5;
            const rotation = Math.random() * 360;

            blood.style.cssText = `
                position: fixed;
                left: ${x + offsetX}px;
                top: ${y + offsetY}px;
                font-size: ${scale * 2}rem;
                transform: rotate(${rotation}deg);
                pointer-events: none;
                z-index: 99999;
                animation: bloodSplat 0.6s ease-out forwards;
            `;

            document.body.appendChild(blood);
            setTimeout(() => blood.remove(), 600);
        }
    }

    // ===== GIB EXPLOSION (body parts flying) =====
    function spawnGibs(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            const gib = document.createElement('div');
            gib.className = 'gib-particle';
            gib.textContent = gibEmojis[Math.floor(Math.random() * gibEmojis.length)];

            // Random trajectory
            const angle = (Math.random() * Math.PI * 2);
            const velocity = 100 + Math.random() * 200;
            const endX = Math.cos(angle) * velocity;
            const endY = Math.sin(angle) * velocity - 100; // Bias upward
            const rotation = Math.random() * 720 - 360;

            gib.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: ${1 + Math.random()}rem;
                pointer-events: none;
                z-index: 99999;
                --end-x: ${endX}px;
                --end-y: ${endY}px;
                --rotation: ${rotation}deg;
                animation: gibFly 0.8s ease-out forwards;
            `;

            document.body.appendChild(gib);
            setTimeout(() => gib.remove(), 800);
        }
    }

    // ===== MUZZLE FLASH =====
    function showMuzzleFlash(x, y) {
        const flash = document.createElement('div');
        flash.className = 'muzzle-flash';
        flash.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 80px;
            height: 80px;
            transform: translate(-50%, -50%);
            background: radial-gradient(circle, #fff 0%, #ffff00 20%, #ff6600 40%, transparent 70%);
            pointer-events: none;
            z-index: 100000;
            animation: muzzleFlash 0.08s ease-out forwards;
        `;

        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 80);
    }

    // ===== BULLET IMPACT SPARKS =====
    function showBulletImpact(x, y) {
        const impact = document.createElement('div');
        impact.className = 'bullet-impact';
        impact.innerHTML = '💥';
        impact.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 2rem;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 99998;
            animation: bulletImpact 0.3s ease-out forwards;
        `;

        document.body.appendChild(impact);
        setTimeout(() => impact.remove(), 300);
    }

    // ===== KILL COMBO SYSTEM =====
    function updateKillCombo() {
        const now = Date.now();

        // Check if combo is still active
        if (now - gameState.lastKillTime > gameState.comboTimeout) {
            gameState.killCombo = 0;
        }

        gameState.killCombo++;
        gameState.lastKillTime = now;

        // Check for combo milestone
        const comboTaunt = comboTaunts.find(t => t.kills === gameState.killCombo);
        if (comboTaunt) {
            showKillCombo(comboTaunt.text, gameState.killCombo);
            playVoice(comboTaunt.voice);

            // Extra effects for big combos
            if (gameState.killCombo >= 5) {
                shakeScreen('heavy');
                flashScreen('#ff0000', 200);
            }
        }

        return gameState.killCombo;
    }

    function showKillCombo(text, count) {
        // Remove existing combo display
        const existing = document.querySelector('.kill-combo');
        if (existing) existing.remove();

        const combo = document.createElement('div');
        combo.className = 'kill-combo';
        combo.innerHTML = `
            <div class="combo-text">${text}</div>
            <div class="combo-count">${count}x COMBO</div>
        `;
        combo.style.cssText = `
            position: fixed;
            top: 150px;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            font-family: 'Press Start 2P', monospace;
            z-index: 100001;
            animation: comboPopIn 0.3s ease-out;
        `;

        document.body.appendChild(combo);

        setTimeout(() => {
            combo.style.animation = 'comboFadeOut 0.5s ease-out forwards';
            setTimeout(() => combo.remove(), 500);
        }, 2000);
    }

    // ===== MATURE WARNING OVERLAY =====
    function showMatureWarning() {
        if (gameState.matureWarningShown) return;

        const overlay = document.createElement('div');
        overlay.className = 'mature-warning-overlay';
        overlay.innerHTML = `
            <div class="mature-warning-content">
                <div class="mature-warning-icon">⚠️</div>
                <h2>MATURE CONTENT WARNING</h2>
                <p>This site contains content inspired by Duke Nukem 3D, including:</p>
                <ul>
                    <li>Cartoon violence and blood effects</li>
                    <li>Adult humor and language</li>
                    <li>Mature themes</li>
                </ul>
                <p class="mature-warning-subtitle">Just like the original game from 1996!</p>
                <div class="mature-warning-buttons">
                    <button class="mature-btn-enter">I'M OLD ENOUGH - LET ME IN</button>
                    <button class="mature-btn-exit">TAKE ME BACK</button>
                </div>
                <p class="mature-warning-footer">"Hail to the king, baby!"</p>
            </div>
        `;

        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            animation: fadeIn 0.3s ease-out;
        `;

        document.body.appendChild(overlay);

        overlay.querySelector('.mature-btn-enter').addEventListener('click', () => {
            gameState.matureWarningShown = true;
            localStorage.setItem('duke_mature_warning', 'true');
            overlay.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => overlay.remove(), 300);
            playVoice('letsRock');
        });

        overlay.querySelector('.mature-btn-exit').addEventListener('click', () => {
            window.location.href = 'https://www.google.com';
        });
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

    // ===== INTRO SEQUENCE - "Damn, those alien bastards!" =====
    function showIntroSequence() {
        const introShown = localStorage.getItem('duke_intro_shown');
        if (introShown) return;

        const intro = document.createElement('div');
        intro.className = 'duke-intro-sequence';
        intro.innerHTML = `
            <div class="intro-content">
                <div class="intro-rating">
                    <div class="esrb-rating">
                        <div class="esrb-box">
                            <div class="esrb-letter">M</div>
                            <div class="esrb-text">MATURE 17+</div>
                        </div>
                        <div class="esrb-descriptors">
                            <div>Blood and Gore</div>
                            <div>Intense Violence</div>
                            <div>Mature Humor</div>
                            <div>Partial Nudity</div>
                        </div>
                    </div>
                </div>
                <div class="intro-duke-face">
                    <img src="${basePath}images/duke-hero.png" alt="Duke Nukem" class="intro-duke-img">
                </div>
                <div class="intro-text">
                    <p class="intro-line line-1">"Damn..."</p>
                    <p class="intro-line line-2">"Those alien bastards..."</p>
                    <p class="intro-line line-3">"Are gonna pay for shooting up my ride!"</p>
                </div>
                <div class="intro-enter">
                    <button class="intro-enter-btn">CLICK TO ENTER</button>
                    <p class="intro-warning">By entering, you confirm you are 17 or older</p>
                </div>
            </div>
        `;

        intro.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 999998;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.5s ease-out;
            cursor: pointer;
        `;

        document.body.appendChild(intro);

        // Animate the text lines sequentially
        const lines = intro.querySelectorAll('.intro-line');
        lines.forEach((line, i) => {
            line.style.cssText = `
                opacity: 0;
                transform: translateY(20px);
                font-family: 'Press Start 2P', monospace;
                font-size: ${i === 2 ? '0.7rem' : '1rem'};
                color: ${i === 0 ? '#ffcc00' : '#ff0000'};
                text-shadow: 0 0 20px ${i === 0 ? '#ffcc00' : '#ff0000'};
                margin: 0.8rem 0;
                transition: all 0.5s ease-out;
            `;

            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, 500 + i * 1200);
        });

        // Play "Damn" voice clip
        setTimeout(() => playDynamicVoice(), 500);

        // Close on click (anywhere or button)
        const closeIntro = () => {
            localStorage.setItem('duke_intro_shown', 'true');
            intro.style.animation = 'fadeOut 0.5s ease-out forwards';
            playVoice('letsRock');
            setTimeout(() => intro.remove(), 500);
        };

        // Only close on explicit click - no auto-close
        intro.querySelector('.intro-enter-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            closeIntro();
        });
        intro.addEventListener('click', closeIntro);
    }

    // ===== EASTER EGG - STRIPPERS/BABES =====
    let easterEggClicks = 0;
    let lastEasterEggClick = 0;

    function setupEasterEggs() {
        // Konami-style easter egg: clicking rapidly on Duke sprite 5 times
        document.addEventListener('click', (e) => {
            const dukeImg = e.target.closest('.duke-face-container, .duke-sprite-main, [alt*="Duke"]');
            if (!dukeImg) return;

            const now = Date.now();
            if (now - lastEasterEggClick > 2000) {
                easterEggClicks = 0;
            }
            lastEasterEggClick = now;
            easterEggClicks++;

            if (easterEggClicks >= 5) {
                triggerBabesEasterEgg();
                easterEggClicks = 0;
            }
        });

        // Also listen for "dnbabes" cheat code (add to cheat codes)
    }

    function triggerBabesEasterEgg() {
        playVoice('shakeItBaby');
        showQuote("Shake it, baby!");

        // Create neon sign effect
        const neonSign = document.createElement('div');
        neonSign.className = 'easter-egg-neon';
        neonSign.innerHTML = `
            <div class="neon-text">GIRLS GIRLS GIRLS</div>
            <div class="neon-subtitle">Duke's favorite club</div>
        `;
        neonSign.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 100000;
            animation: neonFlicker 0.5s ease-in-out;
        `;

        document.body.appendChild(neonSign);

        // Flash screen pink/red
        flashScreen('#ff1493', 300);

        setTimeout(() => {
            neonSign.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => neonSign.remove(), 500);
        }, 3000);

        // Show some dancing silhouettes
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const dancer = document.createElement('div');
                dancer.className = 'dancer-silhouette';
                dancer.textContent = '💃';
                dancer.style.cssText = `
                    position: fixed;
                    top: ${30 + Math.random() * 40}%;
                    left: ${10 + i * 35}%;
                    font-size: 5rem;
                    pointer-events: none;
                    z-index: 99999;
                    animation: dancerBounce 0.5s ease-in-out infinite, fadeOut 3s ease-out forwards;
                    filter: drop-shadow(0 0 20px #ff1493);
                `;
                document.body.appendChild(dancer);
                setTimeout(() => dancer.remove(), 3000);
            }, i * 200);
        }
    }

    // ===== DUKE SMOKING IDLE ANIMATION =====
    let idleTimeout = null;
    let isSmoking = false;

    function setupIdleAnimation() {
        // Reset idle timer on any interaction
        const resetIdle = () => {
            if (idleTimeout) clearTimeout(idleTimeout);
            if (isSmoking) stopSmoking();

            idleTimeout = setTimeout(() => {
                startSmoking();
            }, 30000); // 30 seconds of idle
        };

        document.addEventListener('mousemove', resetIdle);
        document.addEventListener('click', resetIdle);
        document.addEventListener('keydown', resetIdle);

        resetIdle();
    }

    function startSmoking() {
        isSmoking = true;
        const dukeSprite = document.querySelector('.duke-face-container img, .duke-sprite-main');
        if (!dukeSprite) return;

        // Add cigar/smoke effect
        const cigar = document.createElement('div');
        cigar.className = 'duke-cigar';
        cigar.innerHTML = `
            <div class="cigar-stick">🚬</div>
            <div class="smoke-particles"></div>
        `;
        cigar.style.cssText = `
            position: absolute;
            bottom: 30%;
            right: 20%;
            font-size: 1.5rem;
            transform: rotate(-15deg);
            z-index: 100;
        `;

        const container = dukeSprite.parentElement;
        if (container) {
            container.style.position = 'relative';
            container.appendChild(cigar);

            // Animate smoke
            const smokeInterval = setInterval(() => {
                if (!isSmoking) {
                    clearInterval(smokeInterval);
                    return;
                }
                const smoke = document.createElement('div');
                smoke.textContent = '💨';
                smoke.style.cssText = `
                    position: absolute;
                    font-size: 1rem;
                    opacity: 0.7;
                    animation: smokeRise 2s ease-out forwards;
                `;
                cigar.querySelector('.smoke-particles').appendChild(smoke);
                setTimeout(() => smoke.remove(), 2000);
            }, 500);
        }
    }

    function stopSmoking() {
        isSmoking = false;
        const cigar = document.querySelector('.duke-cigar');
        if (cigar) cigar.remove();
    }

    // ===== DELAYED NAVIGATION FOR AUDIO =====
    // Intercept internal link clicks to let audio finish playing
    function setupDelayedNavigation() {
        // Use bubble phase so other click handlers (that play audio) run first
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

            // Prevent the default navigation
            e.preventDefault();

            // Store destination
            pendingNavigation = href;

            // Give a moment for audio to start playing (other handlers may have triggered it)
            setTimeout(() => {
                // Check if any audio element on the page is currently playing
                const allAudio = document.querySelectorAll('audio');
                let audioPlaying = null;

                allAudio.forEach(audio => {
                    // Find audio that's playing and not the background music (which loops)
                    if (!audio.paused && !audio.loop && audio.currentTime > 0) {
                        audioPlaying = audio;
                    }
                });

                // Also check our tracked audio
                if (currentlyPlayingAudio && !currentlyPlayingAudio.paused) {
                    audioPlaying = currentlyPlayingAudio;
                }

                if (audioPlaying) {
                    // Wait for audio to end
                    const onEnded = () => {
                        audioPlaying.removeEventListener('ended', onEnded);
                        if (pendingNavigation === href) {
                            pendingNavigation = null;
                            window.location.href = href;
                        }
                    };
                    audioPlaying.addEventListener('ended', onEnded);

                    // Also set a maximum wait time (2 seconds)
                    setTimeout(() => {
                        if (pendingNavigation === href) {
                            pendingNavigation = null;
                            window.location.href = href;
                        }
                    }, 2000);
                } else {
                    // No audio playing, navigate now
                    pendingNavigation = null;
                    window.location.href = href;
                }
            }, 50); // Small delay to let audio start
        }); // Bubble phase (default)
    }

    // ===== WEAPON HOVER SOUNDS =====
    // Maps weapons to their characteristic sounds/voice lines
    const weaponHoverSounds = {
        'boot': { voice: 'pieceOfCake', text: 'Mighty Boot - stomp bugs!' },
        'mighty-boot': { voice: 'pieceOfCake', text: 'Mighty Boot - stomp bugs!' },
        'pistol': { voice: 'comeGetSome', text: 'Pistol - precision targeting!' },
        'shotgun': { voice: 'letsRock', text: 'Shotgun - let\'s rock!' },
        'chaingun': { voice: 'comeGetSome', text: 'Chaingun - rapid fire!' },
        'ripper': { voice: 'comeGetSome', text: 'Ripper - rip it up!' },
        'rpg': { voice: 'blowItOut', text: 'RPG - blast off!' },
        'pipebomb': { voice: 'blowItOut', text: 'Pipe Bomb - blow it up!' },
        'devastator': { voice: 'damnImGood', text: 'Devastator - mass destruction!' },
        'freezer': { voice: 'cool', text: 'Freezethrower - ice cold!' },
        'freezethrower': { voice: 'cool', text: 'Freezethrower - freeze \'em!' }
    };

    // Cooldown to prevent sound spam on hover
    let lastWeaponHoverTime = 0;
    const weaponHoverCooldown = 800; // 800ms between sounds

    function setupWeaponHoverSounds() {
        // Add hover sounds to feature cards (the weapon cards in the grid)
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            // Identify weapon from the image inside
            const img = card.querySelector('.feature-icon img');
            if (img) {
                const src = img.getAttribute('src') || '';
                const weaponType = identifyWeaponFromSrc(src);
                if (weaponType) {
                    card.dataset.weapon = weaponType;
                    card.addEventListener('mouseenter', () => playWeaponHoverSound(weaponType));
                }
            }
        });

        // Add hover sounds to weapons table rows
        const weaponsTable = document.querySelector('.weapons-table');
        if (weaponsTable) {
            const rows = weaponsTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const img = row.querySelector('img');
                if (img) {
                    const src = img.getAttribute('src') || '';
                    const weaponType = identifyWeaponFromSrc(src);
                    if (weaponType) {
                        row.dataset.weapon = weaponType;
                        row.style.cursor = 'pointer';
                        row.addEventListener('mouseenter', () => playWeaponHoverSound(weaponType));

                        // Add visual feedback on hover
                        row.addEventListener('mouseenter', () => {
                            row.style.transition = 'all 0.2s ease';
                            row.style.transform = 'scale(1.02)';
                            row.style.boxShadow = '0 0 20px rgba(255, 102, 0, 0.5)';
                        });
                        row.addEventListener('mouseleave', () => {
                            row.style.transform = 'scale(1)';
                            row.style.boxShadow = 'none';
                        });
                    }
                }
            });
        }

        // Add hover sounds to HUD weapon slots
        const hudWeaponSlots = document.querySelectorAll('.hud-weapon-slot');
        hudWeaponSlots.forEach(slot => {
            const img = slot.querySelector('img');
            if (img) {
                const src = img.getAttribute('src') || '';
                const weaponType = identifyWeaponFromSrc(src);
                if (weaponType) {
                    slot.addEventListener('mouseenter', () => playWeaponHoverSound(weaponType, true)); // quieter for HUD
                }
            }
        });
    }

    function identifyWeaponFromSrc(src) {
        const srcLower = src.toLowerCase();
        if (srcLower.includes('boot')) return 'boot';
        if (srcLower.includes('pistol')) return 'pistol';
        if (srcLower.includes('shotgun')) return 'shotgun';
        if (srcLower.includes('ripper') || srcLower.includes('chaingun')) return 'chaingun';
        if (srcLower.includes('rpg')) return 'rpg';
        if (srcLower.includes('pipebomb') || srcLower.includes('pipe')) return 'pipebomb';
        if (srcLower.includes('devastator')) return 'devastator';
        if (srcLower.includes('freezer') || srcLower.includes('freeze')) return 'freezer';
        return null;
    }

    function playWeaponHoverSound(weaponType, quiet = false) {
        const now = Date.now();
        if (now - lastWeaponHoverTime < weaponHoverCooldown) return;
        lastWeaponHoverTime = now;

        const weaponData = weaponHoverSounds[weaponType];
        if (!weaponData) return;

        // Play the stomp sound for boot, pickup for others (as base sound)
        const baseSound = weaponType === 'boot' || weaponType === 'mighty-boot'
            ? document.getElementById('bootsSound')
            : document.getElementById('pickupSound');

        if (baseSound) {
            baseSound.volume = quiet ? 0.15 : 0.3;
            baseSound.currentTime = 0;
            baseSound.play().catch(() => {});
        }

        // Also show the weapon tooltip text
        showWeaponTooltip(weaponData.text);

        // 30% chance to play a voice clip too (for extra flavor)
        if (Math.random() < 0.3 && !quiet) {
            // Slight delay so base sound plays first
            setTimeout(() => {
                playVoice(weaponData.voice);
            }, 100);
        }
    }

    function showWeaponTooltip(text) {
        // Remove existing tooltip
        const existing = document.querySelector('.weapon-hover-tooltip');
        if (existing) existing.remove();

        const tooltip = document.createElement('div');
        tooltip.className = 'weapon-hover-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #ff6c2c;
            padding: 0.5rem 1rem;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.5rem;
            color: #ffcc00;
            text-shadow: 0 0 10px #ffcc00;
            z-index: 10001;
            pointer-events: none;
            animation: tooltipFadeIn 0.2s ease-out;
        `;

        document.body.appendChild(tooltip);

        // Auto-remove after 1.5 seconds
        setTimeout(() => {
            tooltip.style.animation = 'tooltipFadeOut 0.3s ease-out forwards';
            setTimeout(() => tooltip.remove(), 300);
        }, 1500);
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
        playWeaponHoverSound,
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
