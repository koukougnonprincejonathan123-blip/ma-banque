import { useState } from "react";
import { Header } from "@/components/Header";
import { useTransfer } from "@/hooks/use-banking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import bgJpg from "@assets/ptt_1770309334789.jpg";

export default function Transfer() {
  const [step, setStep] = useState(0);
  const [_, setLocation] = useLocation();
  const { mutate: transfer, isPending, error } = useTransfer();

  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryIban, setBeneficiaryIban] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [beneficiaryEmail, setBeneficiaryEmail] = useState("");
  const [secretCode, setSecretCode] = useState("");

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    transfer({
      beneficiaryName,
      beneficiaryIban,
      beneficiaryEmail,
      amount: parseFloat(amount),
      secretCode
    }, {
      onSuccess: () => setStep(3)
    });
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed pb-20"
      style={{ backgroundImage: `url(${bgJpg})` }}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] pointer-events-none" />
      <div className="relative z-10">
        <Header />
        
        <main className="max-w-md mx-auto p-4">
          <div className="flex items-center gap-4 mb-8">
            {step < 3 && (
              <Button variant="ghost" size="icon" onClick={() => (step === 0 ? setLocation("/") : handleBack())} className="rounded-full bg-white/50 backdrop-blur-sm shadow-sm">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            )}
            <h1 className="text-2xl font-bold text-gray-800 flex-1 drop-shadow-sm">
              {step === 3 ? "Reçu" : "Virement Bancaire"}
            </h1>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-md shadow-xl border-white/40 p-6 rounded-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900">Bénéficiaire</h2>
                      <span className="text-[10px] font-bold bg-[#E37F10]/10 text-[#E37F10] px-2 py-1 rounded-full uppercase">Étape 1/3</span>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-600 font-bold">Nom complet</Label>
                        <Input value={beneficiaryName} onChange={(e) => setBeneficiaryName(e.target.value)} placeholder="ex: Jean Dupont" className="h-12 bg-gray-50/50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600 font-bold">IBAN</Label>
                        <Input value={beneficiaryIban} onChange={(e) => setBeneficiaryIban(e.target.value)} placeholder="MA00...." className="h-12 bg-gray-50/50 font-mono" />
                      </div>
                    </div>
                  </div>
                </Card>
                <Button className="w-full h-14 bg-[#E37F10] hover:bg-[#c96f0e] text-white font-bold text-lg rounded-xl shadow-lg" onClick={handleNext} disabled={!beneficiaryName || !beneficiaryIban}>Continuer</Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-md shadow-xl border-white/40 p-6 rounded-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900">Détails</h2>
                      <span className="text-[10px] font-bold bg-[#E37F10]/10 text-[#E37F10] px-2 py-1 rounded-full uppercase">Étape 2/3</span>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-600 font-bold">Montant (€)</Label>
                        <div className="relative">
                          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="h-16 pl-4 text-3xl font-bold bg-gray-50/50" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E37F10] font-black text-xl">EUR</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600 font-bold">Email du bénéficiaire</Label>
                        <Input type="email" value={beneficiaryEmail} onChange={(e) => setBeneficiaryEmail(e.target.value)} placeholder="email@exemple.com" className="h-12 bg-gray-50/50" />
                      </div>
                    </div>
                  </div>
                </Card>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1 h-14 rounded-xl font-bold border-gray-300">Retour</Button>
                  <Button className="flex-[2] h-14 bg-[#E37F10] hover:bg-[#c96f0e] text-white font-bold text-lg rounded-xl shadow-lg" onClick={handleNext} disabled={!amount || !beneficiaryEmail}>Continuer</Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-md shadow-xl border-white/40 p-8 rounded-2xl flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><ShieldCheck className="w-8 h-8" /></div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Code Secret</h3>
                    <p className="text-gray-600 text-sm mt-1">Confirmez le virement de <span className="font-black text-gray-900">{amount} €</span></p>
                  </div>
                  <Input type="password" maxLength={4} value={secretCode} onChange={(e) => setSecretCode(e.target.value)} placeholder="••••" className="h-16 text-center text-3xl tracking-[0.5em] font-black bg-gray-50/50 border-gray-200 focus:border-[#E37F10] rounded-xl" />
                  {error && <p className="text-red-500 text-sm font-bold bg-red-50 px-3 py-1 rounded-md">{error.message}</p>}
                </Card>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1 h-14 rounded-xl font-bold border-gray-300">Retour</Button>
                  <Button className="flex-[2] h-14 bg-[#E37F10] hover:bg-[#c96f0e] text-white font-bold text-lg rounded-xl shadow-lg" onClick={handleSubmit} disabled={secretCode.length !== 4 || isPending}>{isPending ? <Loader2 className="animate-spin" /> : "Confirmer"}</Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-8 py-10">
                <Confetti numberOfPieces={200} recycle={false} />
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-inner"><CheckCircle className="w-12 h-12 text-green-600" /></div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-gray-900 drop-shadow-sm">Virement Effectué !</h2>
                  <p className="text-gray-700 font-medium max-w-xs mx-auto">Votre opération de virement a été enregistrée avec succès.</p>
                </div>
                <Link href="/dashboard" className="w-full"><Button className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-xl">Retour au tableau de bord</Button></Link>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}