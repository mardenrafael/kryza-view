# Sistema de Branding para Tenants (White Label)

Este sistema permite que cada tenant configure o branding e personalização do seu próprio sistema no ambiente multitenancy.

## Funcionalidades Implementadas

### 1. Estrutura do Banco de Dados

Foi criada uma nova tabela `TenantBranding` no schema do Prisma com os seguintes campos:

- **Cores**: `primaryColor`, `secondaryColor`, `accentColor`
- **Logos**: `logoUrl`, `faviconUrl`
- **Informações da Empresa**: `companyName`, `companySlogan`, `contactEmail`, `contactPhone`, `address`
- **Redes Sociais**: `socialMedia` (JSON)
- **CSS Personalizado**: `customCss`

### 2. APIs Criadas

#### `/api/tenant/branding`
- **GET**: Busca configuração de branding do tenant atual
- **POST**: Cria nova configuração de branding
- **PUT**: Atualiza configuração de branding existente

#### `/api/tenant/first-access`
- **PUT**: Marca o primeiro acesso como concluído

### 3. Interface de Usuário

#### Página de Configuração (`/admin/config`)
- Formulário completo para configuração de branding
- Seletor de cores com paleta predefinida
- Campos para informações da empresa
- Configuração de redes sociais
- Editor de CSS personalizado
- **Primeiro Acesso**: Redirecionamento automático para configuração inicial

### 4. Componentes Criados

#### `ColorPicker`
- Seletor de cores com input de cor e paleta predefinida
- Suporte a cores personalizadas via input hexadecimal

#### `Badge`
- Componente para exibir status e indicadores visuais

## Arquitetura do Projeto

### Padrão de Services
- **Services**: Contêm apenas consultas no banco de dados (server-side)
- **APIs**: Usam services para operações no banco
- **Páginas**: Usam o objeto `api` do `@/lib/api` para chamadas de API

### Estrutura de Arquivos

```
src/
├── app/
│   ├── (admin)/
│   │   ├── admin/
│   │   │   └── config/
│   │   │       └── page.tsx          # Formulário de branding (usa api)
│   │   └── layout.tsx                # Layout com lógica de primeiro acesso
│   └── api/
│       └── tenant/
│           ├── branding/
│           │   └── route.ts          # API para branding (usa service)
│           └── first-access/
│               └── route.ts          # API para primeiro acesso (usa service)
├── components/
│   └── ui/
│       ├── badge.tsx                 # Componente Badge
│       └── color-picker.tsx          # Seletor de cores
├── lib/
│   └── api.ts                        # Objeto axios para chamadas de API
└── service/
    └── tenant-admin-service.ts       # Services para consultas no banco
```

## Como Funciona

### 1. Primeiro Acesso
1. Quando um usuário acessa o sistema pela primeira vez, o sistema verifica se é primeiro acesso
2. Se for primeiro acesso, o usuário é automaticamente redirecionado para `/admin/config`
3. O usuário deve configurar pelo menos o nome da empresa e as cores
4. Após salvar, o primeiro acesso é marcado como concluído e o usuário é redirecionado para o dashboard

### 2. Configuração de Branding
1. Acesse `/admin/config` no menu administrativo
2. Preencha as informações da empresa
3. Configure as cores principais (baseadas no globals.css padrão)
4. Adicione URLs dos logos
5. Configure redes sociais
6. Adicione CSS personalizado se necessário
7. Clique em "Salvar Configuração"

### 3. Cores Padrão do Sistema
O sistema utiliza as seguintes cores padrão baseadas no `globals.css`:
- **Primária**: `#d7263d` (Vermelho)
- **Secundária**: `#f9fafb` (Cinza claro)
- **Destaque**: `#1f2937` (Cinza escuro)

## Fluxo de Primeiro Acesso

1. **Login**: Usuário faz login no sistema
2. **Verificação**: Sistema verifica se é primeiro acesso (`firstAccess = 1`)
3. **Redirecionamento**: Se for primeiro acesso, redireciona para `/admin/config`
4. **Configuração**: Usuário configura branding obrigatório
5. **Salvamento**: Sistema salva configuração e marca primeiro acesso como concluído
6. **Dashboard**: Usuário é redirecionado para o dashboard principal

## Padrão de Desenvolvimento

### Services (Server-side)
```typescript
// src/service/tenant-admin-service.ts
import PrismaInstance from "@/lib/prisma";

async function getTenantBranding(tenantId: string) {
  return await PrismaInstance.tenantBranding.findUnique({
    where: { tenantId },
  });
}
```

### APIs (Server-side)
```typescript
// src/app/api/tenant/branding/route.ts
import { getTenantBranding } from "@/service/tenant-admin-service";

export async function GET(request: NextRequest) {
  const branding = await getTenantBranding(tenantId);
  return NextResponse.json(branding);
}
```

### Páginas (Client-side)
```typescript
// src/app/(admin)/admin/config/page.tsx
import { api } from "@/lib/api";

const response = await api.get("/api/tenant/branding?tenantId=" + tenantId);
const branding = response.data;
```

## Próximos Passos

1. **Executar Migração**: Quando o banco estiver disponível, execute:
   ```bash
   npx prisma migrate dev --name add_tenant_branding
   ```

2. **Testar Funcionalidades**: 
   - Criar um tenant de teste
   - Fazer primeiro acesso e verificar redirecionamento
   - Configurar branding e verificar salvamento
   - Testar acesso subsequente

3. **Implementar Aplicação de Branding**: 
   - Criar sistema para aplicar as cores configuradas
   - Implementar carregamento dinâmico de logos
   - Aplicar CSS personalizado

4. **Melhorar UX**:
   - Adicionar preview em tempo real das configurações
   - Implementar upload de imagens
   - Adicionar validações de formulário

## Tecnologias Utilizadas

- **Next.js 14** com App Router
- **Prisma** para ORM
- **PostgreSQL** como banco de dados
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **TypeScript** para tipagem
- **NextAuth.js** para autenticação
- **Axios** para chamadas de API

## Considerações de Segurança

- Todas as APIs incluem validação de dados
- Tratamento de erros com mensagens amigáveis
- Relacionamentos seguros entre tenants e branding
- Cascade delete para manter integridade dos dados
- Verificação de autenticação em todas as rotas administrativas 