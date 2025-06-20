export default () => ({
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    clientUrl: process.env.CLIENT_URL,
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        cloud: {
            projectId: process.env.GCS_PROJECT_ID,
            clientEmail: process.env.GCS_CLIENT_EMAIL,
            privateKey: process.env.GCS_PRIVATE_KEY,
        },
    },
    microsoft: {
        clientID: process.env.AZURE_CLIENT_ID,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
    },
    brevoApiKey: process.env.BREVO_API_KEY,
});
