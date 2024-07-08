import fs from 'node:fs/promises'
import { pool } from './db.js'
import path from 'node:path'


export const index = async(request, response) => {
    try {
        const ruta = path.resolve('./public/main.html')
        const datos = await fs.readFile(ruta, 'utf-8')

        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        response.end(datos)
    } catch (error) {
        console.error('Error al leer el archivo', error)
        response.writeHead(500, {'Content-Type': 'text/plain;'})
        response.end('Error en el servidor')
    }
}

export const usuarios = async(request, response) => {
    try {
        const usuarios = await pool.query("SELECT * FROM datos")

        response.writeHead(200, {'Content-Type': 'application/JSON; charset=utf-8'})
        response.end(JSON.stringify(usuarios[0]))
    } catch (error) {
        console.error('Error al extraer la tabla', error)
        response.writeHead(500, {'Content-Type': 'text/plain;'})    
        response.end(JSON.stringify({message:'Error en el servidor'}))
    }
}

export const exportCsv = async(request, response) => {
    try {
        const usuarios = await pool.query("SELECT * FROM datos")
        const cabecera = 'ID,NOMBRES,APELLIDOS,DIRECCION,MAIL,DNI,EDAD,CREACION,TELEFONO\n'
        const lineas = usuarios[0].map(usuario => {
            console.log(usuario)
            return `${usuario.ID},"${usuario.NOMBRES}","${usuario.APELLIOS}","${usuario.DIRECCION}","${usuario.MAIL}",${usuario.DNI},${usuario.EDAD},"${usuario.CREACION}",${usuario.TELEFONO}`}).join('\n')
        const ruta = path.resolve('./public/usuarios.csv')

        await fs.writeFile(ruta, cabecera + lineas, 'utf-8')
        
        response.writeHead(200, {'Content-Type': 'application/JSON: charset=utf-8'})
        response.end(JSON.stringify({ message: `Usuarios exportados a ${ruta}`}))
    } catch (error) {
        console.error('Error al extraer la tabla', error)
        response.writeHead(500, {'Content-Type': 'text/plain;'})    
        response.end(JSON.stringify({message:'Error en el servidor'}))
        
    }
}

export const importCsv = async(request, response) => {
    try {
        const ruta = path.resolve('./public/usuarios.txt')
        const contenido = (await fs.readFile (ruta, 'utf-8')).split('\n')
        const cabecera = contenido[0].split(',')
        const lineas = contenido.slice(1)

        console.log('Número de líneas a procesar:', cabecera)

        for (const linea of lineas){
            const datos = linea.split(',')
            const sql = `INSERT INTO datos(ID,NOMBRES,APELLIDOS,DIRECCION,MAIL,DNI,EDAD,CREACION,TELEFONO)VALUES (?,?,?,?,?,?,?,?,?)`

            await pool.query(sql, datos)
 
            /* await pool.query(INSERT INTO datos(`${cabecera[0]},${cabecera[1]},${cabecera[2]},${cabecera[3]},${cabecera[4]},${cabecera[5]},${cabecera[6]},${cabecera[7]},${cabecera[8]} VALUES (?,?,?,?,?,?,?,?,?)`, dato )) */
        }
        
        response.writeHead(200, {'Content-Type': 'application/JSON: charset=utf-8'})
        response.end(JSON.stringify({message: `Usuarios importados a ${ruta}`}))
    } catch (error) {
        console.error('Error al importar la tabla', error)
        response.writeHead(500, {'Content-Type': 'text/plain;'})
        response.end(JSON.stringify({message:'Error en el servidor'}))
     }
}   