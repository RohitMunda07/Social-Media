export const addChangeLog = async (user, field, oldValue, newValue) => {
    if (user.changesHistory.length > 20) {
        user.changesHistory.shift();
    }

    user.changesHistory.push({
        field,
        oldValue,
        newValue,
        updatedAt: new Date()
    })
}