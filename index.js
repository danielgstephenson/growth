import server from './server.js'
import state from './state.js'

const updateInterval = 0.1
const N = 50
let time = 0
const { grid, nodes, neighbors } = state.create()

const io = server.start(() => {
  console.log('Server started')
})

function update () {
  time = time + updateInterval
}
