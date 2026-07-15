import { create } from 'zustand';

interface EnergyState {
  timeRange: 'day' | 'month' | 'year';
  energyType: 'electric' | 'water' | 'all';
  setTimeRange: (range: 'day' | 'month' | 'year') => void;
  setEnergyType: (type: 'electric' | 'water' | 'all') => void;
}

export const useEnergyStore = create<EnergyState>()((set) => ({
  timeRange: 'day',
  energyType: 'all',
  setTimeRange: (range) => set({ timeRange: range }),
  setEnergyType: (type) => set({ energyType: type })
}));