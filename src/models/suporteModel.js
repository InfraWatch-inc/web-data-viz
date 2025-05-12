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

    const response = await fetch(`${jiraConfig.baseUrl}/issue`, {
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao criar issue: ${JSON.stringify(error)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no modelo ao criar issue:', error);
    throw error;
  }
};

//TODO implementando a lógica do arquivo teste.
