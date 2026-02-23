export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    category: string | null
                    price: number
                    stock_status: 'in_stock' | 'made_to_order' | 'out_of_stock'
                    stock_quantity: number
                    images: string[] | null
                    original_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    category?: string | null
                    price?: number
                    stock_status?: 'in_stock' | 'made_to_order' | 'out_of_stock'
                    stock_quantity?: number
                    images?: string[] | null
                    original_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    category?: string | null
                    price?: number
                    stock_status?: 'in_stock' | 'made_to_order' | 'out_of_stock'
                    stock_quantity?: number
                    images?: string[] | null
                    original_url?: string | null
                    created_at?: string
                }
            }
        }
    }
}
