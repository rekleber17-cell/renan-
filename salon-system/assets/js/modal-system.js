// Sistema de Modais Personalizado
const ModalSystem = {
    // Modal de Sucesso
    showSuccess(message, title = 'Sucesso!') {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: slideDown 0.3s ease;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: #333;">${title}</h3>
                <p style="margin: 0 0 1.5rem 0; color: #666; font-size: 1rem;">${message}</p>
                <button onclick="this.closest('div').parentElement.remove()" style="padding: 0.75rem 2rem; background: #4CAF50; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // Modal de Erro
    showError(message, title = 'Erro!') {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: slideDown 0.3s ease;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: #c62828;">${title}</h3>
                <p style="margin: 0 0 1.5rem 0; color: #666; font-size: 1rem;">${message}</p>
                <button onclick="this.closest('div').parentElement.remove()" style="padding: 0.75rem 2rem; background: #f44336; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // Modal de Aviso
    showWarning(message, title = 'Aviso!') {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: slideDown 0.3s ease;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: #f57f17;">${title}</h3>
                <p style="margin: 0 0 1.5rem 0; color: #666; font-size: 1rem;">${message}</p>
                <button onclick="this.closest('div').parentElement.remove()" style="padding: 0.75rem 2rem; background: #FF9800; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // Modal de Confirmação
    showConfirm(message, onConfirm, onCancel = null, title = 'Confirmação') {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: slideDown 0.3s ease;">
                <div style="font-size: 2.5rem; margin-bottom: 1rem;">❓</div>
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: #333;">${title}</h3>
                <p style="margin: 0 0 1.5rem 0; color: #666; font-size: 1rem;">${message}</p>
                <div style="display: flex; gap: 1rem;">
                    <button id="btn-cancel-confirm" style="flex: 1; padding: 0.75rem; background: #999; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Cancelar</button>
                    <button id="btn-confirm-confirm" style="flex: 1; padding: 0.75rem; background: #4CAF50; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Confirmar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('btn-confirm-confirm').onclick = () => {
            modal.remove();
            onConfirm();
        };
        document.getElementById('btn-cancel-confirm').onclick = () => {
            modal.remove();
            if (onCancel) onCancel();
        };
    },

    // Modal de Informação
    showInfo(message, title = 'Informação') {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: slideDown 0.3s ease;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">ℹ️</div>
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: #333;">${title}</h3>
                <p style="margin: 0 0 1.5rem 0; color: #666; font-size: 1rem;">${message}</p>
                <button onclick="this.closest('div').parentElement.remove()" style="padding: 0.75rem 2rem; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

// Adicionar animações CSS
const styleModal = document.createElement('style');
styleModal.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(styleModal);
