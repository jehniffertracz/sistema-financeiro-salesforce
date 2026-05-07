public with sharing class PainelFinanceiroController {

    @AuraEnabled(cacheable=true)
    public static String getResumoFinanceiro() {
        try {
            List<Movimentacao__c> movimentacoes = buscarTodasMovimentacoes();

            Decimal totalReceitas = 0;
            Decimal totalDespesas = 0;
            Map<String, Decimal> gastosPorDepartamento = new Map<String, Decimal>();
            Map<String, Decimal> gastosPorCategoria = new Map<String, Decimal>();

            for (Movimentacao__c m : movimentacoes) {
                Decimal valor = m.Valor__c != null ? m.Valor__c : 0;
                String departamento = m.Departamento__r != null ? m.Departamento__r.Name : 'Sem Departamento';
                String categoria = m.Categoria__r != null ? m.Categoria__r.Name : 'Sem Categoria';

                if (m.Tipo__c == 'Receita') {
                    totalReceitas += valor;
                } else {
                    totalDespesas += valor;

                    Decimal atualDep = gastosPorDepartamento.containsKey(departamento)
                        ? gastosPorDepartamento.get(departamento) : 0;
                    gastosPorDepartamento.put(departamento, atualDep + valor);

                    Decimal atualCat = gastosPorCategoria.containsKey(categoria)
                        ? gastosPorCategoria.get(categoria) : 0;
                    gastosPorCategoria.put(categoria, atualCat + valor);
                }
            }

            List<Map<String, Object>> listaDepartamentos = new List<Map<String, Object>>();
            for (String nome : gastosPorDepartamento.keySet()) {
                listaDepartamentos.add(new Map<String, Object>{
                    'nome'  => nome,
                    'total' => gastosPorDepartamento.get(nome)
                });
            }

            List<Map<String, Object>> listaCategorias = new List<Map<String, Object>>();
            for (String nome : gastosPorCategoria.keySet()) {
                listaCategorias.add(new Map<String, Object>{
                    'nome'  => nome,
                    'total' => gastosPorCategoria.get(nome)
                });
            }

            Map<String, Object> resultado = new Map<String, Object>{
                'total_receitas'         => totalReceitas,
                'total_despesas'         => totalDespesas,
                'saldo'                  => totalReceitas - totalDespesas,
                'total_movimentacoes'    => movimentacoes.size(),
                'gastos_por_departamento'=> listaDepartamentos,
                'gastos_por_categoria'   => listaCategorias
            };

            return JSON.serialize(resultado);

        } catch (Exception e) {
            throw new AuraHandledException('Erro ao buscar dados: ' + e.getMessage());
        }
    }

    private static List<Movimentacao__c> buscarTodasMovimentacoes() {
        return [
            SELECT Id, Valor__c, Tipo__c,
                   Departamento__r.Name,
                   Categoria__r.Name
            FROM Movimentacao__c
            ORDER BY Data__c DESC
            LIMIT 2000
        ];
    }
}