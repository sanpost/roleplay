// /types/user.d.ts
export interface User {
    id: number;
    google_id: string;
    username: string;
    email: string;
    created_at: Date;
  }
  
  export interface Profile {
    id: number;
    user_id: number;
    bio?: string;
    age?: number;
    preferences?: string;
    age_range?: string;
    relationship?: string;
    gender?: string;
  }
  