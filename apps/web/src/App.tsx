import { HealthCheck } from "./components/HealthCheck";
import { Masthead } from "./components/Masthead";
import { PaperGrain } from "./components/PaperGrain";

export default function App() {
  return (
    <div
      className="min-h-screen bg-app-bg flex flex-col items-center justify-center p-4 relative"
      style={{
        backgroundImage: `
          radial-gradient(rgba(192,138,30,0.07) 0px, transparent 50%),
          radial-gradient(rgba(239,230,208,0.03) 0.6px, transparent 0.6px)
        `,
        backgroundSize: "100% 100%, 22px 22px",
        backgroundPosition: "center center, 0 0",
      }}
    >
      <PaperGrain />
      <main className="w-full max-w-[380px] bg-paper shadow-card p-6 relative">
        <Masthead size="compact" />
        <p className="text-text-tertiary text-center text-sm mt-4 mb-6">
          Daily guess-the-name puzzle
        </p>
        <HealthCheck />
      </main>
    </div>
  );
}
