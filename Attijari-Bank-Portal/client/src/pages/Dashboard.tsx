import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAccount, useActivateAccount } from "@/hooks/use-banking";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Loader2, Wallet, ArrowRightLeft, FileText, 
  BookOpen, Globe, Home, Copy, CheckCircle2,
  Settings, ShieldCheck, Zap, CreditCard, Heart
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import bgJpg from "@assets/ptt_1770309334789.jpg";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { data: account, isLoading: isAccountLoading } = useAccount();
  const { mutate: activateAccount, isPending: isActivating } = useActivateAccount();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const [showTerminal, setShowTerminal] = useState(false);
  const [showAdVideo, setShowAdVideo] = useState(false);

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleActivate = () => {
    setShowTerminal(true);
    setTimeout(() => {
      setShowTerminal(false);
      setShowAdVideo(true);
      // Show video for 5 seconds before activation
      setTimeout(() => {
        setShowAdVideo(false);
        activateAccount();
      }, 5000);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copié dans le presse-papier",
      className: "bg-secondary text-white border-none",
    });
  };

  const menuItems = [
    { icon: Home, label: "Accueil", color: "text-blue-500", bg: "bg-blue-50", link: "/dashboard" },
    { icon: Wallet, label: "Comptes", color: "text-[#E37F10]", bg: "bg-orange-50", link: "/dashboard" },
    { icon: ArrowRightLeft, label: "Virement", color: "text-green-600", bg: "bg-green-50", link: "/transfer" },
    { icon: FileText, label: "RIB", color: "text-purple-500", bg: "bg-purple-50", action: () => copyToClipboard(account?.iban || "") },
    { icon: BookOpen, label: "Chéquiers", color: "text-red-500", bg: "bg-red-50", link: "#" },
    { icon: Globe, label: "Attijari'transfer", color: "text-indigo-500", bg: "bg-indigo-50", link: "#" },
  ];

  if (isAccountLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed pb-24"
      style={{ backgroundImage: `url(${bgJpg})` }}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] pointer-events-none" />
      <div className="relative z-10">
        <Header />

        <main className="max-w-md mx-auto p-4 space-y-6">
          
          {!account && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
              <AnimatePresence mode="wait">
                {showTerminal && (
                  <motion.div 
                    key="terminal"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="w-full max-w-xs bg-black text-green-500 font-mono p-4 rounded-lg text-xs text-left shadow-2xl"
                  >
                    <p>Initializing secure connection...</p>
                    <p>Verifying identity: OK</p>
                    <p>Connecting to core banking...</p>
                    <p>Loading balance...</p>
                    <div className="mt-2 h-1 w-full bg-gray-800 rounded overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-green-500"
                      />
                    </div>
                  </motion.div>
                )}

                {showAdVideo && (
                  <motion.div 
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
                  >
                    <div className="w-full aspect-video bg-gray-900 relative">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                        <img src="/logo.png" className="h-12 mb-4" alt="" />
                        <h2 className="text-2xl font-bold mb-2">Attijariwafa bank</h2>
                        <p className="text-white/60">Croire en vous</p>
                        <div className="mt-8 flex gap-2">
                           <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                           <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                           <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                      {/* Note: In a real app we'd use a real video tag here */}
                      <video 
                        className="w-full h-full object-cover opacity-40"
                        autoPlay muted loop playsInline
                        src="https://assets.mixkit.co/videos/preview/mixkit-business-people-walking-in-a-hallway-4043-large.mp4"
                      />
                    </div>
                  </motion.div>
                )}

                {!showTerminal && !showAdVideo && (
                  <motion.div 
                    key="welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-[#E37F10] mx-auto shadow-inner">
                      <Wallet className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Bienvenue {user.fullName}</h2>
                    <p className="text-gray-700 font-medium">Votre espace est prêt. Activez votre compte pour commencer.</p>
                    <Button 
                      onClick={handleActivate}
                      size="lg"
                      className="bg-[#E37F10] hover:bg-[#c96f0e] text-white shadow-lg shadow-orange-500/25 px-8 rounded-full font-bold"
                    >
                      Ouvrir un compte
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {account && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Balance Card */}
              <Card className="bg-gradient-to-br from-[#E37F10] to-[#c96f0e] text-white p-6 rounded-2xl shadow-xl shadow-orange-500/20 border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-white/80 text-sm font-medium">Compte Courant</p>
                      <h2 className="text-4xl font-bold mt-1 tracking-tight">
                        {Number(account.balance).toLocaleString('fr-FR')} €
                      </h2>
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10">
                      Actif
                    </span>
                  </div>

                  <div className="bg-black/10 rounded-xl p-4 backdrop-blur-sm border border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Compte N°</span>
                      <span className="font-mono">{account.accountNumber}</span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">IBAN</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs truncate max-w-[150px]">{account.iban}</span>
                        <button onClick={() => copyToClipboard(account.iban)} className="text-white/80 hover:text-white">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Pour Vous - Bank Card */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#E37F10]" />
                  POUR VOUS
                </h3>
                <Card className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden h-48 flex flex-col justify-between border-none">
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                    <CreditCard className="w-24 h-24" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-widest text-white/60 mb-1">Votre carte Attijariwafa bank</p>
                    <p className="text-lg font-bold">N° du compte {account.accountNumber}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/40 uppercase">Titulaire</p>
                      <p className="text-sm font-medium tracking-wide">{user.fullName}</p>
                    </div>
                    <div className="w-10 h-6 bg-yellow-500/80 rounded" />
                  </div>
                </Card>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-3 gap-4">
                {menuItems.map((item, index) => (
                  <div 
                    key={index} 
                    onClick={item.action || (() => item.link && setLocation(item.link))} 
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm border border-white/40 hover:shadow-md hover:border-[#E37F10]/30 transition-all cursor-pointer h-28 group"
                  >
                    <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="text-[10px] font-bold text-center text-gray-700 uppercase tracking-tighter">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Espace Cadeau */}
              <Card className="p-5 bg-gradient-to-r from-pink-50 to-red-50 border-pink-100 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
                    <span className="text-xl font-bold">80€</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-pink-900">Espace Cadeau : 80 € Offerts</h4>
                    <p className="text-xs text-pink-800 leading-relaxed">
                      Parrainez vos proches pour la Sainte Valentin. Bénéficiez de 80 € offerts dans votre cagnotte pour chaque parrainage validé. 
                    </p>
                    <p className="text-[10px] text-pink-700 italic mt-2">
                      Offre valable du 1er au 28 fevrier pour tout nouveau client ouvrant un Compte Attijariwafa bank
                    </p>
                  </div>
                </div>
              </Card>

              {/* Messages Marketing */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                  <span className="text-xs font-bold text-gray-900">Sécurité renforcée</span>
                </div>
                <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 flex flex-col items-center text-center gap-2">
                  <Zap className="w-8 h-8 text-blue-600" />
                  <span className="text-xs font-bold text-gray-900">Interface intuitive</span>
                </div>
              </div>

              {/* Settings / Logout */}
              <div className="pt-4 pb-8">
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/settings")}
                  className="w-full h-14 bg-white/40 backdrop-blur-sm border-white/60 rounded-xl flex justify-between px-6 hover:bg-white/60"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-bold text-gray-800">Paramètres</span>
                  </div>
                  <ArrowRightLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </Button>
              </div>

            </motion.div>
          )}
        </main>

        {/* Footer Ticker Ad */}
        <div className="fixed bottom-0 left-0 w-full z-40 shadow-lg bg-white/80 backdrop-blur-md border-t border-white/20">
          <div className="ticker-wrap">
            <div className="ticker">
            Attijariwafa bank : Votre partenaire de confiance pour un avenir serein. Découvrez nos offres de crédit immobilier à taux réduit. Épargnez malin avec nos solutions d'investissement sécurisées.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
