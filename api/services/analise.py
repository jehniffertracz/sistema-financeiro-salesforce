import pandas as pd
from typing import List

def analisar_movimentacoes(movimentacoes: List[dict], orcamentos: dict) -> dict:
    df = pd.DataFrame(movimentacoes)
    
    df['valor'] = pd.to_numeric(df['valor'], errors='coerce')
    
    total_receitas = df[df['tipo'] == 'Receita']['valor'].sum()
    total_despesas = df[df['tipo'] == 'Despesa']['valor'].sum()
    saldo = total_receitas - total_despesas
    
    gastos_categoria = df[df['tipo'] == 'Despesa'].groupby('categoria')['valor'].sum()
    maior_gasto_categoria = gastos_categoria.idxmax() if not gastos_categoria.empty else 'N/A'
    
    gastos_departamento = df[df['tipo'] == 'Despesa'].groupby('departamento')['valor'].sum()
    maior_gasto_departamento = gastos_departamento.idxmax() if not gastos_departamento.empty else 'N/A'
    
    alertas = []
    gastos_centro = df[df['tipo'] == 'Despesa'].groupby('centro_de_custo')['valor'].sum()
    for centro, gasto in gastos_centro.items():
        if centro in orcamentos and gasto > orcamentos[centro]:
            alertas.append(f'⚠️ {centro} estourou o orçamento! Gasto: R${gasto:.2f} | Orçamento: R${orcamentos[centro]:.2f}')
    
    insights = []
    insights.append(f'Total de Receitas: R${total_receitas:.2f}')
    insights.append(f'Total de Despesas: R${total_despesas:.2f}')
    insights.append(f'Saldo Final: R${saldo:.2f}')
    insights.append(f'Maior categoria de gasto: {maior_gasto_categoria}')
    insights.append(f'Departamento com mais gastos: {maior_gasto_departamento}')
    
    return {
        'total_receitas': round(total_receitas, 2),
        'total_despesas': round(total_despesas, 2),
        'saldo': round(saldo, 2),
        'maior_gasto_categoria': maior_gasto_categoria,
        'maior_gasto_departamento': maior_gasto_departamento,
        'alertas_orcamento': alertas,
        'insights': insights
    }