import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExchangeSchema, insertParticipantSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/exchanges", async (req, res) => {
    try {
      const exchanges = await storage.getAllExchanges();
      res.json(exchanges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exchanges" });
    }
  });

  app.get("/api/exchanges/:id", async (req, res) => {
    try {
      const exchange = await storage.getExchange(req.params.id);
      if (!exchange) {
        return res.status(404).json({ error: "Exchange not found" });
      }
      res.json(exchange);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exchange" });
    }
  });

  app.post("/api/exchanges", async (req, res) => {
    try {
      const parsed = insertExchangeSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const exchange = await storage.createExchange(parsed.data);
      res.status(201).json(exchange);
    } catch (error) {
      res.status(500).json({ error: "Failed to create exchange" });
    }
  });

  app.patch("/api/exchanges/:id", async (req, res) => {
    try {
      const exchange = await storage.updateExchange(req.params.id, req.body);
      if (!exchange) {
        return res.status(404).json({ error: "Exchange not found" });
      }
      res.json(exchange);
    } catch (error) {
      res.status(500).json({ error: "Failed to update exchange" });
    }
  });

  app.delete("/api/exchanges/:id", async (req, res) => {
    try {
      await storage.deleteExchange(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete exchange" });
    }
  });

  app.post("/api/exchanges/:id/participants", async (req, res) => {
    try {
      const exchange = await storage.getExchange(req.params.id);
      if (!exchange) {
        return res.status(404).json({ error: "Exchange not found" });
      }
      
      const participantData = {
        ...req.body,
        exchangeId: req.params.id
      };
      
      const parsed = insertParticipantSchema.safeParse(participantData);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      
      const participant = await storage.addParticipant(parsed.data);
      res.status(201).json(participant);
    } catch (error) {
      res.status(500).json({ error: "Failed to add participant" });
    }
  });

  app.patch("/api/participants/:id", async (req, res) => {
    try {
      const participant = await storage.updateParticipant(req.params.id, req.body);
      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }
      res.json(participant);
    } catch (error) {
      res.status(500).json({ error: "Failed to update participant" });
    }
  });

  app.delete("/api/participants/:id", async (req, res) => {
    try {
      await storage.removeParticipant(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove participant" });
    }
  });

  app.post("/api/exchanges/:id/draw", async (req, res) => {
    try {
      const exchange = await storage.getExchange(req.params.id);
      if (!exchange) {
        return res.status(404).json({ error: "Exchange not found" });
      }
      
      const participants = exchange.participants;
      if (participants.length < 2) {
        return res.status(400).json({ error: "Need at least 2 participants to draw" });
      }

      let shuffled = [...participants];
      let valid = false;
      let attempts = 0;

      while (!valid && attempts < 100) {
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        valid = true;
        for (let i = 0; i < participants.length; i++) {
          if (participants[i].id === shuffled[i].id) {
            valid = false;
            break;
          }
        }
        attempts++;
      }

      if (!valid) {
        shuffled = [...participants.slice(1), participants[0]];
      }

      const assignments = participants.map((p, i) => ({
        participantId: p.id,
        assignedToId: shuffled[i].id
      }));

      await storage.updateAssignments(req.params.id, assignments);
      
      const updatedExchange = await storage.getExchange(req.params.id);
      res.json(updatedExchange);
    } catch (error) {
      res.status(500).json({ error: "Failed to draw names" });
    }
  });

  app.post("/api/exchanges/:id/reset", async (req, res) => {
    try {
      const exchange = await storage.getExchange(req.params.id);
      if (!exchange) {
        return res.status(404).json({ error: "Exchange not found" });
      }

      for (const participant of exchange.participants) {
        await storage.updateParticipant(participant.id, { assignedToId: null });
      }
      await storage.updateExchange(req.params.id, { status: "draft" });
      
      const updatedExchange = await storage.getExchange(req.params.id);
      res.json(updatedExchange);
    } catch (error) {
      res.status(500).json({ error: "Failed to reset draw" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const result = await storage.getParticipantByEmail(email);
      
      if (!result) {
        return res.status(401).json({ error: "Email not found in any active exchange" });
      }

      const { participant, exchangeId } = result;
      
      if (participant.password !== password) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      res.json({ 
        participant, 
        exchangeId,
        message: "Login successful" 
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/participants/:id/wishlist", async (req, res) => {
    try {
      const { item } = req.body;
      const participant = await storage.getParticipant(req.params.id);
      
      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }

      const currentWishlist = participant.wishlist || [];
      const updated = await storage.updateParticipant(req.params.id, {
        wishlist: [...currentWishlist, item]
      });
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to add to wishlist" });
    }
  });

  return httpServer;
}
