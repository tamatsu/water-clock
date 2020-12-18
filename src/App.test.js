import { init } from './App.ts'

test('initial model has tick 0.', () => {
  const [ model, cmd ] = init()
  expect(model.tick).toBe(0)
})
