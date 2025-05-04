# ApenDriver Backend

Backend para o ApenDriver - Sistema de armazenamento e streaming de mídia.

## Requisitos

- Node.js (v14+)
- MongoDB
- NPM ou Yarn

## Instalação

1. Clone o repositório
2. Navegue até a pasta do backend: `cd backend`
3. Instale as dependências: `npm install` ou `yarn install`
4. Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente
5. Inicie o servidor: `npm run dev` ou `yarn dev`

## Variáveis de Ambiente

- `NODE_ENV`: Ambiente de execução (development, production)
- `PORT`: Porta em que o servidor será executado
- `MONGO_URI`: URI de conexão com o MongoDB
- `JWT_SECRET`: Chave secreta para assinatura de tokens JWT
- `JWT_EXPIRE`: Tempo de expiração dos tokens JWT

## Endpoints da API

### Autenticação

- `POST /api/auth/register`: Registrar um novo usuário
- `POST /api/auth/login`: Fazer login
- `GET /api/auth/me`: Obter informações do usuário autenticado
- `GET /api/auth/logout`: Fazer logout

### Arquivos

- `POST /api/files/upload`: Fazer upload de um arquivo
- `GET /api/files`: Obter todos os arquivos do usuário
- `GET /api/files/:id`: Obter arquivo por ID
- `GET /api/files/:id/download`: Baixar arquivo
- `DELETE /api/files/:id`: Excluir arquivo
- `GET /api/files/stats`: Obter estatísticas de armazenamento

### Áudio

- `GET /api/audio`: Obter todos os arquivos de áudio
- `GET /api/audio/:id`: Obter arquivo de áudio por ID
- `GET /api/audio/:id/stream`: Reproduzir arquivo de áudio

### Vídeo

- `GET /api/video`: Obter todos os arquivos de vídeo
- `GET /api/video/:id`: Obter arquivo de vídeo por ID
- `GET /api/video/:id/stream`: Reproduzir arquivo de vídeo

### Imagens

- `GET /api/images`: Obter todos os arquivos de imagem
- `GET /api/images/:id`: Obter arquivo de imagem por ID
- `GET /api/images/:id/view`: Visualizar arquivo de imagem

## Licença

MIT
```

### Instruções Finais para Execução

Para executar o backend completo, siga estas etapas:

1. Certifique-se de ter o MongoDB instalado e em execução.

2. Crie um arquivo `.env` na pasta `backend` com base no exemplo fornecido.

3. Instale as dependências:

```bash
cd backend
npm install
```

4. Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
