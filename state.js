import { clamp, range } from './utility.js'

const N = 50
const dt = 0.1
const C = 0.5
const year = 3
let t = 0

const grid = range(N).map(i => range(N).map(j => ({
  r: 0,
  g: 0,
  b: 0,
  x: j,
  y: i,
  neighbors: [],
  selected: { 1: false, 2: false }
})))

const nodes = grid.flat()
nodes.forEach((node, index) => {
  node.id = index
})
const edges = []

range(N).forEach(i => range(N).forEach(j => {
  const node = grid[i][j]
  const L = N - 1
  function setupNeighbor (x, y, w) {
    const neighbor = grid[x][y]
    node.neighbors.push(neighbor)
    edges.push({ from: node, to: neighbor, w })
  }
  if (i < L) setupNeighbor(i + 1, j, 1)
  if (i > 0) setupNeighbor(i - 1, j, 1)
  if (j < L) setupNeighbor(i, j + 1, 1)
  if (j > 0) setupNeighbor(i, j - 1, 1)
  if (i < L && j < L) setupNeighbor(i + 1, j + 1, Math.SQRT1_2)
  if (i < L && j > 0) setupNeighbor(i + 1, j - 1, Math.SQRT1_2)
  if (i > 0 && j < L) setupNeighbor(i - 1, j + 1, Math.SQRT1_2)
  if (i > 0 && j > 0) setupNeighbor(i - 1, j - 1, Math.SQRT1_2)
}))

function update () {
  t += dt
  spread()
  grow()
}

function spread () {
  edges.forEach(edge => {
    edge.g = 1 * edge.w * edge.from.g
    edge.b = 0.01 * edge.w * edge.from.b
    edge.r = 0.2 * edge.w * edge.from.r
  })
  edges.forEach(edge => {
    const fromRed = edge.from.r > C && edge.from.b < C
    const fromBlue = edge.from.b > C && edge.from.r < C
    const toRed = edge.to.r > C && edge.to.r < C
    const toBlue = edge.to.b > C && edge.to.b < C
    const redBlockGreen = fromRed && !toRed
    const blueBlockGreen = fromBlue && !toBlue
    const greenBlocked = redBlockGreen || blueBlockGreen
    if (!greenBlocked) {
      edge.from.g -= dt * edge.g
      edge.to.g += dt * edge.g
    }
    // edge.from.b -= dt * edge.b
    // edge.to.b += dt * edge.b
    if (edge.from.r > C) {
      // edge.from.r -= dt * edge.r
      edge.to.r += dt * edge.r * edge.g
    }
  })
}

function grow () {
  // const season = 0.5 * Math.sin(t * 2 * Math.PI / year) + 0.5
  nodes.forEach(node => {
    node.dg = 0.1 + 0.2 * node.g - 0.3 * node.r - 0.3 * node.b
    node.db = 0
    node.dr = -0.1 * node.r
  })
  nodes.forEach(node => {
    node.g += dt * node.dg
    node.b += dt * node.db
    node.r += dt * node.dr
    node.r = clamp(0, 1, node.r)
    node.g = clamp(0, 1, node.g)
    node.b = clamp(0, 1, node.b)
  })
}

nodes.forEach(node => {
  node.r = Math.random() < 0.1 ? 1 : 0
  node.g = Math.random()
  node.b = 0
})

export default { N, dt, nodes, update }
