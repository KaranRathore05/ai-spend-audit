export function Hero() {
  return (
    <div className="text-center py-20 px-4">
      <div className="inline-block mb-4 px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-sm text-gray-300 font-medium">
        ✨ Free for startups and engineering teams
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
        Find wasted AI spend <br className="hidden md:block"/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
          in 60 seconds
        </span>
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        Audit your Cursor, Claude, ChatGPT, Copilot, Gemini, and API bills. Get instant savings recommendations before your next invoice.
      </p>
      <p className="text-sm text-gray-500">
        No login. No payment. Email only after you see value.
      </p>
    </div>
  );
}
