import { range } from './utility.js'

const N = 50
const dt = 0.1

const grid = range(N).map(i => range(N).map(j => {
  const node = {
    g: 1 * Math.random(),
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

range(N).forEach(i => range(N).forEach(j => {
  const node = grid[i][j]
  const L = N - 1
  function setupNeighbor (a, b) {
    const neighbor = grid[a][b]
    node.neighborIds.push(neighbor.id)
    if (node.id < neighbor.id) edges.push([node.id, neighbor.id])
  }
  if (i < L) setupNeighbor(i + 1, j)
  if (i > 0) setupNeighbor(i - 1, j)
  if (j < L) setupNeighbor(i, j + 1)
  if (j > 0) setupNeighbor(i, j - 1)
  if (i < L && j < L) setupNeighbor(i + 1, j + 1)
  if (i < L && j > 0) setupNeighbor(i + 1, j - 1)
  if (i > 0 && j < L) setupNeighbor(i - 1, j + 1)
  if (i > 0 && j > 0) setupNeighbor(i - 1, j - 1)
}))

function update () {
  nodes.forEach(node => {
    node.r2 = node.r
    node.g2 = node.g
    node.b2 = node.b
  })
  nodes.forEach(node => {
    const neighbors = node.neighborIds.map(neighborId => nodes[neighborId])
    neighbors.forEach(neighbor => {
      const targetDistance = 0.03
      const room = (node.g > 0) * (neighbor.g < 1)
      const farAbove = node.g > neighbor.g + targetDistance
      const nearBelow = node.g < neighbor.g && neighbor.g < node.g + targetDistance
      const distance = Math.abs(node.g - neighbor.g)
      const outFlow = 0.1 * dt * (1 * farAbove + 0 * nearBelow) * room * Math.abs(distance - targetDistance)
      neighbor.g2 += outFlow
      node.g2 -= outFlow
    })
  })
  /*
  edges.forEach(edge => {
    const node0 = nodes[edge[0]]
    const node1 = nodes[edge[1]]
    const flux = node1.g - node0.g
    node0.g2 += dt * diffuse * flux
    node1.g2 -= dt * diffuse * flux
  })
  */
  nodes.forEach(node => {
    node.r = node.r2
    node.g = node.g2
    node.b = node.b2
  })
}

export default { N, dt, nodes, update }
