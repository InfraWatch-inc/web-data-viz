const { getChamado } = require("../controllers/desempenhoController");

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

async function getChamado(){
    try{
        const recebe = await fetch(`${jiraConfig.baseUrl}/rest/api/3/search?jql=issuetype=Task`)

        if(!recebe.ok){
          return console.error("erro no fetch. ", recebe.json);
        } 
        
        const guardar = {
            // vai pegar o servidor, o status (critico/moderado), o componente e a data
            descricao: await recebe.json.issues.fields.description.content.content.text,
            // status (pendente/ em andamento/ concluído)
            status: await recebe.json().issues.statusCategory.name
        } 
    } catch(erro){
     console.error("erro ao executar. ", erro);
    }
}