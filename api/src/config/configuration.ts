export default () => ({
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
});
