// assets/js/notifications.js
// Sistema de Notificações para Técnicos

class NotificationSystem {
    constructor() {
        this.lastCheck = null;
        this.checkInterval = 30000; // 30 segundos
        this.notificationSound = null;
        this.intervalId = null;
        this.isEnabled = false;
    }

    // Inicializar sistema de notificações
    async init() {
        console.log('🔔 Inicializando sistema de notificações...');
        
        const user = Auth.getUser();
        if (!user || user.tipo !== 'tecnico') {
            console.log('❌ Notificações desabilitadas: usuário não é técnico');
            return;
        }

        // Solicitar permissão para notificações do navegador
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }

        // Criar áudio para notificação
        this.notificationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2a77OmdTgwOUKXh8bllHgU7k9nxy3ksBS11x+/gjkULFFy36PCrVhQLTKPj8cdyIwUsg8/x14w2CBxpu+rqnE0MDlCl4O+4ZB0FO5PY8cx6KwYtdcfu34xGCxNbt+jvq1YUC0uj4/DHciMFLIPO8diJNgcdaLvq6pxNDA5Qpd/vtmQeBTuS1/HLei0FLXfH79+MRgoTWrfo76xVFAtLo+Pwx3IkBS+Dzs/XizUIG2i76umaTgwOUKXf77dlHwU7ktfxy3otBi13xu7gi0cLE1u36O+sVBULS6Lj8MdxJAYug8/P2Io1Chtou+rpm04NDlCl3+62ZR8FOpPX8cx5LQYtd8bu4YtGChNbt+jvq1UUC0yi5PDHcSQGLoLP0NiKNQobZ7zp6ppODA5Qpd/vtmUfBTqT1/HMeS0GLXfG7uCMRwoSWrfo76tWFAtMoOPwx3EkBi6Bz8/YijQKG2i76umaTgwOT6bf77VnHwU6k9jxzHksBix3xu3hjEYLElq35++rVRQLTKHi8MZxJQYtgc/P2IkzChtou+romE0MDlCl3+61Zx8FOZPY8ct5LQUtdsbu4IxGCxJZt+fvq1YVC0uh4/DEcSUGLoHP0NiJMwgaZ7zp6ZhOCw5Qpd7utmYfBTmT2PHLeSwGLXfG7d+MRgoSWrfm76tWFAtLoe'PWxHElBi6Bz9DYiTIIG2e86OmYTgsOUKXe7rZmHgU5k9fxynosBS12xe3fi0YKElm35++pVhQLS6Hj8MRxJQYugc/Q2IgyCBtnvejomE4LDlCl3u62Zh4FOZLb8cpzKwUtdsXt34tGChJat+fvqVYUC0uh4/DEcSUFLoPP0NiIMggbZ73o6JhOCw1QpN7utmYeBTqR2/HKcioFLXbG7N+LRgkSWbfm76lWFApMoeP');

        // Iniciar verificação periódica
        this.startChecking();
        this.isEnabled = true;
        
        console.log('✅ Sistema de notificações inicializado');
    }

    // Iniciar verificação periódica
    startChecking() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        // Primeira verificação imediata
        this.checkNewOrders();

        // Verificações periódicas
        this.intervalId = setInterval(() => {
            this.checkNewOrders();
        }, this.checkInterval);
    }

    // Parar verificação
    stopChecking() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isEnabled = false;
    }

    // Verificar novas OSs
    async checkNewOrders() {
        if (!this.isEnabled) {
            console.log('🔔 Notificações desabilitadas');
            return;
        }

        const user = Auth.getUser();
        if (!user || user.tipo !== 'tecnico') {
            console.log('🔔 Usuário não é técnico');
            return;
        }

        try {
            const hoje = new Date().toISOString().split('T')[0];
            
            console.log('🔔 Verificando novas OSs para:', user.nome);
            
            // Buscar OSs em rota do técnico
            const { data, error } = await db.client
                .from('ordens_servico')
                .select('*')
                .eq('tecnico', user.nome)
                .eq('status', 'EM ROTA')
                .gte('data', hoje);

            if (error) {
                console.error('❌ Erro ao verificar novas OSs:', error);
                return;
            }

            console.log(`🔔 OSs encontradas: ${data.length}`);

            // Se é a primeira verificação, apenas armazenar o estado
            if (!this.lastCheck) {
                this.lastCheck = {
                    count: data.length,
                    ids: data.map(os => os.id),
                    timestamp: Date.now()
                };
                console.log('🔔 Primeira verificação, salvando estado inicial');
                return;
            }

            // Verificar se há novas OSs (IDs que não existiam antes)
            const currentIds = data.map(os => os.id);
            const newOrderIds = currentIds.filter(id => !this.lastCheck.ids.includes(id));

            console.log(`🔔 IDs anteriores: [${this.lastCheck.ids.join(', ')}]`);
            console.log(`🔔 IDs atuais: [${currentIds.join(', ')}]`);
            console.log(`🔔 Novos IDs: [${newOrderIds.join(', ')}]`);

            if (newOrderIds.length > 0) {
                console.log(`✅ ${newOrderIds.length} nova(s) OS(s) detectada(s)!`);
                
                // Buscar dados completos das novas OSs
                const newOrders = data.filter(os => newOrderIds.includes(os.id));
                
                // Mostrar notificação para cada nova OS
                newOrders.forEach(os => {
                    console.log('📢 Notificando OS:', os.ordem_servico);
                    this.showNotification(os);
                });

                // Tocar som de notificação
                this.playSound();
            } else {
                console.log('⚪ Nenhuma OS nova detectada');
            }

            // Atualizar última verificação
            this.lastCheck = {
                count: data.length,
                ids: currentIds,
                timestamp: Date.now()
            };

        } catch (error) {
            console.error('❌ Erro ao verificar OSs:', error);
        }
    }

    // Mostrar notificação
    showNotification(os) {
        const title = '🔔 Nova OS Recebida!';
        const body = `OS #${os.ordem_servico}\n${os.nome}\n${os.servico_executar || 'Serviço'}`;

        // Notificação do navegador
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: '/assets/img/logo.png',
                badge: '/assets/img/logo.png',
                tag: `os-${os.id}`,
                requireInteraction: true
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }

        // Notificação visual no sistema
        this.showInAppNotification(os);
    }

    // Notificação visual no app
    showInAppNotification(os) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #E57373 0%, #EF5350 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 350px;
            animation: slideIn 0.3s ease;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: start; gap: 1rem;">
                <div style="font-size: 2rem;">🔔</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">
                        Nova OS Recebida!
                    </div>
                    <div style="font-size: 0.9rem; opacity: 0.95; margin-bottom: 0.25rem;">
                        <strong>OS:</strong> ${os.ordem_servico}
                    </div>
                    <div style="font-size: 0.9rem; opacity: 0.95; margin-bottom: 0.25rem;">
                        <strong>Cliente:</strong> ${os.nome}
                    </div>
                    <div style="font-size: 0.9rem; opacity: 0.95;">
                        <strong>Serviço:</strong> ${os.servico_executar || 'Não especificado'}
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0; line-height: 1;">
                    ×
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Remover após 10 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 10000);
    }

    // Tocar som de notificação
    playSound() {
        if (this.notificationSound) {
            this.notificationSound.play().catch(err => {
                console.log('Não foi possível tocar o som:', err);
            });
        }
    }

    // Método de teste (manual)
    testNotification() {
        const testOS = {
            id: 999999,
            ordem_servico: 'OS-TEST-001',
            nome: 'Cliente Teste',
            servico_executar: 'TESTE DE NOTIFICAÇÃO'
        };
        
        console.log('🧪 Testando notificação...');
        this.showNotification(testOS);
        this.playSound();
    }
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Criar instância global
window.notifications = new NotificationSystem();
