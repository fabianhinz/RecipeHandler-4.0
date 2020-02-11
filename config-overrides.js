const Webpack = require('webpack')

module.exports = function override(config, env) {
    config.plugins.push(
        new Webpack.DefinePlugin({
            __VERSION__: JSON.stringify(
                process.env.VERSION || (process.env.NODE_ENV === 'production' ? 'unkown' : 'dev')
            ),
        })
    )
    return config
}
