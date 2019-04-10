# Projeto desenvolvido durante a disciplina de Engenharia de Software 
### Ciência da Computação - UFCG
##### GRUPO:
Anarco Quaresma<br>
Evelinne de Carvalho<br>
Helena Dantas<br>
Hiago Fernandes<br> 
Lívia Cavalcanti<br>
Luiz Nascimento<br>
Marcus Costa<br>
Misael Augusto<br>
Rebeca Miranda<br>
Thiago Montenegro<br>
Wagner Magno<br>

-------------------------------------------------------------------------------------

### DESCRIÇÃO DO PROJETO
Uma aplicação web denominada Contare, que tem como finalidade auxiliar o usuário a organizar as finanças de um usuário, permitindo a criação, edição e remoção de despesas pessoais e em grupo.

--------------------------------------------------------------------------------------

### Tutorial de instalação dos artefatos necessários para executar o back-end

#### 1: Instalando o docker (UBUNTU)

O Docker funciona como um conteiner que vai executar o banco de dados MONGODB

Atualize a lista de pacotes:

```sh
$ sudo apt-get update
```
#### 1.1: Instale os pacotes que permitem o apt usar um repositório sobre o HTTPS

```sh
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

#### 1.2: Adicione a chave ofical GPG do Docker
```sh
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

##### 1.2.1: Verifique que você agora possui a chave digital do Docker

```sh
$ sudo apt-key fingerprint 0EBFCD88
```
##### Saída esperada:
```sh
pub   rsa4096 2017-02-22 [SCEA]
      9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
sub   rsa4096 2017-02-22 [S]
```

#### 1.3: Adicione agora o repositório do Docker a sua lista de repositórios

```sh
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

#### 1.4: Atualize novamente sua lista de repositórios

```sh
$ sudo apt-get update
```

#### 1.5: Finalmente, instale o Docker na sua máquina

```sh
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
```

###### Execute o seguinte comando para testar se o Docker foi instalado com sucesso:

```sh
$ sudo docker run hello-world
```

#### 2: Baixar a máquina virtual do MONGODB dentro do Docker

##### Para executar os comandos docker, é necessário ter permissões de administrador do sistema.
##### Aqui será feito o download da máquina virtual do mongo. Talvez este passo demore um pouco.

```sh
$ sudo docker pull mongo
```
#### 3: Subir um novo conteiner com uma máquina virtual rodando uma aplicação MONGODB 

##### O MONGODB não estará executando na sua máquina física, mas em uma máquina virtual invisível para você. Portanto, é necessário conectar a sua máquina física com a máquina virtual. O MONGODB utiliza a porta 27017 para fazer essa comunicação. Então, precisamos redirecionar para a porta 27017 da máquina virtual os dados da porta desejada da máquina física, que neste caso é tambéma porta 27017. 
`-p "porta_da_máquina_física":27017`
```sh
$ sudo docker run --name "nome_da_vm" -p 27017:27017 -d mongo

$ sudo docker ps # exibe as imagens em execução na vm
$ sudo docker ps -a # exibe todas as imagens criadas. Tanto as que estão online como as que estão offline
```

Ao reiniciar seu computador, todas as imagens ficam offline, porém elas já existem. Não é necessrio criá-las novamente.
Para acordar uma vm offline basta executar `$ sudo docker start "nome_da_vm"`








