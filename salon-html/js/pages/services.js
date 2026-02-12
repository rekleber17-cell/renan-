class ServicesPage extends Page {
    constructor() {
        super('services')
    }

    getHTML() {
        return `
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Serviços</h1>
                    <p class="text-gray-600">Gerencie os serviços oferecidos</p>
                </div>
                <button onclick="servicesPage.showForm()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium">
                    ➕ Novo Serviço
                </button>
            </div>

            <!-- Modal de Formulário -->
            <div id="formModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b border-gray-200 sticky top-0 bg-white flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900" id="formTitle">Novo Serviço</h3>
                        <button onclick="servicesPage.closeFormModal()" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
                    </div>
                    <div class="p-6">
                        <form id="serviceForm" class="space-y-4">
                            <input type="hidden" id="editId">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Serviço *</label>
                                <input type="text" id="nome" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea id="descricao" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"></textarea>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Duração (minutos) *</label>
                                    <input type="number" id="duracao" required min="15" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                                    <input type="number" id="preco" required min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                                </div>
                            </div>
                            <div class="flex gap-3">
                                <button type="submit" class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Salvar</button>
                                <button type="button" onclick="servicesPage.closeFormModal()" class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Lista de Serviços -->
            <div id="servicesList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="text-center py-12 text-gray-500">Carregando...</div>
            </div>
        `
    }

    async attachListeners() {
        await this.loadServices()
        
        const form = document.getElementById('serviceForm')
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e))
        }
    }

    async loadServices() {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('tenant_id', tenant.id)
            .order('nome', { ascending: true })

        if (error) {
            console.error('Erro:', error)
            return
        }

        const list = document.getElementById('servicesList')
        
        if (data.length === 0) {
            list.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-600 mb-4">Nenhum serviço cadastrado</p>
                    <button onclick="servicesPage.showForm()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                        Cadastrar Primeiro Serviço
                    </button>
                </div>
            `
            return
        }

        list.innerHTML = data.map((service, idx) => {
            window[`service_${idx}`] = service
            return `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="mb-4">
                    <h3 class="font-semibold text-gray-900 text-lg">${service.nome}</h3>
                    ${service.descricao ? `<p class="text-sm text-gray-600 mt-1">${service.descricao}</p>` : ''}
                </div>
                <div class="space-y-2 text-sm text-gray-600 mb-4">
                    <div>⏱️ ${service.duracao} minutos</div>
                    <div class="text-lg font-bold text-red-600">${formatCurrency(service.preco)}</div>
                </div>
                <div class="flex gap-2">
                    <button onclick="servicesPage.showForm(window.service_${idx})" class="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                        ✏️ Editar
                    </button>
                    <button onclick="servicesPage.deleteService('${service.id}')" class="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg">
                        🗑️
                    </button>
                </div>
            </div>
        `
        }).join('')
    }

    showForm(service = null) {
        document.getElementById('formModal').classList.remove('hidden')
        document.getElementById('formTitle').textContent = service ? 'Editar Serviço' : 'Novo Serviço'

        if (service) {
            document.getElementById('editId').value = service.id
            document.getElementById('nome').value = service.nome
            document.getElementById('descricao').value = service.descricao || ''
            document.getElementById('duracao').value = service.duracao
            document.getElementById('preco').value = service.preco
        } else {
            document.getElementById('serviceForm').reset()
            document.getElementById('editId').value = ''
        }
    }

    closeFormModal() {
        document.getElementById('formModal').classList.add('hidden')
        document.getElementById('serviceForm').reset()
    }

    async handleFormSubmit(e) {
        e.preventDefault()
        
        const editId = document.getElementById('editId').value
        const data = {
            nome: document.getElementById('nome').value,
            descricao: document.getElementById('descricao').value || null,
            duracao: parseInt(document.getElementById('duracao').value),
            preco: parseFloat(document.getElementById('preco').value)
        }

        if (editId) {
            const { error } = await supabase
                .from('services')
                .update(data)
                .eq('id', editId)

            if (error) {
                alert('Erro ao atualizar: ' + error.message)
                return
            }
            alert('Serviço atualizado!')
        } else {
            data.tenant_id = tenant.id
            
            const { error } = await supabase
                .from('services')
                .insert(data)

            if (error) {
                alert('Erro ao cadastrar: ' + error.message)
                return
            }
            alert('Serviço cadastrado com sucesso!')
        }

        this.closeFormModal()
        await this.loadServices()
    }

    async deleteService(id) {
        if (!confirm('Tem certeza que deseja excluir?')) return

        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id)

        if (error) {
            alert('Erro: ' + error.message)
            return
        }
        await this.loadServices()
    }
}

const servicesPage = new ServicesPage()
