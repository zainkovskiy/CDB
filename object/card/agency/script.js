class App {
  constructor() {
    this.container = document.querySelector('.agency');
    this.owner = {};
    this.copyOwner = {};
    this.newClient = {};
    this.testList = [
      {
        place: 'Петухова, 17',
        name: 'Захаров Иван Денисович'
      },
      {
        place: 'Карла Маркса, 7',
        name: 'Куприянова Стефания Кирилловна'
      },
      {
        place: 'Ленина, 6',
        name: 'Тарасов Павел Александрович'
      },
      {
        place: 'Одоевского, 12',
        name: 'Колесников Серафим Алексеевич'
      },
      {
        place: 'Гоголя, 32',
        name: 'Самсонова Анастасия Руслановна'
      },
      {
        place: 'Петухова, 17',
        name: 'Захаров Иван Денисович'
      },
      {
        place: 'Карла Маркса, 7',
        name: 'Куприянова Стефания Кирилловна'
      },
      {
        place: 'Ленина, 6',
        name: 'Тарасов Павел Александрович'
      },
      {
        place: 'Одоевского, 12',
        name: 'Колесников Серафим Алексеевич'
      },
      {
        place: 'Гоголя, 32',
        name: 'Самсонова Анастасия Руслановна'
      },
      {
        place: 'Петухова, 17',
        name: 'Захаров Иван Денисович'
      },
      {
        place: 'Карла Маркса, 7',
        name: 'Куприянова Стефания Кирилловна'
      },
      {
        place: 'Ленина, 6',
        name: 'Тарасов Павел Александрович'
      },
      {
        place: 'Одоевского, 12',
        name: 'Колесников Серафим Алексеевич'
      },
      {
        place: 'Гоголя, 32',
        name: 'Самсонова Анастасия Руслановна'
      },
    ]
  }

  init(){
    document.querySelector('.agency').scrollIntoView();
    this.container.insertAdjacentHTML('beforeend', new Render(this.owner.agencyagreement).render());
    new File().init();
    selectStyle('.contract__select', `${this.owner.agencyagreement.typeOfLaw ? this.owner.agencyagreement.typeOfLaw : 'Выбрать'}`);
    new Handler().init();
    this.initTooltip();
  }
  initTooltip(){
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  }

  async getJson() {
    var request1Cnamed = new Object();
    request1Cnamed.ID = UID;
    request1Cnamed.action = 'getAgreement';
    request1Cnamed.object = UID;
    request1Cnamed.deal = deal;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    var raw = JSON.stringify(request1Cnamed);
    var requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/agreementViewer.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();

    if (jsonA.result[0] === 200){
      this.owner = jsonA.result[1];
      this.copyOwner = JSON.parse(JSON.stringify(this.owner));
      console.log(this.owner)
    } else {
      location="https://crm.centralnoe.ru/dealincom/404.php";
    }
    this.init();
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

function removeAttr(elem){
  const input = document.querySelector(`.${elem}`);
  input.removeAttribute('disabled');
}
function addAttr(elem){
  const input = document.querySelector(`.${elem}`);
  input.setAttribute('disabled', 'disabled');
  input.value = '';
}

class Render {
  constructor(obj) {
    this.obj = obj;
    this.owner = obj.signatories;
  }
  isOwner(){
    let ownerLayout = '';
    let id = 0;
    for(let item of this.owner){
      if (item.type === 'private'){
        ownerLayout += this.ownerLayout(item, id);
        id++;
      } else if (item.type === 'legal'){
        ownerLayout += this.legalLayout(item, id);
        id++;
      }
    }
    return ownerLayout;
  }

  getDate(date){
    return date.split(" ")[0].split('-').reverse().join('.');
  }
  getFileClients(documents){
    const accessRights = this.getAccessRights();
    let fileLayout = {
      passport: '',
      doc: '',
    };
    if (documents){
      for (let file of documents){
        if (file.documentType === 'passport'){
          fileLayout.passport += `<div class="file__item uid${file.UID}">
                                    <p class="file__files"><span>${file.documentName}</span></p>
                                    <div class="file__icon">
                                      <a class="file__svg file__svg-download" href="${file.URI}"
                                         download="${file.documentName}"></a>
                                      <span class="file__svg file__svg-delete ${accessRights}" data-uid="${file.UID}"
                                            data-container="${file.documentType}" data-action="file-delete"></span>
                                    </div>
                                  </div>`;
        } else if (file.documentType === 'doc'){
          fileLayout.doc += `<div class="file__item uid${file.UID}">
                                <p class="file__files"><span>${file.documentName}</span></p>
                                <div class="file__icon">
                                  <a class="file__svg file__svg-download" href="${file.URI}"
                                     download="${file.documentName}"></a>
                                  <span class="file__svg file__svg-delete ${accessRights}" data-uid="${file.UID}"
                                        data-container="${file.documentType}" data-action="file-delete"></span>
                                </div>
                              </div>`;
        }
      }
    }
    return fileLayout;
  }

  ownerLayout(item, id){
    const born = this.getDate(item.born);
    const passDate = this.getDate(item.passDate);
    const fileClients = this.getFileClients(item.documents);
    const accessRights = this.getAccessRights();
    return `<div class="clients__card id${id}">
                  <div class="clients__item-wrap">
                    <div class="clients__name-wrap">
                      <h4 class="clients__name">${item.lastName} ${item.name} ${item.secondName}</h4>
                      <div class="clients__group"> 
                           <span data-id="id${id}" data-uid="${item.UID}" data-client="edit"
                                  class="clients__edit clients__btn ${accessRights}"></span>
                           <span data-id="id${id}" data-uid="${item.UID}" data-client="delete" 
                                  data-name="${item.lastName}_${item.name}_${item.secondName}"
                                  class="clients__delete clients__btn ${accessRights}"></span>
                      </div>    
                    </div>   
                    <p class="clients__commission">Комиссия клиента <span>${item.relation.costForClient} ₽</span></p>           
                  </div>
                    <div class="accordion accordion-flush container-section" id="passport_client-${id}">
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingOne">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#passport_open_client-${id}" aria-expanded="false" aria-controls="flush-collapseOne">
                            Паспорт
                          </button>
                        </h2>
                        <div id="passport_open_client-${id}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#passport_client-${id}">
                            <div class="clients__wrap"> 
                                <div class="clients__wrap_left"> 
                                  <p class="clients__text">Пол<span>${item.gender ? item.gender : 'Не указан'}</span></p>
                                  <p class="clients__text">Дата рождения<span>${born}</span></p>
                                  <p class="clients__text">Гражданство<span>${item.nationality}</span></p>
                                  <p class="clients__text">Место рождения<span>${item.bornLocality}</span></p>
                                </div>
                                <div class="clients__wrap_right"> 
                                  <p class="clients__text">Срия и номер паспорта<span>${item.passRange} ${item.passNumber}</span></p>
                                  <p class="clients__text">Выдан<span>${item.passGranted}</span></p>
                                  <div class="clients__data-code"> 
                                    <p class="clients__text">Дата выдачи<span>${passDate}</span></p>
                                    <p class="clients__text">Код подразделения<span>${item.passCode}</span></p>
                                  </div>
                                </div>
                            </div>
                            <span class="clients__border"></span>
                            <div data-container="passport-${item.UID}" class="file ${accessRights}"> 
                              <input name="passport-${item.UID}" class="file__input" id="file_passport-${item.UID}" type="file" multiple>
                              <label class="file__label" for="file_passport-${item.UID}"></label>
                              <span class="file__text">Загрузите паспорт</span>
                            </div>
                            <div class="file__container container__passport-${item.UID}">${fileClients.passport}</div>
                        </div>     
                      </div>
                    </div>
                    <div class="accordion accordion-flush container-section" id="address_client-${id}">
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingOne">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#address_open_client-${id}" aria-expanded="false" aria-controls="flush-collapseOne">
                            Адреса
                          </button>
                        </h2>
                        <div id="address_open_client-${id}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#address_client-${id}">
                            <div class="clients__padding"> 
                              <p class="clients__text">Адрес постоянной реистрации<span>${item.registrationAddress}</span></p>
                              <p class="clients__text">Адрес проживания<span>${item.residentialAddress}</span></p>
                            </div>
                        </div>     
                      </div>
                    </div>
                    <div class="accordion accordion-flush container-section" id="doc_client-${id}">
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingOne">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#doc_open_client-${id}" aria-expanded="false" aria-controls="flush-collapseOne">
                            Право собственности
                          </button>
                        </h2>
                        <div id="doc_open_client-${id}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#doc_client-${id}">
                            <div class="clients__wrap clients__grid"> 
                              <p class="clients__text">Тип права<span>${item.relation.typeOfOwnership}</span></p>
                              <p class="clients__text">Номер доверенности${item.relation.typeOfOwnership === 'Доверенность' 
                                ? `<span>${item.relation.attorneyValue}</span>` : `<span></span>`}</p>
                              <p class="clients__text">Объем владения<span>${item.relation.scopeOfOwnership}</span></p>
                              <p class="clients__text">Размер доли${item.relation.scopeOfOwnership === 'Доля'
                                ? `<span>${item.relation.percentageOfOwnership}</span>` : `<span></span>`}</p>
                            </div>
                            <span class="clients__border"></span>
                            <div data-container="doc-${item.UID}" class="file ${accessRights}"> 
                              <input name="doc-${item.UID}" class="file__input" id="file_doc-${item.UID}" type="file" multiple>
                              <label class="file__label" for="file_doc-${item.UID}"></label>
                              <span class="file__text">Загрузите доверенность</span>
                            </div>
                            <div class="file__container container__doc-${item.UID}">${fileClients.doc}</div>
                        </div>     
                      </div>
                    </div>   
                </div> `;
  }
  legalLayout(item, id){
    const fileClients = this.getFileClients(item.documents);
    const accessRights = this.getAccessRights();
    return `<div class="clients__card id${id}"> 
                  <div class="clients__name-wrap">
                    <h4 class="clients__name">${item.name}</h4>
                    <div class="clients__group"> 
                         <span data-id="id${id}" data-uid="${item.UID}" data-client="edit"
                                class="clients__edit clients__btn ${accessRights}"></span>
                         <span data-id="id${id}" data-uid="${item.UID}" data-client="delete" 
                                data-name="${item.name}"
                                class="clients__delete clients__btn ${accessRights}"></span>
                    </div>                  
                  </div>
                    <div class="accordion accordion-flush container-section" id="passport_client-${id}">
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingOne">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#passport_open_client-${id}" aria-expanded="false" aria-controls="flush-collapseOne">
                            Реквизиты
                          </button>
                        </h2>
                        <div id="passport_open_client-${id}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#passport_client-${id}">
                            <div class="clients__wrap"> 
                            <p class="clients__text">ИНН<span>${item.inn}</span></p>
<!--                                <div class="clients__wrap_left"> -->
<!--                                </div>-->
<!--                                <div class="clients__wrap_right"> -->
<!--                                </div>-->
                            </div>
                            <span class="clients__border"></span>
                            <div data-container="passport-${item.UID}" class="file ${accessRights}"> 
                              <input name="passport-${item.UID}" class="file__input" id="file_passport-${item.UID}" type="file" multiple>
                              <label class="file__label" for="file_passport-${item.UID}"></label>
                              <span class="file__text">Загрузите реквизиты</span>
                            </div>
                            <div class="file__container container__passport-${item.UID}">${fileClients.passport}</div>
                        </div>     
                      </div>
                    </div>
                    <div class="accordion accordion-flush container-section" id="address_client-${id}">
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingOne">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#address_open_client-${id}" aria-expanded="false" aria-controls="flush-collapseOne">
                            Адреса
                          </button>
                        </h2>
                        <div id="address_open_client-${id}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#address_client-${id}">
                            <div class="clients__padding"> 
                              <p class="clients__text">Юридический адрес<span>${item.registrationAddress}</span></p>
                              <p class="clients__text">Фактичесикй адрес<span>${item.residentialAddress}</span></p>
                            </div>
                        </div>     
                      </div>
                    </div>
                    <div class="accordion accordion-flush container-section" id="doc_client-${id}">
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingOne">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#doc_open_client-${id}" aria-expanded="false" aria-controls="flush-collapseOne">
                            Право собственности
                          </button>
                        </h2>
                        <div id="doc_open_client-${id}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#doc_client-${id}">
                            <div class="clients__wrap clients__grid"> 
                              <p class="clients__text">Тип права<span>${item.relation.typeOfOwnership}</span></p>
                              <p class="clients__text">Номер доверенности${item.relation.typeOfOwnership === 'Доверенность' 
                                ? `<span>${item.relation.attorneyValue}</span>` : `<span></span>`}</p>
                              <p class="clients__text">Объем владения<span>${item.relation.scopeOfOwnership}</span></p>
                              <p class="clients__text">Размер доли${item.relation.scopeOfOwnership === 'Доля'
                                ? `<span>${item.relation.percentageOfOwnership}</span>` : `<span></span>`}</p>
                            </div>
                            <span class="clients__border"></span>
                            <div data-container="doc-${item.UID}" class="file ${accessRights}"> 
                              <input name="doc-${item.UID}" class="file__input" id="file_doc-${item.UID}" type="file" multiple>
                              <label class="file__label" for="file_doc-${item.UID}"></label>
                              <span class="file__text">Загрузите доверенность</span>
                            </div>
                            <div class="file__container container__doc-${item.UID}">${fileClients.doc}</div>
                        </div>     
                      </div>
                    </div>   
                </div> `;
  }

  scopeOfOwnership(){
    const scopeOfOwnership = {
      full: '',
      part: '',
      value: 'disabled'
    }
    if (this.obj.scopeOfOwnership === 'Полная'){
      scopeOfOwnership.full = 'checked';
    } else if (this.obj.scopeOfOwnership === 'Доля'){
      scopeOfOwnership.part = 'checked';
      scopeOfOwnership.value = `value = ${this.obj.percentageOfOwnership}`;
    }
    return scopeOfOwnership;
}
  placeLayout(){
    const params = this.obj.params;
    const street = `, ул. ${params.street}`;
    const house = `, д. ${params.houseNumber}`;
    const flat = `, кв. ${params.flatNumber}`;
    return `<span>${params.city}${street}${house}${flat}</span>`
  }
  setDocType(){
    const docType = {
      promo: '',
      exclusive: '',
    }
    if (this.obj.docType === "Рекламный"){
      docType.promo = 'checked';
    } else if (this.obj.docType === "Эксклюзив"){
      docType.exclusive = 'checked';
    }
    return docType;
  }
  setTypeOfOwnership(){
    const typeOfOwnership = {
      owner: '',
      proxy: '',
    }
    if (this.obj.typeOfOwnership === "Владелец"){
      typeOfOwnership.owner = 'checked';
    } else if (this.obj.typeOfOwnership === "Доверенное лицо"){
      typeOfOwnership.proxy = 'checked';
    }
    return typeOfOwnership;
  }
  getFile(){
    let fileLayout = {
      egrn: '',
      contract: '',
      grp: '',
      other: '',
    }
    const accessRights = this.getAccessRights();
    for (let file of this.obj.documents){
      if (file.documentType === 'egrn'){
        fileLayout.egrn +=  `<div class="file__item uid${file.UID}">
                                <p class="file__files"><span>${file.documentName}</span></p>
                                <div class="file__icon">
                                  <a class="file__svg file__svg-download" href="${file.URI}"
                                  target="_blank"
                                     download="${file.documentName}"></a>
                                  <span class="file__burger ${accessRights}" data-uid="${file.UID}" data-burger="burger"></span>
                                  <div class="burger-hide isVisible id${file.UID}"> 
                                    <div class="burger__btn-group">
                                        <button data-uid="${file.UID}" data-action="edit" class="burger__btn">Редактировать</button>
                                        <button data-uid="${file.UID}" data-action="delete" class="burger__btn">Удалить</button>
                                    </div>
                                  </div>
                                </div>
                              </div>`;
      } else if (file.documentType === 'contract'){
        fileLayout.contract +=  `<div class="file__item uid${file.UID}">
                                <p class="file__files"><span>${file.documentName}</span></p>
                                <div class="file__icon">
                                  <a class="file__svg file__svg-download" href="${file.URI}"
                                  target="_blank"
                                     download="${file.documentName}"></a>
                                  <span class="file__burger ${accessRights}" data-uid="${file.UID}" data-burger="burger"></span>
                                  <div class="burger-hide isVisible id${file.UID}"> 
                                    <div class="burger__btn-group">
                                        <button data-uid="${file.UID}" data-action="edit" class="burger__btn">Редактировать</button>
                                        <button data-uid="${file.UID}" data-action="delete" class="burger__btn">Удалить</button>
                                    </div>
                                  </div>
                                </div>
                              </div>`;
      } else if (file.documentType === 'grp'){
        fileLayout.grp +=  `<div class="file__item uid${file.UID}">
                                <p class="file__files"><span>${file.documentName}</span></p>
                                <div class="file__icon">
                                  <a class="file__svg file__svg-download" href="${file.URI}"
                                  target="_blank"
                                     download="${file.documentName}"></a>
                                  <span class="file__burger ${accessRights}" data-uid="${file.UID}" data-burger="burger"></span>
                                  <div class="burger-hide isVisible id${file.UID}"> 
                                    <div class="burger__btn-group">
                                        <button data-uid="${file.UID}" data-action="edit" class="burger__btn">Редактировать</button>
                                        <button data-uid="${file.UID}" data-action="delete" class="burger__btn">Удалить</button>
                                    </div>
                                  </div>
                                </div>
                              </div>`;
      } else if (file.documentType === 'other'){
        fileLayout.other +=  `<div class="file__item uid${file.UID}">
                                <p class="file__files"><span>${file.documentName}</span></p>
                                <div class="file__icon">
                                  <a class="file__svg file__svg-download" href="${file.URI}"
                                  target="_blank"
                                     download="${file.documentName}"></a>
                                  <span class="file__burger ${accessRights}" data-uid="${file.UID}" data-burger="burger"></span>
                                  <div class="burger-hide isVisible id${file.UID}"> 
                                    <div class="burger__btn-group">
                                        <button data-uid="${file.UID}" data-action="edit" class="burger__btn">Редактировать</button>
                                        <button data-uid="${file.UID}" data-action="delete" class="burger__btn">Удалить</button>
                                    </div>
                                  </div>
                                </div>
                              </div>`;
      }
    }
    return fileLayout;
  }
  getSaveChangeText(){
    if (this.obj.moderatorAccepted === '1' || this.obj.chiefAccepted === '1'){
      return `<span class="save-change__text">Потребуется новое подтверждение модератором</span>`;
    } else {
      return '';
    }
  }
  getAllPrice(){
    let price = 0;
    for (let item of this.owner){
      price += +item.relation.costForClient;
    }
    return price;
  }
  getAccessRights(){
    if (login === 'zainkovskiyaa' || login === 'mischenkoiv') {
      return ''
    } else {
      if (this.obj.moderatorAccepted === '1' || this.obj.chiefAccepted === '1'){
        return 'notRights';
      } else {
        return '';
      }
    }
  }

  render(){
    const owner = this.isOwner();
    const scopeOfOwnership = this.scopeOfOwnership();
    const placeLayout = this.placeLayout();
    const expired = this.obj.expired ? this.obj.expired.split(" ")[0] : '';
    const progressBar = new ProgressBar(this.obj).render();
    const docType = this.setDocType();
    const typeOfOwnership = this.setTypeOfOwnership();
    const file = this.getFile();
    const saveChangeText = this.getSaveChangeText();
    const priceAll = this.getAllPrice();
    const accessRights = this.getAccessRights();

    return `<div class="save-change">
                ${saveChangeText}
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
                <a class="ui-btn change-page__link" href="../photo/?source=${source}&id=${UID}&IDDEAL=${deal}">Фото</a>
                <a class="ui-btn ui-btn-secondary ui-btn-icon-page change-page__link" href="../agency/?source=${source}&id=${UID}&IDDEAL=${deal}">ДОУ</a>
                <a class="ui-btn change-page__link" href="../promotion/?source=${source}&id=${UID}&IDDEAL=${deal}">Реклама</a>
                <a class="ui-btn ui-btn-icon-done change-page__link disable" href="../buySell/?source=${source}&id=${UID}&IDDEAL=${deal}">ПДКП/ДКП</a>
            </nav>
            <div class="container_grey"> 
              <div class="progress"> 
                ${progressBar}
              </div>
              <span class="title-section">Сводка</span>
                <div class="summary"> 
                  <p class="summary__text">Объект: ${placeLayout}</p>
                  <p class="summary__text">Тип: <span class="summary__text-span">${this.obj.params.typeOfRealty ? this.obj.params.typeOfRealty : ''}</span></p>
                  <p class="summary__text">Стоимость объекта: <span class="summary__text-span">${this.obj.params.price ? this.obj.params.price : '0'} тыс ₽</span></p>
                  <p class="summary__text">Стоимость услуги: <span class="summary__text-span costForClient">${priceAll} ₽</span></p>
                </div>
              <div class="title__header"> 
                <span class="title__header-text clients__title-head">Клиенты</span>
                <div class="add__change">
                  <button class="ui-btn ui-btn-primary-dark ui-btn-icon-add ${accessRights}" data-btn="clients_add">Добавить</button>
                  <div class="add isVisible">
                    <button data-choice="private" class="add__button">Частное лицо</button>
                    <button data-choice="legal" class="add__button">Юр. лицо</button>
                  </div>
                </div>
              </div>
              <div class="clients"> 
                ${owner}
              </div>
              <div class="title__header"> 
                <span class="title__header-text">Договор</span>
                <div> 
                  <button class="ui-btn ${accessRights}">История</button>
                  <button data-clear="all" class="btn_edit ui-btn ui-btn-danger-light ${accessRights}">Очистить</button>
                </div>
              </div>
              <div class="contract"> 
                <div class="contract__change ${accessRights}"> 
                  <div class="contract__wrap"> 
                    <span class="contract__title">Тип договора</span>
                    <div class="contract__toggle-item item">
                        <input  name="docType" type="radio" id="exclusive" value="Эксклюзив" ${docType.exclusive}>
                        <label class='contract__btn' for="exclusive">Эксклюзив</label>
                    </div>
                    <div class="contract__toggle-item item">
                      <input name="docType" type="radio" id="promo" value="Рекламный" ${docType.promo}>
                      <label class='contract__btn' for="promo">Рекламный</label>
                    </div>
                  </div>
                  <div class="contract__wrap"> 
                    <span class="contract__title">На кого?</span>
                    <div class="contract__toggle-item item">
                      <input name="typeOfOwnership" type="radio" id="owner" value="Владелец" ${typeOfOwnership.owner}>
                      <label class='contract__btn' for="owner">Владелец</label>
                    </div>
                    <div class="contract__toggle-item item">
                      <input name="typeOfOwnership" type="radio" id="proxy" value="Доверенное лицо" ${typeOfOwnership.proxy}>
                      <label class='contract__btn' for="proxy">Доверенное лицо</label>
                    </div>
                  </div>
                  <div class="contract__wrap"> 
                  <span class="contract__title">Объем владения</span>
                  <div class="contract__toggle-item item">
                      <input name="scopeOfOwnership" type="radio" id="full" value="Полная" ${scopeOfOwnership.full}>
                      <label onclick="addAttr('contract__number')" class='contract__btn' for="full">Полная</label>
                  </div>
                  <div class="contract__toggle-item item">
                    <input name="scopeOfOwnership" type="radio" id="part" value="Доля" ${scopeOfOwnership.part}>
                    <label onclick="removeAttr('contract__number')" class='contract__btn' for="part">Доля</label>
                  </div>
                  </div> 
                  <div class="contract__wrap"> 
                    <span class="contract__title">Укажите количество</span>
                    <input name="percentageOfOwnership" class="contract__number" type="text" placeholder="Пример 1/4" ${scopeOfOwnership.value}>
                  </div>
                  <div class="contract__wrap"> 
                    <span class="contract__title">Тип права</span>
                    <div class="contract__select-wrap" style="position: relative">
                      <select name="typeOfLaw" class="contract__select"> 
                          <option value="Собственность">Собственность</option>
                          <option value="Не приватизировал">Не приватизировал</option>
                          <option value="Право пользования земельного участка">Право пользования земельного участка</option>
                          <option value="Право требования на строющийся объект">Право требования на строющийся объект</option>
                          <option value="Членство в кооперативе">Членство в кооперативе</option>
                      </select>
                    </div>
                  </div> 
                  <div class="contract__wrap"> 
                    <span class="contract__title">Срок дейcтвия</span>
                    <input name="expired" class="contract__date-input" type="date" value="${expired}">
                  </div> 
                </div>                 
                <div class="title__header"> 
                  <span class="title__header-text">Документы</span>
                  <div> 
                    <button data-clear="docs" class="btn_edit ui-btn ui-btn-danger-light ${accessRights}">Очистить</button>
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
                      <div data-container="egrn" class="file upload_width ${accessRights}"> 
                        <input name="egrn" class="file__input" id="file_egrn" type="file" multiple>
                        <label class="file__label" for="file_egrn"></label>
                        <span class="file__text">Загрузите ЕГРН</span>                      
                      </div>    
                      <div class="file__container container__egrn">${file.egrn}</div>                                   
                    </div>  
                    <div class="upload__wrap">                    
                      <div data-container="contract" class="file upload_width ${accessRights}"> 
                        <input name="contract" class="file__input" id="file_contract" type="file" multiple>
                        <label class="file__label" for="file_contract"></label>
                        <span class="file__text">Загрузите ДОУ</span>
                      </div>
                      <div class="file__container container__contract">${file.contract}</div>                          
                    </div>                    
                    <div class="upload__wrap"> 
                      <div data-container="grp" class="file upload_width ${accessRights}"> 
                      <input name="grp" class="file__input" id="file_grp" type="file" multiple>
                      <label class="file__label" for="file_grp"></label>
                      <span class="file__text">Загрузите ГРП</span>
                      </div>
                      <div class="file__container container__grp">${file.grp}</div>   
                    </div>   
                    <div class="upload__wrap"> 
                      <div data-container="other" class="file upload_width ${accessRights}"> 
                      <input name="other" class="file__input" id="file_other" type="file" multiple>
                      <label class="file__label" for="file_other"></label>
                      <span class="file__text">Загрузите прочие документы</span>
                      </div>
                      <div class="file__container container__other">${file.other}</div>   
                    </div>                
                  </div>      
                </div>                 
              </div>
            </div>`;
  }
}

class ProgressBar{
  constructor(obj) {
    this.obj = obj;
    this.progressBar ={
      'notConcluded': false,
      'filled': false,
      'signed': false,
      'chiefAccepted': false,
      'moderatorAccepted': false,
    }
  }
  setProgressBar(){
    if (this.obj.moderatorAccepted === '1'){
      this.progressBar.notConcluded = true;
      this.progressBar.filled = true;
      this.progressBar.signed = true;
      this.progressBar.chiefAccepted = true;
      this.progressBar.moderatorAccepted = true;
    } else if (this.obj.chiefAccepted === '1'){
      this.progressBar.notConcluded = true;
      this.progressBar.filled = true;
      this.progressBar.signed = true;
      this.progressBar.chiefAccepted = true;
    } else if (this.obj.documents){
      for (let doc of this.obj.documents){
        if (doc.documentType === 'contract'){
          this.progressBar.notConcluded = true;
          this.progressBar.filled = true;
          this.progressBar.signed = true;
        }
      }
    }
    if (this.obj.signatories.length > 0 && new Date() < new Date(this.obj.expired)){
      this.progressBar.notConcluded = true;
      this.progressBar.filled = true;
    } else {
      this.progressBar.notConcluded = true;
    }
  }
  render(){
    this.setProgressBar();
    const progressBar = this.progressBar;
    if(this.obj.docType === 'Эксклюзив'){
      return `<span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Не заключен" 
                    class="${progressBar.notConcluded ? 'progress__number_active' : 'notConcluded'} progress__number">1</span>
                <span class="progress__line"></span>
                <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Данные заполнены" 
                    class="${progressBar.filled ? 'progress__number_active' : 'filled'} progress__number">2</span>
                <span class="progress__line"></span>
                <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Подписан" 
                    class="${progressBar.signed ? 'progress__number_active' : 'signed'} progress__number">3</span>
                <span class="progress__line"></span>
                <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Подтвержден модератором" 
                    class="${progressBar.moderatorAccepted ? 'progress__number_active' : 'moderatorAccepted'} progress__number">4</span>`
    }
    return `<span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Не заключен" 
                    class="${progressBar.notConcluded ? 'progress__number_active' : 'notConcluded'} progress__number">1</span>
                <span class="progress__line"></span>
                <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Данные заполнены" 
                    class="${progressBar.filled ? 'progress__number_active' : 'filled'} progress__number">2</span>
                <span class="progress__line"></span>
                <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Подписан" 
                    class="${progressBar.signed ? 'progress__number_active' : 'signed'} progress__number">3</span>
                <span class="progress__line"></span>
                <span data-bs-toggle="tooltip" data-bs-placement="bottom" 
                title="Подтвержденно клиентом" 
                    class="${progressBar.chiefAccepted ? 'progress__number_active' : 'chiefAccepted'} progress__number">4</span>
                <span class="progress__line"></span>
                <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Подтвержден модератором" 
                    class="${progressBar.moderatorAccepted ? 'progress__number_active' : 'moderatorAccepted'} progress__number">5</span>`
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
        new SendFile(files, event.target.name).init().then(()=>{
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
    new SendFile(files, e.target.dataset.container).init();
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

    let response = await fetch("https://crm.centralnoe.ru/dealincom/uploader.php", requestOptions);
    if (response){
      const jsonA = await response.json();

      this.setFiles(jsonA);
    }
  }
  setFiles(files){
    const passport = new RegExp('passport', 'i');
    const doc = new RegExp('doc', 'i');
    let currentUID = '';
    let currentContainer = '';
    if (app.copyOwner.agencyagreement.documents[0] === false){
      app.copyOwner.agencyagreement.documents = [];
    }
    if (passport.test(this.container) || doc.test(this.container)){
      currentContainer = this.container.split('-')[0];
      currentUID = this.container.split('-')[1];
      let find = app.copyOwner.agencyagreement.signatories.find(item => item.UID === `${currentUID}`);
      let indexFind = app.copyOwner.agencyagreement.signatories.indexOf(find);
      for (let item of files){
        const [key] = Object.keys(item);
        const [value] = Object.values(item);
        const fileObj = {
          URI: value,
          documentType: currentContainer,
          documentName: key,
          UID: 'F' + Math.floor(Math.random()*1000)
        }
        this.renderFiles(fileObj);
        app.copyOwner.agencyagreement.signatories[indexFind].documents.push(fileObj);
      }
    } else {
      for (let item of files){
        const [key] = Object.keys(item);
        const [value] = Object.values(item);
        const fileObj = {
          URI: value,
          documentType: this.container,
          documentName: key,
          UID: 'F' + Math.floor(Math.random()*1000)
        }
        this.renderFiles(fileObj);
        app.copyOwner.agencyagreement.documents.push(fileObj);
      }
    }
  }
  renderFiles(file){
    const fileName = `<div class="file__item uid${file.UID}">
                                <p class="file__files"><span>${file.documentName}</span></p>
                                <div class="file__icon">
                                  <a class="file__svg file__svg-download" href="${file.URI}"
                                  target="_blank"
                                     download="${file.documentName}"></a>
                                  <span class="file__burger" data-uid="${file.UID}" data-burger="burger"></span>
                                  <div class="burger-hide isVisible id${file.UID}"> 
                                    <div class="burger__btn-group">
                                        <button data-uid="${file.UID}" data-action="edit" class="burger__btn">Редактировать</button>
                                        <button data-uid="${file.UID}" data-action="delete" class="burger__btn">Удалить</button>
                                    </div>
                                  </div>
                                </div>
                              </div>`;
    if(this.container){
      const dropBox = document.querySelector(`.container__${this.container}`);
      dropBox.insertAdjacentHTML('beforeend', fileName);
    } else {
      const dropBox = document.querySelector(`.container__${file.documentType}`);
      dropBox.insertAdjacentHTML('beforeend', fileName);
    }
  }
}

class Form {
  constructor() {
  }
  render(){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layoutForm = `<div style="top: ${currentY}px;" class="module-form">
                          <form data-face="private" class="form">
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li class="nav-item" role="presentation">
                              <button class="nav-link active fio_form-pills" id="pills-fio-tab" data-bs-toggle="pill" data-bs-target="#pills-fio" type="button" role="tab" aria-controls="pills-fio" aria-selected="true">ФИО</button>
                            </li>
                            <li class="nav-item" role="presentation">
                              <button class="nav-link passport_form-pills" id="pills-passport-tab" data-bs-toggle="pill" data-bs-target="#pills-passport" type="button" role="tab" aria-controls="pills-passport" aria-selected="false">Паспорт</button>
                            </li>
                            <li class="nav-item" role="presentation">
                              <button class="nav-link address_form-pills" id="pills-address-tab" data-bs-toggle="pill" data-bs-target="#pills-address" type="button" role="tab" aria-controls="pills-address" aria-selected="false">Адрес,тип права</button>
                            </li>
                          </ul>
                            <div class="tab-content" id="pills-tabContent">
                              <div class="tab-pane fade show active" id="pills-fio" role="tabpanel" aria-labelledby="pills-fio-tab">
                                <div class="form__fio">
                                  <div class="form__item">
                                    <span class="contract__title">Фамилия</span>
                                    <input id="fio_form" type="text" name="lastName" value="" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Дата рождения</span>
                                    <input id="fio_form" type="date" name="born" value="">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Имя</span>
                                    <input id="fio_form" type="text" name="name" value="" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Гражданство</span>
                                    <input id="fio_form" type="text" name="nationality" value="" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Отчество</span>
                                    <input id="fio_form" type="text" name="secondName" value="" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Место рождения</span>
                                    <input id="fio_form" type="text" name="bornLocality" value="" autocomplete="off">
                                  </div>
                                  <div class="form__toggle">
                                    <span class="contract__title">Пол</span>
                                    <div class="form__toggle-item">
                                      <input checked type="radio" value="Мужской" id="man" name="gender">
                                      <label class="form__toggle-btn" for="man">Мужской</label>
                                    </div>
                                    <div class="form__toggle-item">
                                      <input type="radio" id="women" value="Женский" name="gender">
                                      <label class="form__toggle-btn" for="women">Женский</label>
                                    </div>
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Комиссия</span>
                                    <input id="fio_form" type="text" name="costForClient" autocomplete="off">
                                  </div>
                              </div>
                              </div>
                              <div class="tab-pane fade" id="pills-passport" role="tabpanel" aria-labelledby="pills-passport-tab">
                                <div class="form__passport">
                                  <div class="form__item">
                                    <span class="contract__title">Серия</span>
                                    <input id="passport_form" type="text" name="passRange" value="" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Номер</span>
                                    <input id="passport_form" type="text" name="passNumber" value="" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Дата выдачи</span>
                                    <input id="passport_form" type="date" name="passDate" value="">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Код подразделения</span>
                                    <input id="passport_form" type="text" name="passCode" value="" autocomplete="off">
                                  </div>
                                  <div class="form__item form__passport-getPassport">
                                    <span class="contract__title">Кем выдан</span>
                                    <input id="passport_form" type="text" name="passGranted" value="" autocomplete="off">
                                  </div>
                              </div>
                              </div>
                              <div class="tab-pane fade" id="pills-address" role="tabpanel" aria-labelledby="pills-address-tab">
                                <div class="form__address">
                                  <div class="form__item form__address_first">
                                      <span class="contract__title">Адрес постоянной реистрации</span>
                                      <input id="address_form" type="text" name="registrationAddress" value="" autocomplete="off">
                                  </div>
                                  <div class="form__item form__address_second">
                                      <span class="contract__title">Адрес проживания</span>
                                      <input id="address_form" type="text" name="residentialAddress" value="" autocomplete="off">
                                  </div>
                                    <div class="form__toggle"> 
                                      <span class="contract__title">Объем владения</span>
                                      <div class="form__toggle-item">
                                          <input name="scopeOfOwnership" type="radio" id="formFull" checked value="Собственность">
                                          <label onclick="addAttr('contract__number')" class='form__toggle-btn' for="formFull">Собственность</label>
                                      </div>
                                      <div class="form__toggle-item">
                                        <input name="scopeOfOwnership" type="radio" id="formPart" value="Доля">
                                        <label onclick="removeAttr('contract__number')" class='form__toggle-btn' for="formPart">Доля</label>
                                      </div>
                                    </div> 
                                    <div class="contract__wrap"> 
                                      <span class="contract__title">Укажите количество</span>
                                      <input id="address_form" name="percentageOfOwnership" class="contract__number" type="text" placeholder="Пример 1/4" disabled autocomplete="off">
                                    </div>                            
                                    <div class="form__toggle">
                                      <span class="contract__title">Типа права</span>
                                      <div class="form__toggle-item">
                                        <input name="typeOfOwnership" value="Владелец" type="radio" id="formOwner" checked>
                                        <label onclick="addAttr('contract__number-proxy')" class='form__toggle-btn' for="formOwner">Владелец</label>
                                      </div>
                                      <div class="form__toggle-item">
                                        <input name="typeOfOwnership" value="Доверенность" type="radio" id="formProxy">
                                        <label onclick="removeAttr('contract__number-proxy')" class='form__toggle-btn' for="formProxy">Доверенность</label>
                                      </div>
                                    </div>
                                    <div class="contract__wrap"> 
                                      <span class="contract__title">Номер доверености</span>
                                      <input id="address_form" name="attorneyValue" class="contract__number-proxy" type="text" disabled autocomplete="off">
                                    </div>   
                                </div>  
                              </div>
                            </div>
                            <div> 
                              <button class="form__btn" type="submit">Создать</button>
                              <button class="form__btn" type="reset">Закрыть</button>
                            </div>
                          </form>
                        </div>`
    document.body.insertAdjacentHTML('afterbegin', layoutForm);
  }
  renderLegal(){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layoutForm = `<div style="top: ${currentY}px;" class="module-form">
                          <form data-face="legal" class="form">
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li class="nav-item" role="presentation">
                              <button class="nav-link active requisites_form-pills" id="pills-requisites-tab" data-bs-toggle="pill" data-bs-target="#pills-requisites" type="button" role="tab" aria-controls="pills-requisites" aria-selected="true">Реквизиты</button>
                            </li>
                            <li class="nav-item" role="presentation">
                              <button class="nav-link type_form-pills" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Тип права</button>
                            </li>
                          </ul>
                            <div class="tab-content" id="pills-tabContent">
                              <div class="tab-pane fade show active" id="pills-requisites" role="tabpanel" aria-labelledby="pills-requisites-tab">
                                <div class="requisites">
                                  <div class="form__item">
                                    <span class="contract__title">Название организации</span>
                                    <input id="requisites_form" type="text" name="name" value="" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">ИНН</span>
                                    <input id="requisites_form" type="text" name="inn" value="" autocomplete="off">
                                  </div>
                                  <div class="form__item form__address_first">
                                    <span class="contract__title">Юридический адрес</span>
                                    <input id="requisites_form" type="text" name="registrationAddress" value="" autocomplete="off">
                                  </div>
                                  <div class="form__item form__address_second">
                                    <span class="contract__title">Фактический адрес</span>
                                    <input id="requisites_form" type="text" name="residentialAddress" value="" autocomplete="off">
                                  </div>
                                </div>
                              </div>    
                              <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                                <div class="form__address">
                                    <div class="form__toggle"> 
                                      <span class="contract__title">Объем владения</span>
                                      <div class="form__toggle-item">
                                          <input name="scopeOfOwnership" type="radio" id="formFull" checked value="Собственность">
                                          <label onclick="addAttr('contract__number')" class='form__toggle-btn' for="formFull">Собственность</label>
                                      </div>
                                      <div class="form__toggle-item">
                                        <input name="scopeOfOwnership" type="radio" id="formPart" value="Доля">
                                        <label onclick="removeAttr('contract__number')" class='form__toggle-btn' for="formPart">Доля</label>
                                      </div>
                                    </div> 
                                    <div class="contract__wrap"> 
                                      <span class="contract__title">Укажите количество</span>
                                      <input id="type_form" name="percentageOfOwnership" class="contract__number" type="text" placeholder="Пример 1/4" disabled autocomplete="off">
                                    </div>                            
                                    <div class="form__toggle">
                                      <span class="contract__title">Типа права</span>
                                      <div class="form__toggle-item">
                                        <input name="typeOfOwnership" value="Владелец" type="radio" id="formOwner" checked>
                                        <label onclick="addAttr('contract__number-proxy')" class='form__toggle-btn' for="formOwner">Владелец</label>
                                      </div>
                                      <div class="form__toggle-item">
                                        <input name="typeOfOwnership" value="Доверенность" type="radio" id="formProxy">
                                        <label onclick="removeAttr('contract__number-proxy')" class='form__toggle-btn' for="formProxy">Доверенность</label>
                                      </div>
                                    </div>
                                    <div class="contract__wrap"> 
                                      <span class="contract__title">Номер доверености</span>
                                      <input id="type_form" name="attorneyValue" class="contract__number-proxy" type="text" disabled autocomplete="off">
                                    </div>   
                                </div>  
                              </div>
                            </div>
                            <div> 
                              <button class="form__btn" type="submit">Создать</button>
                              <button class="form__btn" type="reset">Закрыть</button>
                            </div>
                          </form>
                        </div>`
    document.body.insertAdjacentHTML('afterbegin', layoutForm);
  }

  validForm(allInputs, type){
    if (type === 'private'){
      if (this.validPrivate(allInputs)){
        this.setNewClient(allInputs, type);
        return true;
      }
    } else if (type === 'legal'){
      if (this.validLegal(allInputs)){
        this.setNewClient(allInputs, type);
        return true;
      }
    }
  }
  validPrivate(allInputs){
    const sortInputs = {
      gender: [],
      scopeOfOwnership: [],
      typeOfOwnership: [],
    }
    const validInputs = {
      lastName: false,
      name: false,
      secondName: false,
      born: false,
      nationality: false,
      bornLocality: false,
      passRange: false,
      passNumber: false,
      passDate: false,
      passCode: false,
      passGranted: false,
      registrationAddress: false,
      residentialAddress: false,
      percentageOfOwnership: false,
      attorneyValue: false,
      costForClient: false,
    }
    const libraryRegExp = {
      lastName: /^[А-ЯЁ][а-яё]*( )?-?( )?[А-ЯЁ]?[а-яё]*$/,
      name: /^[А-ЯЁ][а-яё]*( )?-?( )?[А-ЯЁ]?[а-яё]*$/,
      secondName: /^[А-ЯЁ][а-яё]*( )?-?( )?[А-ЯЁ]?[а-яё]*$/,
      nationality: /^[А-ЯЁа-яё]*\.?( )?-?( )?[А-ЯЁ]?[а-яё]*$/,
      bornLocality: /.*/,
      passRange: /^\d{4}$/,
      passNumber: /^\d{6}$/,
      passCode: /^\d{3}-\d{3}$/,
      passGranted: /.*/,
      registrationAddress: /.*/,
      residentialAddress: /.*/,
      percentageOfOwnership: /[0-9]\/[0-9]/,
      attorneyValue: /.*/,
      costForClient: /^\d*$/,
    }
    const isValidPills = {
      fio_form: [],
      passport_form: [],
      address_form: [],
    }
    for (let input of allInputs){
      if (input.value.length === 0 && !input.hasAttribute('disabled')){
        validInputs[input.name] = false;
        input.classList.add('isValid');
        isValidPills[input.id].push(input);
      } else if (!input.hasAttribute('disabled')) {
        if (input.name === 'gender' || input.name === 'scopeOfOwnership' || input.name === 'typeOfOwnership'){
          sortInputs[input.name].push(input);
        } else if(input.name === 'born' || input.name === 'passDate'){
          if (new Date() < new Date(input.value)){
            validInputs[input.name] = false;
            input.classList.add('isValid');
            isValidPills[input.id].push(input);
          } else {
            validInputs[input.name] = true;
            input.classList.remove('isValid');
          }
        } else {
            if (!libraryRegExp[input.name].test(input.value)){
              validInputs[input.name] = false;
              input.classList.add('isValid');
              isValidPills[input.id].push(input);
            } else {
              validInputs[input.name] = true;
              input.classList.remove('isValid');
            }
        }
      } else if (input.hasAttribute('disabled')){
          input.classList.remove('isValid');
          validInputs[input.name] = true;
      }
    }

    for (let [key, value] of Object.entries(isValidPills)){
      if (value.length === 0){
        document.querySelector(`.${key}-pills`).classList.remove('isValid');
      } else {
        document.querySelector(`.${key}-pills`).classList.add('isValid');
      }
    }
    let count = 0;
    for (let [key, value] of Object.entries(validInputs)){
      if (value === true){
        count++;
      }
    }
    if (count === 16){
      return true;
    } else {
      return false;
    }
  }
  validLegal(allInputs){
    const sortInputs = {
      scopeOfOwnership: [],
      typeOfOwnership: [],
    }
    const validInputs = {
      name: false,
      inn: false,
      registrationAddress: false,
      residentialAddress: false,
      percentageOfOwnership: false,
      attorneyValue: false,
    }
    const libraryRegExp = {
      name: /^[А-ЯЁа-яё\- ]*$/,
      inn: /^\d*$/,
      registrationAddress: /.*/,
      residentialAddress: /.*/,
      percentageOfOwnership: /[0-9]\/[0-9]/,
      attorneyValue: /.*/,
    }
    const isValidPills = {
      requisites_form: [],
      type_form: [],
    }
    for (let input of allInputs){
      if (input.value.length === 0 && !input.hasAttribute('disabled')){
        validInputs[input.name] = false;
        input.classList.add('isValid');
        isValidPills[input.id].push(input);
      } else if (!input.hasAttribute('disabled')) {
        if (input.name === 'scopeOfOwnership' || input.name === 'typeOfOwnership'){
          sortInputs[input.name].push(input);
        } else {
          if (!libraryRegExp[input.name].test(input.value)){
            validInputs[input.name] = false;
            input.classList.add('isValid');
            isValidPills[input.id].push(input);
          } else {
            validInputs[input.name] = true;
            input.classList.remove('isValid');
          }
        }
      } else if (input.hasAttribute('disabled')){
        input.classList.remove('isValid');
        validInputs[input.name] = true;
      }
    }
    for (let [key, value] of Object.entries(isValidPills)){
      if (value.length === 0){
        document.querySelector(`.${key}-pills`).classList.remove('isValid');
      } else {
        document.querySelector(`.${key}-pills`).classList.add('isValid');
      }
    }

    let count = 0;
    for (let [key, value] of Object.entries(validInputs)){
      if (value === true){
        count++;
      }
    }
    if (count === 6){
      return true;
    } else {
      return false;
    }
  }

  setNewClient(allInputs, type){
    let newClient = {
      relation: {},
    };
    for (let item of allInputs){
      if (item.type === 'radio'){
        if (item.checked){
          if(item.name === 'typeOfOwnership' || item.name === 'scopeOfOwnership'){
            newClient.relation[item.name] = item.value;
          } else {
            newClient[item.name] = item.value;
          }
        }
      } else if(item.name === 'attorneyValue' || item.name === 'percentageOfOwnership' || item.name === 'costForClient'){
          newClient.relation[item.name] = item.value;
      } else {
          newClient[item.name] = item.value;
      }
    }
    newClient.b24ID = '';
    newClient.clientPhone = '';
    newClient.UID = 'A' + Math.floor(Math.random()*1000);
    newClient.documents = [];
    newClient.type = type;

    const clientsContainer = document.querySelector('.clients');
    const id = app.owner.agencyagreement.signatories.length;
    if (type === 'private'){
      clientsContainer.insertAdjacentHTML('beforeend', new Render(app.owner.agencyagreement).ownerLayout(newClient, id));
    } else if (type === 'legal'){
      clientsContainer.insertAdjacentHTML('beforeend', new Render(app.owner.agencyagreement).legalLayout(newClient, id));
    }
    app.copyOwner.agencyagreement.signatories.push(newClient);
    app.newClient = newClient;
    new File().init();
    document.querySelector('.costForClient').innerHTML = '';
    document.querySelector('.costForClient').insertAdjacentHTML('beforeend', `${new Render(app.copyOwner.agencyagreement).getAllPrice()} ₽`);
  }
}

class Handler{
  constructor() {
    this.container = document.querySelector('.agency');
    this.currentClient = '';
    this.currentClientUID = '';
    this.currentElem = '';
    this.filtered = [];
    this.currentResponsible = '';
    this.currentFile = '';
  }
  init(){
    this.container.addEventListener('click', event => {
      if (event.target.dataset.burger === 'burger'){
        if (this.currentFile){
          if (this.currentFile === document.querySelector(`.id${event.target.dataset.uid}`)){
            this.currentFile.classList.toggle('isVisible');
            this.currentFile = '';
          } else {
            this.currentFile.classList.toggle('isVisible');
            this.currentFile = document.querySelector(`.id${event.target.dataset.uid}`);
            this.currentFile.classList.toggle('isVisible');
          }
        } else {
          this.currentFile = document.querySelector(`.id${event.target.dataset.uid}`);
          this.currentFile.classList.toggle('isVisible');
        }
      } else if (event.target.dataset.action === 'edit'){
        let findInDoc = app.copyOwner.agencyagreement.documents.find(item => item.UID === `${event.target.dataset.uid}`);
        this.openEditFile(findInDoc);
        this.setSelectEditFile(findInDoc);
      } else if (event.target.dataset.action === 'delete'){
        this.removeFile(event)
      } else if (event.target.dataset.btn === 'clients_add'){
        this.currentElem = document.querySelector('.add');
        this.checkCurrentElem();
      } else if (event.target.dataset.save === 'all'){
        this.handlerSaveYes();
      } else if (event.target.dataset.save === 'no'){
        this.reloadPage();
      } else if (event.target.dataset.client === 'delete'){
        this.openQuestion(event.target.dataset.name);
        this.currentClient = event.target.dataset.id;
        this.currentClientUID = event.target.dataset.uid;
      } else if (event.target.dataset.client === 'edit'){
        new EditClient(event.target.dataset).init();
      } else if (event.target.dataset.action === 'file-delete'){
        this.removeFile(event);
      } else if (event.target.dataset.choice === 'private'){
        this.checkCurrentElem();
        this.addClients(event);
      } else if (event.target.dataset.choice === 'legal'){
        this.checkCurrentElem();
        this.addLegal();
      } else if (event.target.dataset.btn === 'responsible'){
        this.openSelectResponsible(app.testList);
      } else if (event.target.dataset.clear === 'all'){
        this.clearDOM();
        this.clearObject();
      } else if (event.target.dataset.clear === 'docs'){
        this.clearDocs();
      } else {
        this.checkCurrentElem();
      }
    });
    this.handlerInput();
    document.body.addEventListener('click', event => {
      if (event.target.dataset.burger !== 'burger' && this.currentFile){
        this.currentFile.classList.add('isVisible');
        this.currentFile = '';
      }
    })
  }
  openEditFile(findInDoc){
    const layout = `<div> 
                          <div class="edit__wrap"> 
                            <span class="edit__text">Название</span>
                            <input class="edit__input" name="documentName" type="text" value="${findInDoc.documentName}">
                          </div>
                          <div class="edit__wrap"> 
                            <span class="edit__text">Тип документа</span>
                            <select class="documentType" name="documentType">
                              <option>ЕГРН</option>
                              <option>ДОУ</option>
                              <option>ГРП</option>
                              <option>Прочие документы</option>
                            </select>
                          </div>
                          <div>
                            <button data-uid="${findInDoc.UID}" class="ui-btn ui-btn-danger-light" data-answer="save">Сохранить</button>
                            <button class="ui-btn ui-btn-primary-dark" data-answer="no">Отмена</button>      
                          </div>
                        </div>`;
    this.openModule(layout);
  }
  setSelectEditFile(findInDoc){
    let firsWord = '';
    if (findInDoc.documentType === 'egrn'){
      firsWord = 'ЕГРН';
    } else if (findInDoc.documentType === 'contract'){
      firsWord = 'ДОУ';
    } else if (findInDoc.documentType === 'grp'){
      firsWord = 'ГРП';
    } else if (findInDoc.documentType === 'other'){
      firsWord = 'Прочие документы';
    }
    selectStyle('.documentType', `${firsWord}`)
  }

  checkCurrentElem(){
    if (this.currentElem){
      if (this.currentElem.classList.contains('isVisible')){
        this.currentElem.classList.remove('isVisible');
      } else {
        this.currentElem.classList.add('isVisible');
        this.currentElem = '';
      }
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

  removeFile(event){
    document.querySelector(`.uid${event.target.dataset.uid}`).remove();

    if (event.target.dataset.container === 'passport' || event.target.dataset.container === 'doc'){
      for (let item of app.copyOwner.agencyagreement.signatories){
        let findInClient = item.documents.find(item => item.UID === `${event.target.dataset.uid}`);
        if (findInClient){
          const indexClient = app.copyOwner.agencyagreement.signatories.indexOf(item);
          const indexFile = item.documents.indexOf(findInClient);
c
          document.querySelector('.save-change').classList.add('save-change_active');
        }
      }
    } else {
      let findInDoc = app.copyOwner.agencyagreement.documents.find(item => item.UID === `${event.target.dataset.uid}`);
      const indexFile = app.copyOwner.agencyagreement.documents.indexOf(findInDoc);
      app.copyOwner.agencyagreement.documents.splice(indexFile, 1);
      document.querySelector('.save-change').classList.add('save-change_active');
    }
  }

  reloadPage(){
    document.querySelector('.save-change').classList.add('save-change_close');
    setTimeout(() => {
      document.querySelector('.agency').remove();
      document.body.insertAdjacentHTML('beforeend', `<div class="agency container"></div>`)
      app.container = document.querySelector('.agency');
      app.copyOwner = JSON.parse(JSON.stringify(app.owner));
      app.init();
    }, 1000);
  }
  handlerSaveYes(){
    const allInputs = document.querySelectorAll("INPUT:not([type='file'])");
    const allSelect = document.querySelectorAll(".select__gap");
    const errorContainer = document.querySelector('.save-change-error');
    const blockClient = document.querySelector('.clients__title-head');
    if (app.copyOwner.agencyagreement.signatories.length === 0){
      blockClient.classList.add('isValidText');
      errorContainer.innerHTML = '';
      errorContainer.insertAdjacentHTML('beforeend', `<p class="save-change-text">Отсутвуют клиенты</p>`);
      blockClient.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'});
    } else {
      if (this.validMainPage(allInputs, allSelect)){
        blockClient.classList.remove('isValidText');
        errorContainer.innerHTML = '';
        app.copyOwner.agencyagreement.editor = login;
        this.setAllInput(allInputs);
        this.setAllSelect(allSelect);
        if (Object.keys(app.newClient).length !== 0){
          document.querySelector('.save-change').classList.add('save-change_close');
          this.checkDone();
          this.setLoader();
          this.updateAgencyAgreement().then(() => {
            document.querySelector('.agency').remove();
            document.body.insertAdjacentHTML('beforeend', `<div class="agency container"></div>`)
            app.container = document.querySelector('.agency');
            app.getJson().then(() => {
              app.newClient = {};
              this.removeLoader();
            })
          })
        } else {
          document.querySelector('.save-change').classList.add('save-change_close');
          this.checkDone();
          this.setLoader();
          this.updateAgencyAgreement().then(() => {
            app.owner = JSON.parse(JSON.stringify(app.copyOwner));
            document.querySelector('.save-change').classList.remove('save-change_close');
            document.querySelector('.save-change').classList.remove('save-change_active');
            document.querySelector('.progress').innerHTML = '';
            document.querySelector('.progress').insertAdjacentHTML('beforeend', new ProgressBar(app.copyOwner.agencyagreement).render())
            app.initTooltip();
            this.removeLoader();
          });
        }
      }
    }
  }

  handlerInput(){
    const allInputs = document.querySelectorAll('INPUT');
    const saveChange = document.querySelector('.save-change');
    for (let item of allInputs){
      if (!item.classList.contains('mobile-toggle__input') && !item.classList.contains('file__input')){
        item.addEventListener('change', event => {
          saveChange.classList.add('save-change_active');
        })
      }
    }
    const selectInput = document.querySelectorAll('.select__gap');
      for (let item of selectInput){
        const observer = new MutationObserver(event => {
          saveChange.classList.add('save-change_active');
        })
        observer.observe(item, {childList: true});
      }
  }

  validMainPage(allInputs, allSelect){
    const inputValid = {
      docType: false,
      typeOfOwnership: false,
      scopeOfOwnership: false,
      percentageOfOwnership: false,
      expired: false,
      typeOfLaw : false,
    }
    const inputObj = {
      docType: [],
      typeOfOwnership: [],
      scopeOfOwnership: [],
      percentageOfOwnership:'',
      expired: '',
      typeOfLaw: '',
    }
    for (let input of allInputs){
      if (!input.classList.contains('mobile-toggle__input')){
        if (input.name === 'percentageOfOwnership' || input.name === 'expired'){
          inputObj[input.name] = input;
        } else {
          inputObj[input.name].push(input);
        }
      }
    }
    for (let select of allSelect){
      if (select.previousElementSibling.name === 'typeOfLaw'){
        inputObj.typeOfLaw = select;
      }
    }
    const inputFalse = [];
    checkRadio(inputObj.docType[0], inputObj.docType[1]);
    checkRadio(inputObj.typeOfOwnership[0], inputObj.typeOfOwnership[1]);
    function checkRadio(item1, item2){
      if (item1.checked || item2.checked){
        inputValid[item1.name] = true;
        item1.classList.remove('isValid');
        item2.classList.remove('isValid');
      } else {
        inputFalse.push(item1)
        item1.classList.add('isValid');
        item2.classList.add('isValid');
      }
    }
    checkRadiosScope(inputObj.scopeOfOwnership[0], inputObj.scopeOfOwnership[1], inputObj.percentageOfOwnership)
    function checkRadiosScope(item1, item2, score){
      const regExp = /[0-9]\/[0-9]/;
      if (item1.checked){
        inputValid[item1.name] = true;
        inputValid[score.name] = true;
        item1.classList.remove('isValid');
        item2.classList.remove('isValid');
        score.classList.remove('isValid');
      } else if (item2.checked && score.value.length === 0){
        inputFalse.push(score)
        score.classList.add('isValid');
      } else if (item2.checked && !regExp.test(score.value)) {
        inputFalse.push(score)
        score.classList.add('isValid');
      } else {
        inputValid[item1.name] = true;
        inputValid[score.name] = true;
        item1.classList.remove('isValid');
        item2.classList.remove('isValid');
        score.classList.remove('isValid');
      }
    }
    checkExpired(inputObj.expired)
    function checkExpired(item){
      if (new Date() < new Date(item.value)){
        inputValid.expired = true;
        item.classList.remove('isValid');
      } else {
        inputFalse.push(item)
        item.classList.add('isValid');
      }
    }
    checkTypeOfLaw(inputObj.typeOfLaw);
    function checkTypeOfLaw(item){
      if (item.innerHTML.length === 0 || item.innerHTML === 'Выбрать'){
        inputFalse.push(item);
        item.classList.add('isValid');
      } else {
        item.classList.remove('isValid');
        inputValid.typeOfLaw = true;
      }
    }
    let count = 0;
    for (let [key, value] of Object.entries(inputValid)){
      if (value === true){
        count++;
      }
    }
    if (count === 6){
      return true;
    } else {
      this.setError(inputFalse);
    }
  }
  setError(error){
    const errorContainer = document.querySelector('.save-change-error');
    const errorText = {
      docType: 'тип договора',
      typeOfOwnership: 'на кого договор',
      scopeOfOwnership: 'объем владения',
      percentageOfOwnership: 'обьем доли',
      expired: 'дату',
      typeOfLaw : 'тип права',
    }
    if (error[0].tagName === 'INPUT'){
      errorContainer.innerHTML = '';
      errorContainer.insertAdjacentHTML('beforeend', `<p class="save-change-text">Укажите ${errorText[error[0].name]}</p>`);
      error[0].scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'});
    } else {
      errorContainer.innerHTML = '';
      errorContainer.insertAdjacentHTML('beforeend', `<p class="save-change-text">Укажите ${errorText.typeOfLaw}</p>`);
      error[0].scrollIntoView();
    }
  }

  setAllInput(allInputs){
    for (let item of allInputs){
      if (!item.classList.contains('mobile-toggle__input')){
        if (item.type === 'radio') {
          if (item.checked) {
            app.copyOwner.agencyagreement[item.name] = item.value;
          }
        } else {
          app.copyOwner.agencyagreement[item.name] = item.value;
        }
      }
    }
  }
  setAllSelect(allSelect){
    for (let item of allSelect){
      if (item.previousElementSibling.name === 'typeOfRealty'){
        app.copyOwner.agencyagreement.params[item.previousElementSibling.name] = item.innerHTML;
      } else if (item.previousElementSibling.name === 'typeOfLaw'){
        app.copyOwner.agencyagreement[item.previousElementSibling.name] = item.innerHTML;
      }
    }
  }

  checkDone(){
    const progressItems = document.querySelectorAll('.progress__number');
    console.log(progressItems)
    const changeText = document.querySelector('.save-change__text');
    if (app.copyOwner.agencyagreement.docType === 'Эксклюзив'){
      if (app.copyOwner.chiefAccepted !== '0' || app.copyOwner.moderatorAccepted !== '0'){
        app.copyOwner.agencyagreement.chiefAccepted = '0';
        app.copyOwner.agencyagreement.moderatorAccepted = '0';
        progressItems[3].classList.remove('progress__number_active');
        if (changeText){changeText.remove()}
        return true;
      } else {
        return false;
      }
    } else {
      if (app.copyOwner.chiefAccepted !== '0' || app.copyOwner.moderatorAccepted !== '0'){
        app.copyOwner.agencyagreement.chiefAccepted = '0';
        app.copyOwner.agencyagreement.moderatorAccepted = '0';
        progressItems[3].classList.remove('progress__number_active');
        progressItems[4].classList.remove('progress__number_active');
        if (changeText){changeText.remove()}
        return true;
      } else {
        return false;
      }
    }
  }

  async updateAgencyAgreement() {
    var request1Cnamed = new Object();
    request1Cnamed.ID = 651651;
    request1Cnamed.action = 'setAgreement';
    request1Cnamed.object = app.copyOwner;
    console.log(app.copyOwner)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    var raw = JSON.stringify(request1Cnamed);
    var requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/agreementViewer.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
  }
  addLegal(){
    new Form().renderLegal();
    this.handlerForm();
  };
  addClients(){
    new Form().render();
    this.handlerForm();
  }
  removeClientFromDom(){
    document.querySelector(`.${this.currentClient}`).remove();
    let find = app.copyOwner.agencyagreement.signatories.find(item => item.UID === `${this.currentClientUID}`);
    app.copyOwner.agencyagreement.signatories.splice(app.copyOwner.agencyagreement.signatories.indexOf(find), 1);
    this.setLoader();
    if (this.checkDone()){
      this.updateAgencyAgreement();
    }
    this.removeClient(find).then(() => {
      this.removeLoader();
      app.owner = JSON.parse(JSON.stringify(app.copyOwner));
    })
  }
  async removeClient(find){
    let request1Cnamed = new Object();
    request1Cnamed.ID = 651651;
    request1Cnamed.action = 'deletesignatories';
    request1Cnamed.object = {
      'UIDagreement' : find.relation.UID,
      'UIDsignatories' : this.currentClientUID,
    };

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    let raw = JSON.stringify(request1Cnamed);
    let requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/agreementViewer.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    this.currentClient = '';
    this.currentClientUID = '';
  }
  openQuestion(name){
    const dataName = name.split('_').join(' ');
    const layoutQuestions = `<div> 
                                <p>Вы уверены что котите удалить клиента ${dataName}</p>
                                <button data-answer="yes" class="ui-btn ui-btn-danger-light">Да</button>                           
                                <button data-answer="no"  class="ui-btn ui-btn-primary-dark">Нет</button>                           
                            </div>`
    this.openModule(layoutQuestions);
  }
  openSelectResponsible(arr){
    let responsible = '';
    for (let item of arr){
      responsible += `<tr class="responsible__row"> 
                        <td class="responsible__column">${item.place}</td>
                        <td class="responsible__column responsible__name">${item.name}</td>
                      </tr>`
    }
    const layout = `<div class="responsible"> 
                      <p class="responsible__text">Выберете ответственное лицо</p>
                      <form class="responsible__form">
                        <input class="responsible__input" type="text">
                        <button class="responsible__search-btn" type="submit"></button>
                      </form>
                      <div class="responsible__table-wrap">
                        <table class="responsible__table"> 
                          ${responsible}                    
                        </table>
                      </div>
                    </div>                    
                    <div class="responsible__buttons"> 
                      <button data-responsible="save" class="form__btn">Сохранить</button>
                      <button data-answer="no" class="form__btn">Отменить</button>
                    </div>`
    this.openModule(layout)
    this.handlerResponsible();
  }
  handlerResponsible(){
    const responsibleForm = document.querySelector('.responsible__form');
    const responsibleTable = document.querySelector('.responsible__table');
    const responsibleButtons = document.querySelector('.responsible__buttons');
    const module = document.querySelector('.module');
    responsibleForm.addEventListener('submit', event => {
      event.preventDefault();
      const searchText = document.querySelector('.responsible__input').value;
      if (searchText.length > 0){
        this.filterResponsible(searchText, module);
      } else {
        this.closeModule(module);
        this.openSelectResponsible(app.testList);
      }
    })
    responsibleTable.addEventListener('click', event => {
      if (this.currentResponsible){
        this.currentResponsible.classList.remove('responsible__row_active');
      }
      this.currentResponsible = event.target.parentElement;
      this.currentResponsible.classList.add('responsible__row_active');
    })
    responsibleButtons.addEventListener('click', event => {
      if (event.target.dataset.responsible === 'save'){
        const responsibleName = this.currentResponsible.querySelector('.responsible__name').innerHTML;
        this.setResponsible(responsibleName);
        this.closeModule(module);
      }
    })
  }
  setResponsible(name){
    document.querySelector('.summary__text-span').innerHTML = name;
    app.copyOwner.agencyagreement.implementer = name;
    document.querySelector('.save-change').classList.add('save-change_active');
  }
  openModule(field){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="module">
                          <span class="module__close"></span>
                          <div class="module__wrap">${field}</div>                          
                    </div>`
    this.container.insertAdjacentHTML('beforebegin', layout);
    this.handlerModule();
  }
  handlerModule(){
    const module = document.querySelector('.module');
    module.addEventListener('click', event => {
      if (event.target.classList.contains('module__close')){
        this.closeModule(module);
      } else if (event.target.dataset.answer === 'no'){
        this.closeModule(module);
      } else if (event.target.dataset.answer === 'yes'){
        this.removeClientFromDom();
        this.closeModule(module);
      } else if (event.target.dataset.answer === 'save'){
        let findInDoc = app.copyOwner.agencyagreement.documents.find(item => item.UID === `${event.target.dataset.uid}`);
        const input = module.querySelector('INPUT');
        let typeFile = '';
        const select = module.querySelector('SELECT');
        switch (select.value) {
          case 'ЕГРН':
            typeFile = 'egrn';
            break;
          case 'ДОУ':
            typeFile = 'contract';
            break;
          case 'ГРП':
            typeFile = 'grp';
            break;
          case 'Прочие документы':
            typeFile = 'other';
            break;
        }
        findInDoc[input.name] = input.value;
        findInDoc[select.name] = typeFile;
        this.removeFile(event);
        app.copyOwner.agencyagreement.documents.push(findInDoc);
        new SendFile().renderFiles(findInDoc);
        this.closeModule(module);
      }
    })
  };
  closeModule(module){
    const htmlDom = document.querySelector('HTML');
    htmlDom.removeAttribute("style");
    module.remove();
  }
  filterResponsible(value, module){
    const regexp = new RegExp(value, 'i');
    this.filtered = app.testList.filter(user => regexp.test(user.name) || regexp.test(user.place));
    this.closeModule(module);
    this.openSelectResponsible(this.filtered);
  }
  handlerForm(){
    const module = document.querySelector('.module-form');
    const form = document.querySelector('.form');
    const htmlDom = document.querySelector('HTML');

    form.addEventListener('reset', event =>{
      htmlDom.removeAttribute("style");
      module.remove();
    });

    form.addEventListener('submit', event =>{
      event.preventDefault();
      const allInputs = event.target.querySelectorAll('input');
      if (new Form().validForm(allInputs, event.target.dataset.face)){
        htmlDom.removeAttribute("style");
        module.remove();
        document.querySelector('.save-change').classList.add('save-change_active');
      }
    });
  }

  clearDocs(){
    document.querySelector('.container__egrn').innerHTML = '';
    document.querySelector('.container__contract').innerHTML = '';
    document.querySelector('.container__grp').innerHTML = '';
    document.querySelector('.container__other').innerHTML = '';
    app.copyOwner.agencyagreement.documents = [];
    document.querySelector('.save-change').classList.add('save-change_active');
  }
  clearDOM(){
    const summaryText = document.querySelectorAll('.summary__text');
    for (let elem of summaryText){
      elem.querySelector('SPAN').remove();
    }
    document.querySelector('.clients').innerHTML = '';
    const allInputs = document.querySelectorAll('INPUT');
    for (let input of allInputs){
      if (input.type === 'radio'){
        if (input.checked){
          input.checked = false;
        }
      } else {
        input.value = '';
      }
    }
    addAttr('contract__number');
    document.querySelector('.select__gap').innerHTML = 'Выбрать';
    const allContainers = document.querySelectorAll('.file__container');
    for (let container of allContainers){
      container.innerHTML = '';
    }
  }
  clearObject(){
    for (let key in app.copyOwner.agencyagreement){
      if(key !== 'UID'){
        if (typeof app.copyOwner.agencyagreement[key] === 'object' && !Array.isArray(app.copyOwner.agencyagreement[key]) && app.copyOwner.agencyagreement[key] !== null){
          for (let key2 in app.copyOwner.agencyagreement[key]) {
            app.copyOwner.agencyagreement[key][key2] = null;
          }
        } else if (Array.isArray(app.copyOwner.agencyagreement[key])){
          app.copyOwner.agencyagreement[key] = [];
        } else {
          app.copyOwner.agencyagreement[key] = null;
        }
      }
    }
  }
}

class EditClient{
  constructor(dataset) {
    this.currentUID = dataset.uid;
    this.currentId = dataset.id;
    this.arrClients = app.copyOwner.agencyagreement.signatories;
    this.currentCLient = this.arrClients.find(item => item.UID === `${this.currentUID}`);
    this.currentIndex = this.arrClients.indexOf(this.currentCLient);
    this.editClient = '';
  }
  init(){
    if (this.currentCLient.type === 'private'){
      this.openForm();
      this.handlerForm();
    } else if (this.currentCLient.type === 'legal'){
      this.openFormLegal();
      this.handlerForm();
    }

  }
  getDate(date){
    return date.split(" ")[0];
  }
  setGender(){
    if(this.currentCLient.gender === 'Мужской'){
      return `<div class="form__toggle-item"> 
                <input checked type="radio" value="Мужской" id="man" name="gender">
                <label class="form__toggle-btn" for="man">Мужской</label>
              </div>
              <div class="form__toggle-item">                                     
                <input type="radio" id="women" value="Женский" name="gender">
                <label class="form__toggle-btn" for="women">Женский</label>                                      
              </div>`
    } else if (this.currentCLient.gender === 'Женский'){
      return `<div class="form__toggle-item"> 
                <input type="radio" value="Мужской" id="man" name="gender">
                <label class="form__toggle-btn" for="man">Мужской</label>
              </div>
              <div class="form__toggle-item">                                     
                <input checked type="radio" id="women" value="Женский" name="gender">
                <label class="form__toggle-btn" for="women">Женский</label>                                      
              </div>`
    } else {
      return `<div class="form__toggle-item"> 
                <input type="radio" value="Мужской" id="man" name="gender">
                <label class="form__toggle-btn" for="man">Мужской</label>
              </div>
              <div class="form__toggle-item">                                     
                <input type="radio" id="women" value="Женский" name="gender">
                <label class="form__toggle-btn" for="women">Женский</label>                                      
              </div>`
    }
  }
  scopeOfOwnership(){
    const scopeOfOwnership = {
      full: '',
      part: '',
      count: 'disabled'
    }
    if (this.currentCLient.relation.scopeOfOwnership === 'Полная собственность'){
      scopeOfOwnership.full = 'checked';
    } else if (this.currentCLient.relation.scopeOfOwnership === 'Доля'){
      scopeOfOwnership.part = 'checked';
      scopeOfOwnership.count = `value=${this.currentCLient.relation.percentageOfOwnership}`;
    }

    return scopeOfOwnership;
  }
  typeOfOwnership(){
    const typeOfOwnership = {
      owner: '',
      proxy: '',
      number: 'disabled'
    }
    if (this.currentCLient.relation.typeOfOwnership === 'Владелец'){
      typeOfOwnership.owner = 'checked';
    } else if (this.currentCLient.relation.typeOfOwnership === 'Доверенность'){
      typeOfOwnership.proxy = 'checked';
      typeOfOwnership.number = `value=${this.currentCLient.relation.attorneyValue}`;
    }

    return typeOfOwnership;

  }
  openForm(){
    const born = this.getDate(`${this.currentCLient.born}`);
    const passDate = this.getDate(`${this.currentCLient.passDate}`);
    const gender = this.setGender();
    const typeOfOwnership = this.typeOfOwnership();
    const scopeOfOwnership = this.scopeOfOwnership();

    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layoutForm = `<div style="top: ${currentY}px;" class="module-form">
                          <form data-face="private" class="form">
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li class="nav-item" role="presentation">
                              <button class="nav-link active fio_form-pills" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">ФИО</button>
                            </li>
                            <li class="nav-item" role="presentation">
                              <button class="nav-link passport_form-pills" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Паспорт</button>
                            </li>
                            <li class="nav-item" role="presentation">
                              <button class="nav-link address_form-pills" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Адрес,тип права</button>
                            </li>
                          </ul>
                            <div class="tab-content" id="pills-tabContent">
                              <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                <div class="form__fio">
                                  <div class="form__item">
                                    <span class="contract__title">Фамилия</span>
                                    <input id="fio_form" type="text" name="lastName" value="${this.currentCLient.lastName}" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Дата рождения</span>
                                    <input id="fio_form" required type="date" name="born" value="${born}">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Имя</span>
                                    <input id="fio_form" type="text" name="name" value="${this.currentCLient.name}" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Гражданство</span>
                                    <input id="fio_form" type="text" name="nationality" value="${this.currentCLient.nationality}" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Отчество</span>
                                    <input id="fio_form" type="text" name="secondName" value="${this.currentCLient.secondName}" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Место рождения</span>
                                    <input id="fio_form" type="text" name="bornLocality" value="${this.currentCLient.bornLocality}" autocomplete="off">
                                  </div>
                                  <div class="form__toggle">
                                    <span class="contract__title">Пол</span>
                                    ${gender}
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Комиссия</span>
                                    <input id="fio_form" type="text" name="costForClient" value="${this.currentCLient.relation.costForClient}" autocomplete="off">
                                  </div>
                              </div>
                              </div>
                              <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                <div class="form__passport">
                                  <div class="form__item">
                                    <span class="contract__title">Серия</span>
                                    <input id="passport_form" type="text" name="passRange" value="${this.currentCLient.passRange}" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Номер</span>
                                    <input id="passport_form" type="text" name="passNumber" value="${this.currentCLient.passNumber}" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Дата выдачи</span>
                                    <input id="passport_form" required type="date" name="passDate" value="${passDate}">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">Код подразделения</span>
                                    <input id="passport_form" type="text" name="passCode" value="${this.currentCLient.passCode}" autocomplete="off">
                                  </div>
                                  <div class="form__item form__passport-getPassport">
                                    <span class="contract__title">Кем выдан</span>
                                    <input id="passport_form" type="text" name="passGranted" value="${this.currentCLient.passGranted}" autocomplete="off">
                                  </div>
                              </div>
                              </div>
                              <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                                <div class="form__address">
                                  <div class="form__item form__address_first">
                                      <span class="contract__title">Адрес постоянной реистрации</span>
                                      <input id="address_form" type="text" name="registrationAddress" value="${this.currentCLient.registrationAddress}" autocomplete="off">
                                  </div>
                                  <div class="form__item form__address_second">
                                      <span class="contract__title">Адрес проживания</span>
                                      <input id="address_form" type="text" name="residentialAddress" value="${this.currentCLient.residentialAddress}" autocomplete="off">
                                  </div>
                                  <div class="form__toggle"> 
                                    <span class="contract__title">Объем владения</span>
                                    <div class="form__toggle-item">
                                        <input name="scopeOfOwnership" type="radio" id="formFull" ${scopeOfOwnership.full} value="Собственность">
                                        <label onclick="addAttr('contract__number')" class='form__toggle-btn' for="formFull">Cобственность</label>
                                    </div>
                                    <div class="form__toggle-item">
                                      <input name="scopeOfOwnership" type="radio" id="formPart" ${scopeOfOwnership.part} value="Доля">
                                      <label onclick="removeAttr('contract__number')" class='form__toggle-btn' for="formPart">Доля</label>
                                    </div>
                                  </div> 
                                  <div class="contract__wrap"> 
                                    <span class="contract__title">Укажите количество</span>
                                    <input id="address_form" name="percentageOfOwnership" class="contract__number" type="text" placeholder="1/4" ${scopeOfOwnership.count} autocomplete="off">
                                  </div>     
                                  <div class="form__toggle">
                                    <span class="contract__title">Типа права</span>
                                    <div class="form__toggle-item">
                                      <input name="typeOfOwnership" value="Владелец" type="radio" id="formOwner" ${typeOfOwnership.owner}>
                                      <label onclick="addAttr('contract__number-proxy')" class='form__toggle-btn' for="formOwner">Владелец</label>
                                    </div>
                                    <div class="form__toggle-item">
                                      <input name="typeOfOwnership" value="Доверенность" type="radio" id="formProxy" ${typeOfOwnership.proxy}>
                                      <label onclick="removeAttr('contract__number-proxy')" class='form__toggle-btn' for="formProxy">Доверенность</label>
                                    </div>
                                  </div>
                                  <div class="contract__wrap"> 
                                    <span class="contract__title">Номер доверености</span>
                                    <input id="address_form" name="attorneyValue" class="contract__number-proxy" type="text" ${typeOfOwnership.number} autocomplete="off">
                                  </div>   
                                </div>  
                              </div>
                            </div>
                            <div> 
                              <button class="form__btn" type="submit">Сохранить</button>
                              <button class="form__btn" type="reset">Закрыть</button>
                            </div>
                          </form>
                        </div>`
    document.body.insertAdjacentHTML('afterbegin', layoutForm);
  }
  openFormLegal(){
    const typeOfOwnership = this.typeOfOwnership();
    const scopeOfOwnership = this.scopeOfOwnership();

    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layoutForm = `<div style="top: ${currentY}px;" class="module-form">
                          <form data-face="legal" class="form">
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li class="nav-item" role="presentation">
                              <button class="nav-link active requisites_form-pills" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Реквизиты</button>
                            </li>
                            <li class="nav-item" role="presentation">
                              <button class="nav-link type_form-pills" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Тип права</button>
                            </li>
                          </ul>
                            <div class="tab-content" id="pills-tabContent">
                              <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                <div class="requisites">
                                  <div class="form__item">
                                    <span class="contract__title">Название организации</span>
                                    <input id="requisites_form" type="text" name="name" value="${this.currentCLient.name}" autocomplete="off">
                                  </div>
                                  <div class="form__item">
                                    <span class="contract__title">ИНН</span>
                                    <input id="requisites_form" type="text" name="inn" value="${this.currentCLient.inn}" autocomplete="off">
                                  </div>
                                  <div class="form__item form__address_first">
                                    <span class="contract__title">Юридический адрес</span>
                                    <input id="requisites_form" type="text" name="registrationAddress" value="${this.currentCLient.registrationAddress}" autocomplete="off">
                                  </div>
                                  <div class="form__item form__address_second">
                                    <span class="contract__title">Фактический адрес</span>
                                    <input id="requisites_form" type="text" name="residentialAddress" value="${this.currentCLient.residentialAddress}" autocomplete="off">
                                  </div>
                                </div>
                              </div>    
                              <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                                <div class="form__address">
                                    <div class="form__toggle"> 
                                      <span class="contract__title">Объем владения</span>
                                      <div class="form__toggle-item">
                                          <input name="scopeOfOwnership" type="radio" id="formFull" ${scopeOfOwnership.full} value="Полная собственность">
                                          <label onclick="addAttr('contract__number')" class='form__toggle-btn' for="formFull">Cобственность</label>
                                      </div>
                                      <div class="form__toggle-item">
                                        <input name="scopeOfOwnership" type="radio" id="formPart" ${scopeOfOwnership.part} value="Доля">
                                        <label onclick="removeAttr('contract__number')" class='form__toggle-btn' for="formPart">Доля</label>
                                      </div>
                                    </div> 
                                    <div class="contract__wrap"> 
                                      <span class="contract__title">Укажите количество</span>
                                      <input id="type_form" name="percentageOfOwnership" class="contract__number" ${scopeOfOwnership.count} type="text" placeholder="1/4" disabled autocomplete="off">
                                    </div>                            
                                    <div class="form__toggle">
                                      <span class="contract__title">Типа права</span>
                                      <div class="form__toggle-item">
                                        <input name="typeOfOwnership" value="Владелец" type="radio" id="formOwner" ${typeOfOwnership.owner}>
                                        <label onclick="addAttr('contract__number-proxy')" class='form__toggle-btn' for="formOwner">Владелец</label>
                                      </div>
                                      <div class="form__toggle-item">
                                        <input name="typeOfOwnership" value="Доверенность" type="radio" id="formProxy">
                                        <label onclick="removeAttr('contract__number-proxy')" class='form__toggle-btn' ${typeOfOwnership.proxy} for="formProxy">Доверенность</label>
                                      </div>
                                    </div>
                                    <div class="contract__wrap"> 
                                      <span class="contract__title">Номер доверености</span>
                                      <input id="type_form" name="attorneyValue" class="contract__number-proxy" ${typeOfOwnership.number} type="text" disabled autocomplete="off">
                                    </div>   
                                </div>  
                              </div>
                            </div>
                            <div> 
                              <button class="form__btn" type="submit">Сохранить</button>
                              <button class="form__btn" type="reset">Закрыть</button>
                            </div>
                          </form>
                        </div>`
    document.body.insertAdjacentHTML('afterbegin', layoutForm);
  }
  handlerForm(){
    const module = document.querySelector('.module-form');
    const form = document.querySelector('.form');
    const htmlDom = document.querySelector('HTML');

    form.addEventListener('reset', event =>{
      htmlDom.removeAttribute("style");
      module.remove();
    });

    form.addEventListener('submit', event =>{
      event.preventDefault();
      const allInputs = event.target.querySelectorAll('input');
      if (this.validForm(allInputs, event.target.dataset.face)){
        this.setNewChange(allInputs, event.target.dataset.face);
        this.renderChange();
        htmlDom.removeAttribute("style");
        module.remove();
        document.querySelector('.save-change').classList.add('save-change_active');
      }
    });
  }l
  setNewChange(allInputs, type){
    const editClient = {
      relation: {},
    };

    for (let item of allInputs){
      if (item.type === 'radio'){
        if (item.checked){
          if (item.name === 'typeOfOwnership' || item.name === 'scopeOfOwnership'){
            editClient.relation[item.name] = item.value;
          } else {
            editClient[item.name] = item.value;
          }
        }
      } else if (item.name === 'attorneyValue' || item.name === 'percentageOfOwnership' || item.name === 'costForClient'){
        editClient.relation[item.name] = item.value;
      } else {
        editClient[item.name] = item.value;
      }
    }
    editClient.UID = this.currentUID;
    editClient.b24ID = '';
    editClient.clientPhone = '';
    editClient.type = type;
    editClient.relation.UID = this.currentCLient.relation.UID;

    this.editClient = editClient;
    app.copyOwner.agencyagreement.signatories.splice(this.currentIndex, 1, this.editClient);
    document.querySelector('.costForClient').innerHTML = '';
    document.querySelector('.costForClient').insertAdjacentHTML('beforeend', `${new Render(app.copyOwner.agencyagreement).getAllPrice()} ₽`);
  }
  validForm(allInputs, type){
    if (type === 'private'){
      if (this.validPrivate(allInputs)){
        return true;
      }
    } else if (type === 'legal'){
      if (this.validLegal(allInputs)){
        return true;
      }
    }
  }
  validPrivate(allInputs){
    const sortInputs = {
      gender: [],
      scopeOfOwnership: [],
      typeOfOwnership: [],
    }
    const validInputs = {
      lastName: false,
      name: false,
      secondName: false,
      born: false,
      nationality: false,
      bornLocality: false,
      passRange: false,
      passNumber: false,
      passDate: false,
      passCode: false,
      passGranted: false,
      registrationAddress: false,
      residentialAddress: false,
      percentageOfOwnership: false,
      attorneyValue: false,
      costForClient: false,
    }
    const libraryRegExp = {
      lastName: /^[А-ЯЁ][а-яё]*( )?-?( )?[А-ЯЁ]?[а-яё]*$/,
      name: /^[А-ЯЁ][а-яё]*( )?-?( )?[А-ЯЁ]?[а-яё]*$/,
      secondName: /^[А-ЯЁ][а-яё]*( )?-?( )?[А-ЯЁ]?[а-яё]*$/,
      nationality: /^[А-ЯЁа-яё]*\.?( )?-?( )?[А-ЯЁ]?[а-яё]*$/,
      bornLocality: /.*/,
      passRange: /^\d{4}$/,
      passNumber: /^\d{6}$/,
      passCode: /^\d{3}-\d{3}$/,
      passGranted: /.*/,
      registrationAddress: /.*/,
      residentialAddress: /.*/,
      percentageOfOwnership: /[0-9]\/[0-9]/,
      attorneyValue: /.*/,
      costForClient: /^\d*$/,
    }
    const isValidPills = {
      fio_form: [],
      passport_form: [],
      address_form: [],
    }
    for (let input of allInputs){
      if (input.value.length === 0 && !input.hasAttribute('disabled')){
        validInputs[input.name] = false;
        input.classList.add('isValid');
        isValidPills[input.id].push(input);
      } else if (!input.hasAttribute('disabled')) {
        if (input.name === 'gender' || input.name === 'scopeOfOwnership' || input.name === 'typeOfOwnership'){
          sortInputs[input.name].push(input);
        } else if(input.name === 'born' || input.name === 'passDate'){
          if (new Date() < new Date(input.value)){
            validInputs[input.name] = false;
            input.classList.add('isValid');
            isValidPills[input.id].push(input);
          } else {
            validInputs[input.name] = true;
            input.classList.remove('isValid');
          }
        } else {
          if (!libraryRegExp[input.name].test(input.value)){
            validInputs[input.name] = false;
            input.classList.add('isValid');
            isValidPills[input.id].push(input);
          } else {
            validInputs[input.name] = true;
            input.classList.remove('isValid');
          }
        }
      } else if (input.hasAttribute('disabled')){
        input.classList.remove('isValid');
        validInputs[input.name] = true;
      }
    }
    for (let [key, value] of Object.entries(isValidPills)){
      if (value.length === 0){
        document.querySelector(`.${key}-pills`).classList.remove('isValid');
      } else {
        document.querySelector(`.${key}-pills`).classList.add('isValid');
      }
    }
    let count = 0;
    for (let [key, value] of Object.entries(validInputs)){
      if (value === true){
        count++;
      }
    }
    if (count === 16){
      return true;
    } else {
      return false;
    }
  }
  validLegal(allInputs){
    const sortInputs = {
      scopeOfOwnership: [],
      typeOfOwnership: [],
    }
    const validInputs = {
      name: false,
      inn: false,
      registrationAddress: false,
      residentialAddress: false,
      percentageOfOwnership: false,
      attorneyValue: false,
    }
    const libraryRegExp = {
      name: /^[А-ЯЁа-яё\- ]*$/,
      inn: /^\d*$/,
      registrationAddress: /.*/,
      residentialAddress: /.*/,
      percentageOfOwnership: /[0-9]\/[0-9]/,
      attorneyValue: /.*/,
    }
    const isValidPills = {
      requisites_form: [],
      type_form: [],
    }
    for (let input of allInputs){
      if (input.value.length === 0 && !input.hasAttribute('disabled')){
        validInputs[input.name] = false;
        input.classList.add('isValid');
        isValidPills[input.id].push(input);
      } else if (!input.hasAttribute('disabled')) {
        if (input.name === 'scopeOfOwnership' || input.name === 'typeOfOwnership'){
          sortInputs[input.name].push(input);
        } else {
          if (!libraryRegExp[input.name].test(input.value)){
            validInputs[input.name] = false;
            input.classList.add('isValid');
            isValidPills[input.id].push(input);
          } else {
            validInputs[input.name] = true;
            input.classList.remove('isValid');
          }
        }
      } else if (input.hasAttribute('disabled')){
        input.classList.remove('isValid');
        validInputs[input.name] = true;
      }
    }
    for (let [key, value] of Object.entries(isValidPills)){
      if (value.length === 0){
        document.querySelector(`.${key}-pills`).classList.remove('isValid');
      } else {
        document.querySelector(`.${key}-pills`).classList.add('isValid');
      }
    }
    let count = 0;
    for (let [key, value] of Object.entries(validInputs)){
      if (value === true){
        count++;
      }
    }
    if (count === 6){
      return true;
    } else {
      return false;
    }
  }
  renderChange(){
    const currentElem = document.querySelector(`.${this.currentId}`);
    if (currentElem.previousElementSibling){
      if (this.editClient.type === 'private'){
        currentElem.previousElementSibling.insertAdjacentHTML('afterend', new Render(app.owner.agencyagreement).ownerLayout(this.editClient, this.currentId));
      } else if (this.editClient.type === 'legal'){
        currentElem.previousElementSibling.insertAdjacentHTML('afterend', new Render(app.owner.agencyagreement).legalLayout(this.editClient, this.currentId));
      }
      currentElem.remove();
    } else{
      if (this.editClient.type === 'private'){
        currentElem.parentElement.insertAdjacentHTML('afterbegin', new Render(app.owner.agencyagreement).ownerLayout(this.editClient, this.currentId));
      } else if (this.editClient.type === 'legal'){
        currentElem.parentElement.insertAdjacentHTML('afterbegin', new Render(app.owner.agencyagreement).legalLayout(this.editClient, this.currentId));
      }
      currentElem.remove();
    }
  }
}

const app = new App();
app.setLoader();
app.getJson().then(() => {
  app.removeLoader();
});

function selectStyle(select, firstWord){
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