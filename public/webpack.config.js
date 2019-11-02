const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
	path: path.resolve(__dirname, 'dist'),
	filename: 'main.js'
    },
    plugins: [
	new MiniCssExtractPlugin({
	    // Options similar to the same options in webpackOptions.output
	    // all options are optional
	    filename: '[name].css',
	    chunkFilename: '[id].css',
	    ignoreOrder: false, // Enable to remove warnings about conflicting order
	}),
    ],
    module: {
	rules: [
	    {
		test: /\.(sc|c|sa)ss$/,
		use: [
		    {
			loader: MiniCssExtractPlugin.loader,
			options: {
			    // you can specify a publicPath here
			    // by default it uses publicPath in webpackOptions.output
			    //publicPath: '../',
			    hmr: process.env.NODE_ENV === 'development',
			},
		    },
		    {
			loader: 'css-loader',
		    }, {
			loader: 'postcss-loader',
			options: {
			    plugins: function() {
				return [
				    require('autoprefixer')
				];
			    }
			}
		    }, {
			loader: 'sass-loader'
		    }
		]
	    },
	    {
		test: /\.css$/,
		use: [
		    {
			loader: MiniCssExtractPlugin.loader,
			options: {
			    // you can specify a publicPath here
			    // by default it uses publicPath in webpackOptions.output
			    //publicPath: '../',
			    hmr: process.env.NODE_ENV === 'development',
			},
		    },
		    'css-loader',
		],
	    },
	]
    }
};
