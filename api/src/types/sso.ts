export type GoogleProfile = {
    name: {
        givenName: string;
        familyName: string;
    };
    emails: {
        value: string;
        verified: boolean;
    }[];
    provider: string;
};

export type MicrosoftProfile = {
    provider: string;
    name: { familyName: string; givenName: string };
    emails: { type: string; value: string }[];
};

export type SsoUser = {
    user: {
        email: string;
        firstName: string;
        lastName: string;
        provider: string;
    };
};
