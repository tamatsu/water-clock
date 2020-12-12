export { init, view }

declare var React

type CallMsg = (m: Msg) => void
type Cmd = (msg: CallMsg) => void

// Model
type Model = {
  sources: Source[]
  drops: Drop[]
  tick: number
  forces: Force[]
}

type Rect = {
  l: number
  r: number
  t: number
  b: number
}

function isCollision(p: Point, rect: Rect): boolean {
  return p.x > rect.l && p.x < rect.r && p.y > rect.t && p.y < rect.b
}

type Force = {
  f: (Vector) => Vector
  rect: Rect
}

type Vector = Point

type Drop = {
  tick: number
  p: Point
  v: Vector
  // origin: Point
  color: number
  // path: (number) => Point
  // move: Move
}

type Source = {
  amount: number
  color: number
  x: number
}

function init(): [Model, Cmd] {
  const cmd: Cmd = (msg) => {
    window.requestAnimationFrame(() => msg([tick]))
  }
  
  return [{
    sources: [{
      amount: 5000,
      color: 180,
      x: 100,
      // path: path1
    },{
      amount: 5000,
      color: 120,
      x: 300,
    }],
    drops: [],
    tick: 0,
    forces: [
      slider({ l: 50, r: 400, t: 350, b: 370 }, false),
      slider({ l: 0, r: 350, t: 320, b: 340 }, true),
      slider({ l: 50, r: 400, t: 290, b: 310 }, false),
      slider({ l: 0, r: 350, t: 260, b: 280 }, true),
      slider({ l: 50, r: 400, t: 230, b: 250 }, false),
      slider({ l: 0, r: 350, t: 200, b: 220 }, true),
      { // Falls down vertically
        f: (v: Vector) => {
          return {
            x: 0,
            y: v.y + 0.02
          }
        },
        rect: {
          l: 0,
          r: 400,
          t: 0,
          b: 600
        }
      },
    ]
  }, cmd]
}

function slider(rect: Rect, isRight: boolean) : Force
function slider(rect, isRight) {
  return {
    f: (v: Vector) => {
      return {
        x: isRight? 1 : -1,
        y: 0.05
      }
    },
    rect
  }  
}

// Update
type Msg = [Tick] | [AddSource]

type Tick = (model: Model) => [Model, Cmd]
const tick: Tick = (model) => {
  model.tick++
  model.sources = model.sources.map(source => {
    source.amount--
    return source
  })

  model.sources.forEach(source => {
    if (source.amount % 20 === 0 && source.amount > 0) {
      console.log(model)
      model.drops.push({
        tick: 0,
        p: {
          x: source.x,
          y: 100
        },
        v: {
          x: 0,
          y: 0
        },
        color: source.color,
      })
    }
  })

  model.drops = model.drops
  .map(drop => {
    const found = model.forces.find(force => isCollision(drop.p, force.rect))
    if (found) {
      return move(drop, found)
    }
    else {
      return drop
    }
  })
  .filter(drop => drop.tick < 5000)
  
  const cmd: Cmd = msg => {
    window.requestAnimationFrame(() => msg([tick]))
  }
  
  return [model, cmd]
}

function move(drop: Drop, force: Force): Drop {
  drop.tick++
  drop.v = force.f(drop.v)

  drop.p.x += drop.v.x
  drop.p.y += drop.v.y

  return drop
}

type AddSource = (model: Model) => [Model]
const addSource: AddSource = (model) => {
  const n = Math.floor(Math.random() * 3)
  // const paths = [path0, path1, path2]

  model.sources.push({
    amount: 1000,
    color: Math.floor(Math.random() * 360),
    x: Math.floor(Math.random() * 400),
    // path: paths[n]
  })

  return [model]
}

// View
function view({model, msg}: {model: Model, msg: CallMsg}) {
  return svg().svg({
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 400 400',
    onClick: () => msg([addSource])
  }, [
    svg().g({}, model.sources
    .filter(source => source.amount > 0)
    .map(source => viewSource({ source }))),
    svg().g({}, [
      model.drops.map(drop => viewDrop({drop}))
    ])
  ])
}


function viewSource({ source }: { source: Source }): any {
  return svg().circle({
    cx: source.x,
    cy: 100,
    r: Math.sqrt(source.amount),
    fill: `hsl(${source.color}, 50%, 50%)`
  })
}

function viewDrop({drop}: {drop: Drop}): any {
  // const point = toPoint(drop)

  return svg().circle({
    cx: drop.p.x,
    cy: drop.p.y,
    r: 3,
    fill: `hsla(${drop.color}, 50%, 50%, 0.7)`
  })
}

type Point = {
  x: number
  y: number
}


// Virtual DOM
function div(attributes, children) {
  return React.createElement("div", attributes, children);
}

function text(str) {
  return React.createElement("span", null, str);
}

function button(attributes, children) {
  return React.createElement("button", attributes, children);
}

function form(attributes, children) {
  return React.createElement("form", attributes, children);
}

function input(attributes, children) {
  return React.createElement("input", attributes, children);
}

function svg() {
  return {
    svg(attributes, children) {
      return React.createElement('svg', attributes, children)
    },
    g(attributes, children) {
      return React.createElement('g', attributes, children)
    },
    circle(attributes) {
      return React.createElement('circle', attributes)
    },
    line(attributes, children) {
      return React.createElement('line', attributes, children)
    },
    text(attributes, children) {
      return React.createElement('text', attributes, children)
    }
  }
}