"use client";

const TICKER_ITEMS = [
  { text: "Rahul K. Won ₹1,25,000 on Kalyan Matka 🔥", hot: true },
  { text: "Vikram S. Withdrew ₹85,000", hot: false },
  { text: "Pooja M. BIG WIN on Rajdhani Night", hot: true },
  { text: "Amit D. Claimed VIP Reward", hot: false },
  { text: "Suresh P. 99% Return on Main Bazar", hot: false },
  { text: "Rajesh V. ⚡ HIGH REWARD", hot: true },
  { text: "Neha M. Won ₹50,000", hot: false },
];

export function RecentSpinsTicker() {
  return (
    <div className="w-full bg-black/80 border-b border-white/10 overflow-hidden py-2 absolute top-0 left-0 z-50 flex items-center backdrop-blur-md">
      <div className="absolute left-0 w-24 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 w-24 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
      <div className="flex w-max">
        <div className="flex shrink-0 animate-marquee whitespace-nowrap text-xs md:text-sm font-semibold tracking-wider uppercase">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div 
              key={`first-${i}`} 
              className={`mx-8 flex items-center gap-2 ${item.hot ? 'text-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'text-neon-blue drop-shadow-[0_0_2px_rgba(0,243,255,0.4)]'}`}
            >
              {item.text}
              <span className="text-white/20 mx-4 drop-shadow-none">•</span>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 animate-marquee whitespace-nowrap text-xs md:text-sm font-semibold tracking-wider uppercase" aria-hidden="true">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div 
              key={`second-${i}`} 
              className={`mx-8 flex items-center gap-2 ${item.hot ? 'text-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'text-neon-blue drop-shadow-[0_0_2px_rgba(0,243,255,0.4)]'}`}
            >
              {item.text}
              <span className="text-white/20 mx-4 drop-shadow-none">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
