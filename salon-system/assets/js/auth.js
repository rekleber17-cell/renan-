const Auth = {
    getUser() {
        const userStr = localStorage.getItem('salon_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    setUser(user) {
        localStorage.setItem('salon_user', JSON.stringify(user));
    },

    async login(email, password) {
        try {
            console.log('🔐 Tentando login com:', email);
            
            // 1. Fazer login no Supabase
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (authError) {
                console.error('❌ Erro de autenticação:', authError);
                throw new Error(authError.message);
            }

            console.log('✅ Autenticação OK, user_id:', authData.user.id);

            // 2. Buscar tenant
            const { data: tenantData, error: tenantError } = await supabase
                .from('tenants')
                .select('*')
                .eq('user_id', authData.user.id)
                .single();

            if (tenantError) {
                console.error('❌ Erro ao buscar tenant:', tenantError);
                
                // Se não encontrou, tentar criar
                console.log('🔄 Tentando criar tenant automaticamente...');
                const { data: newTenant, error: createError } = await supabase
                    .from('tenants')
                    .insert({
                        user_id: authData.user.id,
                        nome_salao: 'Meu Salão',
                        whatsapp: '',
                        endereco: ''
                    })
                    .select()
                    .single();

                if (createError) {
                    console.error('❌ Erro ao criar tenant:', createError);
                    throw new Error('Tenant não encontrado e não foi possível criar. Execute o migrations.sql');
                }

                console.log('✅ Tenant criado:', newTenant);
                this.setUser(newTenant);
                window.location.href = 'index.html';
                return;
            }

            console.log('✅ Tenant encontrado:', tenantData);
            this.setUser(tenantData);
            window.location.href = 'index.html';

        } catch (error) {
            console.error('❌ Erro no login:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('salon_user');
        supabase.auth.signOut();
        window.location.href = 'login.html';
    },

    checkAuth() {
        const user = this.getUser();
        if (!user && !window.location.pathname.includes('login.html')) {
            console.log('⚠️ Usuário não autenticado, redirecionando...');
            window.location.href = 'login.html';
            return null;
        }
        return user;
    }
};

// Só verificar auth se não estiver na página de login
if (typeof window !== 'undefined' && !window.location.pathname.includes('login.html')) {
    Auth.checkAuth();
}
