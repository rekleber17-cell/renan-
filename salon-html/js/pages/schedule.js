class SchedulePage extends Page {
  constructor() {
    super('schedule')
    this.appointments = []
    this.customers = []
    this.professionals = []
    this.services = []
  }

  getHTML() {
    return `
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">Agenda</h1>
          <button onclick="schedulePage.showForm()" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Novo Agendamento
          </button>
        </div>

        <!-- Modal Form -->
        <div id="scheduleModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div class="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h2 class="text-2xl font-bold mb-4">Novo Agendamento</h2>
            <form id="scheduleForm" onsubmit="schedulePage.handleFormSubmit(event)">
              
              <div class="mb-4">
                <label class="block text-gray-700 font-bold mb-2">Nome do Cliente *</label>
                <input type="text" id="cliente_nome" class="border rounded w-full py-2 px-3" required>
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 font-bold mb-2">WhatsApp</label>
                <input type="text" id="cliente_whatsapp" class="border rounded w-full py-2 px-3" placeholder="11999999999">
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 font-bold mb-2">Email</label>
                <input type="email" id="cliente_email" class="border rounded w-full py-2 px-3">
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 font-bold mb-2">Profissional *</label>
                <select id="professional_id" class="border rounded w-full py-2 px-3" required>
                  <option value="">Selecione um profissional</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 font-bold mb-2">Serviço *</label>
                <select id="service_id" class="border rounded w-full py-2 px-3" required>
                  <option value="">Selecione um serviço</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 font-bold mb-2">Data *</label>
                <input type="date" id="data_agendamento" class="border rounded w-full py-2 px-3" required>
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 font-bold mb-2">Hora *</label>
                <input type="time" id="hora_inicio" class="border rounded w-full py-2 px-3" required>
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 font-bold mb-2">Status</label>
                <select id="status" class="border rounded w-full py-2 px-3">
                  <option value="confirmado">Confirmado</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div class="flex gap-2">
                <button type="submit" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex-1">
                  Salvar
                </button>
                <button type="button" onclick="schedulePage.closeForm()" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex-1">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Appointments List -->
        <div class="bg-white rounded-lg shadow">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-200">
                <th class="p-3 text-left">Cliente</th>
                <th class="p-3 text-left">Profissional</th>
                <th class="p-3 text-left">Serviço</th>
                <th class="p-3 text-left">Data/Hora</th>
                <th class="p-3 text-left">Status</th>
                <th class="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody id="appointmentsContainer">
              <!-- Appointments will be inserted here -->
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  showForm() {
    document.getElementById('scheduleModal').classList.remove('hidden')
    this.loadFormOptions()
  }

  closeForm() {
    document.getElementById('scheduleModal').classList.add('hidden')
    document.getElementById('scheduleForm').reset()
  }

  async loadFormOptions() {
    try {
      // Load professionals
      const { data: profs } = await supabase
        .from('professionals')
        .select('id, nome')
        .eq('tenant_id', tenant.id)
        .eq('ativo', true)

      const profSelect = document.getElementById('professional_id')
      profSelect.innerHTML = '<option value="">Selecione um profissional</option>'
      profs?.forEach(p => {
        const option = document.createElement('option')
        option.value = p.id
        option.textContent = p.nome
        profSelect.appendChild(option)
      })

      // Load services
      const { data: svcs } = await supabase
        .from('services')
        .select('id, nome, preco')
        .eq('tenant_id', tenant.id)
        .eq('ativo', true)

      const svcSelect = document.getElementById('service_id')
      svcSelect.innerHTML = '<option value="">Selecione um serviço</option>'
      svcs?.forEach(s => {
        const option = document.createElement('option')
        option.value = s.id
        option.textContent = `${s.nome} - R$ ${s.preco}`
        svcSelect.appendChild(option)
      })
    } catch (error) {
      console.error('Erro ao carregar opções do formulário:', error)
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault()

    try {
      const clienteNome = document.getElementById('cliente_nome').value
      const clienteWhatsapp = document.getElementById('cliente_whatsapp').value
      const clienteEmail = document.getElementById('cliente_email').value
      const professionalId = document.getElementById('professional_id').value
      const serviceId = document.getElementById('service_id').value
      const dataAgendamento = document.getElementById('data_agendamento').value
      const horaInicio = document.getElementById('hora_inicio').value
      const status = document.getElementById('status').value

      // 1. Check if customer exists by whatsapp
      let cliente = null
      if (clienteWhatsapp) {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('*')
          .eq('whatsapp', clienteWhatsapp)
          .eq('tenant_id', tenant.id)
          .single()

        if (existingCustomer) {
          cliente = existingCustomer
        }
      }

      // 2. Create customer if doesn't exist
      if (!cliente) {
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert({
            tenant_id: tenant.id,
            nome: clienteNome,
            whatsapp: clienteWhatsapp || null,
            email: clienteEmail || null,
            total_agendamentos: 0,
            total_cancelamentos: 0,
            total_gasto: 0
          })
          .select()
          .single()

        if (createError) throw createError
        cliente = newCustomer
      }

      // 3. Get service price for appointment
      const { data: service } = await supabase
        .from('services')
        .select('preco')
        .eq('id', serviceId)
        .single()

      // 4. Create appointment
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          tenant_id: tenant.id,
          professional_id: professionalId,
          service_id: serviceId,
          cliente_nome: clienteNome,
          cliente_email: clienteEmail,
          cliente_whatsapp: clienteWhatsapp,
          cliente_observacoes: '',
          data_agendamento: dataAgendamento,
          hora_inicio: horaInicio,
          valor_servico: service?.preco || 0,
          status: status,
          notificacao_enviada: false,
          lembrete_enviado: false
        })

      if (appointmentError) throw appointmentError

      // 5. Update customer metrics
      const novoTotal = (cliente.total_agendamentos || 0) + 1
      await supabase
        .from('customers')
        .update({
          total_agendamentos: novoTotal,
          ultimo_agendamento: new Date().toISOString()
        })
        .eq('id', cliente.id)

      alert('Agendamento criado com sucesso!')
      this.closeForm()
      await this.loadSchedules()
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      alert('Erro ao criar agendamento: ' + error.message)
    }
  }

  async loadSchedules() {
    try {
      // Load appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select(`
          id,
          cliente_nome,
          professional_id,
          service_id,
          data_agendamento,
          hora_inicio,
          status,
          professionals(nome),
          services(nome)
        `)
        .eq('tenant_id', tenant.id)
        .order('data_agendamento', { ascending: false })

      this.appointments = appointments || []
      this.renderAppointments()
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
    }
  }

  renderAppointments() {
    const container = document.getElementById('appointmentsContainer')
    if (!container) return

    container.innerHTML = this.appointments.map((apt, idx) => `
      <tr class="border-b hover:bg-gray-100">
        <td class="p-3">${apt.cliente_nome}</td>
        <td class="p-3">${apt.professionals?.nome || 'N/A'}</td>
        <td class="p-3">${apt.services?.nome || 'N/A'}</td>
        <td class="p-3">${new Date(apt.data_agendamento).toLocaleDateString()} ${apt.hora_inicio}</td>
        <td class="p-3">
          <span class="px-3 py-1 rounded text-white text-sm ${
            apt.status === 'confirmado' ? 'bg-green-500' :
            apt.status === 'pendente' ? 'bg-yellow-500' :
            'bg-red-500'
          }">
            ${apt.status}
          </span>
        </td>
        <td class="p-3 text-center">
          <button onclick="schedulePage.editSchedule('${apt.id}')" class="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
          <button onclick="schedulePage.deleteSchedule('${apt.id}')" class="text-red-500 hover:text-red-700">Deletar</button>
        </td>
      </tr>
    `).join('')
  }

  editSchedule(id) {
    alert('Editar agendamento: ' + id)
  }

  deleteSchedule(id) {
    if (confirm('Tem certeza que deseja deletar este agendamento?')) {
      alert('Deletar agendamento: ' + id)
    }
  }

  async attachListeners() {
    await this.loadSchedules()
  }
}

const schedulePage = new SchedulePage()
