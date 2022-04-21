class Form{
  constructor() {
    this.container = document.querySelector('.form');
    this.obj = {};
  }
  init(){
    this.container.insertAdjacentHTML('beforeend', new Render(this.obj).init());
    new Handler(this.container).init();
  }
  async getJson(){
    const request1Cnamed = {
      "action" : "getStart",
      "reqNumber" : UID,
      "author" : login
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const raw = JSON.stringify(request1Cnamed);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/object/pars.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    this.obj = jsonA;
    console.log(jsonA)
  }
}

class Render{
  constructor(obj) {
    this.obj = obj;
  }
  init(){
    return `<p class="form__title">Для корректной записи звонка, ваша задача позвонить с корпоративного номера телефона</p>
            <div class="form__item">
              <span class="form__subtitle">Имя</span>
              <input name="FIRST_NAME" class="form__input" type="text" autocomplete="off"
              value="${this.obj.FIRST_NAME ? this.obj.FIRST_NAME : ''}">
            </div>
            <div class="form__item">
              <span class="form__subtitle">Телефон (в формате 79007779977)</span>
              <input name="PHONE" class="form__input" type="text" autocomplete="off"
              value="${this.obj.PHONE ? this.obj.PHONE : ''}">
            </div>
            <div class="button__items">
              <button data-form="makeDeal" data-text="Создать сделку" class="button__item button__item_green">создать сделку</button>
              <button data-form="phoneIncorrect" data-text="Не правильный номер" class="button__item button__item_red">не правильный номер</button>
              <button data-form="phoneNotAnswer" data-text="Не дозвонился" class="button__item button__item_red">не дозвонился</button>
              <button data-form="clientNahuiPoslal" data-text="Отказ клиента" class="button__item button__item_red">отказ клиента</button>
              <button data-form="otherAgency" data-text="Другое агенство" class="button__item button__item_red">другое агенство</button>
            </div>`
  }
}

class Handler{
  constructor(container) {
    this.container = container;
  }
  init(){
    this.container.addEventListener('click', event => {
      if (event.target.tagName === 'BUTTON'){
        if (event.target.dataset.form){
          this.openModule(event.target.dataset.form, event.target.dataset.text);
        }
      } else {
          return
      }
    })
  }
  validForm(allInputs, action){
    const library = {
      FIRST_NAME: true,
      PHONE: true,
    }
    const libraryRegExp = {
      FIRST_NAME: /^[^A-Za-z0-9]+$/,
      PHONE: /^7\d{10}$/,
    }
    for (let input of allInputs){
      if (action === 'phoneNotAnswer'){
        if (input.name === 'PHONE'){
          if (input.value.length === 0){
            library[input.name] = false;
            input.classList.add('isValid');
          } else {
            if (libraryRegExp[input.name].test(input.value)){
              library[input.name] = true;
              input.classList.remove('isValid');
            } else {
              library[input.name] = false;
              input.classList.add('isValid');
            }
          }
        }
      } else {
        if (input.value.length === 0){
          library[input.name] = false;
          input.classList.add('isValid');
        } else {
          if (libraryRegExp[input.name].test(input.value)){
            library[input.name] = true;
            input.classList.remove('isValid');
          } else {
            library[input.name] = false;
            input.classList.add('isValid');
          }
        }
      }
    }

    let countTrue = 0;
    for (let key in library){
      if (library[key] === true){
        countTrue++;
      }
    }
    return countTrue === Object.keys(library).length;
  }
  setNewValue(allInputs){
    for (let input of allInputs){
      form.obj[input.name] = input.value;
    }
  }
  async sendAction(action){
    const request1Cnamed = {
      "action" : action,
      "data" : form.obj,
      "author" : login,
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const raw = JSON.stringify(request1Cnamed);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/object/pars.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    console.log(jsonA)
    return jsonA;
  }

  openModule(action,text){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="module">
                          <span class="module__close"></span>
                          <div class="module__wrap"> 
                            <p class="module__text">${text}?</p>
                            <div class="module__btn-group"> 
                              <button data-name="${action}" class="ui-btn ui-btn-primary-dark">Да</button>                           
                              <button data-answer="no"  class="ui-btn ui-btn-danger-light">Нет</button>    
                            </div>                       
                          </div>                    
                    </div>`
    this.container.insertAdjacentHTML('beforebegin', layout);
    this.handlerModule();
  }
  handlerModule(){
    const module = document.querySelector('.module');
    module.addEventListener('click', event => {
      if (event.target.dataset.answer === 'no'){
        this.closeModule(module);
      } else if (event.target.dataset.name){
          if (this.validForm(document.querySelectorAll(`INPUT[type='text']`), event.target.dataset.name)){
            this.setNewValue((document.querySelectorAll(`INPUT[type='text']`)));
            this.setLoader();
            this.sendAction(event.target.dataset.name).then(data => {
              this.removeLoader();
              if (data.result === 'ok' && data.deal){
                const contact = document.querySelector(`INPUT[name='PHONE']`).value;
                // location=`https://crm.centralnoe.ru/objectCard/add/?action=frompars&id=${UID}&contact=${contact}&deal=${data.deal}`;
                location=`https://crm.centralnoe.ru/CDB/object/card/add/?action=frompars&id=${UID}&contact=${contact}&deal=${data.deal}`;
              } else {
                BX.SidePanel.Instance.close();
              }
            })
          } else {
            this.closeModule(module);
          }
      }
    })
  }
  closeModule(module){
    const htmlDom = document.querySelector('HTML');
    htmlDom.removeAttribute("style");
    module.remove();
  }

  setLoader(){
    const currentY = window.pageYOffset;
    const loader = `<div style="top: ${currentY}px" class="loader"><div class="loader__img"></div><div>`;
    document.body.insertAdjacentHTML('beforeend', loader);
    document.body.setAttribute('style', 'overflow: hidden;');
  }
  removeLoader(){
    document.body.removeAttribute('style');
    document.querySelector('.loader').remove();
  }
}

const form = new Form();
form.getJson().then(() => {
  form.init();
});
// form.init();
