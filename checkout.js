const savedCart = localStorage.getItem("cart");
let cart = savedCart ? JSON.parse(savedCart) : [];

const checkoutItemsDisplay = document.getElementById("checkout-items");
const checkoutTotalDisplay = document.getElementById("checkout-total");
const purchaseBtn = document.getElementById("purchase-btn");

function formatPrice(price) {
  return price.toLocaleString("ja-JP");
}

function renderCheckout() {
  let total = 0;
  let html = "";

  if (cart.length === 0) {
    html = '<p class="empty-cart">カートは空です。<a href="index.html">商品一覧</a>から選んでください。</p>';
    purchaseBtn.disabled = true;
    purchaseBtn.classList.add("disabled");
  } else {
    purchaseBtn.disabled = false;
    purchaseBtn.classList.remove("disabled");
  }

  cart.forEach(function (item, index) {
    total = total + item.price * item.quantity;
    html = html + `
      <div class="checkout-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="checkout-item-info">
          <p class="checkout-item-name">${item.name}</p>
          <p class="checkout-item-price">¥${formatPrice(item.price * item.quantity)}</p>
        </div>
        <div class="qty-controls">
          <button type="button" class="qty-btn" data-action="minus" data-index="${index}" aria-label="減らす">−</button>
          <span>${item.quantity}</span>
          <button type="button" class="qty-btn" data-action="plus" data-index="${index}" aria-label="増やす">＋</button>
        </div>
        <button class="remove-btn" data-index="${index}">削除</button>
      </div>
    `;
  });

  checkoutItemsDisplay.innerHTML = html;
  checkoutTotalDisplay.textContent = formatPrice(total);
  localStorage.setItem("cart", JSON.stringify(cart));

  let count = 0;
  cart.forEach(function (item) {
    count = count + item.quantity;
  });
  const cartBadge = document.getElementById("cart-badge");
  cartBadge.textContent = "🛒 " + count;
}

checkoutItemsDisplay.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    const index = Number(event.target.dataset.index);
    cart.splice(index, 1);
    renderCheckout();
    return;
  }

  if (event.target.classList.contains("qty-btn")) {
    const index = Number(event.target.dataset.index);
    const action = event.target.dataset.action;
    if (action === "plus" && cart[index].quantity < 10) {
      cart[index].quantity = cart[index].quantity + 1;
    }
    if (action === "minus") {
      if (cart[index].quantity > 1) {
        cart[index].quantity = cart[index].quantity - 1;
      } else {
        cart.splice(index, 1);
      }
    }
    renderCheckout();
  }
});

renderCheckout();

purchaseBtn.addEventListener("click", function () {
  if (cart.length === 0) {
    return;
  }
  purchaseBtn.disabled = true;
  purchaseBtn.textContent = "決済画面へ移動しています…";
fetch("https://my-ec-site-server.onrender.com/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cart: cart })
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("エラーが発生しました: " + data.error);
        purchaseBtn.disabled = false;
        purchaseBtn.textContent = "購入する";
      }
    })
    .catch(function (error) {
      alert("サーバーに接続できませんでした。時間をおいてもう一度お試しください。");
      purchaseBtn.disabled = false;
      purchaseBtn.textContent = "購入する";
      console.error(error);
    });
});
