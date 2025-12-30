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

        this.questionDistance = 7000;
        this.nextQuestionAt = this.questionDistance;
        this.questionIncrement = 5000;
        this.currentQuestion = null;
        this.questionTimer = 0;
        this.questionTimeLimit = 15;
        this.selectedAnswer = -1;
        this.questionResult = null;

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

        const bSpeed = this.speed * (this.player.speedBoost > 0 ? 1.5 : 1);
        this.buildings.forEach(b => { b.x -= bSpeed * 0.35; if (b.x < -b.width - 50) { b.x = this.width + Math.random() * 100; b.height = 60 + Math.random() * 280; b.lit = Math.random() > 0.25; } });

        if (this.state !== 'playing') return;

        const speedMod = this.player.speedBoost > 0 ? 1.5 : 1;
        if (this.speed < this.maxSpeed) this.speed += 0.00015;
        this.distance += this.speed * speedMod * 8;
        this.score = Math.floor(this.distance / 10) * this.multiplier;

        // Level progression
        const newLevel = Math.floor(this.distance / 10000) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.addFloatingText(this.centerX, this.height / 2, `LEVEL ${this.level}!`, '#fbbf24');
            this.flash = { color: '#fbbf24', timer: 20 };
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
        if (Math.random() < 0.018) this.spawnCoin();
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
        if (typeof quizQuestionsBase !== 'undefined') {
            const valid = quizQuestionsBase.filter(q => q.type !== 'sata');
            if (valid.length) {
                const q = valid[Math.floor(Math.random() * valid.length)];
                this.currentQuestion = { text: q.q, options: this.shuffle([...q.options]).slice(0, 4), correct: q.correctAnswer };
                return;
            }
        }
        this.currentQuestion = { text: "Priority intervention for compartment syndrome?", options: ["Notify surgeon immediately", "Elevate extremity", "Apply ice", "Give analgesics"], correct: "Notify surgeon immediately" };
    }

    shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

    selectAnswer(idx) {
        if (this.questionResult !== null || idx >= this.currentQuestion.options.length) return;
        this.selectedAnswer = idx;
        const correct = this.currentQuestion.options[idx] === this.currentQuestion.correct;
        if (correct) {
            this.questionResult = 'correct'; this.streak++;
            this.multiplier = Math.min(5, 1 + Math.floor(this.streak / 2));
            const reward = 25 * this.multiplier;
            this.coins += reward; this.totalCoins += reward;
            localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
            this.flash = { color: '#22c55e', timer: 20 };
        } else {
            this.questionResult = 'wrong'; this.lives--; this.streak = 0; this.multiplier = 1;
            this.shake = 18; this.flash = { color: '#ef4444', timer: 18 };
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
        if (this.state === 'playing') { this.drawHUD(); this.drawAchievement(); }
        else if (this.state === 'menu') this.drawMenu();
        else if (this.state === 'question') this.drawQuestion();
        else if (this.state === 'gameover') this.drawGameOver();
        if (this.flash) { this.ctx.fillStyle = this.flash.color; this.ctx.globalAlpha = this.flash.timer / 30; this.ctx.fillRect(0, 0, this.width, this.height); this.ctx.globalAlpha = 1; }
        this.ctx.restore();
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
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, '#020617'); grad.addColorStop(0.3, '#0f172a'); grad.addColorStop(0.65, '#1e1b4b'); grad.addColorStop(1, '#312e81');
        this.ctx.fillStyle = grad; this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < 140; i++) {
            const x = (i * 117.3 + this.globalTime * 0.005) % this.width;
            const y = (i * 41.7) % (this.height * 0.32);
            this.ctx.globalAlpha = 0.2 + Math.sin(this.globalTime * 0.002 + i * 0.4) * 0.25;
            this.ctx.beginPath(); this.ctx.arc(x, y, 0.7 + (i % 3) * 0.5, 0, Math.PI * 2); this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;

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
                            this.ctx.fillStyle = `rgba(255, 210, 120, ${0.35 + Math.random() * 0.2})`;
                            this.ctx.fillRect(b.x + 5 + col * gx, by + 10 + row * gy, ww, wh);
                        }
                    }
                }
            }
        });

        const hg = this.ctx.createRadialGradient(this.centerX, this.height * 0.4, 0, this.centerX, this.height * 0.4, this.width * 0.6);
        hg.addColorStop(0, 'rgba(139, 92, 246, 0.28)'); hg.addColorStop(0.6, 'rgba(168, 85, 247, 0.08)'); hg.addColorStop(1, 'transparent');
        this.ctx.fillStyle = hg; this.ctx.fillRect(0, 0, this.width, this.height);
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
        let glow = '#38bdf8';
        if (this.player.shield > 0) glow = '#06b6d4';
        if (this.player.speedBoost > 0) glow = '#22c55e';
        if (this.player.magnet > 0) glow = '#a855f7';
        this.ctx.shadowColor = glow; this.ctx.shadowBlur = 40;

        const bounce = this.player.isJumping ? 0 : Math.sin(this.player.animFrame * 0.6) * 6;
        const armSwing = Math.sin(this.player.animFrame * 0.8) * 32;
        const legSwing = Math.sin(this.player.animFrame * 0.8) * 28;

        if (this.player.isSliding) {
            this.ctx.fillStyle = '#38bdf8'; this.ctx.beginPath(); this.ctx.ellipse(0, -20, 60, 26, 0, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.beginPath(); this.ctx.arc(32, -32, 24, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = '#fff'; this.ctx.fillRect(18, -58, 32, 12);
            this.ctx.fillStyle = '#ef4444'; this.ctx.fillRect(30, -56, 8, 8); this.ctx.fillRect(26, -52, 16, 5);
        } else {
            this.ctx.fillStyle = '#0284c7';
            this.ctx.save(); this.ctx.translate(-16, -20 + bounce); this.ctx.rotate(legSwing * Math.PI / 180);
            this.ctx.fillRect(-9, 0, 18, 46); this.ctx.fillStyle = '#1e3a5f'; this.ctx.fillRect(-11, 42, 22, 14); this.ctx.restore();
            this.ctx.fillStyle = '#0284c7';
            this.ctx.save(); this.ctx.translate(16, -20 + bounce); this.ctx.rotate(-legSwing * Math.PI / 180);
            this.ctx.fillRect(-9, 0, 18, 46); this.ctx.fillStyle = '#1e3a5f'; this.ctx.fillRect(-11, 42, 22, 14); this.ctx.restore();

            this.ctx.fillStyle = '#38bdf8'; this.ctx.beginPath(); this.ctx.roundRect(-30, -90 + bounce, 60, 75, 14); this.ctx.fill();
            this.ctx.strokeStyle = '#0c4a6e'; this.ctx.lineWidth = 3;
            this.ctx.beginPath(); this.ctx.moveTo(-15, -90 + bounce); this.ctx.lineTo(0, -70 + bounce); this.ctx.lineTo(15, -90 + bounce); this.ctx.stroke();

            this.ctx.save(); this.ctx.translate(-36, -78 + bounce); this.ctx.rotate(-armSwing * Math.PI / 180);
            this.ctx.fillStyle = '#38bdf8'; this.ctx.fillRect(-8, 0, 16, 35);
            this.ctx.fillStyle = '#fcd34d'; this.ctx.fillRect(-7, 30, 14, 28); this.ctx.restore();
            this.ctx.save(); this.ctx.translate(36, -78 + bounce); this.ctx.rotate(armSwing * Math.PI / 180);
            this.ctx.fillStyle = '#38bdf8'; this.ctx.fillRect(-8, 0, 16, 35);
            this.ctx.fillStyle = '#fcd34d'; this.ctx.fillRect(-7, 30, 14, 28); this.ctx.restore();

            this.ctx.fillStyle = '#fcd34d'; this.ctx.beginPath(); this.ctx.arc(0, -115 + bounce, 28, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = '#4a3728'; this.ctx.beginPath(); this.ctx.arc(0, -120 + bounce, 28, Math.PI, 0); this.ctx.fill();
            this.ctx.fillStyle = '#fff'; this.ctx.fillRect(-24, -152 + bounce, 48, 16);
            this.ctx.fillStyle = '#ef4444'; this.ctx.fillRect(-7, -149 + bounce, 14, 12); this.ctx.fillRect(-12, -145 + bounce, 24, 7);
            this.ctx.fillStyle = '#fff'; this.ctx.beginPath(); this.ctx.ellipse(-11, -118 + bounce, 9, 10, 0, 0, Math.PI * 2); this.ctx.ellipse(11, -118 + bounce, 9, 10, 0, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = '#1e293b'; this.ctx.beginPath(); this.ctx.arc(-9, -117 + bounce, 5, 0, Math.PI * 2); this.ctx.arc(13, -117 + bounce, 5, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.strokeStyle = '#92400e'; this.ctx.lineWidth = 3; this.ctx.beginPath(); this.ctx.arc(0, -105 + bounce, 12, 0.2, Math.PI - 0.2); this.ctx.stroke();
            this.ctx.strokeStyle = '#475569'; this.ctx.lineWidth = 4;
            this.ctx.beginPath(); this.ctx.moveTo(-8, -88 + bounce); this.ctx.quadraticCurveTo(-22, -55 + bounce, 0, -48 + bounce); this.ctx.stroke();
            this.ctx.fillStyle = '#64748b'; this.ctx.beginPath(); this.ctx.arc(0, -45 + bounce, 9, 0, Math.PI * 2); this.ctx.fill();

            if (this.player.shield > 0) {
                this.ctx.strokeStyle = '#06b6d4'; this.ctx.lineWidth = 5;
                this.ctx.globalAlpha = 0.5 + Math.sin(this.globalTime * 0.012) * 0.3;
                this.ctx.beginPath(); this.ctx.arc(0, -65 + bounce, 80, 0, Math.PI * 2); this.ctx.stroke();
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
        this.ctx.fillStyle = '#fbbf24'; this.ctx.textAlign = 'right'; this.ctx.font = 'bold 34px Arial'; this.ctx.fillText(`💰 ${this.coins}`, this.width - 40, 62);
        let hearts = ''; for (let i = 0; i < Math.min(this.lives, 5); i++) hearts += '❤️'; for (let i = this.lives; i < 3; i++) hearts += '🖤';
        this.ctx.font = '38px Arial'; this.ctx.fillText(hearts, this.width - 40, 110);
        if (this.streak > 0) { this.ctx.textAlign = 'center'; this.ctx.fillStyle = '#22c55e'; this.ctx.font = 'bold 28px Arial'; this.ctx.fillText(`🔥 ${this.streak} Streak`, this.centerX, 62); }
        let py = 150;
        if (this.player.shield > 0) { this.ctx.textAlign = 'right'; this.ctx.fillStyle = '#06b6d4'; this.ctx.font = '24px Arial'; this.ctx.fillText(`🛡️ ${Math.ceil(this.player.shield / 60)}s`, this.width - 40, py); py += 32; }
        if (this.player.magnet > 0) { this.ctx.textAlign = 'right'; this.ctx.fillStyle = '#a855f7'; this.ctx.font = '24px Arial'; this.ctx.fillText(`🧲 ${Math.ceil(this.player.magnet / 60)}s`, this.width - 40, py); py += 32; }
        if (this.player.speedBoost > 0) { this.ctx.textAlign = 'right'; this.ctx.fillStyle = '#22c55e'; this.ctx.font = '24px Arial'; this.ctx.fillText(`⚡ ${Math.ceil(this.player.speedBoost / 60)}s`, this.width - 40, py); }
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
        this.ctx.font = `bold ${Math.min(75, this.width * 0.065)}px "Space Grotesk", Arial`; this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.centerX, this.height * 0.18); this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 48px Arial'; this.ctx.fillText(`Score: ${this.score.toLocaleString()}`, this.centerX, this.height * 0.34);
        this.ctx.fillStyle = '#a855f7'; this.ctx.font = '26px Arial'; this.ctx.fillText(`Level ${this.level} Reached`, this.centerX, this.height * 0.42);
        if (this.score >= this.highScore) { this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 42px Arial'; this.ctx.fillText('🏆 NEW BEST! 🏆', this.centerX, this.height * 0.54); }
        else { this.ctx.fillStyle = '#888'; this.ctx.font = '28px Arial'; this.ctx.fillText(`Best: ${this.highScore.toLocaleString()}`, this.centerX, this.height * 0.54); }
        this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 34px Arial'; this.ctx.fillText(`💰 ${this.coins} coins earned`, this.centerX, this.height * 0.66);
        this.ctx.fillStyle = '#22c55e'; this.ctx.font = '28px Arial'; this.ctx.fillText(`+${Math.floor(this.score / 10)} XP`, this.centerX, this.height * 0.75);
        const pulse = 0.6 + Math.sin(this.globalTime * 0.005) * 0.4;
        this.ctx.globalAlpha = pulse; this.ctx.fillStyle = '#06b6d4'; this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText('[ PRESS SPACE TO RETRY ]', this.centerX, this.height * 0.9); this.ctx.globalAlpha = 1;
    }

    loop(ts) { const dt = Math.min(ts - this.lastTime, 50); this.lastTime = ts; this.update(dt); this.render(); if (this.running) requestAnimationFrame(t => this.loop(t)); }
    start() { if (!this.running) { this.running = true; this.lastTime = performance.now(); requestAnimationFrame(t => this.loop(t)); } }
    stop() { this.running = false; if (this._kh) document.removeEventListener('keydown', this._kh); }
}

let anatomyRunner = null;
function initGame() { const c = document.getElementById('gameCanvas'); if (!c) return; if (anatomyRunner) anatomyRunner.stop(); anatomyRunner = new AnatomyRush(c); anatomyRunner.start(); }
function stopGame() { if (anatomyRunner) { anatomyRunner.stop(); anatomyRunner = null; } }
window.addEventListener('resize', () => { if (anatomyRunner) anatomyRunner.resize(); });
