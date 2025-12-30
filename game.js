// ============================================
// ANATOMY RUSH - 3D Subway Surfers Style Game
// Premium endless runner with lane mechanics
// ============================================

class AnatomyRush {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();

        // Game state
        this.state = 'menu'; // menu, playing, question, gameover
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.streak = 0;
        this.multiplier = 1;
        this.highScore = parseInt(localStorage.getItem('anatomyRushHighScore')) || 0;
        this.totalCoins = parseInt(localStorage.getItem('anatomyRushCoins')) || 0;
        this.gamesPlayed = parseInt(localStorage.getItem('anatomyRushGames')) || 0;

        // 3D Perspective settings
        this.horizon = 0.35; // Where the horizon sits (0-1)
        this.fov = 0.84; // Field of view
        this.cameraHeight = 1000;
        this.cameraDepth = 1 / Math.tan((this.fov / 2) * Math.PI / 180);

        // Lanes (Subway Surfers style - 3 lanes)
        this.lanes = [-1, 0, 1]; // Left, Center, Right
        this.laneWidth = 120;
        this.currentLane = 0; // Start in center
        this.targetLane = 0;
        this.laneTransition = 0;
        this.laneSpeed = 0.15;

        // Player
        this.player = {
            x: 0,
            y: 0,
            z: 0,
            width: 60,
            height: 100,
            isJumping: false,
            jumpHeight: 0,
            maxJumpHeight: 180,
            jumpVelocity: 0,
            isRolling: false,
            rollTimer: 0,
            rollDuration: 25,
            animFrame: 0,
            animTimer: 0
        };

        // Speed and difficulty
        this.speed = 1;
        this.baseSpeed = 1;
        this.maxSpeed = 2.5;
        this.acceleration = 0.0003;

        // Road segments for 3D effect
        this.segments = [];
        this.segmentLength = 200;
        this.visibleSegments = 100;
        this.roadWidth = 400;
        this.rumbleLength = 3;
        this.position = 0;

        // Game objects
        this.obstacles = [];
        this.collectibles = [];
        this.particles = [];

        // Timing
        this.lastObstacle = 0;
        this.obstacleGap = 80;

        // Question system
        this.currentQuestion = null;
        this.selectedAnswer = -1;
        this.questionResult = null;

        // Visual effects
        this.shake = 0;
        this.flash = { active: false, color: '', timer: 0 };

        // Animation
        this.running = false;
        this.lastTime = 0;

        // Colors
        this.colors = {
            sky: ['#0c0c20', '#1a1a3a', '#2d2d5a'],
            road: '#1a1a2e',
            roadLine: '#00d4ff',
            rumble: '#2a2a4e',
            lane: 'rgba(0, 212, 255, 0.3)',
            player: '#00d4ff',
            obstacle: '#ff4757',
            coin: '#ffd700',
            heart: '#ff6b81',
            question: '#a855f7'
        };

