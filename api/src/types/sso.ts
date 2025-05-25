export type GoogleProfile = {
    id: string;
    name: { givenName?: string; familyName?: string };
    emails: {
        value: string;
        verified: boolean;
    }[];
    provider: string;
};

export type MicrosoftProfile = {
    id: string;
    provider: string;
    name: { familyName?: string; givenName?: string };
    emails: { type: string; value: string }[];
};

export type SsoUser = {
    providerUserId: string;
    email: string;
    firstName: string;
    lastName: string;
    provider: string;
};

export type RequestUser = { user: SsoUser };
