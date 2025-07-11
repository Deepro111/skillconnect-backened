import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    console.log('token', token);
    

    if(!token){
        return res.json({success: false, message: "Not Authorised, login again"})
    }

    // console.log('token', token);
    

    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        // console.log('token Decoded -> ', tokenDecode);
        // console.log('token Decoded-id -> ', tokenDecode.id);
        
        // console.log('tokenDecode', tokenDecode);
        
        if(tokenDecode.id){
            req.userId = tokenDecode.id
            next();
        }
        else{
            return res.json({success: false, message: "Not Authorised, login again"})
        }

        // next();
        
    } catch (error) {
        return res.json({success: false, message: "Not Authorised, login again"})
    }
}

export default userAuth;
