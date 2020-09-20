import * as path from 'path';
import * as webpack from 'webpack';
import MiniCssPlugin from 'mini-css-extract-plugin';

type webpackMode = 'development' | 'production' | 'none';
const mode: webpackMode = 'development';

const cssLoaders: webpack.RuleSetUse = [
  {
    loader: MiniCssPlugin.loader
  },
  {
    loader: "css-loader",
    options: {
      url: false,
      importLoaders: 2,
    },
  },
  {
    loader: "sass-loader",
  },
];

const config: webpack.Configuration = {
  mode: mode,
  context: path.join(__dirname, './src/client'),
  entry: {
    index: './index.ts',
  },
  watchOptions: {
    ignored: /node_modules/
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './public/js'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      // tsのローダー
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      // scssのローダー
      {
        test: /\.scss$/,
        use: cssLoaders
      }
    ]
  },
  plugins: [
    new MiniCssPlugin({ filename: "../css/style.css" }),
  ]
};

export default config;