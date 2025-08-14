import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { Platform } from 'react-native';

// Custom storage for web using localStorage, with SSR safety
//const webStorage = {
 // getItem: async (key: string) => {
 //   if (typeof window !== 'undefined') {
  //    return window.localStorage.getItem(key);
 //   }
 //   return null; // Return null during SSR
//},
 // setItem: async (key: string, value: string) => {
 //   if (typeof window !== 'undefined') {
 //     window.localStorage.setItem(key, value);
//}
//  },
//  removeItem: async (key: string) => {
//    if (typeof window !== 'undefined') {
//      window.localStorage.removeItem(key);
//    }
//  },
//};

// Use AsyncStorage for mobile, webStorage for web
//const storage = Platform.OS === 'web' ? webStorage : AsyncStorage;



const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});