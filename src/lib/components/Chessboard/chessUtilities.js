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
    
    board.currentTurn = "w"

    board.moves = []


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
    
    board.takeBack = () => {
        if (board.moves.length === 0) {
            console.log("No moves")
            return false
        }
        const previousMove = board.moves.pop()
        const {piece, from, to, capture} = previousMove

        const [startRow, startCol] = from
        const [endRow, endCol] = to
        board.tiles[startRow][startCol] = { ...piece, position: from }
        if (capture) {
            board.tiles[endRow][endCol] = { ...capture, position: to}
        } else {
            board.tiles[endRow][endCol] = null
        }
        

        board.currentTurn = piece.colour
        return true
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
        // Checks to see which players turn it is
        if (board.currentTurn !== piece.colour) {
            console.log("Wrong players turn")
            return false
        }


        const validMoves = getValidMoves([startRow, startCol], board)
        console.log(validMoves)
        const isValidMove = validMoves.some(([row, col]) => row === endRow && col === endCol)
        if (!isValidMove) {
            console.log("Invalid piece move")
            return false
        }
        
        const moveInfo = {
            piece: piece,
            from: startPos,
            to: endPos,
            capture: targetTile,
        }
        board.moves.push(moveInfo)
        console.log(moveInfo)

        // Moves the piece
        board.tiles[endRow][endCol] = { ...piece, position: [endRow, endCol] }
        board.tiles[startRow][startCol] = null
        console.log(`Moved piece ${piece.type} from [${startRow}, ${startCol}] to [${endRow}, ${endCol}]`)
        if (board.currentTurn === "w") {
            board.currentTurn = "b"
        } else {
            board.currentTurn = "w"
        }

        return true

    }

    return board
}

const getValidMoves = ([row, col], board) => {
    const piece = board.checkTile(row, col)
    var directions = []
    var repeated = false
    switch (piece.type) {
        case "P": // Pawns
            return getPawnMoves([row, col], board)
        case "R": // Rooks
            directions = [
                [1,0],[-1,0],[0,1],[0,-1]
            ]
            repeated = true
            return calculateMoves([row, col], directions, repeated, board)
        case "N": // Knights
            directions = [
                [2,1],[2,-1],[-2,1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]
            ]
            repeated = false
            return calculateMoves([row, col], directions, repeated, board)
        case "B": // Bishops
            directions = [
                [1,1],[-1,1],[1,-1],[-1,-1]
            ]
            repeated = true
            return calculateMoves([row, col], directions, repeated, board)
        case "Q": // Queens
            directions = [
                [1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]
            ]
            repeated = true
            return calculateMoves([row, col], directions, repeated, board)
        case "K": // Kings
            directions = [
                [1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]
            ]
            repeated = false
            return calculateMoves([row, col], directions, repeated, board)
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
        let currentCol = startCol+ dirCol

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

const getPawnMoves = (startPosition, board) => {
    const [startRow, startCol] = startPosition
    const validMoves = []
    const pawn = board.checkTile(startRow, startCol)
    
    const direction = pawn.colour === "w" ? -1 : 1
    const startRank = pawn.colour === "w" ? 6 : 1
    // single forward moves
    let currentRow = startRow + direction
    let targetPiece = board.checkTile(currentRow, startCol)
    if (currentRow >=0 && currentRow <= 7 && !targetPiece) {
        validMoves.push([currentRow, startCol])
        // double forward moves
        if (startRow === startRank && !targetPiece) {
            currentRow += direction
            targetPiece = board.checkTile(currentRow, startCol)
            if (!targetPiece) {
                validMoves.push([currentRow, startCol])
            }
        }
    }
    // pawn attacks
    const attackDirections = [
        [direction, 1], [direction, -1]
    ]
    for (let attackDirection of attackDirections) {
        let [attackRow, attackCol] = attackDirection
        const captureRow = startRow + attackRow
        const captureCol = startCol + attackCol

        if (captureRow >=0 && captureRow <= 7 && captureCol >= 0 && captureCol <= 7) {
            const targetPiece = board.checkTile(captureRow, captureCol)
            if (targetPiece && targetPiece.colour !== pawn.colour) {
                validMoves.push([captureRow, captureCol])
            }
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