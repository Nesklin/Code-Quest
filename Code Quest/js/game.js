// js/game.js

class GameSystem {
    constructor() {
        // Загрузка данных или инициализация по умолчанию
        this.data = JSON.parse(localStorage.getItem('cq_game')) || {
            xp: 0,
            level: 1,
            streak: 0,
            lastLogin: null,
            badges: [],
            tasksCompleted: 0
        };
        
        this.levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500]; // XP для уровней 1-10
        this.badgeList = [
            { id: 'first_blood', name: 'Первая кровь', desc: 'Выполни первую задачу', icon: '🩸' },
            { id: 'streak_7', name: 'Неделя силы', desc: 'Стрик 7 дней', icon: '🔥' },
            { id: 'coder_10', name: 'Кодер', desc: '10 выполненных задач', icon: '💻' }
        ];

        this.checkStreak();
        this.updateUI();
    }

    addXP(amount) {
        this.data.xp += amount;
        this.data.tasksCompleted++;
        this.checkLevelUp();
        this.checkBadges();
        this.save();
        this.updateUI();
    }

    checkLevelUp() {
        const nextLevelXP = this.levels[this.data.level] || (this.levels[this.levels.length - 1] + (this.data.level - 9) * 1000);
        if (this.data.xp >= nextLevelXP) {
            this.data.level++;
            alert(`🎉 Уровень повышен! Теперь ты ${this.data.level} уровня!`);
        }
    }

    checkStreak() {
        const today = new Date().toDateString();
        if (this.data.lastLogin !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (this.data.lastLogin === yesterday.toDateString()) {
                this.data.streak++;
            } else if (this.data.lastLogin !== today) {
                // Если пропустил больше одного дня (или это первый вход)
                if (this.data.lastLogin && this.data.lastLogin !== today) {
                     this.data.streak = 0; // Сброс стрика
                } else if (!this.data.lastLogin) {
                    this.data.streak = 1; // Первый день
                }
            }
            this.data.lastLogin = today;
            this.save();
        }
    }

    checkBadges() {
        const addBadge = (id) => {
            if (!this.data.badges.includes(id)) {
                this.data.badges.push(id);
                const badge = this.badgeList.find(b => b.id === id);
                alert(`🏆 Достижение открыто: ${badge.name}`);
            }
        };

        if (this.data.tasksCompleted >= 1) addBadge('first_blood');
        if (this.data.tasksCompleted >= 10) addBadge('coder_10');
        if (this.data.streak >= 7) addBadge('streak_7');
    }

    save() {
        localStorage.setItem('cq_game', JSON.stringify(this.data));
    }

    updateUI() {
        // Обновление главной страницы
        document.getElementById('dash-level').textContent = this.data.level;
        document.getElementById('dash-xp').textContent = this.data.xp;
        document.getElementById('dash-streak').textContent = this.data.streak;

        // Обновление экрана игры
        document.getElementById('game-level').textContent = this.data.level;
        document.getElementById('game-current-xp').textContent = this.data.xp;
        document.getElementById('game-streak').textContent = this.data.streak;

        // Расчет прогресс-бара
        const prevLevelXP = this.levels[this.data.level - 1] || 0;
        const nextLevelXP = this.levels[this.data.level] || (prevLevelXP + 1000);
        const progress = ((this.data.xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;
        
        document.getElementById('game-next-xp').textContent = nextLevelXP;
        document.getElementById('xp-bar-fill').style.width = `${Math.min(progress, 100)}%`;

        // Отрисовка бейджей
        const badgesContainer = document.getElementById('badges-container');
        badgesContainer.innerHTML = '';
        this.badgeList.forEach(badge => {
            const isUnlocked = this.data.badges.includes(badge.id);
            const div = document.createElement('div');
            div.className = 'badge';
            div.style.opacity = isUnlocked ? '1' : '0.3';
            div.innerHTML = `<div style="font-size: 2rem">${badge.icon}</div><div>${badge.name}</div>`;
            badgesContainer.appendChild(div);
        });
    }
}

// Инициализация
window.game = new GameSystem();
