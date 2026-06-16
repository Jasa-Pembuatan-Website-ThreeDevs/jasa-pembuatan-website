export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-xs text-zinc-600">
          &copy; {year} ThreeDevs. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-xs text-zinc-600">
          <a href="/about" className="transition-colors hover:text-zinc-300">
            About
          </a>
          <a href="/portfolio" className="transition-colors hover:text-zinc-300">
            Portfolio
          </a>
          <a href="/team" className="transition-colors hover:text-zinc-300">
            Team
          </a>
          <a href="/track-order" className="transition-colors hover:text-zinc-300">
            Track Order
          </a>
        </div>
      </div>
    </footer>
  );
}
