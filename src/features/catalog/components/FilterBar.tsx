import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ethSchema } from '@/lib/http/schemas';
import {
  cmpEth,
  ethToPriceStep,
  priceStepToEth,
  priceSliderLimit,
  formatPriceRangeValue,
} from '@/lib/money';
import type { CatalogFilterState } from '../search-params';

const categories = [
  'Arte digital',
  'Fotografia',
  'Música',
  'Arte 3D',
  'Colecionáveis',
  'Generativa',
  'Jogos',
  'Assinaturas',
  'Utilidade',
];

export function FilterBar({
  filters,
  onChange,
}: {
  filters: CatalogFilterState;
  onChange: (next: Partial<CatalogFilterState>) => void;
}) {
  const id = useId();
  const [min, setMin] = useState(filters.minPrice ?? '');
  const [max, setMax] = useState(filters.maxPrice ?? '');
  const [edited, setEdited] = useState([false, false]);
  const limit = priceSliderLimit(filters.minPrice, filters.maxPrice);
  const [announcement, setAnnouncement] = useState('');
  const [error, setError] = useState('');
  const prices = [min || '0', max || limit];
  const positions = prices.map(ethToPriceStep);
  const rangeText = `Preço: ${formatPriceRangeValue(prices[0])} - ${formatPriceRangeValue(prices[1])} ETH`;
  function applyPrice() {
    if (
      (min && !ethSchema.safeParse(min).success) ||
      (max && !ethSchema.safeParse(max).success)
    ) {
      setError('Informe preços decimais válidos, por exemplo 0.02.');
      return;
    }
    if (min && max && cmpEth(min, max) > 0) {
      setError('O preço mínimo deve ser menor ou igual ao máximo.');
      return;
    }
    setError('');
    onChange({
      minPrice: !min || (edited[0] && cmpEth(min, '0') === 0) ? undefined : min,
      maxPrice:
        !max || (edited[1] && cmpEth(max, limit) === 0) ? undefined : max,
    });
  }
  return (
    <div className="border-border bg-surface-card space-y-8 rounded-lg border p-5">
      <fieldset className="space-y-4">
        <legend className="text-body-lg mb-5 font-bold">Coleções</legend>
        {categories.map((category) => (
          <label
            key={category}
            className="text-body-sm text-text-secondary flex cursor-pointer items-center gap-3"
          >
            <input
              type="checkbox"
              className="accent-primary size-4"
              checked={filters.categories?.includes(category) ?? false}
              onChange={(event) => {
                const selected = event.target.checked
                  ? [...(filters.categories ?? []), category]
                  : filters.categories?.filter((value) => value !== category);
                onChange({
                  categories: selected?.length ? selected : undefined,
                });
              }}
            />
            {category}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend className="text-title font-bold">Faixa de preço</legend>
        <Slider
          min={0}
          max={ethToPriceStep(limit)}
          step={1}
          value={positions}
          thumbLabels={['Preço mínimo', 'Preço máximo']}
          thumbValueTexts={prices.map(
            (price) => `${formatPriceRangeValue(price)} ETH`
          )}
          aria-describedby={error ? `${id}-error` : `${id}-range`}
          aria-invalid={!!error}
          onValueChange={(next) => {
            if (next[0] !== positions[0]) setMin(priceStepToEth(next[0]));
            if (next[1] !== positions[1]) setMax(priceStepToEth(next[1]));
            setEdited((previous) => [
              previous[0] || next[0] !== positions[0],
              previous[1] || next[1] !== positions[1],
            ]);
            setError('');
          }}
          onValueCommit={(next) =>
            setAnnouncement(
              `Preço: ${next.map((position, index) => formatPriceRangeValue(position === positions[index] ? prices[index] : priceStepToEth(position))).join(' - ')} ETH`
            )
          }
        />
        <p
          id={`${id}-range`}
          className="text-body-lg text-foreground mt-1 break-words"
        >
          {rangeText}
        </p>
        <span className="sr-only" aria-live="polite">
          {announcement}
        </span>
        {error && (
          <p id={`${id}-error`} className="text-tiny text-coral" role="alert">
            {error}
          </p>
        )}
        <Button
          className="mt-2"
          style={{ fontSize: 'var(--text-body-lg)' }}
          onClick={applyPrice}
        >
          Aplicar
        </Button>
      </fieldset>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setMin('');
          setMax('');
          setEdited([false, false]);
          setError('');
          setAnnouncement('Filtros limpos');
          onChange({
            q: undefined,
            categories: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            sort: 'relevance',
          });
        }}
      >
        Limpar filtros
      </Button>
    </div>
  );
}
