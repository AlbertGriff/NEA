import layouts from "./layouts.json"

const layout = layouts.default



const createBoard = (layout) => {
    const board = {} 

    const tiles = []
    for (let row = 0; row < 8; row++) {
        tiles[row] = []
        for (let col = 0; col < 8; col++) {
            tiles[row][col] = null
        }
    }    
    board.tiles = tiles
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (layout[row][col]) {
                board.tiles[row][col] = createPiece(...layout[row][col], [row, col])
            }
        }
    }


    board.checkTile = (row, col) => {
        return board.tiles[row][col]
    }

    return board
}

const createPiece = (type, colour, position) => {
    return {
        type,
        colour,
        position
    }
}


const Board = createBoard(layout)

const chessUtilities = {
    createBoard, 
    Board
}

export default chessUtilities

export { createBoard, Board }