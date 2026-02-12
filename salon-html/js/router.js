// Sistema de roteamento SPA
class Router {
    constructor() {
        this.routes = {}
        this.currentPage = null
    }

    register(path, component) {
        this.routes[path] = component
    }

    async navigate(path) {
        console.log(`Navegando para: ${path}`)
        
        if (!this.routes[path]) {
            console.error(`Rota não encontrada: ${path}`)
            console.log('Rotas disponíveis:', Object.keys(this.routes))
            return
        }

        this.currentPage = path
        const component = this.routes[path]
        
        console.log(`Renderizando página: ${component.name}`)
        
        // Atualizar URL sem recarregar
        window.history.pushState({ path }, '', `#${path}`)
        
        // Renderizar a página
        try {
            await component.render()
            console.log(`Página renderizada com sucesso: ${component.name}`)
        } catch (error) {
            console.error(`Erro ao renderizar página: ${component.name}`, error)
        }
        
        // Atualizar navegação ativa
        updateActiveNavigation(path)
    }

    async init() {
        // Verificar hash na URL
        const path = window.location.hash.substring(1) || 'dashboard'
        await this.navigate(path)

        // Listener para voltar/avançar
        window.addEventListener('hashchange', () => {
            const newPath = window.location.hash.substring(1) || 'dashboard'
            this.navigate(newPath)
        })
    }
}

const router = new Router()

function updateActiveNavigation(currentPath) {
    const navItems = document.querySelectorAll('#navigation a')
    navItems.forEach(item => {
        const href = item.getAttribute('href').substring(1)
        item.classList.remove('bg-red-50', 'text-red-700', 'font-medium')
        if (href === currentPath) {
            item.classList.add('bg-red-50', 'text-red-700', 'font-medium')
        } else {
            item.classList.add('text-gray-700', 'hover:bg-gray-50')
        }
    })
}

// Componente base
class Page {
    constructor(name) {
        this.name = name
    }

    async render() {
        const content = document.getElementById('content')
        content.innerHTML = this.getHTML()
        this.attachListeners()
    }

    getHTML() {
        return ''
    }

    attachListeners() {
        // Override em subclasses
    }
}
