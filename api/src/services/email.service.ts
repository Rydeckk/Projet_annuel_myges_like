import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const SENDER = {
    name: "Myges Like",
    email: "mygeslike@gmail.com",
};

// COMMENT for the moment we don't use it

@Injectable()
export class EmailService {
    constructor(private readonly configService: ConfigService) {}

    async sendMail({
        email,
        userData,
    }: {
        email: string;
        userData: { firstName: string; lastName: string };
    }) {
        const options = {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "api-key": this.configService.get<string>("brevoApiKey")!,
            },

            body: JSON.stringify({
                sender: SENDER,
                to: [
                    {
                        email,
                        name: `${userData.firstName} ${userData.lastName}`,
                    },
                ],
                subject: "Your student account is created",
                htmlContent: "",
            }),
        };

        try {
            await fetch("https://api.brevo.com/v3/smtp/email", options);
        } catch (error) {
            console.error(error);
        }
    }
}
