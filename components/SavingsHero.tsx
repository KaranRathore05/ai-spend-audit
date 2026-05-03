export function SavingsHero({ monthly, annual }: { monthly: number, annual: number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
      <h2 className="text-gray-400 text-xl font-medium mb-4">Estimated Wasted Spend</h2>
      <div className="flex flex-col items-center justify-center">
        <span className="text-7xl font-extrabold text-white mb-2 tracking-tight">
          ${monthly.toLocaleString()}
          <span className="text-3xl text-gray-500">/mo</span>
        </span>
        <span className="text-green-400 font-bold text-xl bg-green-900/30 px-4 py-1 rounded-full">
          ${annual.toLocaleString()} per year
        </span>
      </div>
    </div>
  );
}
