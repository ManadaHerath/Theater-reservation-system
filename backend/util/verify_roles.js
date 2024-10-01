export const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req?.role) return res.redirect("http://localhost:3000/unauthorized");
    if (!allowedRoles.includes(req.role))
      return res.redirect("http://localhost:3000/unauthorized");
    next();
  };
};
