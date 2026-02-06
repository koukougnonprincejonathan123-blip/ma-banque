import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import logoPng from "@assets/ttt_1770303742286.webp";
import bgJpg from "@assets/ptt_1770309334789.jpg";

export default function Login() {
  const { login, isLoggingIn, loginError } = useAuth();
  const [username, setUsername] = useState("Haget01");
  const [password, setPassword] = useState("1105");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col font-sans relative"
      style={{ backgroundImage: `url(${bgJpg})` }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      
      {/* Top Bars above logo */}
      <div className="relative z-20">
        <div className="w-full bg-[#E37F10] py-2 text-center shadow-md">
          <h2 className="text-white font-display text-sm font-bold tracking-wide">Bienvenue</h2>
        </div>
        <div className="w-full bg-gray-200/90 py-1 text-center shadow-sm">
          <p className="text-gray-700 text-xs font-medium italic">Croire en vous</p>
        </div>
      </div>

      <div className="flex-none p-6 flex justify-center relative z-20">
        <img src={logoPng} alt="Attijariwafa bank" className="h-16 object-contain drop-shadow-md" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 overflow-hidden"
        >
          {/* Logo Section */}
          <div className="p-8 pb-0 text-center">
             <h1 className="text-2xl font-bold text-gray-900 drop-shadow-sm">Connexion</h1>
             <p className="text-gray-800 font-medium text-sm mt-2">Accédez à votre espace sécurisé</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {loginError && (
              <div className="p-3 bg-red-500/80 backdrop-blur-sm text-white text-sm rounded-lg border border-red-400 flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-white"/>
                {loginError.message}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-900 font-semibold">Identifiant</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 bg-white/60 border-white/40 focus:bg-white/80 focus:border-[#E37F10] focus:ring-[#E37F10]/20 rounded-xl transition-all placeholder:text-gray-500 text-gray-900"
                  placeholder="Entrez votre identifiant"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 font-semibold">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-white/60 border-white/40 focus:bg-white/80 focus:border-[#E37F10] focus:ring-[#E37F10]/20 rounded-xl transition-all placeholder:text-gray-500 text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  className="data-[state=checked]:bg-[#E37F10]"
                />
                <Label htmlFor="remember" className="text-sm font-bold text-gray-900 cursor-pointer">
                  Se souvenir de moi
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#E37F10] hover:bg-[#c96f0e] text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Se connecter"
              )}
            </Button>

            <div className="flex flex-col items-center gap-2 pt-2 text-sm">
              <button type="button" className="text-gray-900 font-bold hover:text-[#E37F10] transition-colors drop-shadow-sm">
                Mot de passe oublié ?
              </button>
              <button type="button" className="text-gray-900 font-bold hover:text-[#E37F10] transition-colors drop-shadow-sm">
                Identifiant oublié ?
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      
      <div className="relative z-20 p-4 text-center text-xs text-white font-bold drop-shadow-md">
        &copy; 2024 Attijariwafa bank. Tous droits réservés.
      </div>
    </div>
  );
}
