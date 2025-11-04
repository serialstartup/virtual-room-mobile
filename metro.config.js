const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
 
module.exports = withNativeWind(config, { input: './global.css' })

