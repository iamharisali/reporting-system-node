var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CompressionPlugin = require('compression-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  entry: {
    'polyfills': './client/polyfills.ts',
    'vendor': './client/vendor.ts',
    'app': './client/app.ts'
  },

  resolve: {
    extensions: ['.ts', '.js', '.scss']
  },

  module: {
    rules: [{
      test: /\.ts$/,
      loaders: [{
        loader: 'awesome-typescript-loader',
        options: { configFileName: path.resolve(__dirname, 'tsconfig.json') }
      }, 'angular2-template-loader']
    },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: [/.css$|.scss$/],
        use: [
          'to-string-loader',
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'

        ]
      }

    ]
  },

  plugins: [

    new MiniCssExtractPlugin({
      filename: 'stylesheet.css'

    }),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, 'client/assets') }]),
    // Workaround for angular/angular#11580

    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, './client')
    ),

    new HtmlWebpackPlugin({
      template: 'client/index.html'
    })
  ],

  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  optimization: {}
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = false
  module.exports.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          sourceMap: true,
          compress: {
            pure_funcs: ['console.log', 'window.console.log.apply']
          },
          warnings: false
        }

      })
    ]
  }
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin()
  ])
}
