import os
from dotenv import load_dotenv
import jwt 

from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer

from passlib.context import CryptContext #CryptContext: serve para embaralhar as senhas


# Configuração do algoritmo de criptografia (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#Função para transformart a senha limpa em um Hash que é o código maluco

def gerar_hash_senha(senha: str):
    return pwd_context.hash(senha)

#função para comparar se a senha digitada bate com o Hash salvo no banco

def verificar_senha(senha_plana: str, senha_hash: str):
    return pwd_context.verify(senha_plana, senha_hash)

#Configurações do JWT (O crachá) do .env
SECRET_KEY = os.getenv("SECRET_KEY")#chave para o meu projeto
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 120)) #O token dura 2 horas
#ensina o FastAPI onde o React deve ir para conseguir um token 

#oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/login') (não usamos mais a leitura padrao do FastAPI)

#Funçao que fabrica o Token
def criar_token_acesso(dados: dict):
    #fazemos uma cópia dos dados(payload) para não alterar o original
    dados_para_codificar = dados.copy()

    #Calculamos que horas são agora + 120 minutos
    expiracao = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    #Adicionamos a data de validade (exp) dentro do payload
    dados_para_codificar.update({'exp': expiracao})

    #O pyJWT junta o payload, a chave secreta e o algoritomo para carimbar o token
    token_jwt = jwt.encode(dados_para_codificar, SECRET_KEY, algorithm=ALGORITHM)

    return token_jwt

#Criando a função do segurança, apenas o adm pode fazer as atualização,remover ou criar um projeto

#def obter_usuario_atual(token:str = Depends(oauth2_scheme)):
    try:
        #tenta ler o crachá usando a chave secreta e o algoritmo
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')

        if email is None:
            raise HTTPException(status_code=401, detail='Crachá inválido. Faltam dados.')
        return email # se deu tudo certo, libera o e-mail do usuário
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Seu tempo acabou! Faça login novamente.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Crachá falsificado ou inválido.")

#atualizando a função obter_usuario_atual para armazenar o token no navegador e deixar ele invisivel no frontend
def obter_usuario_atual(request: Request):
    #tenta pegar o token do 'cofre' (cookies) do navegador
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail='Crachá não encontrado, Faça login')

    try:
        #Descriptografa o token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')

        if email is None:
            raise HTTPException(status_code=401, detail='Crachá inválido. Faltam dados.')

        return email
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Seu tempo acabou! Faça login novamente.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Crachá falsificado ou inválido.")