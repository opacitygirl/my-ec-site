require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async function (req, res) {
  try {
    const cart = req.body.cart;

    const lineItems = cart.map(function (item) {
      return {
        price_data: {
          currency: "jpy",
          product_data: {
            name: item.name
          },
          unit_amount: item.price
        },
        quantity: item.quantity
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
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