import http from 'node:http'
import { index, usuarios, exportCsv} from './controller.js'


const server = http.createServer((request, response) => {
    const url = request.url
    const method = request.method


    if(method === 'GET'){

        switch (url) {
            
            case '/':
                index(request, response)
                break;

            case '/api/usuarios':
                usuarios(request, response)
                break;

            case '/api/usuarios/export':
                exportCsv(request, response)
                break;

            case '/api/usuarios/import':
                exportCsv(request, response)
                break;
    
            default: response.writeHead(400, { 'Content-Type': 'text/plain, utf-8'})
                     response.end('No se encontro la ruta')
                 break;
    }}
})

server.listen(3010)
console.log('Server http://localhost:3010/ Ok')