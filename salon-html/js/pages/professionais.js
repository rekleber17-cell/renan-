class ProfessionalsPage extends Page {
    constructor() {
        super('professionais')
        this.photoSelectedFile = null
        this.photoCurrentZoom = 100
        this.photoListenersSetup = false
    }

    getHTML() {
        return `
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Profissionais</h1>
                    <p class="text-gray-600">Gerencie sua equipe de profissionais</p>
                </div>
                <button onclick="professionalsPage.showForm()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium">
                    ➕ Novo Profissional
                </button>
            </div>

            <!-- Modal de Formulário -->
            <div id="formModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b border-gray-200 sticky top-0 bg-white flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900" id="formTitle">Novo Profissional</h3>
                        <button onclick="professionalsPage.closeFormModal()" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
                    </div>
                    <div class="p-6">
                        <form id="professionalForm" class="space-y-4">
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
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                    <input type="tel" id="telefone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                                    <input type="tel" id="whatsapp" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Bio / Especialidades</label>
                                <textarea id="bio" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"></textarea>
                            </div>

                            <!-- Foto de Perfil -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">Foto de Perfil</label>
                                <div class="flex items-center gap-6">
                                    <div class="relative">
                                        <div id="profileCircle" class="w-32 h-32 rounded-full border-4 border-gray-300 bg-gray-100 overflow-hidden flex items-center justify-center cursor-pointer hover:border-red-500 transition">
                                            <img id="profilePreview" src="" alt="Preview" class="w-full h-full object-cover hidden">
                                            <div id="profilePlaceholder" class="text-5xl">👤</div>
                                        </div>
                                        <button type="button" id="addPhotoBtn" class="absolute -bottom-2 -right-2 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-2xl shadow-lg transition">+</button>
                                        <button type="button" id="deletePhotoBtn" class="absolute top-2 -right-2 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg hidden transition">✕</button>
                                    </div>
                                    <div id="adjustmentControls" class="hidden space-y-3 flex-1">
                                        <div>
                                            <label class="text-sm text-gray-600 mb-2 block">Ajustar Posição</label>
                                            <input type="range" id="zoomSlider" min="100" max="300" value="100" class="w-full">
                                            <small class="text-gray-500">Zoom: <span id="zoomValue">100</span>%</small>
                                        </div>
                                        <div class="flex gap-2">
                                            <button type="button" id="confirmPhotoBtn" class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">✓ Confirmar</button>
                                            <button type="button" id="cancelPhotoBtn" class="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-sm font-medium">✕ Cancelar</button>
                                        </div>
                                    </div>
                                </div>
                                <input type="file" id="photoInput" accept="image/jpeg,image/png,image/webp" class="hidden" />
                            </div>

                            <div class="flex gap-3">
                                <button type="submit" class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Salvar</button>
                                <button type="button" onclick="professionalsPage.closeFormModal()" class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Modal de Horários -->
            <div id="scheduleModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b border-gray-200 sticky top-0 bg-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">Horários de Funcionamento</h2>
                                <p id="scheduleModalSubtitle" class="text-gray-600 mt-1"></p>
                            </div>
                            <button onclick="professionalsPage.closeScheduleModal()" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
                        </div>
                    </div>
                    <div id="scheduleGrid" class="p-6 space-y-4">
                        <div class="text-center py-12 text-gray-500">Carregando...</div>
                    </div>
                </div>
            </div>

            <!-- Lista de Profissionais -->
            <div id="professionalsList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="text-center py-12 text-gray-500">Carregando...</div>
            </div>
        `
    }

    async attachListeners() {
        await this.loadProfessionals()
        
        const form = document.getElementById('professionalForm')
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e))
        }
    }

    async loadProfessionals() {
        const { data, error } = await supabase
            .from('professionals')
            .select('*')
            .eq('tenant_id', tenant.id)
            .order('ordem', { ascending: true })

        if (error) {
            console.error('Erro:', error)
            return
        }

        const list = document.getElementById('professionalsList')
        
        if (data.length === 0) {
            list.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-600 mb-4">Nenhum profissional cadastrado</p>
                    <button onclick="professionalsPage.showForm()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                        Cadastrar Primeiro Profissional
                    </button>
                </div>
            `
            return
        }

        list.innerHTML = data.map((prof, idx) => {
            let photoUrl = ''
            if (prof.photo_url) {
                try {
                    const result = supabase.storage.from('salon-images').getPublicUrl(prof.photo_url)
                    photoUrl = result?.data?.publicUrl || result?.publicUrl || ''
                    console.log(`Photo URL for ${prof.nome}:`, photoUrl)
                } catch (err) {
                    console.error(`Error getting public URL for ${prof.nome}:`, err)
                }
            }
            window[`prof_${idx}`] = prof
            return `
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${!prof.ativo ? 'opacity-50' : ''}">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            ${prof.photo_url && photoUrl ? `<img src="${photoUrl}" class="w-12 h-12 rounded-full object-cover border-2 border-red-200" onerror="console.log('Photo load failed:', this.src); this.style.display='none'">` : ``}
                            <div>
                                <h3 class="font-semibold text-gray-900">${prof.nome}</h3>
                                <span class="text-xs px-2 py-0.5 rounded-full ${prof.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
                                    ${prof.ativo ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                    </div>
                    ${prof.bio ? `<p class="text-sm text-gray-600 mb-4">${prof.bio}</p>` : ''}
                    <div class="space-y-2 text-sm text-gray-600 mb-4">
                        ${prof.email ? `<div>📧 ${prof.email}</div>` : ''}
                        ${prof.whatsapp ? `<div>📱 ${formatPhone(prof.whatsapp)}</div>` : ''}
                    </div>
                    <div class="flex gap-2">
                        <button onclick="professionalsPage.showForm(window.prof_${idx})" class="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                            ✏️ Editar
                        </button>
                        <button onclick="professionalsPage.showScheduleModal('${prof.id}', '${prof.nome}')" class="flex-1 px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg">
                            🕐 Horários
                        </button>
                        <button onclick="professionalsPage.toggleAtivo('${prof.id}', ${prof.ativo})" class="flex-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg">
                            ${prof.ativo ? 'Desativar' : 'Ativar'}
                        </button>
                        <button onclick="professionalsPage.deleteProfessional('${prof.id}')" class="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg">
                            🗑️
                        </button>
                    </div>
                </div>
            `
        }).join('')
    }

    showForm(professional = null) {
        document.getElementById('formModal').classList.remove('hidden')
        document.getElementById('formTitle').textContent = professional ? 'Editar Profissional' : 'Novo Profissional'
        
        this.setupPhotoListeners()
        
        const profilePreview = document.getElementById('profilePreview')
        const profilePlaceholder = document.getElementById('profilePlaceholder')
        const addPhotoBtn = document.getElementById('addPhotoBtn')
        const deletePhotoBtn = document.getElementById('deletePhotoBtn')
        const adjustmentControls = document.getElementById('adjustmentControls')

        window._photoFile = null
        window._removePhoto = false
        this.photoSelectedFile = null
        profilePreview.style.transform = 'scale(1)'
        adjustmentControls.classList.add('hidden')

        if (professional) {
            document.getElementById('editId').value = professional.id
            document.getElementById('nome').value = professional.nome
            document.getElementById('email').value = professional.email || ''
            document.getElementById('telefone').value = professional.telefone || ''
            document.getElementById('whatsapp').value = professional.whatsapp || ''
            document.getElementById('bio').value = professional.bio || ''

            if (professional.photo_url) {
                const urlResult = supabase.storage.from('salon-images').getPublicUrl(professional.photo_url)
                const publicUrl = urlResult?.data?.publicUrl || urlResult?.publicUrl || ''
                console.log(`Edit form photo URL for ${professional.nome}:`, publicUrl)
                if (publicUrl) {
                    profilePreview.src = publicUrl
                    profilePreview.classList.remove('hidden')
                    profilePlaceholder.classList.add('hidden')
                    deletePhotoBtn.classList.remove('hidden')
                    addPhotoBtn.innerHTML = '✎'
                } else {
                    console.warn(`No public URL found for photo: ${professional.photo_url}`)
                    profilePreview.classList.add('hidden')
                    profilePlaceholder.classList.remove('hidden')
                    deletePhotoBtn.classList.add('hidden')
                    addPhotoBtn.innerHTML = '+'
                }
            } else {
                profilePreview.classList.add('hidden')
                profilePlaceholder.classList.remove('hidden')
                deletePhotoBtn.classList.add('hidden')
                addPhotoBtn.innerHTML = '+'
            }
        } else {
            document.getElementById('professionalForm').reset()
            document.getElementById('editId').value = ''
            profilePreview.classList.add('hidden')
            profilePlaceholder.classList.remove('hidden')
            deletePhotoBtn.classList.add('hidden')
            addPhotoBtn.innerHTML = '+'
        }
    }

    closeFormModal() {
        document.getElementById('formModal').classList.add('hidden')
        document.getElementById('professionalForm').reset()
    }

    setupPhotoListeners() {
        if (this.photoListenersSetup) return

        const profileCircle = document.getElementById('profileCircle')
        const profilePreview = document.getElementById('profilePreview')
        const profilePlaceholder = document.getElementById('profilePlaceholder')
        const photoInput = document.getElementById('photoInput')
        const addPhotoBtn = document.getElementById('addPhotoBtn')
        const deletePhotoBtn = document.getElementById('deletePhotoBtn')
        const adjustmentControls = document.getElementById('adjustmentControls')
        const zoomSlider = document.getElementById('zoomSlider')
        const zoomValue = document.getElementById('zoomValue')
        const confirmPhotoBtn = document.getElementById('confirmPhotoBtn')
        const cancelPhotoBtn = document.getElementById('cancelPhotoBtn')

        addPhotoBtn.onclick = () => photoInput.click()

        photoInput.onchange = (e) => {
            const file = e.target.files[0]
            if (!file) return

            const allowed = ['image/jpeg','image/png','image/webp']
            const maxBytes = 8 * 1024 * 1024

            if (!allowed.includes(file.type)) {
                alert('Formato inválido. Use jpg, png ou webp.')
                return
            }

            if (file.size > maxBytes) {
                alert('Arquivo muito grande. Máximo 8 MB.')
                return
            }

            this.photoSelectedFile = file
            const reader = new FileReader()
            reader.onload = (event) => {
                profilePreview.src = event.target.result
                profilePreview.classList.remove('hidden')
                profilePlaceholder.classList.add('hidden')
                adjustmentControls.classList.remove('hidden')
                zoomSlider.value = 100
                this.photoCurrentZoom = 100
                zoomValue.textContent = '100'
                this.updatePreviewZoom()
            }
            reader.readAsDataURL(file)
        }

        zoomSlider.oninput = (e) => {
            this.photoCurrentZoom = e.target.value
            zoomValue.textContent = this.photoCurrentZoom
            this.updatePreviewZoom()
        }

        confirmPhotoBtn.onclick = () => {
            window._photoFile = this.photoSelectedFile
            window._photoZoom = this.photoCurrentZoom
            adjustmentControls.classList.add('hidden')
            deletePhotoBtn.classList.remove('hidden')
            addPhotoBtn.innerHTML = '✎'
        }

        cancelPhotoBtn.onclick = () => {
            photoInput.value = ''
            this.photoSelectedFile = null
            adjustmentControls.classList.add('hidden')
            if (!window._photoFile) {
                profilePreview.classList.add('hidden')
                profilePlaceholder.classList.remove('hidden')
                deletePhotoBtn.classList.add('hidden')
                profilePreview.style.transform = 'scale(1)'
            }
        }

        deletePhotoBtn.onclick = (e) => {
            e.preventDefault()
            profilePreview.classList.add('hidden')
            profilePlaceholder.classList.remove('hidden')
            photoInput.value = ''
            this.photoSelectedFile = null
            adjustmentControls.classList.add('hidden')
            deletePhotoBtn.classList.add('hidden')
            addPhotoBtn.innerHTML = '+'
            profilePreview.style.transform = 'scale(1)'
            window._photoFile = null
            window._removePhoto = true
        }

        this.photoListenersSetup = true
    }

    updatePreviewZoom() {
        const profilePreview = document.getElementById('profilePreview')
        profilePreview.style.transform = `scale(${this.photoCurrentZoom / 100})`
        profilePreview.style.transformOrigin = 'center center'
    }

    async handleFormSubmit(e) {
        e.preventDefault()
        
        const editId = document.getElementById('editId').value
        const data = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value || null,
            telefone: document.getElementById('telefone').value || null,
            whatsapp: document.getElementById('whatsapp').value || null,
            bio: document.getElementById('bio').value || null,
        }

        const photoFile = window._photoFile
        const removePhoto = window._removePhoto

        if (editId) {
            const { error } = await supabase
                .from('professionals')
                .update(data)
                .eq('id', editId)

            if (error) {
                alert('Erro ao atualizar: ' + error.message)
                return
            }

            if (removePhoto) {
                await supabase.from('professionals').update({ photo_url: null }).eq('id', editId)
            }

            if (photoFile) {
                try {
                    const ext = photoFile.name.split('.').pop()
                    const filePath = `professionals/${editId}/photo-${Date.now()}.${ext}`
                    const { error: uploadError } = await supabase.storage.from('salon-images').upload(filePath, photoFile, { upsert: true })
                    if (uploadError) {
                        alert('Erro ao enviar foto: ' + uploadError.message)
                        return
                    }
                    await supabase.from('professionals').update({ photo_url: filePath }).eq('id', editId)
                } catch (err) {
                    alert('Erro ao enviar foto. Tente novamente.')
                    return
                }
            }

            alert('Profissional atualizado!')
        } else {
            data.tenant_id = tenant.id
            
            const { data: result, error } = await supabase
                .from('professionals')
                .insert(data)
                .select()

            if (error) {
                alert('Erro ao cadastrar: ' + error.message)
                return
            }

            if (photoFile) {
                try {
                    const newId = result[0].id
                    const ext = photoFile.name.split('.').pop()
                    const filePath = `professionals/${newId}/photo-${Date.now()}.${ext}`
                    const { error: uploadError } = await supabase.storage.from('salon-images').upload(filePath, photoFile, { upsert: true })
                    if (!uploadError) {
                        await supabase.from('professionals').update({ photo_url: filePath }).eq('id', newId)
                    }
                } catch (err) {
                    console.error('Erro upload foto:', err)
                }
            }

            alert('Profissional cadastrado com sucesso!')
        }

        this.closeFormModal()
        await this.loadProfessionals()
    }

    async toggleAtivo(id, ativo) {
        const { error } = await supabase
            .from('professionals')
            .update({ ativo: !ativo })
            .eq('id', id)

        if (error) {
            alert('Erro: ' + error.message)
            return
        }
        await this.loadProfessionals()
    }

    async deleteProfessional(id) {
        if (!confirm('Tem certeza que deseja excluir?')) return

        const { error } = await supabase
            .from('professionals')
            .delete()
            .eq('id', id)

        if (error) {
            alert('Erro: ' + error.message)
            return
        }
        await this.loadProfessionals()
    }

    async showScheduleModal(professionalId, professionalName) {
        document.getElementById('scheduleModal').classList.remove('hidden')
        document.getElementById('scheduleModalSubtitle').textContent = `Configurar horários para ${professionalName}`
        await this.loadSchedules(professionalId)
    }

    closeScheduleModal() {
        document.getElementById('scheduleModal').classList.add('hidden')
    }

    async loadSchedules(professionalId) {
        const { data: schedules, error } = await supabase
            .from('schedules')
            .select('*')
            .eq('professional_id', professionalId)

        if (error) {
            alert('Erro ao carregar horários: ' + error.message)
            return
        }

        const schedulesMap = {}
        schedules?.forEach(s => {
            schedulesMap[s.dia_semana] = s
        })

        const diasSemana = [
            { id: 0, nome: 'Domingo' },
            { id: 1, nome: 'Segunda-feira' },
            { id: 2, nome: 'Terça-feira' },
            { id: 3, nome: 'Quarta-feira' },
            { id: 4, nome: 'Quinta-feira' },
            { id: 5, nome: 'Sexta-feira' },
            { id: 6, nome: 'Sábado' }
        ]

        const grid = document.getElementById('scheduleGrid')
        grid.innerHTML = diasSemana.map(dia => {
            const schedule = schedulesMap[dia.id] || null
            const isActive = schedule?.ativo ?? false

            return `
                <div class="bg-gray-50 rounded-lg border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">${dia.nome}</h3>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox"
                                ${isActive ? 'checked' : ''}
                                onchange="professionalsPage.toggleDay('${professionalId}', ${dia.id}, this.checked)"
                                class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>

                    <div id="schedule_${dia.id}" class="${isActive ? '' : 'hidden'}">
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Abertura</label>
                                <input type="time"
                                    id="hora_inicio_${dia.id}"
                                    value="${schedule?.hora_inicio?.substring(0, 5) || '09:00'}"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Fechamento</label>
                                <input type="time"
                                    id="hora_fim_${dia.id}"
                                    value="${schedule?.hora_fim?.substring(0, 5) || '18:00'}"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Início do Intervalo</label>
                                <input type="time"
                                    id="intervalo_inicio_${dia.id}"
                                    value="${schedule?.intervalo_inicio?.substring(0, 5) || '12:00'}"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Fim do Intervalo</label>
                                <input type="time"
                                    id="intervalo_fim_${dia.id}"
                                    value="${schedule?.intervalo_fim?.substring(0, 5) || '13:00'}"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                            </div>
                        </div>

                        <button onclick="professionalsPage.saveSchedule('${professionalId}', ${dia.id}, ${schedule?.id ? `'${schedule.id}'` : 'null'})"
                            class="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                            Salvar Horário
                        </button>
                    </div>
                </div>
            `
        }).join('')
    }

    async toggleDay(professionalId, diaSemana, ativo) {
        const scheduleDiv = document.getElementById(`schedule_${diaSemana}`)

        if (ativo) {
            scheduleDiv.classList.remove('hidden')

            const { data: existing } = await supabase
                .from('schedules')
                .select('id')
                .eq('professional_id', professionalId)
                .eq('dia_semana', diaSemana)
                .single()

            if (!existing) {
                const { error } = await supabase
                    .from('schedules')
                    .insert({
                        professional_id: professionalId,
                        dia_semana: diaSemana,
                        hora_inicio: '09:00',
                        hora_fim: '18:00',
                        intervalo_inicio: '12:00',
                        intervalo_fim: '13:00',
                        ativo: true
                    })

                if (error) {
                    alert('Erro ao ativar dia: ' + error.message)
                }
            } else {
                const { error } = await supabase
                    .from('schedules')
                    .update({ ativo: true })
                    .eq('id', existing.id)

                if (error) {
                    alert('Erro ao ativar dia: ' + error.message)
                }
            }
        } else {
            scheduleDiv.classList.add('hidden')

            const { error } = await supabase
                .from('schedules')
                .update({ ativo: false })
                .eq('professional_id', professionalId)
                .eq('dia_semana', diaSemana)

            if (error) {
                alert('Erro ao desativar dia: ' + error.message)
            }
        }
    }

    async saveSchedule(professionalId, diaSemana, scheduleId) {
        const hora_inicio = document.getElementById(`hora_inicio_${diaSemana}`).value + ':00'
        const hora_fim = document.getElementById(`hora_fim_${diaSemana}`).value + ':00'
        const intervalo_inicio = document.getElementById(`intervalo_inicio_${diaSemana}`).value + ':00'
        const intervalo_fim = document.getElementById(`intervalo_fim_${diaSemana}`).value + ':00'

        const data = {
            hora_inicio,
            hora_fim,
            intervalo_inicio,
            intervalo_fim
        }

        if (scheduleId && scheduleId !== 'null') {
            const { error } = await supabase
                .from('schedules')
                .update(data)
                .eq('id', scheduleId)

            if (error) {
                alert('Erro ao salvar: ' + error.message)
                return
            }
        } else {
            data.professional_id = professionalId
            data.dia_semana = diaSemana
            data.ativo = true

            const { error } = await supabase
                .from('schedules')
                .insert(data)

            if (error) {
                alert('Erro ao salvar: ' + error.message)
                return
            }
        }

        alert('Horário salvo com sucesso!')
        await this.loadSchedules(professionalId)
    }
}

const professionalsPage = new ProfessionalsPage()
