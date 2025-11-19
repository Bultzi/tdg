import { Entity } from './Entity.js';
import { Projectile } from './Projectile.js';
import { Trap } from './Trap.js';
import { AreaEffect } from './AreaEffect.js';
import { Utils } from '../utils.js';

export class Player extends Entity {
    constructor(x, y, characterClass) {
        super(x, y, 20, '#2ed573');
        this.characterClass = characterClass;
        
        // Stats
        this.maxHp = characterClass.stats.hp;
        this.hp = this.maxHp;
        this.speed = characterClass.stats.speed;
        
        // Leveling
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        
        // Combat
        this.autoAttackTimer = 0;
        this.autoAttackCooldown = characterClass.stats.attackSpeed;
        
        this.skillCooldowns = {
            q: 0,
            e: 0,
            r: 0
        };
        
        this.damageMultiplier = 1;
        this.inventory = null; // Holds one item
        
        // Invulnerability
        this.invulnerabilityTimer = 0;
        this.invulnerabilityDuration = 0.5; // 0.5 seconds of i-frames
    }

    update(dt, input, game) {
        // Movement
        let dx = 0;
        let dy = 0;
        
        if (input.isDown('up')) dy -= 1;
        if (input.isDown('down')) dy += 1;
        if (input.isDown('left')) dx -= 1;
        if (input.isDown('right')) dx += 1;
        
        // Normalize diagonal movement
        if (dx !== 0 || dy !== 0) {
            const length = Math.sqrt(dx*dx + dy*dy);
            dx /= length;
            dy /= length;
            
            this.x += dx * this.speed * dt;
            this.y += dy * this.speed * dt;
            
            // Keep in bounds
            this.x = Utils.clamp(this.x, this.radius, game.renderer.canvas.width - this.radius);
            this.y = Utils.clamp(this.y, this.radius, game.renderer.canvas.height - this.radius);
        }

        // Auto Attack
        this.autoAttackTimer -= dt;
        if (this.autoAttackTimer <= 0) {
            this.performAutoAttack(game);
            this.autoAttackTimer = this.autoAttackCooldown;
        }

        // Active Skills
        ['q', 'e', 'r'].forEach(key => {
            if (this.skillCooldowns[key] > 0) {
                this.skillCooldowns[key] -= dt;
            }
            
            if (input.isDown(`skill_${key}`) && this.skillCooldowns[key] <= 0) {
                if (this.characterClass.skills[key]) {
                    this.useSkill(key, game, input);
                    this.skillCooldowns[key] = this.characterClass.skills[key].cooldown;
                }
            }
        });
        
        // Use Item (F)
        if (input.isDown('use_item') && this.inventory) {
            this.inventory.use(this, game);
            this.inventory = null;
        }
        
        // Update UI for cooldowns
        this.updateSkillUI();

        // Update Invulnerability
        if (this.invulnerabilityTimer > 0) {
            this.invulnerabilityTimer -= dt;
        }
    }

    performAutoAttack(game) {
        const config = this.characterClass.autoAttack;
        
        // Find nearest enemy
        let nearest = null;
        let minDist = Infinity;
        
        game.enemies.forEach(enemy => {
            const dist = Utils.distance(this.x, this.y, enemy.x, enemy.y);
            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        });

        if (nearest && minDist < config.range) {
            const angle = Math.atan2(nearest.y - this.y, nearest.x - this.x);
            
            if (config.type === 'projectile') {
                const dx = Math.cos(angle);
                const dy = Math.sin(angle);
                const proj = new Projectile(this.x, this.y, dx, dy, config.damage * this.damageMultiplier);
                proj.speed = config.speed;
                proj.color = config.color;
                proj.radius = config.radius;
                game.projectiles.push(proj);
            } else if (config.type === 'melee') {
                // Instant damage in arc
                game.addEffect('slash', this.x, this.y, { 
                    angle: angle, 
                    arc: config.arc, 
                    radius: config.range, 
                    color: '#fff',
                    duration: 0.2
                });
                
                game.enemies.forEach(enemy => {
                    const d = Utils.distance(this.x, this.y, enemy.x, enemy.y);
                    if (d <= config.range) {
                        // Check angle
                        const enemyAngle = Math.atan2(enemy.y - this.y, enemy.x - this.x);
                        let diff = enemyAngle - angle;
                        // Normalize angle diff
                        while (diff < -Math.PI) diff += Math.PI * 2;
                        while (diff > Math.PI) diff -= Math.PI * 2;
                        
                        if (Math.abs(diff) < config.arc / 2) {
                            enemy.takeDamage(config.damage * this.damageMultiplier, game);
                        }
                    }
                });
            }
        }
    }

