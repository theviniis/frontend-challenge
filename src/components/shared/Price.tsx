import { displayEth } from '@/lib/money';

export function Price({
  value,
  previousPrice,
}: {
  value: string;
  previousPrice?: string;
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className={previousPrice ? 'text-coral' : 'text-foreground'}>
        {displayEth(value)}
      </span>
      {previousPrice && (
        <del className="text-text-secondary text-tiny">
          {displayEth(previousPrice)}
        </del>
      )}
    </span>
  );
}
