
create type public.app_role as enum ('estudiante','organizador','administrador');
create type public.event_modality as enum ('presencial','virtual','hibrida');
create type public.registration_mode as enum ('obligatoria','opcional','ninguna');
create type public.event_status as enum ('borrador','publicado','cancelado','finalizado');
create type public.registration_status as enum ('inscrito','cancelado');

create table public.campuses (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  ciudad text not null default '',
  activa boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.campuses to anon, authenticated;
grant insert, update, delete on public.campuses to authenticated;
grant all on public.campuses to service_role;
alter table public.campuses enable row level security;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  color text not null default '#7a1f7a',
  icono text not null default 'Sparkles',
  orden int not null default 0,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  siglas text not null default '',
  tipo text not null default 'organizacion',
  logo_url text,
  mostrar_en_franja boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.organizations to anon, authenticated;
grant insert, update, delete on public.organizations to authenticated;
grant all on public.organizations to service_role;
alter table public.organizations enable row level security;

create table public.app_settings (
  id int primary key default 1 check (id = 1),
  dominio_correo text not null default 'utp.ac.pa',
  restringir_dominio boolean not null default true,
  color_primario text not null default '#7a1f7a',
  logo_url text,
  updated_at timestamptz not null default now()
);
grant select on public.app_settings to anon, authenticated;
grant update on public.app_settings to authenticated;
grant all on public.app_settings to service_role;
alter table public.app_settings enable row level security;
insert into public.app_settings (id) values (1);

create table public.admin_invites (
  email text primary key,
  created_at timestamptz not null default now()
);
grant all on public.admin_invites to service_role;
alter table public.admin_invites enable row level security;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default '',
  correo text not null default '',
  carrera text not null default '',
  facultad text not null default '',
  sede_id uuid references public.campuses(id) on delete set null,
  id_estudiantil text not null default '',
  foto_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select, insert, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('organizador','administrador'))
$$;

create table public.events (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text not null default '',
  requisitos text not null default '',
  categoria_id uuid references public.categories(id) on delete set null,
  organizacion_id uuid references public.organizations(id) on delete set null,
  sede_id uuid references public.campuses(id) on delete set null,
  creado_por uuid,
  fecha_inicio timestamptz not null,
  fecha_fin timestamptz not null,
  modalidad public.event_modality not null default 'presencial',
  ubicacion text not null default '',
  enlace_mapa text,
  enlace_virtual text,
  banner_url text,
  cupos int,
  modo_inscripcion public.registration_mode not null default 'obligatoria',
  fecha_limite timestamptz,
  publico_objetivo text not null default '',
  horas_labor_social numeric not null default 0,
  destacado boolean not null default false,
  estado public.event_status not null default 'borrador',
  inscritos_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index events_fecha_inicio_idx on public.events (fecha_inicio);
grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
grant all on public.events to service_role;
alter table public.events enable row level security;

create table public.event_sponsors (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  nombre text not null,
  logo_url text,
  created_at timestamptz not null default now()
);
grant select on public.event_sponsors to anon, authenticated;
grant insert, update, delete on public.event_sponsors to authenticated;
grant all on public.event_sponsors to service_role;
alter table public.event_sponsors enable row level security;

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null,
  estado public.registration_status not null default 'inscrito',
  asistio boolean not null default false,
  fecha_inscripcion timestamptz not null default now(),
  unique (event_id, user_id)
);
create index registrations_user_idx on public.registrations (user_id);
grant select, insert, update on public.registrations to authenticated;
grant all on public.registrations to service_role;
alter table public.registrations enable row level security;

create or replace function public.owns_event(_user_id uuid, _event_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.events where id = _event_id and creado_por = _user_id)
$$;

