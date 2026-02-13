// assets/js/dropdown-manager.js
// Sistema de gerenciamento inline para dropdowns com banco de dados

const DropdownManager = {
    // Gerenciar Pacotes
    async gerenciarPacotes() {
        showLoading('Carregando pacotes...');
        
        // Buscar pacotes do banco
        const { data: pacotes, error } = await db.client
            .from('pacotes_personalizados')
            .select('*')
            .eq('tipo', 'PACOTE')
            .eq('ativo', true)
            .order('ordem', { ascending: true })
            .order('nome', { ascending: true });
        
        hideLoading();
        
        if (error) {
            console.error('Erro ao carregar pacotes:', error);
            showAlert('Erro ao carregar pacotes', 'error');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'modal-gerenciar-pacotes';
        modal.innerHTML = `
            <div class="modal" style="max-width: 600px;">
                <div class="modal-header">
                    <h2><i class="fas fa-box"></i> Gerenciar Pacotes</h2>
                    <button class="btn-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Adicionar Novo Pacote</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="novo-pacote" placeholder="Nome do pacote" 
                                   style="flex: 1; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px;"
                                   onkeypress="if(event.key==='Enter') DropdownManager.adicionarPacote()">
                            <button onclick="DropdownManager.adicionarPacote()" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Adicionar
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Pacotes Cadastrados</label>
                        <div id="lista-pacotes" style="max-height: 300px; overflow-y: auto;">
                            ${pacotes.map(p => `
                                <div class="item-lista" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 0.5rem; background: white;">
                                    <span style="font-weight: 500;">${p.nome}</span>
                                    <button onclick="DropdownManager.removerPacote(${p.id}, '${p.nome}')" 
                                            class="btn btn-danger btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    adicionarPacote() {
        const input = document.getElementById('novo-pacote');
        const nome = input.value.trim().toUpperCase();
        
        if (!nome) {
            showAlert('Digite o nome do pacote', 'warning');
            return;
        }
        
        // Salvar no localStorage
        const pacotes = this.getPacotes();
        if (pacotes.includes(nome)) {
            showAlert('Pacote já existe', 'warning');
            return;
        }
        
        pacotes.push(nome);
        localStorage.setItem('pacotes_disponiveis', JSON.stringify(pacotes));
        
        showAlert('Pacote adicionado com sucesso!', 'success');
        input.value = '';
        
        // Atualizar lista
        this.atualizarListaPacotes();
    },

    removerPacote(nome) {
        if (!confirm(`Deseja remover o pacote "${nome}"?`)) return;
        
        const pacotes = this.getPacotes().filter(p => p !== nome);
        localStorage.setItem('pacotes_disponiveis', JSON.stringify(pacotes));
        
        showAlert('Pacote removido com sucesso!', 'success');
        this.atualizarListaPacotes();
    },

    atualizarListaPacotes() {
        const lista = document.getElementById('lista-pacotes');
        const pacotes = this.getPacotes();
        
        lista.innerHTML = pacotes.map(p => `
            <div class="item-lista" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 0.5rem; background: white;">
                <span style="font-weight: 500;">${p}</span>
                <button onclick="DropdownManager.removerPacote('${p}')" 
                        class="btn btn-danger btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    },

    getPacotes() {
        const pacotesPadrao = ['BÁSICO', 'INTERMEDIÁRIO', 'AVANÇADO', 'PREMIUM', 'SUPER', 'MEGA'];
        const salvos = localStorage.getItem('pacotes_disponiveis');
        return salvos ? JSON.parse(salvos) : pacotesPadrao;
    },

    // Gerenciar A la Carte
    async gerenciarALaCarte() {
        const itensAtuais = ['NÃO', 'HBO MAX', 'PARAMOUNT+', 'DAZN', 'GLOBOPLAY', 'PACOTE STREAMING'];
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal" style="max-width: 600px;">
                <div class="modal-header">
                    <h2><i class="fas fa-tv"></i> Gerenciar A la Carte</h2>
                    <button class="btn-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Adicionar Novo Item</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="novo-alacarte" placeholder="Nome do serviço" 
                                   style="flex: 1; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px;">
                            <button onclick="DropdownManager.adicionarALaCarte()" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Adicionar
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Itens Cadastrados</label>
                        <div id="lista-alacarte" style="max-height: 300px; overflow-y: auto;">
                            ${itensAtuais.map(item => `
                                <div class="item-lista" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 0.5rem; background: white;">
                                    <span style="font-weight: 500;">${item}</span>
                                    ${item !== 'NÃO' ? `
                                        <button onclick="DropdownManager.removerALaCarte('${item}')" 
                                                class="btn btn-danger btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    ` : '<span style="color: #999; font-size: 0.85rem;">Padrão</span>'}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    adicionarALaCarte() {
        const input = document.getElementById('novo-alacarte');
        const nome = input.value.trim().toUpperCase();
        
        if (!nome) {
            showAlert('Digite o nome do serviço', 'warning');
            return;
        }
        
        const itens = this.getALaCarte();
        if (itens.includes(nome)) {
            showAlert('Item já existe', 'warning');
            return;
        }
        
        itens.push(nome);
        localStorage.setItem('alacarte_disponiveis', JSON.stringify(itens));
        
        showAlert('Item adicionado com sucesso!', 'success');
        input.value = '';
        
        this.atualizarListaALaCarte();
    },

    removerALaCarte(nome) {
        if (!confirm(`Deseja remover "${nome}"?`)) return;
        
        const itens = this.getALaCarte().filter(i => i !== nome);
        localStorage.setItem('alacarte_disponiveis', JSON.stringify(itens));
        
        showAlert('Item removido com sucesso!', 'success');
        this.atualizarListaALaCarte();
    },

    atualizarListaALaCarte() {
        const lista = document.getElementById('lista-alacarte');
        const itens = this.getALaCarte();
        
        lista.innerHTML = itens.map(item => `
            <div class="item-lista" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 0.5rem; background: white;">
                <span style="font-weight: 500;">${item}</span>
                ${item !== 'NÃO' ? `
                    <button onclick="DropdownManager.removerALaCarte('${item}')" 
                            class="btn btn-danger btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : '<span style="color: #999; font-size: 0.85rem;">Padrão</span>'}
            </div>
        `).join('');
    },

    getALaCarte() {
        const itensPadrao = ['NÃO', 'HBO MAX', 'PARAMOUNT+', 'DAZN', 'GLOBOPLAY', 'PACOTE STREAMING'];
        const salvos = localStorage.getItem('alacarte_disponiveis');
        return salvos ? JSON.parse(salvos) : itensPadrao;
    },

    // Gerenciar Descontos
    async gerenciarDescontos() {
        const descontosAtuais = ['SEM DESCONTO', '10%', '15%', '20%', '25%', '30%'];
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal" style="max-width: 600px;">
                <div class="modal-header">
                    <h2><i class="fas fa-percent"></i> Gerenciar Descontos</h2>
                    <button class="btn-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Adicionar Novo Desconto</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="novo-desconto" placeholder="Ex: 35%, R$ 50,00" 
                                   style="flex: 1; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px;">
                            <button onclick="DropdownManager.adicionarDesconto()" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Adicionar
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Descontos Cadastrados</label>
                        <div id="lista-descontos" style="max-height: 300px; overflow-y: auto;">
                            ${descontosAtuais.map(d => `
                                <div class="item-lista" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 0.5rem; background: white;">
                                    <span style="font-weight: 500;">${d}</span>
                                    ${d !== 'SEM DESCONTO' ? `
                                        <button onclick="DropdownManager.removerDesconto('${d}')" 
                                                class="btn btn-danger btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    ` : '<span style="color: #999; font-size: 0.85rem;">Padrão</span>'}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    adicionarDesconto() {
        const input = document.getElementById('novo-desconto');
        const nome = input.value.trim().toUpperCase();
        
        if (!nome) {
            showAlert('Digite o desconto', 'warning');
            return;
        }
        
        const descontos = this.getDescontos();
        if (descontos.includes(nome)) {
            showAlert('Desconto já existe', 'warning');
            return;
        }
        
        descontos.push(nome);
        localStorage.setItem('descontos_disponiveis', JSON.stringify(descontos));
        
        showAlert('Desconto adicionado com sucesso!', 'success');
        input.value = '';
        
        this.atualizarListaDescontos();
    },

    removerDesconto(nome) {
        if (!confirm(`Deseja remover o desconto "${nome}"?`)) return;
        
        const descontos = this.getDescontos().filter(d => d !== nome);
        localStorage.setItem('descontos_disponiveis', JSON.stringify(descontos));
        
        showAlert('Desconto removido com sucesso!', 'success');
        this.atualizarListaDescontos();
    },

    atualizarListaDescontos() {
        const lista = document.getElementById('lista-descontos');
        const descontos = this.getDescontos();
        
        lista.innerHTML = descontos.map(d => `
            <div class="item-lista" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 0.5rem; background: white;">
                <span style="font-weight: 500;">${d}</span>
                ${d !== 'SEM DESCONTO' ? `
                    <button onclick="DropdownManager.removerDesconto('${d}')" 
                            class="btn btn-danger btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : '<span style="color: #999; font-size: 0.85rem;">Padrão</span>'}
            </div>
        `).join('');
    },

    getDescontos() {
        const descontosPadrao = ['SEM DESCONTO', '10%', '15%', '20%', '25%', '30%'];
        const salvos = localStorage.getItem('descontos_disponiveis');
        return salvos ? JSON.parse(salvos) : descontosPadrao;
    }
};

// Disponibilizar globalmente
window.DropdownManager = DropdownManager;
