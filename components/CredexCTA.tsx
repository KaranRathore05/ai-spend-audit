import { Button } from "@/components/ui/button";

export function CredexCTA({ savings }: { savings: number }) {
  if (savings < 500) return null;

  return (
    <div className="bg-gradient-to-r from-green-900 to-emerald-900 p-8 rounded-2xl border border-green-700 text-white shadow-2xl mt-8">
      <h3 className="text-2xl font-bold mb-3">You're leaving serious money on the table</h3>
      <p className="text-green-100 mb-6 text-lg">
        With ${savings.toLocaleString()}/month in overspend, you may qualify for discounted AI credits or custom infrastructure pricing through Credex.
      </p>
      <Button className="bg-white text-green-900 hover:bg-gray-100 font-bold px-8 py-6 text-lg rounded-xl">
        Book a Free Credex Consultation
      </Button>
    </div>
  );
}
