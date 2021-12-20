class API{
  constructor() {
    this.apiURL = {
      getInfo: 'https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Call/Server.php',
      getObject: 'https://crm.centralnoe.ru/dealincom/object/reqMaker.php',
      getClient: 'https://crm.centralnoe.ru/dealincom/factory/Clients.php',
    };
  }
  async requestToServer(action, requestNamed){
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

    let response = await fetch(this.apiURL[action], requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    return await response.json();
  }
}

class App{
  constructor() {
    this.checkWork = document.querySelector('.inJob__checkbox');
    this.sessionNumber = '';
    this.item = '';
  }
  init(){
    this.checkWork.addEventListener('change', event => {
      if (this.checkWork.checked){
        api.requestToServer('getInfo', {
          operatorId: 2921,
          action: 'onWorking'
        }).then(startWork => {
          console.log(startWork)
          if (startWork.result){
            this.sessionNumber = startWork.UID;
            api.requestToServer('getInfo', {
              operatorId: 2921,
              action: 'getList'
            }).then(itemsList => {
              console.log(itemsList)
              if (itemsList.result){
                if (itemsList && itemsList.items.length > 0){
                  new ListItems(itemsList.items).init();
                  api.requestToServer('getInfo', {
                    operatorId: 2921,
                    action: 'getItem',
                    entityId: itemsList.items[0].UID,
                  }).then(item => {
                    console.log(item)
                    if (item.result){
                      this.item = item;
                      api.requestToServer('getObject', {
                        action: 'old',
                        reqNumber: item.request.UID,
                        author: 'zainkovskiyaa',
                      }).then(object => {
                        console.log(object)
                        new Item(object, this.item.client.UID).init();
                      })
                    }
                  })
                }
              }
            })
          }
        })
      } else {
          api.requestToServer('getInfo',{
            operatorId: 2921,
            action: 'stopWorking',
            UID: this.sessionNumber,
          }).then(() => {
            new EmptyField().render();
          })
      }
    });
  }
}

class Item {
  constructor(item, clientUID) {
    this.item = item;
    this.clientUID = clientUID;
    this.client = '';
    this.containerItem = document.querySelector('.right');
    this.containerHandler = document.querySelector('.main');
    this.currentSelect = '';
    this.currentOptions = ''
  }
  init(){
    api.requestToServer('getClient',{
      id: this.clientUID,
    }).then(client => {
      console.log(client)
      this.client = client;
      this.renderItem(this.item.reqTypeofRealty);
      this.handler();
      document.querySelector('.item').classList.add('item__active');
    })
  }
  renderItem(reqTypeofRealty){
    this.containerItem.innerHTML = '';
    this.containerItem.insertAdjacentHTML('beforeend', new ItemLayout(this.item, reqTypeofRealty, this.client).render());
    this.checkSlider();
    this.handlerInput();
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
  handler(){
    this.containerHandler.addEventListener('click', event => {
      if (event.target.tagName === 'INPUT' && event.target.type === 'text'){
        if (this.currentSelect && this.currentSelect === event.target){
          this.checkOption();
        } else {
          this.openSelectBlock(event.target);
        }
      } else if (event.target.dataset.select === 'option'){
        this.currentSelect.value = event.target.innerHTML;
        this.checkOption();
      }
    })
    document.body.addEventListener('click', event => {
      if (event.target.dataset.check !== 'elem'){
        this.checkOption();
      }
    })
  }
  handlerInput(){
    const allInputs = document.querySelectorAll('INPUT');
    for (let input of allInputs){
      input.addEventListener('change', event => {
        if (event.target.name === 'reqTypeofRealty'){
          this.renderItem(event.target.value);
        }
        console.log(event.target)

      })
    }
  }
  openSelectBlock(input){
    const findBlock = document.querySelector(`.${input.name}`);
    if (findBlock){
      this.checkOption();
      this.currentOptions = findBlock;
      this.currentOptions.classList.remove('inVisible');
      this.currentSelect = input;
    }
  }
  checkOption(){
    if (this.currentOptions){
      this.currentOptions.classList.add('inVisible');
      this.currentOptions = '';
      this.currentSelect = '';
    }
  }
}

class EmptyField{
  constructor() {
    this.container = document.querySelector('.right');
  }
  render(){
    document.querySelector('.items').innerHTML = '';
    this.container.innerHTML = '';
    this.container.insertAdjacentHTML('beforeend', this.emptyLayout())
  }
  emptyLayout(){
    return `<div class="control">
                <div class="buttons">
                  <button>button1</button>
                  <button>button2</button>
                  <button>button3</button>
                  <button>button4</button>
                </div>
                <div class="client"></div>
              </div>
              <div class="object"></div>
              <div class="info"></div>`
  }
}

class ListItems{
  constructor(items) {
    this.items = items;
    this.container = document.querySelector('.items');
  }
  init(){
    for (let item of this.items){
      this.container.insertAdjacentHTML('beforeend', this.render(item));
    }
  }
  render(item) {
    return `<div data-item="${item.UID}" class="item"> 
                <span class="item__text item__title">${item.UID}</span>
                <span class="item__text">${item.sheetType}</span>
            </div>`
  }
}

class ItemLayout {
  constructor(item, reqTypeofRealty, client) {
    this.item = item;
    this.client = client;
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
    if (this.item.files){
      if (this.item.files.length > 0){
        for (let photo of this.item.files){
          photoLayout += `<div class="slider__item slider__photo" style="background-image: url(${photo.url ? photo.url : ''})"></div>`
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
                <span class="right__title">Объект</span>  
                <span class="right__title">Сделка</span>  
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
                  <input checked name="reqTypeofRealty" id="float" type="radio" value="Квартира">
                  <label class="subtitle" for="float">Квартира</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="room" type="radio" value="Комната">
                  <label class="subtitle" for="room">Комната</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="house" type="radio" value="Дом">
                  <label class="subtitle" for="house">Дом, коттедж, дача</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="ground" type="radio" value="Земельный участок">
                  <label class="subtitle" for="ground">Земля</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="garage" type="radio" value="Гараж">
                  <label class="subtitle" for="garage">Гараж</label>
                </div>
              </div>
              <div class="object__feature"> 
                <input class="button-input" name="feature" id="second" type="radio" value="Квартира" ${this.item.reqTypeofRealty === "Квартира" ? 'checked' : ''}>
                <label class="button-label" for="second">вторичка</label>
                <input class="button-input" name="feature" id="part" type="radio" value="Переуступка ДДУ" ${this.item.reqTypeofRealty === "Переуступка ДДУ" ? 'checked' : ''}>
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
                <div class="about__item"> 
                  <span class="subtitle">Цена в рекламу</span>
                  <input name="reqOverstatePrice" class="input__text" type="text" autocomplete="off" value="${this.item.reqOverstatePrice ? this.item.reqOverstatePrice : ''}">
                </div>
              </div>
              <span class="title">информация о доме</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Год постройки</span>
                  <input class="input__text" type="date" value="${this.item.reqHouseBuildDate ? this.item.reqHouseBuildDate.split('.').reverse().join('-') : ''}">
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
                <span class="right__title">Объект</span>  
                <span class="right__title">Сделка</span>  
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
                  <input name="reqTypeofRealty" id="float" type="radio" value="Квартира">
                  <label class="subtitle" for="float">Квартира</label>
                </div>
                <div> 
                  <input checked name="reqTypeofRealty" id="room" type="radio" value="Комната">
                  <label class="subtitle" for="room">Комната</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="house" type="radio" value="Дом">
                  <label class="subtitle" for="house">Дом, коттедж, дача</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="ground" type="radio" value="Земельный участок">
                  <label class="subtitle" for="ground">Земля</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="garage" type="radio" value="Гараж">
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
                <div class="about__item"> 
                  <span class="subtitle">Цена в рекламу</span>
                  <input name="reqOverstatePrice" class="input__text" type="text" autocomplete="off" value="${this.item.reqOverstatePrice ? this.item.reqOverstatePrice : ''}">
                </div>
              </div>
              <span class="title">информация о доме</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Год постройки</span>
                  <input class="input__text" type="date" value="${this.item.reqHouseBuildDate ? this.item.reqHouseBuildDate.split('.').reverse().join('-') : ''}">
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
                <span class="right__title">Объект</span>  
                <span class="right__title">Сделка</span>  
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
                  <input name="reqTypeofRealty" id="float" type="radio" value="Квартира">
                  <label class="subtitle" for="float">Квартира</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="room" type="radio" value="Комната">
                  <label class="subtitle" for="room">Комната</label>
                </div>
                <div> 
                  <input checked name="reqTypeofRealty" id="house" type="radio" value="Дом">
                  <label class="subtitle" for="house">Дом, коттедж, дача</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="ground" type="radio" value="Земельный участок">
                  <label class="subtitle" for="ground">Земля</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="garage" type="radio" value="Гараж">
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
                  <input class="input__text" type="date" value="${this.item.reqHouseBuildDate ? this.item.reqHouseBuildDate.split('.').reverse().join('-') : ''}">
                </div>                 
              </div>
              <span class="title">цена, тыс. руб.</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Цена</span>
                  <input name="reqPrice" class="input__text" type="text" autocomplete="off" value="${this.item.reqPrice ? this.item.reqPrice : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Цена в рекламу</span>
                  <input name="reqOverstatePrice" class="input__text" type="text" autocomplete="off" value="${this.item.reqOverstatePrice ? this.item.reqOverstatePrice : ''}">
                </div>
              </div>`
  }
  ground(){
    const photo = this.getPhoto();
    return `<div class="object__header"> 
                <span class="right__title">Объект</span>  
                <span class="right__title">Сделка</span>  
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
                  <input name="reqTypeofRealty" id="float" type="radio" value="Квартира">
                  <label class="subtitle" for="float">Квартира</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="room" type="radio" value="Комната">
                  <label class="subtitle" for="room">Комната</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="house" type="radio" value="Дом">
                  <label class="subtitle" for="house">Дом, коттедж, дача</label>
                </div>
                <div> 
                  <input checked name="reqTypeofRealty" id="ground" type="radio" value="Земельный участок">
                  <label class="subtitle" for="ground">Земля</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="garage" type="radio" value="Гараж">
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
                <div class="about__item"> 
                  <span class="subtitle">Цена в рекламу</span>
                  <input name="reqOverstatePrice" class="input__text" type="text" autocomplete="off" value="${this.item.reqOverstatePrice ? this.item.reqOverstatePrice : ''}">
                </div>
              </div>`
  }
  garage(){
    const photo = this.getPhoto();
    return `<div class="object__header"> 
                <span class="right__title">Объект</span>  
                <span class="right__title">Сделка</span>  
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
                  <input name="reqTypeofRealty" id="float" type="radio" value="Квартира">
                  <label class="subtitle" for="float">Квартира</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="room" type="radio" value="Комната">
                  <label class="subtitle" for="room">Комната</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="house" type="radio" value="Дом">
                  <label class="subtitle" for="house">Дом, коттедж, дача</label>
                </div>
                <div> 
                  <input name="reqTypeofRealty" id="ground" type="radio" value="Земельный участок">
                  <label class="subtitle" for="ground">Земля</label>
                </div>
                <div> 
                  <input checked name="reqTypeofRealty" id="garage" type="radio" value="Гараж">
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
                  <input class="input__text" type="date" value="${this.item.reqHouseBuildDate ? this.item.reqHouseBuildDate.split('.').reverse().join('-') : ''}">
                </div> 
              </div>
              <span class="title">цена, тыс. руб.</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Цена</span>
                  <input name="reqPrice" class="input__text" type="text" autocomplete="off" value="${this.item.reqPrice ? this.item.reqPrice : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Цена в рекламу</span>
                  <input name="reqOverstatePrice" class="input__text" type="text" autocomplete="off" value="${this.item.reqOverstatePrice ? this.item.reqOverstatePrice : ''}">
                </div>
              </div>`
  }

  render(){
    console.log(this.client)
    return `<div class="control">
              <div class="buttons">
                  <button>button1</button>
                  <button>button2</button>
                  <button>button3</button>
                  <button>button4</button>
              </div>
              <div class="client"> 
                <span class="right__title">Клиент</span>
                <div class="about"> 
                  <div class="about__item"> 
                    <span class="subtitle">Фамилия</span>
                    <input class="input__text" type="text" name="LAST_NAME" value="${this.client.LAST_NAME ? this.client.LAST_NAME : ''}">
                  </div>
                  <div class="about__item"> 
                    <span class="subtitle">Имя</span>
                    <input class="input__text" type="text" value="${this.client.NAME ? this.client.NAME : ''}" name="NAME">
                  </div>
                  <div class="about__item"> 
                    <span class="subtitle">Отчество</span>
                    <input class="input__text" type="text" value="${this.client.SECOND_NAME ? this.client.SECOND_NAME : ''}" name="SECOND_NAME">
                  </div>
                  <div class="about__item"> 
                    <span class="subtitle">Телефон</span>
                    <input class="input__text" type="text" value="${this.client.PHONE ? this.client.PHONE[0].VALUE : ''}" name="PHONE">
                  </div>
                </div>
                <div class="comment"> 
                  <span class="subtitle">Комментарий</span>
                  <textarea class="input__area" rows="10">${this.item.comment ? this.item.comment : ''}</textarea>
                </div>
              </div>
            </div>
              <div class="object"> 
                ${this.type[this.reqType]}
            </div>
            <div class="info"></div>`
  }
}

const app = new App();
app.init();

const api = new API();

