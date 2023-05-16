import server from './server.js'
import state from './state.js'

const dt = state.dt
const updateInterval = dt
const N = state.N
const nodes = state.nodes

const io = server.start(() => {
  console.log('Server started')
  setInterval(update, updateInterval * 1000)
})

io.on('connection', socket => {
  console.log('connection:', socket.id)
  const id = socket.id
  const msg = { N, id, nodes }
  socket.emit('connected', msg)
})

function update () {
  state.update()
  updateClients()
}

function updateClients () {
  const nodeStates = nodes.map(node => ({
    r: node.r,
    g: node.g,
    b: node.b
  }))
  const msg = { nodeStates }
  io.emit('updateClients', msg)
}
