import jwt from 'jsonwebtoken';

export async function auth(req, res, next) {

    //verify bearer token
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {

        //e.g Bearer ADFKNADLFNAJDFN
        const token = bearerHeader.split(' ')[1];
        const key = process.env.ACCESS_TOKEN_SECRET;

        jwt.verify(token, key, (err, decoded) => {

            //if fields exists 
            if (decoded) {

                if (!decoded.uid) {
                    console.error("Decoded token missing 'uid': ", decoded)
                    return res.status(403).json({ message: "Unauthorized: User ID not found" });
                }
                req.user = decoded; //{email, cid, uid}
                req.token = token;
                //call next middleware
                return next();
            } else {
                console.error('Not Authorized: ' + token)
                return res.sendStatus(403);
            }
        });
    } else {
        console.error('No Token')
        return res.sendStatus(403);
    }
}