//--------------------------------------VERIFICATION DU JETON D'AUTHENTIFICATION

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    
    // Récuperation du token de la requête et décryptage
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    
    // Comparaison du UserId de la requête d'authentifcation avec l'userId associé au compte
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
