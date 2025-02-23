import jwt from 'jsonwebtoken';

export const userauth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'You do not have authentication' });
    }

    // Verify the token
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Optionally, you can attach the decoded token to the request object
    req.user = decoded_token; 

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(500).json({ message: 'Error in authentication' });
  }
};
