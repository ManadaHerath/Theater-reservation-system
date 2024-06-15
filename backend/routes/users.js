import expresss from 'express';
import { verifyToken, verifyUser,verifyAdmin} from '../util/verify_token.js';

const router = expresss.Router();

router.get("/checkAuthentication",verifyToken,(req,res,next)=>{
    res.send("Authenticated Bro!")

})

router.get("/checkUser/:id",verifyUser,(req,res,next)=>{
    res.send("User Bro!")
})

router.get("/checkAdmin/:id",verifyAdmin,(req,res,next)=>{
    res.send("Admin Bro!")
})


router.delete("/:id",verifyUser,(req,res,next)=>{
    res.send("Deleted Bro!")
})

router.put("/:id",verifyUser,(req,res,next)=>{
    res.send("Updated Bro!")
}
)



export default router;