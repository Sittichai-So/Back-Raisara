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

  async login(username, passwordHash) {
    try {
      const user = await this.getUser(username);
      if (!user) {
        return { user: null, cause: "ไม่พบผู้ใช้งาน" };
      }

      if (user.passwordHash !== passwordHash) {
        return { user: null, cause: "username หรือ password ไม่ถูกต้อง!" };
      }

      return {
        user: user,
        cause: "Successfully logged in",
      };
    } catch (error) {
      throw new Error(error.message || "Login failed", {
        cause: "login_error",
      });
    }
  }

  async getUser(username) {
    try {
      const user = await User.findOne({ 
        $or: [
          { username: username },
          { email: username }
        ],
        isActive: true 
      });

      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to get user", {
        cause: "get_user_error",
      });
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password -passwordHash');
      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to get user by ID", {
        cause: "get_user_by_id_error",
      });
    }
  }

  async updateUserStatus(userId, status) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          status: status,
          ...(status === 'offline' ? {} : { lastLogin: new Date() })
        },
        { new: true }
      );
      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to update user status", {
        cause: "update_status_error",
      });
    }
  }

  async checkUserExists(username, email) {
    try {
      const existingUser = await User.findOne({
        $or: [
          { username: username },
          { email: email }
        ],
        isActive: true
      });
      return existingUser;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to check user existence", {
        cause: "check_user_error",
      });
    }
  }

  async updateUserProfile(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password -passwordHash');
      
      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to update profile", {
        cause: "update_profile_error",
      });
    }
  }
}