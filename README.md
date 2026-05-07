# 💼 Sistema de Análise Financeira Empresarial

**Projeto — Salesforce + Python (FastAPI) + Lightning Web Components**

---

## 📌 Sobre o Projeto

Sistema de controle e análise financeira empresarial desenvolvido com **Salesforce** como plataforma principal, integrado a uma **API em Python (FastAPI)** para processamento de dados e geração de insights automáticos, e **Lightning Web Components (LWC)** para visualizações modernas e interativas.

O projeto simula um cenário real de empresa, com dados organizados, dashboards interativos, análises automatizadas e componentes visuais customizados — servindo como portfólio prático de desenvolvimento Salesforce em nível intermediário-avançado.

---

## 🎯 Objetivos

- Centralizar dados financeiros empresariais no Salesforce
- Estruturar informações de forma organizada e escalável
- Gerar relatórios e dashboards nativos e customizados com LWC
- Aplicar análise de dados com Python
- Apoiar a tomada de decisão baseada em dados
- Demonstrar integração real entre plataformas (Salesforce ↔ Python)

---

## ⚙️ Tecnologias Utilizadas

### Plataforma Principal

| Tecnologia | Uso |
| --- | --- |
| Salesforce Developer Edition | Modelagem de dados, armazenamento, dashboards, automações |
| Salesforce Flow | Automação e integração com a API via Apex |
| Apex (Salesforce) | Classes de integração HTTP e controllers para LWC |
| Lightning Web Components (LWC) | Componentes visuais customizados com Chart.js |
| Chart.js | Biblioteca de gráficos interativos via Static Resources |

### Backend / Análise

| Tecnologia | Uso |
| --- | --- |
| FastAPI | Criação da API e endpoints |
| Pandas | Manipulação e análise dos dados |
| Python 3.11 | Lógica de negócio e geração de insights |
| Uvicorn | Servidor ASGI para rodar a API |
| Render | Hospedagem gratuita da API em produção |

### Ferramentas

| Tecnologia | Uso |
| --- | --- |
| GitHub | Versionamento do código |
| Salesforce CLI (sf) | Deploy e gerenciamento de metadados |
| VS Code + Salesforce Extension Pack | Desenvolvimento e deploy dos componentes |
| Faker (Python) | Geração automática de dados de teste |
| Swagger UI | Documentação e teste da API |

---

## 🧩 Modelagem de Dados

### 📁 Categoria (Categoria__c)

Classifica receitas e despesas.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| Nome | Text | Nome da categoria |
| Tipo__c | Picklist | Receita / Despesa |

### 🏢 Departamento (Departamento__c)

Representa as áreas da empresa.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| Nome | Text | Nome do departamento |
| Gestor__c | Text | Nome do gestor (opcional) |

### 💰 Centro de Custo (CentroDeCusto__c)

Define onde os recursos financeiros são utilizados.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| Nome | Text | Nome do centro de custo |
| Orcamento__c | Currency | Valor do orçamento |
| Departamento__c | Lookup | Relacionamento com Departamento |

### 📊 Movimentação (Movimentacao__c)

Objeto principal do sistema — registra todas as entradas e saídas financeiras.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| Valor__c | Currency | Valor da movimentação |
| Tipo__c | Picklist | Receita / Despesa |
| Data__c | Date | Data da movimentação |
| Descricao__c | Text Area | Descrição detalhada |
| Categoria__c | Lookup | Relacionamento com Categoria |
| Centro_de_Custo__c | Lookup | Relacionamento com Centro de Custo |
| Departamento__c | Lookup | Relacionamento com Departamento |
| Status_Icon__c | Formula (Text) | Ícone visual: 🟢 para Receita e 🔴 para Despesa |
| Insight__c | Long Text Area | Insights gerados automaticamente pela API Python |

---

## 🔗 Relacionamentos

```
Departamento
    └── Centro de Custo (Lookup)
            └── Movimentação (Lookup)
                    ├── Categoria (Lookup)
                    └── Departamento (Lookup)
```

---

