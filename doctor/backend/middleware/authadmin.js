import jwt from 'jsonwebtoken'
 
export const adminauth=async(req,res,next)=>{
    try {
        const {atoken}=req.headers  
        if(!atoken){
            return res.status(401).json({ message: 'You do not have authentication' });
        }
     const decoded_token=jwt.verify(atoken,process.env.JWT_SECRET_KEY)
     if(decoded_token !==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
        return res.status(401).json({ message: 'You do not have authentication' });
     }
     next();

    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ message: 'Error authentication' });
    }
} 