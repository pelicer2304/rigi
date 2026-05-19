import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProcessosPage from "./pages/Processos";
import IFAMonitoramento from "./pages/IFAMonitoramento";
import TemposAnvisaPage from "./pages/TemposAnvisa";
import MedicamentosRegistrados from "./pages/MedicamentosRegistrados";
import DHL from "./pages/DHL";
import DHL2 from "./pages/DHL2";
import FilasPage from "./pages/Filas";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/processos"} component={ProcessosPage} />
      <Route path={"/ifa-monitoramento"} component={IFAMonitoramento} />
      <Route path={"/tempos-anvisa"} component={TemposAnvisaPage} />
      <Route path={"/medicamentos-registrados"} component={MedicamentosRegistrados} />
      <Route path={"/filas"} component={FilasPage} />
      <Route path={"/dhl/:processo"} component={DHL} />
      <Route path={"/dhl2/:processo"} component={DHL2} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
