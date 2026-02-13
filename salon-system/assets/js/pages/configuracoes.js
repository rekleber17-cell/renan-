const ConfiguracoesPage = {
    tenant: null,
    originalSlug: '',

    async render() {
        const user = Auth.getUser();
        
        document.getElementById('content-area').innerHTML = `
            <div style="background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <!-- Formulário de Configurações -->
                <div class="p-6 border-b border-gray-200">
                    <h3 style="font-size: 1.125rem; font-weight: 600; color: #111827;">Informações Básicas</h3>
                </div>
                <form id="configForm" style="padding: 1.5rem; space-y: 1.5rem;">
                    <!-- Nome do Salão -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Nome do Salão *</label>
                        <input type="text" id="nome_salao" required style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;" placeholder="Ex: Meu Salão de Beleza">
                    </div>

                    <!-- Slug (URL) -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">
                            Slug (URL de Agendamento) *
                            <span style="font-size: 0.75rem; color: #6b7280; font-weight: 400; margin-left: 0.5rem;">Apenas letras minúsculas, números e hífens</span>
                        </label>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="font-size: 0.875rem; color: #4b5563;">/agendamento.html?slug=</span>
                            <input type="text" id="slug" required pattern="[a-z0-9-]+" style="flex: 1; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;" placeholder="seu-salao">
                        </div>
                        <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;" id="slugWarning"></p>
                    </div>

                    <!-- Foto de Perfil -->
                    <div style="border-top: 1px solid #d1d5db; padding-top: 1.5rem; margin-top: 1.5rem;">
                        <h3 style="font-size: 1rem; font-weight: 600; color: #111827; margin-bottom: 1rem;">Imagem de Perfil</h3>
                        <p style="font-size: 0.875rem; color: #4b5563; margin-bottom: 1rem;">Esta imagem aparecerá no topo da página de agendamento. Recomendamos uma imagem quadrada (ex: 300x300px)</p>

                        <div style="display: flex; align-items: flex-start; gap: 1.5rem;">
                            <!-- Preview da Imagem -->
                            <div style="position: relative; flex-shrink: 0;">
                                <div id="coverPreviewContainer" style="display: none;">
                                    <img id="coverPreview" src="" alt="Preview da foto de perfil" style="width: 150px; height: 150px; object-fit: cover; border-radius: 0.5rem; border: 2px solid #d1d5db;">
                                </div>

                                <!-- Placeholder -->
                                <div id="coverPlaceholder" style="width: 150px; height: 150px; border: 2px dashed #d1d5db; border-radius: 0.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f9fafb; cursor: pointer; transition: all 0.3s;" onclick="document.getElementById('coverInput').click()">
                                    <svg style="width: 3rem; height: 3rem; color: #9ca3af; margin-bottom: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <p style="color: #4b5563; font-weight: 500; font-size: 0.75rem; text-align: center;">Clique para adicionar</p>
                                </div>
                            </div>

                            <!-- Input de Arquivo (oculto) -->
                            <input type="file" id="coverInput" accept="image/jpeg,image/png,image/webp" style="display: none;">

                            <!-- Botões de Ação -->
                            <div id="coverActions" style="display: none; flex-direction: column; gap: 0.75rem; margin-top: 0.25rem;">
                                <button type="button" onclick="document.getElementById('coverInput').click()" style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: white; color: #374151; font-weight: 500; cursor: pointer; white-space: nowrap;">
                                    ➕ Adicionar
                                </button>
                                <button type="button" id="saveCoverBtn" onclick="ConfiguracoesPage.saveCoverOnly()" style="padding: 0.5rem 1rem; background: #059669; color: white; border-radius: 0.5rem; font-weight: 500; border: none; cursor: pointer; white-space: nowrap; display: none;">
                                    💾 Salvar
                                </button>
                                <button type="button" onclick="ConfiguracoesPage.removeCoverImage()" style="padding: 0.5rem 1rem; background: #fee2e2; color: #991b1b; border-radius: 0.5rem; font-weight: 500; border: none; cursor: pointer; white-space: nowrap;">
                                    🗑️ Excluir
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Contatos -->
                    <div style="border-top: 1px solid #d1d5db; padding-top: 1.5rem; margin-top: 1.5rem;">
                        <h3 style="font-size: 1rem; font-weight: 600; color: #111827; margin-bottom: 1rem;">Informações de Contato</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <!-- Telefone -->
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Telefone</label>
                                <input type="tel" id="telefone" style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;">
                            </div>

                            <!-- WhatsApp -->
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">WhatsApp</label>
                                <input type="tel" id="whatsapp" style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;">
                            </div>

                            <!-- Email -->
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Email</label>
                                <input type="email" id="email" style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;">
                            </div>

                            <!-- CEP -->
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">CEP</label>
                                <input type="text" id="cep" maxlength="9" placeholder="00000-000" style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;">
                            </div>
                        </div>
                    </div>

                    <!-- Endereço -->
                    <div style="border-top: 1px solid #d1d5db; padding-top: 1.5rem; margin-top: 1.5rem;">
                        <h3 style="font-size: 1rem; font-weight: 600; color: #111827; margin-bottom: 1rem;">Endereço</h3>
                        <div style="space-y: 1rem;">
                            <div style="margin-bottom: 1rem;">
                                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Logradouro</label>
                                <input type="text" id="endereco" placeholder="Rua, Avenida, etc" style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;">
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                                <!-- Número -->
                                <div>
                                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Número</label>
                                    <input type="text" id="numero" placeholder="123" style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;">
                                </div>

                                <!-- Complemento -->
                                <div>
                                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Complemento</label>
                                    <input type="text" id="complemento" placeholder="Apto, Sala, etc" style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;">
                                </div>

                                <!-- Bairro -->
                                <div>
                                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Bairro</label>
                                    <input type="text" id="bairro" style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;">
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <!-- Cidade -->
                                <div>
                                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Cidade</label>
                                    <input type="text" id="cidade" style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;">
                                </div>

                                <!-- Estado -->
                                <div>
                                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Estado</label>
                                    <select id="estado" style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;">
                                        <option value="">Selecione</option>
                                        <option value="AC">Acre</option>
                                        <option value="AL">Alagoas</option>
                                        <option value="AP">Amapá</option>
                                        <option value="AM">Amazonas</option>
                                        <option value="BA">Bahia</option>
                                        <option value="CE">Ceará</option>
                                        <option value="DF">Distrito Federal</option>
                                        <option value="ES">Espírito Santo</option>
                                        <option value="GO">Goiás</option>
                                        <option value="MA">Maranhão</option>
                                        <option value="MT">Mato Grosso</option>
                                        <option value="MS">Mato Grosso do Sul</option>
                                        <option value="MG">Minas Gerais</option>
                                        <option value="PA">Pará</option>
                                        <option value="PB">Paraíba</option>
                                        <option value="PR">Paraná</option>
                                        <option value="PE">Pernambuco</option>
                                        <option value="PI">Piauí</option>
                                        <option value="RJ">Rio de Janeiro</option>
                                        <option value="RN">Rio Grande do Norte</option>
                                        <option value="RS">Rio Grande do Sul</option>
                                        <option value="RO">Rondônia</option>
                                        <option value="RR">Roraima</option>
                                        <option value="SC">Santa Catarina</option>
                                        <option value="SP">São Paulo</option>
                                        <option value="SE">Sergipe</option>
                                        <option value="TO">Tocantins</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Botão Salvar -->
                    <div style="display: flex; gap: 0.75rem; padding-top: 1rem; margin-top: 1.5rem;">
                        <button type="submit" style="background: #dc2626; color: white; padding: 0.5rem 1.5rem; border-radius: 0.5rem; border: none; font-weight: 500; cursor: pointer; transition: all 0.3s;">
                            💾 Salvar Configurações
                        </button>
                        <button type="button" onclick="ConfiguracoesPage.loadTenantData()" style="background: #d1d5db; color: #374151; padding: 0.5rem 1.5rem; border-radius: 0.5rem; border: none; font-weight: 500; cursor: pointer;">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>

            <!-- Link de Agendamento -->
            <div style="background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-top: 1.5rem;">
                <div style="padding: 1.5rem; border-bottom: 1px solid #d1d5db;">
                    <h3 style="font-size: 1.125rem; font-weight: 600; color: #111827;">Link de Agendamento Público</h3>
                </div>
                <div style="padding: 1.5rem;">
                    <p style="font-size: 0.875rem; color: #4b5563; margin-bottom: 0.75rem;">
                        Compartilhe este link com seus clientes para que eles possam fazer agendamentos online:
                    </p>
                    <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.75rem;">
                        <code style="font-size: 0.875rem; word-break: break-all; flex: 1;" id="publicLink">Carregando...</code>
                        <button onclick="ConfiguracoesPage.copyLink()" style="background: #dc2626; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; font-size: 0.875rem; cursor: pointer; white-space: nowrap;">
                            Copiar
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Carregar dados
        this.tenant = user;
        this.loadTenantData();
        this.setupEventListeners();
    },

    loadTenantData() {
        if (!this.tenant) return;

        document.getElementById('nome_salao').value = this.tenant.nome_salao || '';
        document.getElementById('slug').value = this.tenant.slug || '';
        this.originalSlug = this.tenant.slug || '';
        document.getElementById('telefone').value = this.tenant.telefone || '';
        document.getElementById('whatsapp').value = this.tenant.whatsapp || '';
        document.getElementById('email').value = this.tenant.email || '';
        document.getElementById('cep').value = this.tenant.cep || '';
        document.getElementById('endereco').value = this.tenant.endereco || '';
        document.getElementById('numero').value = this.tenant.numero || '';
        document.getElementById('complemento').value = this.tenant.complemento || '';
        document.getElementById('bairro').value = this.tenant.bairro || '';
        document.getElementById('cidade').value = this.tenant.cidade || '';
        document.getElementById('estado').value = this.tenant.estado || '';

        this.updateCoverPreview();
        this.updatePublicLink();
    },

    updateCoverPreview() {
        const coverPreview = document.getElementById('coverPreview');
        const coverPreviewContainer = document.getElementById('coverPreviewContainer');
        const coverPlaceholder = document.getElementById('coverPlaceholder');
        const coverActions = document.getElementById('coverActions');

        // Se há arquivo novo em preview
        if (window._coverFile && !window._removeCover) {
            coverPreviewContainer.style.display = 'block';
            coverPlaceholder.style.display = 'none';
            coverActions.style.display = 'flex';
            return;
        }

        // Se a imagem foi removida
        if (window._removeCover) {
            coverPreviewContainer.style.display = 'none';
            coverPlaceholder.style.display = 'flex';
            coverActions.style.display = 'none';
            return;
        }

        // Se tem imagem salva no banco
        if (this.tenant?.cover_image) {
            try {
                const { data: urlData } = window.supabase.storage.from('salon-images').getPublicUrl(this.tenant.cover_image);
                const publicUrl = urlData?.publicUrl || '';
                
                if (publicUrl) {
                    coverPreview.src = publicUrl;
                    coverPreviewContainer.style.display = 'block';
                    coverPlaceholder.style.display = 'none';
                    coverActions.style.display = 'flex';
                    return;
                }
            } catch (err) {
                console.error('Erro ao carregar imagem:', err);
            }
        }

        // Se nada, mostrar placeholder
        coverPreviewContainer.style.display = 'none';
        coverPlaceholder.style.display = 'flex';
        coverActions.style.display = 'none';
    },

    removeCoverImage() {
        // Mostrar modal de confirmação
        this.showDeleteConfirmModal(() => {
            const coverPreview = document.getElementById('coverPreview');
            const coverPreviewContainer = document.getElementById('coverPreviewContainer');
            const coverPlaceholder = document.getElementById('coverPlaceholder');
            const coverActions = document.getElementById('coverActions');
            const coverInput = document.getElementById('coverInput');

            coverPreview.src = '';
            coverInput.value = '';
            window._coverFile = null;
            window._removeCover = true;

            coverPreviewContainer.style.display = 'none';
            coverPlaceholder.style.display = 'flex';
            coverActions.style.display = 'none';
        });
    },

    showDeleteConfirmModal(onConfirm) {
        // Criar overlay
        const overlay = document.createElement('div');
        overlay.id = 'deleteModalOverlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;';

        // Criar modal
        const modal = document.createElement('div');
        modal.id = 'deleteModal';
        modal.style.cssText = 'background: white; border-radius: 0.75rem; padding: 2rem; max-width: 400px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); animation: slideUp 0.3s ease-out;';
        modal.innerHTML = `
            <h3 style="font-size: 1.125rem; font-weight: 600; color: #111827; margin: 0 0 0.75rem 0;">Excluir foto de perfil?</h3>
            <p style="color: #6b7280; font-size: 0.875rem; margin: 0 0 1.5rem 0;">Esta ação não pode ser desfeita. Tem certeza que deseja excluir a foto?</p>
            <div style="display: flex; gap: 0.75rem;">
                <button type="button" id="cancelDeleteBtn" style="flex: 1; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: white; color: #374151; font-weight: 500; cursor: pointer;">
                    Cancelar
                </button>
                <button type="button" id="confirmDeleteBtn" style="flex: 1; padding: 0.75rem 1rem; background: #dc2626; color: white; border: none; border-radius: 0.5rem; font-weight: 500; cursor: pointer;">
                    Excluir
                </button>
            </div>
        `;

        // Adicionar animação CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Handlers
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            overlay.remove();
            onConfirm();
        });

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            overlay.remove();
        });

        // Fechar ao clicar no overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    },

    updatePublicLink() {
        const slug = document.getElementById('slug').value || this.tenant.slug;
        const link = `${window.location.origin}/agendamento.html?slug=${slug}`;
        document.getElementById('publicLink').textContent = link;
    },

    copyLink() {
        const link = document.getElementById('publicLink').textContent;
        navigator.clipboard.writeText(link).then(() => {
            ModalSystem.showSuccess('Link copiado para a área de transferência!', 'Sucesso');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            ModalSystem.showError('Erro ao copiar o link', 'Erro');
        });
    },

    setupEventListeners() {
        // Validação do slug
        const slugInput = document.getElementById('slug');
        if (slugInput) {
            slugInput.addEventListener('input', (e) => {
                const slug = e.target.value;
                const validSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');

                if (slug !== validSlug) {
                    e.target.value = validSlug;
                    document.getElementById('slugWarning').textContent = 'Caracteres inválidos foram removidos';
                } else {
                    document.getElementById('slugWarning').textContent = '';
                }

                this.updatePublicLink();
            });
        }

        // Input de cover
        const coverInput = document.getElementById('coverInput');
        if (coverInput) {
            coverInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const allowed = ['image/jpeg', 'image/png', 'image/webp'];
                const maxBytes = 8 * 1024 * 1024;

                if (!allowed.includes(file.type)) {
                    ModalSystem.showWarning('Formato inválido. Use jpg, png ou webp.', 'Aviso');
                    e.target.value = '';
                    return;
                }
                if (file.size > maxBytes) {
                    ModalSystem.showWarning('Arquivo muito grande. Máximo 8 MB.', 'Aviso');
                    e.target.value = '';
                    return;
                }

                const coverPreview = document.getElementById('coverPreview');
                coverPreview.src = URL.createObjectURL(file);
                window._coverFile = file;
                window._removeCover = false;

                this.updateCoverPreview();
                // Mostrar botão de salvar
                document.getElementById('saveCoverBtn').style.display = 'block';
            });
        }

        // Formatação de CEP
        const cepInput = document.getElementById('cep');
        if (cepInput) {
            cepInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 5) {
                    value = value.substring(0, 5) + '-' + value.substring(5, 8);
                }
                e.target.value = value;
            });

            // Buscar endereço por CEP
            cepInput.addEventListener('blur', async (e) => {
                const cep = e.target.value.replace(/\D/g, '');

                if (cep.length === 8) {
                    try {
                        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                        const data = await response.json();

                        if (!data.erro) {
                            document.getElementById('endereco').value = data.logradouro || '';
                            document.getElementById('bairro').value = data.bairro || '';
                            document.getElementById('cidade').value = data.localidade || '';
                            document.getElementById('estado').value = data.uf || '';
                            document.getElementById('numero').focus();
                        }
                    } catch (error) {
                        console.error('Erro ao buscar CEP:', error);
                    }
                }
            });
        }

        // Envio do formulário
        const configForm = document.getElementById('configForm');
        if (configForm) {
            configForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveConfig();
            });
        }
    },

    async saveConfig() {
        const newSlug = document.getElementById('slug').value;

        // Verificar se o slug mudou e se já está em uso
        if (newSlug !== this.originalSlug) {
            const { data: existing } = await window.supabase
                .from('tenants')
                .select('id')
                .eq('slug', newSlug)
                .neq('id', this.tenant.id)
                .single();

            if (existing) {
                ModalSystem.showWarning('Este slug já está em uso. Por favor, escolha outro.', 'Slug Inválido');
                return;
            }
        }

        const data = {
            nome_salao: document.getElementById('nome_salao').value,
            slug: newSlug,
            telefone: document.getElementById('telefone').value || null,
            whatsapp: document.getElementById('whatsapp').value || null,
            email: document.getElementById('email').value || null,
            cep: document.getElementById('cep').value || null,
            endereco: document.getElementById('endereco').value || null,
            numero: document.getElementById('numero').value || null,
            complemento: document.getElementById('complemento').value || null,
            bairro: document.getElementById('bairro').value || null,
            cidade: document.getElementById('cidade').value || null,
            estado: document.getElementById('estado').value || null
        };

        // Se solicitou remover a capa
        if (window._removeCover) {
            data.cover_image = null;
        }

        // Se selecionou nova capa
        const coverFile = window._coverFile;
        if (coverFile && !window._removeCover) {
            try {
                const ext = coverFile.name.split('.').pop();
                const filePath = `tenants/${this.tenant.id}/cover-${Date.now()}.${ext}`;
                
                const { data: uploadData, error: uploadError } = await window.supabase.storage
                    .from('salon-images')
                    .upload(filePath, coverFile, { 
                        upsert: true,
                        contentType: coverFile.type
                    });
                
                if (uploadError) {
                    ModalSystem.showError('Erro ao enviar imagem: ' + uploadError.message, 'Erro');
                    return;
                }
                
                data.cover_image = filePath;
            } catch (err) {
                ModalSystem.showError('Erro ao enviar imagem: ' + err.message, 'Erro');
                return;
            }
        }

        const { error } = await window.supabase
            .from('tenants')
            .update(data)
            .eq('id', this.tenant.id);

        if (error) {
            console.error('❌ Erro ao salvar:', error);
            ModalSystem.showError('Erro ao salvar: ' + error.message, 'Erro');
            return;
        }

        console.log('✅ Configurações salvas com sucesso!');
        ModalSystem.showSuccess('Configurações salvas com sucesso!', 'Sucesso');

        // Atualizar tenant local e localStorage
        this.tenant = { ...this.tenant, ...data };
        Auth.setUser(this.tenant);
        this.originalSlug = newSlug;
        this.updatePublicLink();

        // Limpar flags
        window._coverFile = null;
        window._removeCover = false;
    },

    async saveCoverOnly() {
        const coverFile = window._coverFile;
        if (!coverFile) {
            ModalSystem.showWarning('Nenhuma foto foi selecionada', 'Aviso');
            return;
        }

        try {
            const ext = coverFile.name.split('.').pop();
            const filePath = `tenants/${this.tenant.id}/cover-${Date.now()}.${ext}`;
            
            console.log('📤 Enviando foto para:', filePath);
            
            const { data: uploadData, error: uploadError } = await window.supabase.storage
                .from('salon-images')
                .upload(filePath, coverFile, { 
                    upsert: true,
                    contentType: coverFile.type
                });
            
            if (uploadError) {
                console.error('❌ Erro no upload:', uploadError);
                ModalSystem.showError('Erro ao enviar imagem: ' + uploadError.message, 'Erro');
                return;
            }
            
            console.log('✅ Upload OK');
            
            const { error, data } = await window.supabase
                .from('tenants')
                .update({ cover_image: filePath })
                .eq('id', this.tenant.id)
                .select()
                .single();

            if (error) {
                console.error('❌ Erro ao salvar no BD:', error);
                ModalSystem.showError('Erro ao salvar: ' + error.message, 'Erro');
                return;
            }

            console.log('✅ Foto salva no banco de dados');
            
            this.tenant.cover_image = filePath;
            Auth.setUser(this.tenant);
            
            window._coverFile = null;
            window._removeCover = false;
            
            this.updateCoverPreview();
            
            document.getElementById('saveCoverBtn').style.display = 'none';
            
            ModalSystem.showSuccess('Foto de perfil salva com sucesso!', 'Sucesso');
        } catch (err) {
            console.error('❌ Erro:', err);
            ModalSystem.showError('Erro ao enviar imagem: ' + err.message, 'Erro');
        }
    }
};
