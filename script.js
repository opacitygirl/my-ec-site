const savedCart = localStorage.getItem("cart");
let cart = savedCart ? JSON.parse(savedCart) : [];

const cartCountDisplay = document.getElementById("cart-count");
const cartTotalDisplay = document.getElementById("cart-total");
const cartItemsDisplay = document.getElementById("cart-items");
const productsContainer = document.getElementById("products-container");

function renderCart() {
  let count = 0;
  let total = 0;
  let html = "";

  cart.forEach(function (item, index) {
    count = count + item.quantity;
    total = total + item.price * item.quantity;
    html = html + `
      <p>
        ${item.name} × ${item.quantity} = ¥${item.price * item.quantity}
        <button class="remove-btn" data-index="${index}">削除</button>
      </p>
    `;
  });

   cartCountDisplay.textContent = count;
  cartTotalDisplay.textContent = total;
  cartItemsDisplay.innerHTML = html;
  localStorage.setItem("cart", JSON.stringify(cart));

  const cartBadge = document.getElementById("cart-badge");
  cartBadge.textContent = "🛒 " + count;
}

function addToCart(product) {
  const existingItem = cart.find(function (item) {
    return item.name === product.name;
  });

  if (existingItem) {
    existingItem.quantity = existingItem.quantity + 1;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  renderCart();
}

cartItemsDisplay.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    const index = Number(event.target.dataset.index);
    cart.splice(index, 1);
    renderCart();
  }
});

renderCart();

fetch("products.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (products) {
    products.forEach(function (product) {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p class="price">¥${product.price}</p>
        <button class="add-btn">カートに追加</button>
      `;

      card.addEventListener("click", function () {
        window.location.href = "product.html?id=" + product.id;
      });

      productsContainer.appendChild(card);

      const button = card.querySelector(".add-btn");
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        addToCart(product);
      });
    });
  });

const checkoutBtn = document.getElementById("checkout-btn");
checkoutBtn.addEventListener("click", function () {
  window.location.href = "checkout.html";
});