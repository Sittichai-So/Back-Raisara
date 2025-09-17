import User from "../model/user.model.js";
import md5 from "md5";
export default class userService {
  async getUsersService() {
    try {
      const response = await User.find({ isActive: true }).select("-password");

      return response;
    } catch (error) {
      throw new Error(error, {
        cause: `ไม่สามารถดึงข้อมูลได้!`,
      });
    }
  }
  async getUserByIDService(id) {
    try {
      const response = await User.findOne({ _id: id, isActive: true });

      return response;
    } catch (error) {
      throw new Error(error, {
        cause: `ไม่สามารถดึงข้อมูลได้!`,
      });
    }
  }
  async changePasswordByIDSerivce(id, payload) {
    try {
      console.log(id);
      console.log(payload);
      const { currentPassword, newPassword } = payload;
     
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found!");
      }

      const hashedCurrentPassword = md5(currentPassword);

      if (user.password !== hashedCurrentPassword) {
        throw new Error("Current password is incorrect!");
      }

      const hashedNewPassword = md5(newPassword);
      user.password = hashedNewPassword;
      
      const updatedUser = await user.save();

      return updatedUser;
    } catch (error) {
      throw new Error(error, {
        cause: `ไม่สามารถเเก้ไขข้อมูลได้!`,
      });
    }
  }

  async updateStatusService(id, status) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found!");
      }

      user.status = status;
      const updatedUser = await user.save();

      return {
        _id: updatedUser._id,
        username: updatedUser.username,
        status: updatedUser.status,
      };
    } catch (error) {
      throw new Error(error, {
        cause: `ไม่สามารถอัปเดตสถานะได้!`,
      });
    }
  }
}