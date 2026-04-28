from fastapi import APIRouter
from schemas.movimentacao import MovimentacaoInput, InsightOutput
from services.analise import analisar_movimentacoes

router = APIRouter()

@router.post('/analisar', response_model=InsightOutput)
def analisar(input: MovimentacaoInput):
    resultado = analisar_movimentacoes(
        movimentacoes=input.movimentacoes,
        orcamentos=input.orcamentos
    )
    return resultado