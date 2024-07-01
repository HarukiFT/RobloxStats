export default (data) => {
    if (data.length == 0) { return false }
    if (!data[0]['Unique Users with Plays']) { return false }

    return true
}