## 🏗️ Arquitetura do Sistema

```
[Salesforce]
    │
    │  Usuário cadastra movimentações
    │
    ▼
[Salesforce Flow - Record Triggered]
    │
    │  Disparado ao criar uma Movimentação
    │
    ▼
[Apex Class - APIFinanceiraCallout]
    │
    │  Busca histórico completo do departamento
    │  Serializa payload com JSON.serialize()
    │  Faz chamada HTTP assíncrona
    │
    ▼
[API Python - FastAPI no Render]
    │
    │  Processa dados com Pandas
    │  Gera insights automáticos
    │  Verifica desvio de orçamento
    │
    ▼
[Salesforce]
    │
    │  Salva o insight no campo Insight__c
    │
    ▼
[LWC insightCard]             [LWC painelFinanceiro]
    │                               │
    │  Exibe KPIs, alertas          │  Exibe gráficos Chart.js
    │  e insights formatados        │  com visão consolidada
    │  na Record Page               │  na App Page
```

---

## 📂 Estrutura do Projeto

```
sistema-financeiro-salesforce/
 ├── api/                          # API Python (FastAPI)
 │    ├── main.py
 │    ├── requirements.txt
 │    ├── render.yaml
 │    ├── routers/
 │    │    └── movimentacoes.py
 │    ├── services/
 │    │    └── analise.py
 │    ├── models/
 │    │    └── movimentacao.py
 │    └── schemas/
 │         └── movimentacao.py
 │
 └── force-app/main/default/
      ├── classes/
      │    ├── APIFinanceiraCallout.cls          # Integração HTTP com a API Python
      │    └── PainelFinanceiroController.cls    # Controller Apex para o LWC de painel
      └── lwc/
           ├── insightCard/                      # Card de insights na Record Page
           │    ├── insightCard.html
           │    ├── insightCard.js
           │    ├── insightCard.css
           │    └── insightCard.js-meta.xml
           └── painelFinanceiro/                 # Painel com gráficos Chart.js
                ├── painelFinanceiro.html
                ├── painelFinanceiro.js
                ├── painelFinanceiro.css
                └── painelFinanceiro.js-meta.xml
```

---

## ⚡ Lightning Web Components (LWC)

### 📊 insightCard

Componente exibido na **Record Page** de cada Movimentação. Lê o campo `Insight__c` (JSON gerado pela API Python) e apresenta os dados de forma visual e organizada.

**Funcionalidades:**
- KPIs de Total de Receitas, Despesas e Saldo com formatação BRL
- Barras de progresso relativas entre receita e despesa
- Badge de saldo positivo/negativo
- Cards de maior gasto por categoria e departamento
- Alertas de orçamento estourado com formatação monetária
- Resumo dos insights em lista estruturada
- Estado de loading e tratamento de erro

### 📈 painelFinanceiro

Componente exibido em **App Page** dedicada no app Sistema Financeiro. Consulta todas as movimentações via Apex e renderiza gráficos interativos com Chart.js.

**Funcionalidades:**
- 4 KPI Cards — Receitas, Despesas, Saldo Geral e Categorias Ativas
- Gráfico Donut — Receitas vs Despesas
- Gráfico de Barras Horizontal — Gastos por Departamento
- Gráfico de Barras Vertical — Gastos por Categoria
- Badge "Ao vivo" com animação pulsante
- Dados em tempo real via Apex Controller com `cacheable=true`

---

## 🌐 API em Produção

A API está hospedada no Render e pode ser acessada publicamente:

- **URL Base:** `https://sistema-financeiro-salesforce.onrender.com`
- **Documentação Swagger:** `https://sistema-financeiro-salesforce.onrender.com/docs`
- **Schema OpenAPI:** `https://sistema-financeiro-salesforce.onrender.com/openapi.json`

> ⚠️ O plano gratuito do Render pode demorar até 50 segundos para responder após período de inatividade.

### Endpoint Principal

**POST** `/api/analisar`

Recebe uma lista de movimentações e orçamentos, retorna insights financeiros automáticos.

