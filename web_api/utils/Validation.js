export const authenticateAndAuthorize = async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
  
      const decoded = jwt.verify(token, jwtSecret);
  
      req.user = decoded;
        next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token.' });
    }
  };
  