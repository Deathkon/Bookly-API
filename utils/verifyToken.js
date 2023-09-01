import Jwt from "jsonwebtoken";

import createError from "./error.js";
import {} from "../Service/auth/auth.service.js";


export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  Jwt.verify(token, process.env.JWT_secret, (err, user) => {
    if (err) return next(createError(403, "Invalid token!"));
    req.user = user;
    console.log(req.user.id);
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// export const verifyVendor = (req, res, next) => {
//   verifyToken(req, res, next, () => {
//     const user = User.findById(req.user.id);
//     if (user === "Vendor") {
//       next();
//     } else {
//       return next(createError(403, "Please,You are not authorized!"));
//     }
//   });
// };
