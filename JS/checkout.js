document.addEventListener("DOMContentLoaded", function () {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const confirmOrderBtn = document.getElementById("confirmOrderBtn");
  const orderMessage = document.getElementById("orderMessage");
  const paymentMethod = document.getElementById("paymentMethod");
  const cardDetails = document.getElementById("cardDetails");
  const cardNumberInput = document.getElementById("cardNumber");
  const cardLogo = document.getElementById("cardLogo");
  /* ========================= */
/* TOGGLE MODO OSCURO */
/* ========================= */

const toggleBtn = document.getElementById("themeToggle");
console.log(toggleBtn);

// Detectar preferencia guardada
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  toggleBtn.textContent = "🌞 ";
} else if (!savedTheme) {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "🌞 ";
  }
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "🌞 ";
  } else {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌙 ";
  }
});

  let total = 0;

  cart.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${item.name} x${item.quantity}</p>
      <p>$${(item.price * item.quantity).toFixed(2)}</p>
    `;
    checkoutItems.appendChild(div);
    total += item.price * item.quantity;
  });

  checkoutTotal.textContent = total.toFixed(2);

  paymentMethod.addEventListener("change", function () {
    if (this.value === "card") {
      cardDetails.style.display = "block";
    } else {
      cardDetails.style.display = "none";
    }
  });

  confirmOrderBtn.addEventListener("click", function () {

    const name = document.getElementById("customerName").value.trim();
    const address = document.getElementById("address").value.trim();
    const payment = paymentMethod.value;

    if (!name || !address || !payment) {
      return;
    }

    if (payment === "card") {

      const cardNumber = document.getElementById("cardNumber").value.replace(/\s+/g, "");
      const expiry = document.getElementById("cardExpiry").value.trim();
      const cvv = document.getElementById("cardCVV").value.trim();

      if (!validateCardNumber(cardNumber)) {
        
        return;
      }

      const type = getCardType(cardNumber);
      if (type === "Desconocida") {
       
        return;
      }

      if (!validateExpiry(expiry)) {
      
        return;
      }

      if (!validateCVV(cardNumber, cvv)) {
        
        return;
      }
    }

    const deliveryTime = Math.floor(Math.random() * 26) + 20;

    orderMessage.innerHTML = `
      <h2>¡Pedido confirmado, ${name}! 🎉</h2>
      <p>Tu orden llegará en aproximadamente <strong>${deliveryTime} minutos</strong>.</p>
    `;

    localStorage.removeItem("cart");
  });

cardNumberInput.addEventListener("input", function () {

  let value = this.value;

  //  Eliminar todo lo que no sea número
  value = value.replace(/\D/g, "");

  //  Detectar tipo de tarjeta
  const type = getCardType(value);

  //  Formatear según tipo
  if (type === "American Express") {
    // Formato 4-6-5
    value = value.replace(/(\d{4})(\d{6})(\d{0,5})/, function(_, g1, g2, g3) {
      return g1 + " " + g2 + (g3 ? " " + g3 : "");
    });
  } else {
    // Formato normal 4-4-4-4
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  this.value = value.trim();

  const cleanNumber = value.replace(/\s+/g, "");

  // Mostrar logo automáticamente
  if (type === "Visa") {
    cardLogo.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Farm-Fresh_visa_2.png" height="30">';
  }
  else if (type === "MasterCard") {
    cardLogo.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="30">';
  }
  else if (type === "American Express") {
    cardLogo.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" height="30">';
  }
  else {
    cardLogo.innerHTML = "";
  }

  //  Validación visual
  this.classList.remove("valid-card", "invalid-card");

  if (cleanNumber.length < 15) return;

  if (validateCardNumber(cleanNumber) && type !== "Desconocida") {
    this.classList.add("valid-card");
  } else {
    this.classList.add("invalid-card");
  }

  updateButtonState(); // importante para botón inteligente

  
});

});

function checkFormValidity() {

  const name = document.getElementById("customerName").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = paymentMethod.value;

  if (!name || name.length < 3) return false;
  if (!address || address.length < 5) return false;
  if (!payment) return false;

  if (payment === "card") {

    const cardNumber = document.getElementById("cardNumber").value.replace(/\s+/g, "");
    const expiry = document.getElementById("cardExpiry").value.trim();
    const cvv = document.getElementById("cardCVV").value.trim();

    if (!validateCardNumber(cardNumber)) return false;
    if (getCardType(cardNumber) === "Desconocida") return false;
    if (!validateExpiry(expiry)) return false;
    if (!validateCVV(cardNumber, cvv)) return false;
  }

  return true;
}

const allInputs = document.querySelectorAll("input, select");

allInputs.forEach(input => {
  input.addEventListener("input", updateButtonState);
  input.addEventListener("change", updateButtonState);
});

function updateButtonState() {
  if (checkFormValidity()) {
    confirmOrderBtn.disabled = false;
    confirmOrderBtn.classList.add("active");
  } else {
    confirmOrderBtn.disabled = true;
    confirmOrderBtn.classList.remove("active");
  }
}






/* ========================= */
/* FUNCIONES DE VALIDACIÓN */
/* ========================= */

function validateCardNumber(number) {

  if (!/^\d+$/.test(number)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function getCardType(number) {

  if (/^4/.test(number)) return "Visa";
  if (/^5[1-5]/.test(number)) return "MasterCard";
  if (/^3[47]/.test(number)) return "American Express";

  return "Desconocida";
}

function validateExpiry(expiry) {

  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

  const [month, year] = expiry.split("/").map(Number);

  if (month < 1 || month > 12) return false;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
}

function validateCVV(number, cvv) {

  const type = getCardType(number);

  if (type === "American Express") {
    return /^\d{4}$/.test(cvv);
  } else {
    return /^\d{3}$/.test(cvv);
  }
}

/*Validación visual del Nombre*/

const nameInput = document.getElementById("customerName");

nameInput.addEventListener("input", function () {

  this.classList.remove("valid-field", "invalid-field");

  if (this.value.trim().length === 0) return;

  if (this.value.trim().length >= 3) {
    this.classList.add("valid-field");
  } else {
    this.classList.add("invalid-field");
  }

  updateButtonState();
});
/*Validación visual de la Dirección*/
const addressInput = document.getElementById("address");

addressInput.addEventListener("input", function () {

  this.classList.remove("valid-field", "invalid-field");

  if (this.value.trim().length === 0) return;

  if (this.value.trim().length >= 5) {
    this.classList.add("valid-field");
  } else {
    this.classList.add("invalid-field");
  }

  updateButtonState();
});
/*Validación visual de la Fecha de Expiración*/
const expiryInput = document.getElementById("cardExpiry");

expiryInput.addEventListener("input", function () {

  this.classList.remove("valid-field", "invalid-field");

  if (this.value.trim().length < 5) return;

  if (validateExpiry(this.value.trim())) {
    this.classList.add("valid-field");
  } else {
    this.classList.add("invalid-field");
  }

  updateButtonState();
});
/*Validación visual del CVV*/
const cvvInput = document.getElementById("cardCVV");

cvvInput.addEventListener("input", function () {

  this.classList.remove("valid-field", "invalid-field");

  const cardNumber = document.getElementById("cardNumber").value.replace(/\s+/g, "");
  const cvv = this.value.trim();

  if (cvv.length === 0) return;

  if (validateCVV(cardNumber, cvv)) {
    this.classList.add("valid-field");
  } else {
    this.classList.add("invalid-field");
  }

  updateButtonState();
});
/*función para activar el shake*/
function triggerShake(element) {
  element.classList.add("shake");

  setTimeout(() => {
    element.classList.remove("shake");
  }, 300);
}
/*Activarlo cuando el campo sea inválido*/ 
nameInput.addEventListener("input", function () {

  this.classList.remove("valid-field", "invalid-field");

  if (this.value.trim().length === 0) return;

  if (this.value.trim().length >= 3) {
    this.classList.add("valid-field");
  } else {
    this.classList.add("invalid-field");
    triggerShake(this);
  }

  updateButtonState();
});





