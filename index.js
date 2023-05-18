import server from './server.js'
import state from './state.js'

const updateInterval = 0.1
const N = state.N

const io = server.start(() => {
  console.log('Server started')
  setInterval(update, updateInterval * 1000)
})

io.on('connection', socket => {
  console.log('connection:', socket.id)
  const id = socket.id
  const nodes = state.nodes.map(node => ({
    r: node.r,
    g: node.g,
    b: node.b,
    x: node.x,
    y: node.y
  }))
  const msg = { N, id, nodes }
  socket.emit('connected', msg)
})

function update () {
  state.update()
  updateClients()
}

function updateClients () {
  const nodes = state.nodes.map(node => ({
    r: node.r,
    g: node.g,
    b: node.b
  }))
  const msg = { nodes }
  io.emit('updateClients', msg)
}