create or replace function public.can_view_profile(_viewer uuid, _profile uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select _viewer = _profile
    or public.has_role(_viewer, 'administrador')
    or exists (
      select 1 from public.registrations r join public.events e on e.id = r.event_id
      where r.user_id = _profile and e.creado_por = _viewer
    )
$$;

create policy "Todos ven sedes" on public.campuses for select to anon, authenticated using (true);
create policy "Admin gestiona sedes" on public.campuses for all to authenticated
  using (public.has_role(auth.uid(),'administrador')) with check (public.has_role(auth.uid(),'administrador'));

create policy "Todos ven categorias" on public.categories for select to anon, authenticated using (true);
create policy "Admin gestiona categorias" on public.categories for all to authenticated
  using (public.has_role(auth.uid(),'administrador')) with check (public.has_role(auth.uid(),'administrador'));

create policy "Todos ven organizaciones" on public.organizations for select to anon, authenticated using (true);
create policy "Admin gestiona organizaciones" on public.organizations for all to authenticated
  using (public.has_role(auth.uid(),'administrador')) with check (public.has_role(auth.uid(),'administrador'));

create policy "Todos ven configuracion" on public.app_settings for select to anon, authenticated using (true);
create policy "Admin edita configuracion" on public.app_settings for update to authenticated
  using (public.has_role(auth.uid(),'administrador')) with check (public.has_role(auth.uid(),'administrador'));

create policy "Ver perfiles permitidos" on public.profiles for select to authenticated
  using (public.can_view_profile(auth.uid(), id));
create policy "Crear perfil propio" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Editar perfil propio" on public.profiles for update to authenticated
  using (auth.uid() = id or public.has_role(auth.uid(),'administrador'))
  with check (auth.uid() = id or public.has_role(auth.uid(),'administrador'));

create policy "Ver roles propios o admin" on public.user_roles for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(),'administrador'));
create policy "Admin asigna roles" on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(),'administrador'));
create policy "Admin quita roles" on public.user_roles for delete to authenticated
  using (public.has_role(auth.uid(),'administrador'));

create policy "Publico ve eventos publicados" on public.events for select to anon, authenticated
  using (estado in ('publicado','finalizado','cancelado'));
create policy "Dueño o admin ve sus eventos" on public.events for select to authenticated
  using (creado_por = auth.uid() or public.has_role(auth.uid(),'administrador'));
create policy "Staff crea eventos" on public.events for insert to authenticated
  with check (creado_por = auth.uid() and public.is_staff(auth.uid()));
create policy "Dueño o admin edita eventos" on public.events for update to authenticated
  using ((creado_por = auth.uid() and public.is_staff(auth.uid())) or public.has_role(auth.uid(),'administrador'))
  with check ((creado_por = auth.uid() and public.is_staff(auth.uid())) or public.has_role(auth.uid(),'administrador'));
create policy "Dueño o admin borra eventos" on public.events for delete to authenticated
  using ((creado_por = auth.uid() and public.is_staff(auth.uid())) or public.has_role(auth.uid(),'administrador'));

create policy "Todos ven patrocinadores" on public.event_sponsors for select to anon, authenticated using (true);
create policy "Dueño o admin gestiona patrocinadores" on public.event_sponsors for all to authenticated
  using (public.owns_event(auth.uid(), event_id) or public.has_role(auth.uid(),'administrador'))
  with check (public.owns_event(auth.uid(), event_id) or public.has_role(auth.uid(),'administrador'));

create policy "Ver inscripciones propias o de mis eventos" on public.registrations for select to authenticated
  using (user_id = auth.uid() or public.owns_event(auth.uid(), event_id) or public.has_role(auth.uid(),'administrador'));
create policy "Inscribirse uno mismo" on public.registrations for insert to authenticated
  with check (user_id = auth.uid());
create policy "Actualizar inscripcion propia o de mis eventos" on public.registrations for update to authenticated
  using (user_id = auth.uid() or public.owns_event(auth.uid(), event_id) or public.has_role(auth.uid(),'administrador'))
  with check (user_id = auth.uid() or public.owns_event(auth.uid(), event_id) or public.has_role(auth.uid(),'administrador'));

create or replace function public.validate_registration()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  ev public.events%rowtype;
  activos int;
  es_gestor boolean;
