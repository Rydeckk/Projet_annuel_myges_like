import {
    SendSmtpEmail,
    TransactionalEmailsApi,
    TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StudentAccountCreationParams } from "constants/brevo.constant";

@Injectable()
export class EmailService {
    private apiInstance: TransactionalEmailsApi;

    constructor(private readonly configService: ConfigService) {
        this.apiInstance = new TransactionalEmailsApi();
        this.apiInstance.setApiKey(
            TransactionalEmailsApiApiKeys.apiKey,
            this.configService.get<string>("brevoApiKey")!,
        );
    }

    async sendMail<T extends StudentAccountCreationParams>({
        name,
        email,
        templateId,
        params,
    }: {
        name: string;
        email: string;
        templateId: number;
        params: T;
    }) {
        const sendSmtpEmail = new SendSmtpEmail();

        sendSmtpEmail.to = [
            {
                email,
                name,
            },
        ];

        sendSmtpEmail.templateId = templateId;
        sendSmtpEmail.params = params;

        try {
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
        } catch (error) {
            console.error(error);
        }
    }
}
