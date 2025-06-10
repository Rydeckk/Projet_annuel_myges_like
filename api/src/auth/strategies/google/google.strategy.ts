import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleProfile } from "types/sso";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>("google.clientID")!,
            clientSecret: configService.get<string>("google.clientSecret")!,
            callbackURL: `${configService.get<string>("clientUrl")!}/google-redirect`,
            scope: ["email", "profile"],
        });
    }

    validate(
        _accessToken: string,
        _refreshToken: string,
        profile: GoogleProfile,
        done: VerifyCallback,
    ) {
        const { id, name, emails, provider } = profile;
        const user = {
            providerUserId: id,
            email: emails[0].value,
            firstName: name?.givenName ?? "",
            lastName: name?.familyName ?? "",
            provider,
        };
        done(null, user);
    }
}