begin
  select * into ev from public.events where id = new.event_id;
  if not found then raise exception 'El evento no existe'; end if;
  es_gestor := coalesce(ev.creado_por = auth.uid(), false) or public.has_role(auth.uid(),'administrador');

  if tg_op = 'INSERT' then
    if new.asistio and not es_gestor then new.asistio := false; end if;
  elsif new.asistio is distinct from old.asistio and not es_gestor then
    raise exception 'Solo el organizador puede marcar asistencia';
  end if;
  if tg_op = 'UPDATE' and (new.user_id <> old.user_id or new.event_id <> old.event_id) then
    raise exception 'No se puede cambiar el evento o usuario de una inscripción';
  end if;

  if new.estado = 'inscrito' and (tg_op = 'INSERT' or old.estado <> 'inscrito') then
    if ev.estado <> 'publicado' then raise exception 'El evento no está disponible para inscripción'; end if;
    if ev.modo_inscripcion = 'ninguna' then raise exception 'Este evento es solo informativo'; end if;
    if ev.fecha_fin < now() then raise exception 'El evento ya finalizó'; end if;
    if ev.fecha_limite is not null and ev.fecha_limite < now() then raise exception 'La fecha límite de inscripción ya pasó'; end if;
    if ev.cupos is not null then
      select count(*) into activos from public.registrations
        where event_id = new.event_id and estado = 'inscrito' and id <> new.id;
      if activos >= ev.cupos then raise exception 'Cupos agotados'; end if;
    end if;
  end if;

  if tg_op = 'UPDATE' and new.estado = 'cancelado' and old.estado = 'inscrito' and not es_gestor then
    if ev.fecha_inicio < now() then raise exception 'No se puede cancelar después de iniciado el evento'; end if;
  end if;
  return new;
end;
$$;
create trigger registrations_validate before insert or update on public.registrations
for each row execute function public.validate_registration();

create or replace function public.refresh_event_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare _eid uuid;
begin
  _eid := coalesce(new.event_id, old.event_id);
  perform set_config('app.counting', 'on', true);
  update public.events set inscritos_count =
    (select count(*) from public.registrations where event_id = _eid and estado = 'inscrito')
  where id = _eid;
  perform set_config('app.counting', 'off', true);
  return null;
end;
$$;
create trigger registrations_count after insert or update or delete on public.registrations
for each row execute function public.refresh_event_count();

create or replace function public.protect_event_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' then
    if coalesce(current_setting('app.counting', true), 'off') <> 'on' then
      new.inscritos_count := old.inscritos_count;
    end if;
    if new.creado_por is distinct from old.creado_por and not public.has_role(auth.uid(),'administrador') then
      new.creado_por := old.creado_por;
    end if;
    if new.destacado is distinct from old.destacado and auth.uid() is not null and not public.has_role(auth.uid(),'administrador') then
      new.destacado := old.destacado;
    end if;
  else
    new.inscritos_count := 0;
    if new.destacado and auth.uid() is not null and not public.has_role(auth.uid(),'administrador') then new.destacado := false; end if;
  end if;
  if new.fecha_fin < new.fecha_inicio then raise exception 'La fecha de fin debe ser posterior al inicio'; end if;
  new.updated_at := now();
  return new;
end;
$$;
create trigger events_protect before insert or update on public.events
for each row execute function public.protect_event_fields();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare s public.app_settings%rowtype;
begin
  select * into s from public.app_settings where id = 1;
  if s.restringir_dominio and lower(split_part(new.email,'@',2)) <> lower(s.dominio_correo) then
    raise exception 'Solo se permiten correos institucionales @%', s.dominio_correo;
  end if;
  insert into public.profiles (id, nombre, correo, carrera, facultad, id_estudiantil)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'nombre',''), split_part(new.email,'@',1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'carrera',''),
    coalesce(new.raw_user_meta_data->>'facultad',''),
    coalesce(new.raw_user_meta_data->>'id_estudiantil','')
  ) on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'estudiante') on conflict do nothing;
  if new.email_confirmed_at is not null and exists (select 1 from public.admin_invites where lower(email) = lower(new.email)) then
    insert into public.user_roles (user_id, role) values (new.id, 'administrador') on conflict do nothing;
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.handle_user_confirmed()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.admin_invites where lower(email) = lower(new.email)) then
    insert into public.user_roles (user_id, role) values (new.id, 'administrador') on conflict do nothing;
  end if;
  return new;
end;
$$;
create trigger on_auth_user_confirmed after update of email_confirmed_at on auth.users
for each row when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
execute function public.handle_user_confirmed();

