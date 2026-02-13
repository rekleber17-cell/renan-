const DashboardPage = {
    async render() {
        const user = Auth.getUser();
        const hoje = new Date().toISOString().split('T')[0];
        
        const { data: agendamentos } = await supabase
            .from('appointments')
            .select('*, professionals(nome), services(nome, preco)')
            .eq('tenant_id', user.id)
            .gte('data', hoje)
            .order('data', { ascending: true })
            .limit(5);

        const { count: totalAgendamentos } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', user.id);

        const { count: totalProfissionais } = await supabase
            .from('professionals')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', user.id);

        const { count: totalClientes } = await supabase
            .from('customers')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', user.id);

        const { count: totalServicos } = await supabase
            .from('services')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', user.id);

        const html = `
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h3 style="font-size: 2rem; margin: 0;">${totalAgendamentos || 0}</h3>
                            <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Agendamentos</p>
                        </div>
                        <i class="fas fa-calendar-alt" style="font-size: 3rem; opacity: 0.3;"></i>
                    </div>
                </div>

                <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h3 style="font-size: 2rem; margin: 0;">${totalProfissionais || 0}</h3>
                            <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Profissionais</p>
                        </div>
                        <i class="fas fa-users" style="font-size: 3rem; opacity: 0.3;"></i>
                    </div>
                </div>

                <div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h3 style="font-size: 2rem; margin: 0;">${totalClientes || 0}</h3>
                            <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Clientes</p>
                        </div>
                        <i class="fas fa-user-friends" style="font-size: 3rem; opacity: 0.3;"></i>
                    </div>
                </div>

                <div class="stat-card" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h3 style="font-size: 2rem; margin: 0;">${totalServicos || 0}</h3>
                            <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Serviços</p>
                        </div>
                        <i class="fas fa-cut" style="font-size: 3rem; opacity: 0.3;"></i>
                    </div>
                </div>
            </div>

            <div class="card" style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="margin: 0 0 1.5rem 0; font-size: 1.25rem; color: #333;">
                    <i class="fas fa-calendar-check" style="color: #667eea;"></i> Próximos Agendamentos
                </h2>
                ${agendamentos && agendamentos.length > 0 ? `
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        ${agendamentos.map(a => `
                            <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea;">
                                <div style="display: flex; justify-content: space-between; align-items: start;">
                                    <div>
                                        <strong style="color: #333;">${a.cliente_nome || a.nome_cliente}</strong>
                                        <p style="margin: 0.25rem 0; color: #666; font-size: 0.9rem;">
                                            ${a.services?.nome || 'Serviço'} - ${a.professionals?.nome || 'Profissional'}
                                        </p>
                                        <p style="margin: 0.25rem 0; color: #999; font-size: 0.85rem;">
                                            <i class="fas fa-calendar"></i> ${formatDate(a.data)} às ${a.hora_inicio}
                                        </p>
                                    </div>
                                    <div style="text-align: right;">
                                        <strong style="color: #667eea; font-size: 1.1rem;">${formatMoney(a.services?.preco || 0)}</strong>
                                        <p style="margin: 0.25rem 0; font-size: 0.85rem;">
                                            <span style="padding: 0.25rem 0.5rem; background: ${a.status === 'confirmado' ? '#4CAF50' : '#FFC107'}; color: white; border-radius: 4px; font-size: 0.75rem;">
                                                ${a.status || 'Pendente'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p style="text-align: center; color: #999; padding: 2rem;">Nenhum agendamento próximo</p>'}
            </div>

            <div style="margin-top: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 12px; color: white;">
                <h2 style="margin: 0 0 1rem 0;"><i class="fas fa-link"></i> Link de Agendamento Online</h2>
                <p style="margin: 0 0 1rem 0; opacity: 0.9;">Compartilhe este link com seus clientes para que eles possam agendar online:</p>
                <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; display: flex; align-items: center; gap: 1rem;">
                    <input type="text" id="booking-link" value="${window.location.origin}/agendamento.html?ref=${user.nome_salao?.toLowerCase().replace(/\s+/g,'-')}" readonly style="flex: 1; padding: 0.75rem; border: none; border-radius: 6px; background: white; color: #333;">
                    <button onclick="navigator.clipboard.writeText(document.getElementById('booking-link').value); alert('Link copiado!')" style="padding: 0.75rem 1.5rem; background: white; color: #667eea; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                        <i class="fas fa-copy"></i> Copiar
                    </button>
                </div>
            </div>
        `;

        document.getElementById('content-area').innerHTML = html;
    }
};
