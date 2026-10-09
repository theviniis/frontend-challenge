import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Nft } from '@/types/api';
import { NFTCard } from '@/components/shared/NFTCard';
import { NFTCardSkeleton } from '@/components/shared/NFTCardSkeleton';
import { Carousel, type CarouselState } from '@/components/shared/Carousel';
import { ErrorState } from '@/components/shared/ErrorState';
import { collectionOptions } from '../queries';

export default function NftDesktopSections({
  nft,
  userId,
}: {
  nft: Nft;
  userId?: string;
}) {
  const [tab, setTab] = useState<'details' | 'reviews'>('details');
  const recommendations = useQuery(collectionOptions(nft.collection, userId));
  const related =
    recommendations.data?.items.filter(
      (item) => item.id !== nft.id && item.collection === nft.collection
    ) ?? [];
  return (
    <div className="mt-24 space-y-24">
      <section aria-label="Mais informações">
        <div
          role="tablist"
          aria-label="Detalhes e avaliações"
          className="border-border mb-3 flex gap-8 border-b"
        >
          {(['details', 'reviews'] as const)
            .filter((id) => id === 'details' || !!nft.reviews)
            .map((id) => (
              <button
                key={id}
                type="button"
                id={`tab-${id}`}
                role="tab"
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                tabIndex={tab === id ? 0 : -1}
                onClick={() => setTab(id)}
                onKeyDown={(event) => {
                  if (
                    nft.reviews &&
                    ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(
                      event.key
                    )
                  ) {
                    event.preventDefault();
                    const next =
                      event.key === 'Home'
                        ? 'details'
                        : event.key === 'End'
                          ? 'reviews'
                          : id === 'details'
                            ? 'reviews'
                            : 'details';
                    setTab(next);
                    document.getElementById(`tab-${next}`)?.focus();
                  }
                }}
                className={`text-body-17-bold pb-2 ${tab === id ? 'border-primary text-text-accent border-b-2 font-bold' : 'text-foreground'}`}
              >
                {id === 'details'
                  ? 'Detalhes do NFT'
                  : `Avaliações de colecionadores (${nft.reviews?.count})`}
              </button>
            ))}
        </div>
        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          tabIndex={0}
          className="text-text-secondary space-y-4 text-sm leading-6"
        >
          {tab === 'details' ? (
            <>
              {(nft.details ?? nft.description)
                .split('\n')
                .map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              <p>
                <strong className="text-foreground">Rede:</strong>
                <br />
                {nft.network}
              </p>
              {nft.contract && (
                <>
                  <p>
                    <strong className="text-foreground">Contrato:</strong>
                    <br />
                    Direitos autorais do criador: {nft.contract.royalties}% nas
                    vendas secundárias.
                  </p>
                  <p className="break-all">
                    {nft.contract.address} · {nft.contract.standard}
                    {nft.contract.verified && ' verificado'}
                  </p>
                </>
              )}
            </>
          ) : nft.reviews?.items.length ? (
            nft.reviews.items.map((review) => (
              <article key={review.id} className="border-border border-b pb-4">
                <p className="text-foreground font-bold">
                  {review.author} · {review.rating}/5
                </p>
                <p>{review.comment}</p>
                <time dateTime={review.date}>
                  {new Date(review.date).toLocaleDateString('pt-BR')}
                </time>
              </article>
            ))
          ) : (
            <p>Nenhuma avaliação disponível ainda.</p>
          )}
        </div>
      </section>
      <section aria-label="Mais desta coleção">
        <h2 className="border-border text-text-accent text-body-17-bold mb-8 border-b pb-3">
          Mais desta coleção
        </h2>
        {recommendations.isPending ? (
          <div className="grid grid-cols-5 gap-6">
            {Array.from({ length: 5 }, (_, i) => (
              <NFTCardSkeleton key={i} />
            ))}
          </div>
        ) : recommendations.isError ? (
          <ErrorState
            title="Não foi possível carregar a coleção"
            onRetry={() => void recommendations.refetch()}
          />
        ) : related.length ? (
          <Carousel options={{ align: 'start', containScroll: false }}>
            {(carousel) => (
              <CollectionCarousel items={related} carousel={carousel} />
            )}
          </Carousel>
        ) : (
          <p className="text-text-secondary">
            Nenhum outro NFT desta coleção disponível.
          </p>
        )}
      </section>
    </div>
  );
}

function CollectionCarousel({
  items,
  carousel,
}: {
  items: Nft[];
  carousel: CarouselState;
}) {
  const { viewportRef, selected, snapCount, scrollTo } = carousel;
  const pageCount = Math.ceil(items.length / 5);
  return (
    <div
      role="region"
      aria-label="NFTs da mesma coleção"
      aria-roledescription="carrossel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          const next =
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? pageCount - 1
                : selected + (event.key === 'ArrowRight' ? 1 : -1);
          scrollTo(Math.max(0, Math.min(pageCount - 1, next)));
        }
      }}
    >
      <div
        ref={viewportRef}
        className="touch-pan-y overflow-hidden"
        onFocusCapture={(event) => {
          const page = (event.target as HTMLElement).closest<HTMLElement>(
            '[data-carousel-page]'
          );
          if (page) scrollTo(Number(page.dataset.carouselPage));
        }}
      >
        <div className="flex gap-6">
          {Array.from({ length: pageCount }, (_, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`Página ${i + 1} de ${pageCount}`}
              data-carousel-page={i}
              aria-hidden={i !== selected}
              inert={i !== selected}
              className="grid min-w-0 flex-[0_0_100%] grid-cols-5 gap-6"

              onDragStart={(event) => event.preventDefault()}
            >
              {items.slice(i * 5, i * 5 + 5).map((item) => (
                <NFTCard key={item.id} nft={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
      {pageCount > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: snapCount || pageCount }, (_, i) => (
            <button
              type="button"
              key={i}
              aria-label={`Ver página ${i + 1} da coleção`}
              aria-pressed={selected === i}
              onClick={() => scrollTo(i)}
              className={`border-primary size-2 rounded-full border ${selected === i ? 'bg-primary' : ''}`}
            />
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Página {selected + 1} de {pageCount} da coleção.
      </p>
    </div>
  );
}
