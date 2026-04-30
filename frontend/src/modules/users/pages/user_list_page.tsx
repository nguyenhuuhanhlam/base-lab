import { useMemo, useState } from "react";
import { Users, PanelRightOpen, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HybridOverlayLayout } from "@/components/shared/hybrid_overlay_layout";
import { useUsers } from "../hooks/use_users";
import { UserTable } from "../components/user_table";
import { UserEditPanel } from "../components/user_edit_panel";

export default function UserListPage() {
  const { users, isLoading, error, updateUser, deleteUser } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) ?? null,
    [users, selectedUserId]
  );

  const handleSelectUser = (id: string) => {
    setSelectedUserId(id);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedUserId(null);
    setIsDetailOpen(false);
  };

  return (
    <div className="h-[calc(100vh-120px)]">
      <HybridOverlayLayout
        title="Quản lý người dùng"
        subtitle="Danh sách tài khoản đã đăng ký"
        icon={<Users size={20} />}
        isDetailOpen={isDetailOpen}
        onDetailOpenChange={(open) => { if (!open) handleCloseDetail(); else setIsDetailOpen(true); }}
        toolbar={({ isDetailOpen, onToggle }) => (
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
        )}
        mainContent={
          <>
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 mb-3 mx-0">
                Lỗi tải dữ liệu: {error}
              </p>
            )}
            <UserTable
              users={users}
              isLoading={isLoading}
              selectedUserId={selectedUserId}
              onSelectUser={handleSelectUser}
              isDetailOpen={isDetailOpen}
            />
          </>
        }
        detailContent={
          selectedUser ? (
            <div className="px-4 py-2">
              <UserEditPanel
                key={selectedUser.id}
                user={selectedUser}
                onClose={handleCloseDetail}
                onUpdate={updateUser}
                onDelete={deleteUser}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              Chọn người dùng để xem chi tiết
            </div>
          )
        }
      />
    </div>
  );
}
