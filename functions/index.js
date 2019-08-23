// functions/index.js
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
