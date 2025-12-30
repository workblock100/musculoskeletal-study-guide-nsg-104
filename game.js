// ============================================
// ANATOMY RUSH 2025 - Premium Endless Runner
// Modern graphics, proper character, timed questions
// ============================================

class AnatomyRush {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();

        // Game state
        this.state = 'menu';
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.streak = 0;
        this.multiplier = 1;
        this.distance = 0;
        this.highScore = parseInt(localStorage.getItem('anatomyRush2025HS')) || 0;
        this.totalCoins = parseInt(localStorage.getItem('anatomyRush2025Coins')) || 0;

        // Lanes
        this.lanes = 3;
        this.currentLane = 1;
        this.targetLane = 1;
        this.laneWidth = 140;

        // Player - Full character with arms
        this.player = {
            y: 0,
            jumpHeight: 0,
            jumpVelocity: 0,
            isJumping: false,
            isSliding: false,
            slideTimer: 0,
            animFrame: 0,
            animTimer: 0,
            invincible: 0
        };

        // Speed
        this.speed = 1;
        this.maxSpeed = 3;

        // Game objects
        this.obstacles = [];
        this.coins_arr = [];
        this.particles = [];
        this.trails = [];

        // Question system - IMPROVED
        this.questionDistance = 800; // First question after 800 distance
        this.nextQuestionAt = this.questionDistance;
        this.questionIncrement = 600; // Questions get further apart
        this.currentQuestion = null;
        this.questionTimer = 0;
        this.questionTimeLimit = 10; // 10 second timer!
        this.selectedAnswer = -1;
        this.questionResult = null;

        // Obstacle spawning
        this.lastObstacle = 0;
        this.obstacleGap = 300;

        // Effects
        this.shake = 0;
        this.flash = null;

        // Animation
        this.running = false;
        this.lastTime = 0;
        this.globalTime = 0;

        // Colors - 2025 neon aesthetic
        this.colors = {
            bg1: '#0a0a1a',
            bg2: '#1a1033',
            road: '#12121f',
            lane: '#a855f7',
            neon: '#d946ef',
            cyan: '#06b6d4',
            player: '#38bdf8',
            obstacle: '#f43f5e',
            coin: '#fbbf24',
            success: '#22c55e',
            danger: '#ef4444'
        };

