import { Hero } from "@/components/Hero";
import { SpendForm } from "@/components/SpendForm";
import { FAQ } from "@/components/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-white">
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto border-b border-gray-900">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
            AI Spend Doctor
          </span>
          <span className="text-sm text-gray-500">by Credex</span>
        </div>
        <a href="#audit" className="text-sm font-medium hover:text-green-400 transition-colors">
          Run audit
        </a>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pb-20">
        <Hero />
        
        <div id="audit" className="relative -mt-10 mb-20 z-10">
          <SpendForm />
        </div>

        <div className="text-center mb-20 py-10 bg-gray-900/50 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-8">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 px-10">
            <div>
              <div className="text-green-400 font-black text-4xl mb-4">1</div>
              <h3 className="font-bold mb-2">Enter your AI stack</h3>
              <p className="text-gray-400 text-sm">Tell us what tools your team uses and how much you spend.</p>
            </div>
            <div>
              <div className="text-green-400 font-black text-4xl mb-4">2</div>
              <h3 className="font-bold mb-2">Get instant savings</h3>
              <p className="text-gray-400 text-sm">Our deterministic engine finds duplicates, wrong plans, and wasted seats.</p>
            </div>
            <div>
              <div className="text-green-400 font-black text-4xl mb-4">3</div>
              <h3 className="font-bold mb-2">Save & Share</h3>
              <p className="text-gray-400 text-sm">Get an anonymized public report URL to share with your team.</p>
            </div>
          </div>
        </div>

        <FAQ />
      </main>
    </div>
  );
}
