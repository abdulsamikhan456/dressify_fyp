const stripe = require('stripe')('sk_test_51P27nYSDZ3sau26yZlL250YSAOrWUCSqEZGguorukoIPMxNFfEVYXCU2LSivgTm2cVWx3KzRkJ7aH2Awzgwt4MGH00IXEZsmap');

const createPaymentIntent = async (amountInPkr) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPkr * 100, // Amount in PKR converted to cents
      currency: 'pkr',
    });
    return paymentIntent.client_secret;
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    throw error;
  }
};

module.exports = {
  createPaymentIntent,
};
