import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import canvasConfetti from 'canvas-confetti';

export type Participant = {
  id: string;
  exchangeId: string;
  name: string;
  email: string;
  password: string;
  suggestions: string | null;
  wishlist: string[] | null;
  assignedToId: string | null;
};

export type Exchange = {
  id: string;
  title: string;
  date: string;
  budget: string;
  status: string;
  participants: Participant[];
};

interface ExchangeContextType {
  exchanges: Exchange[];
  loading: boolean;
  refreshExchanges: () => Promise<void>;
  createExchange: (title: string, date: string, budget: string) => Promise<void>;
  getExchange: (id: string) => Exchange | undefined;
  addParticipant: (exchangeId: string, name: string, email: string, suggestions?: string, password?: string) => Promise<void>;
  removeParticipant: (exchangeId: string, participantId: string) => Promise<void>;
  drawNames: (exchangeId: string) => Promise<void>;
  resetDraw: (exchangeId: string) => Promise<void>;
  addToWishlist: (exchangeId: string, participantId: string, item: string) => Promise<void>;
  currentUser: Participant | null;
  setCurrentUser: (participant: Participant | null) => void;
  currentExchangeId: string | null;
  setCurrentExchangeId: (id: string | null) => void;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

export function ExchangeProvider({ children }: { children: ReactNode }) {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [currentExchangeId, setCurrentExchangeId] = useState<string | null>(null);

  const refreshExchanges = useCallback(async () => {
    try {
      const response = await fetch('/api/exchanges');
      if (response.ok) {
        const data = await response.json();
        setExchanges(data);
      }
    } catch (error) {
      console.error('Failed to fetch exchanges:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshExchanges();
  }, [refreshExchanges]);

  const createExchange = async (title: string, date: string, budget: string) => {
    try {
      const response = await fetch('/api/exchanges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, budget, status: 'draft' })
      });
      if (response.ok) {
        await refreshExchanges();
      }
    } catch (error) {
      console.error('Failed to create exchange:', error);
    }
  };

  const getExchange = (id: string) => exchanges.find(e => e.id === id);

  const addParticipant = async (exchangeId: string, name: string, email: string, suggestions: string = "", password: string = "fincred2025") => {
    try {
      const response = await fetch(`/api/exchanges/${exchangeId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, suggestions, password })
      });
      if (response.ok) {
        await refreshExchanges();
      }
    } catch (error) {
      console.error('Failed to add participant:', error);
    }
  };

  const removeParticipant = async (exchangeId: string, participantId: string) => {
    try {
      const response = await fetch(`/api/participants/${participantId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await refreshExchanges();
      }
    } catch (error) {
      console.error('Failed to remove participant:', error);
    }
  };

  const resetDraw = async (exchangeId: string) => {
    try {
      const response = await fetch(`/api/exchanges/${exchangeId}/reset`, {
        method: 'POST'
      });
      if (response.ok) {
        await refreshExchanges();
      }
    } catch (error) {
      console.error('Failed to reset draw:', error);
    }
  };

  const drawNames = async (exchangeId: string) => {
    try {
      const response = await fetch(`/api/exchanges/${exchangeId}/draw`, {
        method: 'POST'
      });
      if (response.ok) {
        await refreshExchanges();
        canvasConfetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1e3a8a', '#3b82f6', '#93c5fd']
        });
      }
    } catch (error) {
      console.error('Failed to draw names:', error);
    }
  };

  const addToWishlist = async (exchangeId: string, participantId: string, item: string) => {
    try {
      const response = await fetch(`/api/participants/${participantId}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item })
      });
      if (response.ok) {
        await refreshExchanges();
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  return (
    <ExchangeContext.Provider value={{ 
      exchanges, 
      loading,
      refreshExchanges,
      createExchange, 
      getExchange, 
      addParticipant, 
      removeParticipant, 
      drawNames, 
      resetDraw,
      addToWishlist,
      currentUser,
      setCurrentUser,
      currentExchangeId,
      setCurrentExchangeId
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
