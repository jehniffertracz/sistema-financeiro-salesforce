# 💼 Sistema de Análise Financeira Empresarial

**Projeto — Salesforce + Python (FastAPI)**

---

## 📌 Sobre o Projeto

Sistema de controle e análise financeira empresarial desenvolvido com Salesforce como plataforma principal, integrado a uma API em Python (FastAPI) para processamento de dados e geração de insights automáticos.

O projeto simula um cenário real de empresa, com dados organizados, dashboards interativos e análises automatizadas — e serve como portfólio prático de desenvolvimento Salesforce.

---

## 🎯 Objetivos

- Centralizar dados financeiros empresariais no Salesforce
- Estruturar informações de forma organizada e escalável
- Gerar relatórios e dashboards nativos
- Aplicar análise de dados com Python
- Apoiar a tomada de decisão baseada em dados

---

## ⚙️ Tecnologias Utilizadas

### Plataforma Principal

| Tecnologia | Uso |
| --- | --- |
| Salesforce Developer Edition | Modelagem de dados, armazenamento, dashboards, automações |
| Salesforce Flow | Automação e integração com a API via Apex |
| Apex (Salesforce) | Classe de integração HTTP com a API Python |

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
    │  Monta o JSON e faz chamada HTTP
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
[Dashboards & Reports]
```

---

## 📂 Estrutura da API (Python)

```
api/
 ├── main.py               # Inicialização da aplicação FastAPI
 ├── requirements.txt      # Dependências do projeto
 ├── render.yaml           # Configuração de deploy no Render
 ├── routers/              # Endpoints separados por domínio
 │    └── movimentacoes.py
 ├── services/             # Regras de negócio e análises
 │    └── analise.py
 ├── models/               # Modelos de dados
 │    └── movimentacao.py
 └── schemas/              # Validação de entrada e saída (Pydantic)
      └── movimentacao.py
```

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
    "💰 Total de Receitas: R$35000.00",
    "💸 Total de Despesas: R$0.00",
    "📊 Saldo Final: R$35000.00"
  ]
}
```

---

## 📊 Dashboards e Visualização (Salesforce)

Os dashboards nativos do Salesforce exibem:

- ✅ Movimentações por Tipo (Receita/Despesa) — Gráfico Donut
- ✅ Gastos por Departamento — Gráfico de Barras Horizontal
- ✅ Gastos por Categoria — Gráfico de Barras Horizontal

---

## 🧠 Análises Realizadas pela API Python

- Cálculo de totais de receitas e despesas
- Cálculo do saldo financeiro
- Identificação da maior categoria de gasto
- Identificação do departamento com mais gastos
- Desvio de Orçamento — alerta quando o total de despesas de um Centro de Custo ultrapassa o orçamento definido
- Geração de insights automáticos em texto

---

## 📥 Formas de Inserção de Dados

- Inserção manual no Salesforce
- Importação via arquivo CSV (Data Import Wizard)
- Geração automática com Python (biblioteca Faker)

---

## 🚀 Roadmap de Desenvolvimento

### 🟢 Fase 1 — Modelagem de Dados (Salesforce)

> Objetivo: criar a estrutura base no Salesforce

- [x] Criar objeto `Categoria__c` com campos e picklist de Tipo
- [x] Criar objeto `Departamento__c`
- [x] Criar objeto `CentroDeCusto__c` com Lookup para Departamento
- [x] Criar objeto `Movimentacao__c` com todos os campos e Lookups
- [x] Criar campo de fórmula `Status_Icon__c` em `Movimentacao__c` (🟢 Receita / 🔴 Despesa)
- [x] Criar app customizado **Sistema Financeiro** no Salesforce
- [x] Testar os relacionamentos criando registros manualmente

### 🟡 Fase 2 — Dados de Teste

> Objetivo: popular o sistema com dados realistas

- [x] Inserir 7 categorias manualmente (Salários, Marketing, Infraestrutura, Impostos, Vendas, Serviços, Investimentos)
- [x] Inserir 5 departamentos (Financeiro, Recursos Humanos, Tecnologia, Marketing, Comercial)
- [x] Inserir 5 centros de custo com orçamentos
- [x] Criar script Python com Faker para gerar movimentações em CSV
- [x] Importar 50 movimentações no Salesforce via Data Import Wizard

