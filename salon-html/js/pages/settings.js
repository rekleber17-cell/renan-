class SettingsPage extends Page {
    constructor() {
        super('settings')
    }

    getHTML() {
        return `
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
                <p class="text-gray-600">Gerencie as informações e fotos do seu salão</p>
            </div>

            <!-- Tabs -->
            <div class="flex gap-4 mb-6 border-b border-gray-200">
                <button onclick="settingsPage.selectTab('info')" class="tab-btn active px-4 py-2 text-gray-700 border-b-2 border-red-600 font-semibold">
                    Informações
                </button>
                <button onclick="settingsPage.selectTab('fotos')" class="tab-btn px-4 py-2 text-gray-700 hover:text-gray-900">
                    Fotos
                </button>
                <button onclick="settingsPage.selectTab('cores')" class="tab-btn px-4 py-2 text-gray-700 hover:text-gray-900">
                    Cores
                </button>
            </div>

            <!-- Tab: Informações -->
            <div id="tab-info" class="tab-content">
                <div class="bg-white rounded-lg shadow p-6 max-w-2xl">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Informações do Salão</h2>
                    <form id="infoForm" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nome do Salão *</label>
                                <input type="text" id="nome_salao" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" id="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                <input type="tel" id="telefone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="(11) 9999-9999">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                                <input type="tel" id="whatsapp" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="(11) 9999-9999">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                            <input type="text" id="endereco" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Rua, avenida...">
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Número</label>
                                <input type="text" id="numero" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="123">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                                <input type="text" id="complemento" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Apto 101">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                                <input type="text" id="bairro" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Centro">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                                <input type="text" id="cep" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="12345-678">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                                <input type="text" id="cidade" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="São Paulo">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                <input type="text" id="estado" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="SP" maxlength="2">
                            </div>
                        </div>

                        <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg">
                            Salvar Informações
                        </button>
                    </form>
                    <div id="infoMessage" class="hidden mt-4 p-4 rounded-lg"></div>
                </div>
            </div>

            <!-- Tab: Fotos -->
            <div id="tab-fotos" class="tab-content hidden">
                <!-- Preview de como fica no site -->
                <div class="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Pré-visualização no Site</h3>
                    <div class="bg-gray-200 text-gray-900 p-8 rounded-lg flex items-center gap-6">
                        <div id="logaPreviewSite" class="w-32 h-32 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <span class="text-4xl">💈</span>
                        </div>
                        <div>
                            <h2 id="salaoNamePreview" class="text-3xl font-bold mb-2">Seu Salão</h2>
                            <p id="salaoPhonePreview" class="text-lg mb-1">📞</p>
                            <p id="salaoAddressPreview">📍</p>
                        </div>
                    </div>
                </div>

                <!-- Foto de Perfil -->
                <div class="bg-white rounded-lg shadow p-6 max-w-2xl">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Foto de Perfil do Salão</h3>
                    <p class="text-gray-600 mb-4">Esta foto aparecerá no site de agendamento</p>
                    <div id="logoPreview" class="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        <span class="text-4xl">💈</span>
                    </div>
                    <input type="hidden" id="logoUrl">
                    <div class="flex gap-2">
                        <button onclick="settingsPage.addPhoto()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                            ➕ Adicionar Foto
                        </button>
                        <button id="removePhotoBtn" onclick="settingsPage.removePhoto()" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg hidden">
                            🗑️ Remover Foto
                        </button>
                    </div>
                    <div id="logoMessage" class="hidden mt-4 p-4 rounded-lg"></div>
                </div>
                            Remover
                        </button>
                    </div>
                    <div id="logoMessage" class="hidden mt-4 p-4 rounded-lg"></div>
                </div>
            </div>

            <!-- Tab: Cores -->
            <div id="tab-cores" class="tab-content hidden">
                <div class="bg-white rounded-lg shadow p-6 max-w-2xl">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Paleta de Cores</h2>
                    <form id="coresForm" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
                                <div class="flex gap-2">
                                    <input type="color" id="cor_primaria" class="w-16 h-10 rounded border border-gray-300 cursor-pointer">
                                    <input type="text" id="cor_primaria_text" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg" placeholder="#FF0000" readonly>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
                                <div class="flex gap-2">
                                    <input type="color" id="cor_secundaria" class="w-16 h-10 rounded border border-gray-300 cursor-pointer">
                                    <input type="text" id="cor_secundaria_text" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg" placeholder="#00FF00" readonly>
                                </div>
                            </div>
                        </div>

                        <div class="p-4 bg-gray-100 rounded-lg">
                            <p class="text-sm text-gray-600">Pré-visualização:</p>
                            <div class="flex gap-4 mt-2">
                                <div id="previewPrimaria" class="w-24 h-24 rounded-lg border-2 border-gray-300"></div>
                                <div id="previewSecundaria" class="w-24 h-24 rounded-lg border-2 border-gray-300"></div>
                            </div>
                        </div>

                        <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg">
                            Salvar Cores
                        </button>
                    </form>
                    <div id="coresMessage" class="hidden mt-4 p-4 rounded-lg"></div>
                </div>
            </div>
        `
    }

    selectTab(tab) {
        // Remover ativo de todos os tabs
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'))
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active', 'border-b-2', 'border-red-600', 'font-semibold'))
        
        // Adicionar ativo ao tab selecionado
        document.getElementById(`tab-${tab}`).classList.remove('hidden')
        event.target.classList.add('active', 'border-b-2', 'border-red-600', 'font-semibold')
    }

    async attachListeners() {
        await this.loadSettings()

        // Form de Informações
        document.getElementById('infoForm').addEventListener('submit', (e) => this.handleInfoSubmit(e))

        // Form de Cores
        document.getElementById('coresForm').addEventListener('submit', (e) => this.handleCoresSubmit(e))

        // Color inputs
        document.getElementById('cor_primaria').addEventListener('change', (e) => {
            document.getElementById('cor_primaria_text').value = e.target.value
            document.getElementById('previewPrimaria').style.backgroundColor = e.target.value
        })

        document.getElementById('cor_secundaria').addEventListener('change', (e) => {
            document.getElementById('cor_secundaria_text').value = e.target.value
            document.getElementById('previewSecundaria').style.backgroundColor = e.target.value
        })

        // Fotos
        document.getElementById('logoUrl').addEventListener('change', (e) => {
            if (e.target.value) {
                document.getElementById('logoPreview').innerHTML = `<img src="${e.target.value}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=text-2xl>❌ Imagem inválida</span>'">`
            }
        })

        document.getElementById('capaUrl').addEventListener('change', (e) => {
            if (e.target.value) {
                document.getElementById('capaPreview').innerHTML = `<img src="${e.target.value}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=text-2xl>❌ Imagem inválida</span>'"`
            }
        })
    }

    async loadSettings() {
        try {
            const { data } = await supabase
                .from('tenants')
                .select('*')
                .eq('id', tenant.id)
                .single()

            if (data) {
                document.getElementById('nome_salao').value = data.nome_salao || ''
                document.getElementById('email').value = data.email || ''
                document.getElementById('telefone').value = data.telefone || ''
                document.getElementById('whatsapp').value = data.whatsapp || ''
                document.getElementById('endereco').value = data.endereco || ''
                document.getElementById('numero').value = data.numero || ''
                document.getElementById('complemento').value = data.complemento || ''
                document.getElementById('bairro').value = data.bairro || ''
                document.getElementById('cidade').value = data.cidade || ''
                document.getElementById('estado').value = data.estado || ''
                document.getElementById('cep').value = data.cep || ''
                
                document.getElementById('cor_primaria').value = data.cor_primaria || '#dc2626'
                document.getElementById('cor_primaria_text').value = data.cor_primaria || '#dc2626'
                document.getElementById('previewPrimaria').style.backgroundColor = data.cor_primaria || '#dc2626'

                document.getElementById('cor_secundaria').value = data.cor_secundaria || '#ef4444'
                document.getElementById('cor_secundaria_text').value = data.cor_secundaria || '#ef4444'
                document.getElementById('previewSecundaria').style.backgroundColor = data.cor_secundaria || '#ef4444'

                if (data.logo_url) {
                    document.getElementById('logoPreview').innerHTML = `<img src="${data.logo_url}" class="w-full h-full object-cover">`
                    document.getElementById('logoUrl').value = data.logo_url
                    document.getElementById('logaPreviewSite').innerHTML = `<img src="${data.logo_url}" class="w-full h-full object-cover rounded-lg">`
                    document.getElementById('removePhotoBtn').classList.remove('hidden')
                } else {
                    document.getElementById('removePhotoBtn').classList.add('hidden')
                }

                // Atualizar preview com os dados da empresa
                document.getElementById('salaoNamePreview').textContent = data.nome_salao || 'Seu Salão'
                
                const enderecoParts = []
                if (data.endereco) enderecoParts.push(data.endereco)
                if (data.numero) enderecoParts.push(data.numero)
                if (data.bairro) enderecoParts.push(data.bairro)
                if (data.cidade) enderecoParts.push(data.cidade)
                if (data.estado) enderecoParts.push(data.estado)
                
                const enderecoCompleto = enderecoParts.length > 0 ? enderecoParts.join(', ') : 'Endereço não cadastrado'
                document.getElementById('salaoAddressPreview').textContent = `📍 ${enderecoCompleto}`
                
                const telefoneDisplay = data.whatsapp || data.telefone || '(11) 9954-80388'
                document.getElementById('salaoPhonePreview').textContent = `📞 ${telefoneDisplay}`
            }
        } catch (error) {
            console.error('Erro ao carregar configurações:', error)
        }
    }

    previewLogo(event) {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                document.getElementById('logoPreview').innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`
            }
            reader.readAsDataURL(file)
        }
    }

    previewCapa(event) {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                document.getElementById('capaPreview').innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`
            }
            reader.readAsDataURL(file)
        }
    }

    saveLogo() {
        const url = document.getElementById('logoUrl').value
        if (!url) {
            this.showMessage('logoMessage', 'Cole a URL da imagem', false)
            return
        }

        this.updateLogoUrl(url)
    }

    addPhoto() {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = 'image/*'
        fileInput.onchange = async (e) => {
            const file = e.target.files[0]
            if (!file) return

            try {
                // Fazer upload para o bucket
                const fileName = `${tenant.id}/salao_${Date.now()}.${file.name.split('.').pop()}`
                const { error: uploadError } = await supabase.storage
                    .from('salon-images')
                    .upload(fileName, file)

                if (uploadError) throw uploadError

                // Gerar URL pública
                const { data } = supabase.storage
                    .from('salon-images')
                    .getPublicUrl(fileName)

                // Salvar no banco
                await this.updateLogoUrl(data.publicUrl)
                
                this.showMessage('logoMessage', '✓ Foto adicionada com sucesso!', true)
                setTimeout(() => this.loadSettings(), 1000)
            } catch (error) {
                this.showMessage('logoMessage', `Erro: ${error.message}`, false)
            }
        }
        fileInput.click()
    }

    async removePhoto() {
        if (!confirm('Tem certeza que deseja remover a foto?')) return

        try {
            await supabase
                .from('tenants')
                .update({ logo_url: null })
                .eq('id', tenant.id)

            document.getElementById('logoPreview').innerHTML = '<span class="text-4xl">💈</span>'
            document.getElementById('removePhotoBtn').classList.add('hidden')
            document.getElementById('logoUrl').value = ''
            
            this.showMessage('logoMessage', '✓ Foto removida com sucesso!', true)
        } catch (error) {
            this.showMessage('logoMessage', `Erro: ${error.message}`, false)
        }
    }

    async updateLogoUrl(url) {
        try {
            await supabase
                .from('tenants')
                .update({ logo_url: url })
                .eq('id', tenant.id)

            this.showMessage('logoMessage', '✓ Foto salva com sucesso!', true)
        } catch (error) {
            this.showMessage('logoMessage', `Erro: ${error.message}`, false)
        }
    }

    async handleInfoSubmit(e) {
        e.preventDefault()

        try {
            const data = {
                nome_salao: document.getElementById('nome_salao').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                whatsapp: document.getElementById('whatsapp').value,
                endereco: document.getElementById('endereco').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value,
                cep: document.getElementById('cep').value
            }

            const { error } = await supabase
                .from('tenants')
                .update(data)
                .eq('id', tenant.id)

            if (error) throw error

            this.showMessage('infoMessage', '✓ Informações salvas com sucesso!', true)
        } catch (error) {
            this.showMessage('infoMessage', `Erro: ${error.message}`, false)
        }
    }

    async handleCoresSubmit(e) {
        e.preventDefault()

        try {
            const data = {
                cor_primaria: document.getElementById('cor_primaria').value,
                cor_secundaria: document.getElementById('cor_secundaria').value
            }

            const { error } = await supabase
                .from('tenants')
                .update(data)
                .eq('id', tenant.id)

            if (error) throw error

            this.showMessage('coresMessage', '✓ Cores salvas com sucesso!', true)
        } catch (error) {
            this.showMessage('coresMessage', `Erro: ${error.message}`, false)
        }
    }

    showMessage(elementId, message, isSuccess) {
        const el = document.getElementById(elementId)
        el.textContent = message
        el.classList.remove('hidden')
        el.classList.toggle('bg-green-100', isSuccess)
        el.classList.toggle('text-green-700', isSuccess)
        el.classList.toggle('bg-red-100', !isSuccess)
        el.classList.toggle('text-red-700', !isSuccess)
    }
}

const settingsPage = new SettingsPage()
