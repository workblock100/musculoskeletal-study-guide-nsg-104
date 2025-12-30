// ANATOMY RUSH - Award Winning Edition 2025
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

        this.player = { y: 0, jumpHeight: 0, jumpVelocity: 0, isJumping: false, isSliding: false, slideTimer: 0, animFrame: 0, invincible: 0 };
        this.speed = 1;
        this.maxSpeed = 2.8;

        this.obstacles = [];
        this.coins_arr = [];
        this.particles = [];
        this.buildings = [];

        // Questions much less frequent - first at 2500, then every 2000+
        this.questionDistance = 2500;
        this.nextQuestionAt = this.questionDistance;
        this.questionIncrement = 2000;
        this.currentQuestion = null;
        this.questionTimer = 0;
        this.questionTimeLimit = 12;
        this.selectedAnswer = -1;
        this.questionResult = null;

        this.lastObstacle = 0;
        this.obstacleGap = 400;
        this.shake = 0;
        this.flash = null;
        this.running = false;
        this.lastTime = 0;
        this.globalTime = 0;

        // Generate city buildings
        for (let i = 0; i < 20; i++) {
            this.buildings.push({
                x: i * 120,
                height: 100 + Math.random() * 200,
                width: 60 + Math.random() * 40,
                windows: Math.floor(Math.random() * 4) + 2,
                hue: Math.random() * 60 + 200
            });
        }

        this.bindEvents();
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = Math.min(container.offsetWidth - 40, 1400);
        this.canvas.height = Math.min(window.innerHeight - 140, 750);
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.centerX = this.width / 2;
    }

    bindEvents() {
        const handleKey = (e) => {
            const keys = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Digit1', 'Digit2', 'Digit3', 'Digit4'];
            if (keys.includes(e.code)) { e.preventDefault(); e.stopPropagation(); }

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
            }
        };
        document.removeEventListener('keydown', this._kh);
        this._kh = handleKey;
        document.addEventListener('keydown', this._kh);

        this.canvas.addEventListener('click', (e) => {
            if (this.state === 'menu') { this.startGame(); return; }
            if (this.state === 'gameover') { this.state = 'menu'; return; }
            if (this.state === 'question') this.handleQuestionClick(e);
        });

        let tx = 0, ty = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            tx = e.touches[0].clientX; ty = e.touches[0].clientY;
            if (this.state === 'menu') this.startGame();
            if (this.state === 'gameover') this.state = 'menu';
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.state !== 'playing') return;
            const dx = e.touches[0].clientX - tx, dy = e.touches[0].clientY - ty;
            if (Math.abs(dx) > 40) { this.switchLane(dx > 0 ? 1 : -1); tx = e.touches[0].clientX; }
            if (dy < -50) { this.jump(); ty = e.touches[0].clientY; }
            if (dy > 50) { this.slide(); ty = e.touches[0].clientY; }
        }, { passive: false });

        window.addEventListener('resize', () => this.resize());
    }

    switchLane(dir) {
        const nl = this.targetLane + dir;
        if (nl >= 0 && nl < 3) { this.targetLane = nl; this.addParticles(this.getLaneX(this.currentLane), this.height - 100, 6, '#a855f7'); }
    }

    jump() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.isJumping = true;
            this.player.jumpVelocity = 20;
            this.addParticles(this.getLaneX(this.currentLane), this.height - 80, 12, '#06b6d4');
        }
    }

    slide() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.isSliding = true;
            this.player.slideTimer = 40;
        }
    }

    addParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8 - 3,
                size: 4 + Math.random() * 4, life: 30, color
            });
        }
    }

    getLaneX(lane) { return this.centerX + (lane - 1) * this.laneWidth; }

    startGame() {
        this.state = 'playing';
        this.score = 0; this.coins = 0; this.lives = 3; this.streak = 0; this.multiplier = 1;
        this.distance = 0; this.speed = 1; this.currentLane = 1; this.targetLane = 1;
        this.obstacles = []; this.coins_arr = []; this.particles = [];
        this.player.isJumping = false; this.player.isSliding = false; this.player.jumpHeight = 0; this.player.invincible = 0;
        this.lastObstacle = 0; this.nextQuestionAt = this.questionDistance;
    }

    update(dt) {
        this.globalTime += dt;
        if (this.shake > 0) this.shake *= 0.9;
        if (this.flash) { this.flash.timer--; if (this.flash.timer <= 0) this.flash = null; }
        if (this.player.invincible > 0) this.player.invincible--;

        this.particles = this.particles.filter(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life--; p.size *= 0.96;
            return p.life > 0;
        });

        // Scroll buildings
        this.buildings.forEach(b => {
            b.x -= this.speed * 0.5;
            if (b.x < -b.width) b.x = this.width + Math.random() * 100;
        });

        if (this.state !== 'playing') return;

        if (this.speed < this.maxSpeed) this.speed += 0.00015;
        this.distance += this.speed * 6;
        this.score = Math.floor(this.distance / 10) * this.multiplier;

        const diff = this.targetLane - this.currentLane;
        this.currentLane += diff * 0.15;

        if (this.player.isJumping) {
            this.player.jumpHeight += this.player.jumpVelocity;
            this.player.jumpVelocity -= 0.95;
            if (this.player.jumpHeight <= 0) { this.player.jumpHeight = 0; this.player.isJumping = false; }
        }

        if (this.player.isSliding) {
            this.player.slideTimer--;
            if (this.player.slideTimer <= 0) this.player.isSliding = false;
        }

        this.player.animFrame = (this.player.animFrame + 0.3) % 8;

        if (this.distance - this.lastObstacle > this.obstacleGap / this.speed) {
            this.spawnObstacle();
            this.lastObstacle = this.distance;
        }

        if (Math.random() < 0.012) this.spawnCoin();
        this.updateObstacles();
        this.updateCoins();

        if (this.distance >= this.nextQuestionAt) {
            this.triggerQuestion();
            this.nextQuestionAt += this.questionIncrement + Math.floor(this.distance / 1000) * 200;
        }
    }

    spawnObstacle() {
        const lane = Math.floor(Math.random() * 3);
        const isHigh = Math.random() > 0.65;
        this.obstacles.push({ lane, z: 1800, type: isHigh ? 'high' : 'low', hit: false });
    }

    spawnCoin() {
        const lane = Math.floor(Math.random() * 3);
        this.coins_arr.push({ lane, z: 1800, elevated: Math.random() > 0.5, collected: false, bob: Math.random() * 6.28 });
    }

    updateObstacles() {
        this.obstacles = this.obstacles.filter(obs => {
            obs.z -= this.speed * 18;
            if (obs.z < 100 && obs.z > -40 && !obs.hit && this.player.invincible <= 0) {
                if (obs.lane === Math.round(this.currentLane)) {
                    if (obs.type === 'high' && !this.player.isSliding) { this.hitObstacle(); obs.hit = true; }
                    else if (obs.type === 'low' && this.player.jumpHeight < 60) { this.hitObstacle(); obs.hit = true; }
                }
            }
            return obs.z > -300;
        });
    }

    updateCoins() {
        this.coins_arr = this.coins_arr.filter(c => {
            c.z -= this.speed * 18;
            c.bob += 0.12;
            if (c.z < 100 && c.z > -40 && !c.collected && c.lane === Math.round(this.currentLane)) {
                if (!c.elevated || this.player.jumpHeight > 40) {
                    c.collected = true; this.coins++; this.totalCoins++;
                    localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
                    this.addParticles(this.getLaneX(c.lane), this.height - 180, 10, '#fbbf24');
                }
            }
            return c.z > -300 && !c.collected;
        });
    }

    hitObstacle() {
        this.lives--; this.streak = 0; this.multiplier = 1; this.shake = 18;
        this.flash = { color: '#ef4444', timer: 15 }; this.player.invincible = 90;
        this.addParticles(this.getLaneX(Math.round(this.currentLane)), this.height - 120, 25, '#ef4444');
        if (this.lives <= 0) this.gameOver();
    }

    gameOver() {
        this.state = 'gameover';
        if (this.score > this.highScore) { this.highScore = this.score; localStorage.setItem('anatomyRush2025HS', this.highScore); }
        if (typeof awardXP === 'function') awardXP(Math.floor(this.score / 10), 'game');
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
                this.currentQuestion = { text: q.q, options: this.shuffle([...q.options]).slice(0, 4), correct: q.correctAnswer };
                return;
            }
        }
        this.currentQuestion = { text: "What is the priority intervention for compartment syndrome?", options: ["Notify surgeon immediately", "Elevate extremity high", "Apply warm compress", "Give pain medication"], correct: "Notify surgeon immediately" };
    }

    shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

    selectAnswer(idx) {
        if (this.questionResult !== null || idx >= this.currentQuestion.options.length) return;
        this.selectedAnswer = idx;
        const correct = this.currentQuestion.options[idx] === this.currentQuestion.correct;

        if (correct) {
            this.questionResult = 'correct'; this.streak++; this.multiplier = Math.min(5, 1 + Math.floor(this.streak / 2));
            this.coins += 15 * this.multiplier; this.totalCoins += 15 * this.multiplier;
            localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
            this.flash = { color: '#22c55e', timer: 15 };
        } else {
            this.questionResult = 'wrong'; this.lives--; this.streak = 0; this.multiplier = 1;
            this.shake = 12; this.flash = { color: '#ef4444', timer: 12 };
            if (this.lives <= 0) { setTimeout(() => this.gameOver(), 800); return; }
        }
        setTimeout(() => { this.state = 'playing'; this.currentQuestion = null; }, 900);
    }

    handleQuestionClick(e) {
        if (!this.currentQuestion || this.questionResult !== null) return;
        const rect = this.canvas.getBoundingClientRect();
        const sx = this.width / rect.width, sy = this.height / rect.height;
        const x = (e.clientX - rect.left) * sx, y = (e.clientY - rect.top) * sy;
        const startY = this.height * 0.32, optH = 55, gap = 14, margin = this.width * 0.08;
        for (let i = 0; i < this.currentQuestion.options.length; i++) {
            const oY = startY + i * (optH + gap);
            if (x >= margin && x <= this.width - margin && y >= oY && y <= oY + optH) { this.selectAnswer(i); break; }
        }
    }

    render() {
        this.ctx.save();
        if (this.shake > 0) this.ctx.translate((Math.random() - 0.5) * this.shake * 2, (Math.random() - 0.5) * this.shake * 2);

        this.drawBackground();
        this.drawRoad();
        this.drawObstacles();
        this.drawCoins();
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
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.4, '#0f172a');
        grad.addColorStop(1, '#1e1b4b');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Stars
        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < 100; i++) {
            const x = (i * 137.5 + this.globalTime * 0.008) % this.width;
            const y = (i * 47.3) % (this.height * 0.35);
            this.ctx.globalAlpha = 0.3 + Math.sin(this.globalTime * 0.003 + i) * 0.3;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1 + (i % 2) * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;

        // City skyline
        this.buildings.forEach(b => {
            this.ctx.fillStyle = `hsl(${b.hue}, 30%, 12%)`;
            this.ctx.fillRect(b.x, this.height * 0.35 - b.height, b.width, b.height);
            // Windows
            this.ctx.fillStyle = `rgba(255, 200, 100, ${0.3 + Math.sin(this.globalTime * 0.002 + b.x) * 0.2})`;
            const ww = 8, wh = 10, gap = 15;
            for (let row = 0; row < Math.floor(b.height / gap) - 1; row++) {
                for (let col = 0; col < b.windows; col++) {
                    if (Math.random() > 0.3) this.ctx.fillRect(b.x + 8 + col * (ww + 8), this.height * 0.35 - b.height + 15 + row * gap, ww, wh);
                }
            }
        });

        // Horizon glow
        const hg = this.ctx.createRadialGradient(this.centerX, this.height * 0.4, 0, this.centerX, this.height * 0.4, this.width * 0.7);
        hg.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
        hg.addColorStop(1, 'transparent');
        this.ctx.fillStyle = hg;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawRoad() {
        const horizonY = this.height * 0.4, roadW = 500, segs = 45;
        for (let i = segs; i >= 0; i--) {
            const z = i / segs, nz = (i + 1) / segs;
            const p = 1 / (1 + z * 5), np = 1 / (1 + nz * 5);
            const y = horizonY + (this.height - horizonY) * (1 - Math.pow(z, 0.55));
            const ny = horizonY + (this.height - horizonY) * (1 - Math.pow(nz, 0.55));
            const w = roadW * p, nw = roadW * np;

            const stripe = Math.floor((i + this.distance / 25) % 4) < 2;
            this.ctx.fillStyle = stripe ? '#18181b' : '#0f0f12';
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX - nw, ny);
            this.ctx.lineTo(this.centerX + nw, ny);
            this.ctx.lineTo(this.centerX + w, y);
            this.ctx.lineTo(this.centerX - w, y);
            this.ctx.closePath();
            this.ctx.fill();

            if (i < segs - 1 && i % 2 === 0) {
                this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.4 * (1 - z)})`;
                this.ctx.lineWidth = 2 * p;
                for (let lane = 0; lane < 2; lane++) {
                    const lo = (lane - 0.5) * this.laneWidth;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.centerX + lo * np, ny);
                    this.ctx.lineTo(this.centerX + lo * p, y);
                    this.ctx.stroke();
                }
            }
        }

        // Neon rails
        this.ctx.shadowColor = '#d946ef'; this.ctx.shadowBlur = 25;
        this.ctx.strokeStyle = '#d946ef'; this.ctx.lineWidth = 4;
        this.ctx.beginPath(); this.ctx.moveTo(this.centerX - 100, horizonY); this.ctx.lineTo(this.centerX - roadW, this.height); this.ctx.stroke();
        this.ctx.beginPath(); this.ctx.moveTo(this.centerX + 100, horizonY); this.ctx.lineTo(this.centerX + roadW, this.height); this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    drawObstacles() {
        const horizonY = this.height * 0.4;
        [...this.obstacles].sort((a, b) => b.z - a.z).forEach(obs => {
            if (obs.z < 0 || obs.z > 1800) return;
            const zn = obs.z / 1800, p = 1 / (1 + zn * 5);
            const y = horizonY + (this.height - horizonY) * (1 - Math.pow(zn, 0.55));
            const x = this.centerX + (obs.lane - 1) * this.laneWidth * p;
            const w = 70 * p, h = (obs.type === 'high' ? 55 : 100) * p;

            this.ctx.save();
            if (obs.type === 'high') {
                this.ctx.shadowColor = '#f59e0b'; this.ctx.shadowBlur = 20 * p;
                this.ctx.fillStyle = '#b45309'; this.ctx.fillRect(x - w / 2 + 5 * p, y - h - 70 * p + 5 * p, w, h);
                this.ctx.fillStyle = '#f59e0b'; this.ctx.fillRect(x - w / 2, y - h - 70 * p, w, h);
                for (let s = 0; s < 4; s++) this.ctx.fillRect(x - w / 2 + s * w / 4, y - h - 70 * p, w / 8, h);
            } else {
                this.ctx.shadowColor = '#ef4444'; this.ctx.shadowBlur = 20 * p;
                this.ctx.fillStyle = '#991b1b'; this.ctx.fillRect(x - w / 2 + 5 * p, y - h + 5 * p, w - 5 * p, h - 10 * p);
                this.ctx.fillStyle = '#ef4444'; this.ctx.fillRect(x - w / 2, y - h, w - 5 * p, h - 10 * p);
                this.ctx.fillStyle = '#450a0a';
                for (let s = 0; s < 4; s++) this.ctx.fillRect(x - w / 2 + s * w / 4, y - h, w / 8, h - 10 * p);
            }
            this.ctx.restore();
        });
    }

    drawCoins() {
        const horizonY = this.height * 0.4;
        this.coins_arr.forEach(c => {
            if (c.collected || c.z < 0 || c.z > 1800) return;
            const zn = c.z / 1800, p = 1 / (1 + zn * 5);
            const baseY = horizonY + (this.height - horizonY) * (1 - Math.pow(zn, 0.55));
            const x = this.centerX + (c.lane - 1) * this.laneWidth * p;
            const y = baseY - (45 + (c.elevated ? 80 : 0)) * p + Math.sin(c.bob) * 5 * p;

            this.ctx.save();
            this.ctx.shadowColor = '#fbbf24'; this.ctx.shadowBlur = 18 * p;
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.beginPath(); this.ctx.arc(x, y, 16 * p, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = '#92400e'; this.ctx.font = `bold ${14 * p}px Arial`; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
            this.ctx.fillText('$', x, y);
            this.ctx.restore();
        });
    }

    drawPlayer() {
        const x = this.getLaneX(this.currentLane), groundY = this.height - 50, y = groundY - this.player.jumpHeight;
        if (this.player.invincible > 0 && Math.floor(this.player.invincible / 6) % 2 === 0) this.ctx.globalAlpha = 0.5;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.shadowColor = '#38bdf8'; this.ctx.shadowBlur = 30;

        const bounce = this.player.isJumping ? 0 : Math.sin(this.player.animFrame * 0.6) * 4;
        const armSwing = Math.sin(this.player.animFrame * 0.8) * 28;
        const legSwing = Math.sin(this.player.animFrame * 0.8) * 22;

        if (this.player.isSliding) {
            this.ctx.fillStyle = '#38bdf8';
            this.ctx.beginPath(); this.ctx.ellipse(0, -18, 50, 22, 0, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.beginPath(); this.ctx.arc(28, -28, 20, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = '#fff'; this.ctx.fillRect(14, -50, 28, 10);
            this.ctx.fillStyle = '#ef4444'; this.ctx.fillRect(24, -48, 8, 6); this.ctx.fillRect(20, -46, 16, 3);
        } else {
            // Legs
            this.ctx.fillStyle = '#0284c7';
            this.ctx.save(); this.ctx.translate(-14, -18 + bounce); this.ctx.rotate(legSwing * Math.PI / 180);
            this.ctx.fillRect(-7, 0, 14, 38);
            this.ctx.fillStyle = '#1e3a5f'; this.ctx.fillRect(-9, 35, 18, 10);
            this.ctx.restore();

            this.ctx.fillStyle = '#0284c7';
            this.ctx.save(); this.ctx.translate(14, -18 + bounce); this.ctx.rotate(-legSwing * Math.PI / 180);
            this.ctx.fillRect(-7, 0, 14, 38);
            this.ctx.fillStyle = '#1e3a5f'; this.ctx.fillRect(-9, 35, 18, 10);
            this.ctx.restore();

            // Body
            this.ctx.fillStyle = '#38bdf8';
            this.ctx.beginPath(); this.ctx.roundRect(-26, -80 + bounce, 52, 65, 10); this.ctx.fill();
            this.ctx.strokeStyle = '#0c4a6e'; this.ctx.lineWidth = 2;
            this.ctx.beginPath(); this.ctx.moveTo(-12, -80 + bounce); this.ctx.lineTo(0, -62 + bounce); this.ctx.lineTo(12, -80 + bounce); this.ctx.stroke();

            // Arms
            this.ctx.save(); this.ctx.translate(-32, -68 + bounce); this.ctx.rotate(-armSwing * Math.PI / 180);
            this.ctx.fillStyle = '#38bdf8'; this.ctx.fillRect(-6, 0, 12, 28);
            this.ctx.fillStyle = '#fcd34d'; this.ctx.fillRect(-5, 25, 10, 22);
            this.ctx.restore();

            this.ctx.save(); this.ctx.translate(32, -68 + bounce); this.ctx.rotate(armSwing * Math.PI / 180);
            this.ctx.fillStyle = '#38bdf8'; this.ctx.fillRect(-6, 0, 12, 28);
            this.ctx.fillStyle = '#fcd34d'; this.ctx.fillRect(-5, 25, 10, 22);
            this.ctx.restore();

            // Head
            this.ctx.fillStyle = '#fcd34d';
            this.ctx.beginPath(); this.ctx.arc(0, -100 + bounce, 24, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = '#4a3728';
            this.ctx.beginPath(); this.ctx.arc(0, -105 + bounce, 24, Math.PI, 0); this.ctx.fill();

            // Nurse cap
            this.ctx.fillStyle = '#fff'; this.ctx.fillRect(-20, -132 + bounce, 40, 14);
            this.ctx.fillStyle = '#ef4444'; this.ctx.fillRect(-5, -129 + bounce, 10, 10); this.ctx.fillRect(-10, -127 + bounce, 20, 5);

            // Face
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath(); this.ctx.ellipse(-9, -102 + bounce, 7, 8, 0, 0, Math.PI * 2); this.ctx.ellipse(9, -102 + bounce, 7, 8, 0, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = '#1e293b';
            this.ctx.beginPath(); this.ctx.arc(-7, -101 + bounce, 3, 0, Math.PI * 2); this.ctx.arc(11, -101 + bounce, 3, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.strokeStyle = '#92400e'; this.ctx.lineWidth = 2;
            this.ctx.beginPath(); this.ctx.arc(0, -93 + bounce, 9, 0.2, Math.PI - 0.2); this.ctx.stroke();

            // Stethoscope
            this.ctx.strokeStyle = '#475569'; this.ctx.lineWidth = 3;
            this.ctx.beginPath(); this.ctx.moveTo(-6, -78 + bounce); this.ctx.quadraticCurveTo(-18, -50 + bounce, 0, -44 + bounce); this.ctx.stroke();
            this.ctx.fillStyle = '#64748b'; this.ctx.beginPath(); this.ctx.arc(0, -41 + bounce, 7, 0, Math.PI * 2); this.ctx.fill();
        }

        this.ctx.restore();
        this.ctx.globalAlpha = 1;
    }

    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life / 35;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }

    drawHUD() {
        this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 40px "Space Grotesk", Arial'; this.ctx.textAlign = 'left';
        this.ctx.fillText(this.score.toLocaleString(), 30, 55);
        if (this.multiplier > 1) { this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 26px Arial'; this.ctx.fillText(`x${this.multiplier}`, 30, 88); }
        this.ctx.fillStyle = '#fbbf24'; this.ctx.textAlign = 'right'; this.ctx.font = 'bold 30px Arial';
        this.ctx.fillText(`💰 ${this.coins}`, this.width - 30, 55);
        let hearts = ''; for (let i = 0; i < 3; i++) hearts += i < this.lives ? '❤️' : '🖤';
        this.ctx.font = '34px Arial'; this.ctx.fillText(hearts, this.width - 30, 100);
        if (this.streak > 0) { this.ctx.textAlign = 'center'; this.ctx.fillStyle = '#22c55e'; this.ctx.font = 'bold 24px Arial'; this.ctx.fillText(`🔥 ${this.streak} Streak`, this.centerX, 55); }
    }

    drawMenu() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.85)'; this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.shadowColor = '#d946ef'; this.ctx.shadowBlur = 60; this.ctx.fillStyle = '#d946ef';
        this.ctx.font = `bold ${Math.min(58, this.width * 0.055)}px "Space Grotesk", Arial`; this.ctx.textAlign = 'center';
        this.ctx.fillText('🏃 ANATOMY RUSH', this.centerX, this.height * 0.18); this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#94a3b8'; this.ctx.font = '20px Arial';
        this.ctx.fillText('Master nursing concepts through gameplay', this.centerX, this.height * 0.26);
        this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText(`🏆 Best: ${this.highScore.toLocaleString()}`, this.centerX, this.height * 0.4);
        this.ctx.fillText(`💰 Coins: ${this.totalCoins.toLocaleString()}`, this.centerX, this.height * 0.49);
        this.ctx.fillStyle = '#fff'; this.ctx.font = '17px Arial';
        this.ctx.fillText('← → Switch Lanes  |  SPACE/↑ Jump  |  ↓ Slide', this.centerX, this.height * 0.64);
        this.ctx.fillText('Answer questions to earn bonus coins!', this.centerX, this.height * 0.71);
        const pulse = 0.6 + Math.sin(this.globalTime * 0.005) * 0.4;
        this.ctx.globalAlpha = pulse; this.ctx.fillStyle = '#06b6d4'; this.ctx.font = 'bold 30px Arial';
        this.ctx.fillText('[ TAP OR PRESS SPACE ]', this.centerX, this.height * 0.88); this.ctx.globalAlpha = 1;
    }

    drawQuestion() {
        if (this.questionResult === null) {
            this.questionTimer--;
            if (this.questionTimer <= 0) {
                this.questionResult = 'timeout'; this.lives--; this.streak = 0; this.multiplier = 1; this.shake = 12; this.flash = { color: '#ef4444', timer: 12 };
                if (this.lives <= 0) setTimeout(() => this.gameOver(), 800);
                else setTimeout(() => { this.state = 'playing'; this.currentQuestion = null; }, 900);
            }
        }
        this.ctx.fillStyle = 'rgba(5,5,20,0.96)'; this.ctx.fillRect(0, 0, this.width, this.height);
        if (!this.currentQuestion) return;

        const pct = this.questionTimer / (this.questionTimeLimit * 60);
        const tc = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#f59e0b' : '#ef4444';
        this.ctx.fillStyle = '#1f2937'; this.ctx.fillRect(60, 25, this.width - 120, 24);
        this.ctx.fillStyle = tc; this.ctx.fillRect(60, 25, (this.width - 120) * pct, 24);
        this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 18px Arial'; this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.ceil(this.questionTimer / 60)}s`, this.centerX, 43);

        this.ctx.font = 'bold 19px Arial';
        const words = this.currentQuestion.text.split(' ');
        let line = '', y = this.height * 0.13, maxW = this.width * 0.82;
        words.forEach(w => {
            const test = line + w + ' ';
            if (this.ctx.measureText(test).width > maxW && line) { this.ctx.fillText(line.trim(), this.centerX, y); line = w + ' '; y += 28; }
            else line = test;
        });
        this.ctx.fillText(line.trim(), this.centerX, y);

        const startY = this.height * 0.32, optH = 55, gap = 14, margin = this.width * 0.08;
        this.currentQuestion.options.forEach((opt, i) => {
            const oY = startY + i * (optH + gap);
            let bg = '#1e1e38', border = 'rgba(139, 92, 246, 0.3)';
            if (this.questionResult) {
                if (i === this.selectedAnswer) { bg = this.questionResult === 'correct' ? '#22c55e' : '#ef4444'; border = bg; }
                if (opt === this.currentQuestion.correct && this.questionResult !== 'correct') { bg = '#22c55e'; border = '#22c55e'; }
            }
            this.ctx.fillStyle = bg; this.ctx.beginPath(); this.ctx.roundRect(margin, oY, this.width - margin * 2, optH, 12); this.ctx.fill();
            this.ctx.strokeStyle = border; this.ctx.lineWidth = 2; this.ctx.stroke();
            this.ctx.fillStyle = '#fff'; this.ctx.font = '16px Arial'; this.ctx.textAlign = 'left';
            let text = `${i + 1}. ${opt}`;
            const maxT = this.width - margin * 2 - 35;
            while (this.ctx.measureText(text).width > maxT && text.length > 12) text = text.slice(0, -4) + '...';
            this.ctx.fillText(text, margin + 18, oY + 35);
        });

        if (this.questionResult) {
            this.ctx.textAlign = 'center'; this.ctx.font = 'bold 34px Arial';
            if (this.questionResult === 'correct') { this.ctx.fillStyle = '#22c55e'; this.ctx.fillText(`✓ CORRECT! +${15 * this.multiplier} coins`, this.centerX, this.height - 55); }
            else if (this.questionResult === 'timeout') { this.ctx.fillStyle = '#ef4444'; this.ctx.fillText('⏱️ TIME UP!', this.centerX, this.height - 55); }
            else { this.ctx.fillStyle = '#ef4444'; this.ctx.fillText('✗ WRONG!', this.centerX, this.height - 55); }
        }
    }

    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.92)'; this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.shadowColor = '#ef4444'; this.ctx.shadowBlur = 60; this.ctx.fillStyle = '#ef4444';
        this.ctx.font = `bold ${Math.min(65, this.width * 0.065)}px "Space Grotesk", Arial`; this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.centerX, this.height * 0.22); this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 40px Arial';
        this.ctx.fillText(`Score: ${this.score.toLocaleString()}`, this.centerX, this.height * 0.38);
        if (this.score >= this.highScore) { this.ctx.fillStyle = '#fbbf24'; this.ctx.fillText('🏆 NEW BEST! 🏆', this.centerX, this.height * 0.5); }
        else { this.ctx.fillStyle = '#888'; this.ctx.font = '26px Arial'; this.ctx.fillText(`Best: ${this.highScore.toLocaleString()}`, this.centerX, this.height * 0.5); }
        this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 30px Arial'; this.ctx.fillText(`💰 ${this.coins} coins earned`, this.centerX, this.height * 0.62);
        this.ctx.fillStyle = '#22c55e'; this.ctx.font = '24px Arial'; this.ctx.fillText(`+${Math.floor(this.score / 10)} XP`, this.centerX, this.height * 0.71);
        const pulse = 0.6 + Math.sin(this.globalTime * 0.005) * 0.4;
        this.ctx.globalAlpha = pulse; this.ctx.fillStyle = '#06b6d4'; this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('[ PRESS SPACE TO RETRY ]', this.centerX, this.height * 0.88); this.ctx.globalAlpha = 1;
    }

    loop(ts) {
        const dt = Math.min(ts - this.lastTime, 50);
        this.lastTime = ts;
        this.update(dt);
        this.render();
        if (this.running) requestAnimationFrame(t => this.loop(t));
    }

    start() { if (!this.running) { this.running = true; this.lastTime = performance.now(); requestAnimationFrame(t => this.loop(t)); } }
    stop() { this.running = false; if (this._kh) document.removeEventListener('keydown', this._kh); }
}

let anatomyRunner = null;
function initGame() {
    const c = document.getElementById('gameCanvas');
    if (!c) return;
    if (anatomyRunner) anatomyRunner.stop();
    anatomyRunner = new AnatomyRush(c);
    anatomyRunner.start();
}
function stopGame() { if (anatomyRunner) { anatomyRunner.stop(); anatomyRunner = null; } }
window.addEventListener('resize', () => { if (anatomyRunner) anatomyRunner.resize(); });
