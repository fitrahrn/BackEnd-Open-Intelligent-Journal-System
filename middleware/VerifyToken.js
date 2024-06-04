import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, "f3m8r2y7y847nrm9843n6xc94cm83x4mo437", (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.email = decoded.email;
        next();
    })
}