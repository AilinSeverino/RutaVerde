alter table public."Usuarios"
  add column if not exists codigo_recuperacion text,
  add column if not exists expiracion_recuperacion timestamptz;