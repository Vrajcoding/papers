const express = require("express");
const route = express.Router();
const { authenticate } = require("../middleware/auth");
const examController =  require("../controllers/examController");
const upload = require("../controllers/upload");

route.get("/:type", authenticate, examController.getExamType);
route.post("/upload", authenticate, upload.single("fileUrl") ,examController.uploadPaper);
route.get("/view/:id", authenticate, examController.viewPDF);
route.get("/download/:id", authenticate, examController.downloadPDF);

module.exports = route;