        this.initRoad();
        this.bindEvents();
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = Math.min(container.offsetWidth - 40, 900);
        this.canvas.height = 550;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }

    initRoad() {
        this.segments = [];
        for (let i = 0; i < this.visibleSegments; i++) {
            this.segments.push({
                index: i,
                curve: 0,
                y: 0
            });
        }
    }

    bindEvents() {
        // Keyboard - BULLETPROOF event handling
        const handleKeyDown = (e) => {
            // Always prevent default for game keys when game panel is active
            const gameKeys = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Digit1', 'Digit2', 'Digit3', 'Digit4'];

            if (gameKeys.includes(e.code)) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (this.state === 'menu') {
                if (e.code === 'Space' || e.code === 'Enter') {
                    this.startGame();
                }
                return;
            }

            if (this.state === 'gameover') {
                if (e.code === 'Space' || e.code === 'Enter') {
                    this.resetToMenu();
                }
                return;
            }

            if (this.state === 'question') {
                if (e.code >= 'Digit1' && e.code <= 'Digit4') {
                    this.selectAnswer(parseInt(e.code.slice(-1)) - 1);
                }
                return;
            }

            if (this.state === 'playing') {
                // Lane switching (Subway Surfers style)
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                    this.switchLane(-1);
                }
                if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                    this.switchLane(1);
                }
                // Jump
                if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                    this.jump();
                }
                // Roll/Slide
                if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                    this.roll();
                }
            }
        };

        // Remove any existing listeners and add new one
        document.removeEventListener('keydown', this.keyHandler);
        this.keyHandler = handleKeyDown;
        document.addEventListener('keydown', this.keyHandler);

        // Touch controls for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;

            if (this.state === 'menu') this.startGame();
            if (this.state === 'gameover') this.resetToMenu();
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.state !== 'playing') return;

            const dx = e.touches[0].clientX - touchStartX;
            const dy = e.touches[0].clientY - touchStartY;

            if (Math.abs(dx) > 30) {
                this.switchLane(dx > 0 ? 1 : -1);
                touchStartX = e.touches[0].clientX;
            }
            if (dy < -40) {
                this.jump();
                touchStartY = e.touches[0].clientY;
            }
            if (dy > 40) {
                this.roll();
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: false });

        // Click handling
        this.canvas.addEventListener('click', (e) => {
            if (this.state === 'menu') {
                this.startGame();
                return;
            }
            if (this.state === 'gameover') {
                this.resetToMenu();
                return;
            }
            if (this.state === 'question') {
                this.handleQuestionClick(e);
            }
        });

        // Resize handler
        window.addEventListener('resize', () => this.resize());
    }

    switchLane(direction) {
        const newLane = this.targetLane + direction;
        if (newLane >= -1 && newLane <= 1) {
            this.targetLane = newLane;
            // Add swipe particles
            this.addSwipeParticles(direction);
        }
    }

    jump() {
        if (!this.player.isJumping && !this.player.isRolling) {
            this.player.isJumping = true;
            this.player.jumpVelocity = 22;
            this.addJumpParticles();
        }
    }

    roll() {
        if (!this.player.isJumping && !this.player.isRolling) {
            this.player.isRolling = true;
            this.player.rollTimer = this.player.rollDuration;
        }
    }

    addJumpParticles() {
        const px = this.centerX + this.currentLane * this.laneWidth * 0.6;
        const py = this.height - 100;
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: px + (Math.random() - 0.5) * 40,
                y: py,
                vx: (Math.random() - 0.5) * 6,
                vy: Math.random() * 3 + 1,
                size: 4 + Math.random() * 4,
                life: 25,
                color: '#00d4ff'
            });
        }
    }

    addSwipeParticles(dir) {
        const px = this.centerX + this.currentLane * this.laneWidth * 0.6;
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x: px,
                y: this.height - 150 + Math.random() * 100,
                vx: -dir * (3 + Math.random() * 3),
                vy: (Math.random() - 0.5) * 2,
                size: 3 + Math.random() * 3,
                life: 20,
                color: '#a855f7'
            });
        }
    }

    startGame() {
        this.state = 'playing';
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.streak = 0;
        this.multiplier = 1;
        this.speed = this.baseSpeed;
        this.position = 0;
        this.currentLane = 0;
        this.targetLane = 0;
        this.obstacles = [];
        this.collectibles = [];
        this.particles = [];
        this.player.isJumping = false;
        this.player.isRolling = false;
        this.player.jumpHeight = 0;
        this.lastObstacle = 0;

        this.gamesPlayed++;
        localStorage.setItem('anatomyRushGames', this.gamesPlayed);
        this.updateStatsDisplay();
    }

    resetToMenu() {
        this.state = 'menu';
    }

    update(dt) {
        // Update particles always
        this.updateParticles();

        // Update effects
        if (this.shake > 0) this.shake *= 0.9;
        if (this.flash.active) {
            this.flash.timer--;
            if (this.flash.timer <= 0) this.flash.active = false;
        }

        if (this.state !== 'playing') return;

        // Increase speed
        if (this.speed < this.maxSpeed) {
            this.speed += this.acceleration;
        }

        // Update position (distance traveled)
        this.position += this.speed * 10;
        this.score = Math.floor(this.position / 50) * this.multiplier;

        // Smooth lane transition
        const laneDiff = this.targetLane - this.currentLane;
        this.currentLane += laneDiff * this.laneSpeed;

        // Update player jump
        if (this.player.isJumping) {
            this.player.jumpHeight += this.player.jumpVelocity;
            this.player.jumpVelocity -= 1.2;

            if (this.player.jumpHeight <= 0) {
                this.player.jumpHeight = 0;
                this.player.isJumping = false;
                this.player.jumpVelocity = 0;
            }
        }

        // Update roll
        if (this.player.isRolling) {
            this.player.rollTimer--;
            if (this.player.rollTimer <= 0) {
                this.player.isRolling = false;
            }
        }

        // Update player animation
        this.player.animTimer++;
        if (this.player.animTimer >= 5) {
            this.player.animFrame = (this.player.animFrame + 1) % 4;
            this.player.animTimer = 0;
        }

        // Spawn obstacles
        if (this.position - this.lastObstacle > this.obstacleGap * this.segmentLength / this.speed) {
            this.spawnObstacle();
            this.lastObstacle = this.position;
        }

        // Spawn collectibles
        if (Math.random() < 0.02) {
            this.spawnCollectible();
        }

        // Update obstacles
        this.updateObstacles();

        // Update collectibles
        this.updateCollectibles();
    }

    spawnObstacle() {
        const lane = Math.floor(Math.random() * 3) - 1;
        const types = ['barrier', 'barrier', 'barrier', 'high', 'question'];
        const type = types[Math.floor(Math.random() * types.length)];

        this.obstacles.push({
            lane: lane,
            z: this.position + this.segmentLength * 60,
            type: type,
            width: 80,
            height: type === 'high' ? 60 : (type === 'question' ? 70 : 90),
            active: true
        });
    }

    spawnCollectible() {
        const lane = Math.floor(Math.random() * 3) - 1;
        const type = Math.random() > 0.92 ? 'heart' : 'coin';
        const jumpHeight = Math.random() > 0.5 ? 80 : 0;

        this.collectibles.push({
            lane: lane,
            z: this.position + this.segmentLength * 50,
            type: type,
            jumpHeight: jumpHeight,
            collected: false,
            bobPhase: Math.random() * Math.PI * 2
        });
    }

    updateObstacles() {
        this.obstacles = this.obstacles.filter(obs => {
            // Move toward player
            const relativeZ = obs.z - this.position;

            // Check collision when obstacle is near player
            if (relativeZ < 200 && relativeZ > -50 && obs.active) {
                // Lane collision check
                const playerLane = Math.round(this.currentLane);
                if (obs.lane === playerLane) {
                    // Type-specific collision
                    if (obs.type === 'question') {
                        this.triggerQuestion();
                        obs.active = false;
                    } else if (obs.type === 'high') {
                        // High obstacle - need to roll under
                        if (!this.player.isRolling) {
                            this.hitObstacle();
                            obs.active = false;
                        }
                    } else {
                        // Low obstacle - need to jump over
                        if (this.player.jumpHeight < 60) {
                            this.hitObstacle();
                            obs.active = false;
                        }
                    }
                }
            }

            // Remove if too far behind
            return relativeZ > -500;
        });
    }

    updateCollectibles() {
        this.collectibles = this.collectibles.filter(col => {
            const relativeZ = col.z - this.position;
            col.bobPhase += 0.1;

            // Check collection
            if (relativeZ < 150 && relativeZ > -50 && !col.collected) {
                const playerLane = Math.round(this.currentLane);
                if (col.lane === playerLane) {
                    // Check if player is at correct height for elevated coins
                    if (col.jumpHeight === 0 || this.player.jumpHeight > 40) {
                        col.collected = true;
                        if (col.type === 'coin') {
                            this.coins++;
                            this.totalCoins++;
                            localStorage.setItem('anatomyRushCoins', this.totalCoins);
                            this.addCollectParticles(col, '#ffd700');
                        } else {
                            if (this.lives < 3) {
                                this.lives++;
                                this.addCollectParticles(col, '#ff6b81');
                            }
                        }
                        this.updateStatsDisplay();
                    }
                }
            }

            return relativeZ > -500 && !col.collected;
        });
    }

    addCollectParticles(col, color) {
        const x = this.centerX + col.lane * this.laneWidth * 0.5;
        const y = this.height - 200;
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 / 15) * i;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 5,
                vy: Math.sin(angle) * 5,
                size: 5,
                life: 30,
                color: color
            });
        }
    }

    updateParticles() {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15;
            p.life--;
            p.size *= 0.95;
            return p.life > 0 && p.size > 0.5;
        });
    }

    hitObstacle() {
        this.lives--;
        this.streak = 0;
        this.multiplier = 1;
        this.shake = 15;
        this.flash = { active: true, color: '#ff4757', timer: 10 };

        // Explosion particles
        const px = this.centerX + this.currentLane * this.laneWidth * 0.5;
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: px,
                y: this.height - 150,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                size: 5 + Math.random() * 5,
                life: 35,
                color: '#ff4757'
            });
        }

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        this.state = 'gameover';
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('anatomyRushHighScore', this.highScore);
        }

        // Award XP
        if (typeof awardXP === 'function') {
            awardXP(Math.floor(this.score / 10), 'game');
        }

        this.updateStatsDisplay();
    }

    triggerQuestion() {
        this.state = 'question';

        // Get question from quiz bank
        if (typeof quizQuestionsBase !== 'undefined') {
            const nonSataQuestions = quizQuestionsBase.filter(q => q.type !== 'sata');
            if (nonSataQuestions.length > 0) {
                const q = nonSataQuestions[Math.floor(Math.random() * nonSataQuestions.length)];
                this.currentQuestion = {
                    text: q.q,
                    options: this.shuffleArray([...q.options]).slice(0, 4),
                    correct: q.correctAnswer,
                    explanation: q.explanation
                };
            }
        }

        if (!this.currentQuestion) {
            // Fallback
            this.currentQuestion = {
                text: "What is the priority nursing action for compartment syndrome?",
                options: [
                    "Notify surgeon immediately",
                    "Elevate the extremity high",
                    "Apply warm compresses",
                    "Administer pain medication"
                ],
                correct: "Notify surgeon immediately",
                explanation: "Compartment syndrome is a surgical emergency requiring fasciotomy."
            };
        }

        this.selectedAnswer = -1;
        this.questionResult = null;
    }

    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    selectAnswer(index) {
        if (this.questionResult !== null || index >= this.currentQuestion.options.length) return;

        this.selectedAnswer = index;
        const selected = this.currentQuestion.options[index];

        if (selected === this.currentQuestion.correct) {
            this.questionResult = 'correct';
            this.streak++;
            this.multiplier = Math.min(5, 1 + Math.floor(this.streak / 2));
            this.coins += 5 * this.multiplier;
            this.totalCoins += 5 * this.multiplier;
            localStorage.setItem('anatomyRushCoins', this.totalCoins);
            this.flash = { active: true, color: '#10b981', timer: 15 };
        } else {
            this.questionResult = 'wrong';
            this.lives--;
            this.streak = 0;
            this.multiplier = 1;
            this.shake = 10;
            this.flash = { active: true, color: '#ff4757', timer: 10 };

            if (this.lives <= 0) {
                setTimeout(() => this.gameOver(), 1200);
                return;
            }
        }

        setTimeout(() => {
            this.state = 'playing';
            this.currentQuestion = null;
            this.updateStatsDisplay();
        }, 1200);
    }

    handleQuestionClick(e) {
        if (!this.currentQuestion || this.questionResult !== null) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const startY = 180;
        const optHeight = 55;
        const gap = 12;
        const margin = 60;

        for (let i = 0; i < this.currentQuestion.options.length; i++) {
            const optY = startY + i * (optHeight + gap);
            if (x >= margin && x <= this.width - margin && y >= optY && y <= optY + optHeight) {
                this.selectAnswer(i);
                break;
            }
        }
    }

    updateStatsDisplay() {
        const hs = document.getElementById('gameHighScore');
        const tc = document.getElementById('gameTotalCoins');
        const gp = document.getElementById('gamesPlayed');
        if (hs) hs.textContent = this.highScore;
        if (tc) tc.textContent = this.totalCoins;
        if (gp) gp.textContent = this.gamesPlayed;
    }

    // =========== RENDERING ===========

    render() {
        this.ctx.save();

        // Screen shake
        if (this.shake > 0) {
            this.ctx.translate(
                (Math.random() - 0.5) * this.shake * 2,
                (Math.random() - 0.5) * this.shake * 2
            );
        }

        // Draw based on state
        this.drawSky();
        this.draw3DRoad();
        this.drawObstacles();
        this.drawCollectibles();
        this.drawPlayer();
        this.drawParticles();

        if (this.state === 'playing') {
            this.drawHUD();
        } else if (this.state === 'menu') {
            this.drawMenu();
        } else if (this.state === 'question') {
            this.drawQuestion();
        } else if (this.state === 'gameover') {
            this.drawGameOver();
        }

        // Flash effect
        if (this.flash.active) {
            this.ctx.fillStyle = this.flash.color;
            this.ctx.globalAlpha = this.flash.timer / 20;
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.globalAlpha = 1;
        }

        this.ctx.restore();
    }

    drawSky() {
        // Gradient sky
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, '#0a0a1a');
        grad.addColorStop(0.5, '#1a1a3a');
        grad.addColorStop(1, '#2d2d5a');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Stars
        this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
        for (let i = 0; i < 50; i++) {
            const sx = (i * 137.5 + this.position * 0.01) % this.width;
            const sy = (i * 73.7) % (this.height * 0.4);
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, 1 + (i % 2), 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    draw3DRoad() {
        const horizonY = this.height * this.horizon;
        const roadBottom = this.height;

        // Draw road with 3D perspective
        const segments = 30;

        for (let i = segments; i >= 0; i--) {
            const z = (i / segments);
            const nextZ = ((i + 1) / segments);

            // Perspective scaling
            const scale = 1 / (1 + z * 3);
            const nextScale = 1 / (1 + nextZ * 3);

            const y = horizonY + (roadBottom - horizonY) * (1 - Math.pow(z, 0.7));
            const nextY = horizonY + (roadBottom - horizonY) * (1 - Math.pow(nextZ, 0.7));

            const roadWidth = this.roadWidth * scale;
            const nextRoadWidth = this.roadWidth * nextScale;

            // Road segment
            const stripe = Math.floor((i + this.position / 50) % 4) < 2;
            this.ctx.fillStyle = stripe ? '#1e1e38' : '#16162a';

            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX - nextRoadWidth, nextY);
            this.ctx.lineTo(this.centerX + nextRoadWidth, nextY);
            this.ctx.lineTo(this.centerX + roadWidth, y);
            this.ctx.lineTo(this.centerX - roadWidth, y);
            this.ctx.closePath();
            this.ctx.fill();

            // Lane dividers
            if (i < segments - 1) {
                this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
                this.ctx.lineWidth = 2 * scale;

                for (let lane = -1; lane <= 1; lane++) {
                    const lx = this.centerX + lane * this.laneWidth * scale * 0.8;
                    const nlx = this.centerX + lane * this.laneWidth * nextScale * 0.8;

                    this.ctx.beginPath();
                    this.ctx.moveTo(nlx, nextY);
                    this.ctx.lineTo(lx, y);
                    this.ctx.stroke();
                }
            }
        }

        // Side rails with glow
        this.ctx.shadowColor = '#00d4ff';
        this.ctx.shadowBlur = 15;
        this.ctx.strokeStyle = '#00d4ff';
        this.ctx.lineWidth = 3;

        // Left rail
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - 30, horizonY);
        this.ctx.lineTo(this.centerX - this.roadWidth, roadBottom);
        this.ctx.stroke();

        // Right rail
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + 30, horizonY);
        this.ctx.lineTo(this.centerX + this.roadWidth, roadBottom);
        this.ctx.stroke();

        this.ctx.shadowBlur = 0;
    }

    drawObstacles() {
        // Sort by z (far to near)
        const sorted = [...this.obstacles].sort((a, b) => b.z - a.z);

        sorted.forEach(obs => {
            if (!obs.active) return;

            const relZ = obs.z - this.position;
            if (relZ < 0 || relZ > this.segmentLength * 50) return;

            const zNorm = relZ / (this.segmentLength * 50);
            const scale = 1 / (1 + zNorm * 3);
            const y = this.height * this.horizon + (this.height - this.height * this.horizon) * (1 - Math.pow(zNorm, 0.7));

            const x = this.centerX + obs.lane * this.laneWidth * scale * 0.7;
            const w = obs.width * scale;
            const h = obs.height * scale;

            this.ctx.save();

            if (obs.type === 'question') {
                // Question block - purple glow
                this.ctx.shadowColor = '#a855f7';
                this.ctx.shadowBlur = 20 * scale;

                // 3D cube effect
                this.ctx.fillStyle = '#7c3aed';
                this.ctx.fillRect(x - w / 2 + 5 * scale, y - h + 5 * scale, w - 5 * scale, h - 5 * scale);

                this.ctx.fillStyle = '#a855f7';
                this.ctx.fillRect(x - w / 2, y - h, w - 5 * scale, h - 5 * scale);

                // Question mark
                this.ctx.fillStyle = '#fff';
                this.ctx.font = `bold ${28 * scale}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('?', x - 2 * scale, y - h / 2 - 2 * scale);
            } else if (obs.type === 'high') {
                // High obstacle (need to roll)
                this.ctx.fillStyle = '#f59e0b';
                this.ctx.shadowColor = '#f59e0b';
                this.ctx.shadowBlur = 15 * scale;
                this.ctx.fillRect(x - w / 2, y - h - 50 * scale, w, h);

                // Warning stripes
                this.ctx.fillStyle = '#000';
                const stripeW = 10 * scale;
                for (let s = 0; s < 3; s++) {
                    this.ctx.fillRect(x - w / 2 + s * stripeW * 2 + 5 * scale, y - h - 50 * scale, stripeW, h);
                }
            } else {
                // Barrier (need to jump)
                this.ctx.shadowColor = '#ff4757';
                this.ctx.shadowBlur = 15 * scale;

                // 3D barrier
                this.ctx.fillStyle = '#dc2626';
                this.ctx.fillRect(x - w / 2 + 5 * scale, y - h + 5 * scale, w - 5 * scale, h - 10 * scale);

                this.ctx.fillStyle = '#ff4757';
                this.ctx.fillRect(x - w / 2, y - h, w - 5 * scale, h - 10 * scale);

                // Hazard stripes
                this.ctx.fillStyle = '#000';
                const stripeW = 8 * scale;
                for (let s = 0; s < 4; s++) {
                    this.ctx.fillRect(x - w / 2 + s * stripeW * 2, y - h, stripeW, h - 10 * scale);
                }
            }

            this.ctx.restore();
        });
    }

    drawCollectibles() {
        this.collectibles.forEach(col => {
            if (col.collected) return;

            const relZ = col.z - this.position;
            if (relZ < 0 || relZ > this.segmentLength * 50) return;

            const zNorm = relZ / (this.segmentLength * 50);
            const scale = 1 / (1 + zNorm * 3);
            const baseY = this.height * this.horizon + (this.height - this.height * this.horizon) * (1 - Math.pow(zNorm, 0.7));

            const bob = Math.sin(col.bobPhase) * 5 * scale;
            const x = this.centerX + col.lane * this.laneWidth * scale * 0.7;
            const y = baseY - 50 * scale - col.jumpHeight * scale + bob;

            this.ctx.save();

            if (col.type === 'coin') {
                this.ctx.shadowColor = '#ffd700';
                this.ctx.shadowBlur = 15 * scale;
                this.ctx.fillStyle = '#ffd700';
                this.ctx.beginPath();
                this.ctx.arc(x, y, 15 * scale, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = '#fff';
                this.ctx.font = `${12 * scale}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('$', x, y);
            } else {
                this.ctx.shadowColor = '#ff6b81';
                this.ctx.shadowBlur = 15 * scale;
                this.ctx.font = `${24 * scale}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('❤️', x, y);
            }

            this.ctx.restore();
        });
    }

    drawPlayer() {
        const px = this.centerX + this.currentLane * this.laneWidth * 0.6;
        const groundY = this.height - 80;
        const py = groundY - this.player.jumpHeight;

        this.ctx.save();
        this.ctx.translate(px, py);

        // Player glow
        this.ctx.shadowColor = '#00d4ff';
        this.ctx.shadowBlur = 25;

        if (this.player.isRolling) {
            // Rolling - circular shape
            this.ctx.fillStyle = '#00d4ff';
            this.ctx.beginPath();
            this.ctx.ellipse(0, -20, 40, 25, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Rolling effect
            const rot = this.player.animFrame * 0.5;
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(0, -20, 15, rot, rot + Math.PI);
            this.ctx.stroke();
        } else {
            // Standing/Running character
            const bounce = this.player.isJumping ? 0 : Math.sin(this.player.animFrame * 0.8) * 3;

            // Body
            this.ctx.fillStyle = '#00d4ff';
            this.ctx.beginPath();
            this.ctx.roundRect(-22, -70 + bounce, 44, 55, 10);
            this.ctx.fill();

            // Head
            this.ctx.beginPath();
            this.ctx.arc(0, -90 + bounce, 22, 0, Math.PI * 2);
            this.ctx.fill();

            // Nurse cap
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(-18, -115 + bounce, 36, 12);
            this.ctx.fillStyle = '#ff4757';
            this.ctx.fillRect(-4, -112 + bounce, 8, 8);

            // Legs with running animation
            const legSwing = this.player.isJumping ? 0 : Math.sin(this.player.animFrame * 1.2) * 15;
            this.ctx.fillStyle = '#0891b2';
            this.ctx.fillRect(-15, -18 + bounce, 12, 25 + legSwing);
            this.ctx.fillRect(3, -18 + bounce, 12, 25 - legSwing);

            // Eyes
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(-7, -92 + bounce, 5, 0, Math.PI * 2);
            this.ctx.arc(7, -92 + bounce, 5, 0, Math.PI * 2);
            this.ctx.fill();

            // Pupils
            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(-5, -92 + bounce, 2, 0, Math.PI * 2);
            this.ctx.arc(9, -92 + bounce, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    drawParticles() {
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
        // Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 28px "Space Grotesk", Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${this.score}`, 25, 45);

        // Multiplier
        if (this.multiplier > 1) {
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText(`x${this.multiplier}`, 25, 72);
        }

        // Coins
        this.ctx.fillStyle = '#ffd700';
        this.ctx.textAlign = 'right';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`💰 ${this.coins}`, this.width - 25, 45);

        // Lives
        let hearts = '';
        for (let i = 0; i < 3; i++) {
            hearts += i < this.lives ? '❤️' : '🖤';
        }
        this.ctx.font = '26px Arial';
        this.ctx.fillText(hearts, this.width - 25, 80);

        // Streak
        if (this.streak > 0) {
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#10b981';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText(`🔥 ${this.streak} Streak!`, this.centerX, 45);
        }

        // Speed indicator
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#888';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`Speed: ${this.speed.toFixed(1)}x`, 25, this.height - 20);
    }

    drawMenu() {
        // Dark overlay
        this.ctx.fillStyle = 'rgba(0,0,0,0.75)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Title with glow
        this.ctx.shadowColor = '#a855f7';
        this.ctx.shadowBlur = 40;
        this.ctx.fillStyle = '#a855f7';
        this.ctx.font = 'bold 52px "Space Grotesk", Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏃 ANATOMY RUSH', this.centerX, 130);
        this.ctx.shadowBlur = 0;

        // Subtitle
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('3D Endless Runner • Learn While You Play', this.centerX, 170);

        // High score
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = 'bold 26px Arial';
        this.ctx.fillText(`🏆 High Score: ${this.highScore}`, this.centerX, 230);
        this.ctx.fillText(`💰 Total Coins: ${this.totalCoins}`, this.centerX, 270);

        // Controls
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('← → or A/D : Switch Lanes', this.centerX, 330);
        this.ctx.fillText('SPACE or W : Jump', this.centerX, 360);
        this.ctx.fillText('↓ or S : Roll/Slide', this.centerX, 390);
        this.ctx.fillText('❓ Hit question blocks for bonus points!', this.centerX, 430);

        // Start prompt
        const pulse = 0.7 + Math.sin(Date.now() / 300) * 0.3;
        this.ctx.globalAlpha = pulse;
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('[ TAP OR PRESS SPACE ]', this.centerX, 500);
        this.ctx.globalAlpha = 1;
    }

    drawQuestion() {
        // Overlay
        this.ctx.fillStyle = 'rgba(0,0,0,0.9)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (!this.currentQuestion) return;

        // Question text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';

        // Word wrap
        const words = this.currentQuestion.text.split(' ');
        let line = '';
        let y = 80;
        const maxW = this.width - 100;

        words.forEach(word => {
            const test = line + word + ' ';
            if (this.ctx.measureText(test).width > maxW && line) {
                this.ctx.fillText(line, this.centerX, y);
                line = word + ' ';
                y += 26;
            } else {
                line = test;
            }
        });
        this.ctx.fillText(line, this.centerX, y);

        // Options
        const startY = 180;
        const optH = 55;
        const gap = 12;
        const margin = 60;

        this.currentQuestion.options.forEach((opt, i) => {
            const optY = startY + i * (optH + gap);

            let bg = '#2a2a4e';
            if (this.questionResult && i === this.selectedAnswer) {
                bg = this.questionResult === 'correct' ? '#10b981' : '#ef4444';
            }
            if (this.questionResult === 'wrong' && opt === this.currentQuestion.correct) {
                bg = '#10b981';
            }

            // Option background
            this.ctx.fillStyle = bg;
            this.ctx.beginPath();
            this.ctx.roundRect(margin, optY, this.width - margin * 2, optH, 12);
            this.ctx.fill();

            // Border
            this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            this.ctx.lineWidth = 1;
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
            this.ctx.fillText(text, margin + 18, optY + 35);
        });

        // Result feedback
        if (this.questionResult) {
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold 32px Arial';

            if (this.questionResult === 'correct') {
                this.ctx.fillStyle = '#10b981';
                this.ctx.fillText(`✓ CORRECT! +${5 * this.multiplier} coins`, this.centerX, this.height - 60);
            } else {
                this.ctx.fillStyle = '#ef4444';
                this.ctx.fillText('✗ WRONG!', this.centerX, this.height - 60);
            }
        } else {
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#64748b';
            this.ctx.font = '14px Arial';
            this.ctx.fillText('Click an answer or press 1-4', this.centerX, this.height - 30);
        }
    }

    drawGameOver() {
        // Overlay
        this.ctx.fillStyle = 'rgba(0,0,0,0.85)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Game Over
        this.ctx.shadowColor = '#ef4444';
        this.ctx.shadowBlur = 40;
        this.ctx.fillStyle = '#ef4444';
        this.ctx.font = 'bold 56px "Space Grotesk", Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.centerX, 160);
        this.ctx.shadowBlur = 0;

        // Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.centerX, 240);

        // High score
        if (this.score >= this.highScore) {
            this.ctx.fillStyle = '#ffd700';
            this.ctx.fillText('🏆 NEW HIGH SCORE! 🏆', this.centerX, 300);
        } else {
            this.ctx.fillStyle = '#888';
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`High Score: ${this.highScore}`, this.centerX, 300);
        }

        // Coins earned
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = 'bold 26px Arial';
        this.ctx.fillText(`💰 Coins: ${this.coins}`, this.centerX, 360);

        // XP
        this.ctx.fillStyle = '#10b981';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`+${Math.floor(this.score / 10)} XP earned!`, this.centerX, 400);

        // Retry prompt
        const pulse = 0.7 + Math.sin(Date.now() / 300) * 0.3;
        this.ctx.globalAlpha = pulse;
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.font = 'bold 26px Arial';
        this.ctx.fillText('[ TAP OR PRESS SPACE TO RETRY ]', this.centerX, 480);
        this.ctx.globalAlpha = 1;
    }

    // Game loop
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
            this.updateStatsDisplay();
            requestAnimationFrame((t) => this.loop(t));
        }
    }

    stop() {
        this.running = false;
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
        }
    }
}

// Global game instance
let anatomyRunner = null;

function initGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    // Stop existing game if any
    if (anatomyRunner) {
        anatomyRunner.stop();
    }

    // Create new game
    anatomyRunner = new AnatomyRush(canvas);
    anatomyRunner.start();
}

function stopGame() {
    if (anatomyRunner) {
        anatomyRunner.stop();
        anatomyRunner = null;
    }
}

// Handle resize
window.addEventListener('resize', () => {
    if (anatomyRunner) {
        anatomyRunner.resize();
    }
});
