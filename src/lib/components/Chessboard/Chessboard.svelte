<script>
    import { Board } from "./chessUtilities"

    import Pawn from "./svg/pawn.svelte"
    import Rook from "./svg/rook.svelte"
    import Knight from "./svg/knight.svelte"
    import Bishop from "./svg/bishop.svelte"
    import Queen from "./svg/queen.svelte"
    import King from "./svg/king.svelte"


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
                                <Pawn/> 
                            {:else if tile.type === "R"}
                                <Rook/>
                            {:else if tile.type === "N"}
                                <Knight/>
                            {:else if tile.type === "B"}
                                <Bishop/>
                            {:else if tile.type === "Q"}
                                <Queen/>
                            {:else if tile.type === "K"}
                                <King/>
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
    .piece__container.white > :global(svg .colour) {
        stroke: var(--p-black);
        fill: var(--p-white);
    }
    .piece__container.black > :global(svg .colour) {
        stroke: var(--p-white);
        fill: var(--p-black);
    }
</style>