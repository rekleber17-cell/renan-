// Aplicação Principal
class SalonApp {
    constructor() {
        this.currentPage = null
    }

    async init() {
        console.log('Inicializando Salon App...')
        
        // Verificar autenticação
        const session = await checkAuth()
        if (!session) {
            console.log('Sem sessão, redirecionando para login')
            return
        }

        // Obter dados do tenant
        tenant = await getTenant(session.user.id)
        if (!tenant) {
            alert('Salão não encontrado!')
            logout()
            return
        }

        console.log('Tenant encontrado:', tenant)

        // Registrar rotas
        router.register('dashboard', dashboardPage)
        router.register('professionais', professionalsPage)
        router.register('services', servicesPage)
        router.register('schedule', schedulePage)
        router.register('clients', clientsPage)
        router.register('settings', settingsPage)

        console.log('Rotas registradas')

        // Renderizar navegação
        this.renderNavigation()

        console.log('Navegação renderizada')

        // Inicializar router
        await router.init()
        
        console.log('Router inicializado')
    }

    renderNavigation() {
        const nav = document.getElementById('navigation')
        nav.innerHTML = `
            <a href="#dashboard" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                📊 Dashboard
            </a>
            <a href="#professionais" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                👥 Profissionais
            </a>
            <a href="#services" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                ✂️ Serviços
            </a>
            <a href="#schedule" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                📅 Agenda
            </a>
            <a href="#clients" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                👤 Clientes
            </a>
            <a href="#settings" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                ⚙️ Configurações
            </a>
        `
    }

    async navigate(path) {
        this.currentPage = router.routes[path]
        await router.navigate(path)
    }
}

// Inicializar aplicação
const app = new SalonApp()
window.app = app

// Esperar o DOM estar pronto e inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM carregado, iniciando app')
        app.init()
    })
} else {
    console.log('DOM já está pronto, iniciando app')
    app.init()
}
