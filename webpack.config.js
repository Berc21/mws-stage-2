const path = require("path");

module.exports = {
  entry: {
    homepage: "./src/home.js",
    resturant_info: "./src/restaurant.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules)/
      }
    ]
  }
};