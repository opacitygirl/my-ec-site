require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const products = require("./products.json");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async function (req, res) {
  try {
        const cart = req.body.cart;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "カートが空です" });
    }

    const lineItems = [];

    for (const item of cart) {
      const product = products.find(function (p) {
        return p.id === Number(item.id);
      });
      const quantity = Number(item.quantity);

      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({
          error: "カートの内容が正しくありません。一度カートを空にして、もう一度商品を追加してください。"
        });
      }

      lineItems.push({
        price_data: {
          currency: "jpy",
          product_data: {
            name: product.name
          },
          unit_amount: product.price
        },
        quantity: quantity
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["JP"]
      },
      phone_number_collection: {
        enabled: true
      },
      success_url: "https://relaxed-syrniki-da44ef.netlify.app/success.html",
      cancel_url: "https://relaxed-syrniki-da44ef.netlify.app/checkout.html"
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;

app.listen(PORT, function () {
  console.log("サーバーが起動しました: ポート" + PORT);
});

app.use(cors({
  origin: "https://relaxed-syrniki-da44ef.netlify.app"
}));