create or replace function public.admin_list_users()
returns table (id uuid, nombre text, correo text, facultad text, carrera text, roles public.app_role[], created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(),'administrador') then raise exception 'No autorizado'; end if;
  return query
    select p.id, p.nombre, p.correo, p.facultad, p.carrera,
      coalesce(array_agg(r.role) filter (where r.role is not null), '{}')::public.app_role[],
      p.created_at
    from public.profiles p left join public.user_roles r on r.user_id = p.id
    group by p.id order by p.created_at desc;
end;
$$;
revoke execute on function public.admin_list_users() from anon, public;
grant execute on function public.admin_list_users() to authenticated;

create policy "Media visible" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy "Usuarios suben media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Usuarios actualizan su media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Usuarios borran su media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

insert into public.campuses (id, nombre, ciudad) values
 ('10000000-0000-0000-0000-000000000001','Campus Víctor Levi Sasso','Ciudad de Panamá'),
 ('10000000-0000-0000-0000-000000000002','Centro Regional de Chiriquí','David'),
 ('10000000-0000-0000-0000-000000000003','Centro Regional de Azuero','Chitré'),
 ('10000000-0000-0000-0000-000000000004','Centro Regional de Coclé','Penonomé'),
 ('10000000-0000-0000-0000-000000000005','Centro Regional de Colón','Colón'),
 ('10000000-0000-0000-0000-000000000006','Centro Regional de Veraguas','Santiago'),
 ('10000000-0000-0000-0000-000000000007','Centro Regional de Panamá Oeste','La Chorrera'),
 ('10000000-0000-0000-0000-000000000008','Centro Regional de Bocas del Toro','Changuinola');

insert into public.categories (id, nombre, slug, color, icono, orden) values
 ('20000000-0000-0000-0000-000000000001','Eventos de Labor Social','labor-social','#16a34a','HeartHandshake',1),
 ('20000000-0000-0000-0000-000000000002','Conferencias','conferencias','#2563eb','Mic',2),
 ('20000000-0000-0000-0000-000000000003','Actividades Extracurriculares','extracurriculares','#ea580c','Trophy',3),
 ('20000000-0000-0000-0000-000000000004','Actividades Educativas','educativas','#0891b2','GraduationCap',4),
 ('20000000-0000-0000-0000-000000000005','Anuncios Universitarios','anuncios','#7a1f7a','Megaphone',5),
 ('20000000-0000-0000-0000-000000000006','Eventos Universitarios','universitarios','#c026d3','PartyPopper',6),
 ('20000000-0000-0000-0000-000000000007','Eventos Externos','externos','#4f46e5','Globe',7),
 ('20000000-0000-0000-0000-000000000008','Feria de Empleo UTP','feria-empleo','#ca8a04','Briefcase',8),
 ('20000000-0000-0000-0000-000000000009','Giras Educativas','giras','#0d9488','Bus',9),
 ('20000000-0000-0000-0000-000000000010','Otros','otros','#64748b','Sparkles',10);

insert into public.organizations (id, nombre, siglas, tipo, logo_url, mostrar_en_franja) values
 ('30000000-0000-0000-0000-000000000001','Universidad Tecnológica de Panamá','UTP','organizacion','/__l5e/assets-v1/bbe42500-a302-40f4-a372-e14a6f2404cf/logo-utp.png',true),
 ('30000000-0000-0000-0000-000000000002','Facultad de Ingeniería de Sistemas Computacionales','FISC','facultad','/__l5e/assets-v1/53918ef9-c724-435a-ab41-c20fbe0d0137/logo-fisc.png',true),
 ('30000000-0000-0000-0000-000000000003','Facultad de Ingeniería Civil','FIC','facultad',null,true),
 ('30000000-0000-0000-0000-000000000004','Facultad de Ingeniería Eléctrica','FIE','facultad',null,true),
 ('30000000-0000-0000-0000-000000000005','Facultad de Ingeniería Industrial','FII','facultad',null,true),
 ('30000000-0000-0000-0000-000000000006','Facultad de Ingeniería Mecánica','FIM','facultad',null,true),
 ('30000000-0000-0000-0000-000000000007','Facultad de Ciencias y Tecnología','FCT','facultad',null,true),
 ('30000000-0000-0000-0000-000000000008','Vicerrectoría de Vida Universitaria','VIVU','organizacion',null,true);

