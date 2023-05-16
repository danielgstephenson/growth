import { range, clamp } from './utility.js'

const N = 20
const dt = 0.1
let step = 5

const grid = range(N).map(i => range(N).map(j => {
  const node = {
    color: 'green',
    life: 0,
    capacity: 0,
    g: 0,
    b: 0,
    r: 0,
    x: j,
    y: i,
    selected: { 1: false, 2: false }
  }
  node.neighborIds = []
  return node
}))

const nodes = grid.flat()
nodes.forEach((node, index) => {
  node.id = index
})
const edges = []
const neighbors = nodes.map(() => [])

range(N).forEach(i => range(N).forEach(j => {
  const node = grid[i][j]
  const L = N - 1
  function setupNeighbor (a, b) {
    const neighbor = grid[a][b]
    neighbors[node.id].push(neighbor)
    if (node.id < neighbor.id) edges.push([node.id, neighbor.id])
  }
  if (i < L) setupNeighbor(i + 1, j)
  if (i > 0) setupNeighbor(i - 1, j)
  if (j < L) setupNeighbor(i, j + 1)
  if (j > 0) setupNeighbor(i, j - 1)
  /*
  if (i < L && j < L) setupNeighbor(i + 1, j + 1)
  if (i < L && j > 0) setupNeighbor(i + 1, j - 1)
  if (i > 0 && j < L) setupNeighbor(i - 1, j + 1)
  if (i > 0 && j > 0) setupNeighbor(i - 1, j - 1)
  */
}))

function update () {
  step = (step + 1) % 1
  grow()
  // die()
  if(step === 0) spread()
  setColors()
}

function spread() {
  nodes.forEach(node => {
    nodes.forEach(node => {
      node.color2 = node.color
      node.life2 = node.life
      node.target = -1
    })
  })
  nodes.forEach(node => {
    if(node.color === 'blue') {
      node.color2 = 'green'
      node.life2 = 0
      neighbors[node.id].forEach(neighbor => {
        node.target = Math.max(node.target, neighbor.life * neighbor.capacity)
      })
    }
  })
  nodes.forEach(node => {
    if(node.color === 'green') {
      neighbors[node.id].forEach(neighbor => {
        if(neighbor.color === 'blue') {
          if(neighbor.target === node.life * node.capacity) {
            node.color2 = 'blue'
          }
        }
      })
    }
  })
  nodes.forEach(node => {
    node.color = node.color2
    node.life = node.life2
  })
}

function grow () {
  nodes.forEach(node => {
    node.life2 = node.life
  })
  nodes.forEach(node => {
    if (node.color === 'green') {
      neighbors[node.id].forEach(neighbor => {
        if (neighbor.color === 'green') {
          node.life2 += dt * 0.1 * neighbor.life * node.capacity
        }
        node.life2 = clamp(0, 1, node.life2)
      })
    }
  })
  nodes.forEach(node => {
    node.life = node.life2
  })
}

function die () {
  nodes.forEach(node => {
    if (node.color !== 'green') {
      node.life = clamp(0, 1, node.life - dt * 0.1)
      node.color = node.life > 0 ? node.color : 'green'
    }
  })
}

function diffuse () {
  nodes.forEach(node => {
    node.capacity2 = node.capacity
  })
  const criticalDifference = 0.05
  const diffusionRate = 0.1
  nodes.forEach(node => {
    neighbors[node.id].forEach(neighbor => {
      const pressure = Math.max(0, node.capacity - neighbor.capacity - criticalDifference)
      const flow = diffusionRate * dt * pressure
      neighbor.capacity2 += flow
      node.capacity2 -= flow
    })
  })
  nodes.forEach(node => {
    node.capacity = node.capacity2
  })
}

function setColors () {
  nodes.forEach(node => {
    if(node.color === 'green') {
      node.r = 0
      node.g = node.life * 0.5
      node.b = 0
    }
    if(node.color === 'blue') {
      node.r = 0
      node.g = 0 
      node.b = 0.8  
    }
    if(node.color === 'red') {
      node.r = 1
      node.g = 0 
      node.b = 0  
    }
  })
}

nodes.forEach(node => {
  node.capacity = 0.7 // Math.random() < 0.8 ? Math.random() : 0
  node.life = Math.random()
  node.color = Math.random() < 0.01 ? 'blue' : 'green'
})
range(100).forEach(i => diffuse())

export default { N, dt, nodes, update }
