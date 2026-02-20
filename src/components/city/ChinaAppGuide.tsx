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
      text: 'Visa/Mastercard rarely work. Cash can be used but is rare. Set up **AliPay and/or Wechat before leaving**. WeChat can be difficult to set up, AliPay is easier and handle everything from payement, transport, food delivery, and more. **Payement is done 99% of the time by QR code**: either point your AliPay QR code to the vendor so he can scan it, or scan the QR code that will be displayed in front of the shop/cashier, enter the correct amount, and show the vendor the screen of your phone to confirm that you did pay'
    },
    {
      icon: '\uD83D\uDDFA\uFE0F',
      title: 'Maps',
      text: 'Google Maps is blocked. Use **Apple Maps** or **Gaode** or **Amap** or **Maps.me** instead. We recommend to have all of them to be sure. Navigating inside the maps can be tricky as a lot ofthe adresses are in Chinese. Be patient'
    },
    {
      icon: '\uD83C\uDF10',
      title: 'Internet',
      text: 'Gmail, IG, and WhatsApp are blocked. You NEED a **VPN** (LetsVPN/Astrill) before you arrive. If your phone can use an eSIM, we recommend looking into it as it is cheap, works well and acts as its own VPN',
    },
    {
      icon: '\uD83D\uDE97',
      title: 'Transport/Booking',
      text: 'Uber is gone. Use **Didi** (inside Alipay). For metros, setup the "Transport" tab: switch to the desire city at the top, then follow the procedure to set up the transport card. Then scan the QR code when entering and leaving the metro. For booking, I strongly recommend using **Trip.com**, from hotel to train tickets. If an hotel is on Trip.com, it will accept foreigner (refusing foreigner is not allowed anymore)'
    },
  ]

  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
      <div className="border-2 border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/30 rounded-[2rem] p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-black text-amber-800 dark:text-amber-300 mb-6 tracking-tight">
          {'\uD83C\uDDE8\uD83C\uDDF3'} Essential China Survival Guide (Setup BEFORE leaving!)
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

        {/* 👇 THE NEW GLOBAL BOX 👇 */}
        <div className="mt-5 flex gap-4 items-start bg-amber-100/50 dark:bg-amber-900/30 rounded-2xl p-5 border border-amber-300 dark:border-amber-700/50">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Prepare before you go
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mt-1 text-sm leading-relaxed">
It can look daunting at first because China uses completely different set of apps. If you take the time to setup the app mentionned above before you leave, you will realise that China digital ecosystem is built on speed and convenience. There's a very high chance that after visiting China you'll wonder why you don't have the same system back home. The truth is you can do the task of 5 different apps we use on AliPay alone, it's a very powerful app. If you really don't care and wanna wing it, I recommend downloading at the very least AliPay and setting it up. You'll be fine with just this honestly.""            </p>
          </div>
        </div>
        {/* 👆 END NEW GLOBAL BOX 👆 */}

      </div>
    </section>
  )
}

