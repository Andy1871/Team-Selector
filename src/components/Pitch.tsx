export default function Pitch() {
    return (
      <div className="relative w-full max-w-4xl aspect-2/3 rounded-2xl border-4 border-green-700 overflow-hidden bg-green-600">

        <div className="absolute inset-0 grid grid-cols-5 grid-rows-6">
          {Array.from({ length: 6 * 5 }).map((_, i) => {
            const row = Math.floor(i / 5) + 1; 
            const col = (i % 5) + 1;           
  
            
            const hideDot =
              (row === 6 && [1, 2, 4, 5].includes(col)) ||
              (row === 1 && [1, 5].includes(col));
  
            return (
              <div key={i} className="relative border-white/10">
                {!hideDot && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center select-none">
                    {/* <div className="mt-1 text-[13px] text-white">Player Name</div>  */}
                    <div className="w-5 h-5 rounded-full border-2 border-green-700 bg-gray-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  