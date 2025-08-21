# 🔊 GLB Audio Description

[![npm version](https://badge.fury.io/js/glb-audio-description.svg)](https://badge.fury.io/js/glb-audio-description)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

Componente de áudio descrição para páginas web, permitindo leitura de texto em voz alta usando a Web Speech API. Desenvolvido pela equipe do O Globo para melhorar a acessibilidade de conteúdo online.

## 📋 Índice

- [Instalação](#-instalação)
- [Uso Básico](#-uso-básico)
- [API](#-api)
- [Configuração](#️-configuração)
- [Suporte de Navegadores](#-suporte-de-navegadores)
- [Desenvolvimento](#-desenvolvimento)
- [Contribuição](#-contribuição)

## 🎯 Visão Geral

O GLB Audio Description é um componente TypeScript que implementa funcionalidades de síntese de voz para tornar o conteúdo web mais acessível. Utiliza a Web Speech API nativa do navegador para converter texto em fala.

### Características Principais

✅ **Síntese de voz nativa** usando Web Speech API
✅ **Seleção automática de voz** em português brasileiro
✅ **Controles de reprodução** simplificados (play/stop unificado)
✅ **Leitura sequencial** de múltiplos elementos
✅ **Configuração flexível** de velocidade, tom e volume
✅ **Tratamento robusto de erros**
✅ **TypeScript** com tipagem completa
✅ **Zero dependências** (exceto Lucide para ícones)

## 📦 Instalação

```bash
# npm
npm install @infoglobo/glb-audio-description

# yarn
yarn add @infoglobo/glb-audio-description

# pnpm
pnpm add @infoglobo/glb-audio-description
```sh

### CSS (Opcional)

Se você quiser usar os estilos padrão, importe o CSS:

```typescript
```typescript
import { TextReader, initAudioDescription } from '@infoglobo/glb-audio-description';
import type { TextReaderOptions } from '@infoglobo/glb-audio-description';
const audioDescription = new TextReader({
    rate: 1.0,
    volume: 1.0,
    lang: 'pt-BR',
});

// Inicializar - vozes em português são selecionadas automaticamente
audioDescription.init(() => {
    console.log('Audio Description iniciado!');

    // Ler conteúdo específico
    audioDescription.readTextFromSelector(['h1', '.content p']);
});

## 📋 Índice

- [Instalação](#instalacao)
- [Uso Básico](#uso-basico)
- [API](#api)
- [Configuração](#configuracao)
- [Suporte de Navegadores](#suporte-de-navegadores)
- [Desenvolvimento](#desenvolvimento)
- [Contribuição](#contribuicao)
```typescript
import { initAudioDescription } from '@infoglobo/glb-audio-description';
### Características Principais

✅ **Síntese de voz nativa** usando Web Speech API
✅ **Seleção automática de voz** em português brasileiro
✅ **Controles de reprodução** simplificados (play/stop unificado)
✅ **Leitura sequencial** de múltiplos elementos
✅ **Configuração flexível** de velocidade, tom e volume
✅ **Tratamento robusto de erros**
✅ **TypeScript** com tipagem completa
✅ **Zero dependências** (exceto Lucide para ícones)
```sh

### HTML para Interface Automática

```html
<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <title>Exemplo GLB Audio Description</title>
    </head>
    <body>
## 📦 Instalação

```bash
# npm
npm install @infoglobo/glb-audio-description

# yarn
yarn add @infoglobo/glb-audio-description

# pnpm
pnpm add @infoglobo/glb-audio-description
```
        <article>
            <h1>Título do Artigo</h1>
            <p class="content">Conteúdo do artigo...</p>

            <!-- Container do componente -->
            <div class="glb-audio-description" data-containerstoread='["h1", ".content"]'></div>
        </article>
### CSS (Opcional)

Se você quiser usar os estilos padrão, importe o CSS:

```typescript
import '@infoglobo/glb-audio-description/style.css';
```
    </body>
</html>
```sh

## 📚 API

### TextReader

#### Constructor

```typescript
new TextReader(options?: TextReaderOptions)
```sh

#### TextReaderOptions

```typescript
interface TextReaderOptions {
    lang?: string; // Código do idioma (default: 'pt-BR')
    rate?: number; // Velocidade: 0.1 - 10 (default: 1.0)
    pitch?: number; // Tom: 0 - 2 (default: 1)
    volume?: number; // Volume: 0 - 1 (default: 1)
}
```sh
### Exemplo Simples com TextReader

```typescript
import { TextReader } from '@infoglobo/glb-audio-description';

// Criar instância do TextReader
const audioDescription = new TextReader({
    rate: 1.0,
    volume: 1.0,
    lang: 'pt-BR',
});

// Inicializar - vozes em português são selecionadas automaticamente
audioDescription.init(() => {
    console.log('Audio Description iniciado!');

    // Ler conteúdo específico
    audioDescription.readTextFromSelector(['h1', '.content p']);
});

// Controles manuais
audioDescription.play(); // Iniciar reprodução
audioDescription.stop(); // Parar reprodução
```

#### Métodos Principais

```typescript
// Inicializar o leitor
init(callback: () => void): void

// Ler texto de elementos específicos
readTextFromSelector(selectors: string[]): void
### Estrutura do Pacote

```text
dist/
├── index.js           # Código JavaScript compilado
├── index.d.ts         # Definições TypeScript
├── style.css          # Estilos CSS opcionais
└── ...
```

// Controles de reprodução
play(): void       // Iniciar ou continuar reprodução
pause(): void      // Pausar reprodução
resume(): void     // Retomar reprodução pausada
stop(): void       // Parar completamente

// Configuração
setRate(rate: number): void
setPitch(pitch: number): void
setVolume(volume: number): void
setLang(lang: string): void

### Estrutura Final do Pacote NPM

```text
dist/
├── index.js      # 📦 Código principal (ES modules)
├── index.d.ts    # 🏷️ Definições TypeScript
└── style.css     # 🎨 Estilos opcionais

package.json configura:
├── main: "dist/index.js"
├── types: "dist/index.d.ts"
└── exports: { ".": "./dist/index.js", "./style.css": "./dist/style.css" }
```
// Utilitários
listVoices(): SpeechSynthesisVoice[]
static isSupported(): boolean
```sh

### initAudioDescription

#### Função de Inicialização Automática

### Como Contribuir

1. Clone o repositório
2. Instale as dependências: `npm install` ou `pnpm install`
3. Faça suas alterações **apenas** na pasta `src/glb-audio-description/`
4. Execute os testes: `npm test` (certifique-se que todos os 104 testes passem ✅)
5. Gere o build: `npm run build:lib`
6. Verifique se não há erros de TypeScript ou testes
7. Submeta um Pull Request
```typescript
interface InitOptions extends TextReaderOptions {
    selector?: string; // Seletor CSS (default: '.glb-audio-description')
}

function initAudioDescription(options?: InitOptions): { reader: TextReader };
```

## ⚙️ Configuração

### Configurações Padrão

```typescript
const defaultOptions = {
    lang: 'pt-BR',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
};
```

### Personalização de Estilos

O componente vem com estilos CSS padrão, mas você pode customizar:

```css
.glb-audio-description {
    /* Customizar container */
}

.glb-audio-description__button {
    /* Customizar botões */
}

.glb-audio-description__play-icon,
.glb-audio-description__pause-icon {
    /* Customizar ícones */
}
```

## 🌐 Suporte de Navegadores

| Navegador | Versão Mínima | Status   |
| --------- | ------------- | -------- |
| Chrome    | 33+           | ✅ Total |
| Firefox   | 49+           | ✅ Total |
| Safari    | 7+            | ✅ Total |
| Edge      | 14+           | ✅ Total |
| Opera     | 21+           | ✅ Total |

### Verificação de Suporte

```typescript
import { TextReader } from '@infoglobo/glb-audio-description';

if (TextReader.isSupported()) {
    // Inicializar componente
    const audioDescription = new TextReader();
} else {
    console.warn('Web Speech API não suportada neste navegador');
}
```

## 🔧 Desenvolvimento

### Build do Projeto

```bash
# Instalar dependências
npm install

# Build para produção
npm run build:lib

# Desenvolvimento
npm run dev

# Testes
npm test
```

### Estrutura do Pacote

```
dist/
├── index.js           # Código JavaScript compilado
├── index.d.ts         # Definições TypeScript
├── style.css          # Estilos CSS opcionais
└── ...
```

### Estrutura do Projeto

O pacote está organizado para máxima clareza e facilidade de desenvolvimento:

```text
src/
├── glb-audio-description/                    # 📦 Código principal do pacote
│   ├── index.ts                              # 🚀 Entry point - exports principais
│   ├── SpeechSynthesisUtterance.ts          # 🎤 Classe TextReader (core)
│   ├── glb-audio-description.css            # 🎨 Estilos do componente
│   ├── SpeechSynthesisUtterance.test.ts     # 🧪 Testes principais
│   ├── SpeechSynthesisUtterance.edge.test.ts # 🔍 Testes de casos extremos
│   └── SpeechSynthesisUtterance.integration.test.ts # 🔗 Testes de integração
├── test/                                     # ⚙️ Configuração de ambiente de teste
│   ├── setup.ts                             # 🔧 Mocks e configuração global
│   └── utils.ts                             # 🛠️ Utilitários para testes
└── main.ts                                  # 🎯 Arquivo de exemplo/demo (não incluído no pacote)

dist/                                         # 📤 Output do build (publicado no npm)
├── index.js                                 # 📄 Código compilado e bundled
├── index.d.ts                               # 📝 Definições TypeScript
├── SpeechSynthesisUtterance.js              # 🎤 Classe TextReader compilada
├── SpeechSynthesisUtterance.d.ts            # 📝 Definições da classe TextReader
└── style.css                               # 🎨 CSS processado e otimizado
```text

### Scripts Disponíveis

```bash
# 🚀 Build da biblioteca para publicação no npm
npm run build:lib

# 🔨 Build padrão (desenvolvimento com Vite)
npm run build

# 📝 Gerar apenas arquivos de definição TypeScript
npm run build:types

# 🧪 Executar todos os testes (modo run, não-interativo)
npm test

# 👀 Executar testes em modo watch (re-executa ao salvar)
npm run test:watch

# 🎯 Executar testes com interface visual
npm run test:ui

# 🧹 Limpar pasta dist
npm run clean

# 🚀 Preparar para publicação (clean + build:lib)
npm run prepublishOnly

### Fluxo de Desenvolvimento

1. **Desenvolvimento**: Trabalhe **apenas** na pasta `src/glb-audio-description/`
2. **Testes**: Execute `npm test` para verificar suas alterações (104 testes passando ✅)
3. **Build**: Use `npm run build:lib` para gerar o pacote final
4. **Validação**: Verifique se todos os arquivos foram gerados corretamente

### Verificação do Build

Após `npm run build:lib`, confirme se foram gerados:

```bash
ls -la dist/
# ✅ Deve conter:
# index.js                    (~4.6 kB) - Código bundled principal
# index.d.ts                  (~0.8 kB) - Definições TypeScript principais
# SpeechSynthesisUtterance.js (~3.2 kB) - Classe TextReader compilada
# SpeechSynthesisUtterance.d.ts (~1.2 kB) - Definições da classe TextReader
# style.css                   (~0.6 kB) - Estilos processados
```

### Fluxo de Desenvolvimento

1. **Desenvolvimento**: Trabalhe na pasta `src/glb-audio-description/`
2. **Testes**: Execute `npm test` para verificar suas alterações
3. **Build**: Use `npm run build:lib` para gerar o pacote final
4. **Validação**: Verifique se todos os arquivos foram gerados corretamente

### Verificação do Build

Após `npm run build:lib`, confirme se foram gerados:

```bash
ls -la dist/
# ✅ Deve conter:
# index.js     (~4.5 kB) - Código bundled
# index.d.ts   (~1.0 kB) - Definições TypeScript
# style.css    (~0.6 kB) - Estilos processados
````

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

Desenvolvido pela equipe de tecnologia do **O Globo** para melhorar a acessibilidade do jornalismo online.

---

**🌟 Contribua para tornar a web mais acessível!**
