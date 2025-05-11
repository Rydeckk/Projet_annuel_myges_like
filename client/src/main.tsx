import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { ROUTER } from "./routes/route.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Toaster position="top-right" />
        <RouterProvider router={ROUTER} />
    </StrictMode>,
);
