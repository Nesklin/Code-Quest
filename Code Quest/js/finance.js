// js/finance.js

class FinanceManager {
    constructor() {
        this.income = 43000; // Твоя зарплата
        this.data = JSON.parse(localStorage.getItem('cq_finance')) || {
            expenses: [],
            savings: 2600 // Текущие сбережения
        };
        
        this.initListeners();
        this.updateUI();
    }

    initListeners() {
        document.getElementById('add-exp-btn').addEventListener('click', () => this.addExpense());
    }

    addExpense() {
        const catInput = document.getElementById('exp-cat');
        const sumInput = document.getElementById('exp-sum');
        
        const category = catInput.value.trim();
        const amount = parseInt(sumInput.value);

        if (category && amount) {
            this.data.expenses.push({
                id: Date.now(),
                category: category,
                amount: amount,
                date: new Date().toLocaleDateString()
            });
            
            catInput.value = '';
            sumInput.value = '';
            
            this.save();
            this.updateUI();
        } else {
            alert('Введите категорию и сумму!');
        }
    }

    calculateTotalExpenses() {
        return this.data.expenses.reduce((sum, item) => sum + item.amount, 0);
    }

    getTopCategory() {
        const counts = {};
        this.data.expenses.forEach(exp => {
            counts[exp.category] = (counts[exp.category] || 0) + exp.amount;
        });
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'Нет данных');
    }

    generateAdvice() {
        const totalExp = this.calculateTotalExpenses();
        const topCat = this.getTopCategory();
        
        if (totalExp === 0) return "Начни записывать расходы, чтобы видеть картину.";
        if (totalExp > this.income * 0.8) return "⚠️ Внимание! Ты тратишь более 80% дохода. Пора затянуть пояса.";
        if (topCat === 'Еда' || topCat === 'Такси') return `Попробуй сократить траты в категории "${topCat}". Готовка дома сэкономит до 30%.`;
        
        return `Твоя топ-категория: ${topCat}. Проанализируй, можно ли это оптимизировать.`;
    }

    save() {
        localStorage.setItem('cq_finance', JSON.stringify(this.data));
    }

    updateUI() {
        const totalExp = this.calculateTotalExpenses();
        const balance = this.income - totalExp;

        document.getElementById('fin-income').textContent = `${this.income.toLocaleString()} ₽`;
        document.getElementById('fin-expense').textContent = `${totalExp.toLocaleString()} ₽`;
        document.getElementById('fin-balance').textContent = `${balance.toLocaleString()} ₽`;
        document.getElementById('saving-advice').textContent = this.generateAdvice();

        // Список расходов
        const list = document.getElementById('expense-list');
        list.innerHTML = '';
        // Показываем последние 5 расходов
        this.data.expenses.slice(-5).reverse().forEach(exp => {
            const div = document.createElement('div');
            div.className = 'card';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.innerHTML = `<span>${exp.category} (${exp.date})</span> <b>- ${exp.amount} ₽</b>`;
            list.appendChild(div);
        });
    }
}

window.finance = new FinanceManager();
