import { clamp, range } from './utility.js'

const N = 50
const dt = 0.2

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
  if (i < L && j < L) setupNeighbor(i + 1, j + 1, 0.5 * Math.SQRT1_2)
  if (i < L && j > 0) setupNeighbor(i + 1, j - 1, 0.5 * Math.SQRT1_2)
  if (i > 0 && j < L) setupNeighbor(i - 1, j + 1, 0.5 * Math.SQRT1_2)
  if (i > 0 && j > 0) setupNeighbor(i - 1, j - 1, 0.5 * Math.SQRT1_2)
}))

function update () {
  spreadRedBlue()
  range(50).forEach(() => spreadGreen())
  grow()
}

function spreadRedBlue () {
  edges.forEach(edge => {
    edge.g0 = edge.from.g
    edge.b0 = edge.from.b
    edge.r0 = edge.from.r
    edge.g1 = edge.to.g
    edge.b1 = edge.to.b
    edge.r1 = edge.to.r
  })
  edges.forEach(edge => {
    const b0 = edge.b0
    const r0 = edge.r0
    const b1 = edge.b1
    const r1 = edge.r1
    const w = edge.w
    const blueResistance = 7
    const redResistance = 7
    const bluePressure = b0 * (b0 > r1)
    const redPressure = r0 * (r0 > b1)
    const blueFlow = bluePressure / blueResistance
    const redFlow = redPressure / redResistance
    edge.from.b -= dt * w * blueFlow
    edge.to.b += dt * w * blueFlow
    edge.from.r -= dt * w * redFlow
    edge.to.r += dt * w * redFlow
  })
  nodes.forEach(node => {
    node.r = clamp(0, 1, node.r)
    node.b = clamp(0, 1, node.b)
  })
}

function spreadGreen () {
  edges.forEach(edge => {
    edge.g0 = edge.from.g
    edge.b0 = edge.from.b
    edge.r0 = edge.from.r
    edge.g1 = edge.to.g
    edge.b1 = edge.to.b
    edge.r1 = edge.to.r
  })
  edges.forEach(edge => {
    const g0 = edge.g0
    const b0 = edge.b0
    const r0 = edge.r0
    const b1 = edge.b1
    const r1 = edge.r1
    const w = edge.w
    const greenResistance = 1 + 1000 * (r0 * b1 + b0 * r1)
    const greenPressure = g0
    const greenFlow = greenPressure / greenResistance
    edge.from.g -= dt * w * greenFlow
    edge.to.g += dt * w * greenFlow
  })
  nodes.forEach(node => {
    node.g = clamp(0, 1, node.g)
  })
}

function grow () {
  nodes.forEach(node => {
    const lowGreen = (node.g < 0.1)
    const highRedBlue = (node.r + node.b > 0.75)
    const lowRedBlue = (node.r + node.b < 0.25)
    node.dg = 0.8 * lowRedBlue - 0.07 * highRedBlue
    node.db = 2 * node.b * node.b * (node.b - node.r) - 2.2 * lowGreen
    node.dr = 2 * node.r * node.r * (node.r - node.b) - 2.2 * lowGreen
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
  node.g = Math.random()
  node.b = Math.random() < 0.01 ? 1 : 0
  node.r = Math.random() < 0.01 ? 1 : 0
})

export default { N, dt, nodes, update }
