import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { UploadApiService } from "./service/upload-api-service";
import multer from "multer";

const router = Router();

const service = container.resolve(UploadApiService);

router.get("/", (req: Request, res: Response) => res.status(200).send("App successfully start!"));

router.post(
    "/create-session/:phone_number_id",
    service.createImportSession
);

router.post("/import-session/:phone_number_id",
    multer().single("file"),
    service.uploadImportSession
);

router.post(
    "/upload-image",
    multer({ storage: storage() }).single("file"),
    service.uploadImage
);

function storage() {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./uploads");
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });
}

export default router;