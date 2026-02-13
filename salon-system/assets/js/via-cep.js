// assets/js/via-cep.js

async function buscarCEP(cep, campoPrefix = '') {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
        showAlert('CEP deve conter 8 dígitos', 'warning');
        return;
    }

    showLoading('Buscando endereço...');

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        hideLoading();

        if (data.erro) {
            showAlert('CEP não encontrado', 'error');
            return;
        }

        // Preencher campos
        const enderecoInput = document.getElementById(campoPrefix + 'endereco');
        const bairroInput = document.getElementById(campoPrefix + 'bairro');
        const cidadeInput = document.getElementById(campoPrefix + 'cidade');
        const ufInput = document.getElementById(campoPrefix + 'uf');

        if (enderecoInput) enderecoInput.value = data.logradouro || '';
        if (bairroInput) bairroInput.value = data.bairro || '';
        if (cidadeInput) cidadeInput.value = data.localidade || '';
        if (ufInput) ufInput.value = data.uf || '';

        // Focar no campo número se todos os dados foram preenchidos
        if (data.logradouro) {
            const numeroInput = document.getElementById(campoPrefix + 'numero');
            if (numeroInput) numeroInput.focus();
        }

        showAlert('Endereço encontrado!', 'success');
    } catch (error) {
        hideLoading();
        showAlert('Erro ao buscar CEP. Verifique sua conexão.', 'error');
        console.error('Erro ViaCEP:', error);
    }
}

// Formatação automática de CEP enquanto digita
function formatarCEP(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    
    input.value = value;
}

// Adicionar listeners automáticos para campos de CEP quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    // Buscar CEP ao sair do campo
    const cepInputs = document.querySelectorAll('input[name="cep"], input[id*="cep"]');
    cepInputs.forEach(input => {
        // Formatação ao digitar
        input.addEventListener('input', (e) => {
            formatarCEP(e.target);
        });

        // Buscar ao sair do campo
        input.addEventListener('blur', () => {
            if (input.value && input.value.replace(/\D/g, '').length === 8) {
                const prefix = input.id.replace('cep', '');
                buscarCEP(input.value, prefix);
            }
        });

        // Buscar ao pressionar Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (input.value && input.value.replace(/\D/g, '').length === 8) {
                    const prefix = input.id.replace('cep', '');
                    buscarCEP(input.value, prefix);
                }
            }
        });
    });
});

// Máscaras para outros campos
function aplicarMascaras() {
    // Máscara de telefone
    const telefoneInputs = document.querySelectorAll('input[name="celular"], input[name="fixo"], input[id*="telefone"], input[id*="celular"]');
    telefoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 10) {
                // Telefone fixo: (00) 0000-0000
                value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
            } else {
                // Celular: (00) 00000-0000
                value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            }
            
            e.target.value = value;
        });
    });

    // Máscara de CPF
    const cpfInputs = document.querySelectorAll('input[name="cpf"], input[id*="cpf"]');
    cpfInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
            e.target.value = value;
        });
    });
}

// Aplicar máscaras quando o DOM carregar
document.addEventListener('DOMContentLoaded', aplicarMascaras);

// Função para ser chamada após criar elementos dinamicamente
window.reaplicarMascaras = aplicarMascaras;
