const savedCart = localStorage.getItem("cart");
let cart = savedCart ? JSON.parse(savedCart) : [];

const productsContainer = document.getElementById("products-container");

function renderCart() {
  let count = 0;

  cart.forEach(function (item) {
    count = count + item.quantity;
  });

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

