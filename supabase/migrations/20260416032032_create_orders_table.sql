/*
  # Create Orders Table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `enquiry_number` (text, unique)
      - `customer_name` (text)
      - `customer_mobile` (text)
      - `customer_email` (text, nullable)
      - `customer_address` (text)
      - `customer_city` (text)
      - `customer_state` (text)
      - `cart_items` (jsonb - array of {product_id, quantity})
      - `net_total` (integer)
      - `overall_total` (integer)
      - `pdf_url` (text, nullable)
      - `whatsapp_sent` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - RLS disabled (public orders, shop owner only reads via API)
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_mobile text NOT NULL,
  customer_email text,
  customer_address text NOT NULL,
  customer_city text NOT NULL,
  customer_state text NOT NULL,
  cart_items jsonb NOT NULL,
  net_total integer NOT NULL,
  overall_total integer NOT NULL,
  pdf_url text,
  whatsapp_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_enquiry ON orders(enquiry_number);
CREATE INDEX IF NOT EXISTS idx_orders_mobile ON orders(customer_mobile);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
