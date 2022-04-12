<script>
    const STORAGE_KEY = "todoItems";

    import TodoItem from "./TodoItem.svelte";
    import TodoBar from "./TodoBar.svelte";
    import {findID} from "./Helper.js";
    
    let todoItems = JSON.parse(localStorage.getItem(STORAGE_KEY))?? [];
    $: completed = todoItems.filter(item => item.done);
    $: {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todoItems));
    }

    const addItem = item => {
        todoItems.push({
            name: item,
            done: false,
            id: findID(todoItems)
        });
        todoItems = todoItems;
    };
    const deleteCompleted = _ => {
        todoItems = todoItems.filter(item => ! item.done);
    };

    const toggleItem = index => {
        let item = todoItems[index];
        todoItems[index] = {
            ...item,
            done: ! item.done
        };
    };

</script>

<main>
	{#each todoItems as item, index (item.id)}
        <TodoItem {todoItems} {index} {toggleItem} />
    {/each}

    <TodoBar {addItem} {deleteCompleted} completedCount={completed.length} taskCount={todoItems.length} />
</main>

<style>
</style>