import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ModuleId = 'intro' | 'girokonto' | 'payment_methods' | 'offline' | 'online' | 'transfer' | 'reflection';

interface GameState {
  currentModule: ModuleId;
  completedModules: ModuleId[];
  balance: number;
  inventory: string[];
  userFirstName: string;
  userLastName: string;
  
  // Bank Details
  userIban: string;
  userBic: string;
  bankName: string;

  // Reflection Answers
  reflectionAnswers: {
    sustainability: string;
    necessary: string;
    savings: string;
  };
  
  // Actions
  setUserNames: (first: string, last: string) => void;
  setBankDetails: (iban: string, bic: string, name: string) => void;
  setReflectionAnswer: (key: 'sustainability' | 'necessary' | 'savings', value: string) => void;
  
  completeModule: (id: ModuleId) => void;
  setCurrentModule: (id: ModuleId) => void;
  updateBalance: (amount: number) => void;
  addToInventory: (item: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currentModule: 'intro',
      completedModules: [],
      balance: 200.00,
      inventory: [],
      userFirstName: '',
      userLastName: '',
      userIban: '',
      userBic: '',
      bankName: '',
      reflectionAnswers: {
        sustainability: '',
        necessary: '',
        savings: ''
      },

      setUserNames: (first, last) => set({ userFirstName: first, userLastName: last }),
      
      setBankDetails: (iban, bic, name) => set({ 
        userIban: iban, 
        userBic: bic, 
        bankName: name 
      }),

      setReflectionAnswer: (key, value) => set((state) => ({
        reflectionAnswers: { ...state.reflectionAnswers, [key]: value }
      })),
      
      completeModule: (id) => set((state) => ({
        completedModules: [...new Set([...state.completedModules, id])]
      })),
      
      setCurrentModule: (id) => set({ currentModule: id }),
      
      updateBalance: (amount) => set((state) => ({ 
        balance: Number((state.balance + amount).toFixed(2)) 
      })),
      
      addToInventory: (item) => set((state) => ({
        inventory: [...state.inventory, item]
      })),

      resetGame: () => set({
        currentModule: 'intro',
        completedModules: [],
        balance: 200.00,
        inventory: [],
        userFirstName: '',
        userLastName: '',
        userIban: '',
        userBic: '',
        bankName: '',
        reflectionAnswers: {
          sustainability: '',
          necessary: '',
          savings: ''
        }
      })
    }),
    {
      name: 'finanz-checker-storage',
    }
  )
);
