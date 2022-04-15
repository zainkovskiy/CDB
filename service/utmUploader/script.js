class UTM {
  constructor(){
    this.input = document.querySelector('.controller__file');
    this.button = document.querySelector('.controller__btn_send');
    this.currentFile = '';
  }

  init(){
    this.input.addEventListener('change', event => this.handlerInput(event));
    this.button.addEventListener('click', event => this.handlerBtn(event));
  }
  handlerInput(event){
    this.currentFile = event.target.files[0];
    document.querySelector('.controller__file-name').innerHTML = this.currentFile.name;
    this.button.classList.remove('controller__btn_disabled');
  }
  handlerBtn(){
    const data = new FormData();
    data.append('file[]', this.currentFile);
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST','https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Services/UTM.php', true);
    xhr.send(data);
    xhr.onload = () => {
      document.querySelector('.controller').innerHTML = `<span class="controller__alert"> Файл успешно отправлен </span>`
    }
  }
}

const utm = new UTM();
utm.init();