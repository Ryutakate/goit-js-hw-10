import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Отримуємо елементи з DOM
const datePicker = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let countdownInterval = null;

// Налаштування Flatpickr
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedTime = selectedDates[0];
        if (selectedTime <= new Date()) {
            iziToast.error({
                title: "Error",
                message: "Please choose a date in the future",
                position: "topRight",
            });
            startBtn.disabled = true;
        } else {
            userSelectedDate = selectedTime;
            startBtn.disabled = false;
        }
    },
};

flatpickr(datePicker, options);

// Функція оновлення таймера
function updateTimer() {
    const timeLeft = userSelectedDate - new Date();
    if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        iziToast.success({
            title: "Time's up!",
            message: "The countdown has finished.",
            position: "topRight",
        });
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
}

// Обробник натискання кнопки "Start"
startBtn.addEventListener("click", () => {
    if (!userSelectedDate) return;

    startBtn.disabled = true;
    datePicker.disabled = true;

    iziToast.success({
        title: "Success",
        message: "Countdown started!",
        position: "topRight",
    });

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
});
