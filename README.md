# 🔊 GLB Audio Description

Componente de áudio descrição para matérias do O Globo, permitindo leitura de texto em voz alta usando a Web Speech API.

## 📋 Índice

-   [Visão Geral](#-visão-geral)
-   [Recursos](#-recursos)
-   [Instalação](#-instalação)
-   [Uso Básico](#-uso-básico)
-   [API](#-api)
-   [Configuração](#-configuração)
-   [Testes](#-testes)
-   [Suporte de Navegadores](#-suporte-de-navegadores)
-   [Contribuição](#-contribuição)

## 🎯 Visão Geral

O GLB Audio Description é um componente TypeScript que implementa funcionalidades de síntese de voz para tornar o conteúdo das matérias do O Globo mais acessível. Utiliza a Web Speech API nativa do navegador para converter texto em fala, permitindo que usuários ouçam o conteúdo das páginas.

### Características Principais

-   ✅ **Síntese de voz nativa** usando Web Speech API
-   ✅ **Suporte a múltiplas vozes** em português brasileiro
-   ✅ **Controles de reprodução** completos (play, pause, resume, stop)
-   ✅ **Leitura sequencial** de múltiplos elementos
-   ✅ **Configuração flexível** de velocidade, tom e volume
-   ✅ **Tratamento robusto de erros**
-   ✅ **TypeScript** com tipagem completa
-   ✅ **Cobertura de testes** abrangente (97 testes)

## 🚀 Recursos

### Funcionalidades de Áudio

-   **Síntese de texto em voz** com vozes em português brasileiro
-   **Controles de reprodução**: play, pause, resume, stop
-   **Configuração de parâmetros**: velocidade (rate), tom (pitch), volume
-   **Seleção de vozes** disponíveis no sistema
-   **Leitura sequencial** de múltiplos elementos da página

### Acessibilidade

-   **Compatibilidade com leitores de tela**
-   **Navegação por teclado**
-   **Feedback sonoro** para interações
-   **Suporte a diferentes dispositivos**

## 📦 Instalação

### Pré-requisitos

-   Node.js 16+
-   npm ou pnpm
-   Navegador com suporte à Web Speech API

### Instalação das Dependências

```bash
# Usando pnpm
pnpm install

# Usando npm
npm install
```

### Build do Projeto

```bash
# Desenvolvimento
pnpm dev

# Build para produção
pnpm build
```

## 💻 Uso Básico

### Importação

```typescript
import { TextReader } from './glb-audio-description/SpeechSynthesisUtterance';
```

### Exemplo Básico

```typescript
// Criar instância do TextReader
const audioDescription = new TextReader({
    voice: 'Google português do Brasil',
    rate: 1.2,
    volume: 1.0,
    lang: 'pt-BR',
});

// Inicializar
audioDescription.init(() => {
    console.log('Audio Description iniciado!');

    // Ler conteúdo da matéria
    audioDescription.readTextFromSelector(['h1.title', '.article-content p']);
});

// Controles de reprodução
audioDescription.play(); // Iniciar reprodução
audioDescription.pause(); // Pausar
audioDescription.resume(); // Retomar
audioDescription.stop(); // Parar
```

### Integração em Páginas de Matéria

Para integrar o componente de áudio descrição em uma página de matéria do O Globo, siga estes passos:

#### 1. Adicionar o Container HTML

Adicione um elemento com a classe `glb-audio-description` onde você deseja que o componente apareça:

```html
<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Matéria - O Globo</title>
    </head>
    <body>
        <article class="materia">
            <h1 class="title">Título da Matéria</h1>

            <h2 class="subtitle">Subtítulo da matéria</h2>

            <div class="content">
                <p>Primeiro parágrafo da matéria...</p>
                <p>Segundo parágrafo da matéria...</p>
                <p>Terceiro parágrafo da matéria...</p>
            </div>

            <!-- Container do componente de áudio descrição -->
            <div class="glb-audio-description"></div>
        </article>

        <!-- Script do componente -->
        <script type="module" src="/src/main.ts"></script>
    </body>
</html>
```

#### 2. Configuração Automática

O script em `main.ts` irá automaticamente:

-   🔍 **Detectar** todos os elementos com classe `glb-audio-description`
-   🎛️ **Gerar** os controles de play/pause e stop dentro do container
-   ⚙️ **Configurar** os event listeners para os botões
-   📖 **Definir** quais elementos serão lidos (título, subtítulo, conteúdo)

#### 3. Estrutura Gerada Automaticamente

O componente irá gerar esta estrutura HTML dentro do container:

```html
<div class="glb-audio-description is-not-played">
    <button class="glb-audio-description__button glb-audio-description__play">
        <i class="glb-audio-description__play-icon" data-lucide="play"></i>
        <i class="glb-audio-description__pause-icon" data-lucide="pause"></i>
    </button>
    <button class="glb-audio-description__button glb-audio-description__stop">
        <i class="glb-audio-description__stop-icon" data-lucide="square"></i>
    </button>
</div>
```

#### 4. Customização de Seletores

Para personalizar quais elementos serão lidos, edite a variável `containersToRead` em `main.ts`:

```typescript
// Configuração padrão
const containersToRead = ['.title', '.subtitle', '.content'];

// Exemplo para estrutura específica do O Globo
const containersToRead = ['h1.materia-titulo', '.materia-subtitulo', '.materia-lead', '.materia-texto p'];
```

#### 5. Estados do Componente

O componente possui diferentes estados visuais:

-   **`is-not-played`** - Estado inicial, ainda não foi reproduzido
-   **`is-playing`** - Reproduzindo conteúdo
-   **`is-paused`** - Pausado
-   **`is-stopped`** - Parado

#### 6. Configuração Personalizada

Para ajustar configurações como velocidade e volume, edite o objeto `config` em `main.ts`:

```typescript
const config: TextReaderOptions = {
    voice: 'Google português do Brasil',
    pitch: 0.8, // Tom de voz
    volume: 1, // Volume
    rate: 1.0, // Velocidade
    lang: 'pt-BR', // Idioma
};
```

## 📚 API

### Constructor

```typescript
new TextReader(options?: TextReaderOptions)
```

#### TextReaderOptions

```typescript
interface TextReaderOptions {
    voice?: 'Google português do Brasil' | 'Microsoft Daniel - Portuguese (Brazil)';
    lang?: string; // Código do idioma (default: 'pt-BR')
    rate?: number; // Velocidade: 0.1 - 10 (default: 1.2)
    pitch?: number; // Tom: 0 - 2 (default: 1)
    volume?: number; // Volume: 0 - 1 (default: 1)
}
```

### Métodos Principais

#### `init(callback: () => void): void`

Inicializa o componente e carrega as vozes disponíveis.

#### `readTextFromSelector(selectors: string[]): void`

Lê texto dos elementos especificados pelos seletores CSS.

#### `play(channel?: 'play' | 'resume'): void`

Inicia ou retoma a reprodução.

#### `pause(): void`

Pausa a reprodução atual.

#### `resume(): void`

Retoma a reprodução pausada.

#### `stop(): void`

Para completamente a reprodução.

### Métodos de Configuração

#### `setVoiceByName(name: string): void`

Define a voz por nome.

#### `setRate(rate: number): void`

Define a velocidade de fala (0.1 - 10).

#### `setPitch(pitch: number): void`

Define o tom de voz (0 - 2).

#### `setVolume(volume: number): void`

Define o volume (0 - 1).

#### `setLang(lang: string): void`

Define o idioma.

#### `listVoices(): SpeechSynthesisVoice[]`

Retorna lista de vozes disponíveis.

## ⚙️ Configuração

### Configurações Padrão

```typescript
const defaultOptions = {
    voice: 'Google português do Brasil',
    lang: 'pt-BR',
    rate: 1.2,
    pitch: 1.0,
    volume: 1.0,
};
```

### Configuração para O Globo

```typescript
// Configuração recomendada para matérias do O Globo
const globoAudioConfig = {
    voice: 'Google português do Brasil',
    lang: 'pt-BR',
    rate: 1.0, // Velocidade natural
    pitch: 1.0, // Tom neutro
    volume: 0.8, // Volume confortável
};

// Seletores típicos para matérias do O Globo
const globoSelectors = ['h1.titulo-materia', '.subtitulo-materia', '.texto-materia p', '.lead-materia'];
```

## 🧪 Testes

O projeto possui uma suíte de testes abrangente com **97 testes** cobrindo todos os aspectos do componente.

### Executar Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Executar testes com UI
pnpm test:ui

# Executar testes uma vez
pnpm test:run
```

### Cobertura de Testes

-   ✅ **43 testes principais** - funcionalidades core
-   ✅ **39 testes de edge cases** - cenários extremos
-   ✅ **15 testes de integração** - workflows completos

📋 **[Documentação Completa dos Testes](./TESTS.md)**

### Estrutura dos Testes

```
src/
├── glb-audio-description/
│   ├── SpeechSynthesisUtterance.test.ts        # Testes principais
│   ├── SpeechSynthesisUtterance.edge.test.ts   # Casos extremos
│   └── SpeechSynthesisUtterance.integration.test.ts # Integração
└── test/
    ├── setup.ts    # Configuração de mocks
    └── utils.ts    # Utilitários de teste
```

## 🌐 Suporte de Navegadores

### Compatibilidade

| Navegador | Versão Mínima | Status   |
| --------- | ------------- | -------- |
| Chrome    | 33+           | ✅ Total |
| Firefox   | 49+           | ✅ Total |
| Safari    | 7+            | ✅ Total |
| Edge      | 14+           | ✅ Total |
| Opera     | 21+           | ✅ Total |

### Verificação de Suporte

```typescript
// Verificar se Web Speech API está disponível
if ('speechSynthesis' in window) {
    // Inicializar componente
    const audioDescription = new TextReader();
} else {
    console.warn('Web Speech API não suportada neste navegador');
    // Implementar fallback ou mostrar mensagem
}
```

### Vozes Recomendadas

#### Windows

-   **Microsoft Daniel - Portuguese (Brazil)**
-   **Microsoft Maria - Portuguese (Brazil)**

#### macOS/iOS

-   **Luciana (Enhanced)** - Português (Brasil)
-   **Joana** - Português (Brasil)

#### Chrome/Android

-   **Google português do Brasil**
-   **Portuguese Brazil Female/Male**

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
glb-audio-description/
├── src/
│   ├── glb-audio-description/
│   │   ├── SpeechSynthesisUtterance.ts     # Classe principal
│   │   ├── glb-audio-description.css       # Estilos do componente
│   │   └── *.test.ts                       # Arquivos de teste
│   ├── test/
│   │   ├── setup.ts                        # Setup dos testes
│   │   └── utils.ts                        # Utilitários
│   └── main.ts                             # Ponto de entrada
├── public/                                 # Arquivos públicos
├── package.json                            # Dependências
├── tsconfig.json                           # Configuração TypeScript
├── vitest.config.ts                        # Configuração de testes
└── vite.config.ts                          # Configuração Vite
```

### Scripts Disponíveis

```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build para produção
pnpm preview      # Preview do build
pnpm test         # Executar testes
pnpm test:ui      # UI dos testes
pnpm lint         # Verificar código
```

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Faça** commit das mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### Diretrizes de Código

-   Usar **TypeScript** com tipagem estrita
-   Seguir **convenções de nomenclatura** consistentes
-   Escrever **testes** para novas funcionalidades
-   Documentar **APIs públicas**
-   Manter **compatibilidade** com navegadores suportados

### Reportar Bugs

Ao reportar bugs, inclua:

-   **Versão** do navegador
-   **Passos** para reproduzir
-   **Comportamento esperado** vs **atual**
-   **Screenshots** se aplicável

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

Desenvolvido pela equipe de tecnologia do **O Globo** para melhorar a acessibilidade das matérias online.

---

**🌟 Contribua para tornar o jornalismo mais acessível!**
