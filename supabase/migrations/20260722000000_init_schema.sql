-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    "desc" TEXT,
    price NUMERIC NOT NULL,
    category TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create daily_order_counters table
CREATE TABLE IF NOT EXISTS public.daily_order_counters (
    date DATE PRIMARY KEY,
    last_seq INTEGER NOT NULL DEFAULT 0
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_no TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    method TEXT,
    address_lat NUMERIC,
    address_lng NUMERIC,
    address_patokan TEXT,
    payment_method TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_proof_url TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    cancelled BOOLEAN NOT NULL DEFAULT false,
    late_notified BOOLEAN NOT NULL DEFAULT false,
    total NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    price_snapshot NUMERIC NOT NULL,
    name_snapshot TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_order_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create atomic order number generator function
CREATE OR REPLACE FUNCTION public.generate_order_no()
RETURNS TRIGGER AS $$
DECLARE
    v_wita_date DATE;
    v_date_str TEXT;
    v_seq INTEGER;
    v_seq_str TEXT;
BEGIN
    -- Only generate order_no if not explicitly provided
    IF NEW.order_no IS NULL OR NEW.order_no = '' THEN
        -- Get current date in WITA timezone (Asia/Makassar)
        v_wita_date := (now() AT TIME ZONE 'Asia/Makassar')::DATE;
        v_date_str := to_char(v_wita_date, 'YYMMDD');

        -- Atomic upsert to increment sequence for current WITA date
        INSERT INTO public.daily_order_counters (date, last_seq)
        VALUES (v_wita_date, 1)
        ON CONFLICT (date)
        DO UPDATE SET last_seq = public.daily_order_counters.last_seq + 1
        RETURNING last_seq INTO v_seq;

        -- Format sequence number with leading zeros (at least 3 digits)
        v_seq_str := lpad(v_seq::TEXT, 3, '0');

        -- Set the generated order_no
        NEW.order_no := 'NP' || v_date_str || '-' || v_seq_str;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger BEFORE INSERT on orders
DROP TRIGGER IF EXISTS trigger_generate_order_no ON public.orders;

CREATE TRIGGER trigger_generate_order_no
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_no();
