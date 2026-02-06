import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type TransferRequest, type Transaction } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useAccount() {
  return useQuery({
    queryKey: [api.account.get.path],
    queryFn: async () => {
      const res = await fetch(api.account.get.path);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch account");
      return api.account.get.responses[200].parse(await res.json());
    },
  });
}

export function useActivateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.account.activate.path, {
        method: api.account.activate.method,
      });
      if (!res.ok) throw new Error("Failed to activate account");
      return api.account.activate.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.account.get.path] });
    },
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: [api.transactions.list.path],
    queryFn: async () => {
      const res = await fetch(api.transactions.list.path);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return api.transactions.list.responses[200].parse(await res.json());
    },
    refetchInterval: 5000, // Poll for updates
  });
}

export function useTransfer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: TransferRequest) => {
      const res = await fetch(api.transactions.transfer.path, {
        method: api.transactions.transfer.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Transfer failed");
      }
      return api.transactions.transfer.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.account.get.path] });
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      
      // Play sound
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play().catch(e => console.error("Audio play failed", e));
      
      toast({
        title: "Succès",
        description: "Votre opération de virement a été enregistrée avec succès.",
        variant: "default",
        className: "bg-green-600 text-white border-none",
      });
    },
  });
}

export function useMarkTransactionsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await fetch(api.transactions.markRead.path, {
        method: api.transactions.markRead.method,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
    },
  });
}
