const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    minifierConfig: {
      // Remove console.log statements in production
      mangle: {
        keep_fnames: true,
      },
      output: {
        comments: false,
      },
      compress: {
        drop_console: true,
      },
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
