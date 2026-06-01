# Deploy — Railway (API + Postgres) + Vercel (front)

> **Sem plano no Railway?** Use [DEPLOY-RENDER-VERCEL.md](./DEPLOY-RENDER-VERCEL.md) (Render Free + Vercel).

Ordem recomendada: **Postgres → Backend → Front → CORS**.

---

## 1. PostgreSQL no Railway

1. Acesse [railway.app](https://railway.app) e crie um projeto.
2. **New → Database → PostgreSQL**.
3. Anote o serviço (ex.: `Postgres`). As variáveis `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` serão usadas pelo backend.

---

## 2. Backend no Railway

1. No mesmo projeto: **New → GitHub Repo** → selecione `Ricette`.
2. Abra o serviço criado → **Settings**:
   - **Root Directory:** `backend`
   - **Builder:** Dockerfile (usa `backend/Dockerfile` + `railway.toml`)
3. **Variables** (além das `PG*` do Postgres, use **Add Reference** para ligar o banco ao serviço):

| Variável | Valor |
|----------|--------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `APP_ADMIN_EMAIL` | e-mail do login do painel |
| `APP_ADMIN_PASSWORD` | senha forte |
| `APP_JWT_SECRET` | segredo ≥ 32 caracteres (`openssl rand -base64 32`) |
| `APP_JWT_EXPIRATION_MS` | `86400000` |
| `APP_CORS_ALLOWED_ORIGINS` | *(preencher depois do passo 4)* URL da Vercel |

4. **Settings → Networking → Generate Domain** (ex.: `ricette-api-production.up.railway.app`).
5. Aguarde o deploy. Teste: `https://SEU-DOMINIO.up.railway.app/api/health` → `{"status":"UP"}`.

### Login de teste

`POST https://SEU-DOMINIO/api/auth/login`  
Body JSON: `{"email":"...","password":"..."}` (valores de `APP_ADMIN_*`).

---

## 3. Frontend na Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → importe o repo `Ricette`.
2. **Configure Project:**
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. **Environment Variables** (Production):

| Nome | Valor |
|------|--------|
| `VITE_USE_API` | `true` |
| `VITE_API_URL` | `https://SEU-DOMINIO.up.railway.app` *(sem `/api` no final)* |

4. **Deploy**.
5. Copie a URL do site (ex.: `https://ricette.vercel.app`).

---

## 4. Ajustar CORS no Railway

Volte ao serviço **backend** no Railway → **Variables**:

```
APP_CORS_ALLOWED_ORIGINS=https://ricette.vercel.app
```

Use a URL exata da Vercel (com `https`, sem barra final). Se tiver preview deployments, pode listar várias separadas por vírgula.

**Redeploy** o backend após salvar.

---

## 5. Checklist final

- [ ] `GET /api/health` no Railway → UP
- [ ] Login no front com `APP_ADMIN_EMAIL` / `APP_ADMIN_PASSWORD`
- [ ] Criar receita e categoria
- [ ] Sem erro de CORS no console do navegador (F12)

---

## Comandos úteis (local)

```powershell
# Subir só o Postgres local
docker compose up -d

# Backend local com .env
cd backend
.\mvnw.cmd spring-boot:run

# Front local
cd frontend
npm run dev
```

---

## Problemas comuns

| Sintoma | Solução |
|---------|---------|
| CORS bloqueado | `APP_CORS_ALLOWED_ORIGINS` = URL exata da Vercel |
| 401 em tudo | Token expirado; faça login de novo |
| API não responde no front | `VITE_API_URL` = domínio Railway **sem** `/api` |
| Build Vercel falha | Root = `frontend`, Node 20+ |
| Railway não acha JAR | Root Directory = `backend`, Dockerfile na pasta |

---

## Segurança (produção)

- Troque `APP_ADMIN_PASSWORD` e `APP_JWT_SECRET` — não reuse os do `.env` local.
- Não commite `.env` com segredos reais.
- Depois, considere `spring.jpa.hibernate.ddl-auto=validate` quando tiver migrations.
