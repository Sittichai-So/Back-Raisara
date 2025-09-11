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

export const joinRoomId = async (req, res) => {
  try {
    const { roomId, userId, fullname, avatar } = req.body;
    
    if (!roomId || !userId) {
      return res.status(400).send({
        status: "fail",
        code: 0,
        message: "ไม่พบ roomId หรือ userId",
        result: null
      });
    }

    const room = await new roomService().joinRoom(roomId, { 
      userId, 
      fullname, 
      avatar 
    });

    console.log('room joined:', room);

    return res.status(200).send({
      status: "success",
      code: 1,
      message: room.message || "เข้าร่วมห้องสำเร็จ",
      result: room
    });
  } catch (error) {
    console.log('joinRoom error:', error);
    return res.status(500).send({
      status: "fail",
      code: 0,
      message: error.message,
      result: null
    });
  }
};
