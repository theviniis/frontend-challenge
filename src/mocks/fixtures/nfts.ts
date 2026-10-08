import type { Nft, Rarity } from '@/lib/http/schemas';
import { percentOf } from '@/lib/money';

export const NFT_CATEGORIES: readonly string[] = [
  'Arte digital',
  'Fotografia',
  'Música',
  'Arte 3D',
  'Utilidade',
  'Colecionáveis',
  'Generativa',
  'Jogos',
  'Assinaturas',
];

export const NFT_IMAGES: readonly string[] = [
  '/assets/nft/golden-signal-160.png',
  '/assets/nft/sage-nomad-009.png',
  '/assets/nft/golden-frequency-071.png',
  '/assets/nft/violet-nomad-314.png',
];

type HeroDef = {
  slug: string;
  num: number;
  price: string;
  available?: number;
};

const HEROES: readonly HeroDef[] = [
  { slug: 'golden-signal', num: 160, price: '0.99', available: 8 },
  { slug: 'sage-nomad', num: 9, price: '0.02' },
  { slug: 'golden-frequency', num: 71, price: '0.02' },
  { slug: 'violet-nomad', num: 314, price: '0.02' },
  { slug: 'golden-beat', num: 207, price: '0.02' },
  { slug: 'crimson-echo', num: 451, price: '12.30' },
];

const GENERATED_SLUGS: readonly string[] = [
  'amber-drift',
  'cobalt-wave',
  'ember-ridge',
  'solar-harbor',
  'lunar-bloom',
  'coral-depth',
  'onyx-garden',
  'ivory-signal',
  'teal-motion',
  'ruby-circuit',
  'mint-lagoon',
  'slate-echo',
  'pearl-vista',
  'copper-rush',
  'indigo-fable',
  'jade-orbit',
  'crimson-tide',
  'bronze-pulse',
];

const PRICES: readonly string[] = [
  '0.02',
  '0.06',
  '0.11',
  '0.18',
  '0.27',
  '0.45',
  '0.72',
  '1.10',
  '1.85',
  '2.40',
  '3.60',
  '6.50',
  '12.30',
];

const EDITION_TOTALS: readonly number[] = [1, 10, 25, 50, 100];

const SOLD_OUT = new Set([11, 34, 57]);

const NOT_EDITABLE = new Set([7, 19, 46]);

const CREATORS: readonly { id: string; name: string }[] = [
  { id: 'cr_kurio_studio', name: 'Kurio Studio' },
  { id: 'cr_kurio_lab', name: 'Kurio Lab' },
];

const BACKDROPS: readonly string[] = ['Âmbar', 'Cobalto', 'Coral', 'Violeta'];

const STROKES: readonly string[] = [
  'Nítido',
  'Granulado',
  'Fluido',
  'Geométrico',
];

const BASE_TIME = Date.UTC(2026, 7, 1, 12, 0, 0);

const DAY_MS = 86_400_000;

const pad = (n: number): string => String(n).padStart(3, '0');

const titleCase = (slug: string): string =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const categoriesAt = (i: number): string[] => {
  const picked = [NFT_CATEGORIES[i % 5], NFT_CATEGORIES[Math.floor(i / 5) % 5]];
  if (i % 7 === 0) picked.push(NFT_CATEGORIES[(i + 3) % 5]);
  if (i >= 6) picked.push(NFT_CATEGORIES[5 + (i % 4)]);
  return picked.filter((value, index) => picked.indexOf(value) === index);
};

const isoAt = (i: number): string =>
  new Date(BASE_TIME + i * DAY_MS).toISOString();

const buildNft = (i: number): Nft => {
  const hero = HEROES[i];
  const slug = hero ? hero.slug : GENERATED_SLUGS[i % GENERATED_SLUGS.length];
  const num = hero ? hero.num : i;
  const id = hero ? `${slug}-${pad(num)}` : `kurio-${slug}-${pad(num)}`;
  const name = `${titleCase(slug)} #${pad(num)}`;
  const collection = i % 2 === 0 ? 'Kurio Editions' : 'Kurio Apes';
  const creator = CREATORS[i % 2];
  const total = EDITION_TOTALS[(i + 1) % EDITION_TOTALS.length];
  const current = 1 + (i % total);
  const price = hero ? hero.price : PRICES[(i * 7) % PRICES.length];
  const stock = Math.min(total, 1 + (i % 10));
  const available = SOLD_OUT.has(i) ? 0 : (hero?.available ?? stock);
  const image = NFT_IMAGES[i % NFT_IMAGES.length];
  const iso = isoAt(i);
  const rarity: Rarity = total === 1 ? 'ÚNICO' : i % 7 === 0 ? 'RARO' : 'COMUM';
  return {
    id,
    name,
    collection,
    creator: { ...creator },
    edition: { current, total },
    price,
    ...(i % 6 === 0 ? { previousPrice: percentOf(price, 120) } : {}),
    categories: categoriesAt(i),
    network: (['ethereum', 'polygon', 'solana'] as const)[i % 3],
    image,
    images: [image],
    description: `${name} — exemplar ${current} de ${total} da coleção ${collection}.`,
    editable: !NOT_EDITABLE.has(i),
    available,
    favoritesCount: (i * 7) % 130,
    rarity,
    attributes: [
      { trait: 'Fundo', value: BACKDROPS[i % 4] },
      { trait: 'Traço', value: STROKES[(i * 3) % 4] },
    ],
    version: 1,
    updatedAt: iso,
    createdAt: iso,
  };
};

const buildNfts = (): Nft[] =>
  Array.from({ length: 64 }, (_, i) => buildNft(i));

export const SEED_NFTS: Nft[] = buildNfts();

export const getSeedNft = (id: string): Nft => {
  const nft = SEED_NFTS.find((item) => item.id === id);
  if (!nft) throw new Error(`Fixture de NFT ausente: ${id}`);
  return nft;
};
