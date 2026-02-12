// Configuração do Supabase
const SUPABASE_URL = 'https://kxdmigytkedpahccfraa.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZG1pZ3l0a2VkcGFoY2NmcmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDkxMjAsImV4cCI6MjA4MzcyNTEyMH0.-QQCRguA4oPqM3p4Mpq7JB8XEmhdj5VlT62K_TS2q4o'

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

// Variáveis globais
let tenant = null
let currentSession = null

// Funções auxiliares
async function checkAuth() {
    try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Sessão:', session)
        
        if (!session) {
            console.log('Sem sessão, redirecionando para login')
            window.location.href = 'index.html'
            return null
        }
        currentSession = session
        return session
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        window.location.href = 'index.html'
        return null
    }
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
    tenant = data
    return data
}

function logout() {
    supabase.auth.signOut()
    window.location.href = 'index.html'
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
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
