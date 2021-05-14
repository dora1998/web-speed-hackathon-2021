const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    cssnano({
      preset: 'default',
    }),
    postcssImport(),
    tailwindcss(),
    postcssPresetEnv({
      stage: 3,
    }),
  ],
};
