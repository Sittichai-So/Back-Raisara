import jwt from "jsonwebtoken";
import authService from "./auth.service.js";
import config from "../configs.js";

export const register = async (req, res) => {
  try {
    const { username, password, email, firstname, lastname, phoneNumber } = req.body;
    
    if (!username || !password || !email || !firstname || !lastname || !phoneNumber) {
      return res.status(400).json({
        status: "fail",
        code: 0,
        message: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        cause: "missing_required_fields",
        result: null,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "fail",
        code: 0,
        message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
        cause: "password_too_short",
        result: null,
      });
    }

    const user = await new authService().register(req.body);
    
    const { password: _, passwordHash: __, ...safeUser } = user.toObject ? user.toObject() : user;
    
    return res.status(201).json({
      status: "success",
      code: 1,
      message: "ลงทะเบียนสำเร็จ",
      cause: "",
      result: safeUser,
    });
  } catch (error) {
    console.log(error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const fieldName = field === 'username' ? 'ชื่อผู้ใช้' : 'อีเมล';
      return res.status(400).json({
        status: "fail",
        code: 0,
        message: `${fieldName}นี้มีการใช้งานแล้ว`,
        cause: "duplicate_key",
        result: null,
      });
    }

    return res.status(500).json({
      status: "fail",
      code: 0,
      message: error.message || "เกิดข้อผิดพลาดภายในระบบ",
      cause: error.cause || "internal_error",
      result: null,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        code: 0,
        message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
        cause: "missing_credentials",
        result: null,
      });
    }

    const passwordHash = md5(password);
    const { user, cause } = await authService.login(username, passwordHash);
    
    if (!user) {
      return res.status(401).json({
        status: "fail",
        code: 0,
        message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        cause: cause || "invalid_credentials",
        result: null,
      });
    }

    user.status = 'online';
    user.lastLogin = new Date();
    await user.save();

    const { password: _, passwordHash: __, ...safeUser } = user.toObject();
    
    const token = jwt.sign(
      { 
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role 
      }, 
      config.app.jwtkey, 
      { expiresIn: "24h" }
    );
    
    return res.status(200).json({
      status: "success",
      code: 1,
      message: "เข้าสู่ระบบสำเร็จ",
      cause: "",
      result: safeUser,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      code: 0,
      message: error.message || "เกิดข้อผิดพลาดภายในระบบ",
      cause: error.cause || "internal_error",
      result: null,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (userId) {
      await authService.updateUserStatus(userId, 'offline');
    }

    return res.status(200).json({
      status: "success",
      code: 1,
      message: "ออกจากระบบสำเร็จ",
      cause: "",
      result: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      code: 0,
      message: "เกิดข้อผิดพลาดในการออกจากระบบ",
      cause: "logout_error",
      result: null,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await authService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        code: 0,
        message: "ไม่พบข้อมูลผู้ใช้",
        cause: "user_not_found",
        result: null,
      });
    }

    const { password: _, passwordHash: __, ...safeUser } = user.toObject();

    return res.status(200).json({
      status: "success",
      code: 1,
      message: "ดึงข้อมูลโปรไฟล์สำเร็จ",
      cause: "",
      result: safeUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      code: 0,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
      cause: "profile_error",
      result: null,
    });
  }
};