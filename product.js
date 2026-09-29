const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

const productDetail = document.getElementById("product-detail");

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

        productDetail.innerHTML = `
  <div class="product-layout">
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="product-info">
      <h1>${product.name}</h1>
      <p class="price">¥${product.price}</p>
      <p class="description">${product.description}</p>
      <button id="add-btn">カートに追加</button>
    </div>
  </div>
`;
    const button = document.getElementById("add-btn");
    button.addEventListener("click", function () {
      const savedCart = localStorage.getItem("cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];

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

            localStorage.setItem("cart", JSON.stringify(cart));
      updateCartBadge();
      alert(product.name + " をカートに追加しました");
    });
  });
  
function updateCartBadge() {
  const savedCart = localStorage.getItem("cart");
  const cart = savedCart ? JSON.parse(savedCart) : [];

  let count = 0;
  cart.forEach(function (item) {
    count = count + item.quantity;
  });

  const cartBadge = document.getElementById("cart-badge");
  cartBadge.textContent = "🛒 " + count;
}

updateCartBadge();