from pydantic import BaseModel
from typing import Optional
from datetime import date

class Movimentacao(BaseModel):
    nome: str
    valor: float
    tipo: str
    data: date
    descricao: Optional[str] = None
    categoria: str
    centro_de_custo: str
    departamento: str
    orcamento: Optional[float] = None