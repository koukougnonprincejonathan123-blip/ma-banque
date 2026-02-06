import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Storing as requested for simulation
  fullName: text("full_name").notNull(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0"),
  iban: text("iban").notNull(),
  bic: text("bic").notNull(),
  accountNumber: text("account_number").notNull(),
  isActive: boolean("is_active").default(true),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").references(() => accounts.id).notNull(),
  type: text("type").notNull(), // 'VIREMENT', 'CHARGEMENT', 'INITIAL'
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  beneficiary: text("beneficiary"),
  beneficiaryEmail: text("beneficiary_email"),
  description: text("description"),
  date: timestamp("date").defaultNow(),
  isRead: boolean("is_read").default(false), // For notification badge
});

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users);
export const insertAccountSchema = createInsertSchema(accounts);
export const insertTransactionSchema = createInsertSchema(transactions);

// === TYPES ===

export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// API Request Types
export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const transferSchema = z.object({
  beneficiaryName: z.string(),
  beneficiaryIban: z.string(),
  beneficiaryEmail: z.string().email(),
  amount: z.number().positive(),
  secretCode: z.string(),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type TransferRequest = z.infer<typeof transferSchema>;
