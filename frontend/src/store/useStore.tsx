import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface State {
  user: User | null;
  notes: Note[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchNotes: () => Promise<void>;
  addNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  updateProfile: (username: string, password: string) => Promise<void>;
  initialize: () => Promise<void>;
}

const useStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      notes: [],
      isLoading: false,
      isInitialized: false,
      error: null,

      initialize: async () => {
        if (get().isInitialized) return;
        set({ isLoading: true });
        try {
          const response = await axios.get('http://localhost:8000/api/auth/me', { withCredentials: true });
          set({ user: response.data.user, isInitialized: true, isLoading: false });
        } catch (error) {
          set({ isInitialized: true, isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const loginResponse = await axios.post('http://localhost:8000/api/auth/login', { email, password }, { withCredentials: true });
          set({ user: loginResponse.data.user, isLoading: false });
        } catch (error) {
          set({ error: error.response?.data?.message || 'An error occurred during login', isLoading: false });
        }
      },

      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          await axios.post('http://localhost:8000/api/auth/register', { username, email, password });
          set({ isLoading: false });
        } catch (error) {
          set({ error: error.response.data.message, isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.post('http://localhost:8000/api/auth/logout', {}, { withCredentials: true });
          set({ user: null, notes: [], isLoading: false });
        } catch (error) {
          set({ error: error.response.data.message, isLoading: false });
        }
      },

      fetchNotes: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get('http://localhost:8000/api/notes', { withCredentials: true });
          set({ notes: response.data, isLoading: false });
        } catch (error) {
          set({ error: error.response.data.message, isLoading: false });
        }
      },

      addNote: async (title, content) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('http://localhost:8000/api/notes', { title, content }, { withCredentials: true });
          set((state) => ({ notes: [...state.notes, response.data], isLoading: false }));
        } catch (error) {
          set({ error: error.response.data.message, isLoading: false });
        }
      },

      updateNote: async (id, title, content) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.put(`http://localhost:8000/api/notes/${id}`, { title, content }, { withCredentials: true });
          set((state) => ({
            notes: state.notes.map((note) => (note._id === id ? response.data : note)),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error.response.data.message, isLoading: false });
        }
      },

      deleteNote: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete(`http://localhost:8000/api/notes/${id}`, { withCredentials: true });
          set((state) => ({
            notes: state.notes.filter((note) => note._id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error.response.data.message, isLoading: false });
        }
      },

      updateProfile: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.put('http://localhost:8000/api/users/profile', { username, password }, { withCredentials: true });
          set((state) => ({
            user: { ...state.user, ...response.data.user },
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error.response.data.message, isLoading: false });
        }
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useStore;

