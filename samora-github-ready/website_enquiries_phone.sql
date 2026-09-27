-- ═══════════════════════════════════════════════════════════════════════════
-- Capture a phone number on website enquiries.
--
-- Stored as text, not a number. Phone "numbers" are not numeric: they carry a
-- leading +, they have significant leading zeros in many countries, and the
-- longest valid E.164 number exceeds what an integer column would hold
-- comfortably. Every telephony and CRM system treats them as strings.
--
-- Run this BEFORE deploying api/contact.js if you want the field captured from
-- the first submission. The handler no longer DEPENDS on the order: if the
-- column is missing it logs loudly and stores the enquiry without the phone,
-- because losing a lead over a missing migration is the worse failure. But
-- until this runs, phone numbers people type are discarded.
-- ═══════════════════════════════════════════════════════════════════════════

alter table website_enquiries
  add column if not exists phone text;

comment on column website_enquiries.phone is
  'Optional phone number as supplied by the visitor. Normalised to E.164 (+countrycode, digits only) ONLY when the visitor included a country code; otherwise stored exactly as typed. No country is ever inferred: a number stored under a guessed dial code looks callable and is not.';


-- ── Check ─────────────────────────────────────────────────────────────────
select column_name, data_type, is_nullable
  from information_schema.columns
 where table_name = 'website_enquiries'
   and column_name in ('phone', 'email', 'name', 'company')
 order by column_name;
-- Expect four rows, phone nullable.


-- ── How many enquiries include a phone, once it is live ───────────────────
-- Useful for deciding whether the field earns its place. The research says a
-- phone field costs conversion even when optional; if almost nobody fills it
-- in AND submissions drop, remove it rather than keeping it out of habit.
select date_trunc('week', created_at) as week,
       count(*)                                        as enquiries,
       count(*) filter (where phone is not null)       as with_phone,
       round(100.0 * count(*) filter (where phone is not null) / nullif(count(*), 0), 1) as pct_with_phone
  from website_enquiries
 group by 1
 order by 1 desc;


-- ── Which ones are properly international ─────────────────────────────────
-- Anything not starting with + was typed without a country code. Worth knowing
-- before you hand the list to a dialer.
select id, created_at, company, email, phone,
       case when phone like '+%' then 'E.164' else 'no country code' end as format
  from website_enquiries
 where phone is not null
 order by created_at desc
 limit 50;
