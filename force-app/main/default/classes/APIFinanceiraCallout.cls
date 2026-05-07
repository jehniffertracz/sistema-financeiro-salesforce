public class APIFinanceiraCallout {

    private static final String API_ENDPOINT = 'https://sistema-financeiro-salesforce.onrender.com/api/analisar';
    private static final Integer TIMEOUT = 120000;
    private static final Integer MAX_MOVIMENTACOES = 200;

    @InvocableMethod(
        label='Chamar API Financeira'
        description='Busca movimentações do departamento, envia para a API Python e salva o insight gerado'
    )
    public static List<String> chamarAPI(List<String> movimentacaoIds) {
        List<String> resultados = new List<String>();

        for (String movId : movimentacaoIds) {
            try {
                Movimentacao__c movAtual = buscarMovimentacao(movId);
                List<Movimentacao__c> historico = buscarHistoricoDepartamento(movAtual.Departamento__c);
                String payload = montarPayload(historico);
                String resposta = enviarParaAPI(payload);
                salvarInsight(movId, resposta);
                resultados.add(resposta);

            } catch (Exception e) {
                resultados.add('Erro: ' + e.getMessage());
            }
        }

        return resultados;
    }

    // ── Queries ──────────────────────────────────────────────────────────────

    private static Movimentacao__c buscarMovimentacao(String movId) {
        return [
            SELECT Id, Name, Valor__c, Tipo__c, Data__c,
                   Descricao__c, Categoria__r.Name,
                   Centro_De_Custo__r.Name, Centro_De_Custo__r.Orcamento__c,
                   Departamento__r.Name, Departamento__c
            FROM Movimentacao__c
            WHERE Id = :movId
            LIMIT 1
        ];
    }

    private static List<Movimentacao__c> buscarHistoricoDepartamento(Id departamentoId) {
        return [
            SELECT Id, Name, Valor__c, Tipo__c, Data__c,
                   Descricao__c, Categoria__r.Name,
                   Centro_De_Custo__r.Name, Centro_De_Custo__r.Orcamento__c,
                   Departamento__r.Name
            FROM Movimentacao__c
            WHERE Departamento__c = :departamentoId
            ORDER BY Data__c DESC
            LIMIT :MAX_MOVIMENTACOES
        ];
    }

    // ── Payload ───────────────────────────────────────────────────────────────

    private static String montarPayload(List<Movimentacao__c> movimentacoes) {
        List<Object> listaMovs = new List<Object>();
        Map<String, Decimal> orcamentos = new Map<String, Decimal>();

        for (Movimentacao__c m : movimentacoes) {
            listaMovs.add(new Map<String, Object>{
                'nome'           => m.Name,
                'valor'          => m.Valor__c != null ? m.Valor__c : 0,
                'tipo'           => m.Tipo__c != null ? m.Tipo__c : '',
                'data'           => String.valueOf(m.Data__c),
                'descricao'      => m.Descricao__c != null ? m.Descricao__c : '',
                'categoria'      => m.Categoria__r != null ? m.Categoria__r.Name : '',
                'centro_de_custo'=> m.Centro_De_Custo__r != null ? m.Centro_De_Custo__r.Name : '',
                'departamento'   => m.Departamento__r != null ? m.Departamento__r.Name : ''
            });

            if (m.Centro_De_Custo__r != null && m.Centro_De_Custo__r.Orcamento__c != null) {
                orcamentos.put(m.Centro_De_Custo__r.Name, m.Centro_De_Custo__r.Orcamento__c);
            }
        }

        Map<String, Object> payload = new Map<String, Object>{
            'movimentacoes' => listaMovs,
            'orcamentos'    => orcamentos
        };

        return JSON.serialize(payload);
    }

    // ── HTTP ──────────────────────────────────────────────────────────────────

    private static String enviarParaAPI(String payload) {
        HttpRequest request = new HttpRequest();
        request.setEndpoint(API_ENDPOINT);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json');
        request.setBody(payload);
        request.setTimeout(TIMEOUT);

        HttpResponse response = new Http().send(request);

        if (response.getStatusCode() != 200) {
            throw new CalloutException('API retornou status ' + response.getStatusCode());
        }

        return response.getBody();
    }

    // ── DML ───────────────────────────────────────────────────────────────────

    private static void salvarInsight(String movId, String insight) {
        update new Movimentacao__c(
            Id = movId,
            Insight__c = insight
        );
    }
}