<script>
    const STORAGE_KEY = "todoItems";

    import TodoList from "./TodoList.svelte";
    import TodoBar from "./TodoBar.svelte";
    import RoundedBoxBackground from "./RoundedBoxBackground.svelte";

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
    <RoundedBoxBackground>

	<TodoList {todoItems} {toggleItem} />

    <br>
    <TodoBar {addItem} {deleteCompleted} completedCount={completed.length} taskCount={todoItems.length} />
    </RoundedBoxBackground>

</main>

<style>
    :global(*) {
        transition-property: all;
        transition-duration: 0.25s;
    }

    :global(html, body) {
        position: relative;
        width: 100%;
        height: 100%;
    }

    :global(body) {
        background-color: black;
        color: #EFEFEF;

        margin: 0;
        padding: 8px;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    :global(a) {
        color: rgb(0, 100, 200);
        text-decoration: none;
    }

    :global(a:hover) {
        text-decoration: underline;
    }

    :global(a:visited) {
        color: rgb(0, 80, 160);
    }

    :global(input, button, select, textarea) {
        font-family: inherit;
        font-size: inherit;
        padding: 0.4em;
        margin: 0 0 0.5em 0;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 7.5px;
    }

    :global(input:placeholder-shown) {
        position: relative;
    }

    :global(input::placeholder) {
        transition-property: all;
        transition-duration: 0.25s;
        
        position: absolute;
        left: 50%;
        transform: translate(-50%);
    }

    :global(input:placeholder-shown:focus::placeholder) {
        padding-left: 6.4px;
        left: 0%;
        transform: unset;
    }

    :global(input:disabled) {
        color: #ccc;
    }

    :global(button) {
        outline: none;
    }

    :global(button:enabled) {
        color: #EFEFEF;
        background-color: rgb(60, 60, 220);
    }

    :global(button:disabled) {
        color: #BBB;
    }

    :global(button:active) {
        background-color: #DDD;
    }

    :global(button:focus) {
        border-color: #666;
    }

    :global(li) {
        list-style-position: inside;
    }
</style>