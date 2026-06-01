# Checklist pré-deploy — Ricette

## Automatizado (CI)

Execute localmente antes do deploy:

```powershell
cd backend
.\mvnw.cmd test

cd ..\frontend
npm ci
npm test
npm run build
```

O workflow `.github/workflows/ci.yml` roda os mesmos passos no GitHub.

### Cobertura automatizada

| Suite | Testes | Escopo |
|-------|--------|--------|
| Backend (`mvn test`) | 18 | Auth JWT, CRUD receitas, árvore de categorias |
| Frontend (`npm test`) | 11 | JWT, validação de formulário, utilitários de categoria |

**Última execução local:** backend 18/18 OK, frontend 11/11 OK, `npm run build` OK.

## Smoke manual (staging)

- [ ] Login com credenciais de produção
- [ ] Logout e acesso sem token → redirecionamento/login
- [ ] Criar / editar / excluir receita
- [ ] Criar categoria, subcategoria, mover pai, reordenar irmãos
- [ ] Excluir categoria com filhos → erro esperado
- [ ] Dashboard e cards no mobile (editar/excluir visíveis)
- [ ] URL inválida → página 404
- [ ] `VITE_USE_API=true` e `VITE_API_URL` corretos no build

## Produção

- [ ] `APP_JWT_SECRET` ≥ 32 caracteres (aleatório)
- [ ] `APP_CORS_ALLOWED_ORIGINS` = URL exata do front
- [ ] PostgreSQL com backup
- [ ] HTTPS no proxy
- [ ] Senhas fortes (admin, banco) — não usar defaults do `docker-compose`