insert into public.events (titulo, descripcion, requisitos, categoria_id, organizacion_id, sede_id, fecha_inicio, fecha_fin, modalidad, ubicacion, enlace_mapa, enlace_virtual, banner_url, cupos, modo_inscripcion, fecha_limite, publico_objetivo, horas_labor_social, destacado, estado) values
 ('Feria de Empleo UTP 2026','Más de 40 empresas nacionales e internacionales buscan talento UTP. Trae tu hoja de vida impresa, participa en entrevistas rápidas y talleres de marca personal.','Hoja de vida actualizada. Vestimenta formal.','20000000-0000-0000-0000-000000000008','30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','2026-12-03 09:00-05','2026-12-03 16:00-05','presencial','Edificio de Postgrado, Planta Baja','https://maps.google.com/?q=Universidad+Tecnologica+de+Panama',null,'/images/events/feria-empleo.jpg',null,'opcional',null,'Estudiantes de último año y egresados',0,true,'publicado'),
 ('Congreso de Inteligencia Artificial y Datos','Conferencias magistrales sobre IA generativa, ciencia de datos y ética tecnológica con expertos de la región.','Ninguno.','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','2026-11-27 08:30-05','2026-11-27 13:00-05','hibrida','Auditorio Central','https://maps.google.com/?q=Universidad+Tecnologica+de+Panama','https://meet.google.com/','/images/events/congreso-ia.jpg',250,'obligatoria','2026-11-26 23:59-05','Toda la comunidad universitaria',0,true,'publicado'),
 ('Jornada de Reforestación en el Parque Metropolitano','Sembremos juntos 500 plantones nativos. Incluye transporte desde el campus, refrigerio y certificado de horas.','Ropa cómoda, gorra y botella de agua.','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000001','2026-11-29 07:00-05','2026-11-29 12:00-05','presencial','Parque Natural Metropolitano','https://maps.google.com/?q=Parque+Natural+Metropolitano',null,'/images/events/reforestacion.jpg',60,'obligatoria','2026-11-27 18:00-05','Estudiantes de todas las carreras',5,true,'publicado'),
 ('Hackathon FISC: Soluciones para Panamá','48 horas para crear soluciones tecnológicas a retos sociales. Equipos de 3 a 5 personas, mentores y premios.','Laptop. Equipo de 3 a 5 integrantes.','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','2026-12-11 18:00-05','2026-12-13 18:00-05','presencial','Laboratorios FISC, Edificio 3','https://maps.google.com/?q=Universidad+Tecnologica+de+Panama',null,'/images/events/hackathon.jpg',120,'obligatoria','2026-12-08 23:59-05','Estudiantes FISC y carreras afines',0,true,'publicado'),
 ('Taller de Python para Análisis de Datos','Taller práctico: pandas, visualización y primeros modelos.','Conocimientos básicos de programación.','20000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','2026-12-01 14:00-05','2026-12-01 17:00-05','virtual','Plataforma virtual',null,'https://meet.google.com/','/images/events/taller-python.jpg',40,'obligatoria','2026-11-30 12:00-05','Estudiantes de primer y segundo año',0,false,'publicado'),
 ('Gira al Canal de Panamá: Esclusas de Agua Clara','Visita técnica guiada a las esclusas neopanamax con ingenieros del Canal.','Cédula o carné. Zapatos cerrados.','20000000-0000-0000-0000-000000000009','30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000005','2026-12-05 07:30-05','2026-12-05 15:00-05','presencial','Centro de Visitantes Agua Clara, Colón','https://maps.google.com/?q=Agua+Clara+Visitor+Center',null,'/images/events/gira-canal.jpg',35,'obligatoria','2026-12-01 23:59-05','Estudiantes de Ingeniería Civil',0,false,'publicado'),
 ('Calendario de matrícula del Verano 2027','Consulta las fechas de matrícula, pagos y retiro para el periodo de verano.','','20000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000001',null,'2026-12-14 08:00-05','2026-12-18 16:00-05','virtual','Secretaría General',null,'https://utp.ac.pa','/images/events/anuncio-matricula.jpg',null,'ninguna',null,'Toda la comunidad estudiantil',0,false,'publicado'),
 ('Encendido Navideño UTP','Celebremos juntos el fin de año con música, coro universitario y el encendido del árbol del campus.','','20000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000001','2026-12-09 18:00-05','2026-12-09 21:00-05','presencial','Plaza Central del Campus','https://maps.google.com/?q=Universidad+Tecnologica+de+Panama',null,'/images/events/navidad.jpg',null,'opcional',null,'Toda la comunidad',0,false,'publicado'),
 ('Expo Robótica Panamá 2027','Exhibición de proyectos de robótica de universidades y empresas de la región.','','20000000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000004',null,'2027-01-22 10:00-05','2027-01-22 18:00-05','presencial','Centro de Convenciones Panamá','https://maps.google.com/?q=Panama+Convention+Center',null,'/images/events/robotica.jpg',null,'opcional',null,'Público general',0,false,'publicado'),
 ('Torneo Interfacultades de Fútbol Sala','Inscribe a tu equipo y representa a tu facultad en el torneo de verano.','Equipo de 8 jugadores, carné vigente.','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000002','2027-01-15 16:00-05','2027-01-15 20:00-05','presencial','Gimnasio del Centro Regional de Chiriquí',null,null,'/images/events/futbol-sala.jpg',16,'obligatoria','2027-01-10 23:59-05','Estudiantes de todas las facultades',0,false,'publicado'),
 ('Conferencia: Energías Renovables en Panamá','Panel sobre transición energética, solar y eólica con expertos del sector.','','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000003','2027-02-04 10:00-05','2027-02-04 12:00-05','hibrida','Aula Magna, Centro Regional de Azuero',null,'https://meet.google.com/','/images/events/energias.jpg',150,'obligatoria','2027-02-03 23:59-05','Estudiantes de Ingeniería Eléctrica e Industrial',0,false,'publicado'),
 ('Limpieza de Playa en Veracruz','Jornada de limpieza costera con clasificación de residuos y charla ambiental.','Ropa cómoda, bloqueador solar.','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000007','2027-02-20 07:00-05','2027-02-20 11:00-05','presencial','Playa Veracruz, Arraiján','https://maps.google.com/?q=Playa+Veracruz',null,'/images/events/limpieza-playa.jpg',80,'obligatoria','2027-02-18 23:59-05','Toda la comunidad',4,false,'publicado'),
 ('Semana de la Ingeniería Mecánica','Charlas, exhibición de prototipos y competencia de puentes.','','20000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','2027-03-08 08:00-05','2027-03-12 17:00-05','presencial','Edificio de Ingeniería Mecánica',null,null,'/images/events/semana-ingenieria.jpg',null,'opcional',null,'Estudiantes FIM',0,false,'publicado'),
 ('Charla de Bienvenida al Laboratorio de Innovación','Recorrido y charla sobre los servicios del laboratorio de innovación.','','20000000-0000-0000-0000-000000000010','30000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000001','2026-11-12 10:00-05','2026-11-12 11:30-05','presencial','Laboratorio de Innovación',null,null,'/images/events/laboratorio.jpg',30,'obligatoria',null,'Estudiantes de nuevo ingreso',0,false,'publicado'),
 ('Donación de Sangre UTP','Campaña de donación voluntaria en coordinación con el Hospital Santo Tomás.','Mayor de 18 años, haber desayunado.','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000001','2026-11-05 08:00-05','2026-11-05 14:00-05','presencial','Gimnasio del Campus',null,null,'/images/events/donacion-sangre.jpg',100,'obligatoria',null,'Toda la comunidad',3,false,'publicado');

insert into public.event_sponsors (event_id, nombre, logo_url)
select id, 'Facultad de Ingeniería de Sistemas Computacionales', '/__l5e/assets-v1/53918ef9-c724-435a-ab41-c20fbe0d0137/logo-fisc.png'
from public.events where titulo in ('Congreso de Inteligencia Artificial y Datos','Feria de Empleo UTP 2026');
