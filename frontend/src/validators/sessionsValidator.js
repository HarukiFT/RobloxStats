export default (data) => {
    if (data.length == 0) { return false }
    if (!data[0].Sessions) { return false }

    return true
}