# Revenue Engine ↔ SynSok Core PMS — Setup

## Architecture
Both apps share **one Supabase backend** (the PMS project: `idiatsdwvqlsprgkxqil`).
PMS owns the source-of-truth tables (`hotels`, `rooms`, `reservations`, `guests`, …).
Revenue Engine reads them via RLS and adds its own `re_*` tables for AI artifacts.

## Step 1 — Apply the database migration (one time, in PMS)

The schema additions live in [`docs/revenue_engine_init.sql`](./revenue_engine_init.sql).

Two ways to apply:

1. **From the SynSok Core PMS Lovable project** — open it and tell the agent:
   > "Apply the SQL at `docs/revenue_engine_init.sql` from the Revenue Engine project."
2. **Directly in Supabase** — paste the file contents into:
   https://supabase.com/dashboard/project/idiatsdwvqlsprgkxqil/sql

The migration:
- Adds `revenue_manager` to the `app_role` enum
- Adds `revenue_engine` to the `module_type` enum
- Creates 10 `re_*` tables with RLS + Data API grants

It does **not** mutate any existing PMS table.

## Step 2 — Provision a Revenue Engine user (per hotel, in PMS)

A superadmin in PMS, for each hotel that should get Revenue Engine:

1. **Enable the module** — insert a row into `hotel_modules`:
   ```sql
   INSERT INTO public.hotel_modules (hotel_id, module, is_enabled)
   VALUES ('<hotel-uuid>', 'revenue_engine', true);
   ```
2. **Create the GM user** in Supabase Auth (or reuse an existing PMS user).
3. **Assign the role**:
   ```sql
   INSERT INTO public.user_roles (user_id, role, hotel_id)
   VALUES ('<user-uuid>', 'revenue_manager', '<hotel-uuid>');
   ```
4. **Link to the hotel** (if `profiles.hotel_id` isn't set):
   ```sql
   UPDATE public.profiles SET hotel_id = '<hotel-uuid>' WHERE id = '<user-uuid>';
   ```

The GM can now sign in to the Revenue Engine app with their PMS credentials.
Without **both** the role and the module, login is blocked with a clear message.

## Access matrix

| Role             | RE access |
|------------------|-----------|
| `superadmin`     | All hotels |
| `hotel_admin`    | Own hotel (if module enabled) |
| `manager`        | Own hotel (if module enabled) |
| `revenue_manager`| Own hotel (if module enabled) — the dedicated RE role |
| other roles      | Blocked |
