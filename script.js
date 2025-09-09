let timerInterval;
let isRunning = false;
let initialTime = { hours: 0, minutes: 0, seconds: 0 };
let currentTime = { hours: 0, minutes: 0, seconds: 0 };
let previousTime = { hours: 0, minutes: 0, seconds: 0 };

let timerSound = new Audio('sounds/time_sound.mp3');
timerSound.loop = true;

const digits = {
    h1: document.getElementById('h1'),
    h2: document.getElementById('h2'),
    m1: document.getElementById('m1'),
    m2: document.getElementById('m2'),
    s1: document.getElementById('s1'),
    s2: document.getElementById('s2')
};
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

// Новые элементы для ввода времени
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');


function updateDisplay(time) {
    // Обновить часы
    const hh = time.hours.toString().padStart(2, '0');
    digits.h1.textContent = hh[0];
    digits.h2.textContent = hh[1];

    // Обновить минуты
    const mm = time.minutes.toString().padStart(2, '0');
    digits.m1.textContent = mm[0];
    digits.m2.textContent = mm[1];

    // Обновить секунды
    const ss = time.seconds.toString().padStart(2, '0');
    digits.s1.textContent = ss[0];
    digits.s2.textContent = ss[1];

    // Здесь позже добавить glitch анимацию для изменённых цифр

    // Сохранить предыдущие значения для сравнения
    const prevTime = { ...previousTime };
    previousTime = { ...time };

    // Проверить изменения и применить glitch
    if (prevTime.hours !== time.hours) {
        const hh = time.hours.toString().padStart(2, '0');
        if (prevTime.hours.toString().padStart(2, '0')[0] !== hh[0]) glitchDigit(digits.h1);
        if (prevTime.hours.toString().padStart(2, '0')[1] !== hh[1]) glitchDigit(digits.h2);
    }
    if (prevTime.minutes !== time.minutes) {
        const mm = time.minutes.toString().padStart(2, '0');
        if (prevTime.minutes.toString().padStart(2, '0')[0] !== mm[0]) glitchDigit(digits.m1);
        if (prevTime.minutes.toString().padStart(2, '0')[1] !== mm[1]) glitchDigit(digits.m2);
    }
    if (prevTime.seconds !== time.seconds) {
        const ss = time.seconds.toString().padStart(2, '0');
        if (prevTime.seconds.toString().padStart(2, '0')[0] !== ss[0]) glitchDigit(digits.s1);
        if (prevTime.seconds.toString().padStart(2, '0')[1] !== ss[1]) glitchDigit(digits.s2);
    }
}

function tick() {
    if (currentTime.seconds > 0) {
        currentTime.seconds--;
    } else if (currentTime.minutes > 0) {
        currentTime.minutes--;
        currentTime.seconds = 59;
    } else if (currentTime.hours > 0) {
        currentTime.hours--;
        currentTime.minutes = 59;
        currentTime.seconds = 59;
    } else {
        stopTimer();
        return;
    }
    updateDisplay(currentTime);
}

function startTimer() {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    if (hours > 99 || minutes > 59 || seconds > 59 || hours < 0 || minutes < 0 || seconds < 0) {
        alert('Неверные значения: HH 0-99, MM/SS 0-59');
        return;
    }
    initialTime = { hours, minutes, seconds };
    currentTime = { ...initialTime };
    updateDisplay(currentTime);
    if (!isRunning) {
        timerInterval = setInterval(tick, 1000);
        isRunning = true;
        timerSound.play();
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        timerSound.pause();
        timerSound.currentTime = 0;
    }
}

function restartTimer() {
    pauseTimer();
    startTimer();
}

function stopTimer() {
    pauseTimer();
    updateDisplay({ hours: 0, minutes: 0, seconds: 0 });
    // Воспроизвести звук окончания таймера
    new Audio('sounds/time_end.mp3').play();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
restartBtn.addEventListener('click', restartTimer);

function glitchDigit(digitElement) {
    gsap.killTweensOf(digitElement); // Остановить предыдущие анимации

    const tl = gsap.timeline({ defaults: { duration: 0.05 } });

    // Искажение и мерцание
    tl.to(digitElement, { skewX: 10, scale: 1.1, rotation: 2, opacity: 0.3 })
      .to(digitElement, { skewX: -5, scale: 0.9, rotation: -1, opacity: 0.7, duration: 0.1 })
      .to(digitElement, { skewX: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.05 })
      // Цветовые сдвиги
      .to(digitElement, { filter: "hue-rotate(180deg) brightness(1.5)", duration: 0.03 }, "-=0.05")
      .to(digitElement, { filter: "hue-rotate(0deg) brightness(1)", duration: 0.03 }, "-=0.03")
      // Дополнительное искажение
      .to(digitElement, { x: -2, y: 1, duration: 0.02 }, "-=0.06")
      .to(digitElement, { x: 0, y: 0, duration: 0.02 }, "-=0.02");
}

// Инициализация дисплея
updateDisplay({ hours: 0, minutes: 0, seconds: 0 });