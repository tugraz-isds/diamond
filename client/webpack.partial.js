require('dotenv').config({ path: '../.env' });
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "MAX_REQUEST_PAYLOAD_SIZE": JSON.stringify(process.env.MAX_REQUEST_PAYLOAD_SIZE || "6mb")
    })
  ]
}
