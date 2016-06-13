var path = require( 'path' );

var webpack = require( 'webpack' );
var HtmlWebpackPlugin = require( 'html-webpack-plugin' );
var LiveReloadPlugin = require( 'webpack-livereload-plugin' );

var autoprefixer = require( 'autoprefixer' );

var ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

const ENV = 'DEV';//PRO

var CSS_Module_Loader_Pargram;

var plugins = [
    new ExtractTextPlugin( "[name].css" ),

    //@手动把公共的集中到这里
    new webpack.optimize.CommonsChunkPlugin( 'vendors', 'vendors.js' ),

    //new webpack.BannerPlugin( 'lizhiFE mock api.' ),

    
    /*new HtmlWebpackPlugin( {
        filename: 'indexeddb.html',
        template: 'src/indexeddb/index.html', // Load a custom template
        inject: 'body', // Inject all scripts into the body
        chunks: [ 'indexedDB', 'vendors' ],
        //hash:false,//一变所有都变。。。output也差不多
        minify: {
            //collapseWhitespace:true,
            removeComments: true
        }
    } )*/
];
if ( ENV === 'PRO' ) {
    plugins.push(
        new webpack.DefinePlugin( {
            'process.env': {
                'NODE_ENV': JSON.stringify( 'production' )
            }
        } ),
        new webpack.optimize.UglifyJsPlugin( {
            compress: { warnings: false }
        } )
    );
    CSS_Module_Loader_Pargram = '?modules&importLoaders=1&localIdentName=[hash:12]';

}
if ( ENV === 'DEV' ) {
    plugins.push(
        //live reload
        new LiveReloadPlugin( {
            port: 35729,
            appendScriptTag: true,
            ignore: null
        } )
    );
    CSS_Module_Loader_Pargram = '?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]';

}

module.exports = {
    entry: {
        indexedDB: path.resolve( __dirname, 'src/indexeddb/entry.jsx' ),
        /**
         * @自定义公共模块抽到这里
         */
        vendors: [ 'react', 'react-dom' ]
    },
    output: {
        path: path.join( __dirname, "/admin/build/" ),
        filename: "[name].bundle.js",
        publicPath: "/build/",
        chunkFilename: "[name].chunk.min.js"

    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                exclude: /(lib)/,
                loader: ExtractTextPlugin.extract(
                    'style?sourceMap',
                    'css' + CSS_Module_Loader_Pargram +
                    '!postcss' +
                    '!resolve-url' +
                    '!sass?sourceMap'
                )
            }, {
                test: /\.scss$/,
                include: /(lib)/,
                loader: ExtractTextPlugin.extract( 'style?sourceMap', 'css!postcss!resolve-url!sass' )
            }, {
                test: /\.css$/,
                exclude: /(lib|node_modules)/,
                loaders: ExtractTextPlugin.extract(
                    'style?sourceMap',
                    '!css' + CSS_Module_Loader_Pargram +
                    '!postcss'
                )
            }, {
                test: /\.css$/,
                include: /(lib|node_modules)/,
                loader: ExtractTextPlugin.extract( 'style?sourceMap', 'css' )
            },
            { test: /\.png$/, loader: "url-loader?limit=4000&name=img/[hash:12].[ext]" },
            { test: /\.jpg$/, loader: "file-loader" },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: [ 'es2015' ]
                }
            }
        ]
    },
    plugins: plugins,

    postcss: function () {
        return [ autoprefixer ];
    }
};
