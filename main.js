import './style.css'

// 1. inicializar canvas
const textGameOver = document.getElementById('game_over')
const container = document.querySelector('.content_canvas')
const points = document.querySelector('.points')
const canvas = document.querySelector('canvas')
const button = document.querySelector('button')
const context = canvas.getContext('2d')

const BLOCK_SIZE = 25
const BOARD_WIDTH = 18
const BOARD_HEIGHT = 30
let score = 0
points.innerHTML = score

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT
context.scale(BLOCK_SIZE, BLOCK_SIZE)

let board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)

function createBoard (width, height) {
  return Array(height).fill().map(() => Array(width).fill(0))
}

// 2. Piezas del jugador
const piece = {
  position: { x: 0, y: 0 },
  shape: [
    [1, 1],
    [1, 1]
  ],
  color: 'green'
}

const colores = [
  'red',
  'yellow',
  'blue',
  'green',
  'tomato',
  'chocolate',
  'lime'
]

const PIECES = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 0, 1],
    [1, 1, 1]
  ],
  [
    [1, 0, 0],
    [1, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ]
]

// 3. Dibujar
let dropCounter = 0
let lastTime = 0
let loopAnimation
function update (time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime
  if (dropCounter > 1000) {
    moveDown()
    dropCounter = 0
  }
  draw()
  loopAnimation = window.requestAnimationFrame(update)
}

function draw () {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.height, canvas.height)
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 2) {
        context.fillStyle = 'purple'
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = piece.color
        context.fillRect(
          x + piece.position.x,
          y + piece.position.y,
          1,
          1
        )
      }
    })
  })
}

update()

// 4. Mover la pieza
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    piece.position.x--

    if (checkColition()) {
      piece.position.x++
    }
  }
  if (e.key === 'ArrowRight') {
    piece.position.x++
    if (checkColition()) {
      piece.position.x--
    }
  }
  if (e.key === 'ArrowDown') {
    moveDown()
  }

  // rotar
  if (e.key === 'ArrowUp') {
    const rotation = []

    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = []
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i])
      }
      rotation.push(row)
    }

    const len = rotation[0].length
    let positionX = piece.position.x
    const exceso = BOARD_WIDTH - positionX - len
    if (exceso < 0) {
      positionX = BOARD_WIDTH - len
    }
    piece.position.x = positionX
    piece.shape = rotation
  }
})

function moveDown () {
  piece.position.y++
  if (checkColition()) {
    piece.position.y--
    solidifyPiece()
    removeRows()
    checkGameOver()
  }
}

function checkColition () {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

function solidifyPiece () {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        const file = board[y + piece.position.y].map(i => i)
        file[x + piece.position.x] = 2
        board[y + piece.position.y] = file
      }
    })
  })

  const random = Math.floor(Math.random() * 7)
  piece.shape = PIECES[random]
  piece.color = colores[random]

  const len = PIECES[random][0].length
  let positionX = Math.floor(Math.random() * BOARD_WIDTH)
  const exceso = BOARD_WIDTH - positionX - len
  if (exceso < 0) {
    positionX = BOARD_WIDTH - len
  }
  piece.position.x = positionX
  piece.position.y = 0
}

function removeRows () {
  const rowToRemove = []
  board.forEach((row, i) => {
    if (row.every(v => v === 2)) {
      rowToRemove.push(i)
    }
  })

  rowToRemove.forEach(i => {
    board.splice(i, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score++
    points.innerHTML = score
  })
}

function checkGameOver () {
  if (checkColition()) {
    textGameOver.style.display = 'block'
    container.style.backgroundColor = '#af3131'
    window.cancelAnimationFrame(loopAnimation)
  }
}

button.addEventListener('click', () => {
  board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)
  score = 0
  piece.position.y = 0
})
