<script>
    import TodoItem from "./TodoItem.svelte";

    export let todoItems, toggleItem;
</script>

<main>
    {#if todoItems.length == 0}
        You haven't got anything else left to do
    {:else}
        <ul>
            {#each todoItems as item, index (item.id)}
                <TodoItem {todoItems} {index} {toggleItem} />
            {/each}
        </ul>
    {/if}
</main>