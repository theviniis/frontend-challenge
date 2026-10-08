import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SearchInput({
  value,
  onSearch,
}: {
  value: string;
  onSearch: (q: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <form
      role="search"
      className="flex min-w-0 flex-1 gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(draft.trim());
      }}
    >
      <Input
        type="search"
        aria-label="Buscar NFTs"
        placeholder="Explorar coleções"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <Button type="submit" variant="outline" className="hidden md:inline-flex">
        Buscar
      </Button>
      {value && (
        <Button
          type="button"
          variant="ghost"
          aria-label="Limpar busca"
          onClick={() => {
            setDraft('');
            onSearch('');
          }}
        >
          ×
        </Button>
      )}
    </form>
  );
}
