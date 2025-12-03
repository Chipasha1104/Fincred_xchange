import { 
  type Exchange, 
  type InsertExchange, 
  type Participant, 
  type InsertParticipant,
  type ExchangeWithParticipants,
  exchanges,
  participants 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllExchanges(): Promise<ExchangeWithParticipants[]>;
  getExchange(id: string): Promise<ExchangeWithParticipants | undefined>;
  createExchange(exchange: InsertExchange): Promise<Exchange>;
  updateExchange(id: string, data: Partial<InsertExchange>): Promise<Exchange | undefined>;
  deleteExchange(id: string): Promise<void>;
  
  getParticipant(id: string): Promise<Participant | undefined>;
  getParticipantByEmail(email: string): Promise<{ participant: Participant; exchangeId: string } | undefined>;
  addParticipant(participant: InsertParticipant): Promise<Participant>;
  updateParticipant(id: string, data: Partial<InsertParticipant>): Promise<Participant | undefined>;
  removeParticipant(id: string): Promise<void>;
  updateAssignments(exchangeId: string, assignments: { participantId: string; assignedToId: string }[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllExchanges(): Promise<ExchangeWithParticipants[]> {
    const allExchanges = await db.select().from(exchanges);
    const allParticipants = await db.select().from(participants);
    
    return allExchanges.map(ex => ({
      ...ex,
      participants: allParticipants.filter(p => p.exchangeId === ex.id)
    }));
  }

  async getExchange(id: string): Promise<ExchangeWithParticipants | undefined> {
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, id));
    if (!exchange) return undefined;
    
    const exchangeParticipants = await db.select().from(participants).where(eq(participants.exchangeId, id));
    return {
      ...exchange,
      participants: exchangeParticipants
    };
  }

  async createExchange(exchange: InsertExchange): Promise<Exchange> {
    const [created] = await db.insert(exchanges).values(exchange).returning();
    return created;
  }

  async updateExchange(id: string, data: Partial<InsertExchange>): Promise<Exchange | undefined> {
    const [updated] = await db.update(exchanges).set(data).where(eq(exchanges.id, id)).returning();
    return updated;
  }

  async deleteExchange(id: string): Promise<void> {
    await db.delete(exchanges).where(eq(exchanges.id, id));
  }

  async getParticipant(id: string): Promise<Participant | undefined> {
    const [participant] = await db.select().from(participants).where(eq(participants.id, id));
    return participant;
  }

  async getParticipantByEmail(email: string): Promise<{ participant: Participant; exchangeId: string } | undefined> {
    const [participant] = await db.select().from(participants).where(eq(participants.email, email.toLowerCase()));
    if (!participant) return undefined;
    return { participant, exchangeId: participant.exchangeId };
  }

  async addParticipant(participant: InsertParticipant): Promise<Participant> {
    const [created] = await db.insert(participants).values({
      ...participant,
      email: participant.email.toLowerCase()
    }).returning();
    return created;
  }

  async updateParticipant(id: string, data: Partial<InsertParticipant>): Promise<Participant | undefined> {
    const updateData = { ...data };
    if (data.email) {
      updateData.email = data.email.toLowerCase();
    }
    const [updated] = await db.update(participants).set(updateData).where(eq(participants.id, id)).returning();
    return updated;
  }

  async removeParticipant(id: string): Promise<void> {
    await db.delete(participants).where(eq(participants.id, id));
  }

  async updateAssignments(exchangeId: string, assignments: { participantId: string; assignedToId: string }[]): Promise<void> {
    for (const assignment of assignments) {
      await db.update(participants)
        .set({ assignedToId: assignment.assignedToId })
        .where(eq(participants.id, assignment.participantId));
    }
    await db.update(exchanges).set({ status: "active" }).where(eq(exchanges.id, exchangeId));
  }
}

export const storage = new DatabaseStorage();
