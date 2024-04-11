import { IsNotEmpty } from "class-validator";

export class SessionInput {
    @IsNotEmpty()
    file_length: string;
    
    @IsNotEmpty()
    file_type: string;
}