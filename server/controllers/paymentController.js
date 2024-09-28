// const paypal = require("paypal-rest-sdk");
// const express = require("express");
// const router = express.Router();
// paypal.configure({
//   mode: "sandbox", // استبدلها بـ 'live' للإنتاج
//   client_id:
//     "AYOHT_PiYHOYOEeBBFX6aJ2Qba1FNYaerPfuYMGdYNebFt8DowMGVOkpRONRk2hN_qaVgpVedHJU6Ywi",
//   client_secret:
//     "EDhe9Vfb9v-Nvai9LP5mB17eGgmq59ZUQJUKzbezeyQrtEnlg8FuipuSf8NrdFmbQ78Vrjg32pX107Mh",
// });
// router.post("/pay", (req, res) => {
//   console.log("Payment route");
//   const create_payment_json = {
//     intent: "sale",
//     payer: {
//       payment_method: "paypal",
//     },
//     redirect_urls: {
//       return_url: "http://localhost:5000/payment/success",
//       cancel_url: "http://localhost:5000/payment/cancel",
//     },
//     transactions: [
//       {
//         item_list: {
//           items: [
//             {
//               name: "Red Sox Hat",
//               sku: "001",
//               price: "25.00",
//               currency: "USD",
//               quantity: 1,
//             },
//           ],
//         },
//         amount: {
//           currency: "USD",
//           total: "25.00",
//         },
//         description: "Hat for the best team ever",
//       },
//     ],
//   };
//   router.get("/success", (req, res) => {
//     const payerId = req.query.PayerID;
//     const paymentId = req.query.paymentId;
//     console.log(payerId, paymentId);
//     const execute_payment_json = {
//       payer_id: payerId,
//       transactions: [
//         {
//           amount: {
//             currency: "USD",
//             total: "25.00",
//           },
//         },
//       ],
//     };

//     paypal.payment.execute(
//       paymentId,
//       execute_payment_json,
//       function (error, payment) {
//         if (error) {
//           console.log(error.response);
//           throw error;
//         } else {
//           console.log(JSON.stringify(payment));
//           res.send("Success");
//         }
//       }
//     );
//   });
//   paypal.payment.create(create_payment_json, function (error, payment) {
//     if (error) {
//       throw error;
//     } else {
//       for (let i = 0; i < payment.links.length; i++) {
//         if (payment.links[i].rel === "approval_url") {
//           res.redirect(payment.links[i].href);
//         }
//       }
//     }
//   });
// });
// router.get("/cancel", (req, res) => res.send("Cancelled"));

// module.exports = router;
