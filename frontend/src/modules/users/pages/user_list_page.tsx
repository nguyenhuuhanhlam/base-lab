import { useMemo, useState } from "react";
import { useUsers } from "../hooks/use_users";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { UserTable } from "../components/user_table";
import { UserEditPanel } from "../components/user_edit_panel";

export default function UserListPage() {
  const { users, isLoading, error, updateUser, deleteUser } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Error message */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          Lỗi tải dữ liệu: {error}
        </p>
      )}

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel: Table */}
        <ResizablePanel defaultSize={100} minSize={30}>
          <UserTable 
            users={users} 
            isLoading={isLoading} 
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
        </ResizablePanel>

        {selectedUser && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35} minSize={25}>
              <UserEditPanel 
                key={selectedUser.id}
                user={selectedUser}
                onClose={() => setSelectedUserId(null)}
                onUpdate={updateUser}
                onDelete={deleteUser}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
