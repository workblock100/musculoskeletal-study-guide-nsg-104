// ANATOMY RUSH - Legendary Edition 2025
// With dash, weather, achievements, and more!
class AnatomyRush {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();

        this.state = 'menu';
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.streak = 0;
        this.multiplier = 1;
        this.distance = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.level = 1;
        this.highScore = parseInt(localStorage.getItem('anatomyRush2025HS')) || 0;
        this.totalCoins = parseInt(localStorage.getItem('anatomyRush2025Coins')) || 0;

        this.lanes = 3;
        this.currentLane = 1;
        this.targetLane = 1;
        this.laneWidth = 150;

        this.player = {
            jumpHeight: 0,
            jumpVelocity: 0,
            isJumping: false,
            canDoubleJump: true,
            isSliding: false,
            slideTimer: 0,
            animFrame: 0,
            invincible: 0,
            shield: 0,
            magnet: 0,
            speedBoost: 0,
            trail: [],
            dashCooldown: 0,
            isDashing: false,
            dashTimer: 0
        };

        // Weather system
        this.weather = 'clear';
        this.weatherTimer = 0;
        this.raindrops = [];
        this.snowflakes = [];

        // Achievements
        this.achievements = JSON.parse(localStorage.getItem('anatomyAchievements')) || {};
        this.newAchievement = null;

        this.speed = 1;
        this.maxSpeed = 3.5;

        this.obstacles = [];
        this.coins_arr = [];
        this.powerups = [];
        this.particles = [];
        this.floatingTexts = [];
        this.buildings = [];
        this.stars = [];

        // Special events
        this.feverMode = false;
        this.feverTimer = 0;
        this.coinRush = false;
        this.coinRushTimer = 0;
        this.perfectRun = true;
        this.totalJumps = 0;
        this.totalDashes = 0;
        this.coinsThisRun = 0;
        this.questionsCorrect = 0;

