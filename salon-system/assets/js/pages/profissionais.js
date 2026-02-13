const ProfissionaisPage = {
    profissionais: [],
    editingId: null,
    selectedPhotoFile: null,
    
    async render() {
        await this.loadData();
        document.getElementById('content-area').innerHTML = this.getHTML();
        this.attachEvents();
    },
    
    async loadData() {
        const user = Auth.getUser();
        const {data} = await supabase.from('professionals').select('*').eq('tenant_id', user.id).order('nome');
        this.profissionais = (data || []).map(prof => {
            let photoUrl = '';
            if (prof.photo_url) {
                const result = window.supabase.storage.from('salon-images').getPublicUrl(prof.photo_url);
                photoUrl = result?.data?.publicUrl || '';
            }
            return { ...prof, _publicPhotoUrl: photoUrl };
        });
    },
    
    getHTML() {
        return `
            <div class="card" style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;">
                    <h2 style="margin: 0;"><i class="fas fa-users"></i> Profissionais</h2>
                    <button onclick="ProfissionaisPage.openModal()" class="btn" style="background: #667eea; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-plus"></i> Novo
                    </button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
                    ${this.profissionais.map(p => `
                        <div style="padding: 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
                            <div style="text-align: center; margin-bottom: 1rem;">
                                <div style="width: 80px; height: 80px; background: white; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #667eea; overflow: hidden; flex-shrink: 0;">
                                    ${p._publicPhotoUrl ? `<img src="${p._publicPhotoUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${p.nome}" onerror="this.style.display='none'; this.parentElement.innerHTML='${p.nome[0]}'" />` : p.nome[0]}
                                </div>
                                <h3 style="margin: 0;">${p.nome}</h3>
                                ${p.email ? `<p style="font-size: 0.9rem; opacity: 0.9;">${p.email}</p>` : ''}
                                ${p.telefone ? `<p style="font-size: 0.9rem; opacity: 0.9;">${p.telefone}</p>` : ''}
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button onclick="ProfissionaisPage.openHorarios('${p.id}')" style="flex: 1; padding: 0.5rem; background: #FF9800; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">Horários</button>
                                <button onclick="ProfissionaisPage.openModal('${p.id}')" style="flex: 1; padding: 0.5rem; background: white; color: #667eea; border: none; border-radius: 6px; cursor: pointer;">Editar</button>
                                <button onclick="ProfissionaisPage.deleteProfissional('${p.id}')" style="flex: 1; padding: 0.5rem; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer;">Excluir</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="modal-prof" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
                <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto;">
                    <h2 id="modal-prof-title">Novo Profissional</h2>
                    <form id="form-prof">
                        <input type="hidden" id="prof-id">
                        
                        <!-- Foto do Profissional -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Foto de Perfil</label>
                            <div style="display: flex; align-items: flex-start; gap: 1rem;">
                                <div style="position: relative; flex-shrink: 0;">
                                    <div id="photoPreview" style="width: 100px; height: 100px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; overflow: hidden; cursor: pointer; border: 3px solid #ddd;">
                                        <span id="photoPlaceholder" style="font-weight: bold;">+</span>
                                        <img id="photoImage" style="width: 100%; height: 100%; object-fit: cover; display: none;" />
                                    </div>
                                    <input type="file" id="prof-photo" accept="image/jpeg,image/png,image/webp" style="display: none;">
                                </div>
                                <div style="flex: 1;">
                                    <button type="button" id="uploadPhotoBtn" style="width: 100%; padding: 0.75rem; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 0.5rem;">📷 Escolher Foto</button>
                                    <button type="button" id="removePhotoBtn" style="width: 100%; padding: 0.75rem; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; display: none;">🗑️ Remover Foto</button>
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Nome *</label>
                            <input type="text" id="prof-nome" required style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Email</label>
                            <input type="email" id="prof-email" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Telefone</label>
                            <input type="tel" id="prof-telefone" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button type="submit" style="flex: 1; padding: 0.75rem; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer;">Salvar</button>
                            <button type="button" onclick="ProfissionaisPage.closeModal()" style="flex: 1; padding: 0.75rem; background: #999; color: white; border: none; border-radius: 8px; cursor: pointer;">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Modal de Horários -->
            <div id="modal-horarios" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
                <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h2 style="margin: 0;">⏰ Horários de Atendimento</h2>
                        <button onclick="ProfissionaisPage.closeHorarios()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">✕</button>
                    </div>
                    <div id="horarios-container" style="display: grid; gap: 1rem;">
                        <!-- Será preenchido dinamicamente -->
                    </div>
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end;">
                        <button onclick="ProfissionaisPage.closeHorarios()" style="padding: 0.75rem 1.5rem; background: #999; color: white; border: none; border-radius: 8px; cursor: pointer;">Fechar</button>
                        <button onclick="ProfissionaisPage.saveHorarios()" style="padding: 0.75rem 1.5rem; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer;">💾 Salvar</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    attachEvents() {
        document.getElementById('form-prof')?.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Photo upload
        document.getElementById('uploadPhotoBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('prof-photo').click();
        });
        
        document.getElementById('prof-photo')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const allowed = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowed.includes(file.type)) {
                ModalSystem.showWarning('Formato inválido. Use JPG, PNG ou WEBP.', 'Aviso');
                return;
            }
            if (file.size > 8 * 1024 * 1024) {
                ModalSystem.showWarning('Arquivo muito grande. Máximo 8MB.', 'Aviso');
                return;
            }
            
            this.selectedPhotoFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('photoImage').src = e.target.result;
                document.getElementById('photoImage').style.display = 'block';
                document.getElementById('photoPlaceholder').style.display = 'none';
                document.getElementById('removePhotoBtn').style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
        
        document.getElementById('removePhotoBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectedPhotoFile = null;
            document.getElementById('prof-photo').value = '';
            document.getElementById('photoImage').style.display = 'none';
            document.getElementById('photoPlaceholder').style.display = 'block';
            document.getElementById('removePhotoBtn').style.display = 'none';
        });
    },
    
    openModal(id = null) {
        this.editingId = id;
        this.selectedPhotoFile = null;
        document.getElementById('modal-prof-title').textContent = id ? 'Editar Profissional' : 'Novo Profissional';
        document.getElementById('photoImage').style.display = 'none';
        document.getElementById('photoPlaceholder').style.display = 'block';
        document.getElementById('removePhotoBtn').style.display = 'none';
        
        if (id) {
            const p = this.profissionais.find(x => x.id === id);
            if (p) {
                document.getElementById('prof-id').value = id;
                document.getElementById('prof-nome').value = p.nome;
                document.getElementById('prof-email').value = p.email || '';
                document.getElementById('prof-telefone').value = p.telefone || '';
                
                // Mostrar foto existente
                if (p._publicPhotoUrl) {
                    document.getElementById('photoImage').src = p._publicPhotoUrl;
                    document.getElementById('photoImage').style.display = 'block';
                    document.getElementById('photoPlaceholder').style.display = 'none';
                    document.getElementById('removePhotoBtn').style.display = 'block';
                }
            }
        } else {
            document.getElementById('form-prof').reset();
        }
        document.getElementById('modal-prof').style.display = 'flex';
    },
    
    closeModal() {
        document.getElementById('modal-prof').style.display = 'none';
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        const user = Auth.getUser();
        const id = document.getElementById('prof-id').value;
        
        let photoUrl = null;
        
        // Upload photo if selected
        if (this.selectedPhotoFile) {
            try {
                const profId = id || 'new-' + Date.now();
                const ext = this.selectedPhotoFile.name.split('.').pop();
                const filePath = `tenants/${user.id}/professionals/${profId}-${Date.now()}.${ext}`;
                
                const { error: uploadError } = await window.supabase.storage
                    .from('salon-images')
                    .upload(filePath, this.selectedPhotoFile, { upsert: true });
                
                if (uploadError) {
                    throw uploadError;
                }
                photoUrl = filePath;
            } catch (error) {
                ModalSystem.showError('Erro ao enviar foto: ' + error.message, 'Erro');
                return;
            }
        }
        
        const data = {
            tenant_id: user.id,
            nome: document.getElementById('prof-nome').value,
            email: document.getElementById('prof-email').value || null,
            telefone: document.getElementById('prof-telefone').value || null,
            ativo: true
        };
        
        // Adicionar foto apenas se foi selecionada
        if (photoUrl) {
            data.photo_url = photoUrl;
        }
        
        try {
            if (id) {
                await window.supabase.from('professionals').update(data).eq('id', id);
                ModalSystem.showSuccess('Profissional atualizado com sucesso!', 'Sucesso');
            } else {
                await supabase.from('professionals').insert(data);
                ModalSystem.showSuccess('Profissional criado com sucesso!', 'Sucesso');
            }
            this.closeModal();
            this.render();
        } catch (error) {
            ModalSystem.showError('Erro: ' + error.message, 'Erro');
        }
    },
    
    async deleteProfissional(id) {
        ModalSystem.showConfirm('Tem certeza que deseja excluir este profissional?', async () => {
            try {
                await window.supabase.from('professionals').delete().eq('id', id);
                ModalSystem.showSuccess('Profissional excluído com sucesso!');
                this.render();
            } catch (error) {
                ModalSystem.showError('Erro ao excluir: ' + error.message);
            }
        }, null, 'Excluir Profissional');
    },
    
    async openHorarios(profissionalId) {
        const prof = this.profissionais.find(p => p.id === profissionalId);
        if (!prof) return;
        
        this.editingHorariosId = profissionalId;
        
        // Carregar horários existentes
        const { data: schedules } = await window.supabase
            .from('schedules')
            .select('*')
            .eq('professional_id', profissionalId);
        
        // Carregar horários bloqueados
        const { data: blockedTimes } = await window.supabase
            .from('blocked_times')
            .select('*')
            .eq('professional_id', profissionalId)
            .order('data', { ascending: true });
        
        const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
        const horariosMap = {};
        
        (schedules || []).forEach(h => {
            if (!horariosMap[h.dia_semana]) {
                horariosMap[h.dia_semana] = h;
            }
        });
        
        let html = '<div style="margin-bottom: 1.5rem;">';
        html += '<h3 style="margin-bottom: 1rem;">📅 Horários Regulares</h3>';
        
        diasSemana.forEach((dia, index) => {
            const schedule = horariosMap[index];
            const temHorario = schedule && schedule.hora_inicio && schedule.hora_fim;
            
            html += `
                <div style="border: 2px solid #ddd; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                        <label style="font-weight: bold; font-size: 1rem;">${dia}</label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" class="dia-ativo" data-dia="${index}" ${temHorario ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                            <span>Ativo</span>
                        </label>
                    </div>
                    <div class="horarios-container" data-dia="${index}" style="display: ${temHorario ? 'flex' : 'none'}; gap: 1rem; align-items: center;">
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 0.9rem; margin-bottom: 0.3rem; font-weight: 500;">Início</label>
                            <input type="time" class="hora-inicio" data-dia="${index}" value="${schedule?.hora_inicio || '09:00'}" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 0.9rem; margin-bottom: 0.3rem; font-weight: 500;">Fim</label>
                            <input type="time" class="hora-fim" data-dia="${index}" value="${schedule?.hora_fim || '18:00'}" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        ${schedule?.intervalo_inicio ? `
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 0.9rem; margin-bottom: 0.3rem; font-weight: 500;">Intervalo Início</label>
                                <input type="time" class="intervalo-inicio" data-dia="${index}" value="${schedule.intervalo_inicio}" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 0.9rem; margin-bottom: 0.3rem; font-weight: 500;">Intervalo Fim</label>
                                <input type="time" class="intervalo-fim" data-dia="${index}" value="${schedule.intervalo_fim || ''}" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Seção de bloqueios
        html += `
            <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0;">🚫 Horários Bloqueados</h3>
                    <button onclick="ProfissionaisPage.addBloqueio()" style="padding: 0.5rem 1rem; background: #FF9800; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">+ Novo Bloqueio</button>
                </div>
                <div id="bloqueios-container" style="display: grid; gap: 0.5rem;">
                    ${(blockedTimes || []).map(b => `
                        <div style="border: 1px solid #f44336; padding: 0.75rem; border-radius: 6px; background: #ffebee; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${b.data}</strong>
                                ${b.hora_inicio ? ` • ${b.hora_inicio} até ${b.hora_fim}` : ' • Dia inteiro'}
                                ${b.motivo ? `<br><small style="color: #666;">${b.motivo}</small>` : ''}
                            </div>
                            <button onclick="ProfissionaisPage.removeBloqueio('${b.id}')" style="padding: 0.25rem 0.75rem; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">Remover</button>
                        </div>
                    `).join('')}
                    <div id="novo-bloqueio-form" style="display: none; border: 2px dashed #FF9800; padding: 1rem; border-radius: 8px; background: #fff8f0;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <label style="display: block; font-size: 0.9rem; margin-bottom: 0.3rem; font-weight: 500;">Data *</label>
                                <input type="date" id="bloqueio-data" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.9rem; margin-bottom: 0.3rem; font-weight: 500;">Motivo</label>
                                <input type="text" id="bloqueio-motivo" placeholder="Ex: Folga, Doença..." style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <label style="display: block; font-size: 0.9rem; margin-bottom: 0.3rem; font-weight: 500;">
                                    <input type="checkbox" id="bloqueio-dia-inteiro" checked style="margin-right: 0.5rem;">
                                    Dia inteiro?
                                </label>
                            </div>
                        </div>
                        <div id="horario-bloqueio" style="display: none; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <label style="display: block; font-size: 0.9rem; margin-bottom: 0.3rem; font-weight: 500;">Hora Início</label>
                                <input type="time" id="bloqueio-hora-inicio" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.9rem; margin-bottom: 0.3rem; font-weight: 500;">Hora Fim</label>
                                <input type="time" id="bloqueio-hora-fim" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button onclick="ProfissionaisPage.saveBloqueio()" style="flex: 1; padding: 0.5rem; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">✓ Salvar</button>
                            <button onclick="ProfissionaisPage.cancelBloqueio()" style="flex: 1; padding: 0.5rem; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">✕ Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('horarios-container').innerHTML = html;
        
        // Event listeners para horários regulares
        document.querySelectorAll('.dia-ativo').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const dia = e.target.dataset.dia;
                const container = document.querySelector(`.horarios-container[data-dia="${dia}"]`);
                container.style.display = e.target.checked ? 'flex' : 'none';
            });
        });
        
        // Event listener para bloqueio dia inteiro
        document.getElementById('bloqueio-dia-inteiro')?.addEventListener('change', (e) => {
            const horarioDiv = document.getElementById('horario-bloqueio');
            horarioDiv.style.display = e.target.checked ? 'none' : 'grid';
        });
        
        document.getElementById('modal-horarios').style.display = 'flex';
    },
    
    addBloqueio() {
        document.getElementById('novo-bloqueio-form').style.display = 'block';
        document.getElementById('bloqueio-data').value = new Date().toISOString().split('T')[0];
    },
    
    cancelBloqueio() {
        document.getElementById('novo-bloqueio-form').style.display = 'none';
    },
    
    async saveBloqueio() {
        const data = document.getElementById('bloqueio-data').value;
        const motivo = document.getElementById('bloqueio-motivo').value || null;
        const diaInteiro = document.getElementById('bloqueio-dia-inteiro').checked;
        
        if (!data) {
            alert('❌ Selecione uma data');
            return;
        }
        
        let horaInicio, horaFim;
        
        if (diaInteiro) {
            // Dia inteiro: usar horários que cobrem o dia todo
            horaInicio = '00:00';
            horaFim = '23:59';
        } else {
            horaInicio = document.getElementById('bloqueio-hora-inicio').value;
            horaFim = document.getElementById('bloqueio-hora-fim').value;
            
            if (!horaInicio || !horaFim) {
                alert('❌ Selecione os horários de bloqueio');
                return;
            }
        }
        
        const bloqueioData = {
            professional_id: this.editingHorariosId,
            data: data,
            motivo: motivo,
            hora_inicio: horaInicio,
            hora_fim: horaFim
        };
        
        const { error } = await window.supabase
            .from('blocked_times')
            .insert([bloqueioData]);
        
        if (error) {
            ModalSystem.showError('Erro ao salvar: ' + error.message, 'Erro');
            return;
        }
        
        document.getElementById('novo-bloqueio-form').style.display = 'none';
        this.openHorarios(this.editingHorariosId);
    },
    
    async removeBloqueio(bloqueioId) {
        if (!confirm('Remover este bloqueio?')) return;
        
        await window.supabase
            .from('blocked_times')
            .delete()
            .eq('id', bloqueioId);
        
        this.openHorarios(this.editingHorariosId);
    },
    
    closeHorarios() {
        document.getElementById('modal-horarios').style.display = 'none';
        this.editingHorariosId = null;
    },
    
    async saveHorarios() {
        if (!this.editingHorariosId) return;
        
        const profissionalId = this.editingHorariosId;
        
        // Deletar horários antigos
        await window.supabase
            .from('schedules')
            .delete()
            .eq('professional_id', profissionalId);
        
        // Coletar novos horários
        const novosHorarios = [];
        document.querySelectorAll('.dia-ativo').forEach(checkbox => {
            const dia = parseInt(checkbox.dataset.dia);
            const ativo = checkbox.checked;
            
            if (ativo) {
                const horaInicio = document.querySelector(`.hora-inicio[data-dia="${dia}"]`)?.value;
                const horaFim = document.querySelector(`.hora-fim[data-dia="${dia}"]`)?.value;
                const intervaloInicio = document.querySelector(`.intervalo-inicio[data-dia="${dia}"]`)?.value;
                const intervaloFim = document.querySelector(`.intervalo-fim[data-dia="${dia}"]`)?.value;
                
                if (horaInicio && horaFim) {
                    novosHorarios.push({
                        professional_id: profissionalId,
                        dia_semana: dia,
                        hora_inicio: horaInicio,
                        hora_fim: horaFim,
                        intervalo_inicio: intervaloInicio || null,
                        intervalo_fim: intervaloFim || null,
                        ativo: true
                    });
                }
            }
        });
        
        // Inserir novos horários
        if (novosHorarios.length > 0) {
            const { error } = await window.supabase
                .from('schedules')
                .insert(novosHorarios);
            
            if (error) {
                ModalSystem.showError('Erro ao salvar: ' + error.message, 'Erro');
                return;
            }
        }
        
        ModalSystem.showSuccess('Horários salvos com sucesso!', 'Sucesso');
        this.closeHorarios();
    }
};
