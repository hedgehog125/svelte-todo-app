<script>
    import TodoItem from "./TodoItem.svelte";

    export let todoItems, toggleItem;
</script>

<main>
    <ul>
        {#each todoItems as item, index (item.id)}
            <TodoItem {todoItems} {index} {toggleItem} />
        {/each}
    </ul>
</main>