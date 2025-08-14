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
-   ✅ **Seleção automática de voz** em português brasileiro
-   ✅ **Controles de reprodução** simplificados (play/stop unificado)
-   ✅ **Leitura sequencial** de múltiplos elementos
-   ✅ **Configuração flexível** de velocidade, tom e volume
-   ✅ **Tratamento robusto de erros**
-   ✅ **TypeScript** com tipagem completa
-   ✅ **Cobertura de testes** abrangente (117 testes)

## 🚀 Recursos

### Funcionalidades de Áudio

-   **Síntese de texto em voz** com vozes em português brasileiro
-   **Controles de reprodução**: play/stop unificado
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
    rate: 1.2,
    volume: 1.0,
    lang: 'pt-BR',
});

// Inicializar - vozes em português são selecionadas automaticamente
audioDescription.init(() => {
    console.log('Audio Description iniciado!');

    // Ler conteúdo da matéria
    audioDescription.readTextFromSelector(['h1.title', '.article-content p']);
});

// Controles de reprodução
audioDescription.play(); // Iniciar reprodução (ou parar se já estiver tocando)
```

### Integração em Páginas de Matéria

Para integrar o componente de áudio descrição em uma página de matéria do O Globo, siga estes passos:

#### 1. Adicionar o Container HTML

Adicione um elemento com a classe `glb-audio-description` e configure os seletores CSS via `data-containersToRead`:

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
            <div
                class="glb-audio-description"
                data-containersToRead='[".title", ".subtitle", ".content"]'
            ></div>
        </article>

        <!-- Script do componente -->
        <script type="module" src="/src/main.ts"></script>
    </body>
</html>
```

#### 2. Configuração Automática

O script em `main.ts` irá automaticamente:

-   🔍 **Detectar** todos os elementos com classe `glb-audio-description`
-   📖 **Ler** o atributo `data-containersToRead` para identificar os seletores CSS
-   🎛️ **Gerar** os controles de play/stop unificado dentro do container
-   ⚙️ **Configurar** os event listeners para os botões
-   � **Validar** se o atributo `data-containersToRead` está presente

### ⚠️ Importante: Configuração Obrigatória

O atributo `data-containersToRead` é **obrigatório**. Sem ele, o componente não será inicializado:

```html
<!-- ❌ Não funcionará - sem data-containersToRead -->
<div class="glb-audio-description"></div>

<!-- ✅ Funcionará corretamente -->
<div class="glb-audio-description" data-containersToRead='[".title", ".subtitle", ".content"]'></div>
```

### 📝 Formato do data-containersToRead

O atributo deve conter um **array JSON válido** com seletores CSS:

```html
<!-- Exemplo básico -->
<div class="glb-audio-description" data-containersToRead='[".title", ".content"]'></div>

<!-- Seletores mais específicos -->
<div
    class="glb-audio-description"
    data-containersToRead='["h1.titulo-materia", ".materia-lead", ".materia-texto p"]'
></div>

<!-- IDs e classes combinados -->
<div class="glb-audio-description" data-containersToRead='["#headline", ".subtitle", ".article-body"]'></div>
```

#### 3. Estrutura Gerada Automaticamente

O componente irá gerar esta estrutura HTML dentro do container:

```html
<div class="glb-audio-description is-not-played">
    <button class="glb-audio-description__button glb-audio-description__play">
        <i class="glb-audio-description__play-icon" data-lucide="play"></i>
        <i class="glb-audio-description__pause-icon" data-lucide="square"></i>
    </button>
</div>
```

#### 4. Múltiplos Componentes na Página

Você pode ter múltiplos componentes de áudio descrição na mesma página, cada um com seus próprios seletores:

```html
<!-- Componente para o cabeçalho -->
<div class="glb-audio-description" data-containersToRead='[".title", ".subtitle"]'></div>

<!-- Componente para o conteúdo principal -->
<div class="glb-audio-description" data-containersToRead='[".lead", ".content p"]'></div>

<!-- Componente para uma seção específica -->
<div class="glb-audio-description" data-containersToRead='[".sidebar .related-articles"]'></div>
```

#### 5. Estados do Componente

O componente possui diferentes estados visuais:

-   **`is-not-played`** - Estado inicial, ainda não foi reproduzido
-   **`is-playing`** - Reproduzindo conteúdo
-   **`is-stopped`** - Parado

#### 6. Configuração Personalizada

Para ajustar configurações como velocidade e volume, edite o objeto `config` em `main.ts`:

```typescript
const config: TextReaderOptions = {
    pitch: 0.8, // Tom de voz
    volume: 1, // Volume
    rate: 1.0, // Velocidade
    lang: 'pt-BR', // Idioma
};
// Nota: A voz é selecionada automaticamente para português
```

## 📚 API

### Constructor

```typescript
new TextReader(options?: TextReaderOptions)
```

#### TextReaderOptions

```typescript
interface TextReaderOptions {
    lang?: string; // Código do idioma (default: 'pt-BR')
    rate?: number; // Velocidade: 0.1 - 10 (default: 1.0)
    pitch?: number; // Tom: 0 - 2 (default: 1)
    volume?: number; // Volume: 0 - 1 (default: 1)
}
// Nota: Seleção de voz é automática, priorizando vozes em português
```

### Métodos Principais

#### `init(callback: () => void): void`

Inicializa o componente e carrega as vozes disponíveis.

#### `readTextFromSelector(selectors: string[]): void`

Lê texto dos elementos especificados pelos seletores CSS.

#### `play(): void`

Inicia ou para a reprodução (comportamento toggle).

#### `pause(): void`

Pausa a reprodução atual.

#### `resume(): void`

Retoma a reprodução pausada.

#### `stop(): void`

Para completamente a reprodução.

### Métodos de Configuração

#### `setVoiceByName(): void`

Executa seleção automática de voz, priorizando vozes em português brasileiro.

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
    rate: 1.0,
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

O projeto possui uma suíte de testes abrangente com **117 testes** cobrindo todos os aspectos do componente.

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
-   ✅ **44 testes de edge cases** - cenários extremos
-   ✅ **17 testes de integração** - workflows completos
-   ✅ **13 testes de integração main.ts** - testes de interface

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

### Vozes Automáticas

O sistema seleciona automaticamente a melhor voz disponível em português brasileiro, na seguinte ordem de prioridade:

#### Vozes Preferidas (em ordem)

1. **Google português do Brasil** - Chrome/Android
2. **Microsoft Daniel - Portuguese (Brazil)** - Windows
3. **Luciana (Portuguese - Brazil)** - macOS/iOS

#### Fallback

Se nenhuma voz preferida estiver disponível, o sistema:

-   Mostra um aviso no console
-   Continua funcionando com a voz padrão do sistema

## 🔧 Desenvolvimento

### ⚠️ Mudanças Recentes (v2.0)

A partir da versão 2.0, foram realizadas mudanças significativas para melhorar a compatibilidade com dispositivos móveis, especialmente Chrome Android:

#### Alterações Principais:

-   **Simplificação dos controles**: Removido botão pause/resume separado
-   **Botão unificado**: Um único botão que alterna entre play ▶️ e stop ⏹️
-   **Melhor UX mobile**: Evita problemas de pause/resume no Chrome Android
-   **API simplificada**: Método `play()` não aceita mais parâmetros

#### Comportamento Atual:

-   **Primeiro clique**: Inicia reprodução
-   **Segundo clique**: Para completamente e reseta para o início
-   **Funcionalidade pause/resume**: Ainda disponível via API, mas não na interface

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
