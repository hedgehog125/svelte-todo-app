export const findID = arr => {
    let id = 0;
    while (true) {
        if (! arr.some(value => value == id || value?.id == id)) {
            return id;
        }
        id++;
    }
};