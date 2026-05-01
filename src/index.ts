import express from "express"
import ventas from './routes/ventas.routes.js'
import productos from './routes/productos.routes.js'
const app= express()
app.use(express.json())
const PORT = 3000
app.get('/ping', (req, res)=>{
    console.log('ping aqui!!')
    res.send('pong')
})
app.use('/ventas', ventas)
app.use('/productos', productos)
app.listen(PORT, ()=>{
    console.log(`server esta corriendo en el puerto ${PORT}`)
 
})