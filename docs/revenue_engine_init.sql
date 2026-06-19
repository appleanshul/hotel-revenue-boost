-- ============================================================
-- Revenue Engine — initial schema (apply in SynSok Core PMS DB)
-- Project: idiatsdwvqlsprgkxqil
-- ============================================================
-- HOW TO APPLY:
--   Open the SynSok Core PMS Lovable project, ask the agent to run
--   this SQL via its migration tool, or paste it into the Supabase
--   SQL editor at:
--     https://supabase.com/dashboard/project/idiatsdwvqlsprgkxqil/sql
--
-- This migration extends PMS:
--   1. Adds 'revenue_manager' to app_role enum
--   2. Adds 'revenue_engine' to module_type enum
--   3. Creates RE-owned tables (re_*) with RLS keyed off hotel_id
-- It does NOT mutate any existing PMS table.
-- ============================================================

-- 1. ENUM EXTENSIONS ---------------------------------------------------------
ALTER TYPE public.app_role    ADD VALUE IF NOT EXISTS 'revenue_manager';
ALTER TYPE public.module_type ADD VALUE IF NOT EXISTS 'revenue_engine';

-- 2. HELPER: module gate -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.re_has_module(_hotel_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.hotel_modules
    WHERE hotel_id = _hotel_id
      AND module = 'revenue_engine'
      AND COALESCE(is_enabled, true) = true
  );
$$;

-- 3. RE-OWNED TABLES ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.re_daily_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  room_type_id uuid REFERENCES public.room_types(id) ON DELETE CASCADE,
  rate_plan_id uuid REFERENCES public.rate_plans(id) ON DELETE SET NULL,
  date date NOT NULL,
  rate numeric(12,2) NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  applied_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (hotel_id, room_type_id, rate_plan_id, date)
);
CREATE INDEX IF NOT EXISTS idx_re_daily_rates_hotel_date ON public.re_daily_rates(hotel_id, date);

CREATE TABLE IF NOT EXISTS public.re_local_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  start_date date NOT NULL,
  end_date date,
  venue text,
  expected_attendance int,
  demand_impact text NOT NULL DEFAULT 'medium',
  suggested_uplift_pct numeric(5,2),
  source text DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_re_local_events_hotel_date ON public.re_local_events(hotel_id, start_date);

CREATE TABLE IF NOT EXISTS public.re_comp_set (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  name text NOT NULL,
  stars int,
  standard_rate numeric(12,2),
  deluxe_rate numeric(12,2),
  suite_rate numeric(12,2),
  occupancy_pct numeric(5,2),
  rating numeric(3,2),
  last_scraped_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_re_comp_set_hotel ON public.re_comp_set(hotel_id);

CREATE TABLE IF NOT EXISTS public.re_channel_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  channel text NOT NULL,
  snapshot_date date NOT NULL,
  bookings int NOT NULL DEFAULT 0,
  revenue numeric(14,2) NOT NULL DEFAULT 0,
  commission_pct numeric(5,2),
  avg_rate numeric(12,2),
  cancel_rate_pct numeric(5,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (hotel_id, channel, snapshot_date)
);

CREATE TABLE IF NOT EXISTS public.re_price_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  room_type_id uuid REFERENCES public.room_types(id) ON DELETE CASCADE,
  date date NOT NULL,
  current_rate numeric(12,2),
  suggested_rate numeric(12,2) NOT NULL,
  delta_pct numeric(6,2),
  confidence numeric(4,3),
  rationale text,
  drivers jsonb,
  status text NOT NULL DEFAULT 'pending',
  applied_at timestamptz,
  applied_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_re_price_suggestions_hotel_date ON public.re_price_suggestions(hotel_id, date);

CREATE TABLE IF NOT EXISTS public.re_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  start_date date,
  end_date date,
  discount_pct numeric(5,2),
  target_segment text,
  channels text[],
  content jsonb,
  bookings_generated int NOT NULL DEFAULT 0,
  revenue_generated numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.re_geo_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  audited_url text NOT NULL,
  overall_score int,
  ai_readability int,
  schema_markup jsonb,
  missing_schema jsonb,
  word_count int,
  raw_result jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.re_geo_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  audit_id uuid REFERENCES public.re_geo_audits(id) ON DELETE CASCADE,
  plain_title text NOT NULL,
  impact int NOT NULL DEFAULT 2,
  status text NOT NULL DEFAULT 'red',
  auto_fixable boolean NOT NULL DEFAULT false,
  category text,
  fixed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.re_briefings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  briefing_date date NOT NULL,
  summary text NOT NULL,
  highlights jsonb,
  alerts jsonb,
  actions jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (hotel_id, briefing_date)
);

CREATE TABLE IF NOT EXISTS public.re_upsell_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  reservation_id uuid REFERENCES public.reservations(id) ON DELETE SET NULL,
  offer_type text NOT NULL,
  offer_value numeric(12,2),
  status text NOT NULL DEFAULT 'offered',
  revenue_added numeric(12,2),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. GRANTS (Data API access — required) -------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.re_daily_rates       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.re_local_events      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.re_comp_set          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.re_channel_snapshots TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.re_price_suggestions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.re_campaigns         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.re_geo_audits        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.re_geo_issues        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.re_briefings         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.re_upsell_logs       TO authenticated;

GRANT ALL ON public.re_daily_rates,
             public.re_local_events,
             public.re_comp_set,
             public.re_channel_snapshots,
             public.re_price_suggestions,
             public.re_campaigns,
             public.re_geo_audits,
             public.re_geo_issues,
             public.re_briefings,
             public.re_upsell_logs
       TO service_role;

-- 5. RLS ---------------------------------------------------------------------
ALTER TABLE public.re_daily_rates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.re_local_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.re_comp_set          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.re_channel_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.re_price_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.re_campaigns         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.re_geo_audits        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.re_geo_issues        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.re_briefings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.re_upsell_logs       ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    're_daily_rates','re_local_events','re_comp_set','re_channel_snapshots',
    're_price_suggestions','re_campaigns','re_geo_audits','re_geo_issues',
    're_briefings','re_upsell_logs'
  ] LOOP
    EXECUTE format($f$
      CREATE POLICY "%1$s superadmin all" ON public.%1$I FOR ALL TO authenticated
        USING (public.has_role(auth.uid(), 'superadmin'))
        WITH CHECK (public.has_role(auth.uid(), 'superadmin'));
    $f$, t);

    EXECUTE format($f$
      CREATE POLICY "%1$s hotel access" ON public.%1$I FOR ALL TO authenticated
        USING (
          hotel_id = public.get_user_hotel_id(auth.uid())
          AND public.re_has_module(hotel_id)
          AND (
            public.has_role(auth.uid(), 'revenue_manager')
            OR public.has_role(auth.uid(), 'hotel_admin')
            OR public.has_role(auth.uid(), 'manager')
          )
        )
        WITH CHECK (
          hotel_id = public.get_user_hotel_id(auth.uid())
          AND public.re_has_module(hotel_id)
          AND (
            public.has_role(auth.uid(), 'revenue_manager')
            OR public.has_role(auth.uid(), 'hotel_admin')
            OR public.has_role(auth.uid(), 'manager')
          )
        );
    $f$, t);
  END LOOP;
END $$;
