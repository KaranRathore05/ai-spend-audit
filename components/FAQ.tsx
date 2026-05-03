export function FAQ() {
  const faqs = [
    {
      q: "Is this free?",
      a: "Yes. The audit is completely free and does not require a login or credit card."
    },
    {
      q: "Do I need to enter my email?",
      a: "No. Email is only requested after your results are shown so you can save and share the report."
    },
    {
      q: "Is the audit financial advice?",
      a: "No. It is an estimate based on public pricing and plan-fit rules. You should verify your actual usage before making changes."
    },
    {
      q: "Why does Credex appear in the results?",
      a: "Credex helps companies access discounted AI infrastructure credits when savings opportunities are large. We built this tool to help founders."
    },
    {
      q: "Will you show my company or email on public reports?",
      a: "No. Public report URLs strip all identifying details and show only the anonymized tools, recommendations, and savings."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h4 className="text-lg font-bold text-white mb-2">{faq.q}</h4>
            <p className="text-gray-400">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
