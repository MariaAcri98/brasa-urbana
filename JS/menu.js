document.addEventListener("DOMContentLoaded", function () {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartNumber = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartPanel = document.getElementById("cartPanel");
  const cartBtn = document.getElementById("cartButton");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const closeBtn = document.getElementById("closeCart");

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartUI() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {

      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
      <span>${item.name}</span>
        <div>
        <button class="qty-btn" onclick="decreaseQty(${index})">-</button>
        <span class="qty-number">${item.quantity}</span>
        <button class="qty-btn" onclick="increaseQty(${index})">+</button>
        </div>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <button class="removeItem" onclick="removeItem(${index})">❌</button>
      `;

      cartItemsContainer.appendChild(div);

      total += item.price * item.quantity;
      totalItems += item.quantity;
    });

    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    if (cartNumber) cartNumber.textContent = totalItems;
  }

  window.addToCart = function(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    saveCart();
    updateCartUI();
  };

  window.increaseQty = function(index) {
    cart[index].quantity++;
    saveCart();
    updateCartUI();
  };

  window.decreaseQty = function(index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
  };

  window.removeItem = function(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
  };

  // ABRIR CARRITO
  if (cartBtn) {
    cartBtn.addEventListener("click", function () {
      cartPanel.classList.add("open");
    });
  }

  // CERRAR
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      cartPanel.classList.remove("open");
    });
  }
// VACIAR CARRITO
  if (clearCartBtn) {
  clearCartBtn.addEventListener("click", function () {
    cart = [];
    saveCart();
    updateCartUI();
  });
}

  updateCartUI()
  document.querySelectorAll(".removeItem").forEach(btn => {
  btn.addEventListener("click", function () {
    const index = this.getAttribute("data-index");
    cart.splice(index, 1);
    cartCount--;
    cartNumber.textContent = cartCount;
    updateCartUI();
  });
});;


    document.body.classList.add("loaded");
});




