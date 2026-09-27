import os
import cloudinary
import cloudinary.uploader
from typing import List, Optional
from dotenv import load_dotenv

# Carrega as variáveis de ambiente a partir do arquivo .env
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text

# Módulos internos da aplicação
from app import models, schemas, database
from app.auth import verificar_senha, criar_token_acesso, obter_usuario_atual

# Configuração da credencial do serviço Cloudinary para armazenamento de imagens
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Cria a estrutura de tabelas no banco de dados, caso ainda não existam
models.Base.metadata.create_all(bind=database.engine)

# Instancia a aplicação FastAPI com metadados básicos
app = FastAPI(
    title='Dev Hub API',
    description='API para gerenciamento do portfólio Dev Hub',
    version='1.0.0',
)

# Configuração de CORS para permitir a comunicação com o front-end
origens_permitidas = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origens_permitidas,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rota de verificação de disponibilidade do servidor
@app.get('/')
def rota_raiz():
    """Valida se o servidor da API está operando normalmente."""
    return {'Mensagem': 'API do Dev Hub rodando com sucesso!'}


# ==============================================================================
# 1. ROTAS DE VISITAS E MÉTRICAS DO DASHBOARD ADMIN
# ==============================================================================

@app.post('/api/visitas/registrar')
def registrar_visita(db: Session = Depends(database.get_db)):
    """Incrementa o contador global de acessos na tabela de visitas."""
    try:
        db.execute(text("UPDATE visitas SET total_visitas = total_visitas + 1 WHERE id = 1"))
        db.commit()
        return {"mensagem": "Visita registrada com sucesso!"}
    except Exception as e:
        db.rollback()
        return {"mensagem": "Aviso ao registrar visita", "detalhe": str(e)}


@app.get('/api/metrics')
def obter_metricas(
    db: Session = Depends(database.get_db), 
    usuario_logado: str = Depends(obter_usuario_atual)
):
    """Calcula e retorna os indicadores das métricas do painel administrativo."""
    total_projetos = db.query(models.Projeto).count()

    res_categorias = db.execute(text("SELECT COUNT(DISTINCT categoria) AS total FROM projetos")).fetchone()
    categorias_ativas = res_categorias[0] if res_categorias and res_categorias[0] is not None else 0

    res_visitas = db.execute(text("SELECT total_visitas FROM visitas WHERE id = 1")).fetchone()
    total_visitas = res_visitas[0] if res_visitas and res_visitas[0] is not None else 0

    return {
        "total_projetos": total_projetos,
        "categorias_ativas": categorias_ativas,
        "total_visitas": total_visitas
    }


# ==============================================================================
# 2. ROTAS DE PROJETOS (CRUD VIA FORM-DATA / MULTIPART)
# ==============================================================================

@app.get('/api/projetos', response_model=List[schemas.Projeto])
def listar_projetos(db: Session = Depends(database.get_db)):
    """Retorna a listagem completa de projetos cadastrados no sistema."""
    return db.query(models.Projeto).all()


@app.get('/api/projetos/{id}', response_model=schemas.Projeto)
def buscar_projeto(id: int, db: Session = Depends(database.get_db)):
    """Localiza um projeto específico a partir da sua chave primária (ID)."""
    projeto = db.query(models.Projeto).filter(models.Projeto.id == id).first()
    if not projeto:
        raise HTTPException(status_code=404, detail=f'Projeto com ID {id} não encontrado')
    return projeto


@app.post('/api/projetos', response_model=schemas.Projeto, status_code=201)
async def cadastrar_projetos(
    titulo: str = Form(...),
    subtitulo: Optional[str] = Form(""),
    categoria: str = Form(...),
    status: str = Form("Em Produção"),
    descricao: str = Form(...),
    demo_url: Optional[str] = Form(""),
    github_url: Optional[str] = Form(""),
    imagem: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db),
    usuario_logado: str = Depends(obter_usuario_atual)
):
    """
    Recebe os dados multipart/form-data do front-end, faz o upload do arquivo
    de imagem para o Cloudinary (caso fornecido) e registra o novo projeto no banco.
    """
    imagem_url = None

    if imagem:
        try:
            conteudo = await imagem.read()
            resultado = cloudinary.uploader.upload(conteudo, folder='dev_hub')
            imagem_url = resultado.get('secure_url')
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao processar imagem no Cloudinary: {str(e)}")

    novo_projeto = models.Projeto(
        titulo=titulo,
        subtitulo=subtitulo,
        categoria=categoria,
        status=status,
        descricao=descricao,
        demo_url=demo_url,
        github_url=github_url,
        imagem_url=imagem_url
    )

    db.add(novo_projeto)
    db.commit()
    db.refresh(novo_projeto)

    return novo_projeto


