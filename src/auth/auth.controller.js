import jwt from "jsonwebtoken";
import authService from "./auth.service.js";
import config from "../configs.js";
import md5 from "md5";

export const register = async (req, res) => {
  try {
    const user = await new authService().register(req.body);
    return res.status(201).json({
      status: "success",
      code: 1,
      message: "ลงทะเบียนสำเร็จ",
      cause: '',
      result: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "fail",
      code: 0,
      message: error.message,
      cause: error.cause,
      result: null,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const passwordHash = md5(password);
    const { user, cause } = await authService.login(username, passwordHash);
    
    if (!user) {
      return res.status(401).json({
        status: "success",
        code: 1,
        message: "ไม่สามารถ login ได้!",
        cause: cause,
        result: user,
      });
    }

    const token = jwt.sign(user, config.app.jwtkey, {
      expiresIn: "2h",
    });
    
    return res.status(200).send({
      status: "success",
      code: 1,
      message: "ดึงข้อมูลสำเร็จ",
      cause: cause,
      result: user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "fail",
      code: 0,
      message: error.message,
      cause: error.cause,
      result: null,
    });
  }
};