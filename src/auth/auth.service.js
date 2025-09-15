import User from "../model/user.model.js";
import md5 from "md5";

export default class authService {
  
  async register(userData) {
    try {
      const { password, firstName, displayName, ...otherData } = userData;

      const passwordHash = md5(password);

      const newUser = new User({
        ...otherData,
        firstName,
        password: passwordHash,
        role: userData.role || "user",
        status: "offline",
        displayName: displayName || firstName,
      });

      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      console.log(error);
      error.cause = error.cause || "registration_error";
      throw error;
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
          status: "online"
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

  async findUserByUsername(username) {
    try {
      const user = await User.findOne({ username: username });
      return user;
    } catch (error) {
      console.log("findUserByUsername error:", error);
      throw new Error(error.message || "Failed to check username", {
        cause: "check_username_error",
      });
    }
  }

  async findUserByEmail(email) {
    try {
      const user = await User.findOne({ email: email });
      return user;
    } catch (error) {
      console.log("findUserByEmail error:", error);
      throw new Error(error.message || "Failed to check email", {
        cause: "check_email_error",
      });
    }
  }

  async findUserByPhoneNumber(phoneNumber) {
    try {
      const user = await User.findOne({ phoneNumber: phoneNumber });
      return user;
    } catch (error) {
      console.log("findUserByPhoneNumber error:", error);
      throw new Error(error.message || "Failed to check phone number", {
        cause: "check_phone_error",
      });
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      console.log("getUserById error:", error);
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
          lastLogin: status === "online" ? new Date() : undefined 
        },
        { new: true }
      );
      return user;
    } catch (error) {
      console.log("updateUserStatus error:", error);
      throw new Error(error.message || "Failed to update user status", {
        cause: "update_status_error",
      });
    }
  }

  async deactivateUser(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          isActive: false,
          status: "offline",
          deactivatedAt: new Date()
        },
        { new: true }
      );
      return user;
    } catch (error) {
      console.log("deactivateUser error:", error);
      throw new Error(error.message || "Failed to deactivate user", {
        cause: "deactivate_user_error",
      });
    }
  }

  async reactivateUser(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          isActive: true,
          deactivatedAt: null
        },
        { new: true }
      );
      return user;
    } catch (error) {
      console.log("reactivateUser error:", error);
      throw new Error(error.message || "Failed to reactivate user", {
        cause: "reactivate_user_error",
      });
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error("ไม่พบผู้ใช้งาน", { cause: "user_not_found" });
      }

      const oldPasswordHash = md5(oldPassword);
      if (user.passwordHash !== oldPasswordHash) {
        throw new Error("รหัสผ่านเดิมไม่ถูกต้อง", { cause: "invalid_old_password" });
      }

      const newPasswordHash = md5(newPassword);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          password: newPassword,
          passwordHash: newPasswordHash,
          passwordChangedAt: new Date()
        },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      console.log("changePassword error:", error);
      throw new Error(error.message || "Failed to change password", {
        cause: error.cause || "change_password_error",
      });
    }
  }
}