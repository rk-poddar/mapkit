export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Map Kit home">
        <span className="brand-mark">M</span>
        Map Kit
      </a>
      <nav aria-label="Primary navigation">
        <a href="/docs/installation">Docs</a>
        <a href="/components">Components</a>
        <a href="/docs/engines">Engines</a>
        <a href="/docs/registry">Registry</a>
      </nav>
    </header>
  );
}
