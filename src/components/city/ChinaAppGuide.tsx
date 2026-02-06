'use client'

interface ChinaAppGuideProps {
  countryCode: string
}

export function ChinaAppGuide({ countryCode }: ChinaAppGuideProps) {
  if (countryCode !== 'cn') return null

  const tips = [
    {
      icon: '\uD83D\uDCB3',
      title: 'Payment',
      text: 'Visa/Mastercard rarely work. Set up **Alipay** immediately.',
    },
    {
      icon: '\uD83D\uDDFA\uFE0F',
      title: 'Maps',
      text: 'Google Maps is blocked. Use **Apple Maps** or **Gaode**.',
    },
    {
      icon: '\uD83C\uDF10',
      title: 'Internet',
      text: 'Gmail, IG, and WhatsApp are blocked. You NEED a **VPN** (LetsVPN/Astrill) before you arrive.',
    },
    {
      icon: '\uD83D\uDE97',
      title: 'Transport',
      text: 'Uber is gone. Use **Didi** (inside Alipay).',
    },
  ]

  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
      <div className="border-2 border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/30 rounded-[2rem] p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-black text-amber-800 dark:text-amber-300 mb-6 tracking-tight">
          {'\uD83C\uDDE8\uD83C\uDDF3'} Essential China Survival Guide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="flex gap-4 items-start bg-white dark:bg-slate-900/60 rounded-2xl p-5 border border-amber-200 dark:border-amber-800/40"
            >
              <span className="text-2xl flex-shrink-0">{tip.icon}</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  {tip.title}
                </h3>
                <p
                  className="text-slate-600 dark:text-slate-400 mt-1 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: tip.text.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="text-amber-700 dark:text-amber-400">$1</strong>'
                    ),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
