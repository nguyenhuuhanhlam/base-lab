import { useState } from "react";
import { X, Save, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doc, serverTimestamp } from "firebase/firestore";
import { type UserRecord } from "../hooks/use_users";
import { AUTH_DISPLAY_FIELD } from "@/lib/constants";
import { formatDate, getInitials } from "../utils/helpers";

interface UserEditPanelProps {
  user: UserRecord;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<UserRecord>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function UserEditPanel({ user, onClose, onUpdate, onDelete }: UserEditPanelProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [role, setRole] = useState(user.role || "user");

  // Logic: Xác định GG Account dựa trên field 'provider' mới hoặc fallback 'photoURL'
  const isGoogleAccount = user.provider === "google.com" || !!user.photoURL;
  const canChangeRole = isGoogleAccount;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {
      [AUTH_DISPLAY_FIELD]: formData.get("name") as string,
      role: role,
    };

    // Bổ sung createdAt nếu chưa có
    if (!user.createdAt) {
      data.createdAt = serverTimestamp();
    }

    setIsUpdating(true);
    try {
      await onUpdate(user.id, data);
      onClose();
    } catch (e) {
      alert("Lỗi khi cập nhật người dùng");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Xóa vĩnh viễn người dùng ${user.email}?`)) {
      setIsDeleting(true);
      try {
        await onDelete(user.id);
        onClose();
      } catch (e) {
        alert("Lỗi khi xóa người dùng");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pt-1">
        <h2 className="text-sm font-semibold">Chi tiết người dùng</h2>
        <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 overflow-hidden">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-primary">
              {getInitials(user[AUTH_DISPLAY_FIELD] as string || user.displayName, user.email)}
            </span>
          )}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-semibold truncate">
            {(user[AUTH_DISPLAY_FIELD] as string) || user.displayName || "N/A"}
          </h3>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <div className="mt-1">
            <Badge variant="outline" className="text-[10px] uppercase px-1.5 h-4">
              {user.role || "user"}
            </Badge>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        <div className="space-y-1.5">
          <Label htmlFor="edit-name" className="text-xs text-muted-foreground">Tên / Tổ chức</Label>
          <Input 
            id="edit-name" 
            name="name"
            defaultValue={(user[AUTH_DISPLAY_FIELD] as string) || user.displayName || ""} 
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-email" className="text-xs text-muted-foreground">Email (Không thể sửa)</Label>
          <Input 
            id="edit-email" 
            value={user.email || ""} 
            disabled 
            className="h-9 text-sm bg-muted/30"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="edit-role" className="text-xs text-muted-foreground">Vai trò</Label>
            {!canChangeRole && (
              <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                Chỉ dành cho GG Account
              </span>
            )}
          </div>
          <Select 
            disabled={!canChangeRole} 
            value={role} 
            onValueChange={setRole}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              {user.role !== "admin" && <SelectItem value="user">User</SelectItem>}
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 space-y-4">
          <Separator />
          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">UID</p>
              <p className="font-mono break-all opacity-70">{user.uid || user.id}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Ngày tạo</p>
              <p className="opacity-70">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6">
          <Button type="submit" className="w-full gap-2 h-9" disabled={isUpdating}>
            {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Lưu thay đổi
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive h-9"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Xóa người dùng
          </Button>
        </div>
      </form>
    </div>
  );
}
