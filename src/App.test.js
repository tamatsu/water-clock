import { init } from './App.ts'

test('init results null', () => {
  const [ model, cmd ] = init()
  expect(model).toBe(null)
})
