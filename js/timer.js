// js/timer.js

class FocusTimer {
    constructor() {
        this.timeLeft = 50 * 60; // 50 минут в секундах по умолчанию
        this.initialTime = 50 * 60;
        this.intervalId = null;
        this.isRunning = false;
        this.mode = 'work'; // 'work' или 'break'
        
        // Элементы DOM
        this.display = document.getElementById('timer-display');
        this.startBtn = document.getElementById('start-timer');
        this.pauseBtn = document.getElementById('pause-timer');
        this.stopBtn = document.getElementById('stop-timer');
        this.completeBtn = document.getElementById('complete-task-btn');
        
        this.initListeners();
    }

    initListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.completeBtn.addEventListener('click', () => this.completeTask());
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.intervalId = setInterval(() => {
                this.tick();
            }, 1000);
        }
    }

    pause() {
        clearInterval(this.intervalId);
        this.isRunning = false;
    }

    stop() {
        this.pause();
        this.reset();
        document.getElementById('timer-modal').classList.add('hidden');
    }

    reset() {
        this.timeLeft = this.initialTime;
        this.updateDisplay();
        this.completeBtn.classList.add('hidden');
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.finish();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    finish() {
        this.pause();
        this.playSound();
        
        if (this.mode === 'work') {
            alert('Время вышло! Сделай перерыв на 10 минут.');
            this.mode = 'break';
            this.timeLeft = 10 * 60;
            this.initialTime = 10 * 60;
        } else {
            alert('Перерыв окончен! Пора за работу.');
            this.mode = 'work';
            this.timeLeft = 50 * 60;
            this.initialTime = 50 * 60;
            // Показываем кнопку завершения задачи только после рабочего цикла
            this.completeBtn.classList.remove('hidden');
        }
        this.updateDisplay();
    }

    completeTask() {
        // Вызываем функцию из app.js для начисления XP
        if (window.app && window.app.completeCurrentTask) {
            window.app.completeCurrentTask();
        }
        this.stop();
    }

    playSound() {
        // Простой звук "бип" через AudioContext или можно подключить mp3
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    }

    openModal(taskName) {
        document.getElementById('timer-task-name').textContent = taskName;
        document.getElementById('timer-modal').classList.remove('hidden');
        this.reset();
    }
}

// Экспортируем экземпляр, чтобы он был доступен в app.js
window.timer = new FocusTimer();
