import { SiteShell } from "@/components/site/site-shell";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <>
      <SiteShell />
      <Toaster />
      <div className="grain" aria-hidden />
    </>
  );
}
