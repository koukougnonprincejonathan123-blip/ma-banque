import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, LogOut, ShieldCheck, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { logout } = useAuth();
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <header className="bg-white border-b p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
          <Settings className="w-6 h-6 rotate-180" />
        </Button>
        <h1 className="text-xl font-bold">Paramètres</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Sécurité</h3>
          <Card className="divide-y overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span className="font-medium">Sécurité renforcée</span>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">ACTIF</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Interface intuitive</span>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">OPTIMISÉ</span>
            </div>
          </Card>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Compte</h3>
          <Card className="overflow-hidden">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-14 rounded-none"
              onClick={() => logout()}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span className="font-bold text-lg">Déconnexion</span>
            </Button>
          </Card>
        </section>
      </main>
    </div>
  );
}