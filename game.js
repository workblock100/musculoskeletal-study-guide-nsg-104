// ============================================
// ANATOMY RUNNER - Endless Runner Learning Game
// An award-winning gamified learning experience
// ============================================

class AnatomyRunner {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        // Game state
        this.gameState = 'menu'; // menu, playing, paused, question, gameover
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.streak = 0;
        this.multiplier = 1;
        this.distance = 0;
        this.highScore = parseInt(localStorage.getItem('anatomyRunnerHighScore')) || 0;
        this.totalCoins = parseInt(localStorage.getItem('anatomyRunnerCoins')) || 0;

        // Speed and difficulty
        this.baseSpeed = 5;
        this.speed = this.baseSpeed;
        this.maxSpeed = 12;
        this.speedIncrement = 0.001;

        // Player
        this.player = {
            x: 80,
            y: this.height - 150,
            width: 60,
            height: 80,
            velocityY: 0,
            isJumping: false,
            isSliding: false,
            slideTimer: 0,
            groundY: this.height - 150,
            frame: 0,
            frameTimer: 0
        };

        // Physics
        this.gravity = 0.6;
        this.jumpForce = -14;
        this.slideDuration = 30;

        // Game objects
        this.obstacles = [];
        this.collectibles = [];
        this.particles = [];
        this.backgrounds = [];

        // Timing
        this.obstacleTimer = 0;
        this.obstacleInterval = 120;
        this.collectibleTimer = 0;

        // Current question
        this.currentQuestion = null;
        this.selectedAnswer = -1;
        this.questionResult = null;
        this.questionTimer = 0;

        // Visual effects
        this.screenShake = 0;
        this.flashColor = null;
        this.flashTimer = 0;

        // Animation
        this.animationId = null;
        this.lastTime = 0;

        // Input
        this.keys = {};
        this.touchStartY = 0;

        // Colors - Premium dark theme
        this.colors = {
            bg: '#0a0a1a',
            ground: '#1a1a2e',
            groundLine: '#00d4ff',
            player: '#00d4ff',
            playerGlow: 'rgba(0, 212, 255, 0.3)',
            obstacle: '#ff4757',
            coin: '#ffd700',
            heart: '#ff6b81',
            text: '#ffffff',
            accent: '#00d4ff',
            success: '#2ed573',
            danger: '#ff4757'
        };

