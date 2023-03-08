var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req,res, next)=>{
//get the user from the jwt token and add id to the object
const token = req.header('auth-token');
if(!token){
    res.status(401).json({error:"please authenticatte using a valid token"});

}
else{
    try{
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user

next();}
catch(error){ res.status(401).json({error: "Please authenticate properly" , errorme : error.message})  }}
}



module.exports = fetchuser