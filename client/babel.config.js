module.exports = {
  presets: [
    [
      '@babel/preset-react',
      {
        development: process.env.NODE_ENV === 'development',
      },
    ],
  ],
  plugins: ['@babel/plugin-syntax-dynamic-import'],
};
