const rules = require('./webpack.rules');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotEnv = require('dotenv-webpack')
const relocateLoader = require('@vercel/webpack-asset-relocator-loader');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader', options: { url: true } }],
});

module.exports = {
  target: 'electron-renderer',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.json', '.node'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/static' }
      ]
    }),
    new DotEnv({
      path: './.env'
    }),
    // {
    //   apply(compiler) {
    //     compiler.hooks.compilation.tap(
    //       'webpack-asset-relocator-loader',
    //       (compilation) => {
    //         relocateLoader.initAssetCache(compilation, 'native_modules');
    //       },
    //     );
    //   },
    // },
  ],
};
