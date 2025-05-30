import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-microsoft";
import { MicrosoftProfile } from "src/types/sso";

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, "microsoft") {
    constructor(readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>("microsoft.clientID")!,
            clientSecret: configService.get<string>("microsoft.clientSecret")!,
            callbackURL: `${configService.get<string>("clientUrl")!}/microsoft-redirect`,
            scope: [
                "openid",
                "profile",
                "email",
                "https://graph.microsoft.com/user.read",
            ],
        });
    }

    validate(
        _accessToken: string,
        _refreshToken: string,
        profile: MicrosoftProfile,
        done: (
            err: null,
            user: {
                email: string;
                firstName: string;
                lastName: string;
            },
        ) => void,
    ) {
        const { name, emails, provider } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            provider,
        };
        done(null, user);
    }
}
