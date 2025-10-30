# EsToDoList - Gerenciador de Tarefas

![EsToDoList](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue)
![Tecnologias](https://img.shields.io/badge/Tecnologias-HTML%2C%20CSS%2C%20JavaScript-yellow)

Um aplicativo web elegante e responsivo para gerenciamento de tarefas, desenvolvido com foco em usabilidade e design moderno.

## 📋 Sobre o Projeto

O **EsToDoList** é um gerenciador de tarefas que permite aos usuários criar, organizar e acompanhar suas atividades diárias de forma eficiente. Com interface intuitiva e recursos de filtragem avançada, é a ferramenta ideal para aumentar a produtividade.

## ✨ Funcionalidades

- ✅ **Criação de Tarefas** - Adicione novas tarefas rapidamente
- 🏷️ **Categorização** - Organize por Pessoal, Trabalho, Estudo ou Saúde
- 🎯 **Prioridades** - Defina níveis de prioridade (Alta, Média, Baixa)
- 📅 **Prazos** - Estabeleça datas de vencimento
- 🔍 **Filtros Avançados** - Filtre por status e categoria
- 📊 **Progresso Visual** - Acompanhe seu progresso com barras e estatísticas
- 📱 **Design Responsivo** - Funciona perfeitamente em desktop e mobile
- 🎨 **Interface Moderna** - Design clean com paleta de cores Índigo

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização avançada com variáveis CSS
- **Tailwind CSS** - Framework CSS utilitário
- **JavaScript** - Interatividade e lógica da aplicação
- **Google Fonts** - Tipografia Inter

## 🎨 Paleta de Cores

| Cor | Código | Uso |
|-----|--------|-----|
| Índigo | `#4f46e5` | Cor primária, botões, elementos de destaque |
| Slate 50 | `#f8fafc` | Cor de fundo principal |
| Branco | `#ffffff` | Sidebar, cards, modal |
| Vermelho | `#ef4444` | Prioridade Alta |
| Âmbar | `#f59e0b` | Prioridade Média |
| Azul | `#3b82f6` | Prioridade Baixa |

## 📁 Estrutura do Projeto

```
estodolist/
│
├── index.html              # Arquivo principal
├── static/
│   └── js/
│       └── script.js       # Lógica da aplicação
└── README.md              # Documentação
```

## 🚀 Como Usar

### 1. Adicionar Tarefas
- Use o campo de entrada no cabeçalho
- Digite o título da tarefa e clique em "Adicionar"
- Para mais detalhes, edite a tarefa após criação

### 2. Editar Tarefas
- Clique em qualquer tarefa para abrir o modal de edição
- Modifique título, prazo, prioridade ou categoria
- Salve as alterações

### 3. Filtrar Tarefas
- **Status**: Todas, Pendentes ou Concluídas
- **Categorias**: Pessoal, Trabalho, Estudo, Saúde

### 4. Marcar como Concluída
- Clique no checkbox ao lado do título da tarefa
- Tarefas concluídas aparecem com estilo diferenciado

## 📱 Layout Responsivo

- **Desktop**: Sidebar fixa à esquerda com conteúdo principal
- **Mobile**: Menu hamburguer com sidebar deslizante
- **Tablet**: Layout adaptativo com otimizações de toque

## 🔧 Funcionalidades Técnicas

### Sistema de Filtros
```javascript
// Filtro por status
filterByStatus('all')     // Todas as tarefas
filterByStatus('pending') // Apenas pendentes
filterByStatus('completed') // Apenas concluídas

// Filtro por categoria
filterByCategory('all')   // Todas categorias
filterByCategory('Trabalho') // Apenas trabalho
```

### Sistema de Prioridades
- **Alta** (`high`): Borda vermelha, ícone de fogo (🔥)
- **Média** (`medium`): Borda âmbar, ícone de alerta (⚠️)
- **Baixa** (`low`): Borda azul, ícone de seta (⬇️)

### Persistência de Dados
- Utiliza `localStorage` do navegador
- Dados mantidos entre sessões
- Sincronização automática

## 🎯 Próximas Funcionalidades

- [ ] Sincronização com nuvem
- [ ] Lembretes por notificação
- [ ] Exportação de relatórios
- [ ] Modo escuro
- [ ] Compartilhamento de listas
- [ ] Subtarefas e checklists

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvido por Guilherme

**EsToDoList Team**  
*Organizando seu dia, uma tarefa de cada vez*

---

<div align="center">
  
**⭐️ Se este projeto te ajudou, deixe uma estrela! ⭐️**

</div>