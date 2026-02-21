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
      alert("Por favor completa todos los campos.");
      return;
    }

    if (payment === "card") {

      const cardNumber = document.getElementById("cardNumber").value.replace(/\s+/g, "");
      const expiry = document.getElementById("cardExpiry").value.trim();
      const cvv = document.getElementById("cardCVV").value.trim();

      if (!validateCardNumber(cardNumber)) {
        alert("Número de tarjeta inválido.");
        return;
      }

      const type = getCardType(cardNumber);
      if (type === "Desconocida") {
        alert("Tipo de tarjeta no aceptado.");
        return;
      }

      if (!validateExpiry(expiry)) {
        alert("Fecha de expiración inválida.");
        return;
      }

      if (!validateCVV(cardNumber, cvv)) {
        alert("CVV inválido.");
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

  const number = this.value.replace(/\s+/g, "");

  //const type = getCardType(number);

  // Mostrar logo según tipo

  if (/^4/.test(number)) {

    cardLogo.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Farm-Fresh_visa_2.png" height="30">';
  }
  else if (/^5[1-5]/.test(number)) {

    cardLogo.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" height="30">';

  }
  else if (/^3[47]/.test(number)) {

    cardLogo.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" height="30">';
  }
  else {

    cardLogo.innerHTML = "";
  }
   // Reset clases
  this.classList.remove("valid-card");
  this.classList.remove("invalid-card");

  // Si aún no tiene suficientes dígitos, no marcar
  if (number.length < 13) return;

  // Validar con Luhn
  if (validateCardNumber(number)) {
    this.classList.add("valid-card");
  } else {
    this.classList.add("invalid-card");
  }

});


});



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

