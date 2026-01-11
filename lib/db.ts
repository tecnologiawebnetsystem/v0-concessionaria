import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set")
}

export const sql = neon(process.env.DATABASE_URL)

// Helper function to handle database errors
export function handleDbError(error: unknown): never {
  console.error("[v0] Database error:", error)
  throw new Error("Database operation failed")
}

// Type definitions for database models
export type User = {
  id: string
  email: string
  name: string
  role: "user" | "admin" | "super_admin"
  phone?: string
  avatar_url?: string
  is_active: boolean
  email_verified: boolean
  created_at: Date
  updated_at: Date
}

export type Vehicle = {
  id: string
  brand_id?: string
  category_id?: string
  name: string
  slug: string
  model: string
  year: number
  price: number
  mileage?: number
  color?: string
  fuel_type?: string
  transmission?: string
  engine?: string
  description?: string
  features?: Record<string, unknown>
  specifications?: Record<string, unknown>
  status: "available" | "reserved" | "sold" | "maintenance"
  is_featured: boolean
  is_new: boolean
  views_count: number
  inquiries_count: number
  published: boolean
  published_at?: Date
  created_at: Date
  updated_at: Date
}

export type VehicleImage = {
  id: string
  vehicle_id: string
  url: string
  alt_text?: string
  display_order: number
  is_primary: boolean
  created_at: Date
}

export type BlogPost = {
  id: string
  author_id?: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  status: "draft" | "published" | "scheduled" | "archived"
  is_featured: boolean
  views_count: number
  published_at?: Date
  created_at: Date
  updated_at: Date
}

export type Banner = {
  id: string
  title: string
  subtitle?: string
  image_url: string
  mobile_image_url?: string
  link_url?: string
  link_text?: string
  position: "homepage" | "vehicles" | "blog" | "sidebar"
  display_order: number
  is_active: boolean
  start_date?: Date
  end_date?: Date
  created_at: Date
  updated_at: Date
}

export type Brand = {
  id: string
  name: string
  slug: string
  logo_url?: string
  description?: string
  is_active: boolean
  display_order: number
  created_at: Date
  updated_at: Date
}

export type VehicleCategory = {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  display_order: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export type Inquiry = {
  id: string
  user_id?: string
  vehicle_id?: string
  name: string
  email: string
  phone?: string
  message: string
  type: "general" | "vehicle" | "test_drive" | "financing"
  status: "new" | "contacted" | "in_progress" | "closed"
  notes?: string
  created_at: Date
  updated_at: Date
}
