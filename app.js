const textoEntra = document.querySelector("#TextoEntra");
const textoSai = document.querySelector("#TextoSai");
const Traduzir = document.querySelector("#Traduzir");
const selects = document.querySelectorAll("select");
const botaoFalar = document.getElementById('botaoFalar')
const text = document.querySelector('#TextoEntra')
  const recognition = createRecognition()

  

const linguas = {
  "en-GB": "Inglês",
  "pt-BR": "Português",
  "it-IT": "Italiano",
  "ja-JP": "Japonês",
  "es-ES": "Espanhol"
};

selects.forEach((tag) => {
  for (paises in linguas) {
  let selected;
   if (tag.className.includes("selectFrom") && paises == "pt-BR" ) {
     selected = "selected";
   } else if (tag.className.includes("selectTo") && paises == "en-GB" ) {
  selected = "selected";
 } 

   const option = `<option value="${paises}" ${selected}>${linguas[paises]}</option>`;

  tag.insertAdjacentHTML("beforeend", option);
  }
});

Traduzir.addEventListener("click", () => {
  if (textoEntra.value) {
    TraduzirLoad();
  } else {
    textoSai.value = "";
  }
});

function TraduzirLoad() {
  fetch(
    `https://api.mymemory.translated.net/get?q=${textoEntra.value}&langpair=${selects[0].value}|${selects[1].value}`
  )
    .then((res) => res.json())
    .then((data) => {
      textoSai.value = data.responseData.translatedText;
    });
}

let listening = false
  
  botaoFalar.addEventListener('click', e => {
      if(!recognition) return
  
      listening ? recognition.stop() : recognition.start()
  
      btnFalar.innerHTML = listening? '': 'Parar de escutar'
      TraduzirLoad()
  })

  function createRecognition(){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition  
    const recognition = SpeechRecognition !== undefined ? new SpeechRecognition() : null
    if(!recognition){
        text.innerHTML = "Speech não encontrado"
        return false
    }

    recognition.lang = "pt_BR"

    recognition.onstart = () => console.log('started')
    recognition.onend = () => console.log('finished')
    recognition.onerror = e => console.log('error', e)
    recognition.onresult = e => text.value = e.results[0] [0].transcript
    return recognition


  }


const voices = document.getElementById('voices')
const btnVoz = document.getElementById('botaoVoz')

window.speechSynthesis.onvoiceschanged = () => {
    let voicesList = window.speechSynthesis.getVoices()
    voices.innerHTML = ''

    if (voicesList.length > 0) {
        for (let i = 0; i < voicesList.length; i++) {
            let optionEl = document.createElement('option')
            optionEl.setAttribute('value', i)
            optionEl.innerHTML = voicesList[i].name
            voices.appendChild(optionEl)
        }
    } else {
        // Caso não haja vozes disponíveis
        let optionEl = document.createElement('option')
        optionEl.innerHTML = 'Nenhuma voz disponível'
        voices.appendChild(optionEl)
    }
};

btnVoz.addEventListener('click', () => {
    if (textoSai.value !== "") {
        let ut = new SpeechSynthesisUtterance(textoSai.value)
        let selectedVoiceIndex = voices.value
        ut.voice = window.speechSynthesis.getVoices()[selectedVoiceIndex]
        window.speechSynthesis.speak(ut)
    }
});

function updateStatus(){
    if (window.speechSynthesis.speaking){
        voices.setAttribute('disabled', 'disabled')
        btnVoz.setAttribute('disabled', 'disabled')
    }else{
        voices.removeAttribute('disabled')
        btnVoz.removeAttribute('disabled')
    
    }
}
setInterval(updateStatus,100)
  



