from pydantic import BaseModel
from typing import List

class MovimentacaoInput(BaseModel):
    movimentacoes: List[dict]
    orcamentos: dict

class InsightOutput(BaseModel):
    total_receitas: float
    total_despesas: float
    saldo: float
    maior_gasto_categoria: str
    maior_gasto_departamento: str
    alertas_orcamento: List[str]
    insights: List[str]