import multer from "multer";
import path from "path";

const slikeFolder = path.join(__dirname, "../", "../", "./src", "/slike");

const storage = multer.diskStorage({
  destination: slikeFolder,
  filename: (req, file, callback) => {
    const name = Buffer.from(file.originalname, "latin1").toString("utf8");
    const uniqueName = Date.now() + "-" + name;
    callback(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return callback(null, false);
    }
    callback(null, true);
  },
});

export default upload;
