// js/app.js

class App {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('cq_tasks')) || [];
        this.currentTaskId = null;
        
        this.initNavigation();
        this.initTaskManager();
        this.renderTasks();
        this.updateDate();
    }

    initNavigation() {
        const links = document.querySelectorAll('.nav-links li');
        const screens = document.querySelectorAll('.screen');
        const themeToggle = document.querySelector('.theme-toggle');

        // Переключение экранов
        links.forEach(link => {
            link.addEventListener('click', () => {
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const screenId = link.getAttribute('data-screen');
                screens.forEach(s => s.classList.remove('active'));
                document.getElementById(screenId).classList.add('active');
            });
        });

        // Переключение темы
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        });
    }

    initTaskManager() {
        document.getElementById('add-task-btn').addEventListener('click', () => this.addTask());
    }

    addTask() {
        const titleInput = document.getElementById('new-task-title');
        const timeInput = document.getElementById('new-task-time');
        const durationInput = document.getElementById('new-task-duration');

        if (titleInput.value && timeInput.value) {
            const newTask = {
                id: Date.now(),
                title: titleInput.value,
                time: timeInput.value,
                duration: durationInput.value,
                completed: false
            };

            this.tasks.push(newTask);
            // Сортировка по времени
            this.tasks.sort((a, b) => a.time.localeCompare(b.time));
            
            this.saveTasks();
            this.renderTasks();
            
            titleInput.value = '';
        }
    }

    renderTasks() {
        const list = document.getElementById('task-list');
        list.innerHTML = '';

        this.tasks.forEach(task => {
            if (task.completed) return; // Не показываем выполненные в списке активных

            const div = document.createElement('div');
            div.className = 'card task-item';
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <b>${task.time}</b> (${task.duration} мин)
                        <div>${task.title}</div>
                    </div>
                    <button class="start-btn">Начать</button>
                </div>
            `;

            div.querySelector('.start-btn').addEventListener('click', () => {
                this.currentTaskId = task.id;
                window.timer.openModal(task.title);
            });

            list.appendChild(div);
        });
    }

    completeCurrentTask() {
        if (this.currentTaskId) {
            const taskIndex = this.tasks.findIndex(t => t.id === this.currentTaskId);
            if (taskIndex !== -1) {
                this.tasks[taskIndex].completed = true;
                this.saveTasks();
                this.renderTasks();
                
                // Начисление XP через GameSystem
                window.game.addXP(20); // 20 XP за задачу
                
                alert('Задача выполнена! +20 XP');
            }
        }
    }

    saveTasks() {
        localStorage.setItem('cq_tasks', JSON.stringify(this.tasks));
    }

    updateDate() {
        // Можно добавить отображение текущей даты в хедер
    }
}

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
