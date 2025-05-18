const jiraConfig = {
  baseUrl: process.env.BASE_URL,
  auth: process.env.AUTH,
  email: process.env.EMAIL,
  projectId: process.env.PROJECT_ID,
  projectKey: process.env.PROJECT_KEY
};

const getCredentials = () => {
  return btoa(`${jiraConfig.email}:${jiraConfig.auth}`);
};

const criarIssue = async (assunto, descricao) => {
  try {
    const credentials = getCredentials();
    
    const documentDescription = {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "text": descricao,
              "type": "text"
            }
          ]
        }
      ]
    };

    const resposta = await fetch(`${jiraConfig.baseUrl}/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "fields": { 
          "project": {
            "id": jiraConfig.projectId,
            "key": jiraConfig.projectKey
          },
          "summary": assunto,
          "description": documentDescription,
          "issuetype": {
            "name": "Task"
          }
        }
      })
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(`Erro ao criar issue: ${JSON.stringify(erro)}`);
    }

    return await resposta.json();
  } catch (erro) {
    console.error('Erro no modelo ao criar issue:', erro);
  }
};


const adicionarAnexo = async (issueId, arquivo) =>{
  try{
    const credentials = getCredentials();

    const formData = new FormData();
    formData.append(File, arquivo);

    const resposta = await fetch(`${jiraConfig.baseUrl}/issue/${issueId}/attachments`,  {
      method: 'POST',
      headers: {
        'Autorization': `Basic ${credentials}`,
        'Accept': 'Aplication/json',
        'X-Atlassian-Token': 'no-check'
      },
      body: formData
    });
    
    if(!resposta.ok){
        const erro = await resposta.json();
        throw new Error(`Erro ao adicionar o anexar: ${JSON.stringify(erro)}`);
    }

    return await resposta.json();
  }catch (erro){
      console.error('Erro na Model ao adionar anexo: ', erro);
      throw erro;
  }

}  

module.exports = {
  criarIssue,
  adicionarAnexo
}