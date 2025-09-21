module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
      modules: 'auto', // Allow Jest to transform ES modules
    }],
    ['@babel/preset-react', {
      runtime: 'automatic',
      importSource: 'react',
    }],
  ],
  plugins: [
    ['@babel/plugin-transform-react-jsx', {
      runtime: 'automatic',
      importSource: 'react'
    }]
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: 'current',
          },
          modules: 'commonjs', // Use CommonJS for Jest
        }],
        ['@babel/preset-react', {
          runtime: 'automatic',
          importSource: 'react',
        }],
      ],
    },
  },
};