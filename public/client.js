/* global OffscreenCanvas */

import { io } from './socketIo/socket.io.esm.min.js'
const socket = io()

export function range (n) { return [...Array(n).keys()] }

const canvas1 = document.getElementById('canvas')
const context1 = canvas1.getContext('2d')
context1.imageSmoothingEnabled = false
const camera = {
  scale: 1,
  zoom: 0,
  x: 0,
  y: 0
}
let id = ''
let N = 10
let nodes = []
let canvas0 = new OffscreenCanvas(N, N)
let context0 = canvas0.getContext('2d')
let msgLog = {}
context0.imageSmoothingEnabled = false

socket.on('connected', msg => {
  id = msg.id
  N = msg.N
  nodes = msg.nodes
  canvas0 = new OffscreenCanvas(N, N)
  context0 = canvas0.getContext('2d')
  context0.imageSmoothingEnabled = false
  console.log('id:', id)
  console.log('N:', N)
  console.log('nodes:', nodes)
})

socket.on('updateClients', msg => {
  msgLog = msg
  msg.nodes.forEach((node, i) => {
    nodes[i].r = node.r
    nodes[i].g = node.g
    nodes[i].b = node.b
  })
})

function setupCanvas () {
  const canvasSize = 1 * Math.min(window.innerHeight, window.innerWidth)
  canvas1.width = canvasSize
  canvas1.height = canvasSize
  const xTranslate = 0
  const yTranslate = 0
  const xScale = canvasSize / 100
  const yScale = canvasSize / 100
  context1.setTransform(xScale, 0, 0, yScale, xTranslate, yTranslate)
  context1.imageSmoothingEnabled = false
}

function drawState () {
  const imageData = context0.createImageData(N, N)
  range(N * N).forEach(i => {
    const node = nodes[i]
    if (node) {
      imageData.data[i * 4 + 0] = 255 * node.r
      imageData.data[i * 4 + 1] = 255 * node.g
      imageData.data[i * 4 + 2] = 255 * node.b
      imageData.data[i * 4 + 3] = 255
    }
  })
  context0.putImageData(imageData, 0, 0)
  context1.clearRect(0, 0, 100, 100)
  const w = 100 * camera.scale
  const h = 100 * camera.scale
  context1.drawImage(canvas0, -camera.x, -camera.y, w, h)
}

function draw () {
  setupCanvas()
  drawState()
  window.requestAnimationFrame(draw)
}

draw()

document.onmousedown = function (event) {
  console.log(msgLog)
}
