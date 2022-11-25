const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(req: any, res: any) {
  const chargeUser = async (
    amount: number,
    user_email: string,
    orderNo: string
  ) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: req.cookies.Currency || 'GBP',
      receipt_email: user_email,
      description: `orderNo: ${orderNo}`,
    })
    console.log(paymentIntent)
    return paymentIntent
  }

  try {
    const paymentIntent = await chargeUser(
      req.body.amount,
      req.body.email,
      req.body.orderNo
    )
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    res.send(error)
  }
}
