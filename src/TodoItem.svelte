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