const ClientesPage = {
    clientes: [],
    
    async render() {
        await this.loadData();
        document.getElementById('content-area').innerHTML = this.getHTML();
        this.attachEvents();
    },
    
    async loadData() {
        const user = Auth.getUser();
        const {data} = await supabase.from('customers').select('*').eq('tenant_id', user.id).order('nome');
        this.clientes = data || [];
    },
    
    getHTML() {
        return `
            <div class="card" style="background: white; padding: 1.5rem; border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;">
                    <h2 style="margin: 0;"><i class="fas fa-user-friends"></i> Clientes</h2>
                    <button onclick="ClientesPage.openModal()" style="background: #667eea; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-plus"></i> Novo
                    </button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0;">
                    ${this.clientes.map(c => `
                        <div style="padding: 1.5rem; background: #f8f9fa; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center; gap: 2rem;">
                            <div style="flex: 1.5; min-width: 150px;">
                                <strong style="font-size: 0.9rem;">${c.nome}</strong>
                            </div>
                            <div style="flex: 1.5; min-width: 150px;">
                                <span style="font-size: 0.9rem; color: #666;">${c.whatsapp ? formatPhone(c.whatsapp) : '-'}</span>
                            </div>
                            <div style="flex: 2; min-width: 180px;">
                                <span style="font-size: 0.9rem; color: #666;">${c.email || '-'}</span>
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button onclick="ClientesPage.openModal('${c.id}')" style="padding: 0.5rem 1rem; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">Editar</button>
                                <button onclick="ClientesPage.deleteCliente('${c.id}')" style="padding: 0.5rem 1rem; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">Excluir</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="modal-cli" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
                <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; width: 90%;">
                    <h2 id="modal-cli-title">Novo Cliente</h2>
                    <form id="form-cli">
                        <input type="hidden" id="cli-id">
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Nome *</label>
                            <input type="text" id="cli-nome" required style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">WhatsApp</label>
                            <input type="tel" id="cli-whatsapp" maxlength="11" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Email</label>
                            <input type="email" id="cli-email" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button type="submit" style="flex: 1; padding: 0.75rem; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer;">Salvar</button>
                            <button type="button" onclick="ClientesPage.closeModal()" style="flex: 1; padding: 0.75rem; background: #999; color: white; border: none; border-radius: 8px; cursor: pointer;">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },
    
    attachEvents() {
        document.getElementById('form-cli')?.addEventListener('submit', (e) => this.handleSubmit(e));
    },
    
    openModal(id = null) {
        if (id) {
            const c = this.clientes.find(x => x.id === id);
            if (c) {
                document.getElementById('modal-cli-title').textContent = 'Editar Cliente';
                document.getElementById('cli-id').value = id;
                document.getElementById('cli-nome').value = c.nome;
                document.getElementById('cli-whatsapp').value = c.whatsapp || '';
                document.getElementById('cli-email').value = c.email || '';
            }
        } else {
            document.getElementById('modal-cli-title').textContent = 'Novo Cliente';
            document.getElementById('form-cli').reset();
        }
        document.getElementById('modal-cli').style.display = 'flex';
    },
    
    closeModal() {
        document.getElementById('modal-cli').style.display = 'none';
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        const user = Auth.getUser();
        const id = document.getElementById('cli-id').value;
        
        const data = {
            tenant_id: user.id,
            nome: document.getElementById('cli-nome').value,
            whatsapp: document.getElementById('cli-whatsapp').value || null,
            email: document.getElementById('cli-email').value || null
        };
        
        try {
            if (id) {
                await supabase.from('customers').update(data).eq('id', id);
                ModalSystem.showSuccess('Cliente atualizado com sucesso!', 'Sucesso');
            } else {
                await supabase.from('customers').insert(data);
                ModalSystem.showSuccess('Cliente criado com sucesso!', 'Sucesso');
            }
            this.closeModal();
            this.render();
        } catch (error) {
            ModalSystem.showError('Erro: ' + error.message, 'Erro');
        }
    },
    
    async deleteCliente(id) {
        ModalSystem.showConfirm('Tem certeza que deseja excluir este cliente?', async () => {
            try {
                await supabase.from('customers').delete().eq('id', id);
                ModalSystem.showSuccess('Cliente excluído com sucesso!');
                this.render();
            } catch (error) {
                ModalSystem.showError('Erro ao excluir: ' + error.message);
            }
        }, null, 'Excluir Cliente');
    }
};
