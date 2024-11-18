import layouts from "./layouts.json" with { type: "json"}

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


    board.movePiece = (startPos, endPos) => {
        const [startRow, startCol] = startPos
        const [endRow, endCol] = endPos

        const piece = board.tiles[startRow][startCol]


        // Checks if the square is occupied
        if (!piece) {
            console.log("Empty square")
            return false
        }

        // Checks to see if the target tile is the same as the current tile
        if (startRow === endRow && startCol === endCol) {
            console.log("Start and end positions are the same")
            return false
        }

        // Checks to see if the tile is occupied by a piece of the same colour
        const targetTile = board.tiles[endRow][endCol]
        if (targetTile && targetTile.colour === piece.colour) {
            console.log("Piece captures piece of same colour")
            return false
        }

        // TODO: additional move validation for each piece

        // Moves the piece
        board.tiles[endRow][endCol] = { ...piece, position: [endRow, endCol] }
        board.tiles[startRow][startCol] = null
        console.log(`Moved piece ${piece.type} from [${startRow}, ${startCol}] to [${endRow}, ${endCol}]`);
        return true

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

Board.movePiece([6, 4], [5, 4])
Board.movePiece([5, 4], [4, 4])
