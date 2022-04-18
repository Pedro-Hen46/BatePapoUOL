let NomeUsuario = ' ';
let PessoaEscolhida = "Todos";
let visibilidade = 'message';


telaLogin(); //TELA DE LOGIN - BONITINHA
 
function telaLogin(){

    const usuario = document.getElementById('login').value;
    if (usuario !== ''){
        document.querySelector('.tela-login').classList.add('none');
        return EntrarServidor(usuario); // Chamando a funcao pra entrar na sala com o nome do input.
    } else alert ('Por favor entre com o nome de usuario antes.');
   
}
function selecionaVisibilidade(elementoclicado){
    
    elementoclicado.classList.toggle('negrito');
}



function EntrarServidor(usuario){    
    let Dados = {name: usuario}; 
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", Dados);
    requisicao.then(tratarSucesso);
    requisicao.catch(erroaoConectar);
    return NomeUsuario = usuario;
}

function tratarSucesso(autenticacao){
        
        buscardados();
        setInterval(ContinuaSala,3000);
}

function erroaoConectar(erro){
    
        alert(`
        ⚠ ATENÇÃO O NOME SELECIONADO SE ENCONTRA EM USO: ⚠

        POR FAVOR COLOQUE UM LOGIN QUE NÃO ESTEJA EM USO.

        CLICAR EM CANCELAR E TENTAR NOVAMENTE.
        `);
        
        location.reload();
 
}

function buscardados(){

        const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages"); 
        promessa.then(processarResposta);   
    
}

function processarResposta(resposta){
    const mensagens = resposta.data;

    let status = document.querySelector(".status");
    let nome = document. querySelector(".status .nome");
    let hora = document. querySelector(".status .hora");
    let texto = document. querySelector(".texto");
    let mensagem = document.querySelector(".conversa");
    let reservada= document.querySelector(".reservada");   
    
    let TamanhoVetor = resposta.data.length;
    const Sala=document.querySelector(".bate-papo");


    Sala.innerHTML = '';

    for (let i=0; i<TamanhoVetor; i++){
        nome = resposta.data[i].from;
        hora = "(" + resposta.data[i].time + ")";
        texto = resposta.data[i].text;

            if (resposta.data[i].type==="status"){ //IF PARA MENSAGEM DE STATUS DO SERVIDOR, AO ENTRAR E SAIR DA SALA
                 Sala.innerHTML += `<div class="status" id="Mensagem${i}">
                <p><span class="hora">${hora}</span> <span class="nome">${nome} </span> <span class="texto">${texto}</span></p>
                </div>    
                `
             } else if (resposta.data[i].type==="message"){         //IF MENSAGEM ENVIADA PARA TODOS NO CHAT...  
                 Sala.innerHTML += `<div class="conversa" id="Mensagem${i}" data-identifier="message" data-identifier="message">
                 <p><span class="hora">${hora}</span> <span class="nome">${nome} </span> para <span class="para">todos</span>: <span class="texto">${texto}</span></p>
                </div>`
            } 
            else {    // ENVIADA DE MANEIRA RESERVADA...
                if (nome === NomeUsuario){
                    Sala.innerHTML += `<div class="reservada" id="Mensagem${i}" data-identifier="message">
                    <p><span class="hora">${hora}</span> <span class="nome">${nome} </span> reservadamente para <span class="para">${resposta.data[i].to}</span>: ${texto}</p>
                    </div>`
                } 
            }   
    } 
    
    const elementoQueQueroQueApareca = document.getElementById("Mensagem99");
    elementoQueQueroQueApareca.scrollIntoView();      

}

function ContinuaSala(){    
    let permanencia = {name: NomeUsuario}
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", permanencia);
    
    const verificandoAtt = setInterval(buscardados,3000); //Buscando mensagens a cada 5s (ainda testando) **Travando meu navegador**
}

function EnviarMensagem(){ 
    
    const Mensagem = document.querySelector(".inputMessage");   
    
    let Mensagem_Enviada = {
                            from: NomeUsuario, 
                            to: PessoaEscolhida, 
                            text: Mensagem.value, 
                            type: visibilidade
                        };
        
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", Mensagem_Enviada);
    requisicao.then(buscardados);
    requisicao.catch(ErroMensagem);
    Mensagem.value = ' ';
}

function ErroMensagem(){
    alert("Voce nao esta conectado para enviar a mensagem, logar e tentar novamente.");
    location.reload();
    console.log('deu erro mane, e agora?');
}

  function recarregaPagina(){
      const decisao = confirm("Tem certeza que deseja sair da sala e voltar ao menu inicial? - [ OK ] PARA SAIR.");
      if (decisao){
        location.reload();
      }
      
  }

  function sidebarmenu(response){
    const menu = document.querySelector('.sidebar-fundo');
    
    menu.classList.remove('none');

    
  }

  function sidebarOff(){
      const menu = document.querySelector('.sidebar-fundo');
      menu.classList.add('none');
  }