**Exemplo de Request:**
```json
{
  "movimentacoes": [
    {
      "nome": "MOV-0001",
      "valor": 35000,
      "tipo": "Receita",
      "data": "2026-01-15",
      "descricao": "Venda de serviços",
      "categoria": "Serviços",
      "centro_de_custo": "Equipe Comercial",
      "departamento": "Comercial"
    }
  ],
  "orcamentos": {
    "Equipe Comercial": 40000
  }
}
```

**Exemplo de Response:**
```json
{
  "total_receitas": 35000.0,
  "total_despesas": 0.0,
  "saldo": 35000.0,
  "maior_gasto_categoria": "N/A",
  "maior_gasto_departamento": "N/A",
  "alertas_orcamento": [],
  "insights": [
    "Total de Receitas: R$ 35.000,00",
    "Total de Despesas: R$ 0,00",
    "Saldo Final: R$ 35.000,00"
  ]
}
```

---

## 📊 Visualizações do Sistema

### Dashboard Nativo (Salesforce)
- ✅ Movimentações por Tipo (Receita/Despesa) — Gráfico Donut
- ✅ Gastos por Departamento — Gráfico de Barras Horizontal
- ✅ Gastos por Categoria — Gráfico de Barras Horizontal

### LWC insightCard (Record Page)
- ✅ KPIs individuais por movimentação com histórico do departamento
- ✅ Alertas de orçamento em tempo real
- ✅ Resumo de insights gerados pela API Python

### LWC painelFinanceiro (App Page)
- ✅ Visão consolidada de todas as movimentações
- ✅ Gráficos interativos com Chart.js
- ✅ Dados atualizados diretamente do Salesforce via Apex

---

## 🧠 Análises Realizadas pela API Python

- Cálculo de totais de receitas e despesas do departamento completo
- Cálculo do saldo financeiro
- Identificação da maior categoria de gasto
- Identificação do departamento com mais gastos
- Detecção de desvio de orçamento por Centro de Custo
- Geração de insights automáticos em texto formatado

---

## 📥 Formas de Inserção de Dados

- Inserção manual no Salesforce
- Importação via arquivo CSV (Data Import Wizard)
- Geração automática com Python (biblioteca Faker)

---

## 🚀 Roadmap de Desenvolvimento

### 🟢 Fase 1 — Modelagem de Dados (Salesforce) ✅

- [x] Criar objeto `Categoria__c` com campos e picklist de Tipo
- [x] Criar objeto `Departamento__c`
- [x] Criar objeto `CentroDeCusto__c` com Lookup para Departamento
- [x] Criar objeto `Movimentacao__c` com todos os campos e Lookups
- [x] Criar campo de fórmula `Status_Icon__c` — 🟢 Receita / 🔴 Despesa
- [x] Criar app customizado **Sistema Financeiro** no Salesforce
- [x] Testar os relacionamentos criando registros manualmente

### 🟡 Fase 2 — Dados de Teste ✅

- [x] Inserir 7 categorias (Salários, Marketing, Infraestrutura, Impostos, Vendas, Serviços, Investimentos)
- [x] Inserir 5 departamentos (Financeiro, RH, Tecnologia, Marketing, Comercial)
- [x] Inserir 5 centros de custo com orçamentos
- [x] Criar script Python com Faker para gerar movimentações em CSV
- [x] Importar 50 movimentações no Salesforce via Data Import Wizard

### 🔵 Fase 3 — Relatórios e Dashboards Nativos (Salesforce) ✅

- [x] Criar Report Type customizado para Movimentações
- [x] Criar Report de movimentações por tipo (Receita/Despesa)
- [x] Criar Report de gastos por departamento
- [x] Criar Report de gastos por categoria
- [x] Montar Dashboard **Indicadores Financeiros** com 3 gráficos

### 🔴 Fase 4 — API Python ✅

- [x] Criar projeto FastAPI com a estrutura de pastas definida
- [x] Criar endpoint `POST /api/analisar`
- [x] Implementar análise com Pandas (totais, maiores gastos, saldo)
- [x] Implementar lógica de desvio de orçamento por Centro de Custo
- [x] Retornar insights em formato JSON
- [x] Testar a API localmente via Swagger

