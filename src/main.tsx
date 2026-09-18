import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing #root element in index.html");

// NOTE: no <StrictMode> wrapper - the app previously ran with
// Next.js reactStrictMode:false, so preserve that behavior.
createRoot(rootEl).render(<App />);
