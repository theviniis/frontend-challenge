import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ethSchema } from '@/lib/http/schemas';
import { cmpEth } from '@/lib/money';
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
  const [error, setError] = useState('');
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
    onChange({ minPrice: min || undefined, maxPrice: max || undefined });
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
      <fieldset className="border-border space-y-4 border-t pt-6">
        <legend className="text-body-lg font-bold">Faixa de preço</legend>
        <div className="grid grid-cols-2 gap-3">
          <label
            className="text-tiny text-text-secondary"
            htmlFor={`${id}-min`}
          >
            Mínimo (ETH)
            <Input
              id={`${id}-min`}
              className="mt-2"
              inputMode="decimal"
              value={min}
              placeholder="0.02"
              onChange={(event) => setMin(event.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
            />
          </label>
          <label
            className="text-tiny text-text-secondary"
            htmlFor={`${id}-max`}
          >
            Máximo (ETH)
            <Input
              id={`${id}-max`}
              className="mt-2"
              inputMode="decimal"
              value={max}
              placeholder="12.30"
              onChange={(event) => setMax(event.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
            />
          </label>
        </div>
        {error && (
          <p id={`${id}-error`} className="text-tiny text-coral" role="alert">
            {error}
          </p>
        )}
        <Button className="w-full" onClick={applyPrice}>
          Aplicar preço
        </Button>
      </fieldset>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setMin('');
          setMax('');
          setError('');
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
