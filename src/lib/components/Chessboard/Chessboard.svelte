<script>
    import { Board } from "./chessUtilities"
    import { getValidMoves } from "./chessUtilities"

    import WPawn from "./svg/white/wPawn.svelte"
    import WRook from "./svg/white/wRook.svelte"
    import WKnight from "./svg/white/wKnight.svelte"
    import WBishop from "./svg/white/wBishop.svelte"
    import WQueen from "./svg/white/wQueen.svelte"
    import WKing from "./svg/white/wKing.svelte"

    import BPawn from "./svg/black/bPawn.svelte"
    import BRook from "./svg/black/bRook.svelte"
    import BKnight from "./svg/black/bKnight.svelte"
    import BBishop from "./svg/black/bBishop.svelte"
    import BQueen from "./svg/black/bQueen.svelte"
    import BKing from "./svg/black/bKing.svelte"


    const getTileColour = (row, col) => {
        return (row + col) % 2 === 0 ? "white" : "black"
    }

    let highlightedTiles = []
    let startPosition = null
    function handleDragStart(event, rowIdx, colIdx) {
        // Saves the piece which is being dragged
        startPosition = [rowIdx, colIdx]
        event.dataTransfer.setData("text/plain", JSON.stringify(startPosition))
        // Records the valid moves 
        console.log("Checking valid moves")
        const validMoves = getValidMoves([rowIdx, colIdx], Board)
        highlightedTiles = validMoves
        console.log(highlightedTiles)
    }
    
    function handleDrop(event, rowIdx, colIdx) {
        const endPosition = [rowIdx, colIdx]
        const startPosition = JSON.parse(event.dataTransfer.getData("text/plain"))
        Board.movePiece(startPosition, endPosition)
        highlightedTiles = []
        Board.tiles = [...Board.tiles]

    }

    function takeBackMove() {
        Board.takeBack()
        Board.tiles = [...Board.tiles]
    }

</script>

<div class="controls">
    <button on:click={takeBackMove}>
        Take back previous move
    </button>
</div>


<table>
    {#each Board.tiles as row, rowIdx}
        <tr>
            {#each row as tile, colIdx}
                <td 
                    class={getTileColour(rowIdx, colIdx)}
                    on:dragover={(event) => event.preventDefault()}
                    on:drop={(event) => handleDrop(event, rowIdx, colIdx)}
                >   
                    {#if highlightedTiles.some(([r, c]) => r === rowIdx && c === colIdx)}
                        <div class="highlight-circle"></div>
                    {/if}

                    {#if tile}
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div 
                            class={"piece__container " + (tile.colour === "w" ? "white" : "black")}
                            draggable = "true"
                            on:dragstart={(event) => handleDragStart(event, rowIdx, colIdx)}
                        >
                            {#if tile.type === "P"}
                                {#if tile.colour === "w"}
                                    <WPawn/> 
                                {:else}
                                    <BPawn/>
                                {/if}
                            {:else if tile.type === "R"}
                                {#if tile.colour === "w"}
                                    <WRook/> 
                                {:else}
                                    <BRook/>
                                {/if}
                            {:else if tile.type === "N"}
                                {#if tile.colour === "w"}
                                    <WKnight/> 
                                {:else}
                                    <BKnight/>
                                {/if}
                            {:else if tile.type === "B"}
                                {#if tile.colour === "w"}
                                    <WBishop/> 
                                {:else}
                                    <BBishop/>
                                {/if}
                            {:else if tile.type === "Q"}
                                {#if tile.colour === "w"}
                                    <WQueen/> 
                                {:else}
                                    <BQueen/>
                                {/if}
                            {:else if tile.type === "K"}
                                {#if tile.colour === "w"}
                                    <WKing/> 
                                {:else}
                                    <BKing/>
                                {/if}
                            {/if}
                        </div>
                    {/if}
                </td>
            {/each}
        </tr>
    {/each}
</table>

<style>
    .controls {
        margin-bottom: 10px;
    }
    .controls button {
        padding: 8px 12px;
        font-size: 50px;
        cursor: pointer;
        background-color: antiquewhite;
        color: black;
    }


    table {
        width: 100%;
        aspect-ratio: 1/1;
        
        border-spacing: 0;
        border-collapse: collapse;
    }

    td {
        width: 12.5%;
        aspect-ratio: 1/1;
    
        user-select: none;

        position: relative;
    }

    td.white {
        background-color: #6ab293;
    }
    td.black {
        background-color: #e8e8e8;
    }
    .highlight-circle {
        width: 50%;
        height: 50%;
        background-color: rgba(0,255,0,0.5);
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1;
    }
    td > * {
        position: absolute;
        inset: 0;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .piece__container {
        /* Modifies size of pieces */
        padding: 0%;
    }
    
    .piece__container > :global(svg) {
        width: 100%;
        height: 100%;
    }
</style>