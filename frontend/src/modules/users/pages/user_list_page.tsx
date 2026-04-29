import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useUsers } from "../hooks/use_users";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { UserTable } from "../components/user_table";
import { UserEditPanel } from "../components/user_edit_panel";

const PanelGroup = ResizablePanelGroup as any;

export default function UserListPage() {
  const { users, isLoading, error, updateUser, deleteUser } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsNarrow(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Chuyển sang chiều dọc nếu là Mobile HOẶC màn hình hơi hẹp mà đang mở chi tiết
  const isVertical = isMobile || (isNarrow && !!selectedUserId);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId]
  );


  return (
    <div className="h-[calc(100vh-120px)] flex flex-col overflow-hidden">
      {/* Error message */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          Lỗi tải dữ liệu: {error}
        </p>
      )}

      {/* MOBILE/NARROW LAYOUT (Stacked) */}
      {isVertical ? (
        <div className="flex flex-col flex-1 overflow-hidden px-0">
          <div className={cn("flex-1 overflow-hidden", selectedUser ? "h-[40%]" : "h-full")}>
            <UserTable
              users={users}
              isLoading={isLoading}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
              isDetailOpen={!!selectedUser}
            />
          </div>

          {selectedUser && (
            <div className="h-[60%] border-t bg-card overflow-auto px-4 animate-in slide-in-from-bottom duration-300">
              <UserEditPanel
                key={selectedUser.id}
                user={selectedUser}
                onClose={() => setSelectedUserId(null)}
                onUpdate={updateUser}
                onDelete={deleteUser}
              />
            </div>
          )}
        </div>
      ) : (
        /* DESKTOP LAYOUT (Resizable) */
        <PanelGroup 
          key="desktop-layout"
          direction="horizontal" 
          className="flex-1"
          id="user-list-layout"
        >
          <ResizablePanel defaultSize={selectedUser ? 65 : 100} minSize={30}>
            <div className={cn("h-full", selectedUser ? "pr-4" : "pr-0")}>
              <UserTable
                users={users}
                isLoading={isLoading}
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
                isDetailOpen={!!selectedUser}
              />
            </div>
          </ResizablePanel>

          {selectedUser && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={35} minSize={25}>
                <div className="h-full pl-4">
                  <UserEditPanel
                    key={selectedUser.id}
                    user={selectedUser}
                    onClose={() => setSelectedUserId(null)}
                    onUpdate={updateUser}
                    onDelete={deleteUser}
                  />
                </div>
              </ResizablePanel>
            </>
          )}
        </PanelGroup>
      )}
    </div>
  );
}
