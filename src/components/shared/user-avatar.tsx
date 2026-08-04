import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserAvatarUrl } from "@/features/auth/lib/avatar-image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  className?: string;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserAvatar({ name, avatarUrl, className }: UserAvatarProps) {
  const src = getUserAvatarUrl(avatarUrl);

  return (
    <Avatar className={cn("text-lg", className)}>
      {src ? (
        <AvatarImage src={src} alt={name} />
      ) : (
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      )}
    </Avatar>
  );
}
