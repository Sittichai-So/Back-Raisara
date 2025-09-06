import User from "../model/user.model.js";

export default class authService {
  async login(username, password) {
    try {
      const user = await this.getUser(username);
      if (!user) {
        return { user: null, cause: "ไม่พบผู้ใช้งาน" };
      }

      if (user.password !== password) {
        return { user: null, cause: "username หรือ password ไม่ถูกต้อง!" };
      }

      return {
        user: {
          _id: user._id,
          username: user.username,
          fullname: user.firstName + " " + user.lastName,
          phoneNumber: user.phoneNumber,
        },
        cause: "Successfully logged in",
      };
    } catch (error) {
      throw new Error(error, {
        cause: `internal server config!`,
      });
    }
  }
  async getUser(username) {
    try {
      const user = await User.findOne({ username: username, isActive: true });

      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error, {
        cause: `internal server config!`,
      });
    }
  }
}
