import { Router } from "express";
const router = Router()

router.get('/test', (req, res) => {
    res.send('auth router is working')
})

export default router