@app.put('/api/projetos/{id}', response_model=schemas.Projeto)
async def atualizar_projeto(
    id: int,
    titulo: str = Form(...),
    subtitulo: Optional[str] = Form(""),
    categoria: str = Form(...),
    status: str = Form("Em Produção"),
    descricao: str = Form(...),
    demo_url: Optional[str] = Form(""),
    github_url: Optional[str] = Form(""),
    imagem: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db),
    usuario_logado: str = Depends(obter_usuario_atual)
):
    """
    Atualiza as informações de um projeto existente. Se um novo arquivo de imagem
    for enviado, substitui a URL atual com o novo link gerado pelo Cloudinary.
    """
    projeto = db.query(models.Projeto).filter(models.Projeto.id == id).first()

    if not projeto:
        raise HTTPException(status_code=404, detail=f'Projeto com ID {id} não encontrado')

    # Atualiza os dados de texto
    projeto.titulo = titulo
    projeto.subtitulo = subtitulo
    projeto.categoria = categoria
    projeto.status = status
    projeto.descricao = descricao
    projeto.demo_url = demo_url
    projeto.github_url = github_url

    # Processa nova capa apenas se enviada
    if imagem:
        try:
            conteudo = await imagem.read()
            resultado = cloudinary.uploader.upload(conteudo, folder='dev_hub')
            projeto.imagem_url = resultado.get('secure_url')
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao atualizar imagem no Cloudinary: {str(e)}")

    db.commit()
    db.refresh(projeto)
    return projeto


@app.delete('/api/projetos/{id}', status_code=204)
def deletar_projeto(
    id: int, 
    db: Session = Depends(database.get_db), 
    usuario_logado: str = Depends(obter_usuario_atual)
):
    """Remove permanentemente um projeto do banco de dados pelo seu ID."""
    projeto = db.query(models.Projeto).filter(models.Projeto.id == id).first()

    if not projeto:
        raise HTTPException(status_code=404, detail=f'Projeto com ID {id} não encontrado')

    db.delete(projeto)
    db.commit()
    return None


# ==============================================================================
# 3. ROTAS DE AUTENTICAÇÃO (LOGIN & LOGOUT)
# ==============================================================================

@app.post('/api/login')
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(database.get_db)
):
    """Valida as credenciais do usuário e gera o token de acesso JWT."""
    usuario = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()

    if not usuario or not verificar_senha(form_data.password, usuario.senha_hash):
        raise HTTPException(status_code=401, detail='E-mail ou senha incorretos. Acesso negado!')

    token = criar_token_acesso(dados={'sub': usuario.email})
    return {'access_token': token, 'token_type': 'bearer'}


@app.post('/api/logout')
def logout(response: Response):
    """Encerra a sessão removendo o cookie HTTP-only do navegador."""
    response.delete_cookie("access_token")
    return {"mensagem": "Logout realizado com sucesso!"}


# ==============================================================================
# 4. ROTA DE UPLOAD DE IMAGENS AVULSAS (CLOUDINARY)
# ==============================================================================

@app.post('/api/upload')
async def upload_imagem(
    file: UploadFile = File(...), 
    usuario_logado: str = Depends(obter_usuario_atual)
):
    """Realiza o upload individual de uma imagem diretamente para o Cloudinary."""
    try:
        conteudo = await file.read()
        resultado = cloudinary.uploader.upload(conteudo, folder='dev_hub')
        return {'url': resultado.get('secure_url')}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Erro ao enviar imagem: {str(e)}')