import { IsNotEmpty } from "class-validator";

export class UploadSessionInput {
    @IsNotEmpty()
    import_session: string;
}