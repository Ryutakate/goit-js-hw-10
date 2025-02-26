import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Отримуємо форму з DOM
const form = document.querySelector(".form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Отримуємо значення з форми
    const delay = parseInt(form.elements.delay.value);
    const state = form.elements.state.value;

    // Функція для створення промісу
    const createPromise = (delay, state) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (state === "fulfilled") {
                    resolve(delay);
                } else {
                    reject(delay);
                }
            }, delay);
        });
    };

    // Викликаємо проміс і обробляємо результат
    createPromise(delay, state)
        .then((delay) => {
            iziToast.success({
                title: "✅ Success",
                message: `Fulfilled promise in ${delay}ms`,
                position: "topRight",
            });
        })
        .catch((delay) => {
            iziToast.error({
                title: "❌ Error",
                message: `Rejected promise in ${delay}ms`,
                position: "topRight",
            });
        });

    // Очищаємо форму після сабміту
    form.reset();
});
