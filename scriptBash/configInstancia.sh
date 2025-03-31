#!/bin/bash

# Comados ao abrir instancia:
# ssh -i token.pem ubuntu@dns/ip - conectar cm a instancia (local)
# mkdir producao/  -  criar pasta para guardar o zip q vamos enviar (nuvem)
# scp -i token.pem arquivo.zip ubuntu@dns/ip:producao/ - enviar o zip pra pasta (local)
# cd producao/ - entrar na pasta q criamos (nuvem)
# sudo apt-get install unzip - instalar lib para deszipar arquivo (nuvem)
# unzip arquivo.zip - deszipar o arquivo (nuvem)
# chmod 777 Scripts/configInstancia.sh - dar permissão ao script p rodar (nuvem)
# ./Scripts/configInstancia.sh - rodar o script e rezar muito pra funfar (nuvem)

# os q's são de quiet (silencio) para mostrar menos texto (por mais q monstre uma porrada ainda assim)
# e os y's são para não ficar fazendo perguntas no meio dos comandos

# Atualizar a máquina
echo -e "\033[41;1;37m Atualizando Sistema... \033[0m"
sudo apt update -qq -y
sudo apt upgrade -qq -y

# Instalar Node.js 
echo -e "\033[41;1;37m  Instalando NodeJS... \033[0m" # formatacao de texto vermelho pra deixar destacado
sudo apt install -qq -y nodejs npm

# Instalar pip do Python 
echo -e "\033[41;1;37m Instalando Python e Pip... \033[0m"
sudo apt install -qq -y python3-pip

# Instalar virtualenv 
echo -e "\033[41;1;37m Instalando Virtualenv... \033[0m"
sudo apt install -qq -y python3-virtualenv

# Criar virtualenv
echo -e "\033[41;1;37m Criando Virtualenv... \033[0m"
python3 -m virtualenv Scripts/env

# Iniciando ambiente virtual
echo -e "\033[41;1;37m Iniciar Ambiente Virtual... \033[0m"
source Scripts/env/bin/activate

# Instalar bibliotecas Python necessárias
echo -e "\033[41;1;37m Instalando bibliotecas Python... \033[0m"
pip3 install --quiet --no-input psutil==7.0.0 mysql-connector-python==9.2.0

# instalando mysql
echo -e "\033[41;1;37m Instalando MYSQL Server... \033[0m"
sudo apt -qq -y install mysql-server
sudo systemctl start mysql.service
sudo systemctl enable mysql

# Liberar a porta 3306 para qualquer IP
echo -e "\033[41;1;37m Liberar 3306 do Servidor de Banco... \033[0m"
sudo iptables -A INPUT -p tcp --dport 3306 -j ACCEPT

# Salvar as regras de iptables
sudo apt-get update
sudo apt-get install -y iptables-persistent

sudo netfilter-persistent save
sudo netfilter-persistent reload

# configurando MYSQL
echo -e "\033[41;1;37m Criando e estruturando BD infrawatch... \033[0m"
sudo mysql < InfraWatch-inc/database/script.sql

# Criar usuários MYSQL
echo -e "\033[41;1;37m Criando Usuários do Banco... \033[0m"
sudo mysql -e"CREATE USER 'infra_root'@'%' IDENTIFIED BY 'Urubu100#';"
sudo mysql -e"GRANT ALL PRIVILEGES ON infrawatch.* TO 'plc_root'@'%';"
sudo mysql -e"FLUSH PRIVILEGES;"

sudo mysql -e"CREATE USER 'insert_user'@'%' IDENTIFIED BY 'Urubu100#';"
sudo mysql -e"GRANT INSERT ON infrawatch.* TO 'insert_user'@'%';"
sudo mysql -e"FLUSH PRIVILEGES;"

sudo mysql -e"CREATE USER 'select_user'@'%' IDENTIFIED BY 'Urubu100#';"
sudo mysql -e"GRANT SELECT ON infrawatch.* TO 'select_user'@'%';"
sudo mysql -e"FLUSH PRIVILEGES;"

sudo mysql -e"CREATE USER 'update_user'@'%' IDENTIFIED BY 'Urubu100#';"
sudo mysql -e"GRANT UPDATE ON infrawatch.* TO 'update_user'@'%';"
sudo mysql -e"FLUSH PRIVILEGES;"

sudo mysql -e"CREATE USER 'delete_user'@'%' IDENTIFIED BY 'Urubu100#';"
sudo mysql -e"GRANT DELETE ON infrawatch.* TO 'delete_user'@'%';"
sudo mysql -e"FLUSH PRIVILEGES;"

# configurar e rodar projeto node
echo -e "\033[41;1;37m Configurando e inicializando web-data-viz... \033[0m"
npm i && npm audit fix && npm start