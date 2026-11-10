// js/plan.js

class PlanManager {
    constructor() {
        this.currentMonth = '01';
        this.planData = [];
        
        // Слушатель изменения месяца
        document.getElementById('month-selector').addEventListener('change', (e) => {
            this.currentMonth = e.target.value;
            this.loadPlan();
        });

        this.loadPlan();
    }

    async loadPlan() {
        const container = document.getElementById('plan-container');
        container.innerHTML = '<p>Загрузка плана...</p>';

        try {
            // Загружаем файл data/month-XX.json
            const response = await fetch(`data/month-${this.currentMonth}.json`);
            if (!response.ok) throw new Error('Файл не найден');
            
            this.planData = await response.json();
            this.renderPlan();
        } catch (error) {
            container.innerHTML = `<p style="color:red">Ошибка загрузки: ${error.message}. Убедитесь, что файл data/month-${this.currentMonth}.json существует.</p>`;
        }
    }

    renderPlan() {
        const container = document.getElementById('plan-container');
        container.innerHTML = '';

        const today = new Date().getDate(); // Просто для примера подсветки

        this.planData.forEach(day => {
            const card = document.createElement('div');
            card.className = 'card plan-day';
            
            // Подсветка, если номер дня совпадает с текущим (упрощенно)
            if (day.day === today && this.currentMonth === new Date().getMonth() + 1) {
                card.style.border = '2px solid var(--secondary)';
            }

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <b>День ${day.day}</b>
                    <small>${day.date || ''}</small>
                </div>
                <div class="task-details">
                    <p><b>Тема:</b> ${day.topic}</p>
                    <p><b>Задание:</b> ${day.task}</p>
                    <p><b>English:</b> ${day.english}</p>
                </div>
                <button onclick="alert('Отметить как выполненное? (В разработке)')" style="margin-top:10px; width:100%">✅ Выполнено</button>
            `;
            container.appendChild(card);
        });
    }
}

window.plan = new PlanManager();
