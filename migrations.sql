-- MIGRATIONS SALON PANEL

-- Tabela de tenants (salões)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    nome_salao TEXT NOT NULL,
    whatsapp TEXT,
    endereco TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de profissionais
CREATE TABLE IF NOT EXISTS professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de serviços
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    duracao_minutos INTEGER NOT NULL,
    categoria TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    data_nascimento DATE,
    tag TEXT DEFAULT 'novo',
    observacoes TEXT,
    total_agendamentos INTEGER DEFAULT 0,
    total_cancelamentos INTEGER DEFAULT 0,
    total_gasto DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id),
    service_id UUID REFERENCES services(id),
    customer_id UUID REFERENCES customers(id),
    cliente_nome TEXT,
    nome_cliente TEXT,
    whatsapp TEXT,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME,
    status TEXT DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Tabela de disponibilidade de profissionais
CREATE TABLE IF NOT EXISTS professional_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    dia_semana INTEGER NOT NULL, -- 0 = Segunda, 1 = Terça, ..., 6 = Domingo
    turno INTEGER NOT NULL, -- 1 ou 2 (turno da manhã ou tarde)
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(professional_id, dia_semana, turno)
);

ALTER TABLE professional_availability ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir tudo por enquanto)
CREATE POLICY "Permitir tudo em tenants" ON tenants FOR ALL USING (true);
CREATE POLICY "Permitir tudo em professionals" ON professionals FOR ALL USING (true);
CREATE POLICY "Permitir tudo em services" ON services FOR ALL USING (true);
CREATE POLICY "Permitir tudo em customers" ON customers FOR ALL USING (true);
CREATE POLICY "Permitir tudo em appointments" ON appointments FOR ALL USING (true);
CREATE POLICY "Permitir tudo em professional_availability" ON professional_availability FOR ALL USING (true);