### 🔵 Fase 3 — Relatórios e Dashboards (Salesforce)

> Objetivo: visualizar os dados no Salesforce

- [x] Criar Report Type customizado para Movimentacoes
- [x] Criar Report de movimentações por tipo (Receita/Despesa)
- [x] Criar Report de gastos por departamento
- [x] Criar Report de gastos por categoria
- [x] Montar Dashboard **Indicadores Financeiros** com 3 gráficos

### 🔴 Fase 4 — API Python

> Objetivo: construir o backend de análise

- [x] Criar projeto FastAPI com a estrutura de pastas definida
- [x] Criar endpoint `POST /api/analisar` que recebe lista de movimentações
- [x] Implementar análise com Pandas (totais, maiores gastos, saldo)
- [x] Implementar lógica de desvio de orçamento por Centro de Custo
- [x] Retornar insights em formato JSON
- [x] Testar a API localmente via Swagger (`http://localhost:8000/docs`)

### ⚫ Fase 5 — Integração Salesforce → API

> Objetivo: conectar as duas plataformas

- [x] Fazer deploy da API no Render (plano gratuito)
- [x] Configurar Remote Site Settings no Salesforce para autorizar a URL da API
- [x] Criar classe Apex `APIFinanceiraCallout` com método `@InvocableMethod`
- [x] Criar Flow Record-Triggered disparado ao criar uma Movimentação
- [x] Configurar chamada HTTP na classe Apex usando a URL da API
- [x] Receber a resposta e salvar o insight no campo `Insight__c`
- [x] Testar o fluxo completo ponta a ponta com sucesso

> **Observação:** A integração funciona ao **criar** uma Movimentação. Para updates, o caminho assíncrono do Flow requer configurações adicionais disponíveis em ambientes Salesforce completos (Enterprise+).

### 🔥 Fase 6 — Refinamento Final

> Objetivo: polir o projeto para portfólio

- [x] Revisar e atualizar a documentação
- [ ] Tirar prints dos dashboards e da API funcionando
- [ ] Gravar vídeo curto demonstrando o sistema (opcional, mas valoriza muito)
- [ ] Publicar no GitHub com README bem escrito

---

## 📋 Melhorias Futuras

> Não fazem parte do escopo atual — registradas para não esquecer

### Melhorias no Salesforce

- Validation Rules — Impedir valor negativo, data futura, campos obrigatórios
- Approval Process — Aprovação de movimentações acima de determinado valor
- Permission Sets — Controle de quem pode ver/editar cada tipo de dado
- Platform Events — Forma mais profissional de integrar com sistemas externos
- Integração via Flow update — Fazer o Flow disparar também ao atualizar registros

### Melhorias na API

- Autenticação JWT — Segurança nos endpoints
- Banco de dados — SQLite ou PostgreSQL com SQLAlchemy
- Testes automatizados — Pytest para garantir que a API funciona corretamente
- Upgrade do Render — Plano pago para eliminar o cold start de 50 segundos

### Melhorias Avançadas

- Lightning Web Components (LWC) — Interface customizada dentro do Salesforce
- OAuth 2.0 — Autenticação segura entre Salesforce e API
- Machine Learning — Previsão de gastos futuros
- Alertas automáticos — Notificação ao ultrapassar orçamento

---

## 💡 Diferenciais do Projeto

- Integração real entre Salesforce e Python via Apex + HTTP Callout
- Modelagem de dados estruturada com objetos e relacionamentos customizados
- Dashboards nativos do Salesforce com 3 visões dos dados
- Análise de dados aplicada com FastAPI + Pandas
- Detecção automática de desvio de orçamento
- Deploy real em produção com URL pública
- Simulação de cenário empresarial real
- Documentação clara e organizada

---

## 📌 Escopo Atual

Projeto em escala média, com foco em:

- Clareza de arquitetura
- Organização dos dados
- Integração funcional entre plataformas
- Aplicabilidade real como portfólio Salesforce
- Documentação atualizada conforme evolução do projeto
