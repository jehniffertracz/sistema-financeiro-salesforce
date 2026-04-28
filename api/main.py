from fastapi import FastAPI
from routers import movimentacoes

app = FastAPI(
    title='Sistema Financeiro',
    description='API de análise financeira empresarial',
    version='1.0.0'
)

app.include_router(
    movimentacoes.router,
    prefix='/api',
    tags=['Movimentacoes']
)

@app.get('/')
def root():
    return {'mensagem': 'API do Sistema Financeiro está rodando!'}