const UID = atob(objectUID);

const APIobj = "https://50970.vds.miran.ru:553/Servers/Internal/Deal.php";
const APIusers = "https://crm.centralnoe.ru/dealincom/connector/Users.php";
const APIchats = "https://50970.vds.miran.ru:553/Servers/Internal/Negotiation.php";

class Server {
  constructor() {
  }
  async getJson(request1Cnamed, API){
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
    let response = await fetch(API, requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    return jsonA;
  }
}

class App {
  constructor() {
    this.container = document.querySelector('.buySell');
    this.obj = '';
    this.copyObj = '';
  }
  init(){
    this.container.insertAdjacentHTML('beforeend', new Render(this.obj).render());
    this.initTooltip();
    this.setStartSelectStyle();
    new Handler(this.container).init();
    new File().init();
  }
  initTooltip(){
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  }
  setStartSelectStyle(){
    selectStyle('.summary__type', `${this.obj.type ? this.obj.type : 'Выберете'}`, `type`);
    selectStyle('.summary__kind', `${this.obj.redemption ? this.obj.redemption : 'Нет'}`, 'redemption');
  }
  getObj(data){
    this.obj = data;
    this.copyObj = JSON.parse(JSON.stringify(this.obj));
    this.init();
  }
}

class Render {
  constructor(obj) {
    this.obj = obj;
  }
  getTableBodyExtended(){
    let bodyExtended = '';
    if(this.obj.extended.length > 0){
      for (let item of this.obj.extended){
        bodyExtended += `<tr class="extended${item.UID}">
                      <td>
                        <span data-burger="burger" data-elem="check" class="table__burger"></span>
                        <div data-elem="check" class="burger-hide isVisible">
                          <div data-elem="check" class="burger__btn-group">
                              <button data-uid="${item.UID}" data-key="extended" data-elem="check" data-row="edit" class="burger__btn">Редактировать</button>
                              <button data-uid="${item.UID}" data-key="extended" data-elem="check" data-row="remove" class="burger__btn">Удалить</button>
                          </div>
                        </div>
                      </td>
                      <td>${item.typeRecord ? item.typeRecord : ''}</td>
                      <td>${item.realtor.FULL_NAME ? item.realtor.FULL_NAME : ''}</td>
                      <td>${item.accomplice.FULL_NAME ? item.accomplice.FULL_NAME : ''}</td>
                      <td><input class="checkbox" type="checkbox" disabled ${item.isPayer === '1' ? 'checked' : ''}></td>
                      <td>${item.contractId.UID ? item.contractId.UID : ''}</td>
                      <td>${item.price ? item.price : ""}</td>
                    </tr>`
      }
    }
    return bodyExtended;
  }
  setFileDocType(file){
    let firsWord = '';
    if (file.type === 'egrn'){
      firsWord = 'ЕГРН';
    } else if (file.type === 'contract'){
      firsWord = 'ДОУ';
    } else if (file.type === 'grp'){
      firsWord = 'ГРП';
    } else if (file.type === 'other'){
      firsWord = 'Прочие документы';
    }
    return firsWord;
  }
  getFile(){
    let fileLayout = '';
    for (let file of this.obj.documents){
      fileLayout += `<tr class="file${file.UID}"> 
                        <td> 
                          <span data-burger="burger" data-elem="check" class="table__burger"></span>                                  
                          <div data-elem="check" class="burger-hide isVisible"> 
                            <div data-elem="check" class="burger__btn-group">
                              <a class="burger__btn" href="${file.URL}" target="_blank" download="${file.filename}">Скачать</a>
                              <button data-uid="${file.UID}" data-elem="check" data-file="edit" class="burger__btn">Редактировать</button>
                              <button data-uid="${file.UID}" data-elem="check" data-file="remove" class="burger__btn">Удалить</button>
                            </div>
                          </div>
                        </td>
                        <td class="type">${this.setFileDocType(file)}</td>
                        <td class="filename">${file.filename}</td>
                        <td>${file.author}</td>
                        <td>${file.created.split(" ")[0].split('-').reverse().join('.')}</td>                        
                      </tr>`
    }
    return fileLayout;
  }
  getNegotiation(){
    let isStatus = {
      status1: false,
      status2: false,
      status3: false,
      status4: false,
      status5: false,
      status6: false,
      status7: false,
      status8: false,
    }
    if (this.obj.Negotiation && this.obj.Negotiation.length > 0){
      for (let item of this.obj.Negotiation){
        if (item){
          isStatus[`status`+`${item.stage}`] = true;
        }
      }
    }
    return isStatus
  }
  getRealtorButtons(){
    if (this.obj.status === 1 || this.obj.status === 3){
      return `<button data-control="plus" class="ui-btn ui-btn-light-border control__btn">отправить</button>`
    } else if (this.obj.status === 1){
      return `<button data-control="plus" class="ui-btn ui-btn-light-border control__btn">сделка состоялась</button>
              <button data-control="minus" class="ui-btn ui-btn-light-border control__btn">сделка не состоялась</button>`
    } else {
      return `<button class="ui-btn ui-btn-light-border control__btn" disabled>отправить</button>`
    }
  }
  getExpertButtons(){
    if (this.obj.status === 2){
      return `<button data-control="plus" class="ui-btn ui-btn-light-border control__btn">согласовать</button>
              <button data-control="minus" class="ui-btn ui-btn-light-border control__btn">отклонить</button>`
    } else if (this.obj.status === 4){
      return `<button data-control="plus" class="ui-btn ui-btn-light-border control__btn">отправить</button>
              <button data-control="minus" class="ui-btn ui-btn-light-border control__btn">отклонить</button>`
    } else if (this.obj.status === 6){
      return `<button data-control="plus" class="ui-btn ui-btn-light-border control__btn">сделка состоялась</button>
              <button data-control="minus" class="ui-btn ui-btn-light-border control__btn">сделка не состоялась</button>`
    } else if (this.obj.status === 7){
      return `<button data-control="plus" class="ui-btn ui-btn-light-border control__btn">документы получены</button>`
    } else {
      return `<button class="ui-btn ui-btn-light-border control__btn" disabled>согласовать</button>
              <button class="ui-btn ui-btn-light-border control__btn" disabled>отклонить</button>`
    }
  }
  render(){
    const realtorButtons = this.getRealtorButtons();
    const expertButtons = this.getExpertButtons();
    const tableBodyExtended = this.getTableBodyExtended();
    const file = this.getFile();
    const negotiation = this.getNegotiation();
    return `<div class="save-change">
                <div class="save-change__group"> 
                  <button data-save="all" class="ui-btn ui-btn-success">Сохранить</button>
                  <button data-save="no" class="ui-btn ui-btn-link save-change__btn">Отменить</button>
                </div>
                <div class="save-change-error"> 
                
                </div>
            </div>
            <input class="mobile-toggle__input" id="menu__toggle" type="checkbox">
            <label class="mobile-toggle__label" for="menu__toggle"> 
              <span class="mobile-toggle__span"></span>
            </label>
            <nav class="change-page">
              <a class="ui-btn ui-btn-icon-eye-opened change-page__link" href="../object/?source=${source}&id=${UID}&IDDEAL=${deal}">Объект</a>
              <a class="ui-btn ui-btn-icon-page change-page__link" href="../agency/?source=${source}&id=${objectUID}&IDDEAL=${deal}">ДОУ</a>
              <a class="ui-btn change-page__link" href="../photo/?source=${source}&id=${objectUID}&IDDEAL=${deal}">Фото</a>
              <a class="ui-btn change-page__link" href="../promotion/?source=${source}&id=${objectUID}&IDDEAL=${deal}">Реклама</a>
              <a class="ui-btn ui-btn ui-btn-secondary ui-btn-icon-done change-page__link" href="../buySell/?source=${source}&id=${objectUID}&IDDEAL=${deal}">ПДКП/ДКП</a>
            </nav>
            <div class="container_grey">
              <div class="progress">
                <div class="progress__wrap"> 
                  <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Не заключен" 
                  class="${this.obj.status > 0 ? 'progress__number_active': ''} progress__number">1</span> 
                  <span data-status="1" class="progress__message progress1 ${negotiation.status1 ? '' : 'isVisible'}"></span>
                </div>
                <span class="progress__line"></span>
                <div class="progress__wrap">
                    <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Проверка экспертом" 
                      class="${this.obj.status > 1 ? 'progress__number_active': ''} progress__number">2</span>
                    <span data-status="2" class="progress__message progress2 ${negotiation.status2 ? '' : 'isVisible'}"></span>
                </div>
                <span class="progress__line"></span>
                <div class="progress__wrap"> 
                  <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="ПДКП" 
                    class="${this.obj.status > 2 ? 'progress__number_active': ''} progress__number">3</span>
                  <span data-status="3" class="progress__message progress3 ${negotiation.status3 ? '' : 'isVisible'}"></span>
                </div>   
                <span class="progress__line"></span>              
                <div class="progress__wrap"> 
                  <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Подготовка Экспертом ДКП" 
                    class="${this.obj.status > 3 ? 'progress__number_active': ''} progress__number">4</span>
                  <span data-status="4" class="progress__message progress4 ${negotiation.status4 ? '' : 'isVisible'}"></span>
                </div>
                <span class="progress__line"></span>         
                <div class="progress__wrap"> 
                  <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Разрешение на сделку Аналитик" 
                    class="${this.obj.status > 4 ? 'progress__number_active': ''} progress__number">5</span>
                  <span data-status="5" class="progress__message progress5 ${negotiation.status5 ? '' : 'isVisible'}"></span>
                </div>
                <span class="progress__line"></span>    
                <div class="progress__wrap"> 
                  <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="ДКП" 
                    class="${this.obj.status > 5 ? 'progress__number_active': ''} progress__number">6</span>
                  <span data-status="6" class="progress__message progress6 ${negotiation.status6 ? '' : 'isVisible'}"></span>
                </div>  
                <span class="progress__line"></span>  
                <div class="progress__wrap"> 
                  <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Росреестр" 
                    class="${this.obj.status > 6 ? 'progress__number_active': ''} progress__number">7</span>
                  <span data-status="7" class="progress__message progress7 ${negotiation.status7 ? '' : 'isVisible'}"></span>
                </div>  
                <span class="progress__line"></span>       
                <div class="progress__wrap"> 
                  <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Сделка закрыта" 
                    class="${this.obj.status > 7 ? 'progress__number_active': ''} progress__number">8</span>
                  <span data-status="8" class="progress__message progress8 ${negotiation.status8 ? '' : 'isVisible'}"></span>
                </div>
              </div>
              <div class="title__header"> 
                <span class="title__header-text">Управление</span>
                <div> 
                  <button class="ui-btn" data-title="reconciliation">Согласовать</button>
                </div>
              </div> 
              <div class="control"> 
                <div class="control__item ${isRealtor === 1 ? '' : 'control__item_disabled'}"> 
                  <div class="control__title">
                    <span class="control__text control_rieltor">риелтор</span>
                  </div>
                  <div class="control__buttons">
                    ${realtorButtons} 
                  </div>
                </div>
                <div class="control__item ${this.obj.analist ? loginID === this.obj.analist.UID ? '' : 'control__item_disabled' : 'control__item_disabled'}"> 
                  <div class="control__title">
                    <span class="control__text control_analist">аналитик</span>
                  </div>
                  <div class="control__buttons"> 
                    <button data-control="plus" class="ui-btn ui-btn-light-border control__btn" ${this.obj.status === 5 ? '' : 'disabled'}>согласовать</button>
                    <button data-control="minus" class="ui-btn ui-btn-light-border control__btn" ${this.obj.status === 5 ? '' : 'disabled'}>отклонить</button>
                  </div>
                </div>
                <div class="control__item ${this.obj.expert ? loginID === this.obj.expert.UID ? '' : 'control__item_disabled' : 'control__item_disabled'} "> 
                  <div class="control__title">
                    <span class="control__text control_expert">эксперт</span>
                  </div>
                  <div class="control__buttons"> 
                    ${expertButtons} 
                  </div>
                </div>
              </div>
              <div class="title__header"> 
                <span class="title__header-text">Сводка</span>
                <div> 
                  <button class="ui-btn">История</button>
                </div>
              </div> 
              <div class="summary"> 
                ${this.obj.address ? 
                `<p class="summary__title summary_allColumn">Объект: <span>${this.obj.address.reqCity} ${this.obj.address.reqStreet} ${this.obj.address.reqHouseNumber}</span></p>` : ''}
                <div class="summary__item"> 
                  <span class="summary__title">Дата сделки план</span>
                  <input name="datePlan" class="input" type="date" value="${this.obj.datePlan ? this.obj.datePlan.split(" ")[0] : ''}">
                </div>
                <div class="summary__item"> 
                  <span class="summary__title">Дата сделки факт</span>
                  <input name="dateFact" class="input" type="date" value="${this.obj.dateFact ? this.obj.dateFact.split(" ")[0] : ''}">
                </div>
                <div class="summary__item"> 
                  <span class="summary__title">Тип сделки</span>
                  <select name="type" class="summary__type"> 
                    <option>Ипотека</option>
                    <option>Оформление</option>
                    <option>Оценка для банка</option>
                    <option>Наличные</option>
                    <option>Аренда недвижимости</option>
                    <option>Приватизация</option>
                    <option>Перепланировка</option>
                    <option>Внутреннее исполнение</option>
                  </select>
                </div>
                <div class="summary__item"> 
                  <span class="summary__title">Выкуп</span>
                  <select name="redemption" class="summary__kind"> 
                    <option>Нет</option>
                    <option>Продаём</option>
                    <option>Покупаем</option>
                  </select>
                </div>
                <div class="summary__responsible summary_allColumn"> 
                  <div class="card"> 
                    <p class="card__title">Эксперт<i data-position="Эксперт" data-responsible="expert"></i></p>
                    <div class="card__wrapper"> 
                      <img class="card__img expert__img" 
                      src="${this.obj.expert ? `${this.obj.expert.PERSONAL_PHOTO ? this.obj.expert.PERSONAL_PHOTO : `../img/placeholder-user.png`}` : `../img/placeholder-user.png`}">
                      <b class="expert__text"> 
                        <a onclick="event.preventDefault()" target="_blank" class="blog-p-user-name" id="bp_R1gY0o5G" href="/company/personal/user/${this.obj.expert ? `${this.obj.expert.UID ? this.obj.expert.UID : ''}` : ''}/" 
                        bx-tooltip-user-id="${this.obj.expert ? `${this.obj.expert.UID ? this.obj.expert.UID : ''}` : ''}">
                          ${this.obj.expert ? `${this.obj.expert.FULL_NAME !== ' ' ? this.obj.expert.FULL_NAME : 'Назначить'}` : 'Назначить'}
                        </a>
                      </b>
                    </div>
                  </div>
                  <div class="card"> 
                    <p class="card__title">Аналитик<i data-position="Аналитик" data-responsible="analist"></i></p>
                    <div class="card__wrapper"> 
                      <img class="card__img analist__img" 
                      src="${this.obj.analist ? `${this.obj.analist.PERSONAL_PHOTO ? this.obj.analist.PERSONAL_PHOTO : `../img/placeholder-user.png`}` : `../img/placeholder-user.png`}">
                      <b class="analist__text"> 
                        <a onclick="event.preventDefault()" target="_blank" class="blog-p-user-name" id="bp_R1gY0o5G" href="/company/personal/user/${this.obj.expert ? `${this.obj.expert.UID ? this.obj.expert.UID : ''}` : ''}/"
                          bx-tooltip-user-id="${this.obj.analist ? `${this.obj.analist.UID ? this.obj.analist.UID : ''}` : ''}">
                          ${this.obj.analist ? `${this.obj.analist.FULL_NAME !== ' ' ? this.obj.analist.FULL_NAME : 'Назначить'}` : 'Назначить'}
                        </a>
                      </b>
                    </div>
                  </div>
                </div>
              </div>
              <div class="title__header"> 
                <span class="title__header-text">Услуги</span>
                <div> 
                  <button class="ui-btn">ДДС</button>
                </div>
              </div> 
              <div class="deal"> 
                <table class="table table-extended">
                  <thead> 
                    <tr> 
                      <td><span data-add="extended" class="table__add"></span></td>
                      <td>Вид</td>
                      <td>Риелтор</td>
                      <td>Контрагент</td>
                      <td>Плательщик</td>
                      <td>Договор</td>
                      <td>Сумма</td>
                    </tr>
                  </thead>
                  <tbody>
                    ${tableBodyExtended}
                  </tbody>
                </table>
              </div>
              <div class="title__header"> 
                <span class="title__header-text">Документы</span>
                <div> 
                  <button data-clear="docs" class="btn_edit ui-btn ui-btn-danger-light">Очистить</button>
                </div>
              </div> 
              <div class="docs"> 
                <div class="documents"> 
                  <div class="documents__wrap"> 
                    <span class="file__text">Договор об оказании услуг</span>
                    <span data-documents="dou" class="documents__btn"></span>
                  </div>
                  <div class="documents__wrap"> 
                    <span class="file__text">Акт показа объекта</span>
                    <span data-documents="act" class="documents__btn"></span>
                  </div>
                  <div class="documents__wrap"> 
                    <span class="file__text">Доп. соглашение (О продлении)</span>                       
                    <span data-documents="ds" class="documents__btn"></span>
                  </div>
                  <div class="documents__wrap"> 
                    <span class="file__text">Соглашение о цене</span>                      
                    <span data-documents="price" class="documents__btn"></span>
                  </div>
                </div>
                <div class="upload"> 
                  <div class="upload__wrap">                   
                    <div data-container="egrn" class="file upload_width"> 
                      <input name="egrn" class="file__input" id="file_egrn" type="file" multiple>
                      <label class="file__label" for="file_egrn"></label>
                      <span class="file__text">Загрузите правоустанавливающие</span>                      
                    </div>                                  
                  </div>  
                  <div class="upload__wrap">                    
                    <div data-container="contract" class="file upload_width"> 
                      <input name="contract" class="file__input" id="file_contract" type="file" multiple>
                      <label class="file__label" for="file_contract"></label>
                      <span class="file__text">Загрузите правоподтверждающие</span>
                    </div>                    
                  </div>                    
                  <div class="upload__wrap"> 
                    <div data-container="grp" class="file upload_width"> 
                    <input name="grp" class="file__input" id="file_grp" type="file" multiple>
                    <label class="file__label" for="file_grp"></label>
                    <span class="file__text">Загрузите паспорта</span>
                    </div>
                  </div>   
                  <div class="upload__wrap"> 
                    <div data-container="other" class="file upload_width"> 
                    <input name="other" class="file__input" id="file_other" type="file" multiple>
                    <label class="file__label" for="file_other"></label>
                    <span class="file__text">Загрузите справки</span>
                    </div>
                  </div>
                  <div class="upload__table"> 
                  <table class="table table-files">
                  <thead> 
                      <tr> 
                        <td></td>
                        <td>Тип</td>
                        <td>Название</td>
                        <td>Автор</td>
                        <td>Дата</td>
                      </tr>
                    </thead>
                      <tbody>
                        ${file}
                      </tbody>
                  </table>
                  </div>                
                </div>      
              </div>
            </div>`
  }
}

class Handler{
  constructor(container) {
    this.container = container;
    this.saveChange = document.querySelector('.save-change');
    this.mainPageCgange = [];
    this.currentElem = '';
    this.currentRow = '';
    this.currentFile = '';
    this.listName = [];
    this.listContract = [];
    this.listClients = [];
    this.currentDED = '';
    this.negotiationList = [];
    this.currentNegotiation = '';
  }
  init(){
    const allInputs = document.querySelectorAll(`INPUT[type='date']`);
    for (let input of allInputs){
      input.addEventListener('change', () => {
        this.mainPageCgange.push(input);
        this.saveChange.classList.add('save-change_active');
      })
    }

    const selectInput = document.querySelectorAll('.select__gap');
    for (let item of selectInput){
      const observer = new MutationObserver(event => {
        this.mainPageCgange.push(event[0]);
        this.saveChange.classList.add('save-change_active');
      })
      observer.observe(item, {childList: true});
    }

    this.saveChange.addEventListener('click', event => {
      if (event.target.dataset.save === 'all'){
        if (this.pageIsValid()){
          this.setAllNewValue();
          if (app.copyObj.status === 0){
            app.copyObj.status = 1;
          }
          server.getJson({
            action: 'set',
            dealid: deal,
            data: app.copyObj,
          }, APIobj).then(() => {
            this.saveChange.classList.add('save-change_close');
            setTimeout(() => {
              location.reload();
            }, 500);
          });
        }
      } else if (event.target.dataset.save === 'no'){
        this.saveChange.classList.add('save-change_close');
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    })

    this.container.addEventListener('click', event => {
      if (event.target.dataset.add === 'extended'){
        server.getJson({action: 'getUsers', type: 'realtor'}, APIusers).then(data => {
          this.listName = data;
          server.getJson({action: 'getContracts', dealid: deal}, APIobj).then(data => {
            this.listContract = data;
            server.getJson({action: 'getClients', dealid: deal}, APIobj).then(data => {
              this.listClients = data;
              this.openModule(this.extendedLayout());
              this.setExtendedSelect();
            })
          })
        })
      } else if (event.target.dataset.burger === 'burger'){
        if(this.currentElem){
          if (this.currentElem === event.target.nextElementSibling){
            this.currentElem.classList.add('isVisible');
            this.currentElem = '';
          } else {
            this.checkCurrentElem();
            event.target.nextElementSibling.classList.remove('isVisible');
            this.currentElem = event.target.nextElementSibling;
          }
        } else {
          event.target.nextElementSibling.classList.remove('isVisible');
          this.currentElem = event.target.nextElementSibling;
        }
      } else if (event.target.dataset.row === 'edit'){
        server.getJson({action: 'getUsers', type: 'realtor'}, APIusers).then(data => {
          this.listName = data;
          server.getJson({action: 'getContracts', dealid: deal}, APIobj).then(data => {
            this.listContract = data;
            server.getJson({action: 'getClients', dealid: deal}, APIobj).then(data => {
              this.listClients = data;
              this.editRow(event);
            })
          })
        })
      } else if (event.target.dataset.row === 'remove'){
        this.removeRow(event);
        this.saveChange.classList.add('save-change_active');
      } else if (event.target.dataset.file === 'edit'){
        this.editFile(event);
      } else if (event.target.dataset.file === 'remove'){
        this.removeFile(event);
        this.saveChange.classList.add('save-change_active');
      } else if (event.target.dataset.responsible === 'analist' || event.target.dataset.responsible === 'expert'){
        server.getJson({action: 'getUsers', type: `${event.target.dataset.responsible}`}, APIusers).then(data => {
          this.listName = data;
          this.openModule(this.responsibleLayout(event));
        })
      } else if (event.target.dataset.title === 'reconciliation'){
        this.openModule(this.reconciliationLayout());
        selectStyle('.reconciliation-select', 'Выбрать', 'reconciliationType')
      } else if (event.target.dataset.status){
        this.setLoader();
        const obj = {action: 'getForStage', dealId: app.copyObj.UID, stage: event.target.dataset.status};
        console.log(obj)
        server.getJson(obj, APIchats)
          .then(data => {
            console.log(data)
            this.negotiationList = data;
            this.openModule(this.negotiationSelect());
            this.removeLoader();
        })
      } else if (event.target.dataset.control === 'plus'){
        this.setLoader();
        app.copyObj.status ++;
        server.getJson({
          action: 'set',
          dealid: deal,
          data: app.copyObj,
        }, APIobj).then(() => {
            location.reload();
        });
      } else if (event.target.dataset.control === 'minus'){
        this.setLoader();
        app.copyObj.status --;
        server.getJson({
          action: 'set',
          dealid: deal,
          data: app.copyObj,
        }, APIobj).then(() => {
            location.reload();
        });
      }
    })

    document.body.addEventListener('click', event => {
      if (event.target.dataset.elem !== 'check'){
        this.checkCurrentElem();
      }
    })
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

  pageIsValid(){
    const datePlan = document.querySelector(`INPUT[name='datePlan']`);
    if (datePlan.value.length === 0){
      datePlan.classList.add('isVisible');
    } else {
      datePlan.classList.remove('isVisible');
    }
    return datePlan.value.length > 0;
  }
  setAllNewValue(){
    for (let item of this.mainPageCgange){
      if (item.tagName === 'INPUT'){
        app.copyObj[item.name] = item.value;
      } else if (item.target.tagName === 'DIV'){
        console.log(item)
        app.copyObj[item.target.id] = item.target.innerHTML;
      }
    }
    console.log(app.copyObj)
  }

  checkCurrentElem(){
    if (this.currentElem){
      this.currentElem.classList.add('isVisible')
      this.currentElem = '';
    }
  }

  editRow(event){
    this.currentRow = app.copyObj[event.target.dataset.key].find(item => item.UID === +event.target.dataset.uid || item.UID === event.target.dataset.uid);
    this.openModule(this.extendedLayout());
    this.setExtendedSelect();
  }
  removeRow(event){
    document.querySelector(`.${event.target.dataset.key}${event.target.dataset.uid}`).remove();
    let find = app.copyObj[event.target.dataset.key].find(item => item.UID === +event.target.dataset.uid || item.UID === event.target.dataset.uid);
    // let indexFind = app.copyObj[event.target.dataset.key].indexOf(find);
    // app.copyObj[event.target.dataset.key].splice(indexFind, 1);
    if (find){
      find.forDelete = 1;
    }
    console.log(app.copyObj)
  }

  editFile(event){
    this.currentFile = app.copyObj.documents.find(item => item.UID === +event.target.dataset.uid || item.UID === event.target.dataset.uid);
    this.openModule(this.editFileLayout());
    selectStyle('.documentTypeSelect', `${this.setFileDocType()}`)
    this.setFileDocType(this.currentFile);
  }
  removeFile(event){
    document.querySelector(`.file${event.target.dataset.uid}`).remove();
    let findFile = app.copyObj.documents.find(item => item.UID === +event.target.dataset.uid || item.UID === event.target.dataset.uid);
    // let indexFind = app.copyObj.documents.indexOf(findFile);
    // app.copyObj.documents.splice(indexFind, 1);
    if (findFile){
      findFile.forDelete = 1;
    }
    console.log(app.copyObj)
  }
  getFileDocType(fileType){
    let firsWord = '';
    if (fileType === 'ЕГРН'){
      firsWord = 'egrn';
    } else if (fileType === 'ДОУ'){
      firsWord = 'contract';
    } else if (fileType === 'ГРП'){
      firsWord = 'grp';
    } else if (fileType === 'Прочие документы'){
      firsWord = 'other';
    }
    return firsWord;
  }
  setNewChangesFile(module, event){
    const fileInput = module.querySelector('INPUT');
    const fileSelect = module.querySelector('SELECT');
    const fileRow = document.querySelector(`.file${event.target.dataset.uid}`);
    this.currentFile[fileInput.name] = fileInput.value;
    this.currentFile[fileSelect.name] = this.getFileDocType(fileSelect.value);
    fileRow.querySelector(`.${fileInput.name}`).innerHTML = fileInput.value;
    fileRow.querySelector(`.${fileSelect.name}`).innerHTML = fileSelect.value;
    this.closeModule(module);
    this.currentFile = '';
    this.saveChange.classList.add('save-change_active');
    console.log(app.copyObj)
  }

  clearState(){
    this.currentRow = '';
    this.currentFile = '';
    this.listName = [];
    this.currentDED = '';
    this.listContract = [];
    this.listClients = [];
  }
  openModule(field){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="module">
                          <span data-module="close" class="module__close"></span>
                          <div class="module__wrap">${field}</div>                          
                    </div>`
    this.container.insertAdjacentHTML('beforebegin', layout);
    this.handlerModule();
  }
  handlerModule(){
    const module = document.querySelector('.module');
    module.addEventListener('click', event => {
      if(event.target.dataset.module === 'close'){
        this.closeModule(module);
        this.clearState();
      } else if (event.target.dataset.save === 'responsible'){
          let inputLogin = document.querySelector('INPUT').dataset.login;
          let findResponsible = this.listName.find(user => user.LOGIN === inputLogin);
          if (findResponsible){
            app.copyObj[event.target.dataset.position] = findResponsible;
            document.querySelector(`.${event.target.dataset.position}__img`).src = `${findResponsible.PERSONAL_PHOTO ? findResponsible.PERSONAL_PHOTO : `../img/placeholder-user.png`}`;
            document.querySelector(`.${event.target.dataset.position}__text`).innerHTML =
              `<a class="blog-p-user-name" id="bp_R1gY0o5G" href="/company/personal/user/${findResponsible.UID}/" 
                        bx-tooltip-user-id="${findResponsible.UID}">
                          ${findResponsible.FULL_NAME}
                        </a>`;
            this.closeModule(module);
            this.saveChange.classList.add('save-change_active');
          }
      } else if (event.target.tagName === 'DIV' && event.target.dataset.responsible){
          search.value = event.target.dataset.responsible;
          search.setAttribute('data-login', `${event.target.dataset.login}`);
          this.setSelectResponsible(event.target);
      } else if (event.target.dataset.save === 'file'){
          this.setNewChangesFile(module, event);
      } else if (event.target.tagName === 'DIV' && event.target.dataset.realtor){
          searchRealtor.value = event.target.dataset.realtor;
          document.querySelector('.realtorContainer').classList.add('isVisible');
      } else if (event.target.dataset.extended === 'save'){
          if (this.isValidExtended(module)){
            if (this.currentRow){
              this.setNewValue(module, this.currentRow, 'edit');
            } else {
              const newRow = {
                UID: 'N' + Math.floor(Math.random()*1000),
                dealId: deal,
                id1c: "0",
              }
              this.setNewValue(module, newRow, 'add');
            }
            this.closeModule(module);
            this.clearState();
            this.saveChange.classList.add('save-change_active');
          }
      } else if (event.target.dataset.reconciliation === 'save'){
        this.setValueReconciliation(module);
        this.closeModule(module);
      } else if (event.target.dataset.negotiation === 'forward'){
        this.closeModule(module);
        const find = this.negotiationList.find(item => item.UID === +event.target.dataset.uid);
        this.currentNegotiation = find;
        this.openModule(this.negotiationLayout(find));
        const allMessage = document.querySelectorAll('.message');
        if (allMessage.length > 0){
          allMessage[allMessage.length-1].scrollIntoView();
        }
      } else if (event.target.dataset.message === 'send'){
          this.setNewMessage(module, event.target.dataset.uid);
      } else if(event.target.dataset.negotiation === 'back'){
          this.closeModule(module);
          this.openModule(this.negotiationSelect());
      } else if (event.target.dataset.negotiation === 'status'){
        const findNegotiation = this.negotiationList.find(item => item.UID === +event.target.dataset.uid);
        let findItem = '';
        if (event.target.dataset.status === '4'){
          findItem = findNegotiation.Items[0];
        }else {
          findItem = findNegotiation.Items.find(item => item.entrant.UID === loginID);
        }
        if (findItem){
          this.setNegotiationItem(module, findItem.UID, findNegotiation.UID, event.target.dataset.status);
          console.log(findItem)
        }
      }
    })


    document.body.addEventListener('keyup', event => {
      if(event.code === 'Escape'){
        this.closeModule(module);
      }
    })


    const search = document.querySelector('.input-search');
    if (search){
      search.addEventListener('keyup', () => {
        const container = document.querySelector('.layout__field');
        const regExp = new RegExp(search.value, 'i');
        let filterArea = this.listName.filter(user => regExp.test(user.LAST_NAME) || regExp.test(user.NAME))
        container.innerHTML = "";
        for (let item of filterArea){
          container.insertAdjacentHTML('beforeend',
              `<div data-responsible="${item.LAST_NAME} ${item.NAME}" data-login="${item.LOGIN}" class="card__wrapper module-card__wrap"> 
                      <img class="card__img module-card__img" src="${item.PERSONAL_PHOTO ? item.PERSONAL_PHOTO : '../img/placeholder-user.png'}" alt="photo">
                      <span class="card__text module-card__text">${item.LAST_NAME} ${item.NAME}</span>
                    </div>`)
        }
      })
    }
    const searchRealtor = document.querySelector(`INPUT[name='realtor']`);
    if (searchRealtor){
      searchRealtor.addEventListener('keyup', () => {
        const container = document.querySelector('.realtorContainer');
        const regExp = new RegExp(searchRealtor.value, 'i');
        let filterArea = this.listName.filter(user => regExp.test(user.LAST_NAME) || regExp.test(user.NAME));
        container.innerHTML = "";
        for (let item of filterArea){
          container.insertAdjacentHTML('beforeend',
            `<div data-realtor="${item.LAST_NAME} ${item.NAME}" data-login="${item.LOGIN}" class="card__wrapper module-card__wrap">
                      <img class="card__img module-card__img" src="${item.PERSONAL_PHOTO ? item.PERSONAL_PHOTO : '../img/placeholder-user.png'}" alt="photo">
                      <span class="card__text module-card__text">${item.LAST_NAME} ${item.NAME}</span>
                    </div>`)
        }
        if (filterArea.length > 0){
          container.classList.remove('isVisible');
        } else {
          container.classList.add('isVisible');
        }
      })
      const fieldPrice = document.querySelector(`INPUT[name='price']`);
      fieldPrice.addEventListener('keyup', event => {
        event.target.value = event.target.value.replace(/[^\d]/g, '');
        let priceValue = event.target.value.split(' ').join('');
        event.target.value = priceValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      })
    }

    const messageArea = document.querySelector('.message__textarea');
    if (messageArea){
      messageArea.addEventListener('keyup', event => {
        if (event.code === 'Enter' && event.ctrlKey){
          this.setNewMessage(module, this.currentNegotiation.UID);
        }
      })
    }
  }
  closeModule(module){
    const htmlDom = document.querySelector('HTML');
    htmlDom.removeAttribute("style");
    module.remove();
  }

  setSelectResponsible(elem){
    if(this.currentDED){
      if (this.currentDED !== elem){
        this.currentDED.classList.remove('module-card__wrap_active');
        this.currentDED = elem;
        elem.classList.add('module-card__wrap_active');
      }
    } else {
      this.currentDED = elem;
      elem.classList.add('module-card__wrap_active');
    }
  }
  getUsers(){
    let users = '';

    for (let user of this.listName){
      users += `<div data-responsible="${user.LAST_NAME} ${user.NAME}" data-login="${user.LOGIN}" class="card__wrapper module-card__wrap"> 
                  <img class="card__img module-card__img" src="${user.PERSONAL_PHOTO ? user.PERSONAL_PHOTO : '../img/placeholder-user.png'}" alt="photo">
                  <span class="card__text module-card__text">${user.LAST_NAME} ${user.NAME}</span>
                </div>`
    }
    return users;
  }
  responsibleLayout(event){
    const users = this.getUsers();
    return `<span class="title__header-text">${event.target.dataset.position}</span>
                <div class="layout"> 
                <div class="layout__item"> 
                  <span class="layout__title">ФИО</span>
                  <input type="text" class="input input-search" placeholder="Начните вводить">
                </div>
                <div class="layout__field">
                    ${users} 
                </div>
              </div> 
              <div class="layout__btn"> 
                <button data-position="${event.target.dataset.responsible}" data-save="responsible" class="ui-btn">сохранить</button>
                <button data-module="close" class="ui-btn ui-btn-danger-light">закрыть</button>
              </div>`
  }

  setNewValue(module, obj, action){
    const allSelect = module.querySelectorAll('.select__gap');
    const allInputs = module.querySelectorAll(`INPUT[type='text']`);
    const checkInput = module.querySelector(`INPUT[type='checkbox']`);
    for (let select of allSelect){
      if (select.id === 'typeRecord'){
        obj[select.id] = select.innerHTML;
      } else if (select.id === 'accomplice'){
        let findAccomplice = this.listClients.find(item => item.FULL_NAME === select.innerHTML);
        obj[select.id] = findAccomplice;
      } else if (select.id === 'contractId'){
        let findContractId = this.listContract.find(item => item.UID === +select.innerHTML);
        obj[select.id] = findContractId;
      }
    }
    for (let input of allInputs){
      if (input.name === 'price'){
        obj[input.name] = input.value.split(' ').join('');
      } else if (input.name === 'realtor'){
        let findRealtor = this.listName.find(item => item.FULL_NAME === input.value);
        obj[input.name] = findRealtor;
      }
    }
    if (checkInput.checked){
      obj[checkInput.name] = '1';
    } else {
      obj[checkInput.name] = '0';
    }
    if (action === 'add'){
      app.copyObj.extended.push(obj);
    } else if (action === 'save'){
      const indexRow = app.copyObj.extended.indexOf(obj);
      app.copyObj.extended.splice(indexRow, 1, obj);
    }
    const table = document.querySelector('.table-extended');
    const tableBody = table.querySelector('tbody');
    tableBody.innerHTML = '';
    tableBody.insertAdjacentHTML('beforeend', new Render(app.copyObj).getTableBodyExtended());
  }
  isValidExtended(module){
    const validValue = {
      typeRecord: true,
      accomplice: true,
      contractId: true,
      realtor: true,
      price: true,
    }
    const allSelect = module.querySelectorAll('.select__gap');
    const allInputs = module.querySelectorAll(`INPUT[type='text']`);

    for (let select of allSelect){
      if (select.innerHTML === 'Выберете'){
        select.classList.add('isValid');
        validValue[select.id] = false;
      } else {
        select.classList.remove('isValid');
        validValue[select.id] = true;
      }
    }
    for (let input of allInputs){
      if (input.value.length > 0){
        input.classList.remove('isValid');
        validValue[input.name] = true;
        if (input.name === 'realtor'){
          const find = this.listName.find(item => item.FULL_NAME === input.value);
          if (find){
            input.classList.remove('isValid');
            validValue[input.name] = true;
          } else {
            input.classList.add('isValid');
            validValue[input.name] = false;
          }
        }
      } else{
        input.classList.add('isValid');
        validValue[input.name] = false;
      }
    }
    let count = 0;
    for (let [key, value] of Object.entries(validValue)){
      if (value === true){
        count++;
      }
    }
    return count === 5;
  }
  getContract(){
    let contract = '';
    if (this.listContract.length > 0){
      for (let item of this.listContract){
        contract += `<option>${item.UID}</option>`;
      }
    }
    return contract;
  }
  getClients(){
    let clients = '';
    if (this.listClients.length > 0){
      for (let client of this.listClients){
        clients += `<option>${client.FULL_NAME}</option>`;
      }
    }
    return clients;
  }
  extendedLayout(){
    const contract = this.getContract();
    const clients = this.getClients();
    return `<span class="title__header-text">Услуги</span>
                <div class="layout"> 
                <div class="layout__item"> 
                  <span class="layout__title">Вид сделки</span>
                  <select class="typeRecord" name="typeRecord"> 
                    <option>Продавец</option>
                    <option>Покупатель</option>
                  </select>
                </div>
                <div class="layout__item"> 
                  <span class="layout__title">Риелтор</span>
                  <input class="input" type="text" name="realtor" value="${this.currentRow.realtor ? this.currentRow.realtor.FULL_NAME : ''}" autocomplete="off">
                  <div class="realtorContainer isVisible"></div>
                </div>
                <div class="layout__item"> 
                  <span class="layout__title">Контрагент</span>
                  <select class="accomplice" name="accomplice"> 
                    ${clients}
                  </select>
                </div>                 
                <div class="layout__item"> 
                  <span class="layout__title">Договор</span>
                  <select class="contractId" name="contractId"> 
                    ${contract}
                  </select>
                </div>
                <div class="layout__item"> 
                  <span class="layout__title">Сумма</span>
                  <input type="text" class="input" name="price" value="${this.currentRow.price ? this.currentRow.price : ''}" autocomplete="off">
                </div>
                <div class="layout__item payer"> 
                  <span class="layout__title payer__text">Плательщик</span>
                  <label class="switch switch_margin">
                    <input name="isPayer" class="switch__open" type="checkbox" ${this.currentRow.isPayer === '1' ? 'checked' : ''} autocomplete="off">
                    <span class="slider slider__main"></span>
                </label>
                </div>
              </div> 
              <div class="layout__btn"> 
                <button data-extended="save" class="ui-btn">сохранить</button>
                <button data-module="close" class="ui-btn ui-btn-danger-light">закрыть</button>
              </div>`
  }
  setExtendedSelect(){
    selectStyle('.typeRecord', `${this.currentRow.typeRecord ? this.currentRow.typeRecord : 'Выберете'}`, 'typeRecord');
    selectStyle('.accomplice', `${this.currentRow.accomplice ? this.currentRow.accomplice.FULL_NAME : 'Выберете'}`, 'accomplice');
    selectStyle('.contractId', `${this.currentRow.contractId ? this.currentRow.contractId.UID : 'Выберете'}`, 'contractId');
  }

  editFileLayout(){
    return `<span class="title__header-text">Файл</span>
              <div class="layout"> 
                <div class="edit__wrap"> 
                  <span class="edit__text">Название</span>
                  <input class="input" name="filename" type="text" value="${this.currentFile.filename}">
                </div>
                <div class="edit__wrap"> 
                  <span class="edit__text">Тип документа</span>
                  <select class="documentTypeSelect" name="type">
                    <option>ЕГРН</option>
                    <option>ДОУ</option>
                    <option>ГРП</option>
                    <option>Прочие документы</option>
                  </select>
                </div>
                <div>
                  <button data-uid="${this.currentFile.UID}" class="ui-btn" data-save="file">Сохранить</button>
                  <button data-module="close" class="ui-btn ui-btn-danger-light">закрыть</button>      
                </div>
              </div>`
  }
  setFileDocType(){
    let firsWord = '';
    if (this.currentFile.type === 'egrn'){
      firsWord = 'ЕГРН';
    } else if (this.currentFile.type === 'contract'){
      firsWord = 'ДОУ';
    } else if (this.currentFile.type === 'grp'){
      firsWord = 'ГРП';
    } else if (this.currentFile.type === 'other'){
      firsWord = 'Прочие документы';
    }
    return firsWord;
  }

  reconciliationLayout(){
    return `<span class="title__header-text">Согласования</span>
                <div class="layout"> 
                <div class="layout__item"> 
                  <span class="layout__title">Тип согласования</span>
                  <select class="reconciliation-select" id="reconciliationType"> 
                    <option>Согласование отклонений</option>
                    <option>Согласование выкупа</option>
                  </select>
                </div>
                <div class="layout__item"> 
                  <span class="layout__title">Комментарий</span>
                  <textarea name="reconciliationText" cols="30" rows="10"></textarea>
                </div>
              </div> 
              <div class="layout__btn"> 
                <button data-reconciliation="save" class="ui-btn">начать</button>
                <button data-module="close" class="ui-btn ui-btn-danger-light">закрыть</button>
              </div>`
  }
  setValueReconciliation(module){
    const commit = module.querySelector('TEXTAREA');
    const type = module.querySelector('.select__gap');
    const reconciliation = {
      stage: app.copyObj.status,
      author: loginID,
      commit: commit.value,
      type: type.innerHTML,
      UID: app.copyObj.UID,
      action: 'newNegotiation',
    }
    server.getJson(reconciliation, APIchats).then(() => {
      document.querySelector(`.progress${app.copyObj.status}`).classList.remove('isVisible');
    })
  }

  getStatus(item){
    switch (item.result){
      case 0:
        return 'Открыта';
      case 1:
        return 'Согласованно';
      case 2:
        return 'Согласованно с замечанием';
      case 3:
        return 'Не согласованно';
      case 4:
        return 'Отменено';
      default:
        return 'Ошибка';
    }
  }
  negotiationGetDate(){
    let date = '';
    for (let item of this.negotiationList){
      if (item){
        date += `<div data-uid="${item.UID}" data-negotiation="forward" class="negotiation__btn">
                <p>${item.created.split(" ")[0].split('-').reverse().join('.')} <span>${this.getStatus(item)}</span></p>
                </div>`
      }
    }
    return date;
  }
  negotiationSelect(){
    return `<span class="title__header-text">Выберете дату согласования</span>
            <div class="negotiation"> 
              ${this.negotiationGetDate()}
            </div>`
  }
  getNegotiationTable(items){
    if (items.length > 0){
      let row = '';
      for (let item of items){
        row += `<tr> 
                  <td>${item.queue}</td>
                  <td>${item.entrant.FULL_NAME}</td>
                  <td>${item.expiration.split(" ")[0].split('-').reverse().join('.')}</td>
                  <td>${this.getStatus(item)}</td>
                </tr>`;
      }
      return row;
    }
      return ``;
  }
  getNegotiationMessage(negotiation){
    if (negotiation.Discussion.length > 0){
      let messageList = '';
      for (let message of negotiation.Discussion){
        messageList += `<div class="message ${message.author.UID === loginID ? 'message_self' : ''}">
                          <p class="message__name">${message.author.FULL_NAME}</p>
                          <span class="message__text">${message.message}</span>
                          <span class="message__time">${message.created.split(" ")[0].split('-').reverse().join('.')} ${message.created.split(" ")[1].split('.')[0]}</span>
                        </div>`
      }
      return messageList
    }
    return ``
  }
  setNewMessage(module, uid){
    const messageValue = module.querySelector(`TEXTAREA[name='message']`);
    const messageField = module.querySelector('.message__field');
    const findNegotiation = this.negotiationList.find(item => item.UID === +uid);
    messageField.insertAdjacentHTML('beforeend',
      `<div class="message message_self">
              <p class="message__name">${userFullName}</p>
              <span class="message__text">${messageValue.value}</span>
              <span class="message__time">${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString(`ru-RU`)}</span>
            </div>`);
    const message = messageValue.value;
    messageValue.value = '';
    const allMessage = document.querySelectorAll('.message');
    allMessage[allMessage.length-1].scrollIntoView();
    findNegotiation.Discussion.push({
      author:{
        FULL_NAME: userFullName,
        UID: loginID,
      },
      message: message,
      created: `${new Date().toLocaleDateString('ru-RU').split('.').reverse().join('-')} ${new Date().toLocaleTimeString(`ru-RU`)}`
    });
    server.getJson({
          message: message,
          author: loginID,
          negotiation: findNegotiation.UID,
          action: 'sendMessage'
        }, APIchats);
  }
  setNegotiationItem(module, itemUID, negotiationUID, status){
    server.getJson({
      action: 'setItem',
      author: loginID,
      result: +status,
      UID: itemUID
    }, APIchats).then(data => {
      const negotiation = this.negotiationList.find(negotiation => negotiation.UID === negotiationUID)
      negotiation.Items = data;
      const table = module.querySelector('.negotiation__table');
      const bodyTable = table.querySelector(`TBODY`);
      bodyTable.innerHTML = '';
      bodyTable.insertAdjacentHTML('beforeend', this.getNegotiationTable(data));
    })
  }

  negotiationLayout(negotiation){
    return `<span class="title__header-text">Согласование отклонений</span>
                <div class="layout"> 
                  <div class="layout__btn-header ${negotiation.result !== 0 ? 'negotiation__disable-btn' : ''}"> 
                    <button data-uid="${negotiation.UID}" data-negotiation="status" data-status="1" class="ui-btn ui-btn-success">Согласовать</button>
                    <button data-uid="${negotiation.UID}" data-negotiation="status" data-status="2" class="ui-btn ui-btn-danger-light">Согласовать с замечанием</button>
                    <button data-uid="${negotiation.UID}" data-negotiation="status" data-status="3" class="ui-btn ui-btn-danger-dark">Не согласованно</button>
                    <button data-uid="${negotiation.UID}" data-negotiation="status" data-status="4" 
                    class="ui-btn ${+loginID === negotiation.requester ? '' : 'disabled'}">Отменить</button>
                  </div>
                  <div class="layout__item"> 
                    <table class="table negotiation__table"> 
                      <thead> 
                        <td>№</td>
                        <td>Согласующий</td>
                        <td>Срок</td>
                        <td>Результат</td>
                      </thead>
                      ${this.getNegotiationTable(negotiation.Items)}
                    </table>
                  </div>
                  <div class="layout__item"> 
                    <div class="message__field">${this.getNegotiationMessage(negotiation)}</div>
                    <div class="message__send">  
                      <textarea class="message__textarea" name="message" cols="30" rows="1"></textarea>
                      <span data-message="send" data-uid="${negotiation.UID}" class="message__send-btn"></span>
                    </div>
                  </div>
              </div> 
              <div class="layout__btn"> 
                <button data-negotiation="back" class="ui-btn">назад</button>
                <button data-module="close" class="ui-btn ui-btn-danger-light">закрыть</button>
              </div>`
  }
}

class File {
  constructor() {
    this.container = document.querySelectorAll('.file');
  }
  init(){
    this.container.forEach((e, i) => {
      e.addEventListener("dragenter", this.dragenter, false);
    });

    this.container.forEach((e, i) => {
      e.addEventListener("dragover", this.dragover, false);
    });

    this.container.forEach((e, i) => {
      e.addEventListener("dragleave", this.dragleave, false);
    });

    this.container.forEach((e, i) => {
      e.addEventListener("drop", this.drop, false);
    });

    for (let item of document.querySelectorAll('.file__input')){
      item.addEventListener('change', event => {
        event.target.parentElement.style.background = "#E5E5E5";
        const files = event.target.files;
        new SendFile(files, event.target.name + '-' + app.copyObj.UID + '-' + login).init().then(()=>{
          document.querySelector('.save-change').classList.add('save-change_active');
        });
      })
    }
  }

  dragenter(e){
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('file')) {
      e.target.style.background = "#E5E5E5";
    }
  }
  dragover(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('file')) {
      e.target.style.background = "#E5E5E5";
    }
  }
  dragleave(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('file')) {
      e.target.style.background = "";
    }
  }
  drop(e) {
    e.stopPropagation();
    e.preventDefault();
    document.querySelector('.save-change').classList.add('save-change_active');
    let files = e.dataTransfer.files;
    new SendFile(files, e.target.dataset.container + '-' + app.copyObj.UID + '-' + login).init();
  }
}

class SendFile{
  constructor(files, container) {
    this.files = files;
    this.container = container;
  }
  async init(){
    let data = new FormData();

    data.append('photo[]', this.container);

    for (let item of this.files){
      data.append('photo[]', item)
    }

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    let requestOptions = {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: data
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/connector/Uploader.php", requestOptions);
    if (response){
      const jsonA = await response.json();
      console.log(jsonA)
      this.renderFiles(jsonA);
    }
  }
  renderFiles(files){
    const tableContainer = document.querySelector('.table-files');
    if (files.length > 0){
      for (let file of files){
        app.copyObj.documents.push(file);
        tableContainer.querySelector('tbody').insertAdjacentHTML('beforeend',
          `<tr class="file${file.UID}"> 
                        <td> 
                          <span data-burger="burger" data-elem="check" class="table__burger"></span>                                  
                          <div data-elem="check" class="burger-hide isVisible"> 
                            <div data-elem="check" class="burger__btn-group">
                              <a class="burger__btn" href="${file.URL}" target="_blank" download="${file.filename}">Скачать</a>
                              <button data-uid="${file.UID}" data-elem="check" data-file="edit" class="burger__btn">Редактировать</button>
                              <button data-uid="${file.UID}" data-elem="check" data-file="remove" class="burger__btn">Удалить</button>
                            </div>
                          </div>
                        </td>
                        <td class="type">${this.setFileDocTypeRevers(file.type)}</td>
                        <td class="filename">${file.filename}</td>
                        <td>${file.author}</td>
                        <td>${file.created.split(" ")[0].split('-').reverse().join('.')}</td>                        
                      </tr>`)
      }
    }
  }
  setFileDocTypeRevers(file){
    let firsWord = '';
    if (file === 'egrn'){
      firsWord = 'ЕГРН';
    } else if (file === 'contract'){
      firsWord = 'ДОУ';
    } else if (file === 'grp'){
      firsWord = 'ГРП';
    } else if (file === 'other'){
      firsWord = 'Прочие документы';
    }
    return firsWord;
  }
}

const server = new Server();
const app = new App();
const startReq = {
  dealid : deal,
  action : 'get',
};
server.getJson(startReq, APIobj)
  .then(data => {
    console.log(data)
  app.getObj(data);
})

function selectStyle(select, firstWord, id){
  $(select).each(function(){
    // Variables
    var $this = $(this),
      selectOption = $this.find('option'),
      selectOptionLength = selectOption.length,
      selectedOption = selectOption.filter(':selected'),
      dur = 500;

    $this.hide();
    // Wrap all in select box
    $this.wrap('<div class="select"></div>');
    // Style box
    $('<div>', {
      class: 'select__gap',
      id: id,
      text: firstWord
    }).insertAfter($this);

    var selectGap = $this.next('.select__gap'),
      caret = selectGap.find('.caret');
    // Add ul list
    $('<ul>',{
      class: 'select__list'
    }).insertAfter(selectGap);

    var selectList = selectGap.next('.select__list');
    // Add li - option items
    for(var i = 0; i < selectOptionLength; i++){
      $('<li>',{
        class: 'select__item',
        html: $('<span>',{
          text: selectOption.eq(i).text()
        })
      })
        .attr('data-value', selectOption.eq(i).val())
        .appendTo(selectList);
    }
    // Find all items
    var selectItem = selectList.find('li');

    selectList.slideUp(0);
    selectGap.on('click', function(){
      if(!$(this).hasClass('on')){
        $(this).addClass('on');
        selectList.slideDown(dur);

        selectItem.on('click', function(){
          var chooseItem = $(this).data('value');

          $('select').val(chooseItem).attr('selected', 'selected');
          selectGap.text($(this).find('span').text());

          selectList.slideUp(dur);
          selectGap.removeClass('on');
        });

      } else {
        $(this).removeClass('on');
        selectList.slideUp(dur);
      }
    });

  });
}