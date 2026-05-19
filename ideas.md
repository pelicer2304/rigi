# RigiBlick — Ideias de Design

## Contexto
Dashboard de inteligência regulatória para equipes de Regulatory Affairs no Brasil.
Foco em precisão, confiabilidade e clareza de dados da ANVISA.

---

<response>
<text>

## Ideia 1 — "Precision Navy" (Governo Técnico Moderno)

**Design Movement:** Swiss International Typographic Style adaptado para SaaS regulatório

**Core Principles:**
- Hierarquia de informação extremamente clara — dados críticos nunca competem com decoração
- Azul marinho profundo como cor de autoridade e confiança institucional
- Grid assimétrico com sidebar densa e área central respirável
- Tipografia condensada para labels, serifada leve para números grandes

**Color Philosophy:**
- Navy #1a2e4a como âncora de autoridade
- Azul elétrico #2563eb para ações e alertas positivos
- Vermelho #c53030 exclusivamente para urgência/risco
- Fundo cinza frio #f7f9fc para descanso visual

**Layout Paradigm:**
- Sidebar fixa à esquerda (168px) com navegação hierárquica
- Coluna central dominante com cards empilhados
- Sidebar direita estreita (244px) para contexto pessoal/empresa

**Signature Elements:**
- Cabeçalhos de seção em navy sólido com texto branco
- Badges de urgência com bordas coloridas
- Mini gráficos de barras inline nos cards

**Interaction Philosophy:**
- Hover states sutis com elevação de sombra
- Slide-in panels para detalhes sem perder contexto
- Carrossel de notícias em loop contínuo

**Animation:**
- Transições de 200ms ease para hover
- Slide-in de 300ms para painéis laterais
- Bounce suave para indicador de loading do chat

**Typography System:**
- DM Sans para interface geral (legibilidade em telas)
- Números grandes em peso 800 para KPIs
- Labels em uppercase com letter-spacing para seções

</text>
<probability>0.08</probability>
</response>

<response>
<text>

## Ideia 2 — "Clinical Slate" (Precisão Científica)

**Design Movement:** Material Design 3 com influência de interfaces médicas/científicas

**Core Principles:**
- Tons de cinza-azulado como base neutra e profissional
- Accent verde-teal para aprovações/positivo, âmbar para atenção
- Layout em grade com densidade informacional alta
- Tipografia monospace para códigos de expediente e referências

**Color Philosophy:**
- Slate #334155 como cor primária de texto
- Teal #0d9488 para status positivos e aprovações
- Âmbar #d97706 para alertas moderados
- Fundo branco puro com divisores sutis

**Layout Paradigm:**
- Header compacto com breadcrumbs
- Grid de 3 colunas iguais para KPIs no topo
- Cards com densidade alta, sem padding excessivo

**Signature Elements:**
- Indicadores de status com pontos coloridos animados
- Tabelas zebradas para dados comparativos
- Chips de categoria com cores por tipo de medicamento

**Interaction Philosophy:**
- Filtros inline nos cards sem modais
- Expansão accordion para detalhes
- Tooltips ricos com contexto adicional

**Animation:**
- Fade-in de 150ms para novos dados
- Pulse suave em indicadores ativos
- Smooth scroll entre seções

**Typography System:**
- IBM Plex Sans para interface
- IBM Plex Mono para códigos e referências
- Escala tipográfica compacta (12/13/14/16/20)

</text>
<probability>0.07</probability>
</response>

<response>
<text>

## Ideia 3 — "Regulatory Intelligence" (Institucional Premium)

**Design Movement:** Enterprise SaaS com influência de Bloomberg Terminal modernizado

**Core Principles:**
- Densidade de informação alta sem parecer caótico
- Contraste forte entre áreas de ação e áreas de leitura
- Cor como linguagem semântica rigorosa (não decorativa)
- Estrutura assimétrica que guia o olhar naturalmente

**Color Philosophy:**
- Azul profundo #0f172a como fundo de sidebar e headers
- Azul médio #1e40af para elementos interativos primários
- Cinza quente #f8fafc para fundos de cards
- Vermelho coral #ef4444 para urgências

**Layout Paradigm:**
- Sidebar esquerda com ícones + labels
- Área principal com chat no topo (acesso imediato ao AI)
- Cards de conteúdo em coluna única com largura máxima controlada
- Painel direito contextual para dados da empresa

**Signature Elements:**
- Linha de acento azul à esquerda em cards de destaque
- Numeração de seções em estilo editorial
- Gradiente sutil de navy para azul-escuro na sidebar

**Interaction Philosophy:**
- Ações primárias sempre visíveis, secundárias em hover
- Feedback visual imediato em todas as interações
- Navegação sem perda de contexto

**Animation:**
- Entrada de cards com fade + translateY(8px) suave
- Hover com border-color transition
- Loading states com skeleton screens

**Typography System:**
- Inter para corpo de texto (clareza máxima)
- Space Grotesk para títulos e KPIs
- Peso 800 para números de destaque

</text>
<probability>0.06</probability>
</response>

---

## Decisão

**Escolhido: Ideia 1 — "Precision Navy"**

Mantém a identidade visual já estabelecida pelo usuário (navy + blue + red para urgência),
com refinamentos de tipografia (DM Sans), espaçamento e interações.
