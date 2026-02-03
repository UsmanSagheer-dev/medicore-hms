import TokenCard from '@/components/ui/TokenCard';
import { TokenData } from '@/types/token';

interface LiveTokenDisplayProps {
  tokens: TokenData[];
}

function LiveTokenDisplay({ tokens }: LiveTokenDisplayProps) {
  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4 p-4 bg-gray-50 border-l border-gray-200 overflow-y-auto h-full rounded-lg">
      <div className="flex flex-col gap-4 items-center">
        {tokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-lg font-medium">No tokens generated</p>
            <p className="text-sm">Patient tokens will appear here after registration</p>
          </div>
        ) : (
          tokens.map((token) => (
            <TokenCard key={token.tokenNo} {...token} />
          ))
        )}
      </div>
    </div>
  );
}

export default LiveTokenDisplay;