### ⚫ Fase 5 — Integração Salesforce → API ✅

- [x] Fazer deploy da API no Render
- [x] Configurar Remote Site Settings no Salesforce
- [x] Criar classe Apex `APIFinanceiraCallout` com `@InvocableMethod`
- [x] Refatorar a classe seguindo boas práticas Apex (métodos separados, `JSON.serialize()`, try/catch)
- [x] Expandir a integração para enviar histórico completo do departamento
- [x] Criar Flow Record-Triggered disparado ao criar uma Movimentação
- [x] Receber a resposta e salvar o insight no campo `Insight__c`
- [x] Testar o fluxo completo ponta a ponta com sucesso

> **Observação:** A integração funciona ao **criar** uma Movimentação. Para updates, o caminho assíncrono do Flow requer configurações adicionais disponíveis em ambientes Salesforce completos (Enterprise+).

### 🔥 Fase 6 — Lightning Web Components (LWC) ✅

- [x] Criar componente `insightCard` para a Record Page de Movimentação
- [x] Exibir KPIs, alertas e insights com formatação monetária brasileira (BRL)
- [x] Criar componente `painelFinanceiro` para App Page dedicada
- [x] Integrar Chart.js via Static Resources para gráficos interativos
- [x] Criar `PainelFinanceiroController` — Apex Controller com boas práticas
- [x] Adicionar painel ao app Sistema Financeiro na navegação
- [x] Deploy de todos os componentes via Salesforce CLI
- [x] Commitar toda a estrutura Salesforce no GitHub

---

## 📋 Melhorias Futuras

> Não fazem parte do escopo atual — registradas para evolução do projeto.

### Salesforce
- **Validation Rules** — Impedir valor negativo, data futura, campos obrigatórios
- **Approval Process** — Aprovação de movimentações acima de determinado valor
- **Permission Sets** — Controle de acesso por perfil
- **Platform Events** — Integração mais robusta com sistemas externos
- **Flow update trigger** — Disparar o Flow também ao atualizar registros

### API Python
- **Autenticação JWT** — Segurança nos endpoints
- **Banco de dados** — SQLite ou PostgreSQL com SQLAlchemy
- **Testes automatizados** — Pytest
- **Upgrade do Render** — Plano pago para eliminar cold start

### LWC & Avançado
- **Filtros dinâmicos** no `painelFinanceiro` por período e departamento
- **OAuth 2.0** — Autenticação segura entre Salesforce e API
- **Machine Learning** — Previsão de gastos futuros
- **Alertas automáticos** — Notificação ao ultrapassar orçamento

---

## 💡 Diferenciais do Projeto

- ✅ Integração real entre Salesforce e Python via Apex + HTTP Callout
- ✅ Classe Apex refatorada com boas práticas (separação de responsabilidades, `JSON.serialize()`, try/catch, constantes)
- ✅ Análise financeira baseada no **histórico completo do departamento**, não apenas no registro individual
- ✅ Dois LWCs customizados com design moderno e responsivo
- ✅ Gráficos interativos com Chart.js integrados ao Salesforce
- ✅ Modelagem de dados estruturada com objetos e relacionamentos customizados
- ✅ Dashboard nativo + Painel LWC — demonstra domínio low-code e pro-code
- ✅ Deploy real em produção com URL pública
- ✅ Projeto versionado com estrutura SFDX no GitHub
- ✅ Simulação de cenário empresarial real com dados gerados automaticamente

---

## 📌 Escopo do Projeto

Projeto em escala média-avançada, com foco em:

- Clareza de arquitetura e separação de responsabilidades
- Organização dos dados e relacionamentos
- Integração funcional entre plataformas (Salesforce ↔ Python)
- Componentes visuais modernos com LWC e Chart.js
- Boas práticas de desenvolvimento Apex e JavaScript
- Aplicabilidade real como portfólio Salesforce Developer
