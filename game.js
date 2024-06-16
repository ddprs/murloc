const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    color: 'blue',
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5,
    level: 1,
    experience: 0,
    inventory: [],
};

const enemies = [
    { id: 1, x: 100, y: 100, width: 50, height: 50, color: 'red', health: 50, maxHealth: 50, attack: 5, defense: 2 },
    { id: 2, x: 700, y: 100, width: 50, height: 50, color: 'red', health: 70, maxHealth: 70, attack: 7, defense: 3 },
    { id: 3, x: 400, y: 500, width: 50, height: 50, color: 'red', health: 100, maxHealth: 100, attack: 10, defense: 4 }
];

const quests = [
    { id: 1, description: "Defeat all enemies", completed: false },
];

const items = [
    { id: 1, name: "Health Potion", effect: "heal", amount: 20 },
    { id: 2, name: "Sword", effect: "attack", amount: 5 },
];

function drawCharacter(character) {
    ctx.fillStyle = character.color;
    ctx.fillRect(character.x, character.y, character.width, character.height);
}

function updateUI() {
    document.getElementById('playerHealth').textContent = `Health: ${player.health}`;
    document.getElementById('playerLevel').textContent = `Level: ${player.level}`;
    document.getElementById('enemyHealth').textContent = `Enemy Health: ${currentEnemy ? currentEnemy.health : 'None'}`;
    document.getElementById('quests').textContent = `Quests: ${quests.map(q => q.description + (q.completed ? ' (completed)' : '')).join(', ')}`;
}

function attack() {
    if (currentEnemy) {
        currentEnemy.health -= player.attack - currentEnemy.defense;
        if (currentEnemy.health <= 0) {
            currentEnemy.health = 0;
            player.experience += 20;
            checkLevelUp();
            if (enemies.length > 1) {
                enemies.splice(enemies.indexOf(currentEnemy), 1);
                currentEnemy = enemies[0];
            } else {
                quests[0].completed = true;
                currentEnemy = null;
                alert('You defeated all enemies and completed the quest!');
            }
        } else {
            player.health -= currentEnemy.attack - player.defense;
            if (player.health <= 0) {
                player.health = 0;
                alert('You were defeated by the enemy.');
                resetGame();
            }
        }
        updateUI();
        draw();
    }
}

function checkLevelUp() {
    if (player.experience >= player.level * 100) {
        player.level++;
        player.maxHealth += 20;
        player.health = player.maxHealth;
        player.attack += 5;
        player.defense += 2;
        player.experience = 0;
    }
}

function resetGame() {
    player.health = player.maxHealth;
    player.level = 1;
    player.attack = 10;
    player.defense = 5;
    player.experience = 0;
    quests[0].completed = false;
    currentEnemy = enemies[0];
    enemies.forEach(enemy => {
        enemy.health = enemy.maxHealth;
    });
    updateUI();
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCharacter(player);
    enemies.forEach(enemy => drawCharacter(enemy));
}

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    draw();
});

let currentEnemy = enemies[0];
updateUI();
draw();
