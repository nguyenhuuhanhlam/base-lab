import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { HybridOverlayLayout } from "@/components/shared/hybrid_overlay_layout";

export default function TestUiPage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <div className="h-[calc(100vh-120px)]">
      <HybridOverlayLayout
        title="Test UI Optimized"
        subtitle="Module thử nghiệm cấu trúc Split Overlay & Hybrid Layout"
        icon={<FlaskConical size={20} />}
        isDetailOpen={isDetailOpen}
        onDetailOpenChange={setIsDetailOpen}
        mainTitle="Danh sách nội dung"
        detailTitle="Chi tiết"
        mainContent={
          <div className="flex items-center justify-center h-full border-2 border-dashed border-stone-200 text-stone-400 text-sm">
            [Main Content Area - Đã được đóng gói vào Component]
          </div>
        }
        detailContent={
          <div className="flex items-center justify-center h-full border-2 border-dashed border-stone-200 text-stone-400 text-sm">
            [Detail Content Area - Đã được đóng gói vào Component]
          </div>
        }
      />
    </div>
  );
}
