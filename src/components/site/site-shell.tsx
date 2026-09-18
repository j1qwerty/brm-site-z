"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { FloatingScrollTop } from "./floating-scroll-top";
import { SiteProvider, useSite } from "./site-context";
import { HomeView } from "@/views/home";
import { AboutView } from "@/views/about";
import { AcademicsView } from "@/views/academics";
import { AdmissionsView } from "@/views/admissions";
import { EventsView } from "@/views/events";
import { GalleryView } from "@/views/gallery";
import { ContactView } from "@/views/contact";
import { InquiryView } from "@/views/inquiry";
import { AdminShell } from "@/admin/admin-shell";
import { CMSProvider } from "@/lib/cms-context";

function ViewRouter() {
  const { view } = useSite();

  // Admin view renders its own full-screen layout, no navbar/footer.
  if (view === "admin") {
    return (
      <main className="flex-1">
        <AdminShell />
      </main>
    );
  }

  const renderView = () => {
    switch (view) {
      case "home": return <HomeView />;
      case "about": return <AboutView />;
      case "academics": return <AcademicsView />;
      case "admissions": return <AdmissionsView />;
      case "events": return <EventsView />;
      case "gallery": return <GalleryView />;
      case "contact": return <ContactView />;
      case "inquiry": return <InquiryView />;
      default: return <HomeView />;
    }
  };

  return (
    <main className="flex-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export function SiteShell({ children }: { children?: React.ReactNode }) {
  return (
    <CMSProvider>
      <SiteProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          {/* pt-16 to offset fixed navbar (h-16 = 64px) */}
          <div className="flex-1 pt-16">
            <ViewRouter />
          </div>
          <Footer />
          <FloatingScrollTop />
          {children}
        </div>
      </SiteProvider>
    </CMSProvider>
  );
}
