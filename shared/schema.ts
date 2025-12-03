import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const exchanges = pgTable("exchanges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  date: text("date").notNull(),
  budget: text("budget").notNull(),
  status: text("status").notNull().default("draft"),
});

export const participants = pgTable("participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  exchangeId: varchar("exchange_id").notNull().references(() => exchanges.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull().default("fincred2025"),
  suggestions: text("suggestions").default(""),
  wishlist: text("wishlist").array().default([]),
  assignedToId: varchar("assigned_to_id"),
});

export const insertExchangeSchema = createInsertSchema(exchanges).omit({ id: true });
export const insertParticipantSchema = createInsertSchema(participants).omit({ id: true });

export type InsertExchange = z.infer<typeof insertExchangeSchema>;
export type Exchange = typeof exchanges.$inferSelect;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type Participant = typeof participants.$inferSelect;

export type ExchangeWithParticipants = Exchange & {
  participants: Participant[];
};
