const express = require("express");
const route = express.Router();
const { authenticate } = require("../middleware/auth");
const examController =  require("../controllers/examController");
const upload = require("../controllers/upload");

route.get("/:type", authenticate, examController.getExamType);
route.post("/upload", authenticate, upload.single("fileUrl") ,examController.uploadPaper);
route.get("/stream/:id", examController.streamPDF);
route.get("/download/:id", authenticate, examController.downloadPDF);
route.get("/download-by-name/:name", examController.downloadByName);

module.exports = route;