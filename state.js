import { range } from './utility.js'

function create (N) {
  const grid = range(N).map(i => range(N).map(j => {
    const node = {
      g: Math.random(),
      b: Math.random(),
      r: Math.random(),
      x: j,
      y: i,
      selected: { 1: false, 2: false }
    }
    node.neighbors = []
    return node
  }))
  const nodes = grid.flat()
  nodes.forEach((node, index) => {
    node.id = index
  })
  const neighbors = nodes.map(node => [])
  range(N).forEach(i => range(N).forEach(j => {
    const id = grid[i][j].id
    const L = N - 1
    if (i < L) neighbors[id].push(grid[i + 1][j])
    if (i > 0) neighbors[id].push(grid[i - 1][j])
    if (j < L) neighbors[id].push(grid[i][j + 1])
    if (j > 0) neighbors[id].push(grid[i][j - 1])
    if (i < L && j < L) neighbors[id].push(grid[i + 1][j + 1])
    if (i < L && j > 0) neighbors[id].push(grid[i + 1][j - 1])
    if (i > 0 && j < L) neighbors[id].push(grid[i - 1][j + 1])
    if (i > 0 && j > 0) neighbors[id].push(grid[i - 1][j - 1])
  }))
  return { grid, nodes, neighbors }
}

export default { create }
