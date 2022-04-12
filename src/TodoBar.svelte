<script>
	export let addItem;
	export let deleteCompleted;
    export let completedCount;
    export let taskCount;

    let text = "";

    const onAdd = _ => {
        addItem(text);
        text = "";
    };
</script>

<main>
    <input type="text" placeholder="What do you need to do?" bind:value={text} aria-label="The task you want to add to your to do list" />
    <button type="button" on:click={onAdd} disabled={text == ""}>Add</button>
    <button type="button" on:click={deleteCompleted} disabled={completedCount == 0}>Delete among us</button>

    <br>
    {taskCount - completedCount} tasks left
</main>