#importando o CORS
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, Depends, HTTPException #<-  HTTPException tratar erros de requisição

from fastapi.security import OAuth2PasswordRequestForm #força o FastAPI a usar a ferramenta oficial 
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, database
#from app.auth import gerar_hash_senha: não precisamos dela pois já códificamos a senha que já foi criada no banco

from app.auth import verificar_senha, criar_token_acesso,obter_usuario_atual

#cria as tabelas no MySQL automaticamente (se ainda não existirem)
models.Base.metadata.create_all(bind=database.engine)

#inicializa o motor da API
app = FastAPI(
    title= 'Dev Hub API',
    description= 'API do portfólio Dev Hub',
    version= '1.0.0',
)

## Configuração do CORS (O Porteiro da API)
origens_permitidas = [
    "http://localhost:5173", #<- endereço do react
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origens_permitidas,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#Rota de teste na raiz da aplicação
@app.get('/')
def rota_raiz():
    return {'Mensagem' : 'API do Dev Hub rodando com sucesso!'}

#Função Gerenciadora de Conexão (Abre e fecha a sessão)
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
def cadastrar_projetos(projeto: schemas.ProjetoCreate, db: Session = Depends(get_db),usuario_logado: str = Depends(obter_usuario_atual)): # o usuario_logado é o segurança da porta.

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

#Rota para buscar apenas um projeto específico pelo ID
@app.get('/api/projetos/{id}', response_model=schemas.Projeto)
def buscar_projeto(id: int, db: Session = Depends(get_db)):
    projeto = db.query(models.Projeto).filter(models.Projeto.id == id).first()

    if not projeto:
        raise HTTPException(status_code=404, detail=f'Projeto com ID {id} não encontrado')
    return projeto

#Rota para atualizar um projeto específico pelo ID
@app.put('/api/projetos/{id}',response_model=schemas.Projeto)
def atualizar_projeto(id: int, projeto_atualizado: schemas.ProjetoCreate, db: Session = Depends(get_db)):
    #Eu procuro no banco o projeto que o usuário quer editar
    projeto = db.query(models.Projeto).filter(models.Projeto.id == id).first()

    #Se eu não achar esse projeto, eu travo a operação e aviso que não existe
    if not projeto:
        return HTTPException(status_code=404, detail=f'Projeto com ID {id} não encontrado')

    #Se eu achar, eu abro o 'pacote' do projeto_atualizado e atualizo os campos do projeto que eu busquei no banco
    for Key, value in projeto_atualizado.model_dump().items():
        setattr(projeto, Key, value)

    #Eu aperto o botão de 'salvar' para gravar a edição no MySQL
    db.commit()

    #E por ultimo, eu atualizo a sessão do projeto com os dados mais recentes do banco e devolvo para o front-end
    db.refresh(projeto)
    return projeto

#Rota para deletar um projeto existente pelo ID
@app.delete('/api/projetos/{id}', status_code=204)
def deletar_projeto(id: int, db: Session = Depends(get_db)):

    # Eu procuro o projeto no banco de dados usando o ID da URL
    projeto = db.query(models.Projeto).filter(models.Projeto.id == id).first()

    # Se não encontrar, eu travo a operação e aviso que deu erro 404
    if not projeto:
        raise HTTPException(status_code=404,detail=f'Projeto com ID {id} não encontrado')

    # Se for encontrado, eu marco esse projeto para ser apagado da tabela do MySQL
    db.delete(projeto)

    #confirma a exclusão no banco de dados
    db.commit()

    #EU não devolvo nada para o front-end, apenas o status code 204 que indica que a operação foi bem sucedida e não há conteúdo para retornar
    return None

@app.post('/api/login')
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)): 

    # Isso faz procurar se existe alguém com esse e-mail no banco
    usuario = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()

    # Se o e-mail não existir Ou a senha estiver errada, barrar na porta (Erro 401)
    if not usuario or not verificar_senha(form_data.password, usuario.senha_hash):
        raise HTTPException(status_code=401, detail='E-mail ou senha incorretos. Acesso negado!')

    # Se a senha estiver correta, iremos passar os 'dados' para a máquina de crachá(auth.py)
    token = criar_token_acesso(dados={'sub': usuario.email})

    # Entregaremos o crachá na mão do usuário (react)
    return {'access_token': token, 'token_type': 'bearer'}