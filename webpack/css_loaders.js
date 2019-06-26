const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = ({is_dev_mode}) => {
    return {
        test: /\.(sa|sc|c)ss$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: is_dev_mode,
                    reloadAll: true // if hmr does not work, this is a forceful method
                },
            },
            {
                loader: 'css-loader',
                options: {
                    sourceMap: is_dev_mode,
                    importLoaders: 2
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    sourceMap: is_dev_mode,
                    plugins: (loader) => [
                        require('postcss-preset-env')(),
                        require('cssnano')()
                    ]
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: is_dev_mode,
                    sourceMapContents: false
                }
            }
        ]
    }
};