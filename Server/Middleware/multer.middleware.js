import multer from 'multer'
import fs, { mkdirSync } from 'fs'

const TEMP_DIR = './Public/Temp'
if (!fs.existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, TEMP_DIR)
    },
    filename: function (req, file, cb) {
        console.log("Multer file: ", file);
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage
})