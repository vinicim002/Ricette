# Deploy — Render (API + Postgres) + Vercel (front)

Plano gratuito do Render: o serviço **dorme** após ~15 min sem tráfego (primeira requisição pode demorar ~1 min).

---

## Opção A — Blueprint (recomendado)

1. Faça **push** do repositório no GitHub.
2. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Blueprint**.
3. Conecte o repo `Ricette` → Render lê `render.yaml` na raiz.
4. Preencha os secrets solicitados:
   - `APP_ADMIN_EMAIL`
   - `APP_ADMIN_PASSWORD`
   - `APP_JWT_SECRET` (≥ 32 caracteres)
   - `APP_CORS_ALLOWED_ORIGINS` → deixe vazio por agora; preencha após o deploy da Vercel
5. **Apply** e aguarde Postgres + API subirem.
6. Copie a URL da API (ex.: `https://ricette-api.onrender.com`).

---

## Opção B — Manual no painel

### 1. PostgreSQL

1. **New +** → **PostgreSQL** → Name: `ricette-db`, Plan: **Free**.
2. Crie o banco e anote a **Internal Database URL** (opcional; o link injeta `DATABASE_URL`).

### 2. Web Service (backend)

1. **New +** → **Web Service** → mesmo repositório.
2. Configuração:

| Campo | Valor |
|-------|--------|
| **Root Directory** | `backend` |
| **Runtime** | Docker |
| **Dockerfile Path** | `./Dockerfile` |
| **Plan** | Free |

3. **Advanced** → Health Check Path: `/api/health`

4. **Environment Variables**:

| Key | Value |
|-----|--------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `APP_ADMIN_EMAIL` | seu e-mail de login |
| `APP_ADMIN_PASSWORD` | senha forte |
| `APP_JWT_SECRET` | segredo ≥ 32 chars |
| `APP_JWT_EXPIRATION_MS` | `86400000` |
| `APP_CORS_ALLOWED_ORIGINS` | *(depois da Vercel)* |

5. **Obrigatório — vincular o Postgres:** no Web Service → **Environment** → **Add from database** (ou **Connections → Link Database**) → escolha `ricette-db`.  
   Isso injeta `DATABASE_URL` (e `DATABASE_HOST`, etc.). **Sem isso a API cai** com erro `${PGHOST}` na URL.

6. Confirme que existe a variável `DATABASE_URL` (valor começa com `postgres://`).

7. **Create Web Service** → copie a URL pública.

7. Teste: `https://SUA-API.onrender.com/api/health` → `{"status":"UP"}`

Gerar JWT no PowerShell:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

---

## 3. Frontend (Vercel)

1. [vercel.com](https://vercel.com) → importe o repo.
2. **Root Directory:** `frontend`
3. **Environment Variables** (Production):

| Nome | Valor |
|------|--------|
| `VITE_USE_API` | `true` |
| `VITE_API_URL` | `https://ricette-api.onrender.com` *(sua URL Render, **sem** `/api`)* |

4. Deploy → copie a URL (ex.: `https://ricette.vercel.app`).

---

## 4. CORS no Render

No **Web Service** → **Environment**:

```
APP_CORS_ALLOWED_ORIGINS=https://ricette.vercel.app
```

Salve (novo deploy automático).

---

## 5. Checklist

- [ ] `/api/health` responde UP
- [ ] Login no front funciona
- [ ] Sem erro de CORS no console
- [ ] Primeira visita após idle: aguardar cold start do Render Free

---

## Erro `${PGHOST}` na URL do banco

Significa que o **PostgreSQL não está ligado** ao Web Service.

1. Render → seu **Web Service** → **Environment**
2. **Add from database** (ou Link Database) → selecione o Postgres
3. Verifique se aparece `DATABASE_URL` (começa com `postgres://`)
4. **Manual Deploy** / aguarde redeploy

Faça **push** da correção mais recente do repositório (config de banco atualizada).

---

## Render vs Railway

| Item | Render Free |
|------|-------------|
| Postgres | Sim (90 dias free DB — ver termos Render) |
| API sempre ligada | Não — dorme sem uso |
| `DATABASE_URL` | Sim, convertida no código |
| Docker Java 21 | Sim (`backend/Dockerfile`) |

---

## Arquivos do projeto

- `render.yaml` — blueprint na raiz
- `backend/Dockerfile` — imagem da API
- `backend/.env.render.example` — lista de variáveis
- `application-prod.properties` — perfil `prod`

Guia Railway (alternativa): `docs/DEPLOY-RAILWAY-VERCEL.md`
