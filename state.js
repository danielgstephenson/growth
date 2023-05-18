import { range, clamp, sum } from './utility.js'

const N = 50
const dt = 1

const grid = range(N).map(i => range(N).map(j => ({
  align: 0,
  life: 0,
  capacity: 0,
  g: 0,
  b: 0,
  r: 0,
  x: j,
  y: i,
  neighbors: [],
  selected: { 1: false, 2: false }
})))

const nodes = grid.flat()
nodes.forEach((node, index) => {
  node.id = index
})

range(N).forEach(i => range(N).forEach(j => {
  const node = grid[i][j]
  const L = N - 1
  function setupNeighbor (a, b) {
    const neighbor = grid[a][b]
    node.neighbors.push(neighbor)
  }
  if (i < L) setupNeighbor(i + 1, j)
  if (i > 0) setupNeighbor(i - 1, j)
  if (j < L) setupNeighbor(i, j + 1)
  if (j > 0) setupNeighbor(i, j - 1)
}))

function update () {
  grow()
  spread()
  setColors()
}

function spread () {
  nodes.forEach(node => {
    node.align2 = node.align
  })
  nodes.forEach(node => {
    if (Math.abs(node.align) === 1) {
      node.neighbors.forEach(neighbor => {
        if (neighbor.align * node.align >= 0) {
          neighbor.align2 += dt * 0.2 * Math.sign(node.align)
        }
      })
    }
  })
  nodes.forEach(node => {
    node.align = node.align2
  })
}

function grow () {
  nodes.forEach(node => {
    node.life2 = node.life
  })
  nodes.forEach(node => {
    const neighborLife = node.neighbors.map(neighbor => neighbor.life * neighbor.capacity ** 3)
    if (node.capacity > 0) {
      node.life2 += dt * 1 * sum(neighborLife) * (1 - node.life / node.capacity)
    }
    node.life2 = clamp(0, node.capacity, node.life2)
  })
  nodes.forEach(node => {
    node.life = node.life2
  })
}

function diffuse () {
  nodes.forEach(node => {
    node.capacity2 = node.capacity
  })
  const criticalDifference = 0
  const diffusionRate = 0.1
  nodes.forEach(node => {
    node.neighbors.forEach(neighbor => {
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
    node.r = (1 - node.life) * node.capacity / 3
    node.g = (1 - node.life) * node.capacity / 3
    node.b = (1 - node.life) * node.capacity / 3
    node.r += node.life * node.capacity * Math.max(0, node.align)
    node.g += node.life * node.capacity * (1 - Math.abs(node.align))
    node.b += node.life * node.capacity * Math.max(0, -node.align)
  })
}

nodes.forEach(node => {
  node.capacity = Math.random() < 0.25 ? 2 * Math.random() : 0
  node.align = Math.random() < 0.05 ? (2 * Math.random() - 1) : 0
})
const aligns = nodes.map(node => node.align)
console.log(Math.min(...aligns))
range(20).forEach(i => diffuse())
nodes.forEach(node => {
  node.capacity = clamp(0, 1, node.capacity)
})
nodes.forEach(node => {
  node.life = Math.random() < 0.01 ? node.capacity : 0
})

export default { N, dt, nodes, update }
