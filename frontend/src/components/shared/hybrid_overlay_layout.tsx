import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

interface HybridOverlayLayoutProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerActions?: React.ReactNode;
  mainContent: React.ReactNode;
  detailContent: React.ReactNode;
  isDetailOpen: boolean;
  onDetailOpenChange: (open: boolean) => void;
  mainTitle?: string;
  detailTitle?: string;
  defaultOverlayWidth?: number;
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
}: HybridOverlayLayoutProps) {
  const [overlayWidth, setOverlayWidth] = useState(defaultOverlayWidth);
  const [isResizingState, setIsResizingState] = useState(false);
  const isMobile = useIsMobile();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const frameId = useRef<number | null>(null);
  const containerRectCache = useRef<DOMRect | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || !containerRectCache.current) return;
    if (frameId.current) return;

    frameId.current = requestAnimationFrame(() => {
      frameId.current = null;
      if (!containerRectCache.current) return;

      const newWidth = containerRectCache.current.right - e.clientX;
      const maxWidth = containerRectCache.current.width * 0.7;
      
      let finalWidth = newWidth;
      if (newWidth <= 300) finalWidth = 300;
      if (newWidth >= maxWidth) finalWidth = maxWidth;
      
      setOverlayWidth(finalWidth);
    });
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    setIsResizingState(false);
    
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
      frameId.current = null;
    }

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [handleMouseMove]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    e.preventDefault();
    if (containerRef.current) {
      containerRectCache.current = containerRef.current.getBoundingClientRect();
    }
    isResizing.current = true;
    setIsResizingState(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [isMobile, handleMouseMove, stopResizing]);

  useEffect(() => {
    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [handleMouseMove, stopResizing]);

  return (
    <div className="h-full flex flex-col overflow-hidden px-0 py-0 relative select-none">
      {/* HEADER SECTION */}
      <div className="mb-6 px-0 flex items-center justify-between shrink-0 w-full">
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
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-none border-stone-200/20 bg-stone-50/5 hover:bg-stone-50/10 h-8 px-3"
            onClick={() => onDetailOpenChange(!isDetailOpen)}
          >
            {isDetailOpen ? "Đóng chi tiết" : "Mở chi tiết"}
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 relative overflow-hidden border-t flex flex-col lg:block">
        {/* MAIN CONTENT AREA */}
        <div 
          className={cn(
            "bg-background flex flex-col border-b lg:border-b-0 transition-all duration-300",
            isMobile && isDetailOpen ? "h-[40%] shrink-0" : "h-full w-full lg:absolute lg:inset-0"
          )}
        >
          <div className="h-10 px-4 border-b bg-stone-50/50 flex items-center shrink-0">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{mainTitle}</h3>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            {mainContent}
          </div>
        </div>

        {/* DETAIL AREA */}
        <div 
          className={cn(
            "bg-background transition-all duration-300 flex flex-col overflow-hidden",
            "lg:absolute lg:top-0 lg:right-0 lg:h-full lg:border-l lg:shadow-2xl lg:z-50",
            isMobile ? (isDetailOpen ? "flex-1 border-t" : "h-0 border-t-0") : "",
            !isMobile && (isDetailOpen ? "lg:translate-x-0" : "lg:translate-x-full")
          )}
          style={{ 
            width: !isMobile ? `${overlayWidth}px` : "100%",
            transitionProperty: isResizingState ? "none" : "all" 
          }}
        >
          {/* RESIZE HANDLE */}
          {!isMobile && (
            <div 
              className={cn(
                "absolute left-0 top-0 w-4 h-full cursor-col-resize transition-colors -translate-x-1/2 z-50",
                isResizingState ? "bg-primary/20" : "hover:bg-primary/10"
              )}
              onMouseDown={startResizing}
            />
          )}

          <div className="h-10 px-4 border-b sticky top-0 bg-stone-50/50 z-10 flex justify-between items-center shrink-0">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{detailTitle}</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none" onClick={() => onDetailOpenChange(false)}>
              &times;
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar">
            {detailContent}
          </div>
        </div>
      </div>
    </div>
  );
}
