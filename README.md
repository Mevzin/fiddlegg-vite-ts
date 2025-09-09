# FiddleGG - Frontend

🎮 Interface web para consulta de dados de jogadores do League of Legends, conectada à API da Riot Games.

## 📋 Funcionalidades

- **Busca de Jogadores**: Interface para pesquisar por Game Name + Tag Line
- **Perfil do Jogador**: Exibição de informações básicas do summoner
- **Design Responsivo**: Interface adaptável para diferentes dispositivos
- **Navegação SPA**: Single Page Application com React Router
- **UI Moderna**: Estilização com Tailwind CSS

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool e dev server
- **React Router DOM** - Navegação SPA
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP para API
- **React Icons** - Biblioteca de ícones
- **React Toastify** - Notificações toast
- **Debounce** - Otimização de busca

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- NPM ou Yarn
- Backend da API rodando (riot-search-api-ts)

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd fiddlegg-vite-ts
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3333
```

### 4. Execute o projeto

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Acesso

Após iniciar o servidor de desenvolvimento:

```
http://localhost:5173
```

## 📁 Estrutura do Projeto

```
src/
├── Components/           # Componentes reutilizáveis
│   └── WrapperProfile/   # Componente de perfil
├── Models/               # Tipos e interfaces TypeScript
├── Routes/               # Configuração de rotas
│   └── index.tsx
├── Screens/              # Páginas da aplicação
│   ├── Home/            # Página inicial
│   └── League/          # Página de perfil do jogador
├── Service/              # Serviços de API
├── Utils/                # Utilitários e helpers
├── assets/               # Imagens e recursos estáticos
│   └── Images/
├── App.tsx               # Componente principal
├── main.tsx              # Ponto de entrada
└── index.css             # Estilos globais
```

## 🎨 Funcionalidades da Interface

### Página Inicial (`/`)
- Campo de busca para Game Name
- Campo para Tag Line
- Botão de pesquisa
- Design centrado e responsivo

### Página de Perfil (`/league/:gameName/:tagLine`)
- Informações do summoner
- Nível e ícone do perfil
- Dados de ranking
- Histórico de partidas

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build otimizado para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linting do código

## 🌐 Deploy

O projeto está configurado para deploy no Vercel:

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente:
   - `VITE_API_URL`: URL da sua API backend
3. O arquivo `vercel.json` já está configurado

## 🎯 Próximas Funcionalidades

- [ ] Histórico detalhado de partidas
- [ ] Gráficos de performance
- [ ] Comparação entre jogadores
- [ ] Modo escuro/claro
- [ ] Favoritos de jogadores
- [ ] Cache local de dados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Thiago Torres de Souza**
- Email: thiagomev@gmail.com

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

## 🔗 Links Relacionados

- [Backend API](../riot-search-api-ts/README.md)
- [Riot Developer Portal](https://developer.riotgames.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
