insert into public.admin_invites (email) values ('isaac.ayala@utp.ac.pa') on conflict do nothing;
insert into public.user_roles (user_id, role)
select id, 'administrador' from auth.users where lower(email) = 'isaac.ayala@utp.ac.pa' and email_confirmed_at is not null
on conflict do nothing;