// Common types used across examples

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

export interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
  likes?: number;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  pending?: boolean;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Profile {
  name: string;
  email: string;
  bio: string;
}
