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
    * {
        font-size: 2vw;
    }

    input[type="text"] {
        width: 250px;
    }

    input, button {
        margin-left: 10px;
        margin-right: 10px;
    }

    div {
        position: absolute;
        width: 90%;
        padding-left: 5%;
        top: 80%;
        bottom: 0%;
        justify-content: center;
        padding-bottom: 25px;
   }

    form {
        display: flex;
    }

    form > * {
        flex-grow: 0.3333333;
    }
</style>