        // Generate stars for parallax
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * 2000,
                y: Math.random() * 400,
                size: 0.5 + Math.random() * 2,
                speed: 0.1 + Math.random() * 0.3,
                twinkle: Math.random() * 6.28
            });
        }

        this.questionDistance = 7000;
        this.nextQuestionAt = this.questionDistance;
        this.questionIncrement = 5000;
        this.currentQuestion = null;
        this.questionTimer = 0;
        this.questionTimeLimit = 15;
        this.selectedAnswer = -1;
        this.questionResult = null;

        // Question review system
        this.questionHistory = [];
        this.questionsAnswered = 0;
        this.questionsCorrectRun = 0;

        // Time of day (changes based on distance)
        this.timeOfDay = 'dawn'; // dawn, day, dusk, night

        // Confetti system
        this.confetti = [];

        // Lifetime stats
        this.stats = JSON.parse(localStorage.getItem('anatomyRushStats')) || {
            totalRuns: 0,
            totalDistance: 0,
            totalCoins: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            bestStreak: 0,
            highestLevel: 0
        };

        this.lastObstacle = 0;
        this.obstacleGap = 500;
        this.shake = 0;
        this.flash = null;
        this.running = false;
        this.lastTime = 0;
        this.globalTime = 0;

        for (let i = 0; i < 30; i++) {
            this.buildings.push({
                x: i * 90 - 200,
                height: 60 + Math.random() * 280,
                width: 40 + Math.random() * 50,
                windows: Math.floor(Math.random() * 5) + 2,
                hue: Math.random() * 80 + 180,
                lit: Math.random() > 0.25
            });
        }

        this.bindEvents();
    }

    resize() {
        const container = this.canvas.parentElement;
        const maxW = Math.min(container.offsetWidth - 20, 1600);
        const maxH = Math.min(window.innerHeight - 100, 850);
        this.canvas.width = maxW / 16 * 9 > maxH ? maxH / 9 * 16 : maxW;
        this.canvas.height = maxW / 16 * 9 > maxH ? maxH : maxW / 16 * 9;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.centerX = this.width / 2;
    }

    bindEvents() {
        const handleKey = (e) => {
            const keys = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Enter'];
            if (keys.includes(e.code) && this.running) { e.preventDefault(); e.stopPropagation(); }

            if (this.state === 'menu' && (e.code === 'Space' || e.code === 'Enter')) { this.startGame(); return; }
            if (this.state === 'gameover' && (e.code === 'Space' || e.code === 'Enter')) { this.state = 'menu'; return; }
            if (this.state === 'question') {
                const n = parseInt(e.code.replace('Digit', ''));
                if (n >= 1 && n <= 4) this.selectAnswer(n - 1);
                return;
            }
            if (this.state === 'playing') {
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.switchLane(-1);
                if (e.code === 'ArrowRight' || e.code === 'KeyD') this.switchLane(1);
                if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') this.jump();
                if (e.code === 'ArrowDown' || e.code === 'KeyS') this.slide();
                if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyX') this.dash();
            }
        };
        if (this._kh) document.removeEventListener('keydown', this._kh);
        this._kh = handleKey;
        document.addEventListener('keydown', this._kh);

        this.canvas.addEventListener('click', (e) => {
            if (this.state === 'menu') { this.startGame(); return; }
            if (this.state === 'gameover') { this.state = 'menu'; return; }
            if (this.state === 'question') this.handleQuestionClick(e);
        });

        let tx = 0, ty = 0;
        this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); tx = e.touches[0].clientX; ty = e.touches[0].clientY; if (this.state === 'menu') this.startGame(); if (this.state === 'gameover') this.state = 'menu'; }, { passive: false });
        this.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (this.state !== 'playing') return; const dx = e.touches[0].clientX - tx, dy = e.touches[0].clientY - ty; if (Math.abs(dx) > 40) { this.switchLane(dx > 0 ? 1 : -1); tx = e.touches[0].clientX; } if (dy < -50) { this.jump(); ty = e.touches[0].clientY; } if (dy > 50) { this.slide(); ty = e.touches[0].clientY; } }, { passive: false });
        window.addEventListener('resize', () => this.resize());
    }

    switchLane(dir) {
        const nl = this.targetLane + dir;
        if (nl >= 0 && nl < 3) { this.targetLane = nl; this.addParticles(this.getLaneX(this.currentLane), this.height - 100, 10, '#a855f7'); }
    }

    jump() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.isJumping = true;
            this.player.jumpVelocity = 24;
            this.player.canDoubleJump = true;
            this.addParticles(this.getLaneX(this.currentLane), this.height - 60, 18, '#06b6d4');
        } else if (this.player.isJumping && this.player.canDoubleJump) {
            this.player.jumpVelocity = 20;
            this.player.canDoubleJump = false;
            this.addParticles(this.getLaneX(this.currentLane), this.height - 60 - this.player.jumpHeight, 25, '#22c55e');
            this.addFloatingText(this.getLaneX(this.currentLane), this.height - 150, 'DOUBLE JUMP!', '#22c55e');
        }
    }

    slide() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.isSliding = true;
            this.player.slideTimer = 50;
            this.addParticles(this.getLaneX(this.currentLane), this.height - 40, 12, '#f59e0b');
        }
    }

    dash() {
        if (this.player.dashCooldown <= 0 && !this.player.isDashing) {
            this.player.isDashing = true;
            this.player.dashTimer = 15;
            this.player.dashCooldown = 120;
            this.player.invincible = Math.max(this.player.invincible, 20);
            this.addFloatingText(this.getLaneX(this.currentLane), this.height - 200, 'DASH!', '#f472b6');
            for (let i = 0; i < 30; i++) this.addParticles(this.getLaneX(this.currentLane), this.height - 80, 1, '#f472b6');
            this.addParticles(this.getLaneX(this.currentLane), this.height - 40, 10, '#f59e0b');
        }
    }

    addParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            this.particles.push({ x, y, vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12 - 5, size: 3 + Math.random() * 6, life: 40, color });
        }
    }

    addFloatingText(x, y, text, color) {
        this.floatingTexts.push({ x, y, text, color, life: 60, vy: -2 });
    }

    spawnConfetti(count) {
        const colors = ['#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#6366f1', '#d946ef', '#f472b6'];
        for (let i = 0; i < count; i++) {
            this.confetti.push({
                x: this.centerX + (Math.random() - 0.5) * 400,
                y: this.height * 0.3,
                vx: (Math.random() - 0.5) * 8,
                vy: -8 - Math.random() * 6,
                size: 6 + Math.random() * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                spin: (Math.random() - 0.5) * 15,
                life: 120 + Math.random() * 60
            });
        }
    }

    getLaneX(lane) { return this.centerX + (lane - 1) * this.laneWidth; }

    startGame() {
        this.state = 'playing';
        this.score = 0; this.coins = 0; this.lives = 3; this.streak = 0; this.multiplier = 1;
        this.distance = 0; this.speed = 1; this.currentLane = 1; this.targetLane = 1;
        this.combo = 0; this.comboTimer = 0; this.level = 1;
        this.obstacles = []; this.coins_arr = []; this.powerups = []; this.particles = []; this.floatingTexts = [];
        this.player.isJumping = false; this.player.isSliding = false; this.player.jumpHeight = 0;
        this.player.invincible = 0; this.player.shield = 0; this.player.magnet = 0; this.player.speedBoost = 0;
        this.player.trail = []; this.player.canDoubleJump = true;
        this.lastObstacle = 0; this.nextQuestionAt = this.questionDistance;
    }

    update(dt) {
        this.globalTime += dt;
        if (this.shake > 0) this.shake *= 0.85;
        if (this.flash) { this.flash.timer--; if (this.flash.timer <= 0) this.flash = null; }
        if (this.player.invincible > 0) this.player.invincible--;
        if (this.player.shield > 0) this.player.shield--;
        if (this.player.magnet > 0) this.player.magnet--;
        if (this.player.speedBoost > 0) this.player.speedBoost--;
        if (this.comboTimer > 0) { this.comboTimer--; if (this.comboTimer <= 0) this.combo = 0; }
        if (this.player.dashCooldown > 0) this.player.dashCooldown--;
        if (this.player.dashTimer > 0) { this.player.dashTimer--; if (this.player.dashTimer <= 0) this.player.isDashing = false; }
        if (this.newAchievement) { this.newAchievement.timer--; if (this.newAchievement.timer <= 0) this.newAchievement = null; }

        // Weather system
        this.weatherTimer--;
        if (this.weatherTimer <= 0) {
            const weathers = ['clear', 'clear', 'clear', 'rain', 'snow'];
            this.weather = weathers[Math.floor(Math.random() * weathers.length)];
            this.weatherTimer = 1800 + Math.random() * 1800;
        }
        if (this.weather === 'rain') {
            if (this.raindrops.length < 100) this.raindrops.push({ x: Math.random() * this.width, y: -10, speed: 8 + Math.random() * 6 });
            this.raindrops = this.raindrops.filter(r => { r.y += r.speed; r.x -= 2; return r.y < this.height; });
        } else { this.raindrops = []; }
        if (this.weather === 'snow') {
            if (this.snowflakes.length < 80) this.snowflakes.push({ x: Math.random() * this.width, y: -10, speed: 1 + Math.random() * 2, wobble: Math.random() * 6.28 });
            this.snowflakes = this.snowflakes.filter(s => { s.y += s.speed; s.x += Math.sin(s.wobble += 0.05) * 0.5; return s.y < this.height; });
        } else { this.snowflakes = []; }

        this.particles = this.particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life--; p.size *= 0.94; return p.life > 0; });
        this.floatingTexts = this.floatingTexts.filter(t => { t.y += t.vy; t.life--; return t.life > 0; });

        // Update stars
        this.stars.forEach(s => { s.x -= s.speed * this.speed; s.twinkle += 0.05; if (s.x < 0) s.x = this.width + 100; });

        // Fever mode & coin rush
        if (this.feverTimer > 0) { this.feverTimer--; if (this.feverTimer <= 0) { this.feverMode = false; this.addFloatingText(this.centerX, 200, 'FEVER ENDED', '#f472b6'); } }
        if (this.coinRushTimer > 0) { this.coinRushTimer--; if (this.coinRushTimer <= 0) { this.coinRush = false; } }

        const bSpeed = this.speed * (this.player.speedBoost > 0 ? 1.5 : 1);
        this.buildings.forEach(b => { b.x -= bSpeed * 0.35; if (b.x < -b.width - 50) { b.x = this.width + Math.random() * 100; b.height = 60 + Math.random() * 280; b.lit = Math.random() > 0.25; } });

        if (this.state !== 'playing') return;

        const speedMod = this.player.speedBoost > 0 ? 1.5 : 1;
        const feverMod = this.feverMode ? 1.3 : 1;
        if (this.speed < this.maxSpeed) this.speed += 0.00015;
        this.distance += this.speed * speedMod * 8;
        this.score = Math.floor(this.distance / 10) * this.multiplier * (this.feverMode ? 2 : 1);

        // Trigger fever mode on high combo
        if (this.combo >= 15 && !this.feverMode) {
            this.feverMode = true;
            this.feverTimer = 600; // 10 seconds
            this.addFloatingText(this.centerX, this.height / 2 - 50, '🔥 FEVER MODE! 🔥', '#f472b6');
            this.flash = { color: '#f472b6', timer: 25 };
            this.unlockAchievement('fever', 'On Fire! - Activate Fever Mode');
        }

        // Random coin rush event
        if (Math.random() < 0.0003 && !this.coinRush && this.distance > 5000) {
            this.coinRush = true;
            this.coinRushTimer = 300;
            this.addFloatingText(this.centerX, 150, '💰 COIN RUSH! 💰', '#fbbf24');
        }

        // Time of day progression (changes based on distance)
        if (this.distance < 15000) this.timeOfDay = 'dawn';
        else if (this.distance < 40000) this.timeOfDay = 'day';
        else if (this.distance < 70000) this.timeOfDay = 'dusk';
        else this.timeOfDay = 'night';

        // Update confetti
        this.confetti = this.confetti.filter(c => {
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.15;
            c.rotation += c.spin;
            c.life--;
            return c.life > 0 && c.y < this.height + 50;
        });

        // Level progression
        const newLevel = Math.floor(this.distance / 10000) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.addFloatingText(this.centerX, this.height / 2, `🎉 LEVEL ${this.level}! 🎉`, '#fbbf24');
            this.flash = { color: '#fbbf24', timer: 20 };
            this.spawnConfetti(60); // Celebration!
            if (this.level > this.stats.highestLevel) this.stats.highestLevel = this.level;
            if (this.level === 2) this.unlockAchievement('level2', 'Warming Up - Reach Level 2');
            if (this.level === 3) this.unlockAchievement('level3', 'Getting Serious - Reach Level 3');
            if (this.level === 5) this.unlockAchievement('level5', 'Expert Runner - Reach Level 5');
            if (this.level === 10) this.unlockAchievement('level10', 'Legendary - Reach Level 10');
        }

        this.currentLane += (this.targetLane - this.currentLane) * 0.2;

        // Player trail
        if (this.state === 'playing') {
            this.player.trail.push({ x: this.getLaneX(this.currentLane), y: this.height - 45 - this.player.jumpHeight, alpha: 1 });
            if (this.player.trail.length > 12) this.player.trail.shift();
            this.player.trail.forEach(t => t.alpha *= 0.85);
        }

        if (this.player.isJumping) {
            this.player.jumpHeight += this.player.jumpVelocity;
            this.player.jumpVelocity -= 1.1;
            if (this.player.jumpHeight <= 0) { this.player.jumpHeight = 0; this.player.isJumping = false; this.player.canDoubleJump = true; }
        }
        if (this.player.isSliding) { this.player.slideTimer--; if (this.player.slideTimer <= 0) this.player.isSliding = false; }
        this.player.animFrame = (this.player.animFrame + 0.4) % 8;

        if (this.distance - this.lastObstacle > this.obstacleGap / this.speed) { this.spawnObstacle(); this.lastObstacle = this.distance; }
        const coinRate = this.coinRush ? 0.08 : (this.feverMode ? 0.04 : 0.018);
        if (Math.random() < coinRate) this.spawnCoin();
        if (Math.random() < 0.004) this.spawnPowerup();

        this.updateObstacles();
        this.updateCoins();
        this.updatePowerups();

        if (this.distance >= this.nextQuestionAt) {
            this.triggerQuestion();
            this.nextQuestionAt += this.questionIncrement + Math.floor(this.distance / 2500) * 600;
        }
    }

    spawnObstacle() {
        const lane = Math.floor(Math.random() * 3);
        const types = ['low', 'high', 'low', 'low', 'high'];
        if (this.level >= 3 && Math.random() > 0.7) types.push('moving');
        const type = types[Math.floor(Math.random() * types.length)];
        this.obstacles.push({ lane, z: 2200, type, hit: false, moveDir: Math.random() > 0.5 ? 1 : -1 });
    }

    spawnCoin() {
        const lane = Math.floor(Math.random() * 3);
        this.coins_arr.push({ lane, z: 2200, elevated: Math.random() > 0.45, collected: false, bob: Math.random() * 6.28 });
    }

    spawnPowerup() {
        const lane = Math.floor(Math.random() * 3);
        const types = ['shield', 'magnet', 'speed', 'heart'];
        if (this.level >= 2) types.push('coin_burst');
        this.powerups.push({ lane, z: 2200, type: types[Math.floor(Math.random() * types.length)], collected: false, bob: Math.random() * 6.28 });
    }

    updateObstacles() {
        const speedMod = this.player.speedBoost > 0 ? 1.5 : 1;
        this.obstacles = this.obstacles.filter(obs => {
            obs.z -= this.speed * speedMod * 22;
            if (obs.type === 'moving' && obs.z < 1500) {
                obs.lane += obs.moveDir * 0.02;
                if (obs.lane <= 0 || obs.lane >= 2) obs.moveDir *= -1;
            }
            if (obs.z < 130 && obs.z > -60 && !obs.hit) {
                if (Math.abs(obs.lane - this.currentLane) < 0.6) {
                    let hit = false;
                    if (obs.type === 'high' && !this.player.isSliding) hit = true;
                    else if ((obs.type === 'low' || obs.type === 'moving') && this.player.jumpHeight < 80) hit = true;
                    if (hit && this.player.invincible <= 0 && this.player.shield <= 0) { this.hitObstacle(); obs.hit = true; }
                    else if (hit && this.player.shield > 0) { this.player.shield = 0; this.flash = { color: '#06b6d4', timer: 12 }; this.addParticles(this.getLaneX(Math.round(obs.lane)), this.height - 150, 25, '#06b6d4'); obs.hit = true; }
                }
            }
            return obs.z > -500;
        });
    }

    updateCoins() {
        const speedMod = this.player.speedBoost > 0 ? 1.5 : 1;
        const magnetRange = this.player.magnet > 0 ? 2.5 : 0;
        this.coins_arr = this.coins_arr.filter(c => {
            c.z -= this.speed * speedMod * 22; c.bob += 0.14;
            if (magnetRange > 0 && c.z < 600) c.lane += (this.currentLane - c.lane) * 0.12;
            if (c.z < 130 && c.z > -60 && !c.collected && Math.abs(c.lane - this.currentLane) < 0.7) {
                if (!c.elevated || this.player.jumpHeight > 60) {
                    c.collected = true; this.coins++; this.totalCoins++;
                    this.combo++; this.comboTimer = 120;
                    const bonus = this.combo >= 10 ? 3 : this.combo >= 5 ? 2 : 1;
                    this.coins += bonus - 1;
                    if (this.combo === 5) this.addFloatingText(this.getLaneX(Math.round(c.lane)), this.height - 200, 'COMBO x2!', '#fbbf24');
                    if (this.combo === 10) this.addFloatingText(this.getLaneX(Math.round(c.lane)), this.height - 200, 'COMBO x3!', '#ef4444');
                    localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
                    this.addParticles(this.getLaneX(Math.round(c.lane)), this.height - 180, 15, '#fbbf24');
                }
            }
            return c.z > -500 && !c.collected;
        });
    }

    updatePowerups() {
        const speedMod = this.player.speedBoost > 0 ? 1.5 : 1;
        this.powerups = this.powerups.filter(p => {
            p.z -= this.speed * speedMod * 22; p.bob += 0.12;
            if (p.z < 130 && p.z > -60 && !p.collected && Math.abs(p.lane - this.currentLane) < 0.7) {
                p.collected = true; this.collectPowerup(p.type, p.lane);
                this.addParticles(this.getLaneX(p.lane), this.height - 200, 25, this.getPowerupColor(p.type));
            }
            return p.z > -500 && !p.collected;
        });
    }

    collectPowerup(type, lane) {
        this.flash = { color: this.getPowerupColor(type), timer: 15 };
        const icons = { shield: '🛡️', magnet: '🧲', speed: '⚡', heart: '❤️', coin_burst: '💰' };
        this.addFloatingText(this.getLaneX(lane), this.height - 250, icons[type], this.getPowerupColor(type));

        switch (type) {
            case 'shield': this.player.shield = 700; break;
            case 'magnet': this.player.magnet = 700; break;
            case 'speed': this.player.speedBoost = 400; break;
            case 'heart': if (this.lives < 5) this.lives++; break;
            case 'coin_burst':
                for (let i = 0; i < 8; i++) { this.coins_arr.push({ lane: Math.random() * 2, z: 800 + i * 80, elevated: false, collected: false, bob: Math.random() * 6.28 }); }
                break;
        }
    }

    getPowerupColor(type) {
        return { shield: '#06b6d4', magnet: '#a855f7', speed: '#22c55e', heart: '#ef4444', coin_burst: '#fbbf24' }[type] || '#fff';
    }

    hitObstacle() {
        this.lives--; this.streak = 0; this.multiplier = 1; this.combo = 0; this.shake = 25;
        this.flash = { color: '#ef4444', timer: 20 }; this.player.invincible = 120;
        this.addParticles(this.getLaneX(Math.round(this.currentLane)), this.height - 120, 40, '#ef4444');
        if (this.lives <= 0) this.gameOver();
    }

    gameOver() {
        this.state = 'gameover';
        if (this.score > this.highScore) { this.highScore = this.score; localStorage.setItem('anatomyRush2025HS', this.highScore); }
        if (typeof awardXP === 'function') awardXP(Math.floor(this.score / 10), 'game');
    }

    triggerQuestion() {
        this.state = 'question'; this.questionTimer = this.questionTimeLimit * 60;
        this.selectedAnswer = -1; this.questionResult = null;

        // ATI-aligned MSK questions
        const atiQuestions = [
            { q: "What are the 6 P's of compartment syndrome?", opts: ["Pain, Pressure, Paralysis, Paresthesia, Pallor, Pulselessness", "Pain, Pallor, Pulse, Pressure, Paralysis, Paresis", "Pain, Puffiness, Paralysis, Paresthesia, Pallor, Pressure", "Pain, Paralysis, Paresthesia, Pulse, Perfusion, Pallor"], ans: 0 },
            { q: "Priority intervention for suspected compartment syndrome?", opts: ["Notify surgeon immediately", "Elevate the extremity", "Apply ice packs", "Administer analgesics"], ans: 0 },
            { q: "After hip replacement, which position should be avoided?", opts: ["Hip flexion greater than 90 degrees", "Hip extension", "Slight abduction", "Neutral rotation"], ans: 0 },
            { q: "When does fat embolism typically occur after long bone fracture?", opts: ["12-72 hours", "Immediately", "1 week later", "2-4 hours"], ans: 0 },
            { q: "Signs of fat embolism include:", opts: ["Petechiae, confusion, dyspnea", "Fever and chills only", "Localized swelling", "Bradycardia"], ans: 0 },
            { q: "Priority assessment for a client in skeletal traction?", opts: ["Pin sites for infection", "Blood pressure", "Urinary output", "Appetite"], ans: 0 },
            { q: "Which medication requires the client to remain upright for 30 min?", opts: ["Alendronate (Fosamax)", "Calcium carbonate", "Ibuprofen", "Acetaminophen"], ans: 0 },
            { q: "Key difference between osteoarthritis and rheumatoid arthritis?", opts: ["OA pain worsens with activity; RA has morning stiffness", "OA is symmetric; RA is not", "OA is autoimmune; RA is degenerative", "OA affects young people; RA affects elderly"], ans: 0 },
            { q: "After cast application, the nurse should assess for:", opts: ["Pallor, pulselessness, paresthesia", "Weight gain", "Increased appetite", "Dry skin only"], ans: 0 },
            { q: "DVT prevention after joint replacement includes:", opts: ["Early ambulation and anticoagulants", "Bed rest for 1 week", "Hot compresses to legs", "Crossing legs while sitting"], ans: 0 },
            { q: "Heberden's nodes are found in which condition?", opts: ["Osteoarthritis", "Rheumatoid arthritis", "Gout", "Osteoporosis"], ans: 0 },
            { q: "Dietary teaching for osteoporosis prevention includes:", opts: ["High calcium and vitamin D", "Low protein diet", "Sodium restriction", "Fluid restriction"], ans: 0 },
            { q: "After laminectomy, the client should:", opts: ["Log roll when turning", "Sit up immediately", "Twist at the waist", "Sleep prone"], ans: 0 },
            { q: "Traction weight should:", opts: ["Hang freely without touching the floor", "Rest on the floor at night", "Be removed for bathing", "Be increased if pain persists"], ans: 0 },
            { q: "Client teaching for crutch walking includes:", opts: ["Bear weight on hands, not axillae", "Bear weight on axillae", "Keep elbows straight", "Look at feet while walking"], ans: 0 },
            { q: "Phantom limb pain is:", opts: ["Real pain sensation requiring treatment", "Imaginary and needs no treatment", "Sign of infection", "Only psychological"], ans: 0 },
            { q: "After total knee replacement, the priority is:", opts: ["Continuous passive motion as ordered", "Immediate full weight bearing", "Ice for 1 hour continuously", "Keeping knee fully extended always"], ans: 0 },
            { q: "Buck's traction is used for:", opts: ["Hip fractures to reduce muscle spasm", "Cervical spine injuries", "Upper extremity fractures", "Pelvic fractures only"], ans: 0 },
            { q: "Positive Phalen's test indicates:", opts: ["Carpal tunnel syndrome", "Compartment syndrome", "DVT", "Fracture"], ans: 0 },
            { q: "For a client with gout, which food should be avoided?", opts: ["Organ meats and alcohol", "Dairy products", "Fresh vegetables", "Whole grains"], ans: 0 }
        ];

        const q = atiQuestions[Math.floor(Math.random() * atiQuestions.length)];
        const shuffledOpts = [...q.opts];
        const correctText = q.opts[q.ans];
        // Shuffle options
        for (let i = shuffledOpts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOpts[i], shuffledOpts[j]] = [shuffledOpts[j], shuffledOpts[i]];
        }
        this.currentQuestion = { text: q.q, options: shuffledOpts, correct: correctText };
    }

    shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

    selectAnswer(idx) {
        if (this.questionResult !== null || idx >= this.currentQuestion.options.length) return;
        this.selectedAnswer = idx;
        const correct = this.currentQuestion.options[idx] === this.currentQuestion.correct;
        this.questionsAnswered++;

        // Track question for review
        this.questionHistory.push({
            question: this.currentQuestion.text,
            userAnswer: this.currentQuestion.options[idx],
            correctAnswer: this.currentQuestion.correct,
            correct: correct
        });

        if (correct) {
            this.questionResult = 'correct'; this.streak++; this.questionsCorrectRun++;
            this.multiplier = Math.min(5, 1 + Math.floor(this.streak / 2));
            const reward = 25 * this.multiplier;
            this.coins += reward; this.totalCoins += reward;
            localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
            this.flash = { color: '#22c55e', timer: 20 };

            // Achievements
            if (this.questionsCorrectRun === 3) this.unlockAchievement('scholar', 'Scholar - 3 correct in a row');
            if (this.questionsCorrectRun === 5) this.unlockAchievement('genius', 'Genius - 5 correct in a row');
        } else {
            this.questionResult = 'wrong'; this.lives--; this.streak = 0; this.multiplier = 1;
            this.shake = 18; this.flash = { color: '#ef4444', timer: 18 };
            this.perfectRun = false;
            if (this.lives <= 0) { setTimeout(() => this.gameOver(), 900); return; }
        }
        setTimeout(() => { this.state = 'playing'; this.currentQuestion = null; }, 1100);
    }

    handleQuestionClick(e) {
        if (!this.currentQuestion || this.questionResult !== null) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.width / rect.width);
        const y = (e.clientY - rect.top) * (this.height / rect.height);
        const startY = this.height * 0.28, optH = 60, gap = 18, margin = this.width * 0.06;
        for (let i = 0; i < this.currentQuestion.options.length; i++) {
            const oY = startY + i * (optH + gap);
            if (x >= margin && x <= this.width - margin && y >= oY && y <= oY + optH) { this.selectAnswer(i); break; }
        }
    }

    render() {
        this.ctx.save();
        if (this.shake > 0) this.ctx.translate((Math.random() - 0.5) * this.shake * 2.5, (Math.random() - 0.5) * this.shake * 2.5);
        this.drawBackground();
        this.drawWeather();
        this.drawRoad();
        this.drawObstacles();
        this.drawCoins();
        this.drawPowerups();
        this.drawPlayerTrail();
        this.drawPlayer();
        this.drawParticles();
        this.drawFloatingTexts();
        this.drawConfetti();
        if (this.state === 'playing') { this.drawHUD(); this.drawAchievement(); }
        else if (this.state === 'menu') this.drawMenu();
        else if (this.state === 'question') this.drawQuestion();
        else if (this.state === 'gameover') this.drawGameOver();
        if (this.flash) { this.ctx.fillStyle = this.flash.color; this.ctx.globalAlpha = this.flash.timer / 30; this.ctx.fillRect(0, 0, this.width, this.height); this.ctx.globalAlpha = 1; }
        this.ctx.restore();
    }

    drawConfetti() {
        this.confetti.forEach(c => {
            this.ctx.save();
            this.ctx.translate(c.x, c.y);
            this.ctx.rotate(c.rotation * Math.PI / 180);
            this.ctx.globalAlpha = Math.min(1, c.life / 30);
            this.ctx.fillStyle = c.color;
            this.ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
            this.ctx.restore();
        });
        this.ctx.globalAlpha = 1;
    }

    drawWeather() {
        if (this.weather === 'rain') {
            this.ctx.strokeStyle = 'rgba(100, 150, 255, 0.5)';
            this.ctx.lineWidth = 1.5;
            this.raindrops.forEach(r => {
                this.ctx.beginPath();
                this.ctx.moveTo(r.x, r.y);
                this.ctx.lineTo(r.x - 4, r.y + 12);
                this.ctx.stroke();
            });
        }
        if (this.weather === 'snow') {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.snowflakes.forEach(s => {
                this.ctx.beginPath();
                this.ctx.arc(s.x, s.y, 2 + Math.sin(s.wobble) * 1, 0, Math.PI * 2);
                this.ctx.fill();
            });
        }
    }

    drawAchievement() {
        if (this.newAchievement) {
            const a = this.newAchievement;
            this.ctx.globalAlpha = Math.min(1, a.timer / 30);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            this.ctx.beginPath();
            this.ctx.roundRect(this.centerX - 180, 80, 360, 70, 15);
            this.ctx.fill();
            this.ctx.strokeStyle = '#fbbf24';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.font = 'bold 22px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🏆 ACHIEVEMENT!', this.centerX, 108);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '18px Arial';
            this.ctx.fillText(a.name, this.centerX, 135);
            this.ctx.globalAlpha = 1;
        }
    }

    unlockAchievement(id, name) {
        if (this.achievements[id]) return;
        this.achievements[id] = true;
        localStorage.setItem('anatomyAchievements', JSON.stringify(this.achievements));
        this.newAchievement = { id, name, timer: 180 };
    }

    drawBackground() {
        // Sky gradient - time of day with fever mode override
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        if (this.feverMode) {
            grad.addColorStop(0, '#1a0a2e'); grad.addColorStop(0.3, '#2d1b4e'); grad.addColorStop(0.65, '#4a1942'); grad.addColorStop(1, '#6b2d5b');
        } else if (this.timeOfDay === 'dawn') {
            grad.addColorStop(0, '#0c1445'); grad.addColorStop(0.3, '#1e3a5f'); grad.addColorStop(0.6, '#f97316'); grad.addColorStop(1, '#fbbf24');
        } else if (this.timeOfDay === 'day') {
            grad.addColorStop(0, '#0369a1'); grad.addColorStop(0.4, '#0ea5e9'); grad.addColorStop(0.7, '#7dd3fc'); grad.addColorStop(1, '#bae6fd');
        } else if (this.timeOfDay === 'dusk') {
            grad.addColorStop(0, '#1e1b4b'); grad.addColorStop(0.3, '#581c87'); grad.addColorStop(0.6, '#f97316'); grad.addColorStop(1, '#fbbf24');
        } else { // night
            grad.addColorStop(0, '#020617'); grad.addColorStop(0.3, '#0f172a'); grad.addColorStop(0.65, '#1e1b4b'); grad.addColorStop(1, '#312e81');
        }
        this.ctx.fillStyle = grad; this.ctx.fillRect(0, 0, this.width, this.height);

        // Parallax stars
        this.stars.forEach(s => {
            this.ctx.globalAlpha = 0.4 + Math.sin(s.twinkle) * 0.4;
            this.ctx.fillStyle = this.feverMode ? '#f472b6' : '#fff';
            this.ctx.beginPath(); this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;

        // City skyline
        this.buildings.forEach(b => {
            this.ctx.fillStyle = `hsl(${b.hue}, 22%, 8%)`;
            const by = this.height * 0.38 - b.height;
            this.ctx.fillRect(b.x, by, b.width, b.height);
            this.ctx.fillStyle = `hsl(${b.hue}, 18%, 12%)`; this.ctx.fillRect(b.x + 4, by - 6, b.width - 8, 6);
            if (b.lit) {
                const ww = 6, wh = 9, gx = 11, gy = 14;
                for (let row = 0; row < Math.floor(b.height / gy) - 1; row++) {
                    for (let col = 0; col < b.windows; col++) {
                        if (Math.sin(this.globalTime * 0.0008 + b.x * 0.08 + row + col) > -0.4) {
                            const wColor = this.feverMode ? 'rgba(244, 114, 182, 0.5)' : `rgba(255, 210, 120, ${0.35 + Math.random() * 0.2})`;
                            this.ctx.fillStyle = wColor;
                            this.ctx.fillRect(b.x + 5 + col * gx, by + 10 + row * gy, ww, wh);
                        }
                    }
                }
            }
        });

        // Atmosphere glow
        const hg = this.ctx.createRadialGradient(this.centerX, this.height * 0.4, 0, this.centerX, this.height * 0.4, this.width * 0.6);
        if (this.feverMode) {
            hg.addColorStop(0, 'rgba(244, 114, 182, 0.35)'); hg.addColorStop(0.6, 'rgba(219, 39, 119, 0.12)'); hg.addColorStop(1, 'transparent');
        } else {
            hg.addColorStop(0, 'rgba(139, 92, 246, 0.28)'); hg.addColorStop(0.6, 'rgba(168, 85, 247, 0.08)'); hg.addColorStop(1, 'transparent');
        }
        this.ctx.fillStyle = hg; this.ctx.fillRect(0, 0, this.width, this.height);

        // Fever mode screen border
        if (this.feverMode) {
            const borderGrad = this.ctx.createLinearGradient(0, 0, this.width, 0);
            borderGrad.addColorStop(0, 'rgba(244, 114, 182, 0.6)');
            borderGrad.addColorStop(0.5, 'rgba(244, 114, 182, 0.1)');
            borderGrad.addColorStop(1, 'rgba(244, 114, 182, 0.6)');
            this.ctx.fillStyle = borderGrad;
            this.ctx.fillRect(0, 0, this.width, 6);
            this.ctx.fillRect(0, this.height - 6, this.width, 6);
            this.ctx.fillStyle = 'rgba(244, 114, 182, 0.5)';
            this.ctx.fillRect(0, 0, 6, this.height);
            this.ctx.fillRect(this.width - 6, 0, 6, this.height);
        }
    }

    drawRoad() {
        const horizonY = this.height * 0.4, roadW = 540, segs = 55;
        for (let i = segs; i >= 0; i--) {
            const z = i / segs, nz = (i + 1) / segs;
            const p = 1 / (1 + z * 5), np = 1 / (1 + nz * 5);
            const y = horizonY + (this.height - horizonY) * (1 - Math.pow(z, 0.55));
            const ny = horizonY + (this.height - horizonY) * (1 - Math.pow(nz, 0.55));
            const w = roadW * p, nw = roadW * np;
            const stripe = Math.floor((i + this.distance / 20) % 4) < 2;
            this.ctx.fillStyle = stripe ? '#18181b' : '#0f0f12';
            this.ctx.beginPath(); this.ctx.moveTo(this.centerX - nw, ny); this.ctx.lineTo(this.centerX + nw, ny); this.ctx.lineTo(this.centerX + w, y); this.ctx.lineTo(this.centerX - w, y); this.ctx.closePath(); this.ctx.fill();
            if (i < segs - 1 && i % 2 === 0) {
                this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.5 * (1 - z)})`; this.ctx.lineWidth = 3 * p;
                for (let lane = 0; lane < 2; lane++) { const lo = (lane - 0.5) * this.laneWidth; this.ctx.beginPath(); this.ctx.moveTo(this.centerX + lo * np, ny); this.ctx.lineTo(this.centerX + lo * p, y); this.ctx.stroke(); }
            }
        }
        this.ctx.shadowColor = '#d946ef'; this.ctx.shadowBlur = 35; this.ctx.strokeStyle = '#d946ef'; this.ctx.lineWidth = 6;
        this.ctx.beginPath(); this.ctx.moveTo(this.centerX - 120, horizonY); this.ctx.lineTo(this.centerX - roadW - 40, this.height); this.ctx.stroke();
        this.ctx.beginPath(); this.ctx.moveTo(this.centerX + 120, horizonY); this.ctx.lineTo(this.centerX + roadW + 40, this.height); this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    drawObstacles() {
        const horizonY = this.height * 0.4;
        [...this.obstacles].sort((a, b) => b.z - a.z).forEach(obs => {
            if (obs.z < 0 || obs.z > 2200) return;
            const zn = obs.z / 2200, p = 1 / (1 + zn * 5);
            const y = horizonY + (this.height - horizonY) * (1 - Math.pow(zn, 0.55));
            const x = this.centerX + (obs.lane - 1) * this.laneWidth * p;
            const w = 80 * p, h = (obs.type === 'high' ? 55 : 105) * p;
            this.ctx.save();
            const color = obs.type === 'moving' ? '#a855f7' : obs.type === 'high' ? '#f59e0b' : '#ef4444';
            this.ctx.shadowColor = color; this.ctx.shadowBlur = 28 * p;
            if (obs.type === 'high') {
                const hy = y - 90 * p;
                this.ctx.fillStyle = '#92400e'; this.ctx.fillRect(x - w / 2 + 6 * p, hy - h + 6 * p, w, h);
                this.ctx.fillStyle = '#f59e0b'; this.ctx.fillRect(x - w / 2, hy - h, w, h);
                this.ctx.fillStyle = '#451a03'; for (let s = 0; s < 4; s++) this.ctx.fillRect(x - w / 2 + s * w / 4, hy - h, w / 8, h);
            } else {
                this.ctx.fillStyle = obs.type === 'moving' ? '#581c87' : '#7f1d1d';
                this.ctx.fillRect(x - w / 2 + 6 * p, y - h + 6 * p, w - 6 * p, h - 12 * p);
                this.ctx.fillStyle = color; this.ctx.fillRect(x - w / 2, y - h, w - 6 * p, h - 12 * p);
                this.ctx.fillStyle = obs.type === 'moving' ? '#2e1065' : '#450a0a';
                for (let s = 0; s < 4; s++) this.ctx.fillRect(x - w / 2 + s * w / 4, y - h, w / 8, h - 12 * p);
            }
            this.ctx.restore();
        });
    }

    drawCoins() {
        const horizonY = this.height * 0.4;
        this.coins_arr.forEach(c => {
            if (c.collected || c.z < 0 || c.z > 2200) return;
            const zn = c.z / 2200, p = 1 / (1 + zn * 5);
            const baseY = horizonY + (this.height - horizonY) * (1 - Math.pow(zn, 0.55));
            const x = this.centerX + (c.lane - 1) * this.laneWidth * p;
            const y = baseY - (55 + (c.elevated ? 100 : 0)) * p + Math.sin(c.bob) * 7 * p;
            this.ctx.save(); this.ctx.shadowColor = '#fbbf24'; this.ctx.shadowBlur = 22 * p;
            this.ctx.fillStyle = '#fbbf24'; this.ctx.beginPath(); this.ctx.arc(x, y, 20 * p, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = '#92400e'; this.ctx.font = `bold ${18 * p}px Arial`; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle'; this.ctx.fillText('$', x, y);
            this.ctx.restore();
        });
    }

    drawPowerups() {
        const horizonY = this.height * 0.4;
        const icons = { shield: '🛡️', magnet: '🧲', speed: '⚡', heart: '❤️', coin_burst: '💰' };
        this.powerups.forEach(p => {
            if (p.collected || p.z < 0 || p.z > 2200) return;
            const zn = p.z / 2200, per = 1 / (1 + zn * 5);
            const baseY = horizonY + (this.height - horizonY) * (1 - Math.pow(zn, 0.55));
            const x = this.centerX + (p.lane - 1) * this.laneWidth * per;
            const y = baseY - 90 * per + Math.sin(p.bob) * 10 * per;
            this.ctx.save(); this.ctx.shadowColor = this.getPowerupColor(p.type); this.ctx.shadowBlur = 30 * per;
            this.ctx.fillStyle = this.getPowerupColor(p.type); this.ctx.globalAlpha = 0.35;
            this.ctx.beginPath(); this.ctx.arc(x, y, 32 * per, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.globalAlpha = 1; this.ctx.font = `${32 * per}px Arial`; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
            this.ctx.fillText(icons[p.type], x, y); this.ctx.restore();
        });
    }

    drawPlayerTrail() {
        if (this.player.speedBoost > 0) {
            this.player.trail.forEach((t, i) => {
                this.ctx.globalAlpha = t.alpha * 0.4;
                this.ctx.fillStyle = '#22c55e';
                this.ctx.beginPath(); this.ctx.arc(t.x, t.y, 15 - i, 0, Math.PI * 2); this.ctx.fill();
            });
            this.ctx.globalAlpha = 1;
        }
    }

    drawPlayer() {
        const x = this.getLaneX(this.currentLane), groundY = this.height - 45, y = groundY - this.player.jumpHeight;
        if (this.player.invincible > 0 && Math.floor(this.player.invincible / 6) % 2 === 0) this.ctx.globalAlpha = 0.5;
        this.ctx.save(); this.ctx.translate(x, y);

        // Dynamic glow based on power-ups
        let glow = '#ec4899'; // Pink for female nurse
        if (this.player.shield > 0) glow = '#06b6d4';
        if (this.player.speedBoost > 0) glow = '#22c55e';
        if (this.player.magnet > 0) glow = '#a855f7';
        if (this.player.isDashing) glow = '#f472b6';
        this.ctx.shadowColor = glow; this.ctx.shadowBlur = 45;

        const bounce = this.player.isJumping ? 0 : Math.sin(this.player.animFrame * 0.6) * 5;
        const armSwing = Math.sin(this.player.animFrame * 0.8) * 28;
        const legSwing = Math.sin(this.player.animFrame * 0.8) * 24;
        const hairBounce = Math.sin(this.player.animFrame * 0.5) * 4;

        if (this.player.isSliding) {
            // Sliding pose - compressed female form
            this.ctx.fillStyle = '#06b6d4';
            this.ctx.beginPath(); this.ctx.ellipse(0, -18, 55, 22, 0, 0, Math.PI * 2); this.ctx.fill();
            // Head
            this.ctx.fillStyle = '#fcd9b8'; this.ctx.beginPath(); this.ctx.arc(30, -30, 20, 0, Math.PI * 2); this.ctx.fill();
            // Ponytail flowing back
            this.ctx.fillStyle = '#8b4513';
            this.ctx.beginPath(); this.ctx.ellipse(-15, -28, 30, 10, -0.3, 0, Math.PI * 2); this.ctx.fill();
        } else {
            // LEGS - slimmer feminine proportions
            this.ctx.fillStyle = '#0891b2';
            this.ctx.save(); this.ctx.translate(-12, -18 + bounce); this.ctx.rotate(legSwing * Math.PI / 180);
            this.ctx.fillRect(-7, 0, 14, 42);
            this.ctx.fillStyle = '#fff'; this.ctx.fillRect(-8, 38, 16, 12); // White shoes
            this.ctx.restore();

            this.ctx.fillStyle = '#0891b2';
            this.ctx.save(); this.ctx.translate(12, -18 + bounce); this.ctx.rotate(-legSwing * Math.PI / 180);
            this.ctx.fillRect(-7, 0, 14, 42);
            this.ctx.fillStyle = '#fff'; this.ctx.fillRect(-8, 38, 16, 12); // White shoes
            this.ctx.restore();

            // BODY - feminine scrubs with curves
            this.ctx.fillStyle = '#06b6d4';
            this.ctx.beginPath();
            this.ctx.moveTo(-22, -85 + bounce);
            this.ctx.quadraticCurveTo(-28, -50 + bounce, -20, -18 + bounce);
            this.ctx.lineTo(20, -18 + bounce);
            this.ctx.quadraticCurveTo(28, -50 + bounce, 22, -85 + bounce);
            this.ctx.closePath();
            this.ctx.fill();

            // V-neck detail
            this.ctx.strokeStyle = '#0e7490'; this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(-10, -85 + bounce);
            this.ctx.lineTo(0, -70 + bounce);
            this.ctx.lineTo(10, -85 + bounce);
            this.ctx.stroke();

            // ARMS - slimmer with skin tone hands
            this.ctx.save(); this.ctx.translate(-26, -75 + bounce); this.ctx.rotate(-armSwing * Math.PI / 180);
            this.ctx.fillStyle = '#06b6d4'; this.ctx.fillRect(-6, 0, 12, 30);
            this.ctx.fillStyle = '#fcd9b8'; this.ctx.beginPath(); this.ctx.arc(0, 34, 7, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.restore();

            this.ctx.save(); this.ctx.translate(26, -75 + bounce); this.ctx.rotate(armSwing * Math.PI / 180);
            this.ctx.fillStyle = '#06b6d4'; this.ctx.fillRect(-6, 0, 12, 30);
            this.ctx.fillStyle = '#fcd9b8'; this.ctx.beginPath(); this.ctx.arc(0, 34, 7, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.restore();

            // HEAD - feminine face
            this.ctx.fillStyle = '#fcd9b8';
            this.ctx.beginPath(); this.ctx.arc(0, -105 + bounce, 24, 0, Math.PI * 2); this.ctx.fill();

            // HAIR - brown ponytail
            this.ctx.fillStyle = '#8b4513';
            // Top hair
            this.ctx.beginPath();
            this.ctx.arc(0, -112 + bounce, 26, Math.PI, 0);
            this.ctx.fill();
            // Side bangs
            this.ctx.beginPath();
            this.ctx.ellipse(-18, -108 + bounce, 8, 14, -0.3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.ellipse(18, -108 + bounce, 8, 14, 0.3, 0, Math.PI * 2);
            this.ctx.fill();
            // Ponytail
            this.ctx.beginPath();
            this.ctx.moveTo(0, -128 + bounce);
            this.ctx.quadraticCurveTo(25 + hairBounce, -120 + bounce, 30 + hairBounce * 2, -90 + bounce);
            this.ctx.quadraticCurveTo(25, -100 + bounce, 5, -115 + bounce);
            this.ctx.fill();

            // Nurse cap
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.moveTo(-16, -130 + bounce);
            this.ctx.lineTo(16, -130 + bounce);
            this.ctx.lineTo(20, -140 + bounce);
            this.ctx.lineTo(0, -145 + bounce);
            this.ctx.lineTo(-20, -140 + bounce);
            this.ctx.closePath();
            this.ctx.fill();
            // Red cross on cap
            this.ctx.fillStyle = '#ef4444';
            this.ctx.fillRect(-4, -143 + bounce, 8, 12);
            this.ctx.fillRect(-8, -139 + bounce, 16, 4);

            // EYES - feminine with lashes
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath(); this.ctx.ellipse(-8, -108 + bounce, 7, 8, 0, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.beginPath(); this.ctx.ellipse(8, -108 + bounce, 7, 8, 0, 0, Math.PI * 2); this.ctx.fill();
            // Pupils
            this.ctx.fillStyle = '#3b82f6';
            this.ctx.beginPath(); this.ctx.arc(-7, -107 + bounce, 4, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.beginPath(); this.ctx.arc(9, -107 + bounce, 4, 0, Math.PI * 2); this.ctx.fill();
            // Eye highlights
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath(); this.ctx.arc(-5, -109 + bounce, 1.5, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.beginPath(); this.ctx.arc(11, -109 + bounce, 1.5, 0, Math.PI * 2); this.ctx.fill();
            // Eyelashes
            this.ctx.strokeStyle = '#1e293b'; this.ctx.lineWidth = 1.5;
            this.ctx.beginPath(); this.ctx.moveTo(-14, -112 + bounce); this.ctx.lineTo(-16, -116 + bounce); this.ctx.stroke();
            this.ctx.beginPath(); this.ctx.moveTo(-11, -114 + bounce); this.ctx.lineTo(-12, -118 + bounce); this.ctx.stroke();
            this.ctx.beginPath(); this.ctx.moveTo(14, -112 + bounce); this.ctx.lineTo(16, -116 + bounce); this.ctx.stroke();
            this.ctx.beginPath(); this.ctx.moveTo(11, -114 + bounce); this.ctx.lineTo(12, -118 + bounce); this.ctx.stroke();

            // Blush
            this.ctx.fillStyle = 'rgba(244, 114, 182, 0.4)';
            this.ctx.beginPath(); this.ctx.ellipse(-14, -100 + bounce, 5, 3, 0, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.beginPath(); this.ctx.ellipse(14, -100 + bounce, 5, 3, 0, 0, Math.PI * 2); this.ctx.fill();

            // Smile
            this.ctx.strokeStyle = '#be185d'; this.ctx.lineWidth = 2;
            this.ctx.beginPath(); this.ctx.arc(0, -98 + bounce, 8, 0.2, Math.PI - 0.2); this.ctx.stroke();

            // Stethoscope
            this.ctx.strokeStyle = '#374151'; this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(-6, -85 + bounce);
            this.ctx.quadraticCurveTo(-18, -55 + bounce, -5, -45 + bounce);
            this.ctx.stroke();
            this.ctx.fillStyle = '#6b7280';
            this.ctx.beginPath(); this.ctx.arc(-5, -42 + bounce, 7, 0, Math.PI * 2); this.ctx.fill();

            // Shield effect
            if (this.player.shield > 0) {
                this.ctx.strokeStyle = '#06b6d4'; this.ctx.lineWidth = 4;
                this.ctx.globalAlpha = 0.5 + Math.sin(this.globalTime * 0.015) * 0.3;
                this.ctx.beginPath(); this.ctx.arc(0, -60 + bounce, 75, 0, Math.PI * 2); this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }

            // Dash effect
            if (this.player.isDashing) {
                this.ctx.strokeStyle = '#f472b6'; this.ctx.lineWidth = 3;
                for (let i = 1; i <= 3; i++) {
                    this.ctx.globalAlpha = 0.3 / i;
                    this.ctx.beginPath(); this.ctx.arc(0 - i * 15, -60 + bounce, 50, 0, Math.PI * 2); this.ctx.stroke();
                }
                this.ctx.globalAlpha = 1;
            }
        }
        this.ctx.restore(); this.ctx.globalAlpha = 1;
    }

    drawParticles() {
        this.particles.forEach(p => { this.ctx.globalAlpha = p.life / 50; this.ctx.fillStyle = p.color; this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); this.ctx.fill(); });
        this.ctx.globalAlpha = 1;
    }

    drawFloatingTexts() {
        this.floatingTexts.forEach(t => {
            this.ctx.globalAlpha = t.life / 60;
            this.ctx.fillStyle = t.color; this.ctx.font = 'bold 28px Arial'; this.ctx.textAlign = 'center';
            this.ctx.fillText(t.text, t.x, t.y);
        });
        this.ctx.globalAlpha = 1;
    }

    drawHUD() {
        this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 48px "Space Grotesk", Arial'; this.ctx.textAlign = 'left';
        this.ctx.fillText(this.score.toLocaleString(), 40, 62);
        if (this.multiplier > 1) { this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 30px Arial'; this.ctx.fillText(`x${this.multiplier}`, 40, 98); }
        this.ctx.fillStyle = '#a855f7'; this.ctx.font = 'bold 22px Arial'; this.ctx.fillText(`LVL ${this.level}`, 40, 130);
        if (this.combo >= 5) { this.ctx.fillStyle = '#22c55e'; this.ctx.font = 'bold 22px Arial'; this.ctx.fillText(`COMBO ${this.combo}x`, 40, 158); }

        // Fever mode indicator
        if (this.feverMode) {
            this.ctx.fillStyle = '#f472b6'; this.ctx.font = 'bold 24px Arial';
            this.ctx.fillText(`🔥 FEVER ${Math.ceil(this.feverTimer / 60)}s`, 40, 188);
        }

        this.ctx.fillStyle = '#fbbf24'; this.ctx.textAlign = 'right'; this.ctx.font = 'bold 34px Arial'; this.ctx.fillText(`💰 ${this.coins}`, this.width - 40, 62);
        let hearts = ''; for (let i = 0; i < Math.min(this.lives, 5); i++) hearts += '❤️'; for (let i = this.lives; i < 3; i++) hearts += '🖤';
        this.ctx.font = '38px Arial'; this.ctx.fillText(hearts, this.width - 40, 110);
        if (this.streak > 0) { this.ctx.textAlign = 'center'; this.ctx.fillStyle = '#22c55e'; this.ctx.font = 'bold 28px Arial'; this.ctx.fillText(`🔥 ${this.streak} Streak`, this.centerX, 62); }

        // Coin rush indicator
        if (this.coinRush) {
            this.ctx.textAlign = 'center'; this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 26px Arial';
            this.ctx.globalAlpha = 0.5 + Math.sin(this.globalTime * 0.02) * 0.5;
            this.ctx.fillText('💰 COIN RUSH! 💰', this.centerX, 95);
            this.ctx.globalAlpha = 1;
        }

        let py = 150;
        if (this.player.shield > 0) { this.ctx.textAlign = 'right'; this.ctx.fillStyle = '#06b6d4'; this.ctx.font = '24px Arial'; this.ctx.fillText(`🛡️ ${Math.ceil(this.player.shield / 60)}s`, this.width - 40, py); py += 32; }
        if (this.player.magnet > 0) { this.ctx.textAlign = 'right'; this.ctx.fillStyle = '#a855f7'; this.ctx.font = '24px Arial'; this.ctx.fillText(`🧲 ${Math.ceil(this.player.magnet / 60)}s`, this.width - 40, py); py += 32; }
        if (this.player.speedBoost > 0) { this.ctx.textAlign = 'right'; this.ctx.fillStyle = '#22c55e'; this.ctx.font = '24px Arial'; this.ctx.fillText(`⚡ ${Math.ceil(this.player.speedBoost / 60)}s`, this.width - 40, py); py += 32; }
        if (this.player.dashCooldown <= 0) { this.ctx.textAlign = 'right'; this.ctx.fillStyle = '#f472b6'; this.ctx.font = '20px Arial'; this.ctx.fillText('SHIFT: Dash Ready', this.width - 40, py); }
    }

    drawMenu() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.9)'; this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.shadowColor = '#d946ef'; this.ctx.shadowBlur = 80; this.ctx.fillStyle = '#d946ef';
        this.ctx.font = `bold ${Math.min(68, this.width * 0.055)}px "Space Grotesk", Arial`; this.ctx.textAlign = 'center';
        this.ctx.fillText('🏃 ANATOMY RUSH', this.centerX, this.height * 0.13); this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#f472b6'; this.ctx.font = '18px Arial'; this.ctx.fillText('✨ LEGENDARY EDITION ✨', this.centerX, this.height * 0.19);
        this.ctx.fillStyle = '#94a3b8'; this.ctx.font = '20px Arial'; this.ctx.fillText('Master nursing concepts through gameplay', this.centerX, this.height * 0.26);
        this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 30px Arial';
        this.ctx.fillText(`🏆 Best: ${this.highScore.toLocaleString()}`, this.centerX, this.height * 0.38);
        this.ctx.fillText(`💰 Coins: ${this.totalCoins.toLocaleString()}`, this.centerX, this.height * 0.46);
        const achCount = Object.keys(this.achievements).length;
        if (achCount > 0) { this.ctx.fillStyle = '#a855f7'; this.ctx.font = '18px Arial'; this.ctx.fillText(`🏅 ${achCount} Achievement${achCount > 1 ? 's' : ''} Unlocked`, this.centerX, this.height * 0.53); }
        this.ctx.fillStyle = '#fff'; this.ctx.font = '16px Arial';
        this.ctx.fillText('← → Lanes | SPACE Double Jump | ↓ Slide | SHIFT Dash', this.centerX, this.height * 0.63);
        this.ctx.fillStyle = '#a855f7'; this.ctx.font = '14px Arial';
        this.ctx.fillText('🛡️ Shield | 🧲 Magnet | ⚡ Speed | ❤️ Life | 💰 Burst | 🌧️ Weather', this.centerX, this.height * 0.7);
        const pulse = 0.6 + Math.sin(this.globalTime * 0.005) * 0.4;
        this.ctx.globalAlpha = pulse; this.ctx.fillStyle = '#06b6d4'; this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText('[ TAP OR PRESS SPACE ]', this.centerX, this.height * 0.86); this.ctx.globalAlpha = 1;
    }

    drawQuestion() {
        if (this.questionResult === null) { this.questionTimer--; if (this.questionTimer <= 0) { this.questionResult = 'timeout'; this.lives--; this.streak = 0; this.multiplier = 1; this.shake = 15; this.flash = { color: '#ef4444', timer: 18 }; if (this.lives <= 0) setTimeout(() => this.gameOver(), 900); else setTimeout(() => { this.state = 'playing'; this.currentQuestion = null; }, 1100); } }
        this.ctx.fillStyle = 'rgba(5,5,20,0.98)'; this.ctx.fillRect(0, 0, this.width, this.height);
        if (!this.currentQuestion) return;
        const pct = this.questionTimer / (this.questionTimeLimit * 60), tc = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#f59e0b' : '#ef4444';
        this.ctx.fillStyle = '#1f2937'; this.ctx.fillRect(70, 20, this.width - 140, 28);
        this.ctx.fillStyle = tc; this.ctx.fillRect(70, 20, (this.width - 140) * pct, 28);
        this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 20px Arial'; this.ctx.textAlign = 'center'; this.ctx.fillText(`${Math.ceil(this.questionTimer / 60)}s`, this.centerX, 42);
        this.ctx.font = 'bold 21px Arial';
        const words = this.currentQuestion.text.split(' '); let line = '', y = this.height * 0.11, maxW = this.width * 0.86;
        words.forEach(w => { const test = line + w + ' '; if (this.ctx.measureText(test).width > maxW && line) { this.ctx.fillText(line.trim(), this.centerX, y); line = w + ' '; y += 32; } else line = test; });
        this.ctx.fillText(line.trim(), this.centerX, y);
        const startY = this.height * 0.28, optH = 60, gap = 18, margin = this.width * 0.06;
        this.currentQuestion.options.forEach((opt, i) => {
            const oY = startY + i * (optH + gap); let bg = '#1e1e40', border = 'rgba(139, 92, 246, 0.4)';
            if (this.questionResult) { if (i === this.selectedAnswer) { bg = this.questionResult === 'correct' ? '#22c55e' : '#ef4444'; border = bg; } if (opt === this.currentQuestion.correct && this.questionResult !== 'correct') { bg = '#22c55e'; border = '#22c55e'; } }
            this.ctx.fillStyle = bg; this.ctx.beginPath(); this.ctx.roundRect(margin, oY, this.width - margin * 2, optH, 15); this.ctx.fill();
            this.ctx.strokeStyle = border; this.ctx.lineWidth = 3; this.ctx.stroke();
            this.ctx.fillStyle = '#fff'; this.ctx.font = '18px Arial'; this.ctx.textAlign = 'left';
            let text = `${i + 1}. ${opt}`; const maxT = this.width - margin * 2 - 45; while (this.ctx.measureText(text).width > maxT && text.length > 15) text = text.slice(0, -4) + '...';
            this.ctx.fillText(text, margin + 22, oY + 39);
        });
        if (this.questionResult) {
            this.ctx.textAlign = 'center'; this.ctx.font = 'bold 40px Arial';
            if (this.questionResult === 'correct') { this.ctx.fillStyle = '#22c55e'; this.ctx.fillText(`✓ CORRECT! +${25 * this.multiplier} coins`, this.centerX, this.height - 55); }
            else if (this.questionResult === 'timeout') { this.ctx.fillStyle = '#ef4444'; this.ctx.fillText('⏱️ TIME UP!', this.centerX, this.height - 55); }
            else { this.ctx.fillStyle = '#ef4444'; this.ctx.fillText('✗ WRONG!', this.centerX, this.height - 55); }
        }
    }

    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.94)'; this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.shadowColor = '#ef4444'; this.ctx.shadowBlur = 80; this.ctx.fillStyle = '#ef4444';
        this.ctx.font = `bold ${Math.min(65, this.width * 0.055)}px "Space Grotesk", Arial`; this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.centerX, this.height * 0.1); this.ctx.shadowBlur = 0;

        // Stats
        this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 40px Arial';
        this.ctx.fillText(`Score: ${this.score.toLocaleString()}`, this.centerX, this.height * 0.2);
        this.ctx.fillStyle = '#a855f7'; this.ctx.font = '22px Arial';
        this.ctx.fillText(`Level ${this.level} • ${this.questionsCorrectRun}/${this.questionsAnswered} Questions Correct`, this.centerX, this.height * 0.27);

        if (this.score >= this.highScore) {
            this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 36px Arial';
            this.ctx.fillText('🏆 NEW HIGH SCORE! 🏆', this.centerX, this.height * 0.35);
        } else {
            this.ctx.fillStyle = '#888'; this.ctx.font = '24px Arial';
            this.ctx.fillText(`Best: ${this.highScore.toLocaleString()}`, this.centerX, this.height * 0.35);
        }

        // Question review
        if (this.questionHistory.length > 0) {
            this.ctx.fillStyle = '#06b6d4'; this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText('📝 Question Review', this.centerX, this.height * 0.44);

            const startY = this.height * 0.5;
            const maxToShow = Math.min(3, this.questionHistory.length);
            this.ctx.font = '16px Arial'; this.ctx.textAlign = 'left';

            for (let i = 0; i < maxToShow; i++) {
                const q = this.questionHistory[this.questionHistory.length - 1 - i];
                const y = startY + i * 50;
                const icon = q.correct ? '✅' : '❌';
                const color = q.correct ? '#22c55e' : '#ef4444';
                this.ctx.fillStyle = color;

                let text = q.question;
                if (text.length > 50) text = text.slice(0, 47) + '...';
                this.ctx.fillText(`${icon} ${text}`, 60, y);

                if (!q.correct) {
                    this.ctx.fillStyle = '#888'; this.ctx.font = '14px Arial';
                    let ans = q.correctAnswer;
                    if (ans.length > 40) ans = ans.slice(0, 37) + '...';
                    this.ctx.fillText(`   → ${ans}`, 60, y + 18);
                    this.ctx.font = '16px Arial';
                }
            }
        }

        // Coins and XP
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText(`💰 ${this.coins} coins earned`, this.centerX, this.height * 0.82);
        this.ctx.fillStyle = '#22c55e'; this.ctx.font = '24px Arial';
        this.ctx.fillText(`+${Math.floor(this.score / 10)} XP`, this.centerX, this.height * 0.87);

        const pulse = 0.6 + Math.sin(this.globalTime * 0.005) * 0.4;
        this.ctx.globalAlpha = pulse; this.ctx.fillStyle = '#06b6d4'; this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('[ PRESS SPACE TO RETRY ]', this.centerX, this.height * 0.95); this.ctx.globalAlpha = 1;
    }

    loop(ts) { const dt = Math.min(ts - this.lastTime, 50); this.lastTime = ts; this.update(dt); this.render(); if (this.running) requestAnimationFrame(t => this.loop(t)); }
    start() { if (!this.running) { this.running = true; this.lastTime = performance.now(); requestAnimationFrame(t => this.loop(t)); } }
    stop() { this.running = false; if (this._kh) document.removeEventListener('keydown', this._kh); }
}

let anatomyRunner = null;
function initGame() { const c = document.getElementById('gameCanvas'); if (!c) return; if (anatomyRunner) anatomyRunner.stop(); anatomyRunner = new AnatomyRush(c); anatomyRunner.start(); }
function stopGame() { if (anatomyRunner) { anatomyRunner.stop(); anatomyRunner = null; } }
window.addEventListener('resize', () => { if (anatomyRunner) anatomyRunner.resize(); });
