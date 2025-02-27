import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datePicker = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let countdownInterval = null;

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

startBtn.addEventListener("click", () => {
    if (!userSelectedDate) return;

    const now = new Date();
    const timeDifference = userSelectedDate - now;

    if (timeDifference <= 0) {
        iziToast.error({
            title: "Error",
            message: "Selected time must be in the future!",
            position: "topRight",
        });
        return;
    }

    startBtn.disabled = true;
    datePicker.disabled = true; 

    updateTimer(timeDifference);
    countdownInterval = setInterval(() => {
        const timeLeft = userSelectedDate - new Date();
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            iziToast.success({
                title: "Done!",
                message: "Timer has ended!",
                position: "topRight",
            });

            startBtn.disabled = true; 
            datePicker.disabled = false; 
            return;
        }
        updateTimer(timeLeft);
    }, 1000);
});

function updateTimer(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);
    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor((ms % hour) / minute);
    const seconds = Math.floor((ms % minute) / second);

    return { days, hours, minutes, seconds };
}
