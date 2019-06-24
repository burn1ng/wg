module.exports = {
    test: /\.svg$/,
    use: [
        {
            loader: 'svg-sprite-loader',
            options: {
                symbolId: '[folder]__[name]'
            }
        },
        {
            loader: 'svgo-loader',
            options: {
                plugins: [
                    {removeStyleElement: true},
                    {removeScriptElement: true},
                    {convertStyleToAttrs: false},
                    {removeAttrs: {attrs: '(class|style.*)'}} // don't set fill here for 2color icons support
                ]
            }
        }
    ]
};