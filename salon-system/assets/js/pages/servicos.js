const ServicosPage = {
    servicos: [],
    
    async render() {
        await this.loadData();
        document.getElementById('content-area').innerHTML = this.getHTML();
        this.attachEvents();
    },
    
    async loadData() {
        const user = Auth.getUser();
        const {data} = await supabase.from('services').select('*').eq('tenant_id', user.id).order('nome');
        this.servicos = data || [];
    },
    
    getHTML() {
        return `
            <div class="card" style="background: white; padding: 1.5rem; border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;">
                    <h2 style="margin: 0;"><i class="fas fa-cut"></i> Serviços</h2>
                    <button onclick="ServicosPage.openModal()" style="background: #667eea; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-plus"></i> Novo
                    </button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0;">
                    ${this.servicos.map(s => `
                        <div style="padding: 1.5rem; background: #f8f9fa; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center; gap: 2rem;">
                            <div style="flex: 1.5; min-width: 150px;">
                                <strong style="font-size: 0.9rem;">${s.nome}</strong>
                                <p style="margin: 0.25rem 0 0 0; color: #999; font-size: 0.85rem;">⏱️ ${s.duracao_minutos} min</p>
                            </div>
                            <div style="flex: 2; min-width: 180px;">
                                <span style="font-size: 0.9rem; color: #666;">${s.descricao || '-'}</span>
                            </div>
                            <div style="flex: 0.8; min-width: 100px; text-align: right;">
                                <strong style="font-size: 1.1rem; color: #4CAF50;">${formatMoney(s.preco)}</strong>
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button onclick="ServicosPage.openModal('${s.id}')" style="padding: 0.5rem 1rem; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">Editar</button>
                                <button onclick="ServicosPage.deleteServico('${s.id}')" style="padding: 0.5rem 1rem; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">Excluir</button>
                            </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="modal-svc" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
                <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; width: 90%;">
                    <h2 id="modal-svc-title">Novo Serviço</h2>
                    <form id="form-svc">
                        <input type="hidden" id="svc-id">
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Nome *</label>
                            <input type="text" id="svc-nome" required style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Descrição</label>
                            <textarea id="svc-descricao" rows="2" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;"></textarea>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Preço (R$) *</label>
                                <input type="number" id="svc-preco" required min="0" step="0.01" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Duração (min) *</label>
                                <input type="number" id="svc-duracao" required min="5" step="5" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                            </div>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button type="submit" style="flex: 1; padding: 0.75rem; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer;">Salvar</button>
                            <button type="button" onclick="ServicosPage.closeModal()" style="flex: 1; padding: 0.75rem; background: #999; color: white; border: none; border-radius: 8px; cursor: pointer;">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },
    
    attachEvents() {
        document.getElementById('form-svc')?.addEventListener('submit', (e) => this.handleSubmit(e));
    },
    
    openModal(id = null) {
        if (id) {
            const s = this.servicos.find(x => x.id === id);
            if (s) {
                document.getElementById('modal-svc-title').textContent = 'Editar Serviço';
                document.getElementById('svc-id').value = id;
                document.getElementById('svc-nome').value = s.nome;
                document.getElementById('svc-descricao').value = s.descricao || '';
                document.getElementById('svc-preco').value = s.preco;
                document.getElementById('svc-duracao').value = s.duracao_minutos;
            }
        } else {
            document.getElementById('modal-svc-title').textContent = 'Novo Serviço';
            document.getElementById('form-svc').reset();
        }
        document.getElementById('modal-svc').style.display = 'flex';
    },
    
    closeModal() {
        document.getElementById('modal-svc').style.display = 'none';
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        const user = Auth.getUser();
        const id = document.getElementById('svc-id').value;
        
        const data = {
            tenant_id: user.id,
            nome: document.getElementById('svc-nome').value,
            descricao: document.getElementById('svc-descricao').value || null,
            preco: parseFloat(document.getElementById('svc-preco').value),
            duracao_minutos: parseInt(document.getElementById('svc-duracao').value),
            ativo: true
        };
        
        try {
            if (id) {
                await supabase.from('services').update(data).eq('id', id);
                ModalSystem.showSuccess('Serviço atualizado com sucesso!', 'Sucesso');
            } else {
                await supabase.from('services').insert(data);
                ModalSystem.showSuccess('Serviço criado com sucesso!', 'Sucesso');
            }
            this.closeModal();
            this.render();
        } catch (error) {
            ModalSystem.showError('Erro: ' + error.message, 'Erro');
        }
    },
    
    async deleteServico(id) {
        ModalSystem.showConfirm('Tem certeza que deseja excluir este serviço?', async () => {
            try {
                await supabase.from('services').delete().eq('id', id);
                ModalSystem.showSuccess('Serviço excluído com sucesso!');
                this.render();
            } catch (error) {
                ModalSystem.showError('Erro ao excluir: ' + error.message);
            }
        }, null, 'Excluir Serviço');
    }
};
