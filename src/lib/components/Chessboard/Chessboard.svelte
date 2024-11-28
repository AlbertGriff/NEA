<script>
    import { Board } from "./chessUtilities"

    import wPawn from "./svg/white/wPawn.svelte"
    import wRook from "./svg/white/wRook.svelte"
    import wKnight from "./svg/white/wKnight.svelte"
    import wBishop from "./svg/white/wBishop.svelte"
    import wQueen from "./svg/white/wQueen.svelte"
    import wKing from "./svg/white/wKing.svelte"

    import bPawn from "./svg/black/bPawn.svelte"
    import bRook from "./svg/black/bRook.svelte"
    import bKnight from "./svg/black/bKnight.svelte"
    import bBishop from "./svg/black/bBishop.svelte"
    import bQueen from "./svg/black/bQueen.svelte"
    import bKing from "./svg/black/bKing.svelte"


    const getTileColour = (row, col) => {
        return (row + col) % 2 === 0 ? "white" : "black"
    }


    let startPosition = null
    function handleDragStart(event, rowIdx, colIdx) {
        startPosition = [rowIdx, colIdx]
        event.dataTransfer.setData("text/plain", JSON.stringify(startPosition))
    }
    
    function handleDrop(event, rowIdx, colIdx) {
        const endPosition = [rowIdx, colIdx]
        const startPosition = JSON.parse(event.dataTransfer.getData("text/plain"))
        Board.movePiece(startPosition, endPosition)
        Board.tiles = [...Board.tiles]
    }

</script>

<table>
    {#each Board.tiles as row, rowIdx}
        <tr>
            {#each row as tile, colIdx}
                <td 
                    class={getTileColour(rowIdx, colIdx)}
                    on:dragover={(event) => event.preventDefault()}
                    on:drop={(event) => handleDrop(event, rowIdx, colIdx)}
                >
                    {#if tile}
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div 
                            class={"piece__container " + (tile.colour === "w" ? "white" : "black")}
                            draggable = "true"
                            on:dragstart={(event) => handleDragStart(event, rowIdx, colIdx)}
                        >
                            {#if tile.type === "P"}
                                {#if tile.colour === "w"}
                                    <wPawn/> 
                                {:else}
                                    <bPawn/>
                                {/if}
                            {:else if tile.type === "R"}
                                {#if tile.colour === "w"}
                                    <wRook/> 
                                {:else}
                                    <bRook/>
                                {/if}
                            {:else if tile.type === "N"}
                                {#if tile.colour === "w"}
                                    <wKnight/> 
                                {:else}
                                    <bKnight/>
                                {/if}
                            {:else if tile.type === "B"}
                                {#if tile.colour === "w"}
                                    <wBishop/> 
                                {:else}
                                    <bBishop/>
                                {/if}
                            {:else if tile.type === "Q"}
                                {#if tile.colour === "w"}
                                    <wQueen/> 
                                {:else}
                                    <bQueen/>
                                {/if}
                            {:else if tile.type === "K"}
                                {#if tile.colour === "w"}
                                    <wKing/> 
                                {:else}
                                    <bKing/>
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