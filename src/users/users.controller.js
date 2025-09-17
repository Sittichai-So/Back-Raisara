import UserService from "./users.service.js";

const userService = new UserService();

export const getUsersContrller = async (req, res, next) => {
  try {

    const response = await userService.getUsersService()

    return res.status(200).send({
      status: "success",
      code: 1,
      message: "ดึงข้อมูลสำเร็จ",
      cause: "",
      result: response.length === 0 ? "ไม่มีข้อมูล" : response
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

export const updateStatusController = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body;

    const updated = await userService.updateStatusService(id, status);
    res.json({
      success: true,
      message: "อัปเดตสถานะสำเร็จ",
      result: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาด",
    });
  }
};