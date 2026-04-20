import { useEffect } from "react"; // KANA DABALI
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route } from "react-router-dom"; // HashRouter fayyadamuu kee mirkaneessi
import Dashboard from "./pages/Dashboard";
import BoardSelection from "./pages/BoardSelection";
import Game from "./pages/Game";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Koodii Telegram-ni expand akka ta'u godhu KANA JALATTI DABALI
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/boardselection" element={<BoardSelection />} />
            <Route path="/game" element={<Game />} />
            <Route path="/classic" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
