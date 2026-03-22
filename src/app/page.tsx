
import { GameEngine } from "@/components/game/game-engine";

export default function Home() {
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      <div className="w-full h-full max-w-screen-2xl mx-auto shadow-2xl overflow-hidden relative">
        <GameEngine />
      </div>
      
      {/* Footer Info / Mobile orientation reminder */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-40 text-xs font-semibold text-slate-400 uppercase tracking-widest hidden md:block">
        BEST EXPERIENCED ON PORTRAIT TOUCH DEVICES
      </div>
    </main>
  );
}
