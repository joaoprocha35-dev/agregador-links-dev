# Tipos de dados e regras para montar as colunas no banco
from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
# Funções do banco, como capturar a data e hora atual
from sqlalchemy.sql import func
# Configuração de relacionamentos entre as tabelas
from sqlalchemy.orm import relationship
# Importação do modelo base do nosso database.py
from .database import Base

# Tabela de usuários administradores
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    senha_hash = Column(String(255), nullable=False)
    criado_em = Column(TIMESTAMP, server_default=func.now())

# Tabela de projetos do portfólio
class Projeto(Base):
    __tablename__ = "projetos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(150), nullable=False)
    subtitulo = Column(String(200))
    descricao = Column(Text)
    categoria = Column(String(50), nullable=False)
    imagem_url = Column(String(500))
    demo_url = Column(String(500))
    github_url = Column(String(500))
    criado_em = Column(TIMESTAMP, server_default=func.now())

    # Conecta o projeto às suas tecnologias e exclui os filhos caso o projeto seja deletado
    tecnologias = relationship("Tecnologia", back_populates="projeto", cascade="all, delete-orphan")

# Tabela de badges de tecnologia ligadas a cada projeto
class Tecnologia(Base):
    __tablename__ = "tecnologias"

    id = Column(Integer, primary_key=True, index=True)
    projeto_id = Column(Integer, ForeignKey("projetos.id", ondelete="CASCADE"), nullable=False)
    nome = Column(String(50), nullable=False)

    # Mantém o vínculo com a tabela pai de projetos
    projeto = relationship("Projeto", back_populates="tecnologias")