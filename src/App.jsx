import Home from "./pages/Home";
import { LanguageProvider } from "@/i18n/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-green-50">
        <Home />
      </div>
    </LanguageProvider>
  );
}
