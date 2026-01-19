import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Use classic createElement to avoid runtime JSX issues in entrypoint
createRoot(document.getElementById("root") as HTMLElement).render(
	React.createElement(App)
);
