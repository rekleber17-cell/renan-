// Configuração Supabase
window.SUPABASE_URL = 'https://kxdmigytkedpahccfraa.supabase.co';
window.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZG1pZ3l0a2VkcGFoY2NmcmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDkxMjAsImV4cCI6MjA4MzcyNTEyMH0.-QQCRguA4oPqM3p4Mpq7JB8XEmhdj5VlT62K_TS2q4o';

// Criar cliente Supabase
window.supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);

console.log('✅ Supabase configurado:', window.SUPABASE_URL);

// Funções auxiliares globais
window.formatMoney = function(value) {
    if (!value && value !== 0) return 'R$ 0,00';
    return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

window.formatDate = function(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
};

window.formatPhone = function(phone) {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    }
    return phone;
};
