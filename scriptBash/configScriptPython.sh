#!/bin/bash

# cria uma pasta projeto na instacia da nuvem
# manda esse arquivo por scp na pasta 
# da permissao de chmod +x configScriptPython.sh
# executa ele ./configScriptPython.sh
# se nn executar e vc enviou um arquivo cujo a origem era de um pc windows, execute estes comandos e rode novamente: sudo apt update | sudo apt install dos2unix | dos2unix configScriptPython.sh

# os q's são de quiet (silencio) para mostrar menos texto (por mais q monstre uma porrada ainda assim)
# e os y's são para não ficar fazendo perguntas no meio dos comandos

# Atualizar a máquina
echo -e "\033[41;1;37m Atualizando Sistema... \033[0m"
sudo apt update -qq -y
sudo apt upgrade -qq -y

# clonar repositório 
echo -e "\033[41;1;37m Clonando Repositório... \033[0m"
git clone --quiet https://github.com/InfraWatch-inc/scripts-client.git
git clone --quiet https://github.com/InfraWatch-inc/java.git
git clone --quiet https://github.com/InfraWatch-inc/database.git

# instalando mysql
echo -e "\033[41;1;37m Instalando MYSQL Server... \033[0m"
sudo apt -qq -y install mysql-server
sudo systemctl start mysql.service
sudo systemctl enable mysql

# Atualizar a máquina
echo -e "\033[41;1;37m Atualizando Sistema para aplicar MYSQL Server... \033[0m"
sudo apt update -qq -y
sudo apt upgrade -qq -y

# configurando MYSQL
echo -e "\033[41;1;37m Criando e estruturando BD infrawatch... \033[0m"
sudo mysql < InfraWatch-inc/database/script.sql

# Liberar a porta 3306 para qualquer IP
echo -e "\033[41;1;37m Liberar 3306 do Servidor de Banco... \033[0m"
sudo iptables -A INPUT -p tcp --dport 3306 -j ACCEPT

# Salvar as regras de iptables
sudo apt-get update
sudo apt-get install -y iptables-persistent

sudo netfilter-persistent save
sudo netfilter-persistent reload

# Criar usuários MYSQL
echo -e "\033[41;1;37m Criando Usuários do Banco... \033[0m"
sudo mysql -e"CREATE USER 'infra_root'@'%' IDENTIFIED BY 'Urubu100#';"
sudo mysql -e"GRANT ALL PRIVILEGES ON infrawatch.* TO 'plc_root'@'%';"
sudo mysql -e"FLUSH PRIVILEGES;"

sudo mysql -e"CREATE USER 'insert_user'@'%' IDENTIFIED BY 'Urubu100#';"
sudo mysql -e"GRANT INSERT ON infrawatch.* TO 'insert_user'@'%';"
sudo mysql -e"FLUSH PRIVILEGES;"

sudo mysql -e"CREATE USER 'select_user'@'%' IDENTIFIED BY 'Urubu100#';"
sudo mysql -e"GRANT SELECT ON PlcVision.* TO 'select_user'@'%';"
sudo mysql -e"FLUSH PRIVILEGES;"

sudo mysql -e"CREATE USER 'update_user'@'%' IDENTIFIED BY 'Urubu100#';"
sudo mysql -e"GRANT UPDATE ON PlcVision.* TO 'update_user'@'%';"
sudo mysql -e"FLUSH PRIVILEGES;"

sudo mysql -e"CREATE USER 'delete_user'@'%' IDENTIFIED BY 'Urubu100#';"
sudo mysql -e"GRANT DELETE ON PlcVision.* TO 'delete_user'@'%';"
sudo mysql -e"FLUSH PRIVILEGES;"

# Instalar pip do Python 
echo -e "\033[41;1;37m Instalando Python e Pip... \033[0m"
sudo apt install -qq -y python3-pip

# Instalar virtualenv 
echo -e "\033[41;1;37m Instalando Virtualenv... \033[0m"
sudo apt install -qq -y python3-virtualenv

# Criar virtualenv
echo -e "\033[41;1;37m Criando Virtualenv... \033[0m"
python3 -m virtualenv InfraWatch-inc/scripts-client/script_captura/env

# Iniciando ambiente virtual
echo -e "\033[41;1;37m Iniciar Ambiente Virtual... \033[0m"
source InfraWatch-inc/scripts-client/script_captura/env/bin/activate

# Instalar bibliotecas Python necessárias
echo -e "\033[41;1;37m Instalando bibliotecas Python... \033[0m"
pip3 install --quiet --no-input psutil==7.0.0 mysql-connector-python==9.2.0

# rodar o script python
echo -e "\033[41;1;37m Rondando Script Python... \033[0m"
chmod 777 ./InfraWatch-inc/scripts-client/script_captura/script_captura_adaptado.py
python3 ./InfraWatch-inc/scripts-client/script_captura/script_captura_adaptado.py