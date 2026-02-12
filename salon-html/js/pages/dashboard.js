class DashboardPage extends Page {
    constructor() {
        super('dashboard')
    }

    getHTML() {
        return `
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p class="text-gray-600">Bem-vindo ao seu painel de controle</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm mb-1">Profissionais Ativos</p>
                            <p class="text-3xl font-bold text-gray-900" id="activeProfessionals">-</p>
                        </div>
                        <div class="text-5xl">👥</div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm mb-1">Serviços Disponíveis</p>
                            <p class="text-3xl font-bold text-gray-900" id="totalServices">-</p>
                        </div>
                        <div class="text-5xl">✂️</div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm mb-1">Clientes Cadastrados</p>
                            <p class="text-3xl font-bold text-gray-900" id="totalClients">-</p>
                        </div>
                        <div class="text-5xl">👤</div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm mb-1">Agendamentos Hoje</p>
                            <p class="text-3xl font-bold text-gray-900" id="todaySchedules">-</p>
                        </div>
                        <div class="text-5xl">📅</div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Próximos Agendamentos</h2>
                    <div id="upcomingSchedules" class="space-y-3">
                        <p class="text-gray-600 text-center py-4">Carregando...</p>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Atalhos Rápidos</h2>
                    <div class="space-y-2">
                        <a href="#professionais" class="block p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-medium">
                            👥 Gerenciar Profissionais
                        </a>
                        <a href="#services" class="block p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium">
                            ✂️ Gerenciar Serviços
                        </a>
                        <a href="#schedule" class="block p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium">
                            🕐 Configurar Horários
                        </a>
                        <a href="#clients" class="block p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg font-medium">
                            👤 Ver Clientes
                        </a>
                    </div>
                </div>
            </div>
        `
    }

    async attachListeners() {
        await this.loadStats()
    }

    async loadStats() {
        // Carregar profissionais ativos
        const { data: professionals } = await supabase
            .from('professionals')
            .select('id')
            .eq('tenant_id', tenant.id)
            .eq('ativo', true)

        document.getElementById('activeProfessionals').textContent = professionals?.length || 0

        // Carregar serviços
        const { data: services } = await supabase
            .from('services')
            .select('id')
            .eq('tenant_id', tenant.id)

        document.getElementById('totalServices').textContent = services?.length || 0

        // Carregar clientes
        const { data: clients } = await supabase
            .from('customers')
            .select('id')
            .eq('tenant_id', tenant.id)

        document.getElementById('totalClients').textContent = clients?.length || 0
    }
}

const dashboardPage = new DashboardPage()
