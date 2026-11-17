const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

const productDetail = document.getElementById("product-detail");

function formatPrice(price) {
  return "¥" + price.toLocaleString("ja-JP");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}

function updateCartBadge(bump) {
  const savedCart = localStorage.getItem("cart");
  const cart = savedCart ? JSON.parse(savedCart) : [];

  let count = 0;
  cart.forEach(function (item) {
    count = count + item.quantity;
  });

  const cartBadge = document.getElementById("cart-badge");
  cartBadge.textContent = "🛒 " + count;

  if (bump) {
    cartBadge.classList.remove("bump");
    void cartBadge.offsetWidth;
    cartBadge.classList.add("bump");
  }
}

fetch("products.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (products) {
    const product = products.find(function (p) {
      return p.id === productId;
    });

    if (!product) {
      productDetail.innerHTML = "<p>商品が見つかりませんでした。</p>";
      return;
    }

    document.title = product.name + "｜超通信ストア";

    productDetail.innerHTML = `
  <div class="product-layout">
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="product-info">
      <h1>${product.name}</h1>
      <p class="price">${formatPrice(product.price)}<span class="price-note">（税込・送料無料）</span></p>
      <p class="description">${product.description}</p>
      <div class="qty-row">
        <span class="qty-label">個数</span>
        <div class="qty-controls">
          <button type="button" id="qty-minus" aria-label="減らす">−</button>
          <span id="qty-value">1</span>
          <button type="button" id="qty-plus" aria-label="増やす">＋</button>
        </div>
      </div>
      <button id="add-btn">カートに追加</button>
      <p class="ship-note">送料無料 ／ ご注文から5〜7営業日以内に発送します</p>
    </div>
  </div>
`;

    let quantity = 1;
    const qtyValue = document.getElementById("qty-value");
    document.getElementById("qty-minus").addEventListener("click", function () {
      if (quantity > 1) {
        quantity = quantity - 1;
        qtyValue.textContent = quantity;
      }
    });
    document.getElementById("qty-plus").addEventListener("click", function () {
      if (quantity < 10) {
        quantity = quantity + 1;
        qtyValue.textContent = quantity;
      }
    });

    const button = document.getElementById("add-btn");
    button.addEventListener("click", function () {
      const savedCart = localStorage.getItem("cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];

      const existingItem = cart.find(function (item) {
        return item.name === product.name;
      });

      if (existingItem) {
        existingItem.quantity = existingItem.quantity + quantity;
      } else {
          cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartBadge(true);
      showToast(product.name + " × " + quantity + " をカートに追加しました 🛒");
    });
  });

updateCartBadge(false);