        this.initBackgrounds();
        this.bindEvents();
    }

    initBackgrounds() {
        // Parallax hospital hallway layers
        this.backgrounds = [
            { speed: 0.2, elements: this.generateBgLayer(0.2, 5) },
            { speed: 0.5, elements: this.generateBgLayer(0.5, 8) },
            { speed: 0.8, elements: this.generateBgLayer(0.8, 12) }
        ];
    }

    generateBgLayer(speed, count) {
        const elements = [];
        for (let i = 0; i < count; i++) {
            elements.push({
                x: i * (this.width / count) + Math.random() * 50,
                type: Math.random() > 0.5 ? 'window' : 'door',
                height: 60 + Math.random() * 40
            });
        }
        return elements;
    }

    bindEvents() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (this.gameState === 'playing') {
                if (e.code === 'Space' || e.code === 'ArrowUp') {
                    e.preventDefault();
                    this.jump();
                }
                if (e.code === 'ArrowDown') {
                    e.preventDefault();
                    this.slide();
                }
            }
            if (this.gameState === 'menu' && e.code === 'Space') {
                this.startGame();
            }
            if (this.gameState === 'gameover' && e.code === 'Space') {
                this.resetGame();
            }
            if (this.gameState === 'question') {
                if (e.code >= 'Digit1' && e.code <= 'Digit4') {
                    this.selectAnswer(parseInt(e.code.slice(-1)) - 1);
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Touch controls
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchStartY = e.touches[0].clientY;
            if (this.gameState === 'menu') this.startGame();
            if (this.gameState === 'gameover') this.resetGame();
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchY = e.touches[0].clientY;
            const diff = this.touchStartY - touchY;
            if (this.gameState === 'playing') {
                if (diff > 30) this.jump();
                if (diff < -30) this.slide();
            }
        });

        // Canvas click for answers
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState === 'question') {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.handleQuestionClick(x, y);
            }
            if (this.gameState === 'menu') this.startGame();
            if (this.gameState === 'gameover') this.resetGame();
        });
    }

    jump() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.velocityY = this.jumpForce;
            this.player.isJumping = true;
            this.addJumpParticles();
        }
    }

    slide() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.isSliding = true;
            this.player.slideTimer = this.slideDuration;
            this.player.height = 40;
            this.player.y = this.player.groundY + 40;
        }
    }

    addJumpParticles() {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y + this.player.height,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 2,
                size: 3 + Math.random() * 3,
                life: 30,
                color: this.colors.accent
            });
        }
    }

    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.streak = 0;
        this.multiplier = 1;
        this.distance = 0;
        this.speed = this.baseSpeed;
        this.obstacles = [];
        this.collectibles = [];
        this.particles = [];
        this.player.y = this.player.groundY;
        this.player.height = 80;
        this.player.isJumping = false;
        this.player.isSliding = false;
        this.player.velocityY = 0;
    }

    resetGame() {
        this.gameState = 'menu';
    }

    update(deltaTime) {
        if (this.gameState === 'playing') {
            this.updatePlaying(deltaTime);
        }

        // Always update particles
        this.updateParticles();

        // Update screen effects
        if (this.screenShake > 0) this.screenShake -= 0.5;
        if (this.flashTimer > 0) this.flashTimer--;
    }

    updatePlaying(deltaTime) {
        // Increase speed over time
        if (this.speed < this.maxSpeed) {
            this.speed += this.speedIncrement;
        }

        // Update distance/score
        this.distance += this.speed;
        this.score = Math.floor(this.distance / 10) * this.multiplier;

        // Update player
        this.updatePlayer();

        // Update backgrounds
        this.updateBackgrounds();

        // Spawn obstacles
        this.obstacleTimer++;
        if (this.obstacleTimer >= this.obstacleInterval) {
            this.spawnObstacle();
            this.obstacleTimer = 0;
            this.obstacleInterval = 80 + Math.random() * 60;
        }

        // Spawn collectibles
        this.collectibleTimer++;
        if (this.collectibleTimer >= 60) {
            if (Math.random() > 0.6) this.spawnCollectible();
            this.collectibleTimer = 0;
        }

        // Update obstacles
        this.updateObstacles();

        // Update collectibles
        this.updateCollectibles();

        // Update player animation
        this.player.frameTimer++;
        if (this.player.frameTimer >= 6) {
            this.player.frame = (this.player.frame + 1) % 4;
            this.player.frameTimer = 0;
        }
    }

    updatePlayer() {
        // Apply gravity
        this.player.velocityY += this.gravity;
        this.player.y += this.player.velocityY;

        // Ground collision
        if (this.player.y >= this.player.groundY) {
            this.player.y = this.player.groundY;
            this.player.velocityY = 0;
            this.player.isJumping = false;
        }

        // Sliding
        if (this.player.isSliding) {
            this.player.slideTimer--;
            if (this.player.slideTimer <= 0) {
                this.player.isSliding = false;
                this.player.height = 80;
                this.player.y = this.player.groundY;
            }
        }
    }

    updateBackgrounds() {
        this.backgrounds.forEach(layer => {
            layer.elements.forEach(el => {
                el.x -= this.speed * layer.speed;
                if (el.x < -100) {
                    el.x = this.width + 50;
                }
            });
        });
    }

    spawnObstacle() {
        const types = ['low', 'high', 'question'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'question') {
            this.obstacles.push({
                x: this.width,
                y: this.height - 200,
                width: 60,
                height: 60,
                type: 'question',
                active: true
            });
        } else if (type === 'low') {
            this.obstacles.push({
                x: this.width,
                y: this.height - 130,
                width: 40,
                height: 50,
                type: 'low',
                active: true
            });
        } else {
            this.obstacles.push({
                x: this.width,
                y: this.height - 180,
                width: 60,
                height: 40,
                type: 'high',
                active: true
            });
        }
    }

    spawnCollectible() {
        const y = this.height - 180 - Math.random() * 80;
        this.collectibles.push({
            x: this.width,
            y: y,
            size: 20,
            type: Math.random() > 0.9 ? 'heart' : 'coin',
            collected: false,
            bobOffset: Math.random() * Math.PI * 2
        });
    }

    updateObstacles() {
        this.obstacles = this.obstacles.filter(obs => {
            obs.x -= this.speed;

            if (obs.active && this.checkCollision(this.player, obs)) {
                if (obs.type === 'question') {
                    this.triggerQuestion();
                    obs.active = false;
                } else {
                    this.hitObstacle();
                    obs.active = false;
                }
            }

            return obs.x > -100;
        });
    }

    updateCollectibles() {
        this.collectibles = this.collectibles.filter(col => {
            col.x -= this.speed;
            col.bobOffset += 0.1;

            if (!col.collected && this.checkCollision(this.player, {
                x: col.x - col.size / 2,
                y: col.y + Math.sin(col.bobOffset) * 5 - col.size / 2,
                width: col.size,
                height: col.size
            })) {
                col.collected = true;
                if (col.type === 'coin') {
                    this.coins++;
                    this.totalCoins++;
                    localStorage.setItem('anatomyRunnerCoins', this.totalCoins);
                    this.addCollectParticles(col.x, col.y, this.colors.coin);
                } else {
                    if (this.lives < 3) {
                        this.lives++;
                        this.addCollectParticles(col.x, col.y, this.colors.heart);
                    }
                }
            }

            return col.x > -50 && !col.collected;
        });
    }

    checkCollision(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    hitObstacle() {
        this.lives--;
        this.streak = 0;
        this.multiplier = 1;
        this.screenShake = 10;
        this.flashColor = this.colors.danger;
        this.flashTimer = 10;

        // Hit particles
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: this.player.x + this.player.width,
                y: this.player.y + this.player.height / 2,
                vx: Math.random() * 6 + 2,
                vy: (Math.random() - 0.5) * 8,
                size: 4 + Math.random() * 4,
                life: 40,
                color: this.colors.danger
            });
        }

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        this.gameState = 'gameover';
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('anatomyRunnerHighScore', this.highScore);
        }
        // Award XP if function exists
        if (typeof awardXP === 'function') {
            awardXP(Math.floor(this.score / 10), 'game');
        }
    }

    triggerQuestion() {
        this.gameState = 'question';
        // Get random question from quiz data
        if (typeof quizQuestionsBase !== 'undefined' && quizQuestionsBase.length > 0) {
            const q = quizQuestionsBase[Math.floor(Math.random() * quizQuestionsBase.length)];
            if (q.type !== 'sata') { // Only use single-answer questions
                this.currentQuestion = {
                    text: q.q,
                    options: this.shuffleArray([...q.options]),
                    correct: q.correctAnswer,
                    explanation: q.explanation
                };
            } else {
                // Skip SATA, continue playing
                this.gameState = 'playing';
                this.streak++;
                this.coins += 2;
            }
        } else {
            // Fallback question
            this.currentQuestion = {
                text: "What are the 6 P's of neurovascular assessment?",
                options: ["Pain, Pallor, Pulse, Paralysis, Paresthesia, Poikilothermia", "Pressure, Pain, Pallor, Pulse, Position, Paresthesia", "Pain, Pressure, Pallor, Paralysis, Position, Pulse", "None of the above"],
                correct: "Pain, Pallor, Pulse, Paralysis, Paresthesia, Poikilothermia",
                explanation: "The 6 P's are critical for neurovascular assessment."
            };
        }
        this.selectedAnswer = -1;
        this.questionResult = null;
        this.questionTimer = 0;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.slice(0, 4); // Max 4 options
    }

    selectAnswer(index) {
        if (this.questionResult !== null) return;
        this.selectedAnswer = index;
        const selected = this.currentQuestion.options[index];

        if (selected === this.currentQuestion.correct) {
            this.questionResult = 'correct';
            this.streak++;
            this.multiplier = Math.min(5, 1 + Math.floor(this.streak / 3));
            this.coins += 5 * this.multiplier;
            this.flashColor = this.colors.success;
            this.flashTimer = 15;
            this.addCollectParticles(this.width / 2, this.height / 2, this.colors.success);
        } else {
            this.questionResult = 'wrong';
            this.lives--;
            this.streak = 0;
            this.multiplier = 1;
            this.screenShake = 8;
            this.flashColor = this.colors.danger;
            this.flashTimer = 10;

            if (this.lives <= 0) {
                setTimeout(() => this.gameOver(), 1500);
                return;
            }
        }

        setTimeout(() => {
            this.gameState = 'playing';
            this.currentQuestion = null;
        }, 1500);
    }

    handleQuestionClick(x, y) {
        if (!this.currentQuestion || this.questionResult !== null) return;

        const startY = 200;
        const optionHeight = 60;
        const margin = 50;

        for (let i = 0; i < this.currentQuestion.options.length; i++) {
            const optY = startY + i * (optionHeight + 15);
            if (x >= margin && x <= this.width - margin &&
                y >= optY && y <= optY + optionHeight) {
                this.selectAnswer(i);
                break;
            }
        }
    }

    addCollectParticles(x, y, color) {
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 4,
                vy: Math.sin(angle) * 4,
                size: 4,
                life: 30,
                color: color
            });
        }
    }

    updateParticles() {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life--;
            p.size *= 0.95;
            return p.life > 0;
        });
    }

    // ========== RENDERING ==========

    render() {
        // Apply screen shake
        this.ctx.save();
        if (this.screenShake > 0) {
            this.ctx.translate(
                (Math.random() - 0.5) * this.screenShake,
                (Math.random() - 0.5) * this.screenShake
            );
        }

        // Clear and draw background
        this.drawBackground();

        // Draw based on game state
        switch (this.gameState) {
            case 'menu':
                this.drawMenu();
                break;
            case 'playing':
                this.drawGame();
                break;
            case 'question':
                this.drawGame();
                this.drawQuestion();
                break;
            case 'gameover':
                this.drawGame();
                this.drawGameOver();
                break;
        }

        // Flash effect
        if (this.flashTimer > 0 && this.flashColor) {
            this.ctx.fillStyle = this.flashColor;
            this.ctx.globalAlpha = this.flashTimer / 20;
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.globalAlpha = 1;
        }

        this.ctx.restore();
    }

    drawBackground() {
        // Gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#1a1a2e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw parallax layers
        this.backgrounds.forEach((layer, idx) => {
            this.ctx.globalAlpha = 0.3 + idx * 0.2;
            layer.elements.forEach(el => {
                this.ctx.fillStyle = '#2a2a4e';
                if (el.type === 'window') {
                    this.ctx.fillRect(el.x, 100, 40, el.height);
                    this.ctx.fillStyle = '#00d4ff22';
                    this.ctx.fillRect(el.x + 5, 105, 30, el.height - 10);
                } else {
                    this.ctx.fillRect(el.x, 80, 50, el.height + 20);
                }
            });
            this.ctx.globalAlpha = 1;
        });

        // Ground
        this.ctx.fillStyle = this.colors.ground;
        this.ctx.fillRect(0, this.height - 80, this.width, 80);

        // Ground line with glow
        this.ctx.shadowColor = this.colors.groundLine;
        this.ctx.shadowBlur = 10;
        this.ctx.strokeStyle = this.colors.groundLine;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height - 80);
        this.ctx.lineTo(this.width, this.height - 80);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    drawGame() {
        // Draw collectibles
        this.collectibles.forEach(col => {
            const bobY = col.y + Math.sin(col.bobOffset) * 5;
            this.ctx.save();
            this.ctx.translate(col.x, bobY);

            if (col.type === 'coin') {
                // Coin glow
                this.ctx.shadowColor = this.colors.coin;
                this.ctx.shadowBlur = 15;
                this.ctx.fillStyle = this.colors.coin;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, col.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = '#fff';
                this.ctx.font = 'bold 14px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('💰', 0, 0);
            } else {
                this.ctx.shadowColor = this.colors.heart;
                this.ctx.shadowBlur = 15;
                this.ctx.font = '24px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('❤️', 0, 0);
            }
            this.ctx.restore();
        });

        // Draw obstacles
        this.obstacles.forEach(obs => {
            if (!obs.active) return;
            this.ctx.save();

            if (obs.type === 'question') {
                // Question block - glowing
                this.ctx.shadowColor = this.colors.accent;
                this.ctx.shadowBlur = 20;
                this.ctx.fillStyle = this.colors.accent;
                this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                this.ctx.fillStyle = '#fff';
                this.ctx.font = 'bold 30px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('?', obs.x + obs.width / 2, obs.y + obs.height / 2);
            } else {
                // Regular obstacle
                this.ctx.shadowColor = this.colors.obstacle;
                this.ctx.shadowBlur = 10;
                this.ctx.fillStyle = this.colors.obstacle;
                this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                // Hazard stripes
                this.ctx.fillStyle = '#000';
                for (let i = 0; i < 3; i++) {
                    this.ctx.fillRect(obs.x + i * 15, obs.y, 5, obs.height);
                }
            }
            this.ctx.restore();
        });

        // Draw player
        this.drawPlayer();

        // Draw particles
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life / 40;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });

        // Draw HUD
        this.drawHUD();
    }

    drawPlayer() {
        this.ctx.save();
        this.ctx.translate(this.player.x, this.player.y);

        // Player glow
        this.ctx.shadowColor = this.colors.playerGlow;
        this.ctx.shadowBlur = 20;

        // Body
        this.ctx.fillStyle = this.colors.player;
        if (this.player.isSliding) {
            // Sliding pose
            this.ctx.fillRect(0, 0, this.player.width + 20, this.player.height);
        } else {
            // Running pose with animation
            this.ctx.fillRect(0, 0, this.player.width, this.player.height);

            // Head
            this.ctx.beginPath();
            this.ctx.arc(this.player.width / 2, -15, 20, 0, Math.PI * 2);
            this.ctx.fill();

            // Nurse cap
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(this.player.width / 2 - 15, -35, 30, 10);
            this.ctx.fillStyle = '#ff4757';
            this.ctx.fillRect(this.player.width / 2 - 3, -32, 6, 6);

            // Running legs animation
            const legOffset = Math.sin(this.player.frame * 0.8) * 15;
            this.ctx.fillStyle = this.colors.player;
            this.ctx.fillRect(10, this.player.height, 15, 20 + legOffset);
            this.ctx.fillRect(35, this.player.height, 15, 20 - legOffset);
        }

        this.ctx.restore();
    }

    drawHUD() {
        // Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);

        // Multiplier
        if (this.multiplier > 1) {
            this.ctx.fillStyle = this.colors.coin;
            this.ctx.fillText(`x${this.multiplier}`, 20, 70);
        }

        // Coins
        this.ctx.fillStyle = this.colors.coin;
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`💰 ${this.coins}`, this.width - 20, 40);

        // Lives
        let heartsStr = '';
        for (let i = 0; i < 3; i++) {
            heartsStr += i < this.lives ? '❤️' : '🖤';
        }
        this.ctx.font = '28px Arial';
        this.ctx.fillText(heartsStr, this.width - 20, 75);

        // Streak
        if (this.streak > 0) {
            this.ctx.fillStyle = this.colors.success;
            this.ctx.font = 'bold 18px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`🔥 ${this.streak} Streak!`, this.width / 2, 40);
        }
    }

    drawMenu() {
        // Overlay
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Title with glow
        this.ctx.shadowColor = this.colors.accent;
        this.ctx.shadowBlur = 30;
        this.ctx.fillStyle = this.colors.accent;
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏃 ANATOMY RUNNER', this.width / 2, 150);
        this.ctx.shadowBlur = 0;

        // Subtitle
        this.ctx.fillStyle = '#aaa';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Learn nursing concepts while running!', this.width / 2, 190);

        // High score
        this.ctx.fillStyle = this.colors.coin;
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`🏆 High Score: ${this.highScore}`, this.width / 2, 250);
        this.ctx.fillText(`💰 Total Coins: ${this.totalCoins}`, this.width / 2, 285);

        // Instructions
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('⬆️ SPACE/UP - Jump over low obstacles', this.width / 2, 340);
        this.ctx.fillText('⬇️ DOWN - Slide under high obstacles', this.width / 2, 370);
        this.ctx.fillText('❓ Hit question blocks to answer!', this.width / 2, 400);

        // Start prompt
        this.ctx.fillStyle = this.colors.accent;
        this.ctx.font = 'bold 28px Arial';
        const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
        this.ctx.globalAlpha = pulse;
        this.ctx.fillText('[ TAP OR PRESS SPACE TO START ]', this.width / 2, 480);
        this.ctx.globalAlpha = 1;
    }

    drawQuestion() {
        // Dim background
        this.ctx.fillStyle = 'rgba(0,0,0,0.85)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (!this.currentQuestion) return;

        // Question text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';

        // Word wrap question
        const words = this.currentQuestion.text.split(' ');
        let line = '';
        let y = 100;
        const maxWidth = this.width - 100;

        words.forEach(word => {
            const testLine = line + word + ' ';
            const metrics = this.ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                this.ctx.fillText(line, this.width / 2, y);
                line = word + ' ';
                y += 28;
            } else {
                line = testLine;
            }
        });
        this.ctx.fillText(line, this.width / 2, y);

        // Options
        const startY = 200;
        const optionHeight = 55;
        const margin = 50;

        this.currentQuestion.options.forEach((opt, i) => {
            const optY = startY + i * (optionHeight + 12);

            // Option background
            let bgColor = '#2a2a4e';
            if (this.questionResult !== null && i === this.selectedAnswer) {
                bgColor = this.questionResult === 'correct' ? this.colors.success : this.colors.danger;
            }
            if (this.questionResult !== null && opt === this.currentQuestion.correct && this.questionResult === 'wrong') {
                bgColor = this.colors.success;
            }

            this.ctx.fillStyle = bgColor;
            this.ctx.beginPath();
            this.ctx.roundRect(margin, optY, this.width - margin * 2, optionHeight, 10);
            this.ctx.fill();

            // Option text
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'left';

            // Truncate if too long
            let displayText = `${i + 1}. ${opt}`;
            while (this.ctx.measureText(displayText).width > this.width - margin * 2 - 20) {
                displayText = displayText.slice(0, -1);
            }
            this.ctx.fillText(displayText, margin + 15, optY + 35);
        });

        // Result feedback
        if (this.questionResult) {
            this.ctx.font = 'bold 36px Arial';
            this.ctx.textAlign = 'center';
            if (this.questionResult === 'correct') {
                this.ctx.fillStyle = this.colors.success;
                this.ctx.fillText('✓ CORRECT! +' + (5 * this.multiplier) + ' coins', this.width / 2, this.height - 80);
            } else {
                this.ctx.fillStyle = this.colors.danger;
                this.ctx.fillText('✗ WRONG!', this.width / 2, this.height - 80);
            }
        } else {
            this.ctx.fillStyle = '#888';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Click an answer or press 1-4', this.width / 2, this.height - 40);
        }
    }

    drawGameOver() {
        // Overlay
        this.ctx.fillStyle = 'rgba(0,0,0,0.85)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Game Over text
        this.ctx.shadowColor = this.colors.danger;
        this.ctx.shadowBlur = 30;
        this.ctx.fillStyle = this.colors.danger;
        this.ctx.font = 'bold 56px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.width / 2, 180);
        this.ctx.shadowBlur = 0;

        // Stats
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.width / 2, 260);

        if (this.score >= this.highScore) {
            this.ctx.fillStyle = this.colors.coin;
            this.ctx.fillText('🏆 NEW HIGH SCORE! 🏆', this.width / 2, 310);
        } else {
            this.ctx.fillStyle = '#888';
            this.ctx.fillText(`High Score: ${this.highScore}`, this.width / 2, 310);
        }

        this.ctx.fillStyle = this.colors.coin;
        this.ctx.fillText(`💰 Coins Earned: ${this.coins}`, this.width / 2, 360);

        this.ctx.fillStyle = this.colors.success;
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`XP Earned: +${Math.floor(this.score / 10)}`, this.width / 2, 400);

        // Restart prompt
        this.ctx.fillStyle = this.colors.accent;
        this.ctx.font = 'bold 24px Arial';
        const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
        this.ctx.globalAlpha = pulse;
        this.ctx.fillText('[ TAP OR PRESS SPACE TO RETRY ]', this.width / 2, 480);
        this.ctx.globalAlpha = 1;
    }

    // Game loop
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    start() {
        this.gameLoop(0);
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize game when tab is shown
let anatomyRunner = null;

function initGame() {
    const canvas = document.getElementById('gameCanvas');
    if (canvas && !anatomyRunner) {
        // Set canvas size
        canvas.width = canvas.parentElement.offsetWidth - 40;
        canvas.height = 550;
        anatomyRunner = new AnatomyRunner(canvas);
        anatomyRunner.start();
    }
}

function stopGame() {
    if (anatomyRunner) {
        anatomyRunner.stop();
    }
}

// Resize handler
window.addEventListener('resize', () => {
    if (anatomyRunner && anatomyRunner.canvas) {
        anatomyRunner.canvas.width = anatomyRunner.canvas.parentElement.offsetWidth - 40;
        anatomyRunner.width = anatomyRunner.canvas.width;
    }
});
