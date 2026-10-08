export function CatalogHero() {
  return (
    <section
      className="bg-surface-card relative flex h-47.5 overflow-hidden rounded-lg md:mt-8 md:h-112.5"
      aria-label="Destaque"
    >
      <div className="relative z-10 flex w-[58%] flex-col justify-center p-4 md:w-[calc(100%-450px)] md:justify-start md:px-10 md:py-10.75 md:max-[1100.01px]:w-[65%] md:max-[1100.01px]:p-6">
        <p className="text-[9px] leading-3 tracking-normal md:text-[14px] md:leading-4 md:tracking-widest">
          Bem-vindo à Kurio
        </p>
        <h2 className="md:text-display my-1.75 text-[17px] leading-5.75 font-bold md:mt-2 md:mb-1 md:leading-17.5 md:max-[1100.01px]:text-[32px] md:max-[1100.01px]:leading-12">
          <span className="hidden md:inline">
            SEJA DONO DO FUTURO
            <br />
            DA ARTE DIGITAL
          </span>
          <span className="md:hidden">
            SEJA DONO DA
            <br />
            CULTURA DIGITAL
          </span>
        </h2>
        <p className="text-text-secondary max-w-139.25 text-[10px] leading-3.5 md:text-[14px] md:leading-6">
          <span className="hidden md:inline">
            Descubra NFTs selecionados de criadores emergentes e consagrados.
            Colecione arte digital rara, apoie artistas e tenha uma parte da
            cultura da internet.
          </span>
          <span className="md:hidden">
            Descubra NFTs selecionados de criadores do mundo todo.
          </span>
        </p>
        <a
          href="#catalogo"
          className="bg-primary text-ink md:text-body-sm mt-2.5 w-fit rounded px-3 py-1.5 text-[9px] leading-3 font-bold md:mt-6 md:px-6 md:py-3 md:leading-5.5"
        >
          EXPLORAR →
        </a>
      </div>
      <img
        src="/assets/nft/golden-signal-160.png"
        alt="Golden Signal, arte digital em destaque"
        className="rounded-default aspect-square h-auto w-[38%] self-center object-cover md:aspect-auto md:h-112.5 md:w-112.5 md:self-auto md:rounded-none md:max-[1100.01px]:w-[35%]"
        width={1254}
        height={1254}
        fetchPriority="high"
      />
      <img
        src="/assets/nft/sage-nomad-009.png"
        alt="Sage Nomad"
        className="absolute right-[21%] bottom-7 size-14.5 rounded-md md:hidden"
        width={1254}
        height={1254}
      />
    </section>
  );
}
