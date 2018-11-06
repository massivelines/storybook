const path = require('path');
const { DefinePlugin, ContextReplacementPlugin } = require('webpack');

module.exports = (baseConfig, env, defaultConfig) => ({
  ...defaultConfig,
  entry: {
    ...defaultConfig.entry,
    "editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js',
    "json.worker": 'monaco-editor/esm/vs/language/json/json.worker',
    "css.worker": 'monaco-editor/esm/vs/language/css/css.worker',
    "html.worker": 'monaco-editor/esm/vs/language/html/html.worker',
    "ts.worker": 'monaco-editor/esm/vs/language/typescript/ts.worker',
  },
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.stories\.jsx?$/,
        use: require.resolve('@storybook/addon-storysource/loader'),
        include: [
          path.resolve(__dirname, './stories'),
          path.resolve(__dirname, '../../lib/ui/src'),
          path.resolve(__dirname, '../../lib/components/src'),
        ],
        enforce: 'pre',
      },
      {
        test: /\.js/,
        use: defaultConfig.module.rules[0].use,
        include: [
          path.resolve(__dirname, '../../lib/ui/src'),
          path.resolve(__dirname, '../../lib/components/src'),
        ],
      },
    ],
  },
  resolve: {
    ...defaultConfig.resolve,
    // https://github.com/graphql/graphql-js#using-in-a-browser
    extensions: ['.mjs', ...defaultConfig.resolve.extensions],
  },
  plugins: [
    ...defaultConfig.plugins,
    // graphql sources check process variable
    new DefinePlugin({
      process: JSON.stringify(true),
    }),
    // See https://github.com/graphql/graphql-language-service/issues/111#issuecomment-306723400
    new ContextReplacementPlugin(/graphql-language-service-interface[/\\]dist/, /\.js$/),
  ],
});
