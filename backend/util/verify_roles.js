export const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req?.role) return res.status(401).send("Unauthorized");
    if (!allowedRoles.includes(req.role))
      return res.status(403).send("Forbidden");
    next();
  };
};
