const path = require('path');
const webpack=require('webpack');
module.exports = {
  entry: path.join(__dirname,'src', 'index'),
  output: {
    filename: 'stateFlow.js',
    library:'StateFlow',
    libraryTarget:'umd',
    path: path.resolve(__dirname, 'dist')
  }
};