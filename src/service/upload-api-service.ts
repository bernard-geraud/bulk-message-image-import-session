import { plainToClass } from "class-transformer";
import { Request, Response } from "express";
import { SessionInput } from "../models/dto/session-input";
import { AppValidationError } from "../utility/errors";
import { UploadApiRepository } from "../repository/upload-api-repository";
import { autoInjectable } from "tsyringe";
import * as fs from "fs";
import { PullWhatappAccessData } from "../msg-queue";
import { WhatsappAccessModel } from "../models/whatsapp-access-model";

const repository = new UploadApiRepository();

@autoInjectable()
export class UploadApiService {

    constructor() {
    }

    async createImportSession(req: Request, res: Response) {
        try {
            const phone_number_id = req.params?.phone_number_id;
            if (!phone_number_id) {
                return res.status(500).send("parameter phone_number_id is required!");
            }

            const input = plainToClass(SessionInput, req.body);
            const error = await AppValidationError(input);
            if (error) return res.status(404).send(error);

            const { status: whatsappAccessStatus, data: whatsappAccessData } = await PullWhatappAccessData({
                phone_number_id
            });
            if (whatsappAccessStatus !== 200) {
                return res.status(404).send(`Whatsapp access for phone number id ${phone_number_id} is not found!`);
            } else {
                const whatsappAccess = whatsappAccessData.data as WhatsappAccessModel;

                const { data, status } = await repository.createImportSession(input, whatsappAccess.app_id, whatsappAccess.token);
                if (status !== 200) {
                    return res.status(status).send("Failed to create image import session");
                } else {
                    return res.status(status).send(data);
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }

    async uploadImportSession(req: Request, res: Response) {
        try {
            if (!req?.file) return res.status(400).send("No file uploaded");

            const phone_number_id = req.params?.phone_number_id;
            if (!phone_number_id) {
                return res.status(500).send("parameter phone_number_id is required!");
            }

            const import_session = req.query["import_session"] as string;
            if (!import_session) return res.status(400).send("image import session is required!");

            const { status: whatsappAccessStatus, data: whatsappAccessData } = await PullWhatappAccessData({
                phone_number_id
            });
            if (whatsappAccessStatus !== 200) {
                return res.status(404).send(`Whatsapp access for phone number id ${phone_number_id} is not found!`);
            } else {
                const whatsappAccess = whatsappAccessData.data as WhatsappAccessModel;

                const { data, status } = await repository.uploadImportSession(
                    import_session,
                    req.file,
                    whatsappAccess.token
                );
                if (status !== 200) {
                    return res.status(status).send("Failed to upload image import session!");
                } else {
                    return res.status(200).send(data);
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }

    async uploadImage(req: Request, res: Response) {
        try {
            if (!req?.file) return res.status(400).send("No file uploaded");
            const result = await repository.cloudinaryUploader(req.file.path);
            fs.unlink(req.file.path, (error) => console.log(`Deleting image  ${req.file.path} in the hosting server. Erro: ${error}`));
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
}