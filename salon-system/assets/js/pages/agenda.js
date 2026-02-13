const AgendaPage = {
    agendamentos: [],
    profissionais: [],
    servicos: [],
    clientes: [],
    filtroData: new Date().toISOString().split('T')[0],
    filtroProfissional: 'todos',
    filtroStatus: 'todos',
    
    async render() {
        console.log('🔄 AgendaPage - Iniciando render...');
        await this.loadData();
        console.log('📊 Dados carregados:', {
            agendamentos: this.agendamentos.length,
            profissionais: this.profissionais.length,
            servicos: this.servicos.length,
            clientes: this.clientes.length
        });
        
        const html = this.getHTML();
        document.getElementById('content-area').innerHTML = html;
        this.attachEvents();
        this.updateResumo();
        
        // Restaurar valores dos filtros após renderizar
        this.restoreFilterValues();
        
        // Renderizar timeline com filtros atuais
        this.renderTimeline();
    },
    
    restoreFilterValues() {
        const filtroDataEl = document.getElementById('filtro-data');
        const filtroProfissionalEl = document.getElementById('filtro-profissional');
        const filtroStatusEl = document.getElementById('filtro-status');
        
        if (filtroDataEl) filtroDataEl.value = this.filtroData;
        if (filtroProfissionalEl) filtroProfissionalEl.value = this.filtroProfissional || 'todos';
        if (filtroStatusEl) filtroStatusEl.value = this.filtroStatus || 'todos';
    },
    
    renderTimeline() {
        const agendamentosFiltrados = this.getAgendamentosFiltrados();
        const timelineHTML = this.getTimelineHTML(agendamentosFiltrados);
        const container = document.getElementById('timeline-container');
        if (container) {
            container.innerHTML = timelineHTML;
        }
    },
    
    getTimelineHTML(agendamentosFiltrados) {
        return `
            <h2 style="margin: 0 0 1.5rem 0; color: #333;">
                <i class="fas fa-clock"></i> ${this.formatarDataLonga(this.filtroData)}
                <span style="background: #667eea; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; margin-left: 1rem;">
                    ${agendamentosFiltrados.length}
                </span>
            </h2>
            
            ${agendamentosFiltrados.length > 0 ? `
                <div style="position: relative;">
                    <div style="position: absolute; left: 60px; top: 0; bottom: 0; width: 2px; background: #e0e0e0;"></div>
                    ${agendamentosFiltrados.map((a, i) => `
                        <div style="position: relative; padding: 1rem 0; border-bottom: ${i < agendamentosFiltrados.length - 1 ? '1px dashed #e0e0e0' : 'none'};">
                            <div style="position: absolute; left: 0; top: 1rem; width: 55px; text-align: right; padding-right: 1rem; font-weight: bold; color: #667eea;">
                                ${a.hora_inicio?.substring(0, 5) || a.hora_inicio}
                            </div>
                            <div style="position: absolute; left: 54px; top: 1.5rem; width: 14px; height: 14px; background: ${this.getStatusColor(a.status)}; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 0 2px ${this.getStatusColor(a.status)};"></div>
                            
                            <div style="margin-left: 80px; background: #f8f9fa; padding: 1.25rem; border-radius: 10px; border-left: 4px solid ${this.getStatusColor(a.status)};">
                                <div style="display: flex; justify-content: space-between; gap: 1rem;">
                                    <div style="flex: 1;">
                                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                                            <h3 style="margin: 0; font-size: 1.1rem;">${a.cliente_nome || a.nome_cliente || 'Cliente'}</h3>
                                            <span style="padding: 0.25rem 0.75rem; background: ${this.getStatusColor(a.status)}; color: white; border-radius: 12px; font-size: 0.75rem;">
                                                ${a.status || 'pendente'}
                                            </span>
                                        </div>
                                        <div style="display: grid; gap: 0.35rem; color: #666; font-size: 0.9rem;">
                                            <div><i class="fas fa-cut" style="width: 16px; color: #667eea;"></i> <strong>${a.services?.nome || 'N/A'}</strong> ${a.services?.duracao_minutos ? '• ' + a.services.duracao_minutos + ' min' : ''}</div>
                                            ${a.servicos_adicionais?.nome ? `<div><i class="fas fa-plus" style="width: 16px; color: #ff9800;"></i> <strong>${a.servicos_adicionais.nome}</strong> ${a.servicos_adicionais.preco ? '• ' + formatMoney(a.servicos_adicionais.preco) : ''} ${a.servicos_adicionais.duracao_minutos ? '• ' + a.servicos_adicionais.duracao_minutos + ' min' : ''}</div>` : ''}
                                            ${a.professionals?.nome ? `<div><i class="fas fa-user" style="width: 16px; color: #667eea;"></i> ${a.professionals.nome}</div>` : ''}
                                            ${a.cliente_whatsapp ? `<div><i class="fas fa-phone" style="width: 16px; color: #667eea;"></i> ${formatPhone(a.cliente_whatsapp)}</div>` : ''}
                                        </div>
                                    </div>
                                    <div style="text-align: right; min-width: 140px;">
                                        <div style="font-size: 1.4rem; font-weight: bold; color: #4CAF50; margin-bottom: 0.75rem;">
                                            ${formatMoney((a.services?.preco || 0) + (a.servicos_adicionais?.preco || 0))}
                                        </div>
                                        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                            ${a.cliente_whatsapp ? `
                                                <a href="https://wa.me/55${a.cliente_whatsapp.replace(/\D/g, '')}" target="_blank" style="padding: 0.5rem 0.75rem; background: #25D366; color: white; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; display: flex; align-items: center;">
                                                    <i class="fab fa-whatsapp" style="font-size: 1.1rem;"></i>
                                                </a>
                                            ` : ''}
                                            ${a.status !== 'concluido' ? `
                                                <button onclick="AgendaPage.concluirAgendamento('${a.id}')" style="padding: 0.5rem 0.75rem; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                            ` : ''}
                                            <button onclick="AgendaPage.editAgendamento('${a.id}')" style="padding: 0.5rem 0.75rem; background: #1a1a1a; color: white; border: none; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#333'" onmouseout="this.style.background='#1a1a1a'">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button onclick="AgendaPage.deleteAgendamento('${a.id}')" style="padding: 0.5rem 0.75rem; background: #1a1a1a; color: white; border: none; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#333'" onmouseout="this.style.background='#1a1a1a'">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div style="text-align: center; padding: 4rem 2rem; color: #999;">
                    <i class="fas fa-calendar-times" style="font-size: 4rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.1rem; margin: 0;">Nenhum agendamento encontrado</p>
                    <button onclick="AgendaPage.openModal()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Criar Agendamento
                    </button>
                </div>
            `}
        `;
    },
    
    async loadData() {
        const user = Auth.getUser();
        console.log('👤 Usuário:', user);
        
        try {
            // Carregar agendamentos com joins específicos
            const { data: apts, error: aptsError } = await window.supabase
                .from('appointments')
                .select(`
                    *,
                    professionals(nome, id),
                    service_id(id, nome, preco, duracao_minutos),
                    servico_adicional(id, nome, preco, duracao_minutos)
                `)
                .eq('tenant_id', user.id)
                .order('data_agendamento', { ascending: true })
                .order('hora_inicio', { ascending: true });
            
            if (aptsError) {
                console.error('❌ Erro ao carregar agendamentos:', aptsError);
            } else {
                console.log('✅ Agendamentos carregados:', apts);
                // Mapear service_id para services para compatibilidade com o template
                this.agendamentos = (apts || []).map(a => ({
                    ...a,
                    services: a.service_id,
                    servicos_adicionais: a.servico_adicional
                }));
            }
            
            // Carregar profissionais
            const { data: profs } = await window.supabase
                .from('professionals')
                .select('*')
                .eq('tenant_id', user.id)
                .eq('ativo', true);
            this.profissionais = profs || [];
            
            // Carregar serviços
            const { data: svcs } = await window.supabase
                .from('services')
                .select('*')
                .eq('tenant_id', user.id)
                .eq('ativo', true);
            this.servicos = svcs || [];
            
        } catch (error) {
            console.error('❌ Erro geral ao carregar dados:', error);
        }
    },
    
    getAgendamentosFiltrados() {
        const filtrados = this.agendamentos.filter(a => {
            const matchData = !this.filtroData || a.data_agendamento === this.filtroData;
            const matchProf = !this.filtroProfissional || this.filtroProfissional === '' || this.filtroProfissional === 'todos' || a.professional_id === this.filtroProfissional;
            const matchStatus = !this.filtroStatus || this.filtroStatus === '' || this.filtroStatus === 'todos' || a.status === this.filtroStatus;
            return matchData && matchProf && matchStatus;
        });
        
        console.log('🔍 Agendamentos filtrados:', filtrados.length, 'de', this.agendamentos.length, 'filtroProfissional:', this.filtroProfissional, 'filtroStatus:', this.filtroStatus);
        return filtrados;
    },
    
    getHTML() {
        const agendamentosFiltrados = this.getAgendamentosFiltrados();
        const hoje = new Date().toISOString().split('T')[0];
        
        return `
            <!-- Header com Resumo -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 12px; color: white; margin-bottom: 1.5rem;">
                <h1 style="margin: 0 0 1rem 0; font-size: 2rem;">📅 Agenda</h1>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                    <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold;" id="total-dia">0</div>
                        <div style="font-size: 0.9rem; opacity: 0.9;">Hoje</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold;" id="confirmados-dia">0</div>
                        <div style="font-size: 0.9rem; opacity: 0.9;">Confirmados</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold;" id="pendentes-dia">0</div>
                        <div style="font-size: 0.9rem; opacity: 0.9;">Pendentes</div>
                    </div>
                </div>
            </div>

            <!-- Filtros -->
            <div class="card" style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">📅 Data</label>
                        <input type="date" id="filtro-data" value="${this.filtroData}" style="width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">👤 Profissional</label>
                        <select id="filtro-profissional" style="width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px;">
                            <option value="todos">Todos</option>
                            ${this.profissionais.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">🏷️ Status</label>
                        <select id="filtro-status" style="width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px;">
                            <option value="todos">Todos</option>
                            <option value="pendente">Pendente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="concluido">Concluído</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                    <div style="display: flex; align-items: flex-end;">
                        <button onclick="AgendaPage.openModal()" style="width: 100%; padding: 0.75rem; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                            <i class="fas fa-plus"></i> Novo
                        </button>
                    </div>
                </div>
                
                <!-- Navegação Rápida -->
                <div style="display: flex; gap: 0.5rem; justify-content: center; padding-top: 1rem; border-top: 1px solid #e0e0e0;">
                    <button onclick="AgendaPage.anteriorDia()" style="padding: 0.5rem 1rem; background: #f5f5f5; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-chevron-left"></i> Anterior
                    </button>
                    <button onclick="AgendaPage.hoje()" style="padding: 0.5rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        Hoje
                    </button>
                    <button onclick="AgendaPage.proximoDia()" style="padding: 0.5rem 1rem; background: #f5f5f5; border: none; border-radius: 6px; cursor: pointer;">
                        Próximo <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            <!-- Timeline -->
            <div class="card" style="background: white; padding: 1.5rem; border-radius: 12px;" id="timeline-container">
            </div>
            
            <!-- Modal -->
            ${this.getModalHTML()}
        `;
    },
    
    getModalHTML() {
        return `
            <div id="modal-agendamento" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; align-items: center; justify-content: center; padding: 1rem;">
                <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;">
                    <h2 style="margin: 0 0 1.5rem 0;" id="modal-title">Novo Agendamento</h2>
                    <form id="form-agendamento">
                        <input type="hidden" id="agendamento-id">
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Nome *</label>
                            <input type="text" id="cliente-nome" required style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">WhatsApp</label>
                            <input type="tel" id="cliente-whatsapp" maxlength="11" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Profissional *</label>
                                <select id="professional-id" required style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                                    <option value="">Selecione</option>
                                    ${this.profissionais.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Serviço *</label>
                                <select id="service-id" required style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                                    <option value="">Selecione</option>
                                    ${this.servicos.map(s => `<option value="${s.id}">${s.nome} - ${formatMoney(s.preco)}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Serviço Adicional</label>
                            <select id="servico-adicional" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                                <option value="">Nenhum</option>
                                ${this.servicos.map(s => `<option value="${s.id}">${s.nome} - ${formatMoney(s.preco)}</option>`).join('')}
                            </select>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Data *</label>
                                <input type="date" id="data" required value="${this.filtroData}" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Horário *</label>
                                <input type="time" id="hora-inicio" required style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Status *</label>
                                <select id="status" required style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                                    <option value="pendente">Pendente</option>
                                    <option value="confirmado">Confirmado</option>
                                    <option value="concluido">Concluído</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                            <button type="button" onclick="AgendaPage.closeModal()" style="padding: 0.75rem 1.5rem; background: #999; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Cancelar</button>
                            <button type="submit" style="padding: 0.75rem 1.5rem; background: #4CAF50; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },
    
    formatarDataLonga(data) {
        const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const d = new Date(data + 'T00:00:00');
        return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;
    },
    
    getStatusColor(status) {
        return { pendente: '#FFC107', confirmado: '#4CAF50', concluido: '#2196F3', cancelado: '#f44336' }[status] || '#999';
    },
    
    updateResumo() {
        const dataAtual = this.filtroData || new Date().toISOString().split('T')[0];
        const apts = this.agendamentos.filter(a => a.data_agendamento === dataAtual);
        
        document.getElementById('total-dia').textContent = apts.length;
        document.getElementById('confirmados-dia').textContent = apts.filter(a => a.status === 'confirmado').length;
        document.getElementById('pendentes-dia').textContent = apts.filter(a => a.status === 'pendente').length;
    },
    
    attachEvents() {
        document.getElementById('filtro-data')?.addEventListener('change', (e) => {
            this.filtroData = e.target.value;
            this.updateResumo();
            this.renderTimeline();
        });
        
        document.getElementById('filtro-profissional')?.addEventListener('change', (e) => {
            this.filtroProfissional = e.target.value;
            this.updateResumo();
            this.renderTimeline();
        });
        
        document.getElementById('filtro-status')?.addEventListener('change', (e) => {
            this.filtroStatus = e.target.value;
            this.updateResumo();
            this.renderTimeline();
        });
        
        document.getElementById('form-agendamento')?.addEventListener('submit', (e) => this.handleSubmit(e));
        
        
        document.getElementById('customer-id')?.addEventListener('change', (e) => {
            const cliente = this.clientes.find(c => c.id === e.target.value);
            if (cliente) {
                document.getElementById('cliente-nome').value = cliente.nome;
                document.getElementById('cliente-whatsapp').value = cliente.whatsapp || '';
            }
        });
    },
    
    hoje() {
        this.filtroData = new Date().toISOString().split('T')[0];
        document.getElementById('filtro-data').value = this.filtroData;
        this.render();
    },
    
    anteriorDia() {
        const d = new Date(this.filtroData + 'T00:00:00');
        d.setDate(d.getDate() - 1);
        this.filtroData = d.toISOString().split('T')[0];
        document.getElementById('filtro-data').value = this.filtroData;
        this.render();
    },
    
    proximoDia() {
        const d = new Date(this.filtroData + 'T00:00:00');
        d.setDate(d.getDate() + 1);
        this.filtroData = d.toISOString().split('T')[0];
        document.getElementById('filtro-data').value = this.filtroData;
        this.render();
    },
    
    openModal() {
        document.getElementById('modal-title').textContent = 'Novo Agendamento';
        document.getElementById('agendamento-id').value = '';
        document.getElementById('form-agendamento').reset();
        document.getElementById('data').value = this.filtroData;
        document.getElementById('modal-agendamento').style.display = 'flex';
    },
    
    async editAgendamento(id) {
        const a = this.agendamentos.find(x => x.id === id);
        if (!a) return;
        
        document.getElementById('modal-title').textContent = 'Editar Agendamento';
        document.getElementById('agendamento-id').value = id;
        document.getElementById('cliente-nome').value = a.cliente_nome || a.nome_cliente || '';
        document.getElementById('cliente-whatsapp').value = a.cliente_whatsapp || a.whatsapp || '';
        document.getElementById('professional-id').value = a.professional_id || '';
        document.getElementById('service-id').value = a.services?.id || '';
        document.getElementById('data').value = a.data_agendamento;
        document.getElementById('hora-inicio').value = a.hora_inicio?.substring(0, 5) || a.hora_inicio;
        document.getElementById('servico-adicional').value = a.servicos_adicionais?.id || '';
        document.getElementById('status').value = a.status || 'pendente';
        document.getElementById('modal-agendamento').style.display = 'flex';
    },
    
    closeModal() {
        document.getElementById('modal-agendamento').style.display = 'none';
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        const user = Auth.getUser();
        const id = document.getElementById('agendamento-id').value;
        
        // Carregar dados dos serviços
        const serviceId = document.getElementById('service-id').value;
        const servicoAdicionalId = document.getElementById('servico-adicional').value;
        
        const service = this.servicos.find(s => s.id === serviceId);
        const servicoAdicional = servicoAdicionalId ? this.servicos.find(s => s.id === servicoAdicionalId) : null;
        
        // Calcular duração TOTAL (serviço principal + serviço adicional)
        const duraçãoTotal = (service?.duracao_minutos || 30) + (servicoAdicional?.duracao_minutos || 0);
        
        const horaInicio = document.getElementById('hora-inicio').value;
        const [hours, minutes] = horaInicio.split(':').map(Number);
        const startTime = new Date();
        startTime.setHours(hours, minutes, 0);
        const endTime = new Date(startTime.getTime() + duraçãoTotal * 60000);
        const horaFim = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
        
        // Calcular valor TOTAL (serviço principal + serviço adicional)
        const valorTotal = (service?.preco || 0) + (servicoAdicional?.preco || 0);
        
        const data = {
            tenant_id: user.id,
            cliente_nome: document.getElementById('cliente-nome').value,
            nome_cliente: document.getElementById('cliente-nome').value,
            cliente_whatsapp: document.getElementById('cliente-whatsapp').value || null,
            whatsapp_cliente: document.getElementById('cliente-whatsapp').value || null,
            cliente_email: document.getElementById('cliente-email')?.value || null,
            email_cliente: document.getElementById('cliente-email')?.value || null,
            cliente_observacoes: document.getElementById('cliente-observacoes')?.value || null,
            professional_id: document.getElementById('professional-id').value || null,
            service_id: document.getElementById('service-id').value || null,
            servico_adicional: document.getElementById('servico-adicional').value || null,
            data_agendamento: document.getElementById('data').value,
            hora_inicio: document.getElementById('hora-inicio').value,
            hora_fim: horaFim,
            status: document.getElementById('status').value,
            valor_servico: valorTotal,
            duracao_minutos: duraçãoTotal
        };
        
        try {
            if (id) {
                const { error } = await window.supabase.from('appointments').update(data).eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await window.supabase.from('appointments').insert(data);
                if (error) throw error;
            }
            this.closeModal();
            await this.loadData();
            this.render();
            this.showSuccessModal(id ? '✅ Agendamento atualizado!' : '✅ Agendamento criado!');
        } catch (error) {
            console.error('❌ Erro ao salvar:', error);
            this.showErrorModal('❌ Erro: ' + error.message);
        }
    },
    
    async concluirAgendamento(id) {
        this.showConfirmModal('Marcar como concluído?', async () => {
            try {
                await window.supabase.from('appointments').update({ status: 'concluido' }).eq('id', id);
                this.showSuccessModal('✅ Agendamento concluído com sucesso!', () => {
                    this.loadData().then(() => this.render());
                });
            } catch (error) {
                this.showErrorModal('❌ Erro: ' + error.message);
            }
        });
    },
    
    async deleteAgendamento(id) {
        this.showConfirmModal('Tem certeza que deseja excluir este agendamento?', async () => {
            try {
                await window.supabase.from('appointments').delete().eq('id', id);
                this.showSuccessModal('✅ Agendamento excluído com sucesso!', () => {
                    this.loadData().then(() => this.render());
                });
            } catch (error) {
                this.showErrorModal('❌ Erro: ' + error.message);
            }
        });
    },
    
    showConfirmModal(message, onConfirm) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem;">${message}</h3>
                <div style="display: flex; gap: 1rem;">
                    <button id="btn-confirm" style="flex: 1; padding: 0.75rem; background: #f44336; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Confirmar</button>
                    <button id="btn-cancel" style="flex: 1; padding: 0.75rem; background: #999; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('btn-confirm').onclick = () => {
            modal.remove();
            onConfirm();
        };
        document.getElementById('btn-cancel').onclick = () => modal.remove();
    },
    
    showSuccessModal(message, callback) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: #4CAF50; margin-bottom: 1rem;"></i>
                <p style="margin: 0 0 1.5rem 0; font-size: 1.1rem;">${message}</p>
                <button id="btn-ok" style="width: 100%; padding: 0.75rem; background: #4CAF50; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('btn-ok').onclick = () => {
            modal.remove();
            if (callback) callback();
        };
    },
    
    showErrorModal(message) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #f44336; margin-bottom: 1rem;"></i>
                <p style="margin: 0 0 1.5rem 0; font-size: 1.1rem;">${message}</p>
                <button id="btn-ok" style="width: 100%; padding: 0.75rem; background: #f44336; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('btn-ok').onclick = () => modal.remove();
    }
};
