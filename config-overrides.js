const Webpack = require('webpack')

module.exports = function override(config, env) {
    config.module.rules.push({
        enforce: 'pre',
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
            fix: true,
        },
    })
    config.plugins.push(
        new Webpack.DefinePlugin({
            __VERSION__: JSON.stringify(
                process.env.VERSION || (process.env.NODE_ENV === 'production' ? 'unkown' : 'dev')
            ),
            __USE_EMULATORS__: Boolean(process.env.useEmulators),
        })
    )
    return config
}
