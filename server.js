import http from 'node:http'
import { routes } from './src/routes/routes.js';
import { json } from './src/middlewares/json.js';
import { extractQueryParams } from './src/utils/extract-query-params.js';

const server = http.createServer(async (req, res) => {

    await json(req, res)

    const { method, url } = req
    
    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
      })

    if (route) {
        const routeParams = req.url.match(route.path)

        const { query, ...params } = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)
    }

    return res.writeHead(404).end('Route not found')
})

const PORT = 3000

server.listen(PORT, () => {
    console.log(`server is running in port ${PORT}`)
})