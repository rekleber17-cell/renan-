function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth > 768) {
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            mainContent.style.marginLeft = '70px';
        } else {
            mainContent.style.marginLeft = '260px';
        }
    } else {
        sidebar.classList.toggle('active');
    }
}

const App = {
    currentPage: 'dashboard',

    init() {
        const user = Auth.checkAuth();
        if (user) {
            document.getElementById('user-name').textContent = user.nome_salao || 'Usuário';
            this.attachNavigationEvents();
            this.updateDateTime();
            setInterval(() => this.updateDateTime(), 60000);
            this.navigateTo('dashboard');
        }
    },

    attachNavigationEvents() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });
    },

    navigateTo(page) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });

        const titles = {
            'dashboard': 'Dashboard',
            'agenda': 'Agenda',
            'profissionais': 'Profissionais',
            'servicos': 'Serviços',
            'clientes': 'Clientes',
            'configuracoes': 'Configurações'
        };
        document.getElementById('page-title').textContent = titles[page] || page;

        this.currentPage = page;
        this.loadPage(page);
    },

    async loadPage(page) {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = '<div style="text-align:center;padding:3rem;"><div class="spinner"></div><p>Carregando...</p></div>';

        try {
            switch(page) {
                case 'dashboard':
                    if (typeof DashboardPage !== 'undefined') {
                        await DashboardPage.render();
                    }
                    break;
                case 'agenda':
                    if (typeof AgendaPage !== 'undefined') {
                        await AgendaPage.render();
                    }
                    break;
                case 'profissionais':
                    if (typeof ProfissionaisPage !== 'undefined') {
                        await ProfissionaisPage.render();
                    }
                    break;
                case 'servicos':
                    if (typeof ServicosPage !== 'undefined') {
                        await ServicosPage.render();
                    }
                    break;
                case 'clientes':
                    if (typeof ClientesPage !== 'undefined') {
                        await ClientesPage.render();
                    }
                    break;
                case 'configuracoes':
                    if (typeof ConfiguracoesPage !== 'undefined') {
                        await ConfiguracoesPage.render();
                    }
                    break;
            }
        } catch (error) {
            console.error('Erro ao carregar página:', error);
            contentArea.innerHTML = `<div style="text-align:center;padding:3rem;"><p style="color:red;">Erro: ${error.message}</p></div>`;
        }
    },

    updateDateTime() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = `${dateStr} - ${timeStr}`;
        }
    },

    async refreshCurrentPage() {
        await this.loadPage(this.currentPage);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
