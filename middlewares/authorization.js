import jwt from 'jsonwebtoken';

export function getAssistantId(bearerHeader) {
    return bearerHeader.split(" ")[1].split("__")[1];
}

export function getToken(bearerHeader) {
    if (!bearerHeader.includes("__")) return bearerHeader;
    const token = bearerHeader.split(" ")[1].split("__")[0].split("").reverse().join("")
    return token;
}

export async function auth(req, res, next) {

    // authorizations code is in the format
    // Bearer <reversed(accesstoken)>__<assistant>

    //verify bearer token
    const bearerHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (bearerHeader) {

        //e.g Bearer ADFKNADLFNAJDFN
        const token = bearerHeader.split(" ")[1].split("__")[0].split("").reverse().join("")
        const assistantId = bearerHeader.split(" ")[1].split("__")[1]
        const key = process.env.ACCESS_TOKEN_SECRET;

        jwt.verify(token, key, (err, decoded) => {

            //if fields exists 
            if (decoded) {

                if (!decoded.uid) {
                    console.error("Decoded token missing 'uid': ", decoded)
                    return res.status(403).json({ message: "Unauthorized: User ID not found" });
                }
                req.user = decoded; //{email, cid, uid}
                req.user.assistantId = assistantId;
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