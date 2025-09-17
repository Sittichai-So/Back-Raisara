import jwt from "jsonwebtoken";
import authService from "./auth.service.js";
import config from "../configs.js";
import md5 from "md5";

export const register = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName, phoneNumber } = req.body;

    if (!username || !password || !email || !firstName || !lastName || !phoneNumber) {
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

    const userPayload = {
      ...req.body,
      displayName: firstName,
    };

    const user = await new authService().register(userPayload);

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

    const fieldLabels = {
      username: "ชื่อผู้ใช้",
      email: "อีเมล",
      phoneNumber: "เบอร์โทรศัพท์",
    };

    if (error.code === 11000 || error.name === "MongoServerError") {
      const field = Object.keys(error.keyValue)[0];
      const fieldName = fieldLabels[field] || field;
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
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
        cause: "missing_credentials",
        result: null,
      })
    }

    const passwordHash = md5(password)
    const service = new authService()
    const { user, cause } = await service.login(username, passwordHash)

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        cause: cause || "invalid_credentials",
        result: null,
      })
    }

    const updatedUser = await service.updateUserStatus(user._id, 'online')

    const token = jwt.sign(
      { id: updatedUser._id, username: updatedUser.username, role: updatedUser.role },
      config.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    )

    const userData = {
      _id: updatedUser._id,
      username: updatedUser.username,
      role: updatedUser.role,
      fullname: updatedUser.firstName + " " + updatedUser.lastName,
      phoneNumber: updatedUser.phoneNumber,
      status: updatedUser.status,
      lastLogin: updatedUser.lastLogin,
      token: token
    }

    return res.status(200).json({
      status: "success",
      message: "เข้าสู่ระบบสำเร็จ",
      cause: "Successfully logged in",
      result: userData,
    })

  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || "เกิดข้อผิดพลาดภายในระบบ",
      cause: "internal_error",
      result: null,
    })
  }
};

export const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) return res.status(400).json({ available: false, message: "กรุณาระบุ username" });

    const service = new authService();
    const existingUser = await service.findUserByUsername(username);

    return res.status(200).json({
      available: !existingUser,
      username
    });
  } catch (err) {
    return res.status(500).json({ available: false, username: "", message: err.message });
  }
};