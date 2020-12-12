import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import typescript from 'rollup-plugin-typescript2'
 
export default {
  input: 'src/App.ts',
  output: {
    file: 'public/App.js',
    format: 'es'
  },
  plugins: [
    typescript(),
    serve({
      contentBase: 'public',
      port: 3000
    }),
    livereload('public'),
  ],
}
