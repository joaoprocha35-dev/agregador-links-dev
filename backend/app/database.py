# Importa o criador de conexões e o configurador de sessões da biblioteca SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# String de conexão: define o banco (mysql+pymysql), usuario (root), senha, endereço local e o nome do banco (dev_hub)

DATABASE_URL = "mysql+pymysql://root:Joao.dev30@localhost:3306/dev_hub"

# Cria o motor de comunicação (Engine) que vai abrir os canais de dados com o MySQL
engine = create_engine(DATABASE_URL)

# Cria a fábrica de sessões (SessionLocal), usada para abrir e fechar conversas com o banco em cada requisição
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cria a classe base que servirá de molde para mapearmos nossas tabelas em código Python do arquivo models.py
Base = declarative_base()

# Função utilitária (Dependency) que abre uma sessão no banco para uma rota e a fecha automaticamente após o uso
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()