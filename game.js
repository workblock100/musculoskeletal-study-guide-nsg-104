// ANATOMY RUSH - Award Winning Edition 2025
// Complete game with power-ups, effects, and polished gameplay

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
            isSliding: false,
            slideTimer: 0,
            animFrame: 0,
            invincible: 0,
            shield: 0,
            magnet: 0,
            speedBoost: 0
        };

        this.speed = 1;
        this.maxSpeed = 2.8;
        this.baseSpeed = 1;

        this.obstacles = [];
        this.coins_arr = [];
        this.powerups = [];
        this.particles = [];
        this.buildings = [];

        // Questions - first at 6000 distance (~18 seconds), then every 4000+
        this.questionDistance = 6000;
        this.nextQuestionAt = this.questionDistance;
        this.questionIncrement = 4000;
        this.currentQuestion = null;
        this.questionTimer = 0;
        this.questionTimeLimit = 15;
        this.selectedAnswer = -1;
        this.questionResult = null;

        this.lastObstacle = 0;
        this.obstacleGap = 450;
        this.shake = 0;
        this.flash = null;
        this.running = false;
        this.lastTime = 0;
        this.globalTime = 0;

        // Generate city skyline
        for (let i = 0; i < 25; i++) {
            this.buildings.push({
                x: i * 100 - 200,
                height: 80 + Math.random() * 250,
                width: 50 + Math.random() * 50,
                windows: Math.floor(Math.random() * 5) + 2,
                hue: Math.random() * 60 + 200,
                lit: Math.random() > 0.3
            });
        }

        this.bindEvents();
    }

    resize() {
        const container = this.canvas.parentElement;
        const maxW = Math.min(container.offsetWidth - 20, 1600);
        const maxH = Math.min(window.innerHeight - 100, 850);

        if (maxW / 16 * 9 > maxH) {
            this.canvas.height = maxH;
            this.canvas.width = maxH / 9 * 16;
        } else {
            this.canvas.width = maxW;
            this.canvas.height = maxW / 16 * 9;
        }

        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.centerX = this.width / 2;
    }

    bindEvents() {
        // Global key handler - works even when canvas not focused
        const handleKey = (e) => {
            const keys = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Enter'];

            // Only prevent default if game is active
            if (keys.includes(e.code) && this.running) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (this.state === 'menu') {
                if (e.code === 'Space' || e.code === 'Enter') { this.startGame(); return; }
            }

            if (this.state === 'gameover') {
                if (e.code === 'Space' || e.code === 'Enter') {
                    this.state = 'menu';
                    return;
                }
            }

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
            }
        };

        // Remove old handler if exists
        if (this._kh) document.removeEventListener('keydown', this._kh);
        this._kh = handleKey;
        document.addEventListener('keydown', this._kh);

        // Canvas click
        this.canvas.addEventListener('click', (e) => {
            if (this.state === 'menu') { this.startGame(); return; }
            if (this.state === 'gameover') { this.state = 'menu'; return; }
            if (this.state === 'question') this.handleQuestionClick(e);
        });

        // Touch controls
        let tx = 0, ty = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            tx = e.touches[0].clientX;
            ty = e.touches[0].clientY;
            if (this.state === 'menu') this.startGame();
            if (this.state === 'gameover') this.state = 'menu';
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.state !== 'playing') return;
            const dx = e.touches[0].clientX - tx;
            const dy = e.touches[0].clientY - ty;
            if (Math.abs(dx) > 40) { this.switchLane(dx > 0 ? 1 : -1); tx = e.touches[0].clientX; }
            if (dy < -50) { this.jump(); ty = e.touches[0].clientY; }
            if (dy > 50) { this.slide(); ty = e.touches[0].clientY; }
        }, { passive: false });

        window.addEventListener('resize', () => this.resize());
    }

    switchLane(dir) {
        const nl = this.targetLane + dir;
        if (nl >= 0 && nl < 3) {
            this.targetLane = nl;
            this.addParticles(this.getLaneX(this.currentLane), this.height - 100, 8, '#a855f7');
        }
    }

    jump() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.isJumping = true;
            this.player.jumpVelocity = 22;
            this.addParticles(this.getLaneX(this.currentLane), this.height - 60, 15, '#06b6d4');
        }
    }

    slide() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.isSliding = true;
            this.player.slideTimer = 45;
            this.addParticles(this.getLaneX(this.currentLane), this.height - 40, 8, '#f59e0b');
        }
    }

    addParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 4,
                size: 3 + Math.random() * 5,
                life: 35,
                color
            });
        }
    }

    getLaneX(lane) { return this.centerX + (lane - 1) * this.laneWidth; }

    startGame() {
        this.state = 'playing';
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.streak = 0;
        this.multiplier = 1;
        this.distance = 0;
        this.speed = this.baseSpeed;
        this.currentLane = 1;
        this.targetLane = 1;
        this.obstacles = [];
        this.coins_arr = [];
        this.powerups = [];
        this.particles = [];

        this.player.isJumping = false;
        this.player.isSliding = false;
        this.player.jumpHeight = 0;
        this.player.invincible = 0;
        this.player.shield = 0;
        this.player.magnet = 0;
        this.player.speedBoost = 0;

        this.lastObstacle = 0;
        this.nextQuestionAt = this.questionDistance;
    }

    update(dt) {
        this.globalTime += dt;

        // Effects
        if (this.shake > 0) this.shake *= 0.88;
        if (this.flash) { this.flash.timer--; if (this.flash.timer <= 0) this.flash = null; }
        if (this.player.invincible > 0) this.player.invincible--;
        if (this.player.shield > 0) this.player.shield--;
        if (this.player.magnet > 0) this.player.magnet--;
        if (this.player.speedBoost > 0) this.player.speedBoost--;

        // Particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.25;
            p.life--;
            p.size *= 0.95;
            return p.life > 0;
        });

        // Scroll buildings
        const bSpeed = this.speed * (this.player.speedBoost > 0 ? 1.5 : 1);
        this.buildings.forEach(b => {
            b.x -= bSpeed * 0.4;
            if (b.x < -b.width - 50) {
                b.x = this.width + Math.random() * 100;
                b.height = 80 + Math.random() * 250;
                b.lit = Math.random() > 0.3;
            }
        });

        if (this.state !== 'playing') return;

        // Speed
        const speedMod = this.player.speedBoost > 0 ? 1.4 : 1;
        if (this.speed < this.maxSpeed) this.speed += 0.00012;

        this.distance += this.speed * speedMod * 7;
        this.score = Math.floor(this.distance / 10) * this.multiplier;

        // Lane transition
        const diff = this.targetLane - this.currentLane;
        this.currentLane += diff * 0.18;

        // Player physics
        if (this.player.isJumping) {
            this.player.jumpHeight += this.player.jumpVelocity;
            this.player.jumpVelocity -= 1.0;
            if (this.player.jumpHeight <= 0) {
                this.player.jumpHeight = 0;
                this.player.isJumping = false;
            }
        }

        if (this.player.isSliding) {
            this.player.slideTimer--;
            if (this.player.slideTimer <= 0) this.player.isSliding = false;
        }

        // Animation
        this.player.animFrame = (this.player.animFrame + 0.35) % 8;

        // Spawn obstacles
        if (this.distance - this.lastObstacle > this.obstacleGap / this.speed) {
            this.spawnObstacle();
            this.lastObstacle = this.distance;
        }

        // Spawn coins
        if (Math.random() < 0.015) this.spawnCoin();

        // Spawn powerups (rare)
        if (Math.random() < 0.003) this.spawnPowerup();

        this.updateObstacles();
        this.updateCoins();
        this.updatePowerups();

        // Question trigger
        if (this.distance >= this.nextQuestionAt) {
            this.triggerQuestion();
            this.nextQuestionAt += this.questionIncrement + Math.floor(this.distance / 2000) * 500;
        }
    }

    spawnObstacle() {
        const lane = Math.floor(Math.random() * 3);
        const isHigh = Math.random() > 0.6;
        this.obstacles.push({ lane, z: 2000, type: isHigh ? 'high' : 'low', hit: false });
    }

    spawnCoin() {
        const lane = Math.floor(Math.random() * 3);
        this.coins_arr.push({
            lane, z: 2000,
            elevated: Math.random() > 0.5,
            collected: false,
            bob: Math.random() * 6.28
        });
    }

    spawnPowerup() {
        const lane = Math.floor(Math.random() * 3);
        const types = ['shield', 'magnet', 'speed', 'heart'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.powerups.push({ lane, z: 2000, type, collected: false, bob: Math.random() * 6.28 });
    }

    updateObstacles() {
        const speedMod = this.player.speedBoost > 0 ? 1.4 : 1;
        this.obstacles = this.obstacles.filter(obs => {
            obs.z -= this.speed * speedMod * 20;

            if (obs.z < 120 && obs.z > -50 && !obs.hit) {
                if (obs.lane === Math.round(this.currentLane)) {
                    // Check if should hit
                    let hit = false;
                    if (obs.type === 'high' && !this.player.isSliding) hit = true;
                    else if (obs.type === 'low' && this.player.jumpHeight < 70) hit = true;

                    if (hit && this.player.invincible <= 0 && this.player.shield <= 0) {
                        this.hitObstacle();
                        obs.hit = true;
                    } else if (hit && this.player.shield > 0) {
                        // Shield absorbs hit
                        this.player.shield = 0;
                        this.flash = { color: '#06b6d4', timer: 10 };
                        this.addParticles(this.getLaneX(obs.lane), this.height - 150, 20, '#06b6d4');
                        obs.hit = true;
                    }
                }
            }
            return obs.z > -400;
        });
    }

    updateCoins() {
        const speedMod = this.player.speedBoost > 0 ? 1.4 : 1;
        const magnetRange = this.player.magnet > 0 ? 2 : 0;

        this.coins_arr = this.coins_arr.filter(c => {
            c.z -= this.speed * speedMod * 20;
            c.bob += 0.12;

            // Magnet effect
            if (magnetRange > 0 && c.z < 500 && c.z > 0) {
                const laneDiff = Math.abs(c.lane - Math.round(this.currentLane));
                if (laneDiff <= magnetRange) {
                    c.lane += (this.currentLane - c.lane) * 0.1;
                }
            }

            if (c.z < 120 && c.z > -50 && !c.collected) {
                if (Math.abs(c.lane - this.currentLane) < 0.6) {
                    if (!c.elevated || this.player.jumpHeight > 50) {
                        c.collected = true;
                        this.coins++;
                        this.totalCoins++;
                        localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
                        this.addParticles(this.getLaneX(Math.round(c.lane)), this.height - 180, 12, '#fbbf24');
                    }
                }
            }
            return c.z > -400 && !c.collected;
        });
    }

    updatePowerups() {
        const speedMod = this.player.speedBoost > 0 ? 1.4 : 1;

        this.powerups = this.powerups.filter(p => {
            p.z -= this.speed * speedMod * 20;
            p.bob += 0.1;

            if (p.z < 120 && p.z > -50 && !p.collected) {
                if (Math.abs(p.lane - this.currentLane) < 0.6) {
                    p.collected = true;
                    this.collectPowerup(p.type);
                    this.addParticles(this.getLaneX(p.lane), this.height - 200, 20, this.getPowerupColor(p.type));
                }
            }
            return p.z > -400 && !p.collected;
        });
    }

    collectPowerup(type) {
        this.flash = { color: this.getPowerupColor(type), timer: 12 };

        switch (type) {
            case 'shield':
                this.player.shield = 600; // 10 seconds
                break;
            case 'magnet':
                this.player.magnet = 600;
                break;
            case 'speed':
                this.player.speedBoost = 300; // 5 seconds
                break;
            case 'heart':
                if (this.lives < 5) this.lives++;
                break;
        }
    }

    getPowerupColor(type) {
        const colors = { shield: '#06b6d4', magnet: '#a855f7', speed: '#22c55e', heart: '#ef4444' };
        return colors[type] || '#fff';
    }

    hitObstacle() {
        this.lives--;
        this.streak = 0;
        this.multiplier = 1;
        this.shake = 20;
        this.flash = { color: '#ef4444', timer: 18 };
        this.player.invincible = 100;
        this.addParticles(this.getLaneX(Math.round(this.currentLane)), this.height - 120, 30, '#ef4444');
        if (this.lives <= 0) this.gameOver();
    }

    gameOver() {
        this.state = 'gameover';
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('anatomyRush2025HS', this.highScore);
        }
        if (typeof awardXP === 'function') {
            awardXP(Math.floor(this.score / 10), 'game');
        }
    }

    triggerQuestion() {
        this.state = 'question';
        this.questionTimer = this.questionTimeLimit * 60;
        this.selectedAnswer = -1;
        this.questionResult = null;

        if (typeof quizQuestionsBase !== 'undefined') {
            const valid = quizQuestionsBase.filter(q => q.type !== 'sata');
            if (valid.length) {
                const q = valid[Math.floor(Math.random() * valid.length)];
                this.currentQuestion = {
                    text: q.q,
                    options: this.shuffle([...q.options]).slice(0, 4),
                    correct: q.correctAnswer
                };
                return;
            }
        }
        this.currentQuestion = {
            text: "What is the priority nursing intervention for compartment syndrome?",
            options: ["Notify surgeon immediately", "Elevate extremity", "Apply ice", "Give analgesics"],
            correct: "Notify surgeon immediately"
        };
    }

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    selectAnswer(idx) {
        if (this.questionResult !== null || idx >= this.currentQuestion.options.length) return;
        this.selectedAnswer = idx;
        const correct = this.currentQuestion.options[idx] === this.currentQuestion.correct;

        if (correct) {
            this.questionResult = 'correct';
            this.streak++;
            this.multiplier = Math.min(5, 1 + Math.floor(this.streak / 2));
            this.coins += 20 * this.multiplier;
            this.totalCoins += 20 * this.multiplier;
            localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
            this.flash = { color: '#22c55e', timer: 18 };
        } else {
            this.questionResult = 'wrong';
            this.lives--;
            this.streak = 0;
            this.multiplier = 1;
            this.shake = 15;
            this.flash = { color: '#ef4444', timer: 15 };
            if (this.lives <= 0) { setTimeout(() => this.gameOver(), 800); return; }
        }
        setTimeout(() => { this.state = 'playing'; this.currentQuestion = null; }, 1000);
    }

    handleQuestionClick(e) {
        if (!this.currentQuestion || this.questionResult !== null) return;
        const rect = this.canvas.getBoundingClientRect();
        const sx = this.width / rect.width;
        const sy = this.height / rect.height;
        const x = (e.clientX - rect.left) * sx;
        const y = (e.clientY - rect.top) * sy;
        const startY = this.height * 0.3;
        const optH = 58;
        const gap = 16;
        const margin = this.width * 0.06;

        for (let i = 0; i < this.currentQuestion.options.length; i++) {
            const oY = startY + i * (optH + gap);
            if (x >= margin && x <= this.width - margin && y >= oY && y <= oY + optH) {
                this.selectAnswer(i);
                break;
            }
        }
    }

    // ========== RENDERING ==========

    render() {
        this.ctx.save();
        if (this.shake > 0) {
            this.ctx.translate(
                (Math.random() - 0.5) * this.shake * 2,
                (Math.random() - 0.5) * this.shake * 2
            );
        }

        this.drawBackground();
        this.drawRoad();
        this.drawObstacles();
        this.drawCoins();
        this.drawPowerups();
        this.drawPlayer();
        this.drawParticles();

        if (this.state === 'playing') this.drawHUD();
        else if (this.state === 'menu') this.drawMenu();
        else if (this.state === 'question') this.drawQuestion();
        else if (this.state === 'gameover') this.drawGameOver();

        if (this.flash) {
            this.ctx.fillStyle = this.flash.color;
            this.ctx.globalAlpha = this.flash.timer / 25;
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.globalAlpha = 1;
        }

        this.ctx.restore();
    }

    drawBackground() {
        // Sky gradient
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.35, '#0f172a');
        grad.addColorStop(0.7, '#1e1b4b');
        grad.addColorStop(1, '#312e81');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Stars
        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < 120; i++) {
            const x = (i * 127.3 + this.globalTime * 0.006) % this.width;
            const y = (i * 43.7) % (this.height * 0.35);
            this.ctx.globalAlpha = 0.25 + Math.sin(this.globalTime * 0.002 + i * 0.5) * 0.25;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 0.8 + (i % 3) * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;

        // City skyline
        this.buildings.forEach(b => {
            // Building
            const baseColor = `hsl(${b.hue}, 25%, 10%)`;
            this.ctx.fillStyle = baseColor;
            const by = this.height * 0.4 - b.height;
            this.ctx.fillRect(b.x, by, b.width, b.height);

            // Roof detail
            this.ctx.fillStyle = `hsl(${b.hue}, 20%, 15%)`;
            this.ctx.fillRect(b.x + 5, by - 8, b.width - 10, 8);

            // Windows
            if (b.lit) {
                const ww = 7, wh = 10, gx = 12, gy = 16;
                for (let row = 0; row < Math.floor(b.height / gy) - 1; row++) {
                    for (let col = 0; col < b.windows; col++) {
                        const on = Math.sin(this.globalTime * 0.001 + b.x * 0.1 + row + col) > -0.3;
                        if (on) {
                            this.ctx.fillStyle = `rgba(255, 220, 140, ${0.4 + Math.random() * 0.2})`;
                            this.ctx.fillRect(b.x + 6 + col * gx, by + 12 + row * gy, ww, wh);
                        }
                    }
                }
            }
        });

        // Horizon glow
        const hg = this.ctx.createRadialGradient(
            this.centerX, this.height * 0.42, 0,
            this.centerX, this.height * 0.42, this.width * 0.65
        );
        hg.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
        hg.addColorStop(0.5, 'rgba(168, 85, 247, 0.1)');
        hg.addColorStop(1, 'transparent');
        this.ctx.fillStyle = hg;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawRoad() {
        const horizonY = this.height * 0.42;
        const roadW = 520;
        const segs = 50;

        for (let i = segs; i >= 0; i--) {
            const z = i / segs;
            const nz = (i + 1) / segs;
            const p = 1 / (1 + z * 5);
            const np = 1 / (1 + nz * 5);

            const y = horizonY + (this.height - horizonY) * (1 - Math.pow(z, 0.55));
            const ny = horizonY + (this.height - horizonY) * (1 - Math.pow(nz, 0.55));

            const w = roadW * p;
            const nw = roadW * np;

            // Road surface
            const stripe = Math.floor((i + this.distance / 22) % 4) < 2;
            this.ctx.fillStyle = stripe ? '#18181b' : '#0f0f12';
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX - nw, ny);
            this.ctx.lineTo(this.centerX + nw, ny);
            this.ctx.lineTo(this.centerX + w, y);
            this.ctx.lineTo(this.centerX - w, y);
            this.ctx.closePath();
            this.ctx.fill();

            // Lane dividers
            if (i < segs - 1 && i % 2 === 0) {
                this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.45 * (1 - z)})`;
                this.ctx.lineWidth = 2.5 * p;
                for (let lane = 0; lane < 2; lane++) {
                    const lo = (lane - 0.5) * this.laneWidth;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.centerX + lo * np, ny);
                    this.ctx.lineTo(this.centerX + lo * p, y);
                    this.ctx.stroke();
                }
            }
        }

        // Neon side rails
        this.ctx.shadowColor = '#d946ef';
        this.ctx.shadowBlur = 30;
        this.ctx.strokeStyle = '#d946ef';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - 110, horizonY);
        this.ctx.lineTo(this.centerX - roadW - 30, this.height);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + 110, horizonY);
        this.ctx.lineTo(this.centerX + roadW + 30, this.height);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    drawObstacles() {
        const horizonY = this.height * 0.42;
        [...this.obstacles].sort((a, b) => b.z - a.z).forEach(obs => {
            if (obs.z < 0 || obs.z > 2000) return;

            const zn = obs.z / 2000;
            const p = 1 / (1 + zn * 5);
            const y = horizonY + (this.height - horizonY) * (1 - Math.pow(zn, 0.55));
            const x = this.centerX + (obs.lane - 1) * this.laneWidth * p;
            const w = 75 * p;
            const h = (obs.type === 'high' ? 50 : 100) * p;

            this.ctx.save();
            if (obs.type === 'high') {
                // Floating bar (slide under)
                this.ctx.shadowColor = '#f59e0b';
                this.ctx.shadowBlur = 25 * p;
                const hy = y - 85 * p;
                this.ctx.fillStyle = '#92400e';
                this.ctx.fillRect(x - w / 2 + 6 * p, hy - h + 6 * p, w, h);
                this.ctx.fillStyle = '#f59e0b';
                this.ctx.fillRect(x - w / 2, hy - h, w, h);
                // Stripes
                this.ctx.fillStyle = '#451a03';
                for (let s = 0; s < 4; s++) {
                    this.ctx.fillRect(x - w / 2 + s * w / 4, hy - h, w / 8, h);
                }
            } else {
                // Ground barrier (jump over)
                this.ctx.shadowColor = '#ef4444';
                this.ctx.shadowBlur = 25 * p;
                this.ctx.fillStyle = '#7f1d1d';
                this.ctx.fillRect(x - w / 2 + 6 * p, y - h + 6 * p, w - 6 * p, h - 12 * p);
                this.ctx.fillStyle = '#ef4444';
                this.ctx.fillRect(x - w / 2, y - h, w - 6 * p, h - 12 * p);
                // Stripes
                this.ctx.fillStyle = '#450a0a';
                for (let s = 0; s < 4; s++) {
                    this.ctx.fillRect(x - w / 2 + s * w / 4, y - h, w / 8, h - 12 * p);
                }
            }
            this.ctx.restore();
        });
    }

    drawCoins() {
        const horizonY = this.height * 0.42;
        this.coins_arr.forEach(c => {
            if (c.collected || c.z < 0 || c.z > 2000) return;

            const zn = c.z / 2000;
            const p = 1 / (1 + zn * 5);
            const baseY = horizonY + (this.height - horizonY) * (1 - Math.pow(zn, 0.55));
            const x = this.centerX + (c.lane - 1) * this.laneWidth * p;
            const y = baseY - (50 + (c.elevated ? 90 : 0)) * p + Math.sin(c.bob) * 6 * p;

            this.ctx.save();
            this.ctx.shadowColor = '#fbbf24';
            this.ctx.shadowBlur = 20 * p;
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 18 * p, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#92400e';
            this.ctx.font = `bold ${16 * p}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('$', x, y);
            this.ctx.restore();
        });
    }

    drawPowerups() {
        const horizonY = this.height * 0.42;
        const icons = { shield: '🛡️', magnet: '🧲', speed: '⚡', heart: '❤️' };

        this.powerups.forEach(p => {
            if (p.collected || p.z < 0 || p.z > 2000) return;

            const zn = p.z / 2000;
            const per = 1 / (1 + zn * 5);
            const baseY = horizonY + (this.height - horizonY) * (1 - Math.pow(zn, 0.55));
            const x = this.centerX + (p.lane - 1) * this.laneWidth * per;
            const y = baseY - 80 * per + Math.sin(p.bob) * 8 * per;

            this.ctx.save();
            this.ctx.shadowColor = this.getPowerupColor(p.type);
            this.ctx.shadowBlur = 25 * per;

            // Circle background
            this.ctx.fillStyle = this.getPowerupColor(p.type);
            this.ctx.globalAlpha = 0.3;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 28 * per, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;

            // Icon
            this.ctx.font = `${28 * per}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(icons[p.type], x, y);
            this.ctx.restore();
        });
    }

    drawPlayer() {
        const x = this.getLaneX(this.currentLane);
        const groundY = this.height - 45;
        const y = groundY - this.player.jumpHeight;

        // Invincibility flash
        if (this.player.invincible > 0 && Math.floor(this.player.invincible / 6) % 2 === 0) {
            this.ctx.globalAlpha = 0.5;
        }

        this.ctx.save();
        this.ctx.translate(x, y);

        // Glow color based on powerups
        let glowColor = '#38bdf8';
        if (this.player.shield > 0) glowColor = '#06b6d4';
        if (this.player.speedBoost > 0) glowColor = '#22c55e';
        if (this.player.magnet > 0) glowColor = '#a855f7';

        this.ctx.shadowColor = glowColor;
        this.ctx.shadowBlur = 35;

        const bounce = this.player.isJumping ? 0 : Math.sin(this.player.animFrame * 0.6) * 5;
        const armSwing = Math.sin(this.player.animFrame * 0.8) * 30;
        const legSwing = Math.sin(this.player.animFrame * 0.8) * 25;

        if (this.player.isSliding) {
            // Sliding pose
            this.ctx.fillStyle = '#38bdf8';
            this.ctx.beginPath();
            this.ctx.ellipse(0, -18, 55, 24, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(30, -30, 22, 0, Math.PI * 2);
            this.ctx.fill();
            // Cap
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(16, -54, 30, 11);
            this.ctx.fillStyle = '#ef4444';
            this.ctx.fillRect(27, -52, 8, 7);
            this.ctx.fillRect(23, -49, 16, 4);
        } else {
            // Running pose with full body

            // Legs
            this.ctx.fillStyle = '#0284c7';
            this.ctx.save();
            this.ctx.translate(-15, -18 + bounce);
            this.ctx.rotate(legSwing * Math.PI / 180);
            this.ctx.fillRect(-8, 0, 16, 42);
            this.ctx.fillStyle = '#1e3a5f';
            this.ctx.fillRect(-10, 38, 20, 12);
            this.ctx.restore();

            this.ctx.fillStyle = '#0284c7';
            this.ctx.save();
            this.ctx.translate(15, -18 + bounce);
            this.ctx.rotate(-legSwing * Math.PI / 180);
            this.ctx.fillRect(-8, 0, 16, 42);
            this.ctx.fillStyle = '#1e3a5f';
            this.ctx.fillRect(-10, 38, 20, 12);
            this.ctx.restore();

            // Body (scrubs)
            this.ctx.fillStyle = '#38bdf8';
            this.ctx.beginPath();
            this.ctx.roundRect(-28, -85 + bounce, 56, 70, 12);
            this.ctx.fill();

            // V-neck
            this.ctx.strokeStyle = '#0c4a6e';
            this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
            this.ctx.moveTo(-14, -85 + bounce);
            this.ctx.lineTo(0, -65 + bounce);
            this.ctx.lineTo(14, -85 + bounce);
            this.ctx.stroke();

            // Arms
            this.ctx.save();
            this.ctx.translate(-34, -72 + bounce);
            this.ctx.rotate(-armSwing * Math.PI / 180);
            this.ctx.fillStyle = '#38bdf8';
            this.ctx.fillRect(-7, 0, 14, 32);
            this.ctx.fillStyle = '#fcd34d';
            this.ctx.fillRect(-6, 28, 12, 25);
            this.ctx.restore();

            this.ctx.save();
            this.ctx.translate(34, -72 + bounce);
            this.ctx.rotate(armSwing * Math.PI / 180);
            this.ctx.fillStyle = '#38bdf8';
            this.ctx.fillRect(-7, 0, 14, 32);
            this.ctx.fillStyle = '#fcd34d';
            this.ctx.fillRect(-6, 28, 12, 25);
            this.ctx.restore();

            // Head
            this.ctx.fillStyle = '#fcd34d';
            this.ctx.beginPath();
            this.ctx.arc(0, -108 + bounce, 26, 0, Math.PI * 2);
            this.ctx.fill();

            // Hair
            this.ctx.fillStyle = '#4a3728';
            this.ctx.beginPath();
            this.ctx.arc(0, -113 + bounce, 26, Math.PI, 0);
            this.ctx.fill();

            // Nurse cap
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(-22, -142 + bounce, 44, 15);
            this.ctx.fillStyle = '#ef4444';
            this.ctx.fillRect(-6, -139 + bounce, 12, 11);
            this.ctx.fillRect(-11, -136 + bounce, 22, 6);

            // Eyes
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.ellipse(-10, -110 + bounce, 8, 9, 0, 0, Math.PI * 2);
            this.ctx.ellipse(10, -110 + bounce, 8, 9, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#1e293b';
            this.ctx.beginPath();
            this.ctx.arc(-8, -109 + bounce, 4, 0, Math.PI * 2);
            this.ctx.arc(12, -109 + bounce, 4, 0, Math.PI * 2);
            this.ctx.fill();

            // Smile
            this.ctx.strokeStyle = '#92400e';
            this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
            this.ctx.arc(0, -99 + bounce, 10, 0.2, Math.PI - 0.2);
            this.ctx.stroke();

            // Stethoscope
            this.ctx.strokeStyle = '#475569';
            this.ctx.lineWidth = 3.5;
            this.ctx.beginPath();
            this.ctx.moveTo(-7, -82 + bounce);
            this.ctx.quadraticCurveTo(-20, -52 + bounce, 0, -45 + bounce);
            this.ctx.stroke();
            this.ctx.fillStyle = '#64748b';
            this.ctx.beginPath();
            this.ctx.arc(0, -42 + bounce, 8, 0, Math.PI * 2);
            this.ctx.fill();

            // Shield effect
            if (this.player.shield > 0) {
                this.ctx.strokeStyle = '#06b6d4';
                this.ctx.lineWidth = 4;
                this.ctx.globalAlpha = 0.5 + Math.sin(this.globalTime * 0.01) * 0.3;
                this.ctx.beginPath();
                this.ctx.arc(0, -60 + bounce, 70, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        }

        this.ctx.restore();
        this.ctx.globalAlpha = 1;
    }

    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life / 40;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }

    drawHUD() {
        // Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 44px "Space Grotesk", Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(this.score.toLocaleString(), 35, 58);

        // Multiplier
        if (this.multiplier > 1) {
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.font = 'bold 28px Arial';
            this.ctx.fillText(`x${this.multiplier}`, 35, 92);
        }

        // Coins
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.textAlign = 'right';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText(`💰 ${this.coins}`, this.width - 35, 58);

        // Lives
        let hearts = '';
        for (let i = 0; i < Math.min(this.lives, 5); i++) hearts += '❤️';
        for (let i = this.lives; i < 3; i++) hearts += '🖤';
        this.ctx.font = '36px Arial';
        this.ctx.fillText(hearts, this.width - 35, 105);

        // Streak
        if (this.streak > 0) {
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#22c55e';
            this.ctx.font = 'bold 26px Arial';
            this.ctx.fillText(`🔥 ${this.streak} Streak`, this.centerX, 58);
        }

        // Active powerups
        let py = 140;
        if (this.player.shield > 0) {
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = '#06b6d4';
            this.ctx.font = '22px Arial';
            this.ctx.fillText(`🛡️ ${Math.ceil(this.player.shield / 60)}s`, this.width - 35, py);
            py += 30;
        }
        if (this.player.magnet > 0) {
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = '#a855f7';
            this.ctx.font = '22px Arial';
            this.ctx.fillText(`🧲 ${Math.ceil(this.player.magnet / 60)}s`, this.width - 35, py);
            py += 30;
        }
        if (this.player.speedBoost > 0) {
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = '#22c55e';
            this.ctx.font = '22px Arial';
            this.ctx.fillText(`⚡ ${Math.ceil(this.player.speedBoost / 60)}s`, this.width - 35, py);
        }
    }

    drawMenu() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.88)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Title
        this.ctx.shadowColor = '#d946ef';
        this.ctx.shadowBlur = 70;
        this.ctx.fillStyle = '#d946ef';
        this.ctx.font = `bold ${Math.min(62, this.width * 0.055)}px "Space Grotesk", Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏃 ANATOMY RUSH', this.centerX, this.height * 0.16);
        this.ctx.shadowBlur = 0;

        // Subtitle
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '22px Arial';
        this.ctx.fillText('Master nursing concepts through gameplay', this.centerX, this.height * 0.24);

        // Stats
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.fillText(`🏆 Best: ${this.highScore.toLocaleString()}`, this.centerX, this.height * 0.38);
        this.ctx.fillText(`💰 Coins: ${this.totalCoins.toLocaleString()}`, this.centerX, this.height * 0.47);

        // Controls
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('← → Switch Lanes  |  SPACE/↑ Jump  |  ↓ Slide', this.centerX, this.height * 0.6);

        // Features
        this.ctx.fillStyle = '#a855f7';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('🛡️ Shield  🧲 Magnet  ⚡ Speed  ❤️ Lives  |  Collect power-ups!', this.centerX, this.height * 0.68);

        // Start prompt
        const pulse = 0.6 + Math.sin(this.globalTime * 0.005) * 0.4;
        this.ctx.globalAlpha = pulse;
        this.ctx.fillStyle = '#06b6d4';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText('[ TAP OR PRESS SPACE ]', this.centerX, this.height * 0.86);
        this.ctx.globalAlpha = 1;
    }

    drawQuestion() {
        // Timer countdown
        if (this.questionResult === null) {
            this.questionTimer--;
            if (this.questionTimer <= 0) {
                this.questionResult = 'timeout';
                this.lives--;
                this.streak = 0;
                this.multiplier = 1;
                this.shake = 12;
                this.flash = { color: '#ef4444', timer: 15 };
                if (this.lives <= 0) setTimeout(() => this.gameOver(), 800);
                else setTimeout(() => { this.state = 'playing'; this.currentQuestion = null; }, 1000);
            }
        }

        this.ctx.fillStyle = 'rgba(5,5,20,0.97)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        if (!this.currentQuestion) return;

        // Timer bar
        const pct = this.questionTimer / (this.questionTimeLimit * 60);
        const tc = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#f59e0b' : '#ef4444';
        this.ctx.fillStyle = '#1f2937';
        this.ctx.fillRect(60, 22, this.width - 120, 26);
        this.ctx.fillStyle = tc;
        this.ctx.fillRect(60, 22, (this.width - 120) * pct, 26);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.ceil(this.questionTimer / 60)}s`, this.centerX, 42);

        // Question text
        this.ctx.font = 'bold 20px Arial';
        const words = this.currentQuestion.text.split(' ');
        let line = '';
        let y = this.height * 0.12;
        const maxW = this.width * 0.85;

        words.forEach(w => {
            const test = line + w + ' ';
            if (this.ctx.measureText(test).width > maxW && line) {
                this.ctx.fillText(line.trim(), this.centerX, y);
                line = w + ' ';
                y += 30;
            } else line = test;
        });
        this.ctx.fillText(line.trim(), this.centerX, y);

        // Options
        const startY = this.height * 0.3;
        const optH = 58;
        const gap = 16;
        const margin = this.width * 0.06;

        this.currentQuestion.options.forEach((opt, i) => {
            const oY = startY + i * (optH + gap);
            let bg = '#1e1e3d';
            let border = 'rgba(139, 92, 246, 0.35)';

            if (this.questionResult) {
                if (i === this.selectedAnswer) {
                    bg = this.questionResult === 'correct' ? '#22c55e' : '#ef4444';
                    border = bg;
                }
                if (opt === this.currentQuestion.correct && this.questionResult !== 'correct') {
                    bg = '#22c55e';
                    border = '#22c55e';
                }
            }

            this.ctx.fillStyle = bg;
            this.ctx.beginPath();
            this.ctx.roundRect(margin, oY, this.width - margin * 2, optH, 14);
            this.ctx.fill();
            this.ctx.strokeStyle = border;
            this.ctx.lineWidth = 2.5;
            this.ctx.stroke();

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '17px Arial';
            this.ctx.textAlign = 'left';
            let text = `${i + 1}. ${opt}`;
            const maxT = this.width - margin * 2 - 40;
            while (this.ctx.measureText(text).width > maxT && text.length > 15) {
                text = text.slice(0, -4) + '...';
            }
            this.ctx.fillText(text, margin + 20, oY + 37);
        });

        // Result
        if (this.questionResult) {
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold 38px Arial';
            if (this.questionResult === 'correct') {
                this.ctx.fillStyle = '#22c55e';
                this.ctx.fillText(`✓ CORRECT! +${20 * this.multiplier} coins`, this.centerX, this.height - 50);
            } else if (this.questionResult === 'timeout') {
                this.ctx.fillStyle = '#ef4444';
                this.ctx.fillText('⏱️ TIME UP!', this.centerX, this.height - 50);
            } else {
                this.ctx.fillStyle = '#ef4444';
                this.ctx.fillText('✗ WRONG!', this.centerX, this.height - 50);
            }
        }
    }

    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.93)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Title
        this.ctx.shadowColor = '#ef4444';
        this.ctx.shadowBlur = 70;
        this.ctx.fillStyle = '#ef4444';
        this.ctx.font = `bold ${Math.min(70, this.width * 0.065)}px "Space Grotesk", Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.centerX, this.height * 0.2);
        this.ctx.shadowBlur = 0;

        // Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 44px Arial';
        this.ctx.fillText(`Score: ${this.score.toLocaleString()}`, this.centerX, this.height * 0.36);

        // High score
        if (this.score >= this.highScore) {
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.font = 'bold 38px Arial';
            this.ctx.fillText('🏆 NEW BEST! 🏆', this.centerX, this.height * 0.48);
        } else {
            this.ctx.fillStyle = '#888';
            this.ctx.font = '28px Arial';
            this.ctx.fillText(`Best: ${this.highScore.toLocaleString()}`, this.centerX, this.height * 0.48);
        }

        // Coins
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText(`💰 ${this.coins} coins earned`, this.centerX, this.height * 0.6);

        // XP
        this.ctx.fillStyle = '#22c55e';
        this.ctx.font = '26px Arial';
        this.ctx.fillText(`+${Math.floor(this.score / 10)} XP`, this.centerX, this.height * 0.7);

        // Retry prompt
        const pulse = 0.6 + Math.sin(this.globalTime * 0.005) * 0.4;
        this.ctx.globalAlpha = pulse;
        this.ctx.fillStyle = '#06b6d4';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.fillText('[ PRESS SPACE TO RETRY ]', this.centerX, this.height * 0.87);
        this.ctx.globalAlpha = 1;
    }

    loop(ts) {
        const dt = Math.min(ts - this.lastTime, 50);
        this.lastTime = ts;
        this.update(dt);
        this.render();
        if (this.running) requestAnimationFrame(t => this.loop(t));
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.lastTime = performance.now();
            requestAnimationFrame(t => this.loop(t));
        }
    }

    stop() {
        this.running = false;
        if (this._kh) document.removeEventListener('keydown', this._kh);
    }
}

// Global instance
let anatomyRunner = null;

function initGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    if (anatomyRunner) anatomyRunner.stop();

    anatomyRunner = new AnatomyRush(canvas);
    anatomyRunner.start();
}

function stopGame() {
    if (anatomyRunner) {
        anatomyRunner.stop();
        anatomyRunner = null;
    }
}

window.addEventListener('resize', () => {
    if (anatomyRunner) anatomyRunner.resize();
});
