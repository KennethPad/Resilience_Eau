export function checkAuth(req, res, next) {
    if(req.session.username) return next();
    res.redirect("/auth/login");
};