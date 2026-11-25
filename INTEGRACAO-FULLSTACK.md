# Masyaf Games — P2: APIs RESTful + Banco (Neon/PostgreSQL) + Frontend

**Arquitetura:** Angular (frontend, porta 4200) → HTTP/JSON → Spring Boot (API REST, porta 8080) → JPA/Hibernate → PostgreSQL hospedado no **Neon**.

## 1. Criar o banco no Neon
1. Acesse https://neon.tech e crie uma conta (pode entrar com o GitHub).
2. **Create project** → nome `masyaf-games`, Postgres 17, região **AWS São Paulo (sa-east-1)** (menor latência).
3. No Dashboard do projeto, clique em **Connect**. Copie a connection string; ela tem este formato:
   ```
   postgresql://neondb_owner:SENHA@ep-xxxx.sa-east-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Não é preciso criar tabelas: o Hibernate cria `jogos`, `usuarios`, `pedidos` e `itens_pedido` na primeira execução, e o `data.sql` insere o catálogo.

## 2. Ligar o backend ao Neon
1. Em `backend/`, copie `.env.example` para `.env`.
2. Converta a connection string para JDBC (troque `postgresql://usuario:senha@` por `jdbc:postgresql://`) e separe usuário e senha:
   ```properties
   DB_URL=jdbc:postgresql://ep-xxxx.sa-east-1.aws.neon.tech/neondb?sslmode=require
   DB_USER=neondb_owner
   DB_PASSWORD=SENHA
   ```
3. O `.env` está no `.gitignore`: a senha **não** vai para o repositório. Cada integrante do grupo cria o seu.

> Sem o `.env`, a API usa o PostgreSQL local (`localhost:5432/masyaf_games`, usuário/senha `postgres`).

## 3. Executar
Requisitos: **Java 17+** e **Node 24.15+** (o Angular CLI 22 não aceita versões anteriores). O Maven não precisa estar instalado, porque o projeto traz o wrapper `mvnw`.

```bash
# Terminal 1 — API
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run

# Terminal 2 — Frontend (na raiz)
npm install
npm start                     # abre em http://localhost:4200
```
Na primeira conexão o Neon pode levar alguns segundos para "acordar" (o plano gratuito suspende o banco quando fica ocioso). Antes da apresentação, abra o site uma vez para aquecer o banco.

**Conferir os dados no Neon:** no console, use **Tables** para navegar pelas tabelas ou **SQL Editor** para consultas, por exemplo:
```sql
SELECT * FROM usuarios;
SELECT p.id, p.data, p.total, u.nome FROM pedidos p JOIN usuarios u ON u.id = p.usuario_id;
SELECT * FROM itens_pedido;
```

## 4. Endpoints RESTful

| Recurso | Método | Rota | Uso no frontend |
|---|---|---|---|
| Jogos | GET | `/api/jogos` | Vitrine |
| Jogos | GET | `/api/jogos?nome=` | Busca (cabeçalho) |
| Jogos | GET | `/api/jogos?plataforma=` | Menu de categorias |
| Jogos | GET | `/api/jogos/{id}` | Página de detalhe |
| Jogos | POST | `/api/jogos` | Admin → Cadastrar |
| Jogos | PUT | `/api/jogos/{id}` | Admin → Editar |
| Jogos | DELETE | `/api/jogos/{id}` | Admin → Excluir |
| Usuários | POST | `/api/usuarios/cadastro` | Cadastro |
| Usuários | POST | `/api/auth/login` | Login |
| Usuários | GET | `/api/usuarios/{id}` | — |
| Pedidos | POST | `/api/pedidos` | Cesta → Finalizar |
| Pedidos | GET | `/api/pedidos/usuario/{id}` | Meus pedidos |
| Pedidos | GET | `/api/pedidos/{id}` | — |
| Pedidos | DELETE | `/api/pedidos/{id}` | Meus pedidos → Cancelar |

Códigos HTTP usados: `200` OK, `201` Created, `204` No Content, `400` dados inválidos, `401` login inválido, `404` não encontrado, `409` conflito (e-mail/CPF duplicado, ou jogo que já aparece em pedidos).

## 5. Como os dados percorrem a aplicação
- Os componentes Angular chamam o `ApiService` (`src/app/core/api.ts`), que usa o `HttpClient`.
- O `AuthService` (`src/app/core/auth.ts`) guarda o usuário logado; o cabeçalho mostra o nome, "Meus pedidos" e "Sair".
- Os controllers (`backend/.../controller`) recebem a requisição, validam com Bean Validation e chamam os repositories (Spring Data JPA).
- Os repositories geram o SQL, executado no PostgreSQL do Neon.
- No pedido, o Angular envia apenas IDs e quantidades. O backend busca os preços atuais no banco e calcula o total no servidor.
- As senhas são gravadas com hash **BCrypt**.

## 6. Roteiro sugerido para a apresentação
1. Mostrar o projeto no console do Neon (tabelas vazias de pedidos e usuários).
2. Cadastrar um usuário → mostrar a linha em `usuarios`, com a senha em hash.
3. Fazer login, adicionar jogos à cesta, alterar quantidades e finalizar → mostrar `pedidos` e `itens_pedido` no Neon.
4. Abrir "Meus pedidos" (GET) e cancelar um pedido (DELETE).
5. Na tela Admin, cadastrar, editar e excluir um jogo e mostrar a mudança na vitrine e no banco.

## Limitações conhecidas (ambiente didático)
O login não emite JWT, e as rotas de admin e de pedidos não exigem autenticação. Para publicar, seria preciso adicionar Spring Security + JWT e um perfil de administrador. A recuperação de senha é só demonstrativa.
