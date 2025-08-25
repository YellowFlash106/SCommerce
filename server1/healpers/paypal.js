const paypal = require("paypal-rest-sdk")
const dotenv = require("dotenv")
dotenv.config()

console.log(process.env.PAYPAL_CLIENT_SECRET)

paypal.configure({
    mode: "sandbox",
    client_id:process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
});

module.exports = paypal;
