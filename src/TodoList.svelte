<script>
    import TodoItem from "./TodoItem.svelte";

    export let todoItems, toggleItem;
</script>

<main>
    <div>
        {#if todoItems.length == 0}
            You haven't got anything else left to do
        {:else}
            <ul>
                {#each todoItems as item, index (item.id)}
                    <TodoItem {todoItems} {index} {toggleItem} />
                {/each}
            </ul>
        {/if}
    </div>
</main>

<style>
    div {
        position: absolute;
        left: 50%;
        top: 25px;
        transform: translate(-50%);
        padding: 0px;
        width: 90%;
        height: 80%;
    }

    div > * {
        margin: 0px;
    }

    ul {
        display: inline-block;
        padding: 0px;
        width: fit-content;
        height: fit-content;
    }
</style>