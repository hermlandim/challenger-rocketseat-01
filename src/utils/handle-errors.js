export const handleErros = (res, { message, code }) => {
    return res.writeHead(code).end(JSON.stringify({ message }))
}