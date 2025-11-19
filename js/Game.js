import { Renderer } from './Renderer.js';
import { InputHandler } from './InputHandler.js';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { Terrain } from './entities/Terrain.js';
import { Item, ItemTypes } from './entities/Item.js';
import { DamageNumber } from './entities/DamageNumber.js';
import { Trap } from './entities/Trap.js';
import { AreaEffect } from './entities/AreaEffect.js';
import { VisualEffect } from './entities/VisualEffect.js';
import { Utils } from './utils.js';
import { Perks } from './data/perks.js';
import { GameConfig } from './data/GameConfig.js';

export class Game {
    constructor() {
        this.config = GameConfig;
        this.renderer = new Renderer('gameCanvas');
        this.input = new InputHandler();
        this.lastTime = 0;
        this.isRunning = false;
        this.isPaused = false;
        
        this.entities = [];
        this.enemies = [];
        this.projectiles = [];
        this.terrain = [];
        this.items = [];
        this.damageNumbers = [];
        this.traps = [];
        this.areaEffects = [];
        this.visualEffects = [];
        this.player = null;
        
        this.score = 0;
        this.timeSurvived = 0;
        this.waveTimer = 0;
        this.waveTimer = 0;
        this.airdropTimer = 0;
        
        // Wave System State
        this.currentWaveIndex = 0;
        this.pendingWaveSpawns = [];
        this.waveSpawnTimer = 0;
        
        // Bind loop
        this.loop = this.loop.bind(this);

        // Debug: Press P to spawn shooter
        window.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                console.log('Debug: P key pressed');
                try {
                    if (!this.player) {
                        console.warn('Debug: Player is null');
                        return;
                    }
                    const enemy = new Enemy(this.player.x + 200, this.player.y, 'shooter');
                    this.enemies.push(enemy);
                    console.log('Debug: Force spawned Shooter at', enemy.x, enemy.y);
                } catch (err) {
                    console.error('Debug: Error spawning shooter:', err);
                }
            }
            if (e.key === 'o' || e.key === 'O') {
                console.log('Debug: O key pressed');
                try {
                    if (!this.player) return;
                    const enemy = new Enemy(this.player.x + 200, this.player.y, 'tank');
                    this.enemies.push(enemy);
                    console.log('Debug: Force spawned Tank at', enemy.x, enemy.y);
                } catch (err) {
                    console.error('Debug: Error spawning tank:', err);
                }
            }
            // Debug: Star
            if (e.key === 'i' || e.key === 'I') {
                const enemy = new Enemy(this.player.x + 200, this.player.y, 'star');
                this.enemies.push(enemy);
                console.log('Debug: Force spawned Star');
            }
            // Debug: Blue Tank
            if (e.key === 'u' || e.key === 'U') {
                const enemy = new Enemy(this.player.x + 200, this.player.y, 'tank_armored');
                this.enemies.push(enemy);
                console.log('Debug: Force spawned Armored Tank');
            }
        });
    }

    start(playerName, characterClass) {
        this.player = new Player(this.renderer.canvas.width / 2, this.renderer.canvas.height / 2, characterClass);
        this.player.name = playerName;
        this.entities.push(this.player);
        
        this.generateTerrain();
        
        this.isRunning = true;
        this.isPaused = false;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
        
        // UI Updates
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('hud').classList.remove('hidden');
        
        // Set Skill Icons
        ['q', 'e', 'r'].forEach(key => {
            const skill = characterClass.skills[key];
            const slot = document.getElementById(`skill-${key}`);
            if (skill && skill.icon) {
                slot.querySelector('.icon').innerText = skill.icon;
            } else {
                slot.querySelector('.icon').innerText = '';
            }
        });
    }
    
    generateTerrain() {
        if (!this.config.terrain.enabled) return;
        
        for (let i = 0; i < this.config.terrain.count; i++) {
            const w = Utils.random(this.config.terrain.minSize, this.config.terrain.maxSize);
            const h = Utils.random(this.config.terrain.minSize, this.config.terrain.maxSize);
            const x = Utils.random(0, this.renderer.canvas.width - w);
            const y = Utils.random(0, this.renderer.canvas.height - h);
            const color = this.config.terrain.colors[Utils.randomInt(0, this.config.terrain.colors.length - 1)];
            
            // Don't spawn on player
            if (Utils.distance(x, y, this.player.x, this.player.y) > 200) {
                this.terrain.push(new Terrain(x, y, w, h, color));
            }
        }
    }

    loop(timestamp) {
        if (!this.isRunning) return;
        
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        if (!this.isPaused) {
            this.update(dt);
            this.render();
        }

        requestAnimationFrame(this.loop);
    }

    update(dt) {
        this.timeSurvived += dt;
        this.waveTimer += dt;
        this.airdropTimer += dt;

        // Spawn Enemies (Random & Waves)
        this.handleSpawning(dt);
        
        // Spawn Airdrops
        
        // Spawn Airdrops
        if (this.config.airdrops.enabled && this.airdropTimer > this.config.airdrops.interval) {
            if (Math.random() < this.config.airdrops.chance) {
                this.spawnAirdrop();
            }
            this.airdropTimer = 0;
        }

        // Update Entities
        this.player.update(dt, this.input, this);
        
        // Terrain Collision (Player)
        this.terrain.forEach(t => {
            if (Utils.rectCircleCollision(t, this.player)) {
                const dx = this.player.x - (t.x + t.w/2);
                const dy = this.player.y - (t.y + t.h/2);
                const angle = Math.atan2(dy, dx);
                this.player.x += Math.cos(angle) * 2;
                this.player.y += Math.sin(angle) * 2;
            }
        });
        
        this.enemies.forEach((enemy, index) => {
            enemy.update(dt, this.player, this);
            
            if (Utils.circleCollision(this.player, enemy)) {
                this.player.takeDamage(enemy.damage);
            }
            
            if (enemy.isDead) {
                this.enemies.splice(index, 1);
                this.score += 10;
                this.player.gainXp(10, this);
            }
        });

        this.projectiles.forEach((proj, index) => {
            proj.update(dt);
            
            this.enemies.forEach(enemy => {
                if (!proj.isEnemy && Utils.circleCollision(proj, enemy)) {
                    // --- Critical Hit Logic ---
                    const isCritical = Math.random() < this.player.critChance;
                    const damage = isCritical 
                        ? proj.damage * this.player.critMultiplier 
                        : proj.damage;
                    
                    enemy.takeDamage(damage, this, isCritical);
                    
                    if (isCritical) {
                        this.addEffect('critSpark', proj.x, proj.y, {
                            color: '#FFD700',
                            radius: 25,
                            duration: 0.3
                        });
                    } else {
                        this.addEffect('hitSpark', proj.x, proj.y, {
                            color: '#FFFFFF',
                            radius: 15,
                            duration: 0.2
                        });
                    }
                    
                    if (!proj.pierce || proj.pierce <= 0) {
                        proj.isDead = true;
                    } else {
                        proj.pierce--;
                    }
                }
            });

            // Enemy Projectile hits Player
            if (proj.isEnemy && Utils.circleCollision(proj, this.player)) {
                this.player.takeDamage(proj.damage);
                proj.isDead = true;
            }

            if (proj.isDead) {
                this.projectiles.splice(index, 1);
            }
        });
        
        this.items.forEach((item, index) => {
            item.update(dt);
            
            if (Utils.circleCollision(this.player, item)) {
                if (!this.player.inventory) {
                    this.player.inventory = item;
                    item.isDead = true;
                }
            }
            
            if (item.isDead) {
                this.items.splice(index, 1);
            }
        });
        
        this.damageNumbers.forEach((dn, index) => {
            dn.update(dt);
            if (dn.isDead) {
                this.damageNumbers.splice(index, 1);
            }
        });

        this.traps.forEach((trap, index) => {
            trap.update(dt, this);
            if (trap.isDead) this.traps.splice(index, 1);
        });

        this.areaEffects.forEach((ae, index) => {
            ae.update(dt, this);
            if (ae.isDead) this.areaEffects.splice(index, 1);
        });

        this.visualEffects.forEach((ve, index) => {
            ve.update(dt);
            if (ve.isDead) this.visualEffects.splice(index, 1);
        });

        // UI Updates
        this.updateHUD();

        if (this.player.hp <= 0) {
            this.gameOver();
        }
    }

    render() {
        this.renderer.clear();
        
        this.terrain.forEach(t => t.draw(this.renderer));
        this.items.forEach(i => i.draw(this.renderer));
        this.player.draw(this.renderer);
        this.enemies.forEach(enemy => enemy.draw(this.renderer));
        this.projectiles.forEach(proj => proj.draw(this.renderer));
        this.traps.forEach(t => t.draw(this.renderer));
        this.areaEffects.forEach(ae => ae.draw(this.renderer));
        this.visualEffects.forEach(ve => ve.draw(this.renderer));
        this.damageNumbers.forEach(dn => dn.draw(this.renderer));
    }
    
    spawnDamageNumber(x, y, amount, isCritical = false) {
        this.damageNumbers.push(new DamageNumber(x, y, amount, isCritical));
    }

    addEffect(type, x, y, config) {
        this.visualEffects.push(new VisualEffect(x, y, type, config));
    }

    handleSpawning(dt) {
        // 1. Check for Wave Triggers
        if (this.currentWaveIndex < this.config.waves.length) {
            const nextWave = this.config.waves[this.currentWaveIndex];
            if (this.timeSurvived >= nextWave.time) {
                console.log(`Starting Wave ${this.currentWaveIndex + 1}: ${nextWave.type} x${nextWave.count}`);
                // Queue spawns
                for (let i = 0; i < nextWave.count; i++) {
                    this.pendingWaveSpawns.push({
                        type: nextWave.type,
                        delay: i * nextWave.interval
                    });
                }
                this.currentWaveIndex++;
            }
        }

        // 2. Process Pending Wave Spawns
        if (this.pendingWaveSpawns.length > 0) {
            for (let i = this.pendingWaveSpawns.length - 1; i >= 0; i--) {
                const spawn = this.pendingWaveSpawns[i];
                spawn.delay -= dt;
                if (spawn.delay <= 0) {
                    this.spawnEnemy(spawn.type);
                    this.pendingWaveSpawns.splice(i, 1);
                }
            }
        }

        // 3. Regular Random Spawning
        const spawnInterval = Math.max(
            this.config.spawning.minInterval, 
            this.config.spawning.baseInterval - (this.player.level * this.config.spawning.decreasePerWave)
        );
        
        if (this.waveTimer > spawnInterval) {
            this.spawnRandomEnemy();
            this.waveTimer = 0;
        }
    }

    spawnRandomEnemy() {
        // Determine current pool based on time
        let currentPool = this.config.spawnPools[0];
        for (const pool of this.config.spawnPools) {
            if (this.timeSurvived >= pool.minTime) {
                currentPool = pool;
            }
        }

        // Weighted Random Selection
        const weights = currentPool.weights;
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        let selectedType = 'basic';
        for (const [type, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) {
                selectedType = type;
                break;
            }
        }
        
        this.spawnEnemy(selectedType);
    }

    spawnEnemy(forceType = null) {
        // Spawn at random edge
        const edge = Utils.randomInt(0, 3);
        let x, y;
        const w = this.renderer.canvas.width;
        const h = this.renderer.canvas.height;
        
        switch(edge) {
            case 0: x = Utils.random(0, w); y = -50; break; // Top
            case 1: x = w + 50; y = Utils.random(0, h); break; // Right
            case 2: x = Utils.random(0, w); y = h + 50; break; // Bottom
            case 3: x = -50; y = Utils.random(0, h); break; // Left
        }
        
        const type = forceType || 'basic';
        const enemy = new Enemy(x, y, type);
        this.enemies.push(enemy);
    }
    
    spawnAirdrop() {
        const w = this.renderer.canvas.width;
        const h = this.renderer.canvas.height;
        const x = Utils.random(50, w - 50);
        const y = Utils.random(50, h - 50);
        const type = ItemTypes[Utils.randomInt(0, ItemTypes.length - 1)];
        
        const item = new Item(x, y, type);
        item.lifeTime = this.config.airdrops.duration;
        this.items.push(item);
    }

    triggerLevelUp() {
        this.isPaused = true;
        const modal = document.getElementById('level-up-modal');
        const container = document.getElementById('perk-options');
        container.innerHTML = '';
        
        // Pick 3 random perks
        const options = [];
        while(options.length < 3) {
            const p = Perks[Utils.randomInt(0, Perks.length - 1)];
            if (!options.includes(p)) options.push(p);
        }
        
        options.forEach((perk, index) => {
            const div = document.createElement('div');
            div.className = 'perk-card';
            div.style.animationDelay = `${index * 0.1}s`;
            
            div.innerHTML = `
                <div class="perk-icon">${perk.icon}</div>
                <div class="perk-info">
                    <h3>${perk.name}</h3>
                    <p>${perk.description}</p>
                </div>
            `;
            
            div.onclick = () => {
                perk.apply(this.player);
                modal.classList.add('hidden');
                this.isPaused = false;
                // Reset lastTime to avoid huge dt jump
                this.lastTime = performance.now();
            };
            container.appendChild(div);
        });
        
        modal.classList.remove('hidden');
    }

    updateHUD() {
        const hpPercent = (this.player.hp / this.player.maxHp) * 100;
        document.getElementById('hp-bar').style.width = `${hpPercent}%`;
        document.getElementById('hp-text').innerText = `${Math.ceil(this.player.hp)}/${this.player.maxHp}`;
        
        const xpPercent = (this.player.xp / this.player.xpToNextLevel) * 100;
        document.getElementById('xp-bar').style.width = `${xpPercent}%`;
        document.getElementById('level-text').innerText = `Lvl ${this.player.level}`;
        
        document.getElementById('score-display').innerText = `Score: ${this.score}`;
        
        const minutes = Math.floor(this.timeSurvived / 60).toString().padStart(2, '0');
        const seconds = Math.floor(this.timeSurvived % 60).toString().padStart(2, '0');
        document.getElementById('timer-display').innerText = `${minutes}:${seconds}`;
        
        // Item UI
        const itemIcon = document.getElementById('item-icon');
        if (this.player.inventory) {
            itemIcon.innerText = this.player.inventory.type.toUpperCase();
        } else {
            itemIcon.innerText = '';
        }
    }

    gameOver() {
        this.isRunning = false;
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('final-score').innerText = this.score;
        document.getElementById('final-time').innerText = document.getElementById('timer-display').innerText;
        
        // Save Score to LocalStorage
        const newScore = {
            name: this.player.name,
            character: this.player.characterClass.name,
            score: this.score,
            level: this.player.level,
            time: Math.floor(this.timeSurvived)
        };

        let highscores = JSON.parse(localStorage.getItem('tdg_highscores')) || [];
        highscores.push(newScore);
        
        // Sort by score descending
        highscores.sort((a, b) => b.score - a.score);
        
        // Keep top 10
        highscores = highscores.slice(0, 10);
        
        localStorage.setItem('tdg_highscores', JSON.stringify(highscores));
        
        this.loadHighscores();
    }

    loadHighscores() {
        const highscores = JSON.parse(localStorage.getItem('tdg_highscores')) || [];
        const list = document.getElementById('highscore-list');
        list.innerHTML = '';
        
        highscores.forEach(entry => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${entry.name} (${entry.character})</span> <span>${entry.score}</span>`;
            list.appendChild(li);
        });
    }
}
