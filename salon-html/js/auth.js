// Sistema de Autenticação
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session && !window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
    window.location.href = 'index.html'
    return null
  }
  
  return session
}

async function getTenant(userId) {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('Erro ao buscar tenant:', error)
    return null
  }
  
  return data
}

async function logout() {
  await supabase.auth.signOut()
  window.location.href = 'index.html'
}

// Salvar tenant no localStorage para acesso rápido
async function loadTenantData() {
  const session = await checkAuth()
  if (!session) return null
  
  const tenant = await getTenant(session.user.id)
  if (tenant) {
    localStorage.setItem('tenant', JSON.stringify(tenant))
  }
  
  return tenant
}

function getCurrentTenant() {
  const tenantStr = localStorage.getItem('tenant')
  return tenantStr ? JSON.parse(tenantStr) : null
}

// Formatar valores
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR')
}

function formatTime(time) {
  return time.substring(0, 5)
}

const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
