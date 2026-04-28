import { getInitials } from "../utils/helpers";

interface UserAvatarProps {
  name?: string;
  email?: string;
  photoURL?: string;
  className?: string;
}

export function UserAvatar({
  name,
  email,
  photoURL,
  className = "size-7",
}: UserAvatarProps) {
  const initials = getInitials(name, email);
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name || email || "avatar"}
        className={`${className} rounded-full object-cover shrink-0`}
      />
    );
  }
  return (
    <div className={`${className} rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-semibold shrink-0`}>
      {initials}
    </div>
  );
}
