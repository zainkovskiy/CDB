class API{
  constructor() {
    this.apiURL = {
      getInfo: 'https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Call/Server.php',
      getObject: 'https://crm.centralnoe.ru/dealincom/object/reqMaker.php',
      getClient: 'https://crm.centralnoe.ru/dealincom/factory/Clients.php',
      getDeal: 'https://crm.centralnoe.ru/dealincom/factory/Deals.php',
      getRealtor: 'https://crm.centralnoe.ru/dealincom/factory/Users.php',
    };
  }
  async requestToServer(api, requestNamed){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const raw = JSON.stringify(requestNamed);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch(this.apiURL[api], requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    return await response.json();
  }
}

class App{
  constructor() {
    this.checkWork = document.querySelector('.inJob__checkbox');
    this.containerMain = document.querySelector('.main');
    this.sessionNumber = '';
    this.isNotItem = true;
    this.currentItemUID = '';
    this.info = '';
    this.object = '';
    this.deal = '';
    this.client = '';
    this.clientUID = '';
    this.currentSelect = '';
    this.currentOptions = '';
  }
  init(){
    this.checkWork.addEventListener('change', () => {
      if (this.checkWork.checked && this.isNotItem){
        this.startJobs();
      } else {
        if (this.isNotItem){
          document.querySelector('.inJob__load').classList.remove('inJob__next_timer');
          this.finishSession();
        } else {
          this.checkWork.disabled = true;
        }
      }
    });
    this.handler();
  }
  startJobs(){
    api.requestToServer('getInfo', {
      operatorId: loginID,
      action: 'onWorking'
    }).then(startWork => {
      console.log(startWork)
      if (startWork.result){
        this.sessionNumber = startWork.UID;
        this.getItem();
      }
    })
  }
  finishSession(){
    api.requestToServer('getInfo',{
      operatorId: loginID,
      action: 'stopWorking',
      UID: this.sessionNumber,
      comment: document.querySelector('.client__area').value,
    }).then(() => {
      this.clearDom();
      this.clearThis();
    })
  }
  getItem(){
    api.requestToServer('getInfo', {
      operatorId: loginID,
      action: 'getItem',
    }).then(info => {
      this.info = info;
      this.isNotItem = false;
      console.log(info)
      if (info.result){
        this.currentItemUID = info.UID;
        this.clientUID = info.client.UID;
        this.renderClientValue();
        if (info.request){
          api.requestToServer('getObject', {
            action: info.request.type,
            reqNumber: info.request.UID,
            phone: info.request.phone,
            author: login,
          }).then(object => {
            console.log(object)
            this.object = object;
            if (this.object.isFromPars){
              this.object.reqResponsibleRealtor = login;
              this.object.reqResponsibleAutor = login;
              this.object.reqResponsibleAgent = login;
              this.object.reqEditor = login;
            }
            this.renderObject(this.object.reqTypeofRealty);
            this.renderControl();
          })
        } else if (info.deal){
          this.renderDeal(info.deal.UID);
          this.renderControl();
        }
      }
    })
  }
  clearDom(){
    document.querySelector('.client').innerHTML = '';
    document.querySelector('.object').innerHTML = '';
    document.querySelector('.control').innerHTML = '';
  }
  clearThis(){
    this.client = '';
    this.clientUID = '';
    this.currentItemUID = '';
    this.deal = '';
    this.object = '';
    this.isNotItem = true;
  }
  counterTime(){
    document.querySelector('.inJob__load').classList.add('inJob__next_timer');
    document.querySelector('.inJob__next').classList.remove('disabled');
    setTimeout(() => {
      document.querySelector('.inJob__load').classList.remove('inJob__next_timer');
      document.querySelector('.inJob__next').classList.add('disabled');
      if (this.checkWork.checked === true){
        this.getItem();
      }
    }, 5000)
  }

  handler(){
    this.containerMain.addEventListener('click', event => {
      const e = event.target;
      const dataset = event.target.dataset;
      if (e.tagName === 'INPUT' && e.type === 'text'){
        if (this.currentSelect && this.currentSelect === e){
          this.checkOption();
        } else {
          this.openSelectBlock(e);
        }
      } else if (dataset.select === 'option'){
        if (dataset.phone !== 'number'){
          this.object[this.currentSelect.name] = e.innerHTML;
        }
        this.currentSelect.value = e.innerHTML;
        this.checkOption();
      } else if (dataset.open){
        this.openCard(dataset.open, dataset.number, dataset.source);
      } else if (dataset.add){
        this.openModule(dataset.add);
      } else if (dataset.call === "hangup"){
        e.classList.add('disabled');
        this.finishCall(e);
      } else if (dataset.send === 'sms'){
        this.sendSms();
      } else if (dataset.answer){
        this.switchAnswer(dataset.answer);
      } else if (dataset.direction){
        this.setLoader();
        api.requestToServer('getInfo', {
          action: 'finishItem',
          item: this.currentItemUID,
          result: 1,
          data: this.object,
          direction: dataset.direction,
          comment: document.querySelector('.client__area').value,
        }).then(() => {
          this.removeLoader();
          if (this.checkWork.disabled){
            this.finishSession();
            this.checkWork.disabled = false;
          } else {
            this.clearDom();
            this.clearThis();
            this.counterTime();
          }
        });
      } else if (dataset.next === 'item'){
        if (this.checkWork.checked && this.isNotItem){
          document.querySelector('.inJob__load').classList.remove('inJob__next_timer');
          document.querySelector('.inJob__next').classList.add('disabled');
          this.getItem();
        }
      }
    })
    document.body.addEventListener('click', event => {
      if (event.target.dataset.check !== 'elem'){
        this.checkOption();
      }
    })
    document.body.addEventListener('keyup', event => {
      if(event.key === "Escape"){
        const module = document.querySelector('.module');
        if (module){
          this.closeModule(module);
        }
      }
    })
  }
  handlerInput(){
    const allInputs = document.querySelectorAll('INPUT:not(.inJob__checkbox)');
    for (let input of allInputs){
      input.addEventListener('change', event => {
        if (event.target.name === 'reqHouseBuildDate'){
          this.object[event.target.name] = event.target.value.split('-').reverse().join('.');
        } else if (event.target.classList.contains('reqTypeofRealty')){
          this.object[event.target.name] = event.target.value;
          this.renderObject(event.target.value);
        } else if (event.target.name === 'reqTypeofFlat'){
          this.object.reqTypeofRealty = event.target.value;
        }
        else {
          this.object[event.target.name] = event.target.value;
        }
      })
    }
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
  finishCall(){
    api.requestToServer('getInfo', {
      action: 'hangup',
      entityId: this.currentItemUID,
    }).then(data => {
      if (data.result){
        alert('вызов завершен');
      }
    })
  }
  sendSms(){
    const textField = document.querySelector('.client__area-sms');
    const numberPhone = document.querySelector(`INPUT[name='numberPhone']`).value.replace(/[^0-9]/g, ' ');
    api.requestToServer('getInfo', {
      action: 'sendSMS',
      message: textField.value,
      phone: numberPhone,
      entityId: this.currentItemUID,
    }).then(data => {
      if (data.status === 'ok'){
        alert('сообщение отправлено');
        textField.value = '';
      }
    })
  }

  switchAnswer(answer){
    switch (answer){
      case 'agree':
        this.showDirectionButton();
        break;
      case 'fail':
        this.openModule(answer);
        break;
      case 'denial':
        this.openModule(answer);
        break;
      case 'confirms':
        this.sendConfirms('confirms');
        break;
    }
  }
  sendConfirms(action){
    this.setLoader();
    api.requestToServer('getInfo', {
      action: 'finishItem',
      item: this.currentItemUID,
      result: 1,
      data: this.object,
      direction: action,
      comment: document.querySelector('.client__area').value,
    }).then(() => {
      this.removeLoader();
      if (this.checkWork.disabled){
        this.finishSession();
        this.checkWork.disabled = false;
      } else {
        this.clearDom();
        this.clearThis();
        this.counterTime();
      }
    });
  }
  showDirectionButton(){
    const direction = document.querySelector('.object__direction');
    if (!direction) {
      document.querySelector('.object').insertAdjacentHTML('beforeend',
        `<div class="object__direction">
              <button data-direction="left" class="can-btn can-btn_width50">левый</button>
              <button data-direction="right" class="can-btn can-btn_width50">правый</button>
            </div>`);
      document.querySelector('.control').insertAdjacentHTML('beforeend',
        `<div class="control__notification-block">
              <span class="control__notification">Заполните объект и выберете берег на котором расположен объект</span>
            </div>`);
    }
  }
  getFailLayout(){
    return `<p class="module__title">Причина отказа</p>
            <div class="module__task"> 
              <span class="subtitle">Причина</span>
                <div class="module__container"> 
                  <input data-input="pick" class="input__text input__select pick__input" type="text" readonly value="Выбрать">
                  <div class="about__select pick__select inVisible"> 
                    <span data-option="pick" class="about__option">Выбрать</span>
                    <span data-option="pick" class="about__option">Не доступен</span>
                    <span data-option="pick" class="about__option">Сбросил трубку</span>
                    <span data-option="pick" class="about__option">Другое</span>
                  </div>
                </div>
            </div>
            <div class="module__buttons"> 
              <button data-save="reason" data-reason="fail" class="ui-btn ui-btn-success">сохранить</button>
              <button data-name="close" class="ui-btn ui-btn-danger">отменить</button>
            </div>`
  }
  getDenialLayout(){
    return `<p class="module__title">Причина завершение звонка</p>
            <div class="module__task">
              <span class="subtitle">Причина</span>
                <div class="module__container"> 
                  <input data-input="pick" class="input__text input__select pick__input" type="text" readonly value="Выбрать">
                  <div class="about__select pick__select inVisible"> 
                    <span data-option="pick" class="about__option">Выбрать</span>
                    <span data-option="pick" class="about__option">Продано</span>
                    <span data-option="pick" class="about__option">Работает с другим агенством</span>
                    <span data-option="pick" class="about__option">Не хочет работать с ЦАН</span>
                    <span data-option="pick" class="about__option">Другое</span>
                  </div>
                </div>
            </div>
            <div class="module__buttons"> 
              <button data-save="reason" data-reason="denial" class="ui-btn ui-btn-success">сохранить</button>
              <button data-name="close" class="ui-btn ui-btn-danger">отменить</button>
            </div>`
  }

  openModule(layout){
    const moduleLayout = {
      task: this.getTaskLayout(),
      denial: this.getDenialLayout(),
      fail: this.getFailLayout(),
    }
    document.querySelector('HTML').setAttribute("style", "overflow-y:hidden;");
    const currentY = window.pageYOffset;
    document.body.insertAdjacentHTML('beforebegin',
      `<div style="top: ${currentY}" class="module"> 
              <span data-name="close" class="module__close"></span>
              <div class="module__wrap"> 
                ${moduleLayout[layout]}
              </div>
            </div>`);
    this.handlerModule();
  }
  closeModule(module){
    document.querySelector('HTML').removeAttribute("style");
    module.remove();
  }
  handlerModule(){
    const module = document.querySelector('.module');
    module.addEventListener('click', event => {
      const e = event.target;
      const dataset = event.target.dataset;
      if (dataset.name === 'close'){
        this.closeModule(module);
      } else if (dataset.input === 'pick'){
        document.querySelector(`.${dataset.input}__select`).classList.remove('inVisible');
      } else if (dataset.option === 'pick'){
        document.querySelector(`.${dataset.option}__input`).value = e.innerHTML;
        document.querySelector(`.${dataset.option}__select`).classList.add('inVisible');
      } else if (dataset.save === 'reason'){
        const inputReason = module.querySelector(`INPUT[type='text']`);
        if (inputReason.value === 'Выбрать'){
          return
        } else {
          api.requestToServer('getInfo', this.setReasonObject(dataset.reason, inputReason.value)).then(() => {
            this.closeModule(module);
            if (this.checkWork.disabled){
              this.finishSession();
              this.checkWork.disabled = false;
            } else {
              this.clearDom();
              this.clearThis();
              this.counterTime();
            }
          });
        }
      }
    })
  }

  setReasonObject(reasonSource, reasonText){
    return {
      action: 'finishItem',
      result: 0,
      reason: reasonText,
      reasonType: reasonSource,
      item: this.currentItemUID,
    }
  }

  getTaskLayout(){
    return `<p class="module__title">Комментарий риелтору</p>
            <div class="module__task"> 
              <span class="subtitle">Задача</span>
                <div class="module__container"> 
                  <input data-input="pick" class="input__text input__select pick__input" type="text" readonly value="Выбрать">
                  <div class="about__select pick__select inVisible"> 
                    <span data-option="pick" class="about__option">Выбрать</span>
                    <span data-option="pick" class="about__option">задача 1</span>
                    <span data-option="pick" class="about__option">задача 2</span>
                  </div>
                </div>
            </div>
            <div> 
              <span class="subtitle">Комментарий</span>
              <textarea class="client__area" rows="10"></textarea>
            </div> 
            <div class="module__buttons"> 
              <button class="ui-btn ui-btn-success">сохранить</button>
              <button data-name="close" class="ui-btn ui-btn-danger">отменить</button>
            </div>`
  }
  /**
   * Принимайт input по событию, открывает блок выбора новых параметров
   * Работает как select-option
   * @param input
   */
  openSelectBlock(input){
    const findBlock = document.querySelector(`.${input.name}`);
    if (findBlock){
      this.checkOption();
      this.currentOptions = findBlock;
      this.currentOptions.classList.remove('inVisible');
      this.currentSelect = input;
    }
  }
  /**
   * Закрывает блок выбора новых параметров открытых с openSelectBlock
   */
  checkOption(){
    if (this.currentOptions){
      this.currentOptions.classList.add('inVisible');
      this.currentOptions = '';
      this.currentSelect = '';
    }
  }

  /**
   * Открывает слайдер BX
   * @param action указывает что открвыть (объект, клиента, сделку)
   * @param number номер объекта, клиента, сделки
   * @param from номер объекта, клиента, сделки
   * @returns {boolean}
   */

  openCard(action, number, from){
    const windowWidth = window.innerWidth * 0.9;
    const readyString = {
      client: `https://crm.centralnoe.ru/crm/contact/details/${number}/`,
      card: `https://crm.centralnoe.ru/CDB/object/card/cardObject.php?login=yes&source=${from}&id=${number}`,
      deal: `https://crm.centralnoe.ru/crm/deal/details/${number}/`,
      user: `https://crm.centralnoe.ru/company/personal/user/${number}/`,
    }
    BX.SidePanel.Instance.open(readyString[action], {animationDuration: 300,  width: windowWidth, events: {
        onclose: () => {
          console.log(action);
          if (action === 'client'){
            this.renderClientValue();
          } else if (action === 'deal'){
            this.renderDeal(this.deal.ID)
          }
        }}});
    return true;
  }

  checkSlider(){
    const elms = document.querySelectorAll('.slider');
    for (let i = 0, len = elms.length; i < len; i++) {
      // инициализация elms[i] в качестве слайдера
      new ChiefSlider(elms[i], {
        loop: false,
      });
    }
  }

  renderObject(reqTypeofRealty){
    const containerObject = document.querySelector('.object');
    containerObject.innerHTML = '';
    containerObject.insertAdjacentHTML('beforeend', new ObjectLayout(this.object, reqTypeofRealty).render());
    const notificationBlock =  document.querySelector('.control__notification-block');
    notificationBlock && notificationBlock.remove();
    this.checkSlider();
    this.handlerInput();
  }
  renderClientValue(){
    api.requestToServer('getClient',{
      id: this.clientUID,
    }).then(client => {
      this.client = client;
      if (this.client.ASSIGNED_BY_ID){
        api.requestToServer('getRealtor', {
          id: this.client.ASSIGNED_BY_ID,
        }).then(realtor => {
          const clientContainer = document.querySelector('.client');
          console.log(this.client)
          clientContainer.innerHTML = '';
          clientContainer.insertAdjacentHTML('beforeend', new ClientLayout(this.client, realtor, this.info).render())
        })
      }
    })
  }
  renderDeal(dealUID){
    api.requestToServer('getDeal', {
      id: dealUID,
    }).then(deal => {
      console.log(deal);
      this.deal = deal;
      api.requestToServer('getRealtor', {
        id: this.deal.ASSIGNED_BY_ID,
      }).then(realtor => {
        console.log(realtor)
        const containerObject = document.querySelector('.object');
        containerObject.innerHTML = '';
        containerObject.insertAdjacentHTML('beforeend', new DealLayout(this.deal, realtor).render());
      })
    })
  }
  renderControl(){
    const controlContainer = document.querySelector('.control');
    controlContainer.innerHTML = '';
    controlContainer.insertAdjacentHTML('beforeend', new ControlLayout().render())
  }
}

class ObjectLayout {
  constructor(item, reqTypeofRealty) {
    this.item = item;
    this.reqType = reqTypeofRealty;
    this.type = {
      'Квартира': this.flat(),
      'Комната': this.room(),
      'Дом': this.house(),
      'Земельный участок': this.ground(),
      'Гараж': this.garage(),
    }
  }
  getPhoto(){
    let photoLayout = '';
    if (this.item.reqPhoto){
      if (this.item.reqPhoto.length > 0){
        for (let photo of this.item.reqPhoto){
          photoLayout += `<div class="slider__item slider__photo" style="background-image: url(${photo.URL ? photo.URL : ''})"></div>`
        }
      } else {
        return `<div class="slider__item slider__photo" data-img='img/placeholder.png'' style="background-image: url('img/placeholder.png')"></div>`;
      }
    } else {
      return `<div class="slider__item slider__photo" data-img='img/placeholder.png'' style="background-image: url('img/placeholder.png')"></div>`;
    }
    return photoLayout;
  }
  flat(){
    const photo = this.getPhoto();
    return `<div class="object__header">
              <span 
                data-open="card" 
                data-source="${this.item.isFromPars ? 'pars' : '1c'}"
                data-number="${this.item.reqNumber ? this.item.reqNumber :
      `${this.item.isFromPars ? this.item.isFromPars : ''}`}" 
               class="object__title">Объект
             </span> 
             ${this.item.isFromPars && `<a target="_blank" href="${this.item.reqUrl}">Ссылка на объект</a>`}
            </div> 
              <div class="carousel"> 
                <div class="slider">
                  <div class="slider__container">
                      <div class="slider__wrapper">
                          <div class="slider__items">
                             ${photo}
                          </div>
                      </div>
                  </div>
                <!-- Кнопки для перехода к предыдущему и следующему слайду -->
                <a href="#" class="slider__control" data-slide="prev"></a>
                <a href="#" class="slider__control" data-slide="next"></a>
                </div>
              </div>
              <div class="object__change"> 
                <div> 
                  <input checked name="reqTypeofRealty" id="float" type="radio" value="Квартира" class="reqTypeofRealty">
                  <label class="subtitle" for="float">Квартира</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="room" type="radio" value="Комната" class="reqTypeofRealty">
                  <label class="subtitle" for="room">Комната</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="house" type="radio" value="Дом" class="reqTypeofRealty">
                  <label class="subtitle" for="house">Дом, коттедж, дача</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="ground" type="radio" value="Земельный участок" class="reqTypeofRealty">
                  <label class="subtitle" for="ground">Земля</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="garage" type="radio" value="Гараж" class="reqTypeofRealty">
                  <label class="subtitle" for="garage">Гараж</label>
                </div>
              </div>
              <div class="object__feature"> 
                <input class="button-input" name="reqTypeofFlat" id="second" type="radio" value="Квартира" ${this.item.reqTypeofRealty !== "Переуступка ДДУ" ? 'checked' : ''}>
                <label class="button-label" for="second">вторичка</label>
                <input class="button-input" name="reqTypeofFlat" id="part" type="radio" value="Переуступка ДДУ" ${this.item.reqTypeofRealty === "Переуступка ДДУ" ? 'checked' : ''}>
                <label class="button-label" for="part">переуступка дду</label>
              </div>
              <span class="title">местоположение</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Регион</span>
                  <input name="reqRegion" class="input__text" type="text" autocomplete="off" value="${this.item.reqRegion ? this.item.reqRegion : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Населенный пункт</span>
                  <input name="reqCity" class="input__text" type="text" autocomplete="off" value="${this.item.reqCity ? this.item.reqCity : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Район</span>
                  <input name="reqArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqArea ? this.item.reqArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Улица</span>
                  <input name="reqStreet" class="input__text" type="text" autocomplete="off" value="${this.item.reqStreet ? this.item.reqStreet : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер дома</span>
                  <input name="reqHouseNumber" class="input__text" type="text" autocomplete="off" value="${this.item.reqHouseNumber ? this.item.reqHouseNumber : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Дополнительный ориентир</span>
                  <input name="reqAdditionalLandmark" class="input__text" type="text" autocomplete="off" value="${this.item.reqAdditionalLandmark ? this.item.reqAdditionalLandmark : ''}">
                </div>
              </div>
              <span class="title">объект недвижимости</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Номер квартиры</span>
                  <input name="reqFlat" class="input__text" type="text" autocomplete="off" value="${this.item.reqFlat ? this.item.reqFlat : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь общая</span>
                  <input name="reqFlatTotalArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqFlatTotalArea ? this.item.reqFlatTotalArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь жилая</span>
                  <input name="reqFlatLivingArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqFlatLivingArea ? this.item.reqFlatLivingArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь кухни</span>
                  <input name="reqKitchenArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqKitchenArea ? this.item.reqKitchenArea : ''}">
                </div>    
                <div class="about__item">     
                  <span class="subtitle">Количество комнат</span>         
                  <div class="object__rooms"> 
                    <input class="button-input" name="reqRoomCount" id="one" type="radio" value="1" ${this.item.reqRoomCount ? this.item.reqRoomCount === '1' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="one">1</label>
                    <input class="button-input" name="reqRoomCount" id="two" type="radio" value="2" ${this.item.reqRoomCount ? this.item.reqRoomCount === '2' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="two">2</label>
                    <input class="button-input" name="reqRoomCount" id="three" type="radio" value="3" ${this.item.reqRoomCount ? this.item.reqRoomCount === '3' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="three">3</label>
                    <input class="button-input" name="reqRoomCount" id="for" type="radio" value="4" ${this.item.reqRoomCount ? this.item.reqRoomCount === '4' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="for">4</label>
                    <input class="button-input" name="reqRoomCount" id="five" type="radio" value="5" ${this.item.reqRoomCount ? this.item.reqRoomCount === '5' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="five">5+</label>
                  </div>
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Этаж</span>
                  <input name="reqFloor" class="input__text" type="text" autocomplete="off" value="${this.item.reqFloor ? this.item.reqFloor : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Этажность</span>
                  <input name="reqFloorCount" class="input__text" type="text" autocomplete="off" value="${this.item.reqFloorCount ? this.item.reqFloorCount : ''}">
                </div>                
                <div class="about__item"> 
                  <span class="subtitle">Застройщик</span>
                  <input name="reqHouseDeveloper" class="input__text" type="text" autocomplete="off" value="${this.item.reqHouseDeveloper ? this.item.reqHouseDeveloper : ''}">
                </div>               
                <div class="about__item"> 
                  <span class="subtitle">Балкон/лоджия</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqGalleryAvailability" class="input__text input__select" type="text" readonly value="${this.item.reqGalleryAvailability ? this.item.reqGalleryAvailability : ''}">
                    <div data-check="elem" class="about__select reqGalleryAvailability inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">1 балкон</span>
                      <span data-check="elem" data-select="option" class="about__option">1 лоджия</span>
                      <span data-check="elem" data-select="option" class="about__option">1 балкон 1 лоджия</span>
                      <span data-check="elem" data-select="option" class="about__option">2 балкона</span>
                      <span data-check="elem" data-select="option" class="about__option">2 лоджии</span>
                      <span data-check="elem" data-select="option" class="about__option">2 балкона лоджия</span>
                      <span data-check="elem" data-select="option" class="about__option">2 лоджии балкон</span>
                      <span data-check="elem" data-select="option" class="about__option">2 балкона 2 лоджии</span>
                      <span data-check="elem" data-select="option" class="about__option">3 балкона</span>
                      <span data-check="elem" data-select="option" class="about__option">3 лоджии</span>
                      <span data-check="elem" data-select="option" class="about__option">4 балкона</span>
                      <span data-check="elem" data-select="option" class="about__option">4 лоджии</span>
                      <span data-check="elem" data-select="option" class="about__option">Отсутствует</span>
                      <span data-check="elem" data-select="option" class="about__option">Не указано</span>
                      <span data-check="elem" data-select="option" class="about__option">Терраса</span>
                    </div>
                  </div>
                </div>                                
                <div class="about__item"> 
                  <span class="subtitle">Тип квартиры</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqTypeofFlat" class="input__text input__select" type="text" readonly value="${this.item.reqTypeofFlat ? this.item.reqTypeofFlat : ''}">
                    <div data-check="elem" class="about__select reqTypeofFlat inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Прочее</span>
                      <span data-check="elem" data-select="option" class="about__option">Хрущёвка</span>
                      <span data-check="elem" data-select="option" class="about__option">Апартаменты</span>
                      <span data-check="elem" data-select="option" class="about__option">Улучшенной планировки</span>
                      <span data-check="elem" data-select="option" class="about__option">Полногабаритная</span>
                      <span data-check="elem" data-select="option" class="about__option">Студия</span>
                      <span data-check="elem" data-select="option" class="about__option">Типовая</span>
                      <span data-check="elem" data-select="option" class="about__option">Малоэтажная</span>
                      <span data-check="elem" data-select="option" class="about__option">Ленинградка</span>
                      <span data-check="elem" data-select="option" class="about__option">Коридорного типа</span>
                      <span data-check="elem" data-select="option" class="about__option">Малосемейная</span>
                      <span data-check="elem" data-select="option" class="about__option">Секционная</span>
                      <span data-check="elem" data-select="option" class="about__option">Двухуровневая</span>
                      <span data-check="elem" data-select="option" class="about__option">Пентхаус</span>
                      <span data-check="elem" data-select="option" class="about__option">Элитная</span>
                      <span data-check="elem" data-select="option" class="about__option">Типовая</span>
                    </div>
                  </div>
                </div>               
                <div class="about__item"> 
                  <span class="subtitle">Планировка</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqTypeofLayout" class="input__text input__select" type="text" readonly value="${this.item.reqTypeofLayout ? this.item.reqTypeofLayout : ''}">
                    <div data-check="elem" class="about__select reqTypeofLayout inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Смежные</span>
                      <span data-check="elem" data-select="option" class="about__option">Изолированные</span>
                      <span data-check="elem" data-select="option" class="about__option">Смежно-изолированные</span>
                      <span data-check="elem" data-select="option" class="about__option">Свободная планировка</span>
                    </div>
                  </div>
                </div>                       
                <div class="about__item"> 
                  <span class="subtitle">Санузел</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqBathroomType" class="input__text input__select" type="text" readonly value="${this.item.reqBathroomType ? this.item.reqBathroomType : ''}">
                    <div data-check="elem" class="about__select reqBathroomType inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Неизвестно</span>
                      <span data-check="elem" data-select="option" class="about__option">2 ванны</span>
                      <span data-check="elem" data-select="option" class="about__option">Совместный</span>
                      <span data-check="elem" data-select="option" class="about__option">Без удобств</span>
                      <span data-check="elem" data-select="option" class="about__option">Без ванны</span>
                      <span data-check="elem" data-select="option" class="about__option">Душ и туалет</span>
                      <span data-check="elem" data-select="option" class="about__option">Cид. ванна</span>
                      <span data-check="elem" data-select="option" class="about__option">Раздельный</span>
                    </div>
                  </div>
                </div>  
                <div class="about__item"> 
                  <span class="subtitle">Ремонт</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqRepairStatus" class="input__text input__select" type="text" readonly value="${this.item.reqRepairStatus ? this.item.reqRepairStatus : ''}">
                    <div data-check="elem" class="about__select reqRepairStatus inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Под ключ</span>
                      <span data-check="elem" data-select="option" class="about__option">Черновая отделка</span>
                      <span data-check="elem" data-select="option" class="about__option">Чистовая отделка</span>
                      <span data-check="elem" data-select="option" class="about__option">Дизайнерский ремонт</span>
                      <span data-check="elem" data-select="option" class="about__option">Улучшенная отделка</span>
                      <span data-check="elem" data-select="option" class="about__option">Стандартная отделка</span>
                      <span data-check="elem" data-select="option" class="about__option">Бабушкино</span>
                      <span data-check="elem" data-select="option" class="about__option">Требует ремонта</span>
                      <span data-check="elem" data-select="option" class="about__option">Без отделки</span>
                    </div>
                  </div>
                </div>                       
              </div>
              <span class="title">цена, тыс. руб.</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Цена</span>
                  <input name="reqPrice" class="input__text" type="text" autocomplete="off" value="${this.item.reqPrice ? this.item.reqPrice : ''}">
                </div>
              </div>
              <span class="title">информация о доме</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Год постройки</span>
                  <input class="input__text" name="reqHouseBuildDate" type="date" value="${this.item.reqHouseBuildDate ? this.item.reqHouseBuildDate.split('.').reverse().join('-') : ''}">
                </div> 
                <div class="about__item"> 
                  <span class="subtitle">Материал дома</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqMaterial" class="input__text input__select" type="text" readonly value="${this.item.reqMaterial ? this.item.reqMaterial : ''}">
                    <div data-check="elem" class="about__select about__select_last reqMaterial inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Кирпич</span>
                      <span data-check="elem" data-select="option" class="about__option">Панель</span>
                      <span data-check="elem" data-select="option" class="about__option">Шлакоблоки</span>
                      <span data-check="elem" data-select="option" class="about__option">Дерево</span>
                      <span data-check="elem" data-select="option" class="about__option">Монолит</span>
                      <span data-check="elem" data-select="option" class="about__option">Сибит</span>
                      <span data-check="elem" data-select="option" class="about__option">Каркасно-засыпной</span>
                      <span data-check="elem" data-select="option" class="about__option">Металло-каркассный</span>
                      <span data-check="elem" data-select="option" class="about__option">Кирпично-каркасный</span>
                      <span data-check="elem" data-select="option" class="about__option">Не указано</span>
                    </div>
                  </div>
                </div>  
              </div>`
  }
  room(){
    const photo = this.getPhoto();
    return `<div class="object__header">
              <span 
                data-open="card" 
                data-source="${this.item.isFromPars ? 'pars' : '1c'}"
                data-number="${this.item.reqNumber ? this.item.reqNumber :
      `${this.item.isFromPars ? this.item.isFromPars : ''}`}" 
               class="object__title">Объект
             </span> 
             ${this.item.isFromPars && `<a target="_blank" href="${this.item.reqUrl}">Ссылка на объект</a>`}
            </div>
              <div class="carousel"> 
                <div class="slider">
                  <div class="slider__container">
                      <div class="slider__wrapper">
                          <div class="slider__items">
                             ${photo}
                          </div>
                      </div>
                  </div>
                <!-- Кнопки для перехода к предыдущему и следующему слайду -->
                <a href="#" class="slider__control" data-slide="prev"></a>
                <a href="#" class="slider__control" data-slide="next"></a>
                </div>
              </div>
              <div class="object__change"> 
                <div> 
                  <input name="reqTypeofRealty" id="float" type="radio" value="Квартира" class="reqTypeofRealty">
                  <label class="subtitle" for="float">Квартира</label>
                </div>
                <div> 
                  <input checked name="reqTypeofRealty" id="room" type="radio" value="Комната" class="reqTypeofRealty">
                  <label class="subtitle" for="room">Комната</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="house" type="radio" value="Дом" class="reqTypeofRealty">
                  <label class="subtitle" for="house">Дом, коттедж, дача</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="ground" type="radio" value="Земельный участок" class="reqTypeofRealty">
                  <label class="subtitle" for="ground">Земля</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="garage" type="radio" value="Гараж" class="reqTypeofRealty">
                  <label class="subtitle" for="garage">Гараж</label>
                </div>
              </div>
              <span class="title">местоположение</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Регион</span>
                  <input name="reqRegion" class="input__text" type="text" autocomplete="off" value="${this.item.reqRegion ? this.item.reqRegion : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Населенный пункт</span>
                  <input name="reqCity" class="input__text" type="text" autocomplete="off" value="${this.item.reqCity ? this.item.reqCity : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Район</span>
                  <input name="reqArea" class="input__text" type="text" autocomplete="off value="${this.item.reqArea ? this.item.reqArea : ''}"">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Улица</span>
                  <input name="reqStreet" class="input__text" type="text" autocomplete="off" value="${this.item.reqStreet ? this.item.reqStreet : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер дома</span>
                  <input name="reqHouseNumber" class="input__text" type="text" autocomplete="off" value="${this.item.reqHouseNumber ? this.item.reqHouseNumber : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Дополнительный ориентир</span>
                  <input name="reqAdditionalLandmark" class="input__text" type="text" autocomplete="off" value="${this.item.reqAdditionalLandmark ? this.item.reqAdditionalLandmark : ''}">
                </div>
              </div>
              <span class="title">объект недвижимости</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Номер квартиры</span>
                  <input name="reqFlat" class="input__text" type="text" autocomplete="off" value="${this.item.reqFlat ? this.item.reqFlat : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь общая</span>
                  <input name="reqFlatTotalArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqFlatTotalArea ? this.item.reqFlatTotalArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь жилая</span>
                  <input name="reqFlatLivingArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqFlatLivingArea ? this.item.reqFlatLivingArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь кухни</span>
                  <input name="reqKitchenArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqKitchenArea ? this.item.reqKitchenArea : ''}">
                </div>    
                <div class="about__item">     
                  <span class="subtitle">Количество комнат</span>         
                  <div class="object__rooms"> 
                    <input class="button-input" name="reqRoomCount" id="one" type="radio" value="1" ${this.item.reqRoomCount ? this.item.reqRoomCount === '1' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="one">1</label>
                    <input class="button-input" name="reqRoomCount" id="two" type="radio" value="2" ${this.item.reqRoomCount ? this.item.reqRoomCount === '2' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="two">2</label>
                    <input class="button-input" name="reqRoomCount" id="three" type="radio" value="3" ${this.item.reqRoomCount ? this.item.reqRoomCount === '3' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="three">3</label>
                    <input class="button-input" name="reqRoomCount" id="for" type="radio" value="4" ${this.item.reqRoomCount ? this.item.reqRoomCount === '4' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="for">4</label>
                    <input class="button-input" name="reqRoomCount" id="five" type="radio" value="5" ${this.item.reqRoomCount ? this.item.reqRoomCount === '5' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="five">5+</label>
                  </div>
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Этаж</span>
                  <input name="reqFloor" class="input__text" type="text" autocomplete="off" value="${this.item.reqFloor ? this.item.reqFloor : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Этажность</span>
                  <input name="reqFloorCount" class="input__text" type="text" autocomplete="off" value="${this.item.reqFloorCount ? this.item.reqFloorCount : ''}">
                </div>                             
                <div class="about__item"> 
                  <span class="subtitle">Балкон/лоджия</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqGalleryAvailability" class="input__text input__select" type="text" readonly value="${this.item.reqGalleryAvailability ? this.item.reqGalleryAvailability : ''}">
                    <div data-check="elem" class="about__select reqGalleryAvailability inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">1 балкон</span>
                      <span data-check="elem" data-select="option" class="about__option">1 лоджия</span>
                      <span data-check="elem" data-select="option" class="about__option">1 балкон 1 лоджия</span>
                      <span data-check="elem" data-select="option" class="about__option">2 балкона</span>
                      <span data-check="elem" data-select="option" class="about__option">2 лоджии</span>
                      <span data-check="elem" data-select="option" class="about__option">2 балкона лоджия</span>
                      <span data-check="elem" data-select="option" class="about__option">2 лоджии балкон</span>
                      <span data-check="elem" data-select="option" class="about__option">2 балкона 2 лоджии</span>
                      <span data-check="elem" data-select="option" class="about__option">3 балкона</span>
                      <span data-check="elem" data-select="option" class="about__option">3 лоджии</span>
                      <span data-check="elem" data-select="option" class="about__option">4 балкона</span>
                      <span data-check="elem" data-select="option" class="about__option">4 лоджии</span>
                      <span data-check="elem" data-select="option" class="about__option">Отсутствует</span>
                      <span data-check="elem" data-select="option" class="about__option">Не указано</span>
                      <span data-check="elem" data-select="option" class="about__option">Терраса</span>
                    </div>
                  </div>
                </div>                                
                <div class="about__item"> 
                  <span class="subtitle">Тип квартиры</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqTypeofFlat" class="input__text input__select" type="text" readonly value="${this.item.reqTypeofFlat ? this.item.reqTypeofFlat : ''}">
                    <div data-check="elem" class="about__select reqTypeofFlat inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Прочее</span>
                      <span data-check="elem" data-select="option" class="about__option">Хрущёвка</span>
                      <span data-check="elem" data-select="option" class="about__option">Апартаменты</span>
                      <span data-check="elem" data-select="option" class="about__option">Улучшенной планировки</span>
                      <span data-check="elem" data-select="option" class="about__option">Полногабаритная</span>
                      <span data-check="elem" data-select="option" class="about__option">Студия</span>
                      <span data-check="elem" data-select="option" class="about__option">Типовая</span>
                      <span data-check="elem" data-select="option" class="about__option">Малоэтажная</span>
                      <span data-check="elem" data-select="option" class="about__option">Ленинградка</span>
                      <span data-check="elem" data-select="option" class="about__option">Коридорного типа</span>
                      <span data-check="elem" data-select="option" class="about__option">Малосемейная</span>
                      <span data-check="elem" data-select="option" class="about__option">Секционная</span>
                      <span data-check="elem" data-select="option" class="about__option">Двухуровневая</span>
                      <span data-check="elem" data-select="option" class="about__option">Пентхаус</span>
                      <span data-check="elem" data-select="option" class="about__option">Элитная</span>
                      <span data-check="elem" data-select="option" class="about__option">Типовая</span>
                    </div>
                  </div>
                </div>               
                <div class="about__item"> 
                  <span class="subtitle">Планировка</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqTypeofLayout" class="input__text input__select" type="text" readonly value="${this.item.reqTypeofLayout ? this.item.reqTypeofLayout : ''}">
                    <div data-check="elem" class="about__select reqTypeofLayout inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Смежные</span>
                      <span data-check="elem" data-select="option" class="about__option">Изолированные</span>
                      <span data-check="elem" data-select="option" class="about__option">Смежно-изолированные</span>
                      <span data-check="elem" data-select="option" class="about__option">Свободная планировка</span>
                    </div>
                  </div>
                </div>                       
                <div class="about__item"> 
                  <span class="subtitle">Санузел</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqBathroomType" class="input__text input__select" type="text" readonly value="${this.item.reqBathroomType ? this.item.reqBathroomType : ''}">
                    <div data-check="elem" class="about__select reqBathroomType inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Неизвестно</span>
                      <span data-check="elem" data-select="option" class="about__option">2 ванны</span>
                      <span data-check="elem" data-select="option" class="about__option">Совместный</span>
                      <span data-check="elem" data-select="option" class="about__option">Без удобств</span>
                      <span data-check="elem" data-select="option" class="about__option">Без ванны</span>
                      <span data-check="elem" data-select="option" class="about__option">Душ и туалет</span>
                      <span data-check="elem" data-select="option" class="about__option">Cид. ванна</span>
                      <span data-check="elem" data-select="option" class="about__option">Раздельный</span>
                    </div>
                  </div>
                </div>                      
              </div>
              <span class="title">цена, тыс. руб.</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Цена</span>
                  <input name="reqPrice" class="input__text" type="text" autocomplete="off" value="${this.item.reqPrice ? this.item.reqPrice : ''}">
                </div>
              </div>
              <span class="title">информация о доме</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Год постройки</span>
                  <input class="input__text" name="reqHouseBuildDate" type="date" value="${this.item.reqHouseBuildDate ? this.item.reqHouseBuildDate.split('.').reverse().join('-') : ''}">
                </div> 
                <div class="about__item"> 
                  <span class="subtitle">Материал дома</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqMaterial" class="input__text input__select" type="text" readonly value="${this.item.reqMaterial ? this.item.reqMaterial : ''}">
                    <div data-check="elem" class="about__select about__select_last reqMaterial inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Кирпич</span>
                      <span data-check="elem" data-select="option" class="about__option">Панель</span>
                      <span data-check="elem" data-select="option" class="about__option">Шлакоблоки</span>
                      <span data-check="elem" data-select="option" class="about__option">Дерево</span>
                      <span data-check="elem" data-select="option" class="about__option">Монолит</span>
                      <span data-check="elem" data-select="option" class="about__option">Сибит</span>
                      <span data-check="elem" data-select="option" class="about__option">Каркасно-засыпной</span>
                      <span data-check="elem" data-select="option" class="about__option">Металло-каркассный</span>
                      <span data-check="elem" data-select="option" class="about__option">Кирпично-каркасный</span>
                      <span data-check="elem" data-select="option" class="about__option">Не указано</span>
                    </div>
                  </div>
                </div>                  
                <div class="about__item"> 
                  <span class="subtitle">Тип дома</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqHouseType" class="input__text input__select" type="text" readonly value="${this.item.reqHouseType ? this.item.reqHouseType : ''}">
                    <div data-check="elem" class="about__select about__select_last reqHouseType  inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Дача</span>
                      <span data-check="elem" data-select="option" class="about__option">Дом</span>
                      <span data-check="elem" data-select="option" class="about__option">Квартира на земле</span>
                      <span data-check="elem" data-select="option" class="about__option">Коттедж</span>
                      <span data-check="elem" data-select="option" class="about__option">Многоквартирный дом</span>
                      <span data-check="elem" data-select="option" class="about__option">Незавершенный объект</span>
                      <span data-check="elem" data-select="option" class="about__option">Общежитие</span>
                      <span data-check="elem" data-select="option" class="about__option">Таунхаус</span>
                      <span data-check="elem" data-select="option" class="about__option">Часть дома</span>
                    </div>
                  </div>
                </div>  
              </div>`
  }
  house(){
    const photo = this.getPhoto();
    return `<div class="object__header">
              <span 
                data-open="card" 
                data-source="${this.item.isFromPars ? 'pars' : '1c'}"
                data-number="${this.item.reqNumber ? this.item.reqNumber :
      `${this.item.isFromPars ? this.item.isFromPars : ''}`}" 
               class="object__title">Объект
             </span> 
             ${this.item.isFromPars && `<a target="_blank" href="${this.item.reqUrl}">Ссылка на объект</a>`}
            </div>  
              <div class="carousel"> 
                <div class="slider">
                  <div class="slider__container">
                      <div class="slider__wrapper">
                          <div class="slider__items">
                             ${photo}
                          </div>
                      </div>
                  </div>
                <!-- Кнопки для перехода к предыдущему и следующему слайду -->
                <a href="#" class="slider__control" data-slide="prev"></a>
                <a href="#" class="slider__control" data-slide="next"></a>
                </div>
              </div>
              <div class="object__change"> 
                <div> 
                  <input name="reqTypeofRealty" id="float" type="radio" value="Квартира" class="reqTypeofRealty">
                  <label class="subtitle" for="float">Квартира</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="room" type="radio" value="Комната" class="reqTypeofRealty">
                  <label class="subtitle" for="room">Комната</label>
                </div>
                <div> 
                  <input checked name="reqTypeofRealty" id="house" type="radio" value="Дом" class="reqTypeofRealty">
                  <label class="subtitle" for="house">Дом, коттедж, дача</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="ground" type="radio" value="Земельный участок" class="reqTypeofRealty">
                  <label class="subtitle" for="ground">Земля</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="garage" type="radio" value="Гараж" class="reqTypeofRealty">
                  <label class="subtitle" for="garage">Гараж</label>
                </div>
              </div>
              <span class="title">местоположение</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Регион</span>
                  <input name="reqRegion" class="input__text" type="text" autocomplete="off" value="${this.item.reqRegion ? this.item.reqRegion : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Населенный пункт</span>
                  <input name="reqCity" class="input__text" type="text" autocomplete="off" value="${this.item.reqCity ? this.item.reqCity : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Район</span>
                  <input name="reqArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqArea ? this.item.reqArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Улица</span>
                  <input name="reqStreet" class="input__text" type="text" autocomplete="off" value="${this.item.reqStreet ? this.item.reqStreet : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер дома</span>
                  <input name="reqHouseNumber" class="input__text" type="text" autocomplete="off" value="${this.item.reqHouseNumber ? this.item.reqHouseNumber : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Дополнительный ориентир</span>
                  <input name="reqAdditionalLandmark" class="input__text" type="text" autocomplete="off" value="${this.item.reqAdditionalLandmark ? this.item.reqAdditionalLandmark : ''}">
                </div>
              </div>
              <span class="title">объект недвижимости</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Площадь участка в (сотках)</span>
                  <input name="reqLandArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqLandArea ? this.item.reqLandArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь дома</span>
                  <input name="reqFlatTotalArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqFlatTotalArea ? this.item.reqFlatTotalArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь жилая</span>
                  <input name="reqFlatLivingArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqFlatLivingArea ? this.item.reqFlatLivingArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь кухни</span>
                  <input name="reqKitchenArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqKitchenArea ? this.item.reqKitchenArea : ''}">
                </div>    
                <div class="about__item">     
                  <span class="subtitle">Количество комнат в доме</span>         
                  <div class="object__rooms"> 
                    <input class="button-input" name="reqRoomCount" id="one" type="radio" value="1" ${this.item.reqRoomCount ? this.item.reqRoomCount === '1' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="one">1</label>
                    <input class="button-input" name="reqRoomCount" id="two" type="radio" value="2" ${this.item.reqRoomCount ? this.item.reqRoomCount === '2' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="two">2</label>
                    <input class="button-input" name="reqRoomCount" id="three" type="radio" value="3" ${this.item.reqRoomCount ? this.item.reqRoomCount === '3' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="three">3</label>
                    <input class="button-input" name="reqRoomCount" id="for" type="radio" value="4" ${this.item.reqRoomCount ? this.item.reqRoomCount === '4' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="for">4</label>
                    <input class="button-input" name="reqRoomCount" id="five" type="radio" value="5" ${this.item.reqRoomCount ? this.item.reqRoomCount === '5' ? 'checked' : '' : ''}>
                    <label id="reqRoomCount" class="button-label" for="five">5+</label>
                  </div>
                </div>            
                <div class="about__item"> 
                  <span class="subtitle">Этажность</span>
                  <input name="reqFloorCount" class="input__text" type="text" autocomplete="off" value="${this.item.reqFloorCount ? this.item.reqFloorCount : ''}">
                </div>                             
                <div class="about__item"> 
                  <span class="subtitle">Балкон/лоджия</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqGalleryAvailability" class="input__text input__select" type="text" readonly value="${this.item.reqGalleryAvailability ? this.item.reqGalleryAvailability : ''}">
                    <div data-check="elem" class="about__select reqGalleryAvailability inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">1 балкон</span>
                      <span data-check="elem" data-select="option" class="about__option">1 лоджия</span>
                      <span data-check="elem" data-select="option" class="about__option">1 балкон 1 лоджия</span>
                      <span data-check="elem" data-select="option" class="about__option">2 балкона</span>
                      <span data-check="elem" data-select="option" class="about__option">2 лоджии</span>
                      <span data-check="elem" data-select="option" class="about__option">2 балкона лоджия</span>
                      <span data-check="elem" data-select="option" class="about__option">2 лоджии балкон</span>
                      <span data-check="elem" data-select="option" class="about__option">2 балкона 2 лоджии</span>
                      <span data-check="elem" data-select="option" class="about__option">3 балкона</span>
                      <span data-check="elem" data-select="option" class="about__option">3 лоджии</span>
                      <span data-check="elem" data-select="option" class="about__option">4 балкона</span>
                      <span data-check="elem" data-select="option" class="about__option">4 лоджии</span>
                      <span data-check="elem" data-select="option" class="about__option">Отсутствует</span>
                      <span data-check="elem" data-select="option" class="about__option">Не указано</span>
                      <span data-check="elem" data-select="option" class="about__option">Терраса</span>
                    </div>
                  </div>
                </div>                                                                
                <div class="about__item"> 
                  <span class="subtitle">Санузел</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqBathroomType" class="input__text input__select" type="text" readonly value="${this.item.reqBathroomType ? this.item.reqBathroomType : ''}">
                    <div data-check="elem" class="about__select reqBathroomType inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Неизвестно</span>
                      <span data-check="elem" data-select="option" class="about__option">2 ванны</span>
                      <span data-check="elem" data-select="option" class="about__option">Совместный</span>
                      <span data-check="elem" data-select="option" class="about__option">Без удобств</span>
                      <span data-check="elem" data-select="option" class="about__option">Без ванны</span>
                      <span data-check="elem" data-select="option" class="about__option">Душ и туалет</span>
                      <span data-check="elem" data-select="option" class="about__option">Cид. ванна</span>
                      <span data-check="elem" data-select="option" class="about__option">Раздельный</span>
                    </div>
                  </div>
                </div>                  
                <div class="about__item"> 
                  <span class="subtitle">Тип дома</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqHouseType " class="input__text input__select" type="text" readonly value="${this.item.reqHouseType ? this.item.reqHouseType : ''}">
                    <div data-check="elem" class="about__select reqHouseType  inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Дача</span>
                      <span data-check="elem" data-select="option" class="about__option">Дом</span>
                      <span data-check="elem" data-select="option" class="about__option">Квартира на земле</span>
                      <span data-check="elem" data-select="option" class="about__option">Коттедж</span>
                      <span data-check="elem" data-select="option" class="about__option">Многоквартирный дом</span>
                      <span data-check="elem" data-select="option" class="about__option">Незавершенный объект</span>
                      <span data-check="elem" data-select="option" class="about__option">Общежитие</span>
                      <span data-check="elem" data-select="option" class="about__option">Таунхаус</span>
                      <span data-check="elem" data-select="option" class="about__option">Часть дома</span>
                    </div>
                  </div>
                </div>                     
                <div class="about__item"> 
                  <span class="subtitle">Кровля</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqHouseRoof " class="input__text input__select" type="text" readonly value="${this.item.reqHouseRoof ? this.item.reqHouseRoof : ''}">
                    <div data-check="elem" class="about__select reqHouseRoof  inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Железо</span>
                      <span data-check="elem" data-select="option" class="about__option">Шифер</span>
                      <span data-check="elem" data-select="option" class="about__option">Ондулин</span>
                      <span data-check="elem" data-select="option" class="about__option">Нержавейка</span>
                      <span data-check="elem" data-select="option" class="about__option">Черепица</span>
                      <span data-check="elem" data-select="option" class="about__option">Рубероид</span>
                      <span data-check="elem" data-select="option" class="about__option">Не указано</span>
                    </div>
                  </div>
                </div>                  
                <div class="about__item"> 
                  <span class="subtitle">Отопление</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqHouseHeating " class="input__text input__select" type="text" readonly value="${this.item.reqHouseHeating ? this.item.reqHouseHeating : ''}">
                    <div data-check="elem" class="about__select reqHouseHeating  inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Печное</span>
                      <span data-check="elem" data-select="option" class="about__option">Газовый котел</span>
                      <span data-check="elem" data-select="option" class="about__option">Электрический котел</span>
                      <span data-check="elem" data-select="option" class="about__option">Центральное</span>
                      <span data-check="elem" data-select="option" class="about__option">Водяное</span>
                      <span data-check="elem" data-select="option" class="about__option">Отсутствует</span>
                      <span data-check="elem" data-select="option" class="about__option">Котельная</span>
                    </div>
                  </div>
                </div>                   
                <div class="about__item"> 
                  <span class="subtitle">Водопровод</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqWaterPipes " class="input__text input__select" type="text" readonly readonly value="${this.item.reqWaterPipes ? this.item.reqWaterPipes : ''}">
                    <div data-check="elem" class="about__select reqWaterPipes  inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Не указано</span>
                      <span data-check="elem" data-select="option" class="about__option">Отсутствует</span>
                      <span data-check="elem" data-select="option" class="about__option">Зимний</span>
                      <span data-check="elem" data-select="option" class="about__option">Летний</span>
                    </div>
                  </div>
                </div>                     
                <div class="about__item"> 
                  <span class="subtitle">Слив</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqDrainage " class="input__text input__select" type="text" readonly readonly value="${this.item.reqDrainage ? this.item.reqDrainage : ''}">
                    <div data-check="elem" class="about__select about__select_last reqDrainage  inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Не указано</span>
                      <span data-check="elem" data-select="option" class="about__option">Отсутствует</span>
                      <span data-check="elem" data-select="option" class="about__option">Канализация</span>
                      <span data-check="elem" data-select="option" class="about__option">Слив</span>
                      <span data-check="elem" data-select="option" class="about__option">Удобства</span>
                    </div>
                  </div>
                </div>                    
                <div class="about__item"> 
                  <span class="subtitle">Год постройки</span>
                  <input class="input__text" name="reqHouseBuildDate" type="date" value="${this.item.reqHouseBuildDate ? this.item.reqHouseBuildDate.split('.').reverse().join('-') : ''}">
                </div>                 
              </div>
              <span class="title">цена, тыс. руб.</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Цена</span>
                  <input name="reqPrice" class="input__text" type="text" autocomplete="off" value="${this.item.reqPrice ? this.item.reqPrice : ''}">
                </div>
              </div>`
  }
  ground(){
    const photo = this.getPhoto();
    return `<div class="object__header">
              <span 
                data-open="card" 
                data-source="${this.item.isFromPars ? 'pars' : '1c'}"
                data-number="${this.item.reqNumber ? this.item.reqNumber :
      `${this.item.isFromPars ? this.item.isFromPars : ''}`}" 
               class="object__title">Объект
             </span> 
             ${this.item.isFromPars && `<a target="_blank" href="${this.item.reqUrl}">Ссылка на объект</a>`}
            </div>  
              <div class="carousel"> 
                <div class="slider">
                  <div class="slider__container">
                      <div class="slider__wrapper">
                          <div class="slider__items">
                             ${photo}
                          </div>
                      </div>
                  </div>
                <!-- Кнопки для перехода к предыдущему и следующему слайду -->
                <a href="#" class="slider__control" data-slide="prev"></a>
                <a href="#" class="slider__control" data-slide="next"></a>
                </div>
              </div>
              <div class="object__change"> 
                <div> 
                  <input name="reqTypeofRealty" id="float" type="radio" value="Квартира" class="reqTypeofRealty">
                  <label class="subtitle" for="float">Квартира</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="room" type="radio" value="Комната" class="reqTypeofRealty">
                  <label class="subtitle" for="room">Комната</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="house" type="radio" value="Дом" class="reqTypeofRealty">
                  <label class="subtitle" for="house">Дом, коттедж, дача</label>
                </div>
                <div> 
                  <input checked name="reqTypeofRealty" id="ground" type="radio" value="Земельный участок" class="reqTypeofRealty">
                  <label class="subtitle" for="ground">Земля</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="garage" type="radio" value="Гараж" class="reqTypeofRealty">
                  <label class="subtitle" for="garage">Гараж</label>
                </div>
              </div>
              <span class="title">местоположение</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Регион</span>
                  <input name="reqRegion" class="input__text" type="text" autocomplete="off" value="${this.item.reqRegion ? this.item.reqRegion : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Населенный пункт</span>
                  <input name="reqCity" class="input__text" type="text" autocomplete="off" value="${this.item.reqCity ? this.item.reqCity : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Район</span>
                  <input name="reqArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqArea ? this.item.reqArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Улица</span>
                  <input name="reqStreet" class="input__text" type="text" autocomplete="off" value="${this.item.reqStreet ? this.item.reqStreet : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер дома</span>
                  <input name="reqHouseNumber" class="input__text" type="text" autocomplete="off" value="${this.item.reqHouseNumber ? this.item.reqHouseNumber : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Дополнительный ориентир</span>
                  <input name="reqAdditionalLandmark" class="input__text" type="text" autocomplete="off" value="${this.item.reqAdditionalLandmark ? this.item.reqAdditionalLandmark : ''}">
                </div>
              </div>
              <span class="title">объект недвижимости</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Площадь участка в (сотках)</span>
                  <input name="reqLandArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqLandArea ? this.item.reqLandArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Садовое общество</span>
                  <input name="reqMunicipality" class="input__text" type="text" autocomplete="off" value="${this.item.reqMunicipality ? this.item.reqMunicipality : ''}">
                </div>               
                <div class="about__item"> 
                  <span class="subtitle">Водопровод</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqWaterPipes " class="input__text input__select" type="text" readonly value="${this.item.reqWaterPipes ? this.item.reqWaterPipes : ''}">
                    <div data-check="elem" class="about__select reqWaterPipes  inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Не указано</span>
                      <span data-check="elem" data-select="option" class="about__option">Отсутствует</span>
                      <span data-check="elem" data-select="option" class="about__option">Зимний</span>
                      <span data-check="elem" data-select="option" class="about__option">Летний</span>
                    </div>
                  </div>
                </div>                     
                <div class="about__item"> 
                  <span class="subtitle">Слив</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqWaterPipes" class="input__text input__select" type="text" readonly value="${this.item.reqWaterPipes ? this.item.reqWaterPipes : ''}">
                    <div data-check="elem" class="about__select reqWaterPipes  inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Не указано</span>
                      <span data-check="elem" data-select="option" class="about__option">Отсутствует</span>
                      <span data-check="elem" data-select="option" class="about__option">Канализация</span>
                      <span data-check="elem" data-select="option" class="about__option">Слив</span>
                      <span data-check="elem" data-select="option" class="about__option">Удобства</span>
                    </div>
                  </div>
                </div>                                 
                <div class="about__item "> 
                  <span class="subtitle">Категория земли</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqGroundCategory" class="input__text input__select" type="text" readonly value="${this.item.reqGroundCategory ? this.item.reqGroundCategory : ''}">
                    <div data-check="elem" class="about__select about__select_last reqGroundCategory  inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Индивидуального строительства</span>
                      <span data-check="elem" data-select="option" class="about__option">Для садоводчества</span>
                      <span data-check="elem" data-select="option" class="about__option">Другое</span>
                    </div>
                  </div>
                </div>                    
              </div>
              <span class="title">цена, тыс. руб.</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Цена</span>
                  <input name="reqPrice" class="input__text" type="text" autocomplete="off" value="${this.item.reqPrice ? this.item.reqPrice : ''}">
                </div>
              </div>`
  }
  garage(){
    const photo = this.getPhoto();
    return `<div class="object__header">
              <span 
                data-open="card" 
                data-source="${this.item.isFromPars ? 'pars' : '1c'}"
                data-number="${this.item.reqNumber ? this.item.reqNumber :
      `${this.item.isFromPars ? this.item.isFromPars : ''}`}" 
               class="object__title">Объект
             </span> 
             ${this.item.isFromPars && `<a target="_blank" href="${this.item.reqUrl}">Ссылка на объект</a>`}
            </div>  
              <div class="carousel"> 
                <div class="slider">
                  <div class="slider__container">
                      <div class="slider__wrapper">
                          <div class="slider__items">
                             ${photo}
                          </div>
                      </div>
                  </div>
                <!-- Кнопки для перехода к предыдущему и следующему слайду -->
                <a href="#" class="slider__control" data-slide="prev"></a>
                <a href="#" class="slider__control" data-slide="next"></a>
                </div>
              </div>
              <div class="object__change"> 
                <div> 
                  <input name="reqTypeofRealty" id="float" type="radio" value="Квартира" class="reqTypeofRealty">
                  <label class="subtitle" for="float">Квартира</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="room" type="radio" value="Комната" class="reqTypeofRealty">
                  <label class="subtitle" for="room">Комната</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="house" type="radio" value="Дом" class="reqTypeofRealty">
                  <label class="subtitle" for="house">Дом, коттедж, дача</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="ground" type="radio" value="Земельный участок" class="reqTypeofRealty">
                  <label class="subtitle" for="ground">Земля</label>
                </div>
                <div> 
                  <input checked name="reqTypeofRealty" id="garage" type="radio" value="Гараж" class="reqTypeofRealty">
                  <label class="subtitle" for="garage">Гараж</label>
                </div>
              </div>
              <span class="title">местоположение</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Регион</span>
                  <input name="reqRegion" class="input__text" type="text" autocomplete="off" value="${this.item.reqRegion ? this.item.reqRegion : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Населенный пункт</span>
                  <input name="reqCity" class="input__text" type="text" autocomplete="off" value="${this.item.reqCity ? this.item.reqCity : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Район</span>
                  <input name="reqArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqArea ? this.item.reqArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Улица</span>
                  <input name="reqStreet" class="input__text" type="text" autocomplete="off" value="${this.item.reqStreet ? this.item.reqStreet : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер дома</span>
                  <input name="reqHouseNumber" class="input__text" type="text" autocomplete="off" value="${this.item.reqHouseNumber ? this.item.reqHouseNumber : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Дополнительный ориентир</span>
                  <input name="reqAdditionalLandmark" class="input__text" type="text" autocomplete="off" value="${this.item.reqAdditionalLandmark ? this.item.reqAdditionalLandmark : ''}">
                </div>
              </div>
              <span class="title">объект недвижимости</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Площадь общая</span>
                  <input name="reqFlatTotalArea" class="input__text" type="text" autocomplete="off" value="${this.item.reqFlatTotalArea ? this.item.reqFlatTotalArea : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Этаж</span>
                  <input name="reqFloor" class="input__text" type="text" autocomplete="off" value="${this.item.reqFloor ? this.item.reqFloor : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Этажность</span>
                  <input name="reqFloorCount" class="input__text" type="text" autocomplete="off" value="${this.item.reqFloorCount ? this.item.reqFloorCount : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер парковочного места</span>
                  <input name="reqFlat" class="input__text" type="text" autocomplete="off" value="${this.item.reqFlat ? this.item.reqFlat : ''}">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Материал стен</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqMaterial" class="input__text input__select" type="text" readonly value="${this.item.reqMaterial ? this.item.reqMaterial : ''}">
                    <div data-check="elem" class="about__select reqMaterial inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Кирпич</span>
                      <span data-check="elem" data-select="option" class="about__option">Панель</span>
                      <span data-check="elem" data-select="option" class="about__option">Шлакоблоки</span>
                      <span data-check="elem" data-select="option" class="about__option">Дерево</span>
                      <span data-check="elem" data-select="option" class="about__option">Монолит</span>
                      <span data-check="elem" data-select="option" class="about__option">Сибит</span>
                      <span data-check="elem" data-select="option" class="about__option">Каркасно-засыпной</span>
                      <span data-check="elem" data-select="option" class="about__option">Металло-каркассный</span>
                      <span data-check="elem" data-select="option" class="about__option">Кирпично-каркасный</span>
                      <span data-check="elem" data-select="option" class="about__option">Камень</span>
                      <span data-check="elem" data-select="option" class="about__option">Не указано</span>
                    </div>
                  </div>
                </div>                    
                <div class="about__item"> 
                  <span class="subtitle">Тип гаража</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqGarageType" class="input__text input__select" type="text" readonly value="${this.item.reqGarageType ? this.item.reqGarageType : ''}">
                    <div data-check="elem" class="about__select reqGarageType inVisible"> 
                      <span data-check="elem" data-select="option" class="about__option">Выберете</span>
                      <span data-check="elem" data-select="option" class="about__option">Гараж</span>
                      <span data-check="elem" data-select="option" class="about__option">Машиноместо</span>
                      <span data-check="elem" data-select="option" class="about__option">Бокс</span>
                    </div>
                  </div>
                </div>    
               <div class="about__item"> 
                  <span class="subtitle">Год постройки</span>
                  <input class="input__text" name="reqHouseBuildDate" type="date" value="${this.item.reqHouseBuildDate ? this.item.reqHouseBuildDate.split('.').reverse().join('-') : ''}">
                </div> 
              </div>
              <span class="title">цена, тыс. руб.</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Цена</span>
                  <input name="reqPrice" class="input__text" type="text" autocomplete="off" value="${this.item.reqPrice ? this.item.reqPrice : ''}">
                </div>
              </div>`
  }

  render(){
    return `${this.type[this.reqType]}`
  }
}

class DealLayout{
  constructor(deal, realtor) {
    this.deal = deal;
    this.realtor = realtor;
  }
  getStages(){
    const stages = {
      'C6:1': 'Выход на задаток',
      'C6:2': 'Отложена',
      'C6:3': 'Упаковка объекта',
      'C6:4': 'Активные продажи',
      'C6:5': 'Выход на сделку',
      'C6:6': 'Работает с другим риэлтором',
      'C6:7': 'Другой город',
      'C6:NEW': 'Перспективная сделка (продавец)',
      'C6:FINAL_INVOICE': 'Подписание договора',
      'C6:WON': 'ЦАН получил комиссию продавца/ДКП',
      'C6:LOSE': 'Сделка не состоялась',
    }
    return stages[this.deal.STAGE_ID];
  }
  render(){
    const stages = this.getStages();
    return `<span         
data-open="card" 
        data-source="${this.item.isFromPars ? 'pars' : '1c'}"
        data-number="${this.item.reqNumber ? this.item.reqNumber :
      `${this.item.isFromPars ? this.item.isFromPars : ''}`}"  
        class="object__title">Сделка</span> 
              <div class="about">
                <div class="about__item about__item_background">
                  <span class="subtitle">Стадия</span>
                  <span class="subtitle">${stages}</span>
                </div>
                <div class="about__item about__item_background">
                  <span class="subtitle">Сумма комиссии</span>
                  <span class="subtitle">${this.deal.OPPORTUNITY ? `${this.deal.OPPORTUNITY} руб.` : ''}</span>
                </div>
                <div class="about__item about__item_background">
                  <span class="subtitle">Риелтор</span>
                  <span data-open="user" data-number="${this.realtor.ID  ? this.realtor.ID : ''}" class="subtitle subtitle_open">
                    ${this.realtor.LAST_NAME ? this.realtor.LAST_NAME : ''}
                    ${this.realtor.NAME ? this.realtor.NAME : ''}
                    ${this.realtor.SECOND_NAME ? this.realtor.SECOND_NAME : ''}
                  </span>
                </div>                
                <div class="about__item about__item_background">
                  <span class="subtitle">Сделка отложена</span>
                  <span class="subtitle">${this.deal.UF_CRM_1601895403 === '1' ? 'Да' : 'Нет'}</span>
                </div>                
                <div class="about__item about__item_background">
                  <span class="subtitle">Сделка отложена до:</span>
                  <span class="subtitle">${this.deal.UF_CRM_1601913003 ? this.deal.UF_CRM_1601913003.split('T')[0].split('-').reverse().join('.') : ''}</span>
                </div>
                <div class="about__item about__item_background">
                  <span class="subtitle">Комментарий к отложенной сделки</span>
                  <span class="subtitle">${this.deal.UF_CRM_1601915480 ? this.deal.UF_CRM_1601915480 : ''}</span>
                </div>
              </div>`
  }
}

class ClientLayout{
  constructor(client, realtor, info) {
    this.client = client;
    this.realtor = realtor;
    this.info = info;
  }
  getPhone(){
    if (this.client.HAS_PHONE === "Y"){
      let phones = '';
      for (let phone of this.client.PHONE){
        phones += `<div class="about__item about__item_background">
                      <span class="subtitle">Телефон</span>
                      <span class="subtitle">${phone.VALUE}</span>
                    </div>`
      }
      return phones;
    }
  }
  getPhoneSelect(){
    if (this.client.HAS_PHONE === "Y"){
      let option = '';
      for (let phone of this.client.PHONE){
        option += `<span data-check="elem" data-select="option" data-phone="number" class="about__option">${phone.VALUE}</span>`
      }
      return option;
    }
  }
  render(){
    const phone = this.getPhone();
    const phoneSelect = this.getPhoneSelect();
    return `<div class="client__title-wrap"> 
                <span data-open="client" data-number="${this.client.ID ? this.client.ID : ''}" class="object__title">Клиент</span>
                <span data-call="hangup" class="client__phone_cancel"></span>
            </div>
              <div class="about client__info">                
              <div class="about__item about__item_background">
                  <span class="subtitle">Ответственный</span>
                  <span data-open="user" data-number="${this.realtor.ID ? this.realtor.ID : ''}" class="subtitle subtitle_open">
                    ${this.realtor.LAST_NAME ? this.realtor.LAST_NAME : ''}
                    ${this.realtor.NAME ? this.realtor.NAME : ''}
                    ${this.realtor.SECOND_NAME ? this.realtor.SECOND_NAME : ''}
                  </span>
                </div>
                <div class="about__item about__item_background">
                  <span class="subtitle">Фамилия</span>
                  <span class="subtitle">${this.client.LAST_NAME ? this.client.LAST_NAME : ''}</span>
                </div>
                <div class="about__item about__item_background">
                  <span class="subtitle">Имя</span>
                  <span class="subtitle">${this.client.NAME ? this.client.NAME : ''}</span>
                </div>
                <div class="about__item about__item_background">
                  <span class="subtitle">Отчество</span>
                  <span class="subtitle">${this.client.SECOND_NAME ? this.client.SECOND_NAME : ''}</span>
                </div>
                ${phone}
                <div class="client__field-text"> 
                    <span class="subtitle subtitle_center">Комментарии</span>
                    <div class="about__item about__item-phone"> 
                      <span class="subtitle">Отправить СМС</span>
                      <div data-check="elem" class="about__container"> 
                        <input data-check="elem" name="numberPhone" class="input__text input__select" type="text" readonly 
                        value="${this.client.HAS_PHONE === "Y" ? this.client.PHONE[0].VALUE : ''}">
                        <div data-check="elem" class="about__select numberPhone inVisible"> 
                          ${phoneSelect}
                        </div>
                      </div>
                    </div>
                    <textarea class="client__area"></textarea>
                    <div class="client__comment-sms"> 
                      <textarea class="client__area client__area-sms"></textarea>
                      <button data-send="sms" class="can-btn client__btn-sms">Отправить</button>
                    </div>
                </div>
                <div class="client__buttons"> 
                    <button data-answer="denial" class="can-btn can-btn_width33 client__btn-fail">отказ</button>
                    <button data-answer="${this.info.request.type === 'frompars' ? 'agree' : 'confirms'}" class="can-btn can-btn_width33 client__btn-agree">${this.info.request.type === 'frompars' ? 'согласен' : 'подтверждает'}</button>
                    <button data-answer="fail" class="can-btn can-btn_width33 client__btn-fail">не ответил</button>
                </div>
              </div>`
  }
}

class ControlLayout{
  constructor() {
  }
  render(){
    return `<div class="control__wrap">
                <span data-add="task" class="subtitle subtitle_open">Добавить задачу/заметку для Риелтора</span>
            </div>`
  }
}

const app = new App();
app.init();

const api = new API();

