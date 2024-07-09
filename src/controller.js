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
            return `${usuario.ID},${usuario.NOMBRES},${usuario.APELLIDOS},${usuario.DIRECCION},${usuario.MAIL},${usuario.DNI},${usuario.EDAD},${usuario.CREACION},${usuario.TELEFONO}`}).join('\n')
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
        const ruta = path.resolve('./public/usuarios.csv')
        const contenido = (await fs.readFile (ruta, 'utf-8')).split('\n')
        const lineas = contenido.slice(1)


        for (const linea of lineas){
            const datos = linea.split(',')
        
            //No logro que esta partesirve, lo del ID lo maneje que la base solo lo pusiera ya que así lo estableci al crearla pero con estos dos, lo seguire intentando, hasta ahora no lo logre

           /*  const mailVerification = await pool.query('SELECT * FROM datos WHERE MAIL = ?', [datos[4]])
            const dniVerification = await pool.query('SELECT * FROM datos WHERE DNI = ?', [datos[5]])
            
            
            if (mailVerification) {
                console.log(`El mail ${datos[4]} ya existe en la base de datos`)
                continue
            }
            if (dniVerification){
                console.log(`El DNI ${datos[5]} ya existe en la base de datos`)
                continue
            } */


            const sql = `INSERT INTO datos (NOMBRES,APELLIDOS,DIRECCION,MAIL,DNI,EDAD,CREACION,TELEFONO)VALUES (?,?,?,?,?,?,?,?)`

            await pool.query(sql, [datos[1], datos[2], datos[3], datos[4], datos[5], datos[6], datos[7], datos[8]])
 
        }
        
        response.writeHead(200, {'Content-Type': 'application/JSON: charset=utf-8'})
        response.end(JSON.stringify({message: `Usuarios Exportados a base de datos`}))
    } catch (error) {
        console.error('Error al importar la tabla', error)
        response.writeHead(500, {'Content-Type': 'text/plain;'})
        response.end(JSON.stringify({message:'Error en el servidor'}))
     }
}   