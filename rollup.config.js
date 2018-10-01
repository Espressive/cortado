import babel from 'rollup-plugin-babel';

module.exports = {
    input: 'src/index.js',
    plugins: [
        babel({
            babelrc: true,
        }),
    ],
    output: {
      file: 'dist/index.js',
      format: 'cjs'
    }
  };