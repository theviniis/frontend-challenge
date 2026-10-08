import { Link } from '@tanstack/react-router';

export function Logo() {
  return (
    <Link
      to="/"
      search={{ sort: 'relevance', page: 1 }}
      className="text-body-sm w-40 leading-[34.3px] font-bold tracking-[1.4px]"
    >
      KURIO
    </Link>
  );
}
