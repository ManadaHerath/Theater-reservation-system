import expresss from 'express';
import { verifyToken, verifyUser} from '../util/verify_token.js';

const router = expresss.Router();

router.get("/checkAuthentication",verifyToken,(req,res,next)=>{
    res.send("Authenticated Bro!")

})

router.get("/:id",verifyUser,(req,res,next)=>{
    res.send("User Bro!")
})

router.delete("/:id",verifyToken,(req,res,next)=>{
    res.send("Deleted Bro!")
})

router.put("/:id",verifyToken,(req,res,next)=>{
    res.send("Updated Bro!")
}
)



export default router;