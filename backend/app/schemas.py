from pydantic import BaseModel, ConfigDict
from typing import List, Optional

# Schema base com os campos comuns de Tecnologia
class TecnologiaBase(BaseModel):
    nome: str

# Schema usado ao enviar uma nova Tecnologia para ser criada
class TecnologiaCreate(TecnologiaBase):
    pass 

# Schema completo retornado pela API (inclui IDs do banco)
class Tecnologia(TecnologiaBase):
    id: int
    projeto_id: int

    model_config = ConfigDict(from_attributes=True)

# Schema base com os campos comuns de Projeto
class ProjetoBase(BaseModel):
    titulo: str
    subtitulo: Optional[str] = None
    descricao: Optional[str] = None
    categoria: str
    imagem_url: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None   

# Schema usado ao cadastrar um novo Projeto
class ProjetoCreate(ProjetoBase):
    tecnologias: Optional[List[TecnologiaCreate]] = []

# Schema completo retornado pela API para o Projeto
class Projeto(ProjetoBase):
    id: int
    tecnologias: List[Tecnologia] = []

    model_config = ConfigDict(from_attributes=True)

# Schema base de Usuário
class UsuarioBase(BaseModel):
    nome: str
    email:str

# Schema para ciraçao e login de usuário
class UsuarioCreate(UsuarioBase):
    senha: str

# Schema de resposta de usuário

class Usuario(UsuarioBase):
    id: int

    model_config = ConfigDict(from_attributes=True)