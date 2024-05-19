const express = require('express');
const router = express.Router();
const stripe = require("stripe")("sk_test_51OxZRgSGPT6HZUZpWJXQrSFPCPfxxgyZeY9b9B3U8vjBFtOjw6PvSDdh8wIC9qeS5wwLCpxnJEOm7n0SdUDsz1lV00UK1jzhD0");

router.post('/intent', async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        description:'Your payment description here',
        currency: 'inr',
        automatic_payment_methods: {
          enabled: true,
        },
      });
  
      res.json({ paymentIntent: paymentIntent.client_secret });
    } catch (e) {
      res.status(400).json({
        error: e.message,
      });
    }
  });

module.exports = router;



