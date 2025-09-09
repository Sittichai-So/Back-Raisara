import CategoryService from "./categories.service.js";

const categoryService = new CategoryService();

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAll();
  return res.status(200).send({
      status: "success",
      code: 1,
      message: "ดึงข้อมูลสำเร็จ",
      cause: "",
      result: categories.length === 0 ? "ไม่มีข้อมูล" : categories
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