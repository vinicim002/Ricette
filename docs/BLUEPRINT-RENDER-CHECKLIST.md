# Checklist — Blueprint Render + Vercel

Use antes de clicar **Apply** no Render.

## 1. Git

- [ ] Todo o código novo está no GitHub (`render.yaml` na **raiz** do repo)
- [ ] Se já existia projeto Render quebrado, apague os serviços antigos ou use um **projeto novo** no Render

## 2. Blueprint — secrets (o assistente vai pedir)

| Variável | O que colocar |
|----------|----------------|
| `APP_ADMIN_EMAIL` | E-mail para login no Ricette |
| `APP_ADMIN_PASSWORD` | Senha forte |
| `APP_JWT_SECRET` | Aleatório, **mínimo 32 caracteres** |
| `APP_CORS_ALLOWED_ORIGINS` | URL da Vercel depois; por agora pode usar `https://ricette.vercel.app` e alterar depois |

Gerar JWT (PowerShell):

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

## 3. O Blueprint cria sozinho

- [ ] Postgres `ricette-db` (free)
- [ ] Web `ricette-api` (Docker, pasta `backend`)
- [ ] `DATABASE_URL` + `DATABASE_HOST` etc. (automático)
- [ ] `SPRING_PROFILES_ACTIVE=prod` (automático)

## 4. Depois do Apply (Render)

- [ ] Deploy **Live** (verde)
- [ ] `https://SUA-URL.onrender.com/api/health` → `{"status":"UP"}`
- [ ] Logs sem `Failed to determine suitable jdbc url` nem `${PGHOST}`
- [ ] Render → `ricette-api` → **Environment**: existe `DATABASE_URL` (ou `DATABASE_HOST` + `DATABASE_PASSWORD`)

## 5. Vercel

| Variável | Valor |
|----------|--------|
| Root | `frontend` |
| `VITE_USE_API` | `true` |
| `VITE_API_URL` | `https://SUA-URL.onrender.com` (sem `/api`) |

## 6. Ajuste final

- [ ] Render → `APP_CORS_ALLOWED_ORIGINS` = URL exata da Vercel
- [ ] Redeploy backend se mudou CORS
- [ ] Login no site funciona

Guia completo: [DEPLOY-RENDER-VERCEL.md](./DEPLOY-RENDER-VERCEL.md)
