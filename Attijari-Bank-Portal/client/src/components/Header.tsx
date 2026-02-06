import { useAuth } from "@/hooks/use-auth";
import { LogOut, Bell } from "lucide-react";
import { useTransactions, useMarkTransactionsRead } from "@/hooks/use-banking";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import logoPng from "@assets/ttt_1770303742286.webp";

export function Header() {
  const { user, logout } = useAuth();
  const { data: transactions } = useTransactions();
  const { mutate: markRead } = useMarkTransactionsRead();

  const unreadCount = transactions?.filter(t => !t.isRead).length || 0;

  const handleOpenNotifications = (open: boolean) => {
    if (open && unreadCount > 0) {
      markRead();
    }
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logoPng} alt="Logo" className="h-8 object-contain" />
          <div className="flex flex-col border-l pl-3 border-gray-100">
            <span className="text-sm font-bold leading-none">{user?.fullName}</span>
            <span className="text-xs text-muted-foreground">Bonjour</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Popover onOpenChange={handleOpenNotifications}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-secondary hover:text-primary hover:bg-primary/5">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="bg-secondary text-white p-3 font-semibold rounded-t-md">
                Notifications
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {transactions?.slice(0, 5).map((t) => (
                  <div key={t.id} className="p-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <p className="text-sm font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(t.date || new Date()), "d MMMM à HH:mm", { locale: fr })}
                    </p>
                  </div>
                ))}
                {(!transactions || transactions.length === 0) && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Aucune notification
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => logout()}
            className="text-secondary hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
