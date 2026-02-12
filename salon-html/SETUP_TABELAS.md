# 🚨 Setup do Banco de Dados - Tabelas Faltantes

## Problema
As páginas de **Agenda** e **Clientes** não estão funcionando porque as tabelas correspondentes (`schedules` e `clients`) ainda não foram criadas no Supabase.

## Solução

### 1️⃣ Acesse o Supabase Console
- Acesse: https://app.supabase.com
- Faça login com suas credenciais
- Selecione seu projeto

### 2️⃣ Execute o SQL

Na aba **SQL Editor**, crie uma nova query e copie o código abaixo:

```sql
-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    whatsapp TEXT,
    data_nascimento DATE,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    data_hora TIMESTAMP NOT NULL,
    status TEXT DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS clients_tenant_id_idx ON clients(tenant_id);
CREATE INDEX IF NOT EXISTS schedules_tenant_id_idx ON schedules(tenant_id);
CREATE INDEX IF NOT EXISTS schedules_professional_id_idx ON schedules(professional_id);
CREATE INDEX IF NOT EXISTS schedules_client_id_idx ON schedules(client_id);
CREATE INDEX IF NOT EXISTS schedules_service_id_idx ON schedules(service_id);
CREATE INDEX IF NOT EXISTS schedules_data_hora_idx ON schedules(data_hora);

-- Habilitar RLS para segurança
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Politicas de RLS para clientes
CREATE POLICY "Clientes visíveis para o tenant" ON clients
    FOR SELECT USING (tenant_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM tenants WHERE id = tenant_id AND user_id = auth.uid()
    ));

CREATE POLICY "Inserir clientes próprios" ON clients
    FOR INSERT WITH CHECK (tenant_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM tenants WHERE id = tenant_id AND user_id = auth.uid()
    ));

CREATE POLICY "Atualizar clientes próprios" ON clients
    FOR UPDATE USING (tenant_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM tenants WHERE id = tenant_id AND user_id = auth.uid()
    ));

CREATE POLICY "Deletar clientes próprios" ON clients
    FOR DELETE USING (tenant_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM tenants WHERE id = tenant_id AND user_id = auth.uid()
    ));

-- Politicas de RLS para agendamentos
CREATE POLICY "Agendamentos visíveis para o tenant" ON schedules
    FOR SELECT USING (tenant_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM tenants WHERE id = tenant_id AND user_id = auth.uid()
    ));

CREATE POLICY "Inserir agendamentos próprios" ON schedules
    FOR INSERT WITH CHECK (tenant_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM tenants WHERE id = tenant_id AND user_id = auth.uid()
    ));

CREATE POLICY "Atualizar agendamentos próprios" ON schedules
    FOR UPDATE USING (tenant_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM tenants WHERE id = tenant_id AND user_id = auth.uid()
    ));

CREATE POLICY "Deletar agendamentos próprios" ON schedules
    FOR DELETE USING (tenant_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM tenants WHERE id = tenant_id AND user_id = auth.uid()
    ));
```

### 3️⃣ Execute a Query
- Clique em **Run** (ou Ctrl+Enter)
- Aguarde a confirmação de sucesso

### 4️⃣ Verifique no Supabase Console
- Vá para **Table Editor**
- Você deve ver as novas tabelas: `clients` e `schedules`

### 5️⃣ Teste a Aplicação
- Recarregue a página (F5)
- Clique em **Agenda** - deve mostrar "Nenhum agendamento próximo"
- Clique em **Clientes** - deve mostrar um botão para "Cadastrar Primeiro Cliente"

## Campos das Tabelas

### `clients` (Clientes)
- `id` - UUID único
- `tenant_id` - ID do salão (referência)
- `nome` - Nome do cliente (obrigatório)
- `email` - Email
- `telefone` - Telefone
- `whatsapp` - WhatsApp
- `data_nascimento` - Data de nascimento
- `observacoes` - Observações
- `created_at`, `updated_at` - Timestamps

### `schedules` (Agendamentos)
- `id` - UUID único
- `tenant_id` - ID do salão (referência)
- `professional_id` - ID do profissional (referência)
- `client_id` - ID do cliente (referência)
- `service_id` - ID do serviço (referência)
- `data_hora` - Data e hora do agendamento
- `status` - Status (pendente/confirmado/cancelado)
- `observacoes` - Observações
- `created_at`, `updated_at` - Timestamps

## Suporte

Se receber algum erro:
1. Verifique se você está logado no Supabase
2. Verifique se as tabelas `tenants`, `professionals`, `services` existem
3. Copie a mensagem de erro e tente novamente
4. Se persistir, verifique as permissões do seu projeto no Supabase

---

**Após executar esses passos, Agenda e Clientes funcionarão perfeitamente!** ✅
