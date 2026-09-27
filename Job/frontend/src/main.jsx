import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import router from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";

import "./style.scss";
import { InterviewProvider } from "./features/interview/interview.context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <InterviewProvider>
                <RouterProvider router={router} />
            </InterviewProvider>
        </AuthProvider>
    </React.StrictMode>
);