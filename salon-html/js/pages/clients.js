class ClientsPage extends Page {
    constructor() {
        super('clients')
    }

    getHTML() {
        return `
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Clientes</h1>
                    <p class="text-gray-600">Gerencie sua lista de clientes</p>
                </div>
                <button onclick="clientsPage.showForm()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium">
                    ➕ Novo Cliente
                </button>
            </div>

            <!-- Modal de Formulário -->
            <div id="formModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b border-gray-200 sticky top-0 bg-white flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900" id="formTitle">Novo Cliente</h3>
                        <button onclick="clientsPage.closeFormModal()" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
                    </div>
                    <div class="p-6">
                        <form id="clientForm" class="space-y-4">
                            <input type="hidden" id="editId">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                                    <input type="text" id="nome" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" id="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                                    <input type="tel" id="whatsapp" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                                    <input type="date" id="data_nascimento" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                                </div>
                            </div>
                            <div class="flex gap-3">
                                <button type="submit" class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Salvar</button>
                                <button type="button" onclick="clientsPage.closeFormModal()" class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Lista de Clientes -->
            <div id="clientsList" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Telefone</th>
                            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody" class="divide-y divide-gray-200">
                        <tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">Carregando...</td></tr>
                    </tbody>
                </table>
            </div>
        `
    }

    async attachListeners() {
        await this.loadClients()
        
        const form = document.getElementById('clientForm')
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e))
        }
    }

    async loadClients() {
        const tbody = document.getElementById('tableBody')
        
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('tenant_id', tenant.id)
                .order('nome', { ascending: true })

            if (error) {
                console.error('Erro ao carregar clientes:', error)
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="px-6 py-8 text-center text-red-600">
                            <p class="mb-2">Erro ao carregar clientes: ${error.message}</p>
                            <p class="text-sm text-gray-600">A tabela de clientes pode ainda não ter sido criada no banco de dados.</p>
                        </td>
                    </tr>
                `
                return
            }

            if (!data || data.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="px-6 py-12 text-center">
                            <p class="text-gray-600 mb-4">Nenhum cliente cadastrado</p>
                            <button onclick="clientsPage.showForm()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                                Cadastrar Primeiro Cliente
                            </button>
                        </td>
                    </tr>
                `
                return
            }

            tbody.innerHTML = data.map((client, idx) => {
                window[`client_${idx}`] = client
                return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">${client.nome}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${client.whatsapp ? formatPhone(client.whatsapp) : '-'}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${client.email || '-'}</td>
                <td class="px-6 py-4 text-sm space-x-2">
                    <button onclick="clientsPage.showForm(window.client_${idx})" class="text-red-600 hover:text-red-700 font-medium">✏️ Editar</button>
                    <button onclick="clientsPage.deleteClient('${client.id}')" class="text-red-600 hover:text-red-700 font-medium">🗑️ Deletar</button>
                </td>
            </tr>
        `
            }).join('')
        } catch (err) {
            console.error('Exceção ao carregar clientes:', err)
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-red-600">
                        <p class="mb-2">Erro inesperado: ${err.message}</p>
                        <p class="text-sm text-gray-600">Verifique o console do navegador para mais detalhes.</p>
                    </td>
                </tr>
            `
        }
    }

    showForm(client = null) {
        document.getElementById('formModal').classList.remove('hidden')
        document.getElementById('formTitle').textContent = client ? 'Editar Cliente' : 'Novo Cliente'

        if (client) {
            document.getElementById('editId').value = client.id
            document.getElementById('nome').value = client.nome
            document.getElementById('email').value = client.email || ''
            document.getElementById('whatsapp').value = client.whatsapp || ''
            document.getElementById('data_nascimento').value = client.data_nascimento || ''
        } else {
            document.getElementById('clientForm').reset()
            document.getElementById('editId').value = ''
        }
    }

    closeFormModal() {
        document.getElementById('formModal').classList.add('hidden')
        document.getElementById('clientForm').reset()
    }

    async handleFormSubmit(e) {
        e.preventDefault()
        
        const editId = document.getElementById('editId').value
        const data = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value || null,
            whatsapp: document.getElementById('whatsapp').value || null,
            data_nascimento: document.getElementById('data_nascimento').value || null
        }

        if (editId) {
            const { error } = await supabase
                .from('customers')
                .update(data)
                .eq('id', editId)

            if (error) {
                alert('Erro ao atualizar: ' + error.message)
                return
            }
            alert('Cliente atualizado!')
        } else {
            data.tenant_id = tenant.id
            
            const { error } = await supabase
                .from('customers')
                .insert(data)

            if (error) {
                alert('Erro ao cadastrar: ' + error.message)
                return
            }
            alert('Cliente cadastrado com sucesso!')
        }

        this.closeFormModal()
        await this.loadClients()
    }

    async deleteClient(id) {
        if (!confirm('Tem certeza que deseja excluir?')) return

        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id)

        if (error) {
            alert('Erro: ' + error.message)
            return
        }
        await this.loadClients()
    }
}

const clientsPage = new ClientsPage()
