const BundleAnalyzerPlugin = require('@bundle-analyzer/webpack-plugin')

module.exports = function override(config, env) {
    if (process.env.BUNDLE_ANALYZER_TOKEN) {
        config.plugins.push(
            new BundleAnalyzerPlugin({
                token: process.env.BUNDLE_ANALYZER_TOKEN,
            })
        )
    }
    return config
}
