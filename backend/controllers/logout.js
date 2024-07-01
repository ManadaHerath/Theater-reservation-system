import { connection } from "../index.js";


export const handleLogout = async (req, res) => {



    const cookies = req.cookies;



    if (!cookies?.access_token) return res.sendStatus(204); // No Content

    const refreshToken = cookies.access_token;

// Find the user with the given refreshToken

    try {
        const [rows] = await connection.query(
            'SELECT * FROM users WHERE refresh_token = ?',
            [refreshToken]
        );


        if (rows.length === 0) {
            
            res.clearCookie("access_token", {httpOnly: true}).sendStatus(204);
        };

        const userId = rows[0].id;
        await connection.query(
            'UPDATE users SET refresh_token = NULL WHERE id = ?',
            [userId]
        );

        res.clearCookie("access_token", {httpOnly: true, sameSite: 'Strickt', secure: true}).sendStatus(204);

        
    
    } catch (error) {
        console.error("Error Logging Out:", error);
        res.sendStatus(500);
    }
}

    






  
     