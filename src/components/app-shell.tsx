import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { to: "/", label: "Dashboard", dot: "bg-mint" },
      { to: "/email", label: "Email Generator", dot: "bg-mint" },
      { to: "/notes", label: "Meeting Notes", dot: "bg-amber" },
    ],
  },
  {
    label: "Assistants",
    items: [
      { to: "/planner", label: "Task Planner", dot: "bg-azure" },
      { to: "/research", label: "Research", dot: "bg-lilac" },
      { to: "/chat", label: "Chat", dot: "bg-mint" },
    ],
  },
] as const;

type NavProps = { onNavigate?: (() => void) | undefined };

function NavList({ onNavigate }: NavProps) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-2">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <div className="label-eyebrow px-2 pt-4 pb-1.5 first:pt-0">{group.label}</div>
          {group.items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              activeOptions={{ exact: item.to === "/" }}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-dim transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
              activeProps={{
                className:
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium bg-mint/10 text-mint outline-1 -outline-offset-1 outline-mint/20",
              }}
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${isActive ? item.dot : "bg-faint"}`}
                  />
                  {item.label}
                </>
              )}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: NavProps) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid size-7 place-items-center rounded-md bg-gradient-to-br from-mint to-mint/20 outline-1 -outline-offset-1 outline-mint/30">
          <span className="font-mono text-sm font-semibold text-ground">M</span>
        </div>
        <div className="leading-none">
          <div className="text-sm font-semibold tracking-tight">Meridian</div>
          <div className="mt-1 text-[10px] text-dim">Workplace Assistant</div>
        </div>
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="flex items-center gap-2.5 border-t border-edge px-4 py-3">
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-edge font-mono text-[11px] text-dim">
          AK
        </div>
        <div className="leading-tight">
          <div className="text-xs font-medium">Ada Kline</div>
          <div className="text-[10px] text-dim">Operations Lead</div>
        </div>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-edge bg-panel/40 lg:flex">
        <SidebarBody />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ground/70 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-edge bg-panel animate-fade-in">
            <SidebarBody onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <main className="relative min-w-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-20 size-[560px] rounded-full bg-mint/15 blur-[120px]" />
          <div className="absolute top-10 right-0 size-[480px] rounded-full bg-amber/10 blur-[130px]" />
          <div className="absolute bottom-0 left-1/3 size-[520px] rounded-full bg-azure/10 blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-[1400px] px-5 py-6 sm:px-8 lg:px-10 lg:py-7">
          <button
            onClick={() => setOpen((v) => !v)}
            className="mb-5 inline-flex items-center gap-2 rounded-lg bg-panel/60 px-3 py-2 text-xs text-dim outline-1 -outline-offset-1 outline-border backdrop-blur-md transition-colors hover:text-foreground lg:hidden"
          >
            {open ? <X className="size-3.5" /> : <Menu className="size-3.5" />}
            Menu
          </button>
          {children}
        </div>
      </main>
    </div>
  );
}
