import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Gym {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  settings?: any;
}

interface GymStore {
  selectedGym: Gym | null;
  gyms: Gym[];
  setSelectedGym: (gym: Gym) => void;
  setGyms: (gyms: Gym[]) => void;
  clearSelectedGym: () => void;
}

export const useGymStore = create<GymStore>()(
  persist(
    (set) => ({
      selectedGym: null,
      gyms: [],
      
      setSelectedGym: (gym) => set({ selectedGym: gym }),
      
      setGyms: (gyms) => set({ gyms }),
      
      clearSelectedGym: () => set({ selectedGym: null }),
    }),
    {
      name: 'gym-storage',
    }
  )
);
