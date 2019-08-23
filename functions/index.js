/* eslint-disable no-console */
require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
}

exports.handler = async (event, context) => {
  if (!event.body || event.httpMethod !== 'POST') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: 'invalid http method'
      })
    }
  }

  const data = JSON.parse(event.body)

  if (!data.stripToken || !data.stripeAmt || !data.stripeIdempotency) {
    // eslint-disable-next-line no-console
    console.error('Required information is missing')

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: 'missing information'
      })
    }
  }

  // stripe payment processing starts here
  try {
    await stripe.customers
      .create({
        email: data.stripeEmail,
        source: data.stripeToken
      })
      .then((customer) => {
        console.log(
          `starting the charges, amt: ${data.stripeAmt}, email: ${data.stripeEmail}`
        )
        return stripe.charges
          .create(
            {
              currency: 'usd',
              amount: data.stripeAmt,
              receeipt_email: data.stripeEmail,
              customer: customer.id,
              description: 'Smaple Charge'
            },
            {
              idempotency_key: data.stripeIdempotency
            }
          )
          .then((result) => {
            console.log(`Charge created: ${result}`)
          })
      })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'it works! beep boop!'
      })
    }
  } catch (err) {
    console.log(err)

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: err
      })
    }
  }
}

// eslint-disable-next-line require-await
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello Tacos',
      event
    })
  }
}
