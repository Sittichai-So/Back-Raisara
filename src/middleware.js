import Jwt from "jsonwebtoken";
import config from "./config.js";


export const validateToken = async (req, res, next) => {
    try {
      const authHeader = req.headers?.authorization;
      if (!authHeader) {
        res.status(401).send({
          message: "unauthorized",
          cause: "authorization header not found",
        });
        return;
      }
  
      const [scheme, token] = authHeader.split(" ");
      console.log(scheme, token);
  
      const payload = Jwt.verify(token, config.app.jwtkey);
  
      if (!payload || scheme !== "Bearer") {
        res.status(401).send({
          message: "unauthorized",
          cause: "invalid token",
        });
        return;
      }
      req.user = payload;
  
      console.log(req.user);
      next();
    } catch (error) {
      if (error.message === "jwt expired") {
        res.status(401).send({
          status: "error",
          code: 0,
          message: "unauthorized",
          cause: "expired token",
        });
        return;
      }
  
      if (error.message === "invalid signature") {
        res.status(401).send({
          status: "error",
          code: 0,
          message: "unauthorized",
          cause: "invalid signature",
        });
        return;
      }
  
      if (error.message === "invalid token") {
        res.status(401).send({
          status: "error",
          code: 0,
          message: "unauthorized",
          cause: "invalid token",
        });
        return;
      }
  
      res.status(500).send({
        status: "error",
        code: 0,
        message: "interal error",
        cause: "unknown",
      });
    }
  };
export const validateSecretKey = (req, res, next) => {
    const { authorization } = req.headers;
   
  
     const [scheme, token] = authorization.split(" ");
   
    if (!authorization || token !== config.app.secretkey) {
      return res.status(403).send({
        status: "error",
        code: 0,
        message: "ไม่สามารถเข้าถึงได้",
        cause: "unauthorized",
      });
    }
  
    next();
  }


export const validatePermission = (req, res, next) => {
 
    const { role } = req.user;
  
    if (role !== "admin") {
      return res.status(403).send({
        status: "error",
        code: 0,
        message: "ผู้ใช้ไม่มีสิทธิ์ในการเข้าถึงหรือดำเนินการ",
        cause: "unauthorized",
      });
    }
    next();
  };