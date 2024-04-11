import axios from "axios";
import { SessionInput } from "../models/dto/session-input";
import { v2 as cloudinary } from "cloudinary";

export class UploadApiRepository {
    async createImportSession(input: SessionInput, appId: string, token: string) {
        return axios({
            method: "POST",
            url: `https://graph.facebook.com/v19.0/${appId}/uploads?file_length=${input.file_length}&file_type=${input.file_type}`,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }); 
    }

    async uploadImportSession(importSession: string, image: any, token: string) {
        return axios({
            method: "POST",
            url: `https://graph.facebook.com/v19.0/${importSession}`,
            data: image,
            headers: {
                "Authorization": `OAuth ${token}`,
                "file_offset": 0,
                "Content-Type": "multipart/form-data"
            }
        }); 
    }

    async cloudinaryUploader(image: string) {
        cloudinary.config({
            cloud_name: 'devskills',
            api_key: '387341725159847',
            api_secret: 'BnY8_tbbRJUIhhwav-chJybV-8Q',
        });

        return await cloudinary.uploader.upload(image);
    }
}