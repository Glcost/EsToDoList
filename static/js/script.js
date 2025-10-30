  let tasks = JSON.parse(localStorage.getItem('auraTaskFlowTasks')) || [];
        let currentStatusFilter = 'all';
        let currentCategoryFilter = 'all';
        let currentSearchTerm = '';

        // --- Mapeamentos de Estilo e Texto ---
        const PRIORITY_COLOR_MAP = {
            'high': 'text-red-500', 
            'medium': 'text-amber-500', 
            'low': 'text-blue-500', 
        };

        const STATUS_FILTER_TITLES = {
            'all': 'Todas as Tarefas',
            'pending': 'Tarefas Pendentes',
            'completed': 'Tarefas Concluídas'
        };

        // --- Funções de Dados ---

        /**
         * Salva o array de tarefas no LocalStorage e atualiza o progresso.
         */
        const saveTasks = () => {
            localStorage.setItem('auraTaskFlowTasks', JSON.stringify(tasks));
            updateProgress();
        };

        /**
         * Atualiza os contadores, a barra de progresso e o título da lista.
         */
        const updateProgress = () => {
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => t.completed).length;
            const pendingTasks = totalTasks - completedTasks;
            const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            // Atualiza barra lateral de progresso
            document.getElementById('progress-summary').textContent = `${completionPercentage}% Concluído`;
            document.getElementById('progress-bar-fill').style.width = `${completionPercentage}%`;
            document.getElementById('progress-detail').textContent = `${pendingTasks} pendente(s) de ${totalTasks} total.`;

            // Atualiza título da lista principal
            let title = STATUS_FILTER_TITLES[currentStatusFilter];
            if (currentCategoryFilter !== 'all') {
                 title += ` em ${currentCategoryFilter}`;
            }
            if (currentSearchTerm) {
                title = `Resultados da Busca: "${currentSearchTerm}"`;
            }
            document.getElementById('list-title').textContent = title;
        };
        
        /**
         * Previne XSS, escapando caracteres HTML.
         */
        const escapeHTML = (str) => {
            const p = document.createElement('p');
            p.appendChild(document.createTextNode(str));
            return p.innerHTML;
        };
        
        // --- Funções de Filtragem e Renderização ---

        /**
         * Filtra por status (all, pending, completed).
         */
        const filterByStatus = (status) => {
            currentStatusFilter = status;
            document.querySelectorAll('#status-filters .filter-group-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-filter-status') === status);
            });
            renderTasks();
            if (window.innerWidth < 1024) closeMobileMenu();
        };
        window.filterByStatus = filterByStatus;

        /**
         * Filtra por categoria (Pessoal, Trabalho, etc.).
         */
        const filterByCategory = (category) => {
            currentCategoryFilter = category;
            document.querySelectorAll('#category-filters .category-filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-filter-category') === category);
            });
            renderTasks();
            if (window.innerWidth < 1024) closeMobileMenu();
        };
        window.filterByCategory = filterByCategory;
        
        /**
         * Atualiza o termo de busca e re-renderiza.
         */
        const updateSearchTerm = (term) => {
            currentSearchTerm = term.toLowerCase().trim();
            renderTasks();
        };
        window.updateSearchTerm = updateSearchTerm;


        /**
         * Renderiza a lista de tarefas, aplicando todos os filtros.
         */
        const renderTasks = () => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            
            let filteredTasks = tasks.filter(task => {
                // 1. Filtro de Status
                const statusMatch = (currentStatusFilter === 'all') || 
                                    (currentStatusFilter === 'pending' && !task.completed) ||
                                    (currentStatusFilter === 'completed' && task.completed);
                
                // 2. Filtro de Categoria
                const categoryMatch = (currentCategoryFilter === 'all') || (task.category === currentCategoryFilter);
                
                // 3. Filtro de Busca
                const searchMatch = !currentSearchTerm || 
                                    task.title.toLowerCase().includes(currentSearchTerm) ||
                                    (task.description && task.description.toLowerCase().includes(currentSearchTerm));
                                    
                return statusMatch && categoryMatch && searchMatch;
            });

            // Ordenação: Pendentes por Prioridade (Alta > Média > Baixa), depois por Prazo. Concluídas por último.
            filteredTasks.sort((a, b) => {
                const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                
                // 1. Concluídas vs. Pendentes (Concluídas por último)
                if (a.completed !== b.completed) return a.completed ? 1 : -1;

                // 2. Prioridade (Decrescente)
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }

                // 3. Prazo (Mais próxima primeiro)
                const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000); 
                const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
                return dateA - dateB; 
            });

            // Exibe mensagem se não houver tarefas
            if (filteredTasks.length === 0) {
                const message = currentSearchTerm 
                    ? `Nenhum resultado para "${currentSearchTerm}".`
                    : `Ótimo! Sua lista de "${document.getElementById('list-title').textContent}" está limpa.`;

                taskList.innerHTML = `
                    <li class="text-center text-gray-500 py-10 rounded-xl mt-4 bg-white border border-dashed border-gray-300 shadow-sm">
                        <p class="font-medium">${message}</p>
                    </li>`;
            }
            
            // Cria elementos da lista
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item p-4 flex items-center justify-between transition-all cursor-pointer ${task.completed ? 'completed' : 'pending'}`;
                li.setAttribute('data-id', task.id);
                li.setAttribute('data-priority', task.priority);
                li.onclick = () => openModal(task.id);

                const priorityColorClass = PRIORITY_COLOR_MAP[task.priority] || 'text-gray-400';
                
                const dueDateText = task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : 'Sem Prazo';
                const isOverdue = task.dueDate && new Date(task.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0) && !task.completed;
                
                const dueDateClass = isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500';

                li.innerHTML = `
                    <div class="flex items-center space-x-3 flex-grow min-w-0">
                        <!-- Checkbox -->
                        <div class="flex-shrink-0">
                            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="event.stopPropagation(); toggleTask(${task.id})"
                                   class="h-5 w-5 rounded-full border-gray-300 ${priorityColorClass} focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors duration-200">
                        </div>
                        
                        <!-- Título e Categoria -->
                        <div class="min-w-0 flex-grow">
                            <p class="task-title text-base font-medium truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}">
                                ${escapeHTML(task.title)}
                            </p>
                            <span class="text-xs text-indigo-600 font-medium bg-indigo-100 px-2 py-0.5 rounded-full">
                                ${task.category}
                            </span>
                        </div>
                    </div>
                    
                    <!-- Metadados e Botões de Ação -->
                    <div class="flex items-center space-x-4 flex-shrink-0 text-sm">
                        
                        <!-- Prazo -->
                        <span class="flex items-center space-x-1 ${dueDateClass}">
                            📅 <span>${dueDateText}</span>
                        </span>

                        <!-- Botão Deletar (Ícone SVG para melhor controle visual) -->
                        <button onclick="event.stopPropagation(); deleteTask(${task.id})" class="text-gray-400 hover:text-red-500 transition duration-300 p-1 rounded-full hover:bg-gray-100" 
                                aria-label="Deletar Tarefa">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                `;
                taskList.appendChild(li);
            });
            
            updateProgress();
        };
        
        // --- Funções de Ação ---

        /**
         * Alterna o status de conclusão de uma tarefa.
         */
        const toggleTask = (id) => {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            }
        };
        window.toggleTask = toggleTask;

        /**
         * Deleta uma tarefa pelo ID.
         */
        const deleteTask = (id) => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        };
        window.deleteTask = deleteTask;

        // --- Lógica do Modal ---
        const modal = document.getElementById('task-modal');
        const modalForm = document.getElementById('modal-form');
        const modalTaskId = document.getElementById('modal-task-id');
        const modalTaskCompleted = document.getElementById('modal-task-completed'); 
        const modalTitleInput = document.getElementById('modal-title-input');
        const modalPriorityInput = document.getElementById('modal-priority');
        const modalCategoryInput = document.getElementById('modal-category');
        const modalDueDateInput = document.getElementById('modal-due-date');
        const modalSubmitBtn = document.getElementById('modal-submit-btn');

        /**
         * Abre o modal no modo Edição.
         */
        const openModal = (taskId) => {
            const task = tasks.find(t => t.id === taskId);
            if (!task) return; 

            modalForm.reset(); // Limpa o formulário

            modalTaskId.value = task.id;
            modalTaskCompleted.value = task.completed;
            modalTitleInput.value = task.title;
            modalPriorityInput.value = task.priority;
            modalCategoryInput.value = task.category;
            modalDueDateInput.value = task.dueDate || ''; // Campo de data HTML aceita string YYYY-MM-DD
            
            modalSubmitBtn.textContent = 'Salvar Alterações';

            modal.classList.add('flex');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; 
            modalTitleInput.focus();
        };
        window.openModal = openModal;

        /**
         * Fecha o modal.
         */
        const closeModal = (event) => {
            if (!event || event.target.id === 'task-modal' || event.target.textContent === 'Cancelar') {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = ''; 
            }
        };
        window.closeModal = closeModal;

        /**
         * Salva alterações da tarefa no modal.
         */
        const saveTaskFromModal = (e) => {
            e.preventDefault();

            const taskId = Number(modalTaskId.value);
            const task = tasks.find(t => t.id === taskId);

            if (task) {
                task.title = modalTitleInput.value.trim();
                task.priority = modalPriorityInput.value;
                task.category = modalCategoryInput.value;
                task.dueDate = modalDueDateInput.value;
                // A conclusão é tratada pelo checkbox principal, mas a data é atualizada aqui.
                
                saveTasks();
                closeModal();
                renderTasks();
            }
        };
        modalForm.addEventListener('submit', saveTaskFromModal);
        
        // --- Lógica de Adição Rápida (Form de Cabeçalho) ---
        
        /**
         * Cria uma nova tarefa a partir do input de cabeçalho.
         */
        const saveTaskFromHeader = (e) => {
            e.preventDefault();
            const input = document.getElementById('task-search-input');
            const newTitle = input.value.trim();

            if (!newTitle) return;

            // Se o usuário está buscando, ele deve usar o filtro. 
            // Se ele pressiona enter, assume-se que ele quer adicionar a tarefa.
            if (currentSearchTerm) {
                // Caso queira adicionar, o termo de busca é o título.
            }
            
            const newTask = {
                id: Date.now(),
                title: newTitle,
                description: '',
                priority: 'medium', // Default
                dueDate: '', // Sem data de vencimento
                category: 'Pessoal', // Default
                completed: false
            };
            
            tasks.unshift(newTask); 
            saveTasks();
            
            // Limpa o campo e o termo de busca
            input.value = '';
            updateSearchTerm(''); 
            
            renderTasks();
        };
        document.getElementById('task-input-form').addEventListener('submit', saveTaskFromHeader);

        // --- Lógica do Menu Mobile ---
        const sidebar = document.getElementById('sidebar');
        const openMobileMenu = () => {
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
            document.body.style.overflow = 'hidden'; 
        };
        const closeMobileMenu = () => {
             sidebar.classList.remove('translate-x-0');
            sidebar.classList.add('-translate-x-full');
            document.body.style.overflow = '';
        };

        document.getElementById('menu-toggle').addEventListener('click', openMobileMenu);
        document.getElementById('close-menu').addEventListener('click', closeMobileMenu);


        // --- Inicialização do Aplicativo ---
        // Adiciona algumas tarefas de exemplo se a lista estiver vazia
        if (tasks.length === 0) {
             tasks.push({ id: 1, title: "Revisar relatório trimestral", description: "Focar em métricas de satisfação do cliente.", priority: "high", dueDate: "2025-10-17", category: "Trabalho", completed: false });
             tasks.push({ id: 2, title: "Agendar exame médico", description: "", priority: "medium", dueDate: "2025-10-25", category: "Saúde", completed: false });
             tasks.push({ id: 3, title: "Pagar conta de luz", description: "Data limite é hoje.", priority: "high", dueDate: new Date().toISOString().slice(0, 10), category: "Pessoal", completed: false });
             tasks.push({ id: 4, title: "Ler capítulo 5 do livro de React", description: "", priority: "low", dueDate: "2025-11-01", category: "Estudo", completed: false });
             tasks.push({ id: 5, title: "Comprar ingredientes para o jantar", description: "Frango e brócolis", priority: "medium", dueDate: new Date().toISOString().slice(0, 10), category: "Pessoal", completed: true }); // Concluída de exemplo
             saveTasks();
        }

        updateProgress();
        renderTasks();