    useSkill(key, game, input) {
        const skill = this.characterClass.skills[key];
        const angle = Math.atan2(input.mouse.y - this.y, input.mouse.x - this.x);
        
        if (skill.type === 'projectile') {
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            const proj = new Projectile(this.x, this.y, dx, dy, skill.damage * this.damageMultiplier);
            proj.speed = skill.speed;
            proj.color = skill.color;
            proj.radius = skill.radius;
            if (skill.pierce) proj.pierce = skill.pierce;
            game.projectiles.push(proj);
            
        } else if (skill.type === 'dash') {
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            this.x += dx * skill.distance; 
            this.y += dy * skill.distance;
            
            game.addEffect('dash', this.x, this.y, {
                dx: dx,
                dy: dy,
                color: 'rgba(255, 255, 255, 0.5)',
                duration: 0.3
            });
            
        } else if (skill.type === 'aoe_self') {
            // Whirlwind visual
            game.addEffect('whirlwind', this.x, this.y, { 
                radius: skill.radius, 
                color: '#ffdd59', 
                duration: skill.duration 
            });
            
            // Logic for DoT is handled by the effect or we need a persistent entity. 
            // For simplicity, let's make it an AreaEffect attached to player? 
            // Or just instant damage for now if it's a single hit, but the description says "spin".
            // Let's use AreaEffect with 'dot' type centered on player.
            // But AreaEffect is static. We might need to attach it. 
            // For now, let's just do instant damage for the "cast" and maybe repeat it?
            // Actually, let's spawn a persistent AreaEffect that follows player? 
            // The current AreaEffect doesn't follow. 
            // Let's stick to the previous implementation of instant hit + visual, 
            // OR change it to a multi-hit logic. 
            // Given the codebase, let's make it a static AoE for now or just instant.
            // Re-reading characters.js: "damage: 10, // per tick", "duration: 3".
            // So it should be a DoT.
            // Let's spawn an AreaEffect that is static for now (limit of current system) or make it follow.
            // I'll make it static at cast location for simplicity, or just instant damage around player.
            // Let's go with: Instant damage around player (burst) for this iteration to match the "Visuals TODO" block I'm replacing.
            // Wait, I can use the AreaEffect 'dot' type I created.
            
            const ae = new AreaEffect(this.x, this.y, 'dot', {
                radius: skill.radius,
                damage: skill.damage,
                duration: skill.duration,
                color: 'rgba(255, 221, 89, 0.3)',
                owner: this
            });
            game.areaEffects.push(ae);

        } else if (skill.type === 'melee_arc') {
            // Warrior Q
            game.addEffect('slash', this.x, this.y, { 
                angle: angle, 
                arc: skill.arc, 
                radius: skill.range, 
                color: '#ff4757',
                duration: 0.2
            });
            
            game.enemies.forEach(enemy => {
                const d = Utils.distance(this.x, this.y, enemy.x, enemy.y);
                if (d <= skill.range) {
                    const enemyAngle = Math.atan2(enemy.y - this.y, enemy.x - this.x);
                    let diff = enemyAngle - angle;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    
                    if (Math.abs(diff) < skill.arc / 2) {
                        enemy.takeDamage(skill.damage * this.damageMultiplier, game);
                    }
                }
            });

        } else if (skill.type === 'aoe') {
            // Mage E (Ice Nova)
            game.addEffect('nova', this.x, this.y, { 
                radius: skill.radius, 
                color: '#74b9ff', 
                duration: 0.5 
            });
            
            game.enemies.forEach(enemy => {
                if (Utils.distance(this.x, this.y, enemy.x, enemy.y) <= skill.radius) {
                    enemy.takeDamage(skill.damage * this.damageMultiplier, game);
                    // Apply freeze/slow if we had status effects (TODO)
                    enemy.speed *= 0.5; // Simple slow hack
                    setTimeout(() => { if(!enemy.isDead) enemy.speed *= 2; }, skill.duration * 1000);
                }
            });

        } else if (skill.type === 'aoe_cursor') {
            // Mage R (Meteor)
            const targetX = input.mouse.x;
            const targetY = input.mouse.y;
            
            const ae = new AreaEffect(targetX, targetY, 'delayed_burst', {
                radius: skill.radius,
                damage: skill.damage,
                delay: skill.delay,
                color: '#ff7675',
                owner: this
            });
            game.areaEffects.push(ae);

        } else if (skill.type === 'place') {
            // Archer E (Trap)
            const trap = new Trap(this.x, this.y, skill.damage, skill.radius, skill.triggerRadius, this);
            game.traps.push(trap);

        } else if (skill.type === 'aoe_cursor_dot') {
            // Archer R (Rain of Arrows)
            const targetX = input.mouse.x;
            const targetY = input.mouse.y;
            
            const ae = new AreaEffect(targetX, targetY, 'dot', {
                radius: skill.radius,
                damage: skill.damage,
                duration: skill.duration,
                color: 'rgba(85, 239, 196, 0.3)',
                subType: 'rain',
                owner: this
            });
            game.areaEffects.push(ae);
        }
    }

    takeDamage(amount) {
        if (this.invulnerabilityTimer > 0) return;
        
        this.hp -= amount;
        this.invulnerabilityTimer = this.invulnerabilityDuration;
    }

    gainXp(amount, game) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp(game);
        }
    }

    levelUp(game) {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.2);
        this.maxHp += 10;
        this.hp = this.maxHp;
        
        if (game) {
            game.triggerLevelUp();
        }
    }
    
    updateSkillUI() {
        ['q', 'e', 'r'].forEach(key => {
            if (this.characterClass.skills[key]) {
                const maxCd = this.characterClass.skills[key].cooldown;
                const currentCd = this.skillCooldowns[key];
                const pct = Math.max(0, currentCd / maxCd) * 100;
                
                const overlay = document.querySelector(`#skill-${key} .cooldown-overlay`);
                if (overlay) overlay.style.height = `${pct}%`;
            }
        });
    }

    draw(renderer) {
        if (this.invulnerabilityTimer > 0) {
            // Flash effect
            if (Math.floor(Date.now() / 100) % 2 === 0) {
                renderer.ctx.globalAlpha = 0.5;
            }
        }
        
        super.draw(renderer);
        
        renderer.ctx.globalAlpha = 1.0;
    }
}
