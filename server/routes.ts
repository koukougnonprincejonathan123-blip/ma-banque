import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Session setup
  const SessionStore = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000 },
    store: new SessionStore({ checkPeriod: 86400000 })
  }));

  // Helper to get session user
  const getSessionUser = (req: any) => req.session.user;

  // === SEED DATA ===
  const userCount = await storage.getUsersCount();
  if (userCount === 0) {
    console.log("Seeding database...");
    const user = await storage.createUser({
      username: "Haget01",
      password: "1105",
      fullName: "Haget David"
    });
    
    await storage.createAccount({
      userId: user.id,
      balance: "0", // Start with 0, "activate" later to set to 800,000
      iban: "MA007780800175200000185560",
      bic: "BCMAMXXX",
      accountNumber: "00056006910",
      isActive: false
    });
    console.log("Database seeded with Haget David account.");
  }

  // === AUTH ROUTES ===
  
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { username, password } = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Identifiant ou mot de passe incorrect" });
      }
      
      (req.session as any).user = user;
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ message: "Not authenticated" });
    
    // Refresh user data
    const freshUser = await storage.getUser(user.id);
    res.json(freshUser);
  });

  // === ACCOUNT ROUTES ===

  app.get(api.account.get.path, async (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ message: "Not authenticated" });
    
    const account = await storage.getAccount(user.id);
    if (!account) return res.status(404).json({ message: "Account not found" });
    
    res.json(account);
  });

  app.post(api.account.activate.path, async (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ message: "Not authenticated" });
    
    const account = await storage.getAccount(user.id);
    if (!account) return res.status(404).json({ message: "Account not found" });
    
    // Simulate activation - set balance to 800,000
    const updated = await storage.updateAccountBalance(account.id, "800000.00");
    res.json({ success: true, balance: updated.balance });
  });

  // === TRANSACTION ROUTES ===

  app.get(api.transactions.list.path, async (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ message: "Not authenticated" });
    
    const account = await storage.getAccount(user.id);
    if (!account) return res.status(404).json({ message: "Account not found" });
    
    const transactions = await storage.getTransactions(account.id);
    res.json(transactions);
  });

  app.post(api.transactions.transfer.path, async (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    try {
      const input = api.transactions.transfer.input.parse(req.body);
      
      // Validate secret code
      if (input.secretCode !== "4445") {
        return res.status(400).json({ message: "Code secret incorrect" });
      }

      const account = await storage.getAccount(user.id);
      if (!account) return res.status(404).json({ message: "Account not found" });

      const currentBalance = parseFloat(account.balance);
      if (currentBalance < input.amount) {
        return res.status(400).json({ message: "Solde insuffisant" });
      }

      // Deduct balance
      const newBalance = (currentBalance - input.amount).toFixed(2);
      await storage.updateAccountBalance(account.id, newBalance);

      // Create transaction record
      const transaction = await storage.createTransaction({
        accountId: account.id,
        type: "VIREMENT",
        amount: input.amount.toFixed(2),
        beneficiary: input.beneficiaryName,
        beneficiaryEmail: input.beneficiaryEmail,
        description: `Virement vers ${input.beneficiaryName}`,
        isRead: false, // Unread notification
      });

      res.json(transaction);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post(api.transactions.markRead.path, async (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ message: "Not authenticated" });
    
    const account = await storage.getAccount(user.id);
    if (!account) return res.status(404).json({ message: "Account not found" });
    
    await storage.markTransactionsRead(account.id);
    res.json({ success: true });
  });

  return httpServer;
}
