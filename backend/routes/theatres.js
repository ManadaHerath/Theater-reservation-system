import expresss from 'express';
import {connection} from '../index.js';
import {getTheatres,addTheatre, getTheatreById} from '../controllers/theatre.js';
import { verifyAdmin, verifyUser, verifyJWT} from '../util/verify_token.js';
import { verifyRoles } from '../util/verify_roles.js';

const router = expresss.Router();

router.get("/" ,verifyJWT,verifyRoles(['admin']), getTheatres);    //,verifyJWT,verifyRoles(['admin'])
router.post("/",verifyJWT , addTheatre)
router.get("/:id", getTheatreById);
export default router;