import User from "../model/user.model.js";
import md5 from "md5";

export default class authService {
  
  async register(userData) {
    try {
      const { password, ...otherData } = userData;

      const passwordHash = md5(password);
      
      const newUser = new User({
        ...otherData,
        password: password,
        passwordHash: passwordHash,
        role: userData.role || 'user',
        status: 'offline'
      });

      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Registration failed", {
        cause: error.cause || "registration_error",
      });
    }
  }

  async login(username, password) {
    try {
      const user = await this.getUser(username);

      if (!user) {
        return { user: null, cause: "ไม่พบผู้ใช้งาน" };
      }
      if (user.password != password) {
        return { user: null, cause: "username หรือ password ไม่ถูกต้อง!" };
      }

      return {
        user: {
          _id: user._id,
          username: user.username,
          role: user.role,
          fullname: user.firstName + " " + user.lastName,
          phoneNumber: user.phoneNumber,
        },
        cause: "Successfully logged in",
      };
    } catch (error) {
       console.log(error)
      throw new Error(error.message || "Login failed", {
        cause: "login_error",
      });
    }
  }

  async getUser(username) {
    try {
    const user = await User.findOne({ username: username, isActive: true });
      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to get user", {
        cause: "get_user_error",
      });
    }
  }
}