const jwt=require("jsonwebtoken")

module.exports=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization)
    {
        let err = new Error("You must be logged in")
        err.status = 401
        throw err
    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,process.env.JWT_SECRET,(error,payload)=>{
        if(error)
        {
            let err = new Error("You must be logged in")
            err.status = 401
            throw err
        }
        const {_id}=payload
        next()
    })
}