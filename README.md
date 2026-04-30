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
| Salesforce | Modelagem de dados, armazenamento, dashboards, automações |
| Salesforce Flow | Automação e integração com a API |

### Backend / Análise

| Tecnologia | Uso |
| --- | --- |
| FastAPI | Criação da API e endpoints |
| Pandas | Manipulação e análise dos dados |
| Python | Lógica de negócio e geração de insights |

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
| CentroDeCusto__c | Lookup | Relacionamento com Centro de Custo |
| Departamento__c | Lookup | Relacionamento com Departamento |
| Status_Icon__c | Formula (Text) | Ícone visual: 🟢 para Receita e 🔴 para Despesa |

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
[Salesforce Flow]
    │
    │  Envia dados via HTTP para a API
    │
    ▼
[API Python - FastAPI]
    │
    │  Processa dados com Pandas
    │  Gera insights automáticos
    │
    ▼
[Salesforce]
    │
    │  Recebe os resultados
    │
    ▼
[Dashboards & Reports]
```

---

## 📂 Estrutura da API (Python)

```
api/
 ├── main.py               # Inicialização da aplicação
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

## 📊 Dashboards e Visualização (Salesforce)

Os dashboards nativos do Salesforce exibem:

- ✅ Total de receitas
- ✅ Total de despesas
- ✅ Saldo financeiro (receitas - despesas)
- ✅ Gastos por categoria
- ✅ Gastos por departamento
- ✅ Evolução financeira ao longo do tempo

---

## 🧠 Análises Realizadas pela API Python

- Cálculo de totais (receitas e despesas)
- Identificação da maior categoria de gasto
- Comparações entre períodos
- Geração de insights automáticos em texto
- Desvio de Orçamento — alerta quando o total de despesas de um Centro de Custo ultrapassa o orçamento definido

---

## 📥 Formas de Inserção de Dados

- Inserção manual no Salesforce
- Importação via arquivo CSV
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
- [x] Testar os relacionamentos criando registros manualmente

### 🟡 Fase 2 — Dados de Teste

> Objetivo: popular o sistema com dados realistas

- [x] Inserir categorias manualmente (ex: Salários, Marketing, Vendas)
- [x] Inserir departamentos (ex: Financeiro, RH, TI)
- [x] Inserir centros de custo com orçamentos
- [x] Criar script Python com Faker para gerar movimentações em CSV
- [x] Importar CSV de movimentações no Salesforce via Data Import Wizard

### 🔵 Fase 3 — Relatórios e Dashboards (Salesforce)

> Objetivo: visualizar os dados no Salesforce

- [x] Criar Report de movimentações por tipo (Receita/Despesa)
- [x] Criar Report de gastos por departamento
- [x] Criar Report de gastos por categoria
- [x] Montar Dashboard com os principais indicadores financeiros

### 🔴 Fase 4 — API Python

> Objetivo: construir o backend de análise

- [x] Criar projeto FastAPI com a estrutura de pastas definida
- [x] Criar endpoint POST /analisar que recebe lista de movimentações
- [x] Implementar análise com Pandas (totais, maiores gastos, etc.)
- [x] Implementar lógica de desvio de orçamento por Centro de Custo
- [x] Retornar insights em formato JSON
- [x] Testar a API localmente via Swagger (http://localhost:8000/docs)

### ⚫ Fase 5 — Integração Salesforce → API

> Objetivo: conectar as duas plataformas

- [ ] Fazer deploy da API no Render (plano gratuito) para ter uma URL pública
- [ ] Configurar Named Credential no Salesforce com a URL da API
- [ ] Usar External Services no Salesforce para importar o esquema JSON (Swagger) da API
- [ ] Criar Flow no Salesforce disparado ao salvar uma Movimentação
- [ ] Configurar chamada HTTP no Flow usando o Named Credential
- [ ] Receber a resposta e salvar o insight em um campo do registro
- [ ] Testar o fluxo completo ponta a ponta

### 🔥 Fase 6 — Refinamento Final

> Objetivo: polir o projeto para portfólio

- [ ] Revisar a documentação
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
- Named Credential — Gerenciamento seguro da URL e autenticação da API no Flow
- External Services — Importar esquema Swagger da API para o Flow entender os campos nativamente

### Melhorias na API

- Autenticação JWT — Segurança nos endpoints
- Banco de dados — SQLite ou PostgreSQL com SQLAlchemy
- Testes automatizados — Pytest para garantir que a API funciona corretamente

### Melhorias Avançadas

- Lightning Web Components (LWC) — Interface customizada dentro do Salesforce
- OAuth 2.0 — Autenticação segura entre Salesforce e API
- Machine Learning — Previsão de gastos futuros
- Alertas automáticos — Notificação ao ultrapassar orçamento

---

## 💡 Diferenciais do Projeto

- Integração real entre Salesforce e Python
- Modelagem de dados estruturada com objetos customizados
- Dashboards nativos do Salesforce
- Análise de dados aplicada com FastAPI + Pandas
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
