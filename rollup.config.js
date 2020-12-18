import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import typescript from 'rollup-plugin-typescript2'
 
const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/App.ts',
  output: {
    file: 'public/App.js',
    format: 'es'
  },
  plugins: [
    typescript(),

		!production && serve({
      contentBase: 'public',
      port: 3000
    }),
		!production && livereload('public'),
  ],
}
