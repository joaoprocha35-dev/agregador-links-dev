import os
from dotenv import load_dotenv
import jwt 
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

load_dotenv()

# Configuração do algoritmo de criptografia (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Função para transformar a senha limpa em um Hash
def gerar_hash_senha(senha: str):
    return pwd_context.hash(senha)

# Função para comparar se a senha digitada bate com o Hash salvo no banco
def verificar_senha(senha_plana: str, senha_hash: str):
    return pwd_context.verify(senha_plana, senha_hash)

# Configurações do JWT do .env
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 120)) 

# Ensina o FastAPI que o token vai chegar pelo cabeçalho (Header) padrão Bearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/login')

# Função que fabrica o Token
def criar_token_acesso(dados: dict):
    dados_para_codificar = dados.copy()
    expiracao = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    dados_para_codificar.update({'exp': expiracao})
    
    token_jwt = jwt.encode(dados_para_codificar, SECRET_KEY, algorithm=ALGORITHM)
    return token_jwt

# O segurança: Agora ele pega o token automaticamente do Header "Authorization: Bearer..."
def obter_usuario_atual(token: str = Depends(oauth2_scheme)):
    try:
        # Tenta ler o crachá usando a chave secreta e o algoritmo
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')

        if email is None:
            raise HTTPException(status_code=401, detail='Crachá inválido. Faltam dados.')
        
        return email # se deu tudo certo, libera o e-mail do usuário
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Seu tempo acabou! Faça login novamente.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Crachá falsificado ou inválido.")