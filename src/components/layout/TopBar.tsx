'use client';

interface TopBarProps {
  crumbs: string[];
  action?: string;
  onAction?: () => void;
}

export function TopBar({ crumbs, action, onAction }: TopBarProps) {
  return (
    <div
      className="flex items-center justify-between px-10 py-[18px] shrink-0"
      style={{ borderBottom: '1px solid var(--hairline)', background: 'var(--surface)' }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[12.5px]" style={{ color: 'var(--muted)' }}>
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            <span style={{ color: i === crumbs.length - 1 ? 'var(--ink)' : 'var(--muted)' }}>
              {crumb}
            </span>
            {i < crumbs.length - 1 && <span>/</span>}
          </span>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search box */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded text-[12.5px] min-w-[200px]"
          style={{ border: '1px solid var(--hairline)', color: 'var(--muted)' }}
        >
          <span>Search</span>
          <span className="ml-auto font-mono text-[10.5px]">⌘K</span>
        </div>

        {/* Action button */}
        {action && (
          <button
            onClick={onAction}
            className="text-[12.5px] px-3.5 py-2 rounded"
            style={{ background: 'var(--ink)', color: 'var(--paper)', border: 'none', cursor: 'pointer' }}
          >
            {action} →
          </button>
        )}
      </div>
    </div>
  );
}
