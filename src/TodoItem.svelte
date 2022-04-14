<script>
    export let todoItems;
    $: item = todoItems[index];

    export let index;
    export let toggleItem;

    let onchange = _ => {
        toggleItem(index);
    };
</script>

<main>
    <li>
        {item.name}
        <input type="checkbox" checked={item.done} on:change={onchange} aria-label="If the task has been completed or not. Tick it when it's done" />
    </li>
</main>

<style>
    li {
        font-size: 2vw;
        width: fit-content;
        height: fit-content;
        margin: 0px;
    }

    input {
        width: 0.75em;
        height: 0.75em;
        margin-top: 0px;
    }
</style>