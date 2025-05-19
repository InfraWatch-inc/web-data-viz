const jiraConfig = {
    baseUrl: process.env.BASE_URL,
    auth: process.env.AUTH,
    email: process.env.EMAIL,
    projectId: process.env.PROJECT_ID_REB,
    projectKey: process.env.PROJECT_KEY_REB
};

const getCredentials = () => {
  return btoa(`${jiraConfig.email}:${jiraConfig.auth}`);
};

async function getChamado() {
    try {
        const response = await fetch(`${jiraConfig.baseUrl}/search?jql=issuetype=Task`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${getCredentials()}`, 
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Erro no fetch:", errorData);
            return null;
        }

        const data = await response.json();
        
        let descricoes = [];
        let statusArray = [];

        if (data.issues) {
            data.issues.forEach(issue => {
                let descricao = '';
                if (issue.fields.description && issue.fields.description.content) {
                    issue.fields.description.content.forEach(paragraph => {
                        paragraph.content.forEach(contentItem => {
                            if (contentItem.type === 'text') {
                                descricao += contentItem.text + ' '; 
                            }
                        });
                    });
                }

                let status = '';
                if (issue.fields.statusCategory) {
                    status = issue.fields.statusCategory.name;
                }

                descricoes.push(descricao.trim());
                statusArray.push(status);
            });
        }

    } catch (erro) {
        console.error("Erro ao executar:", erro);
        return null;
    }
}


module.exports =  {
  getChamado
}