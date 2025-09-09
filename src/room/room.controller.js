import roomService from "./room.service.js";

export const getRoom = async (req, res, next) => {
  try {

    const response = await  new roomService().getAll()

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
