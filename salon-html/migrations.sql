-- SQL para criar as tabelas faltantes no Supabase

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
