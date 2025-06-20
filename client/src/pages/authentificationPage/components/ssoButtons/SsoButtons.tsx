import { Button } from "../../../../components/ui/button";

export const SsoButtons = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const onGoogleClick = () => {
        window.location.href = `${apiUrl}/auth/google`;
    };

    const onMicrosoftClick = () => {
        window.location.href = `${apiUrl}/auth/microsoft`;
    };

    return (
        <div className="flex flex-col gap-4">
            <Button
                variant="outline"
                className="w-full"
                onClick={onGoogleClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                    />
                </svg>
                Login with Google
            </Button>
            <Button
                variant="outline"
                className="w-full"
                onClick={onMicrosoftClick}
            >
                <svg
                    fill="#000000"
                    width="256px"
                    height="256px"
                    viewBox="0 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        <title>microsoft</title>
                        <path d="M16.742 16.742v14.253h14.253v-14.253zM1.004 16.742v14.253h14.256v-14.253zM16.742 1.004v14.256h14.253v-14.256zM1.004 1.004v14.256h14.256v-14.256z"></path>{" "}
                    </g>
                </svg>
                Login with Microsoft
            </Button>
        </div>
    );
};
