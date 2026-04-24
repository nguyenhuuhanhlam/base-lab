import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
};

export function AppHeader({ isCollapsed, setIsCollapsed }: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 md:px-6 bg-background border-b border-border">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        {/* User profile avatar */}
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium text-sm">
          U
        </div>
      </div>
    </header>
  );
}
