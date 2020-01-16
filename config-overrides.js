const BundleAnalyzerPlugin = require('@bundle-analyzer/webpack-plugin')
const Webpack = require('webpack')

module.exports = function override(config, env) {
    if (process.env.BUNDLE_ANALYZER_TOKEN) {
        config.plugins.push(
            new BundleAnalyzerPlugin({
                token: process.env.BUNDLE_ANALYZER_TOKEN,
            })
        )
    }
    config.plugins.push(
        new Webpack.DefinePlugin({
            __VERSION__: JSON.stringify(
                process.env.VERSION || process.env.NODE_ENV === 'production' ? 'unkown' : 'dev'
            ),
        })
    )
    return config
}
