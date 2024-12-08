import layouts from "./layouts.json" with { type: "json"}

const layout = layouts.testing



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
        
        const validMoves = getValidMoves([startRow, startCol], board)
        console.log(validMoves)
        const isValidMove = validMoves.some(([row, col]) => row === endRow && col === endCol)
        if (!isValidMove) {
            console.log("Invalid piece move")
            return false
        }
        

        // Moves the piece
        board.tiles[endRow][endCol] = { ...piece, position: [endRow, endCol] }
        board.tiles[startRow][startCol] = null
        console.log(`Moved piece ${piece.type} from [${startRow}, ${startCol}] to [${endRow}, ${endCol}]`);
        return true

    }

    return board
}

const getValidMoves = ([row, col], board) => {
    const piece = board.checkTile(row, col)
    switch (piece.type) {
        case "P": // Pawns
            return getPawnMoves([row, col], board)
        case "R": // Rooks
            const rookDirections = [
                [1,0],[-1,0],[0,1],[0,-1]
            ]
            const rookRepeated = true
            return calculateMoves([row, col], rookDirections, rookRepeated, board)
        case "N": // Knights
            const knightDirections = [
                [2,1],[2,-1],[-2,1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]
            ]
            const knightRepeated = false
            return calculateMoves([row, col], knightDirections, knightRepeated, board)
        case "B": // Bishops
            const bishopDirections = [
                [1,1],[-1,1],[1,-1],[-1,-1]
            ]
            const bishopRepeated = true
            return calculateMoves([row, col], bishopDirections, bishopRepeated, board)
        case "Q": // Queens
            const queenDirections = [
                [1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]
            ]
            const queenRepeated = true
            return calculateMoves([row, col], queenDirections, queenRepeated, board)
        case "K": // Kings
            const kingDirections = [
                [1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]
            ]
            const kingRepeated = false
            return calculateMoves([row, col], kingDirections, kingRepeated, board)
        default:
            return []
    }
}

const createPiece = (type, colour, position) => {
    return {
        type,
        colour,
        position,
    }
}

const Board = createBoard(layout)

const calculateMoves = (startPosition, directions, repeated, board) => {
    const [startRow, startCol] = startPosition
    const validMoves = []
    const pieceColour = board.checkTile(startRow,startCol).colour

    for (let direction of directions) {
        let [dirRow, dirCol] = direction
        let currentRow = startRow + dirRow
        let currentCol = startCol + dirCol

        while (currentRow >=0 && currentRow <= 7 && currentCol >= 0 && currentCol <= 7) {
            const targetPiece = board.checkTile(currentRow,currentCol)
            if (targetPiece) {
                if (targetPiece.colour !== pieceColour) {
                    validMoves.push([currentRow,currentCol])
                }
                break
            }
            validMoves.push([currentRow, currentCol])

            if (!repeated) {
                break
            }

            currentRow += dirRow
            currentCol += dirCol
        }
    }
    return validMoves
}

const chessUtilities = {
    createBoard, 
    Board,
    getValidMoves,
    calculateMoves
}

export default chessUtilities

export { createBoard, Board, getValidMoves, calculateMoves }