        this.bindEvents();
    }

    resize() {
        const container = this.canvas.parentElement;
        const maxW = Math.min(container.offsetWidth - 32, 1200);
        const maxH = Math.min(window.innerHeight - 200, 675);

        // 16:9 aspect ratio
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
        const handleKey = (e) => {
            const gameKeys = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Digit1', 'Digit2', 'Digit3', 'Digit4'];

            if (gameKeys.includes(e.code)) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (this.state === 'menu') {
                if (e.code === 'Space' || e.code === 'Enter') this.startGame();
                return;
            }

            if (this.state === 'gameover') {
                if (e.code === 'Space' || e.code === 'Enter') this.state = 'menu';
                return;
            }

            if (this.state === 'question') {
                const num = parseInt(e.code.replace('Digit', ''));
                if (num >= 1 && num <= 4) this.selectAnswer(num - 1);
                return;
            }

            if (this.state === 'playing') {
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.switchLane(-1);
                if (e.code === 'ArrowRight' || e.code === 'KeyD') this.switchLane(1);
                if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') this.jump();
                if (e.code === 'ArrowDown' || e.code === 'KeyS') this.slide();
            }
        };

        document.removeEventListener('keydown', this._keyHandler);
        this._keyHandler = handleKey;
        document.addEventListener('keydown', this._keyHandler);

        // Touch
        let touchX = 0, touchY = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchX = e.touches[0].clientX;
            touchY = e.touches[0].clientY;
            if (this.state === 'menu') this.startGame();
            if (this.state === 'gameover') this.state = 'menu';
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.state !== 'playing') return;
            const dx = e.touches[0].clientX - touchX;
            const dy = e.touches[0].clientY - touchY;
            if (Math.abs(dx) > 40) {
                this.switchLane(dx > 0 ? 1 : -1);
                touchX = e.touches[0].clientX;
            }
            if (dy < -50) { this.jump(); touchY = e.touches[0].clientY; }
            if (dy > 50) { this.slide(); touchY = e.touches[0].clientY; }
        }, { passive: false });

        // Click
        this.canvas.addEventListener('click', (e) => {
            if (this.state === 'menu') { this.startGame(); return; }
            if (this.state === 'gameover') { this.state = 'menu'; return; }
            if (this.state === 'question') this.handleQuestionClick(e);
        });

        window.addEventListener('resize', () => this.resize());
    }

    switchLane(dir) {
        const newLane = this.targetLane + dir;
        if (newLane >= 0 && newLane < this.lanes) {
            this.targetLane = newLane;
            this.addTrailParticle();
        }
    }

    jump() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.isJumping = true;
            this.player.jumpVelocity = 18;
            this.addJumpBurst();
        }
    }

    slide() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.isSliding = true;
            this.player.slideTimer = 35;
        }
    }

    addJumpBurst() {
        const x = this.getLaneX(this.currentLane);
        for (let i = 0; i < 12; i++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
            this.particles.push({
                x, y: this.height - 100,
                vx: Math.cos(angle) * (2 + Math.random() * 3),
                vy: Math.sin(angle) * (2 + Math.random() * 3),
                size: 4 + Math.random() * 4,
                life: 30,
                color: this.colors.cyan
            });
        }
    }

    addTrailParticle() {
        this.trails.push({
            x: this.getLaneX(this.currentLane),
            y: this.height - 80,
            alpha: 1,
            lane: this.currentLane
        });
    }

    getLaneX(lane) {
        return this.centerX + (lane - 1) * this.laneWidth;
    }

    startGame() {
        this.state = 'playing';
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.streak = 0;
        this.multiplier = 1;
        this.distance = 0;
        this.speed = 1;
        this.currentLane = 1;
        this.targetLane = 1;
        this.obstacles = [];
        this.coins_arr = [];
        this.particles = [];
        this.trails = [];
        this.player.isJumping = false;
        this.player.isSliding = false;
        this.player.jumpHeight = 0;
        this.player.invincible = 0;
        this.lastObstacle = 0;
        this.nextQuestionAt = this.questionDistance;
    }

    update(dt) {
        this.globalTime += dt;

        // Effects
        if (this.shake > 0) this.shake *= 0.9;
        if (this.flash) {
            this.flash.timer--;
            if (this.flash.timer <= 0) this.flash = null;
        }
        if (this.player.invincible > 0) this.player.invincible--;

        // Update particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life--;
            p.size *= 0.96;
            return p.life > 0;
        });

        this.trails = this.trails.filter(t => {
            t.alpha -= 0.05;
            return t.alpha > 0;
        });

        if (this.state !== 'playing') return;

        // Speed up
        if (this.speed < this.maxSpeed) this.speed += 0.0002;

        // Distance and score
        this.distance += this.speed * 5;
        this.score = Math.floor(this.distance / 10) * this.multiplier;

        // Lane transition
        const diff = this.targetLane - this.currentLane;
        this.currentLane += diff * 0.12;

        // Player physics
        if (this.player.isJumping) {
            this.player.jumpHeight += this.player.jumpVelocity;
            this.player.jumpVelocity -= 0.9;
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
        this.player.animTimer++;
        if (this.player.animTimer >= 4) {
            this.player.animFrame = (this.player.animFrame + 1) % 8;
            this.player.animTimer = 0;
        }

        // Spawn obstacles
        if (this.distance - this.lastObstacle > this.obstacleGap / this.speed) {
            this.spawnObstacle();
            this.lastObstacle = this.distance;
        }

        // Spawn coins
        if (Math.random() < 0.015) this.spawnCoin();

        // Update obstacles
        this.updateObstacles();

        // Update coins
        this.updateCoins();

        // Check for question trigger (distance-based, not random)
        if (this.distance >= this.nextQuestionAt) {
            this.triggerQuestion();
            this.nextQuestionAt += this.questionIncrement;
        }
    }

    spawnObstacle() {
        const lane = Math.floor(Math.random() * 3);
        const isHigh = Math.random() > 0.6; // 40% are high obstacles

        this.obstacles.push({
            lane,
            z: 1500,
            type: isHigh ? 'high' : 'low',
            height: isHigh ? 60 : 100,
            hit: false
        });
    }

    spawnCoin() {
        const lane = Math.floor(Math.random() * 3);
        const elevated = Math.random() > 0.5;
        this.coins_arr.push({
            lane,
            z: 1500,
            y: elevated ? 80 : 0,
            collected: false,
            bobPhase: Math.random() * Math.PI * 2
        });
    }

    updateObstacles() {
        this.obstacles = this.obstacles.filter(obs => {
            obs.z -= this.speed * 15;

            // Collision check
            if (obs.z < 80 && obs.z > -30 && !obs.hit && this.player.invincible <= 0) {
                const playerLane = Math.round(this.currentLane);
                if (obs.lane === playerLane) {
                    if (obs.type === 'high') {
                        if (!this.player.isSliding) {
                            this.hitObstacle();
                            obs.hit = true;
                        }
                    } else {
                        if (this.player.jumpHeight < 50) {
                            this.hitObstacle();
                            obs.hit = true;
                        }
                    }
                }
            }

            return obs.z > -200;
        });
    }

    updateCoins() {
        this.coins_arr = this.coins_arr.filter(coin => {
            coin.z -= this.speed * 15;
            coin.bobPhase += 0.1;

            if (coin.z < 80 && coin.z > -30 && !coin.collected) {
                const playerLane = Math.round(this.currentLane);
                if (coin.lane === playerLane) {
                    if (coin.y === 0 || this.player.jumpHeight > 30) {
                        coin.collected = true;
                        this.coins++;
                        this.totalCoins++;
                        localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
                        this.addCoinBurst(coin);
                    }
                }
            }

            return coin.z > -200 && !coin.collected;
        });
    }

    addCoinBurst(coin) {
        const x = this.getLaneX(coin.lane);
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 / 10) * i;
            this.particles.push({
                x, y: this.height - 150,
                vx: Math.cos(angle) * 4,
                vy: Math.sin(angle) * 4,
                size: 5,
                life: 25,
                color: this.colors.coin
            });
        }
    }

    hitObstacle() {
        this.lives--;
        this.streak = 0;
        this.multiplier = 1;
        this.shake = 15;
        this.flash = { color: this.colors.danger, timer: 12 };
        this.player.invincible = 60; // 1 second invincibility

        // Explosion
        const x = this.getLaneX(Math.round(this.currentLane));
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x, y: this.height - 120,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                size: 6 + Math.random() * 6,
                life: 35,
                color: this.colors.danger
            });
        }

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
        this.questionTimer = this.questionTimeLimit * 60; // 60fps
        this.selectedAnswer = -1;
        this.questionResult = null;

        // Get question
        if (typeof quizQuestionsBase !== 'undefined') {
            const valid = quizQuestionsBase.filter(q => q.type !== 'sata');
            if (valid.length > 0) {
                const q = valid[Math.floor(Math.random() * valid.length)];
                this.currentQuestion = {
                    text: q.q,
                    options: this.shuffle([...q.options]).slice(0, 4),
                    correct: q.correctAnswer
                };
                return;
            }
        }

        // Fallback
        this.currentQuestion = {
            text: "What is the priority nursing action for compartment syndrome?",
            options: ["Notify surgeon immediately", "Elevate extremity high", "Apply warm compresses", "Give pain medication"],
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
            this.coins += 10 * this.multiplier;
            this.totalCoins += 10 * this.multiplier;
            localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
            this.flash = { color: this.colors.success, timer: 15 };
        } else {
            this.questionResult = 'wrong';
            this.lives--;
            this.streak = 0;
            this.multiplier = 1;
            this.shake = 10;
            this.flash = { color: this.colors.danger, timer: 12 };

            if (this.lives <= 0) {
                setTimeout(() => this.gameOver(), 1000);
                return;
            }
        }

        setTimeout(() => {
            this.state = 'playing';
            this.currentQuestion = null;
        }, 1000);
    }

    handleQuestionClick(e) {
        if (!this.currentQuestion || this.questionResult !== null) return;

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.width / rect.width;
        const scaleY = this.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const startY = this.height * 0.35;
        const optH = 50;
        const gap = 12;
        const margin = this.width * 0.1;

        for (let i = 0; i < this.currentQuestion.options.length; i++) {
            const optY = startY + i * (optH + gap);
            if (x >= margin && x <= this.width - margin && y >= optY && y <= optY + optH) {
                this.selectAnswer(i);
                break;
            }
        }
    }

    // =========== RENDERING ===========

    render() {
        this.ctx.save();

        if (this.shake > 0) {
            this.ctx.translate(
                (Math.random() - 0.5) * this.shake * 2,
                (Math.random() - 0.5) * this.shake * 2
            );
        }

        this.drawBackground();
        this.draw3DRoad();
        this.drawObstacles();
        this.drawCoins();
        this.drawPlayer();
        this.drawParticles();

        if (this.state === 'playing') this.drawHUD();
        else if (this.state === 'menu') this.drawMenu();
        else if (this.state === 'question') this.drawQuestion();
        else if (this.state === 'gameover') this.drawGameOver();

        // Flash
        if (this.flash) {
            this.ctx.fillStyle = this.flash.color;
            this.ctx.globalAlpha = this.flash.timer / 20;
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.globalAlpha = 1;
        }

        this.ctx.restore();
    }

    drawBackground() {
        // Gradient sky with animated stars
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, '#050510');
        grad.addColorStop(0.5, '#0f0a1a');
        grad.addColorStop(1, '#1a1033');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Animated stars
        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < 80; i++) {
            const x = (i * 97.3 + this.globalTime * 0.01 * (i % 3 + 1)) % this.width;
            const y = (i * 47.7) % (this.height * 0.5);
            const pulse = 0.5 + Math.sin(this.globalTime * 0.003 + i) * 0.5;
            this.ctx.globalAlpha = 0.3 + pulse * 0.4;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1 + (i % 2), 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;

        // Horizon glow
        const hGrad = this.ctx.createRadialGradient(this.centerX, this.height * 0.4, 0, this.centerX, this.height * 0.4, this.width * 0.6);
        hGrad.addColorStop(0, 'rgba(168, 85, 247, 0.15)');
        hGrad.addColorStop(1, 'transparent');
        this.ctx.fillStyle = hGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    draw3DRoad() {
        const segments = 40;
        const horizonY = this.height * 0.4;
        const roadW = 450;

        for (let i = segments; i >= 0; i--) {
            const z = i / segments;
            const nextZ = (i + 1) / segments;

            const perspective = 1 / (1 + z * 4);
            const nextPerspective = 1 / (1 + nextZ * 4);

            const y = horizonY + (this.height - horizonY) * (1 - Math.pow(z, 0.6));
            const nextY = horizonY + (this.height - horizonY) * (1 - Math.pow(nextZ, 0.6));

            const w = roadW * perspective;
            const nextW = roadW * nextPerspective;

            // Road surface
            const stripe = Math.floor((i + this.distance / 30) % 4) < 2;
            this.ctx.fillStyle = stripe ? '#15152a' : '#101020';

            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX - nextW, nextY);
            this.ctx.lineTo(this.centerX + nextW, nextY);
            this.ctx.lineTo(this.centerX + w, y);
            this.ctx.lineTo(this.centerX - w, y);
            this.ctx.closePath();
            this.ctx.fill();

            // Lane lines with glow
            if (i < segments - 1 && i % 2 === 0) {
                this.ctx.strokeStyle = `rgba(168, 85, 247, ${0.5 * (1 - z)})`;
                this.ctx.lineWidth = 2 * perspective;

                for (let lane = 0; lane < 2; lane++) {
                    const laneOffset = (lane - 0.5) * this.laneWidth;
                    const lx = this.centerX + laneOffset * perspective;
                    const nlx = this.centerX + laneOffset * nextPerspective;

                    this.ctx.beginPath();
                    this.ctx.moveTo(nlx, nextY);
                    this.ctx.lineTo(lx, y);
                    this.ctx.stroke();
                }
            }
        }

        // Neon side rails
        this.ctx.shadowColor = this.colors.neon;
        this.ctx.shadowBlur = 20;
        this.ctx.strokeStyle = this.colors.neon;
        this.ctx.lineWidth = 3;

        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - 80, horizonY);
        this.ctx.lineTo(this.centerX - roadW, this.height);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + 80, horizonY);
        this.ctx.lineTo(this.centerX + roadW, this.height);
        this.ctx.stroke();

        this.ctx.shadowBlur = 0;
    }

    drawObstacles() {
        const sorted = [...this.obstacles].sort((a, b) => b.z - a.z);
        const horizonY = this.height * 0.4;

        sorted.forEach(obs => {
            if (obs.z < 0 || obs.z > 1500) return;

            const zNorm = obs.z / 1500;
            const perspective = 1 / (1 + zNorm * 4);
            const y = horizonY + (this.height - horizonY) * (1 - Math.pow(zNorm, 0.6));
            const laneOffset = (obs.lane - 1) * this.laneWidth;
            const x = this.centerX + laneOffset * perspective;

            const w = 60 * perspective;
            const h = obs.height * perspective;

            this.ctx.save();

            if (obs.type === 'high') {
                // High obstacle (need to slide) - floating bar
                this.ctx.shadowColor = '#f59e0b';
                this.ctx.shadowBlur = 15 * perspective;

                const hoverY = y - 80 * perspective;

                // 3D effect
                this.ctx.fillStyle = '#b45309';
                this.ctx.fillRect(x - w / 2 + 4 * perspective, hoverY - h + 4 * perspective, w, h / 2);

                this.ctx.fillStyle = '#f59e0b';
                this.ctx.fillRect(x - w / 2, hoverY - h, w, h / 2);

                // Warning pattern
                this.ctx.fillStyle = '#000';
                for (let s = 0; s < 3; s++) {
                    this.ctx.fillRect(x - w / 2 + s * w / 3, hoverY - h, w / 6, h / 2);
                }
            } else {
                // Low obstacle (need to jump) - barrier
                this.ctx.shadowColor = this.colors.obstacle;
                this.ctx.shadowBlur = 15 * perspective;

                // 3D barrier
                this.ctx.fillStyle = '#991b1b';
                this.ctx.fillRect(x - w / 2 + 4 * perspective, y - h + 4 * perspective, w - 4 * perspective, h - 8 * perspective);

                this.ctx.fillStyle = this.colors.obstacle;
                this.ctx.fillRect(x - w / 2, y - h, w - 4 * perspective, h - 8 * perspective);

                // Stripes
                this.ctx.fillStyle = '#450a0a';
                for (let s = 0; s < 4; s++) {
                    this.ctx.fillRect(x - w / 2 + s * w / 4, y - h, w / 8, h - 8 * perspective);
                }
            }

            this.ctx.restore();
        });
    }

    drawCoins() {
        const horizonY = this.height * 0.4;

        this.coins_arr.forEach(coin => {
            if (coin.collected || coin.z < 0 || coin.z > 1500) return;

            const zNorm = coin.z / 1500;
            const perspective = 1 / (1 + zNorm * 4);
            const baseY = horizonY + (this.height - horizonY) * (1 - Math.pow(zNorm, 0.6));
            const laneOffset = (coin.lane - 1) * this.laneWidth;
            const x = this.centerX + laneOffset * perspective;
            const bob = Math.sin(coin.bobPhase) * 5 * perspective;
            const y = baseY - (40 + coin.y) * perspective + bob;

            this.ctx.save();
            this.ctx.shadowColor = this.colors.coin;
            this.ctx.shadowBlur = 15 * perspective;

            // Coin
            this.ctx.fillStyle = this.colors.coin;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 15 * perspective, 0, Math.PI * 2);
            this.ctx.fill();

            // $ symbol
            this.ctx.fillStyle = '#92400e';
            this.ctx.font = `bold ${12 * perspective}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('$', x, y);

            this.ctx.restore();
        });
    }

    drawPlayer() {
        const x = this.getLaneX(this.currentLane);
        const groundY = this.height - 60;
        const y = groundY - this.player.jumpHeight;
        const scale = 1;

        // Invincibility flash
        if (this.player.invincible > 0 && Math.floor(this.player.invincible / 5) % 2 === 0) {
            this.ctx.globalAlpha = 0.5;
        }

        this.ctx.save();
        this.ctx.translate(x, y);

        // Glow
        this.ctx.shadowColor = this.colors.player;
        this.ctx.shadowBlur = 25;

        if (this.player.isSliding) {
            // SLIDING POSE - Compressed ball
            this.ctx.fillStyle = this.colors.player;
            this.ctx.beginPath();
            this.ctx.ellipse(0, -15, 45, 20, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Head peeking out
            this.ctx.beginPath();
            this.ctx.arc(25, -25, 18, 0, Math.PI * 2);
            this.ctx.fill();

            // Nurse cap
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(12, -45, 26, 8);
            this.ctx.fillStyle = '#f43f5e';
            this.ctx.fillRect(22, -43, 6, 5);
        } else {
            // RUNNING POSE - Full character with arms!
            const bounce = this.player.isJumping ? 0 : Math.sin(this.player.animFrame * 0.6) * 3;
            const armSwing = Math.sin(this.player.animFrame * 0.8) * 25;
            const legSwing = Math.sin(this.player.animFrame * 0.8) * 20;

            // LEGS
            this.ctx.fillStyle = '#0284c7';
            // Left leg
            this.ctx.save();
            this.ctx.translate(-12, -15 + bounce);
            this.ctx.rotate((legSwing * Math.PI) / 180);
            this.ctx.fillRect(-6, 0, 12, 35);
            // Foot
            this.ctx.fillStyle = '#1e3a5f';
            this.ctx.fillRect(-8, 32, 16, 8);
            this.ctx.restore();

            // Right leg
            this.ctx.fillStyle = '#0284c7';
            this.ctx.save();
            this.ctx.translate(12, -15 + bounce);
            this.ctx.rotate((-legSwing * Math.PI) / 180);
            this.ctx.fillRect(-6, 0, 12, 35);
            // Foot
            this.ctx.fillStyle = '#1e3a5f';
            this.ctx.fillRect(-8, 32, 16, 8);
            this.ctx.restore();

            // BODY (scrubs)
            this.ctx.fillStyle = this.colors.player;
            this.ctx.beginPath();
            this.ctx.roundRect(-22, -75 + bounce, 44, 60, 8);
            this.ctx.fill();

            // Scrubs V-neck detail
            this.ctx.strokeStyle = '#0c4a6e';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(-10, -75 + bounce);
            this.ctx.lineTo(0, -60 + bounce);
            this.ctx.lineTo(10, -75 + bounce);
            this.ctx.stroke();

            // LEFT ARM
            this.ctx.fillStyle = '#fcd34d'; // Skin tone
            this.ctx.save();
            this.ctx.translate(-28, -65 + bounce);
            this.ctx.rotate((-armSwing * Math.PI) / 180);
            // Upper arm
            this.ctx.fillStyle = this.colors.player;
            this.ctx.fillRect(-5, 0, 10, 25);
            // Lower arm/hand
            this.ctx.fillStyle = '#fcd34d';
            this.ctx.fillRect(-4, 22, 8, 20);
            this.ctx.restore();

            // RIGHT ARM
            this.ctx.save();
            this.ctx.translate(28, -65 + bounce);
            this.ctx.rotate((armSwing * Math.PI) / 180);
            // Upper arm
            this.ctx.fillStyle = this.colors.player;
            this.ctx.fillRect(-5, 0, 10, 25);
            // Lower arm/hand
            this.ctx.fillStyle = '#fcd34d';
            this.ctx.fillRect(-4, 22, 8, 20);
            this.ctx.restore();

            // HEAD
            this.ctx.fillStyle = '#fcd34d';
            this.ctx.beginPath();
            this.ctx.arc(0, -95 + bounce, 22, 0, Math.PI * 2);
            this.ctx.fill();

            // Hair
            this.ctx.fillStyle = '#4a3728';
            this.ctx.beginPath();
            this.ctx.arc(0, -100 + bounce, 22, Math.PI, 0);
            this.ctx.fill();

            // NURSE CAP
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(-18, -125 + bounce, 36, 12);
            // Red cross
            this.ctx.fillStyle = '#f43f5e';
            this.ctx.fillRect(-4, -122 + bounce, 8, 8);
            this.ctx.fillRect(-8, -120 + bounce, 16, 4);

            // EYES
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.ellipse(-8, -97 + bounce, 6, 7, 0, 0, Math.PI * 2);
            this.ctx.ellipse(8, -97 + bounce, 6, 7, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Pupils (looking forward)
            this.ctx.fillStyle = '#1e293b';
            this.ctx.beginPath();
            this.ctx.arc(-6, -96 + bounce, 3, 0, Math.PI * 2);
            this.ctx.arc(10, -96 + bounce, 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Smile
            this.ctx.strokeStyle = '#92400e';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(0, -90 + bounce, 8, 0.2, Math.PI - 0.2);
            this.ctx.stroke();

            // Stethoscope
            this.ctx.strokeStyle = '#475569';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(-5, -75 + bounce);
            this.ctx.quadraticCurveTo(-15, -50 + bounce, 0, -45 + bounce);
            this.ctx.stroke();
            this.ctx.fillStyle = '#64748b';
            this.ctx.beginPath();
            this.ctx.arc(0, -42 + bounce, 6, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
        this.ctx.globalAlpha = 1;
    }

    drawParticles() {
        // Trails
        this.trails.forEach(t => {
            this.ctx.globalAlpha = t.alpha * 0.5;
            this.ctx.fillStyle = this.colors.neon;
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y, 20, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Particles
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life / 35;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.globalAlpha = 1;
    }

    drawHUD() {
        // Score (larger, more visible)
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 36px "Space Grotesk", Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(this.score.toLocaleString(), 30, 50);

        // Multiplier
        if (this.multiplier > 1) {
            this.ctx.fillStyle = this.colors.coin;
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillText(`x${this.multiplier}`, 30, 80);
        }

        // Coins
        this.ctx.fillStyle = this.colors.coin;
        this.ctx.textAlign = 'right';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText(`💰 ${this.coins}`, this.width - 30, 50);

        // Lives
        let hearts = '';
        for (let i = 0; i < 3; i++) hearts += i < this.lives ? '❤️' : '🖤';
        this.ctx.font = '30px Arial';
        this.ctx.fillText(hearts, this.width - 30, 90);

        // Streak
        if (this.streak > 0) {
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = this.colors.success;
            this.ctx.font = 'bold 22px Arial';
            this.ctx.fillText(`🔥 ${this.streak} Streak`, this.centerX, 50);
        }
    }

    drawMenu() {
        // Overlay
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Title
        this.ctx.shadowColor = this.colors.neon;
        this.ctx.shadowBlur = 50;
        this.ctx.fillStyle = this.colors.neon;
        this.ctx.font = `bold ${Math.min(56, this.width * 0.06)}px "Space Grotesk", Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏃 ANATOMY RUSH', this.centerX, this.height * 0.2);
        this.ctx.shadowBlur = 0;

        // Subtitle
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Master nursing concepts through gameplay', this.centerX, this.height * 0.28);

        // Stats
        this.ctx.fillStyle = this.colors.coin;
        this.ctx.font = 'bold 26px Arial';
        this.ctx.fillText(`🏆 Best: ${this.highScore.toLocaleString()}`, this.centerX, this.height * 0.4);
        this.ctx.fillText(`💰 Coins: ${this.totalCoins.toLocaleString()}`, this.centerX, this.height * 0.48);

        // Controls
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('← → Switch Lanes  |  SPACE Jump  |  ↓ Slide', this.centerX, this.height * 0.62);
        this.ctx.fillText('Answer questions quickly to keep your streak!', this.centerX, this.height * 0.68);

        // Start
        const pulse = 0.7 + Math.sin(this.globalTime * 0.005) * 0.3;
        this.ctx.globalAlpha = pulse;
        this.ctx.fillStyle = this.colors.cyan;
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('[ TAP OR PRESS SPACE ]', this.centerX, this.height * 0.85);
        this.ctx.globalAlpha = 1;
    }

    drawQuestion() {
        // Update timer
        if (this.questionResult === null) {
            this.questionTimer--;
            if (this.questionTimer <= 0) {
                // Time's up - treat as wrong
                this.questionResult = 'timeout';
                this.lives--;
                this.streak = 0;
                this.multiplier = 1;
                this.shake = 10;
                this.flash = { color: this.colors.danger, timer: 12 };

                if (this.lives <= 0) {
                    setTimeout(() => this.gameOver(), 1000);
                } else {
                    setTimeout(() => {
                        this.state = 'playing';
                        this.currentQuestion = null;
                    }, 1000);
                }
            }
        }

        // Overlay
        this.ctx.fillStyle = 'rgba(5,5,15,0.95)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (!this.currentQuestion) return;

        // Timer bar at top
        const timerPercent = this.questionTimer / (this.questionTimeLimit * 60);
        const timerColor = timerPercent > 0.5 ? this.colors.success : timerPercent > 0.25 ? '#f59e0b' : this.colors.danger;

        this.ctx.fillStyle = '#1f2937';
        this.ctx.fillRect(50, 20, this.width - 100, 20);
        this.ctx.fillStyle = timerColor;
        this.ctx.fillRect(50, 20, (this.width - 100) * timerPercent, 20);

        // Timer number
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.ceil(this.questionTimer / 60)}s`, this.centerX, 35);

        // Question
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 18px Arial';

        // Word wrap
        const words = this.currentQuestion.text.split(' ');
        let line = '';
        let y = this.height * 0.15;
        const maxW = this.width * 0.8;

        words.forEach(word => {
            const test = line + word + ' ';
            if (this.ctx.measureText(test).width > maxW && line) {
                this.ctx.fillText(line.trim(), this.centerX, y);
                line = word + ' ';
                y += 26;
            } else {
                line = test;
            }
        });
        this.ctx.fillText(line.trim(), this.centerX, y);

        // Options
        const startY = this.height * 0.35;
        const optH = 50;
        const gap = 12;
        const margin = this.width * 0.1;

        this.currentQuestion.options.forEach((opt, i) => {
            const optY = startY + i * (optH + gap);

            let bg = '#1e1e38';
            let border = 'rgba(168, 85, 247, 0.3)';

            if (this.questionResult !== null) {
                if (i === this.selectedAnswer) {
                    bg = this.questionResult === 'correct' ? this.colors.success : this.colors.danger;
                    border = bg;
                }
                if (opt === this.currentQuestion.correct && this.questionResult !== 'correct') {
                    bg = this.colors.success;
                    border = this.colors.success;
                }
            }

            // Background
            this.ctx.fillStyle = bg;
            this.ctx.beginPath();
            this.ctx.roundRect(margin, optY, this.width - margin * 2, optH, 10);
            this.ctx.fill();

            // Border
            this.ctx.strokeStyle = border;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Text
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '15px Arial';
            this.ctx.textAlign = 'left';

            let text = `${i + 1}. ${opt}`;
            const maxText = this.width - margin * 2 - 30;
            while (this.ctx.measureText(text).width > maxText && text.length > 10) {
                text = text.slice(0, -4) + '...';
            }
            this.ctx.fillText(text, margin + 15, optY + 32);
        });

        // Result
        if (this.questionResult) {
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold 32px Arial';

            if (this.questionResult === 'correct') {
                this.ctx.fillStyle = this.colors.success;
                this.ctx.fillText(`✓ CORRECT! +${10 * this.multiplier} coins`, this.centerX, this.height - 60);
            } else if (this.questionResult === 'timeout') {
                this.ctx.fillStyle = this.colors.danger;
                this.ctx.fillText('⏱️ TIME UP!', this.centerX, this.height - 60);
            } else {
                this.ctx.fillStyle = this.colors.danger;
                this.ctx.fillText('✗ WRONG!', this.centerX, this.height - 60);
            }
        }
    }

    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.9)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Game Over
        this.ctx.shadowColor = this.colors.danger;
        this.ctx.shadowBlur = 50;
        this.ctx.fillStyle = this.colors.danger;
        this.ctx.font = `bold ${Math.min(60, this.width * 0.07)}px "Space Grotesk", Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.centerX, this.height * 0.25);
        this.ctx.shadowBlur = 0;

        // Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.fillText(`Score: ${this.score.toLocaleString()}`, this.centerX, this.height * 0.4);

        // High score
        if (this.score >= this.highScore) {
            this.ctx.fillStyle = this.colors.coin;
            this.ctx.fillText('🏆 NEW BEST! 🏆', this.centerX, this.height * 0.5);
        } else {
            this.ctx.fillStyle = '#888';
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Best: ${this.highScore.toLocaleString()}`, this.centerX, this.height * 0.5);
        }

        // Coins
        this.ctx.fillStyle = this.colors.coin;
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText(`💰 ${this.coins} coins earned`, this.centerX, this.height * 0.6);

        // XP
        this.ctx.fillStyle = this.colors.success;
        this.ctx.font = '22px Arial';
        this.ctx.fillText(`+${Math.floor(this.score / 10)} XP`, this.centerX, this.height * 0.68);

        // Retry
        const pulse = 0.7 + Math.sin(this.globalTime * 0.005) * 0.3;
        this.ctx.globalAlpha = pulse;
        this.ctx.fillStyle = this.colors.cyan;
        this.ctx.font = 'bold 26px Arial';
        this.ctx.fillText('[ PRESS SPACE TO RETRY ]', this.centerX, this.height * 0.85);
        this.ctx.globalAlpha = 1;
    }

    loop(timestamp) {
        const dt = Math.min(timestamp - this.lastTime, 50);
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        if (this.running) {
            requestAnimationFrame((t) => this.loop(t));
        }
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.lastTime = performance.now();
            requestAnimationFrame((t) => this.loop(t));
        }
    }

    stop() {
        this.running = false;
        if (this._keyHandler) {
            document.removeEventListener('keydown', this._keyHandler);
        }
    }
}

// Global
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
