import jwt from 'jsonwebtoken'

export const authdoctor=async (req,res,next)=>{
    try {
        const {dtoken} = req.headers;

        if (!dtoken) {
            return res.status(401).json({ message: 'You do not have authentication' });
        }

        const decoded_token=await jwt.verify(dtoken,process.env.JWT_SECRET_KEY)

        req.doctor=decoded_token

        next()
    } catch (error) {
        
    }
}