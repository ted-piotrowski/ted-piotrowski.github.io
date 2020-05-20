const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "development",

    context: __dirname,
    entry: './index',
    output: {
        path: path.join(__dirname, '..'),
        filename: 'main.js'
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },

    plugins: [
        new CopyPlugin([
            {
                from: 'index.html',
                to: path.join(__dirname, '..'),
            },
            {
                from: 'index.html',
                to: path.join(__dirname, '../404.html'),
            },
            // {
            //     from: 'images',
            //     to: path.join(__dirname, '../docs/images'),
            // }
        ])
    ],

    devServer: {
        contentBase: path.join(__dirname, '..'),
        // compress: true,
        port: 3000
    }
};
