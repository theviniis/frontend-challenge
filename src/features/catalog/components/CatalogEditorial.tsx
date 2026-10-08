import { Link } from '@tanstack/react-router';
import type { CatalogFilterState } from '../search-params';

export function CatalogEditorial() {
  const articles = [
    [
      'golden-frequency-071',
      'Como funciona a propriedade de NFTs',
      'Aprenda a colecionar, negociar e verificar ativos digitais.',
    ],
    [
      'golden-signal-160',
      '10 artistas digitais para acompanhar',
      'Conheça criadores que moldam a cultura digital.',
    ],
    [
      'sage-nomad-009',
      'Raridade, atributos e procedência',
      'Entenda raridade, procedência, direitos autorais e utilidade.',
    ],
    [
      'violet-nomad-314',
      'Como proteger sua carteira',
      'Proteja sua carteira, seus ativos e sua identidade.',
    ],
  ];
  return (
    <div className="hidden md:block">
      <section
        aria-label="Explore mais"
        className="mt-24 grid grid-cols-2 gap-7"
      >
        {[
          [
            'golden-signal-160',
            'Lançamentos gênesis de edição limitada',
            'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
            'recent',
          ],
          [
            'golden-frequency-071',
            'Arte digital selecionada e muito mais',
            'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.',
            'relevance',
          ],
        ].map(([image, title, description, sort]) => (
          <div
            key={title}
            className="bg-surface-raised flex min-h-[250px] overflow-hidden rounded-lg"
          >
            <img
              src={`/assets/nft/${image}.png`}
              alt=""
              className="w-1/2 object-cover"
              width={1254}
              height={1254}
            />
            <div className="flex flex-1 flex-col items-end justify-center gap-4 p-6 text-right">
              <h2 className="text-body-lg font-bold">{title}</h2>
              <p className="text-tiny text-text-secondary">{description}</p>
              <Link
                to="/"
                search={{ sort: sort as CatalogFilterState['sort'], page: 1 }}
                className="bg-primary text-tiny text-ink rounded px-4 py-2 font-bold"
              >
                Explorar →
              </Link>
            </div>
          </div>
        ))}
      </section>
      <section id="diario" className="mt-24">
        <h2 className="text-h1 font-bold">Diário da Cunhagem</h2>
        <p className="text-body-sm text-text-secondary mt-3">
          Histórias, guias e insights para colecionadores sobre o universo da
          propriedade digital.
        </p>
        <div className="mt-10 grid grid-cols-4 gap-6">
          {articles.map(([image, title, description], index) => (
            <article
              key={title}
              className="bg-surface-card overflow-hidden rounded-lg"
            >
              <img
                src={`/assets/nft/${image}.png`}
                alt=""
                className="h-[195px] w-full object-cover"
                width={1254}
                height={1254}
                loading="lazy"
              />
              <div className="space-y-3 p-4">
                <p className="text-tiny text-text-secondary">
                  {[12, 13, 15, 15][index]} de setembro | Leitura de{' '}
                  {[6, 2, 3, 2][index]} min
                </p>
                <h3 className="text-body-lg font-bold">{title}</h3>
                <p className="text-tiny text-text-secondary">{description}</p>
                <span
                  aria-disabled="true"
                  className="text-tiny text-text-accent"
                >
                  Ler mais →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
