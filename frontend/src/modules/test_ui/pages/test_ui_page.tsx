import { useState } from "react";
import { FlaskConical, Plus, PanelRightOpen, PanelRightClose, Trash2 } from "lucide-react";
import { HybridOverlayLayout } from "@/components/shared/hybrid_overlay_layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Item = { id: number; name: string; status: "active" | "draft" };

const STATUS_LABEL: Record<Item["status"], string> = { active: "Active", draft: "Draft" };
const STATUS_CLASS: Record<Item["status"], string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  draft: "bg-stone-50 text-stone-500 border-stone-200",
};

export default function TestUiPage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Item mẫu #1", status: "active" },
    { id: 2, name: "Item mẫu #2", status: "draft" },
  ]);
  const [selected, setSelected] = useState<Item | null>(null);

  const addItem = () => {
    const id = Date.now();
    const next: Item = { id, name: `Item mẫu #${items.length + 1}`, status: "draft" };
    setItems((prev) => [...prev, next]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selected?.id === id) { setSelected(null); setIsDetailOpen(false); }
  };

  const selectItem = (item: Item) => {
    setSelected(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="h-[calc(100vh-120px)]">
      <HybridOverlayLayout
        title="Test UI Optimized"
        subtitle="Module thử nghiệm cấu trúc Split Overlay & Hybrid Layout"
        icon={<FlaskConical size={20} />}
        isDetailOpen={isDetailOpen}
        onDetailOpenChange={setIsDetailOpen}
        toolbar={({ isDetailOpen, onToggle }) => (
          // selected được đóng gói qua closure
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 rounded-none border-stone-200/20 bg-stone-50/5 hover:bg-stone-50/10"
              onClick={addItem}
              disabled={isDetailOpen}
            >
              <Plus size={14} /> Thêm item
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 rounded-none border-stone-200/20 bg-stone-50/5 hover:bg-stone-50/10"
              onClick={onToggle}
            >
              {isDetailOpen
                ? <><PanelRightClose size={14} /> Đóng</>  
                : <><PanelRightOpen size={14} /> Chi tiết</>}
            </Button>
          </div>
        )}
        mainContent={
          <div className="p-4 space-y-2">
            {items.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-10">Chưa có item nào.</p>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => selectItem(item)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-none border cursor-pointer transition-colors ${
                  selected?.id === item.id
                    ? "bg-primary/5 border-primary/30"
                    : "bg-background border-stone-200/20 hover:bg-stone-50/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium">{item.name}</span>
                  <Badge variant="outline" className={`text-[10px] h-4 px-1.5 ${STATUS_CLASS[item.status]}`}>
                    {STATUS_LABEL[item.status]}
                  </Badge>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            ))}
          </div>
        }
        detailContent={
          selected ? (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tên</p>
                <p className="text-sm font-semibold">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Trạng thái</p>
                <Badge variant="outline" className={`text-[10px] h-4 px-1.5 ${STATUS_CLASS[selected.status]}`}>
                  {STATUS_LABEL[selected.status]}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">ID</p>
                <p className="font-mono text-xs opacity-60">{selected.id}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              Chọn một item để xem chi tiết
            </div>
          )
        }
      />
    </div>
  );
}
