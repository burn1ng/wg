module.exports = ({is_dev_mode}) => {
    return {
        test: /\.(png|jpg|gif)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 2048,
                    name() {
                        if (is_dev_mode) {
                            return '[path][name].[ext]';
                        }

                        return '[hash].[ext]';
                    },
                    outputPath: 'img'
                }
            },
        ],
    };
};