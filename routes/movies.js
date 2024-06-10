import expresss from 'express';

const router = expresss.Router();

router.get("/",(req,res)=>{
    res.send("hello movies")
})

export default router;