import express from "express"
const router = express.Router()

router.get('/',(req, res)=>{
    res.send('por construir 3')
})
router.post('/', (req, res)=>{
    res.send('por construir 4')
})
export default router