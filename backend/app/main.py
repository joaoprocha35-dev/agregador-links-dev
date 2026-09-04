from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, database

#cria as tabelas no MySQL automaticamente (se ainda não existirem)
models.Base.metadata.create_all(bind=database.engine)

#inicializa o motor da API
app = FastAPI(
    title= 'Dev Hub API',
    description= 'API do portfólio Dev Hub',
    version= '1.0.0',
)
#Rota de teste na raiz da aplicação
@app.get('/')
def rota_raiz():
    return {'Mensagem' : 'API do Dev Hub rodando com sucesso!'}

#Função GErenciadora de Conexão (Abre e fehca a sessão)
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

#Rota para listar todos os projetos cadastrados
@app.get('/api/Projetos', response_model=List[schemas.Projeto])
def listar_projetos(db: Session = Depends(get_db)):
    projetos = db.query(models.Projeto).all()
    return projetos


#Rota para cadastrar um novo projeto no banco de dados
@app.post('/api/projetos',response_model=schemas.Projeto, status_code=201)
def cadastrar_projetos(projeto: schemas.ProjetoCreate, db: Session = Depends(get_db)):
    #1- pegando os dados validados (schemas) e desempacotando para o molde do banco models
    novo_projeto = models.Projeto(**projeto.model_dump())

    #2- Eu coloco esse novo projeto na 'fila de espera' da sessão do banco
    db.add(novo_projeto)

    #3- Eu aperto o botão de 'salvar' para gravar definitivamente na linha do MySQL
    db.commit()

    #4- Busca o projeto recém-salvo para pegar informações automáticas (como o ID) que o MySQL gerou)
    db.refresh(novo_projeto)

    #5- Devolvo o projeto completo (agora com ID) de volta para o Front-end

    return novo_projeto