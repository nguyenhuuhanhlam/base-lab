import { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

interface HybridOverlayLayoutProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  headerActions?: ReactNode;
  mainContent: ReactNode;
  detailContent: ReactNode;
  isDetailOpen: boolean;
  onDetailOpenChange: (open: boolean) => void;
  mainTitle?: string;
  detailTitle?: string;
  defaultOverlayWidth?: number;
  toolbar?: (ctx: { isDetailOpen: boolean; onToggle: () => void }) => ReactNode;
}

export function HybridOverlayLayout({
  title,
  subtitle,
  icon,
  headerActions,
  mainContent,
  detailContent,
  isDetailOpen,
  onDetailOpenChange,
  mainTitle = "Danh sách",
  detailTitle = "Chi tiết",
  defaultOverlayWidth = 450,
  toolbar,
}: HybridOverlayLayoutProps) {
  const [overlayWidth, setOverlayWidth] = useState(defaultOverlayWidth);
  const [isResizing, setIsResizing] = useState(false);
  const isMobile = useIsMobile();

  const containerRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);
  const frameId = useRef<number | null>(null);
  const rectCache = useRef<DOMRect | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!resizingRef.current || !rectCache.current || frameId.current) return;
      frameId.current = requestAnimationFrame(() => {
        frameId.current = null;
        if (!rectCache.current) return;
        const max = rectCache.current.width * 0.7;
        setOverlayWidth(Math.min(Math.max(rectCache.current.right - e.clientX, 300), max));
      });
    };

    const onUp = () => {
      resizingRef.current = false;
      setIsResizing(false);
      if (frameId.current) { cancelAnimationFrame(frameId.current); frameId.current = null; }
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, []);

  const startResizing = (e: React.MouseEvent) => {
    if (isMobile) return;
    e.preventDefault();
    rectCache.current = containerRef.current?.getBoundingClientRect() ?? null;
    resizingRef.current = true;
    setIsResizing(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden relative select-none">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          {icon && (
            <div className="size-10 bg-stone-200/10 border border-stone-200/20 rounded-xl flex items-center justify-center text-primary shadow-inner shrink-0">
              {icon}
            </div>
          )}
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-sm font-bold tracking-tight text-foreground truncate">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {headerActions}
          {toolbar
            ? toolbar({ isDetailOpen, onToggle: () => onDetailOpenChange(!isDetailOpen) })
            : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-none border-stone-200/20 bg-stone-50/5 hover:bg-stone-50/10 h-8 px-3"
                onClick={() => onDetailOpenChange(!isDetailOpen)}
              >
                {isDetailOpen ? "Đóng chi tiết" : "Mở chi tiết"}
              </Button>
            )}
        </div>
      </div>

      <div ref={containerRef} className="flex-1 relative overflow-hidden flex flex-col lg:block">
        {/* MAIN */}
        <div className={cn(
          "bg-background flex flex-col border-b lg:border-b-0 transition-all duration-300",
          isMobile && isDetailOpen ? "h-[40%] shrink-0" : "h-full w-full lg:absolute lg:inset-0"
        )}>
          <div className="flex-1 overflow-auto custom-scrollbar"><div className="py-4">{mainContent}</div></div>
        </div>

        {/* DETAIL */}
        <div
          className={cn(
            "bg-background transition-all duration-300 flex flex-col overflow-hidden",
            "lg:absolute lg:top-0 lg:right-0 lg:h-full lg:border-l lg:shadow-2xl lg:z-50",
            isMobile
              ? isDetailOpen ? "flex-1 border-t" : "h-0 border-t-0"
              : isDetailOpen ? "lg:translate-x-0" : "lg:translate-x-full"
          )}
          style={{
            width: isMobile ? "100%" : `${overlayWidth}px`,
            transitionProperty: isResizing ? "none" : "all",
          }}
        >
          {!isMobile && (
            <div
              className={cn(
                "absolute left-0 top-0 w-4 h-full cursor-col-resize -translate-x-1/2 z-50 transition-colors",
                isResizing ? "bg-primary/20" : "hover:bg-primary/10"
              )}
              onMouseDown={startResizing}
            />
          )}
          <div className="flex-1 overflow-auto custom-scrollbar">{detailContent}</div>
        </div>
      </div>
    </div>
  );
}


