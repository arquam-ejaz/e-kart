const functions = require("firebase-functions");
const express = require("express");
const cors = require('cors');
// const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const stripe = require("stripe")(
  "sk_test_51KHSU5SJ9BhmRQKCScLIluVHPNZk2a4QPwokLbIaiyrsBEfw2SVU9rSGS4drMwK8VPR5CfffJjaXdc6YSWiF96yR00oiLuhhq6"
);

app.use(express.static("public"));
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }))

app.get("/", (req, res) => res.status(200).send("Hello Arquam, Satwik & Vikash"));

app.post("/payment/create", async (req, res) => {
  const total = req.query.total;
  console.log('recived')
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});


exports.api = functions.https.onRequest(app)
