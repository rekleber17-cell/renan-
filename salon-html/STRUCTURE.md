# Salon Panel - SPA (Single Page Application)

## 📋 Nova Estrutura

A aplicação foi refatorada para um **SPA (Single Page Application)** com um único arquivo HTML principal (`app.html`) e toda a navegação/conteúdo gerado via JavaScript.

### Benefícios:
✅ **Facilidade de Edição** - Todo o conteúdo está em JavaScript estruturado  
✅ **Design Consistente** - Um único layout base para todas as páginas  
✅ **Navegação Rápida** - Sem recarregar a página (transição suave)  
✅ **Manutenção Simplificada** - Centralize componentes e estilos  

## 📁 Estrutura de Arquivos

```
salon-html/
├── index.html              # Página de login
├── app.html                # Aplicação principal (SPA)
├── js/
│   ├── config.js           # Configurações do Supabase
│   ├── router.js           # Sistema de roteamento
│   ├── app.js              # Inicialização da aplicação
│   └── pages/
│       ├── dashboard.js    # Dashboard
│       ├── professionais.js # Gerenciar profissionais
│       ├── services.js     # Gerenciar serviços
│       ├── schedule.js     # Agenda
│       ├── clients.js      # Clientes
│       └── settings.js     # Configurações
└── README.md               # Este arquivo
```

## 🚀 Como Funciona

### 1. **Fluxo de Login**
- Usuário acessa `index.html` (página de login)
- Após login bem-sucedido, redireciona para `app.html`

### 2. **Inicialização da App**
- `app.html` carrega todos os scripts JS
- `app.js` inicializa a aplicação e verifica autenticação
- Registra todas as rotas/páginas
- Renderiza a navegação sidebar

### 3. **Sistema de Roteamento**
- URLs com hash: `app.html#professionais`, `app.html#dashboard`, etc.
- Router intercepta mudanças de hash
- Renderiza a página correspondente sem recarregar

### 4. **Estrutura de Página**
Cada página é uma classe que herda de `Page`:

```javascript
class MinhaPage extends Page {
    constructor() {
        super('minha-pagina')
    }

    getHTML() {
        // Retorna o HTML da página
        return `<div>...</div>`
    }

    attachListeners() {
        // Adiciona event listeners após renderizar
    }
}

const minhaPage = new MinhaPage()
```

## 🎯 Arquivos Principais

### `config.js`
- Configurações do Supabase
- Funções auxiliares (checkAuth, getTenant, logout, etc.)
- Variáveis globais (tenant, currentSession)

### `router.js`
- Classe `Router` para gerenciar rotas
- Classe `Page` base para todas as páginas
- Sistema de navegação com hash

### `app.js`
- Classe `SalonApp` que inicializa a aplicação
- Registra todas as rotas
- Renderiza a navegação

### `pages/*.js`
- Cada arquivo contém uma página/componente
- Herdam de `Page`
- Implementam `getHTML()` e `attachListeners()`

## 📝 Como Adicionar Nova Página

1. **Criar novo arquivo** em `js/pages/nova-pagina.js`:

```javascript
class NovaPage extends Page {
    constructor() {
        super('nova-pagina')
    }

    getHTML() {
        return `
            <h1>Minha Nova Página</h1>
            <p>Conteúdo aqui...</p>
        `
    }

    attachListeners() {
        // Listeners aqui
    }
}

const novaPage = new NovaPage()
```

2. **Registrar no router** em `app.js`:

```javascript
router.register('nova-pagina', novaPage)
```

3. **Adicionar à navegação** em `app.js` (na função `renderNavigation`):

```javascript
<a href="#nova-pagina" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
    🆕 Nova Página
</a>
```

## 🎨 Modificar Design

Todos os estilos usam **Tailwind CSS**, então você pode:

1. **Modificar classes Tailwind** nos arquivos JS
2. **Editar cor do tema** - Procure por `red-600` (cor principal) e substitua
3. **Adaptar componentes** - Modifique o `getHTML()` das páginas

## 🔧 Acesso a Dados Globais

Em qualquer arquivo JS, você tem acesso a:

```javascript
- tenant          // Dados do salão
- currentSession  // Sessão do usuário
- supabase        // Cliente Supabase
- router          // Sistema de roteamento
- app            // Instância da aplicação
```

## ⚙️ Funções Úteis

```javascript
// Autenticação
await checkAuth()          // Verifica se está logado
await getTenant(userId)    // Obtém dados do salão
logout()                   // Faz logout

// Formatação
formatCurrency(valor)      // Formata moeda BRL
formatPhone(telefone)      // Formata telefone para (XX) XXXXX-XXXX

// Navegação
await router.navigate('professionais')  // Navegar para página
app.currentPage                         // Página atual renderizada
```

## 📱 Responsive

A aplicação é totalmente responsiva usando **Grid Tailwind**:
- Desktop: Sidebar + Conteúdo
- Mobile: Menu colapsável (pode ser implementado)

## 🚨 Checklist de Migração

Se você tinha páginas HTML separadas:

- [x] Criar arquivo `app.html` como SPA principal
- [x] Mover lógica das páginas para arquivos JS em `pages/`
- [x] Implementar sistema de roteamento
- [x] Atualizar links de login para `app.html`
- [x] Testar navegação entre páginas
- [ ] Remover arquivos HTML antigos (opcional)

---

**Desenvolvido com ❤️ usando Supabase + Tailwind CSS**
