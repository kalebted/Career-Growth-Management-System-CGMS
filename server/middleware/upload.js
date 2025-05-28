import multer from "multer";
import fs from "fs";
import path from "path";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const getStorage = (basePath) => {
  ensureDir(basePath);
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, basePath),
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const sanitized = file.originalname.replace(/\s+/g, "_");
      cb(null, `${uniqueSuffix}-${sanitized}`);
    }
  });
};

// Individual multer middlewares
export const uploadImage = multer({ storage: getStorage("public/assets/images") });
export const uploadCV = multer({ storage: getStorage("private/uploads/cvs") });
export const uploadCertification = multer({ storage: getStorage("private/uploads/certifications") });
export const uploadLogo = multer({ storage: getStorage("public/assets/logos") });


// Combined upload for /auth/register
export const uploadBoth = multer({
  storage: {
    _handleFile(req, file, cb) {
      const folderMap = {
        picture: "public/assets/images",
        cvFile: "private/uploads/cvs"
      };

      const folder = folderMap[file.fieldname] || "temp";
      ensureDir(folder);

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const sanitized = file.originalname.replace(/\s+/g, "_");
      const filename = `${uniqueSuffix}-${sanitized}`;
      const filepath = path.join(folder, filename);

      const outStream = fs.createWriteStream(filepath);
      file.stream.pipe(outStream);

      outStream.on("error", cb);
      outStream.on("finish", () => {
        cb(null, {
          destination: folder,
          filename,
          path: filepath
        });
      });
    },
    _removeFile(req, file, cb) {
      fs.unlink(file.path, cb);
    }
  }
}).fields([
  { name: "picture", maxCount: 1 },
  { name: "cvFile", maxCount: 1 }
]);
