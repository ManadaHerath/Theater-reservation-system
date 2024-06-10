import expresss from 'express';

const router = expresss.Router();

router.get('/', (req, res) => {
    res.send("auth")
})

export default router;