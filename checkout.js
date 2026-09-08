const savedCart = localStorage.getItem("cart");
let cart = savedCart ? JSON.parse(savedCart) : [];

const checkoutItemsDisplay = document.getElementById("checkout-items");
const checkoutTotalDisplay = document.getElementById("checkout-total");

function renderCheckout() {
  let total = 0;
  let html = "";

  cart.forEach(function (item, index) {
    total = total + item.price * item.quantity;
    html = html + `
      <p>
        ${item.name} × ${item.quantity} = ¥${item.price * item.quantity}
        <button class="remove-btn" data-index="${index}">削除</button>
      </p>
    `;
  });

  checkoutItemsDisplay.innerHTML = html;
  checkoutTotalDisplay.textContent = total;
  localStorage.setItem("cart", JSON.stringify(cart));
}

checkoutItemsDisplay.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    const index = Number(event.target.dataset.index);
    cart.splice(index, 1);
    renderCheckout();
  }
});

renderCheckout();

const purchaseBtn = document.getElementById("purchase-btn");
purchaseBtn.addEventListener("click", function () {
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
      }
    })
    .catch(function (error) {
      alert("サーバーに接続できませんでした。server.jsが起動しているか確認してください。");
      console.error(error);
    });
});