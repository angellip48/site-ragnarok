const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require ('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const PostCssPresetEnv = require('postcss-preset-env')
const FileManagerPlugin = require('filemanager-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () =>{
   const config = {
       runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all'
        }
    }
 if(isProd) {
    config.minimizer = [
        new CssMinimizerWebpackPlugin(),
        new TerserWebpackPlugin()
    ]
 }
    return config
}

const filename = ext => isDev ? `[name]${ext}` : `[name][hash]${ext}`

const cssLoaders = extra =>{
    const loaders =[
        MiniCssExtractPlugin.loader,
        'css-loader',
        { loader:'postcss-loader',
        options: {
            postcssOptions:{
                plugins:[PostCssPresetEnv()]
              }
            }
          }, 
        ]
        
    if (extra){
      loaders.push(extra)
    }

    return loaders
}

module.exports = {
    
    context:path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
    main: ['@babel/polyfill','./js/index.js'],
    },
    output: {
      filename: filename('.js'),
      path: path.resolve(__dirname, 'dist'),
      assetModuleFilename: filename('[ext]'),
      clean: true,
    },

    performance: {
      hints: false,
      maxAssetSize: 512000,
      maxEntrypointSize: 512000
    },
    
    resolve:{
      extensions:['.js','.json']
    },
    
    optimization: optimization(),
    
    devServer:{
      hot: isDev,
      port: 4200,
      static: {
          directory: path.join(__dirname, 'dist'),
        },
      },
      
    devtool: isDev ? 'source-map' : undefined,
    target: isDev ? 'web' : 'browserslist', 
    
    plugins: [
      
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
            // template: path.join(__dirname, 'src', 'template.pug'),
            // filename: 'index.html',
        }),  

        new FileManagerPlugin({
          events: {
            onStart: {
              delete: ['dist'],
            },
            onEnd: {
              copy: [
                {
                  source: path.resolve(__dirname, 'src/images'), 
                  destination: path.resolve(__dirname, 'dist/images/'),
                },
              ],
            },
          },
        }),

          new MiniCssExtractPlugin({
            filename: filename('.css'),
          }),

    ],

    module:{
        rules:[
            {
              test: /\.html?$/i,
              use: ['html-loader']
            },
            {
              test: /\.pug$/i,
              loader: 'pug-loader',
            },
            {
              test: /\.css$/i,
              use: cssLoaders()
            },
            {
              test: /\.(png|jpe?g|gif|svg|webp)$/i,
              use:[
                  {
                    loader: 'image-webpack-loader',
                    options: {
                      mozjpeg: {
                        progressive: true,
                      },
                      // optipng.enabled: false will disable optipng
                      optipng: {
                        enabled: false,
                      },
                      pngquant: {
                        quality: [0.65, 0.90],
                        speed: 4
                      },
                      gifsicle: {
                        interlaced: false,
                      },
                      // the webp option will enable WEBP
                      webp: {
                        quality: 75
                      }
                    }
                  },
                ],
                type: 'asset/resource',
                
                generator:{
                  filename: 'images/[name][hash][ext]'
                }
              
                
            },
            {
                test: /\.(ttf|woff2?|eot|)$/i,
                type: 'asset/resource',
                generator:{
                  filename: 'fonts/[name][hash][ext]'
                }
            },
            {
                test: /\.xml$/i,
                use: ['xml-loader']  
              },
            {
                test: /\.csv$/i,
                use: ['csv-loader']  
              },
              {
                test: /\.less$/i,
                use: cssLoaders ('less-loader')
              },
              {
                test: /\.s[ac]ss$/i,
                use: cssLoaders ('sass-loader')
              },
              {
                test: /\.(js|ts|jsx)$/i,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ]
    }

}