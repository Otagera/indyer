import { useEffect } from "react";
import { Masthead } from "./components/Masthead";
import { PaperGrain } from "./components/PaperGrain";
import { ModeSelect } from "./components/ModeSelect";
import { GamePlay } from "./components/GamePlay";
import { GameOver } from "./components/GameOver";
import { FrontPage } from "./components/FrontPage";
import { useGameStore } from "./stores/game";

export default function App() {
  const { screen, load } = useGameStore();

  useEffect(() => {
    load();
  }, [load]);

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
      <main className="w-full max-w-[380px] bg-paper shadow-card p-6 relative min-h-[300px]">
        <Masthead size="compact" />
        {screen === "loading" && (
          <p className="font-body text-text-faint text-center text-sm mt-8">
            Loading today&rsquo;s issue...
          </p>
        )}
        {screen === "mode-select" && (
          <>
            <p className="text-text-tertiary text-center text-sm mt-4 mb-6 font-body italic">
              Daily guess-the-name puzzle
            </p>
            <ModeSelect />
          </>
        )}
        {screen === "playing" && (
          <div className="mt-4">
            <GamePlay />
          </div>
        )}
        {(screen === "solved" || screen === "failed") && (
          <div className="mt-4">
            <GameOver />
          </div>
        )}
        {screen === "home" && <FrontPage />}
      </main>
    </div>
  );
}
