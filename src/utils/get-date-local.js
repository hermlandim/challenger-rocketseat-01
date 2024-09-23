export function getDateLocal() {
    const date = new Date();
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
}