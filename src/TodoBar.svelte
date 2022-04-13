<script>
	export let addItem;
	export let deleteCompleted;
    export let completedCount;
    export let taskCount;

    let text = "";
    $: textEmpty = text == "";
    $: left = taskCount - completedCount;

    const onAdd = _ => {
        addItem(text);
        text = "";
    };
</script>

<main>
    <div>
        <form on:submit|preventDefault={onAdd}>
            <input type="text" placeholder="What do you need to do?" bind:value={text} aria-label="The task you want to add to your to do list" />      
            <button type="submit" on:click={onAdd} disabled={textEmpty}>Add</button>
            <button type="button" on:click={deleteCompleted} disabled={completedCount == 0}>Delete completed</button>
        </form>
    
        <br>
        {left} task{left == 1? "" : "s"} left
    </div>
</main>

<style>
    input[type="text"] {
        width: 250px;
    }

    div {
        position: absolute;
        left: 50%;
        bottom: 0%;
        transform: translate(-50%);
        padding-bottom: 25px;
    }
</style>