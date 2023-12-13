const isLeapYear = (year) => {
  return (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  );
};

const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

let calendar = document.querySelector(".calendar");
const month_names = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let reservedDates = [
  {
    date: new Date(2023, 4, 15), // Fecha reservada
    times: ["09:00 AM", "02:00 PM"], // Horarios reservados
  },
];

let month_picker = document.querySelector("#month-picker");
const dayTextFormate = document.querySelector(".day-text-formate");
const timeFormate = document.querySelector(".time-formate");
const dateFormate = document.querySelector(".date-formate");

month_picker.onclick = () => {
  month_list.classList.remove("hideonce");
  month_list.classList.remove("hide");
  month_list.classList.add("show");
  dayTextFormate.classList.remove("showtime");
  dayTextFormate.classList.add("hidetime");
  timeFormate.classList.remove("showtime");
  timeFormate.classList.add("hideTime");
  dateFormate.classList.remove("showtime");
  dateFormate.classList.add("hideTime");
};

const generateCalendar = (month, year) => {
  let calendar_days = document.querySelector(".calendar-days");
  calendar_days.innerHTML = "";
  let calendar_header_year = document.querySelector("#year");
  let days_of_month = [
    31,
    getFebDays(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  let currentDate = new Date();

  month_picker.innerHTML = month_names[month];

  calendar_header_year.innerHTML = year;

  let first_day = new Date(year, month);

  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
    let day = document.createElement("div");

    if (i >= first_day.getDay()) {
      day.innerHTML = i - first_day.getDay() + 1;

      const currentDay = new Date(year, month, day.innerHTML);

      if (reservedDates.some((date) => isSameDay(date.date, currentDay))) {
        day.classList.add("reserved-date");
      } else {
        day.classList.remove("reserved-date");
      }

      if (
        i - first_day.getDay() + 1 === currentDate.getDate() &&
        year === currentDate.getFullYear() &&
        month === currentDate.getMonth()
      ) {
        day.classList.add("current-date");
      }
      day.onclick = () => reserveDate(day, year, month);
    }
    calendar_days.appendChild(day);
  }
};

let month_list = calendar.querySelector(".month-list");
month_names.forEach((e, index) => {
  let month = document.createElement("div");
  month.innerHTML = `<div>${e}</div>`;

  month_list.append(month);
  month.onclick = () => {
    currentMonth.value = index;
    generateCalendar(currentMonth.value, currentYear.value);
    month_list.classList.replace("show", "hide");
    dayTextFormate.classList.remove("hideTime");
    dayTextFormate.classList.add("showtime");
    timeFormate.classList.remove("hideTime");
    timeFormate.classList.add("showtime");
    dateFormate.classList.remove("hideTime");
    dateFormate.classList.add("showtime");
  };
});

(function () {
  month_list.classList.add("hideonce");
})();
document.querySelector("#pre-year").onclick = () => {
  --currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};
document.querySelector("#next-year").onclick = () => {
  ++currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};

let currentDate = new Date();
let currentMonth = { value: currentDate.getMonth() };
let currentYear = { value: currentDate.getFullYear() };
generateCalendar(currentMonth.value, currentYear.value);

const todayShowTime = document.querySelector(".time-formate");
const todayShowDate = document.querySelector(".date-formate");

const currshowDate = new Date();
const showCurrentDateOption = {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
};

const currentDateFormate = new Intl.DateTimeFormat(
  "en-US",
  showCurrentDateOption
).format(currshowDate);
todayShowDate.textContent = currentDateFormate;

setInterval(() => {
  const timer = new Date();
  const option = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  const formateTimer = new Intl.DateTimeFormat("en-us", option).format(timer);
  let time = `${`${timer.getHours()}`.padStart(
    2,
    "0"
  )}:${`${timer.getMinutes()}`.padStart(
    2,
    "0"
  )}: ${`${timer.getSeconds()}`.padStart(2, "0")}`;
  todayShowTime.textContent = formateTimer;
}, 1000);

const reserveDate = (day, year, month) => {
  const selectedDate = new Date(year, month, day.innerHTML);
  openModal(selectedDate);
};

// Función para generar el formulario del modal
function generateModalForm() {
  return `
  <div class="max-w-md mx-auto p-4 bg-white rounded-md rounded-extra shadow-md">
      <label for="reservation-time" class="block text-sm font-medium text-gray-700">Select a time</label>
      <input type="text" id="reservation-time" class="mt-1 p-2 border rounded-md w-full" placeholder="09:00 am" required>
      
      <label for="user-name" class="block mt-4 text-sm font-medium text-gray-700">Name</label>
      <input type="text" id="user-name" class="mt-1 p-2 border rounded-md w-full" placeholder="Enter your name" required>

      <label for="user-email" class="block mt-4 text-sm font-medium text-gray-700">Email</label>
      <input type="email" id="user-email" class="mt-1 p-2 border rounded-md w-full" placeholder="Enter your email" required>
      
      <label for="otro-pag" class="block mt-4 text-sm font-medium text-gray-900">Choose another payment method</label>

      <!-- Información de la tarjeta de crédito -->
      <label for="credit-card" class="block mt-4 text-sm font-medium text-gray-700">Credit card number</label>
      <input type="text" id="credit-card" class="mt-1 p-2 border rounded-md w-full" placeholder="Enter your card number">

      <label for="expiration-date" class="block mt-4 text-sm font-medium text-gray-700">Due date</label>
      <input type="text" id="expiration-date" class="mt-1 p-2 border rounded-md w-full" placeholder="MM/YY">

      <label for="cvv" class="block mt-4 text-sm font-medium text-gray-700">CVV</label>
      <input type="text" id="cvv" class="mt-1 p-2 border rounded-md w-full" placeholder="CVV code">
     

      <div class="flex items-center justify-center">
      <button class="mt-4 px-4 py-2 text-white bg-green-500 rounded-full hover:bg-green-600" onclick="reserveFromModal()">Send</button>
    </div>
    </div>
  `;
}

function updateCalendar() {
  const currentMonthValue = currentMonth.value;
  const currentYearValue = currentYear.value;
  generateCalendar(currentMonthValue, currentYearValue);
}
// Función para abrir el modal
function openModal(selectedDate) {
  let modal = document.getElementById("modal");

  if (!modal) {
    // Si el modal no existe, crea uno nuevo
    modal = document.createElement("div");
    modal.id = "modal";
    modal.className = "modal";
    modal.innerHTML =
      '<div class="modal-content"><span class="close" onclick="closeModal()">&times;</span><h2>Select a date, whatever you want!</h2></div>';
    document.body.appendChild(modal);
  }

  modal.style.display = "block";

  // Usa la función generateModalForm para obtener el formulario
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = generateModalForm();

  modal.dataset.selectedDate = selectedDate;
}

function toggleAudio() {
  var audio = document.querySelector("audio");
  var audioControlButton = document.querySelector(".audio-control");

  if (audio.paused) {
    audio.play();
    // Cambia el contenido del botón cuando el audio está reproduciéndose
    audioControlButton.innerHTML = "🔕";
  } else {
    audio.pause();
    // Cambia el contenido del botón cuando el audio está pausado
    audioControlButton.innerHTML = "🔔";
  }
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}
// Función para reservar desde el modal
function reserveFromModal() {
  const selectedTimeInput = document.getElementById("reservation-time");
  const selectedTime = selectedTimeInput.value; // El valor ingresado por el usuario

  const nombre = document.getElementById("user-name").value;
  const correo = document.getElementById("user-email").value;
  const fecha = document.getElementById("reservation-time").value;
  const selectedDate = new Date(
    document.getElementById("modal").dataset.selectedDate
  );

  const selectedDateTime = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    parseInt(selectedTime.split(":")[0]),
    parseInt(selectedTime.split(":")[1])
  );

  const datosReserva = {
    nombre,
    correo,
    fecha,
    selectedTime: selectedDateTime.toISOString(), // Asegúrate de agregar el campo de tiempo seleccionado
  };

  enviarDatosAlServidor(datosReserva, selectedDate);
}

// Función para enviar datos al servidor
function enviarDatosAlServidor(datos, selectedDate) {
  fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Respuesta del servidor:", data);
      // Puedes realizar acciones adicionales según la respuesta del servidor
    })
    .catch((error) =>
      console.error("Error al enviar datos al servidor:", error)
    );
  closeModal(); // Cierra el modal al reservar
  updateCalendar(); // Actualiza el calendario
}

function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
