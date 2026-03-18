alter table public.raffle_entries
add column if not exists address text;

update public.raffle_entries
set address = coalesce(nullif(trim(address), ''), 'Address not provided')
where address is null;