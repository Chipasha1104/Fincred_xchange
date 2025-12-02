import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import canvasConfetti from 'canvas-confetti';

// Simple ID generator since we might not have uuid/nanoid
const generateId = () => Math.random().toString(36).substring(2, 9);

export type Participant = {
  id: string;
  name: string;
  email: string;
  suggestions: string; // New field for "suggestions and preferences"
  avatar?: string;
  wishlist: string[];
  assignedToId?: string | null; // The ID of the person they are giving a gift TO
};

export type Exchange = {
  id: string;
  title: string;
  date: string;
  budget: string;
  participants: Participant[];
  status: 'draft' | 'active' | 'completed';
};

interface ExchangeContextType {
  exchanges: Exchange[];
  createExchange: (title: string, date: string, budget: string) => void;
  getExchange: (id: string) => Exchange | undefined;
  addParticipant: (exchangeId: string, name: string, email: string, suggestions?: string) => void;
  removeParticipant: (exchangeId: string, participantId: string) => void;
  drawNames: (exchangeId: string) => void;
  resetDraw: (exchangeId: string) => void;
  addToWishlist: (exchangeId: string, participantId: string, item: string) => void;
  currentUser: Participant | null; // Mocking a "logged in" user for the view
  setCurrentUser: (participant: Participant | null) => void;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

// Initial Mock Data
const MOCK_EXCHANGES: Exchange[] = [
  {
    id: 'demo-1',
    title: 'Fincred Holiday Exchange 2025',
    date: '2025-12-20',
    budget: 'K300',
    status: 'draft',
    participants: [
      { 
        id: 'p1', 
        name: 'Sarah Jenkins', 
        email: 'sarah@fincred.com', 
        suggestions: 'Loves aromatic candles and dark chocolate. Dislikes strong perfumes.',
        wishlist: ['Scented candles', 'Coffee mug'], 
        assignedToId: null 
      },
      { 
        id: 'p2', 
        name: 'Mike Ross', 
        email: 'mike@fincred.com', 
        suggestions: 'Huge tech nerd. Always needs cables or desk organizers. No food items.',
        wishlist: ['Tech gadgets', 'Socks'], 
        assignedToId: null 
      },
      { 
        id: 'p3', 
        name: 'Jessica Pearson', 
        email: 'jessica@fincred.com', 
        suggestions: 'Appreciates high quality tea and stationery. Elegant style.',
        wishlist: ['Luxury tea', 'Notebook'], 
        assignedToId: null 
      },
    ]
  }
];

export function ExchangeProvider({ children }: { children: ReactNode }) {
  const [exchanges, setExchanges] = useState<Exchange[]>(MOCK_EXCHANGES);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);

  const createExchange = (title: string, date: string, budget: string) => {
    const newExchange: Exchange = {
      id: generateId(),
      title,
      date,
      budget,
      participants: [],
      status: 'draft'
    };
    setExchanges([...exchanges, newExchange]);
  };

  const getExchange = (id: string) => exchanges.find(e => e.id === id);

  const addParticipant = (exchangeId: string, name: string, email: string, suggestions: string = "") => {
    setExchanges(prev => prev.map(ex => {
      if (ex.id !== exchangeId) return ex;
      return {
        ...ex,
        participants: [...ex.participants, { 
          id: generateId(), 
          name, 
          email, 
          suggestions,
          wishlist: [],
          assignedToId: null 
        }]
      };
    }));
  };

  const removeParticipant = (exchangeId: string, participantId: string) => {
    setExchanges(prev => prev.map(ex => {
      if (ex.id !== exchangeId) return ex;
      return {
        ...ex,
        participants: ex.participants.filter(p => p.id !== participantId)
      };
    }));
  };

  const resetDraw = (exchangeId: string) => {
     setExchanges(prev => prev.map(ex => {
      if (ex.id !== exchangeId) return ex;
      return {
        ...ex,
        status: 'draft',
        participants: ex.participants.map(p => ({...p, assignedToId: null}))
      };
    }));
  }

  const drawNames = (exchangeId: string) => {
    setExchanges(prev => prev.map(ex => {
      if (ex.id !== exchangeId) return ex;
      
      const participants = [...ex.participants];
      if (participants.length < 2) return ex; // Need at least 2 people

      // Simple shuffle and assign
      let shuffled = [...participants];
      let valid = false;
      
      // Keep shuffling until no one has themselves
      // (In a real app, use a better graph algorithm, but this works for small N)
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
          console.error("Could not find valid match in 100 attempts");
          // Fallback: Shift by 1 (guaranteed no self-match)
          shuffled = [...participants.slice(1), participants[0]];
      }

      const newParticipants = participants.map((p, i) => ({
        ...p,
        assignedToId: shuffled[i].id
      }));

      // Trigger confetti
      canvasConfetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1e3a8a', '#3b82f6', '#93c5fd'] // Blue confetti
      });

      return {
        ...ex,
        participants: newParticipants,
        status: 'active'
      };
    }));
  };

  const addToWishlist = (exchangeId: string, participantId: string, item: string) => {
    setExchanges(prev => prev.map(ex => {
      if (ex.id !== exchangeId) return ex;
      return {
        ...ex,
        participants: ex.participants.map(p => {
          if (p.id !== participantId) return p;
          return { ...p, wishlist: [...p.wishlist, item] };
        })
      };
    }));
  };

  return (
    <ExchangeContext.Provider value={{ 
      exchanges, 
      createExchange, 
      getExchange, 
      addParticipant, 
      removeParticipant, 
      drawNames, 
      resetDraw,
      addToWishlist,
      currentUser,
      setCurrentUser
    }}>
      {children}
    </ExchangeContext.Provider>
  );
}

export function useExchange() {
  const context = useContext(ExchangeContext);
  if (!context) throw new Error('useExchange must be used within ExchangeProvider');
  return context;
}
