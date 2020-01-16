const BundleAnalyzerPlugin = require('@bundle-analyzer/webpack-plugin')

module.exports = function override(config, env) {
    console.log('config-overrides')
    if (process.env.BUNDLE_ANALYZER_TOKEN) {
        console.log('with token')
        config.plugins.push(
            new BundleAnalyzerPlugin({
                token: process.env.BUNDLE_ANALYZER_TOKEN,
            })
        )
    }
    return config
}
