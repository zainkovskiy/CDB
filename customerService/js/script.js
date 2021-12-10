let api = '';
function listenerInJob(){
  document.querySelector('.inJob__checkbox').addEventListener('change', event => {
    const inputInJob = event.target;
    if (inputInJob.checked){
      api = new API();
      const items = api.requestToServer();
      if (items.length > 0){
        new ListItems(items).init();
      }
      const item = api.getItem();
      console.log(items)
      console.log(item)
      new App(item).init();
      // new Item(item).init();
    } else {
      new EmptyField().render();
      listenerInJob();
    }
  })
}
listenerInJob();

class API{
  constructor() {
  }
  requestToServer(){
    return [{
      reqNumber: "57261000005",
      modType: "first",
      reqCity: "Новосибирск",
      reqStreet: "Динамовцев",
      reqHouseNumber: "15",
      reqType: "sk"
    },{
      reqNumber: "57772000043",
      modType: "first",
      reqCity: "Новосибирск",
      reqStreet: "Ватутина",
      reqHouseNumber: "222",
      reqType: "sk"
    }]
  }
  getItem(){
    return {
      "ad": "57261000005",
      "messages": null,
      "object": {
        "city": "Новосибирск",
        "street": "Динамовцев",
        "community": null,
        "houseNumber": "15",
        "lat": "54.861698150634766",
        "lng": "82.98380279541016",
        "reqFloor": "5",
        "reqFloors": "9",
        "totalArea": "80",
        "livingArea": "40",
        "kitchenArea": null,
        "landArea": null
      },
      "author": {
        "UID": "1105",
        "NAME": "Николай",
        "LAST_NAME": "Османов",
        "SECOND_NAME": "Юрьевич",
        "PERSONAL_PHOTO": "https://crm.centralnoe.ru/upload/main/e3b/photo_2020-11-11_15-28-07.jpg",
        "LOGIN": "osmanovnyu",
        "FULL_NAME": "Османов Николай"
      },
      "created": "2021-09-22 13:35:27.623354",
      "type": {
        "modType": "first",
        "type": "Эксклюзив",
        "reqType": "adv"
      },
      "publishedAt": {
        "start": "2021-09-28 11:37:07.689365",
        "stop": "2021-10-12 00:00:00"
      },
      "objectType": {
        "type": "Квартира",
        "rooms": "10",
        "roomsForSale": null
      },
      "objectRoom": "97",
      "objectShare": "",
      "comment": "Привет",
      "commentOk": "0",
      "files": [
        {
          "id": "234337",
          "name": "Комнаты",
          "rejectionReason": "",
          "status": "pending",
          "type": "jpg",
          "url": "https://centromir-sc.ru/imagebase/57261000005/Resize/57261000005_e67ef9de-892a-4457-916f-633604120450_r.jpg",
          "web": "0",
          "isDoc": false
        },
        {
          "id": "234338",
          "name": "Вид из окна",
          "rejectionReason": "",
          "status": "pending",
          "type": "jpg",
          "url": "https://centromir-sc.ru/imagebase/57261000005/Resize/57261000005_f801a3b1-92e8-4839-91f6-64f96e74dcb5_r.jpg",
          "web": "0",
          "isDoc": false
        },
        {
          "id": "234613",
          "name": "Сан.узел",
          "rejectionReason": "",
          "status": "pending",
          "type": "jpg",
          "url": "https://centromir-sc.ru/imagebase/57261000005/Resize/57261000005_d572d8d5-19c0-4deb-961b-fd4703013ce6_r.jpg",
          "web": "0",
          "isDoc": false
        },
        {
          "id": "718",
          "name": "other",
          "rejectionReason": null,
          "status": "pending",
          "type": "jpg",
          "url": "https://crm.centralnoe.ru/upload/2021-09-29/17/16329101458773628/image_2021-09-28_16-49-54.png",
          "isDoc": true
        },
        {
          "id": "4175",
          "name": "contract",
          "rejectionReason": null,
          "status": "pending",
          "type": "jpg",
          "url": "https://crm.centralnoe.ru/upload/2021-10-11/15/16339394087947053/lp_blast-wallpaper-1920x1080.jpg",
          "isDoc": true
        }
      ],
      "clients": [
        {
          "name": "Владимир",
          "lastName": "Важенин",
          "secondName": "Иванович",
          "b24ID": null
        }
      ]
    }
  }
}

class App{
  constructor(item) {
    this.item = item;
    this.containerItem = document.querySelector('.right');
    this.containerHandler = document.querySelector('.main');
    this.currentSelect = '';
    this.currentOptions = ''
  }
  init(){
    this.renderItem(this.item, this.item.objectType.type);
    this.handler();
    document.querySelector('.item').classList.add('item__active');
  }
  renderItem(item, reqTypeofRealty){
    this.containerItem.innerHTML = '';
    this.containerItem.insertAdjacentHTML('beforeend', new Item(item, reqTypeofRealty).render());
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
          this.renderItem(this.item, event.target.value);
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
    this.container = document.body;
  }
  render(){
    this.container.innerHTML = '';
    this.container.insertAdjacentHTML('beforeend', this.emptyLayout())
  }
  emptyLayout(){
    return `<div class="main">
    <div class="left">
        <div class="inJob">
            <input class="inJob__checkbox" id="inJob" name="inJob" type="checkbox">
            <label class="inJob__label" for="inJob">Работаю</label>
        </div>
        <div class="items"></div>
    </div>
    <div class="right">
        <div class="client"></div>
        <div class="object"></div>
        <div class="info"></div>
    </div>
</div>`
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
    return `<div data-item="${item.reqNumber}" class="item"> 
                <span class="item__text item__title">${item.reqNumber}</span>
                <span class="item__text">${item.reqStreet} ${item.reqHouseNumber}</span>
            </div>`
  }
}

class Item{
  constructor(item, reqTypeofRealty) {
    this.item = item;
    this.reqTypeofRealty = reqTypeofRealty;
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
    if (this.item.files.length > 0){
      for (let photo of this.item.files){
        photoLayout += `<div class="slider__item slider__photo" style="background-image: url(${photo.url ? photo.url : ''})"></div>`
      }
    } else {
      return `<div class="slider__item slider__photo" data-img='../img/placeholder.png'' style="background-image: url('../img/placeholder.png')"></div>`;
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
                <input checked class="button-input" name="feature" id="second" type="radio" value="Квартира">
                <label class="button-label" for="second">вторичка</label>
                <input class="button-input" name="feature" id="new" type="radio" value="Новостройка (от застройщика)">
                <label class="button-label" for="new">новостройка</label>
                <input class="button-input" name="feature" id="part" type="radio" value="Переуступка ДДУ">
                <label class="button-label" for="part">переуступка дду</label>
              </div>
              <span class="title">местоположение</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Регион</span>
                  <input name="reqRegion" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Населенный пункт</span>
                  <input name="reqCity" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Район</span>
                  <input name="reqArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Улица</span>
                  <input name="reqStreet" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер дома</span>
                  <input name="reqHouseNumber" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Дополнительный ориентир</span>
                  <input name="reqAdditionalLandmark" class="input__text" type="text">
                </div>
              </div>
              <span class="title">объект недвижимости</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Номер квартиры</span>
                  <input name="reqFlat" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь общая</span>
                  <input name="reqFlatTotalArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь жилая</span>
                  <input name="reqFlatLivingArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь кухни</span>
                  <input name="reqKitchenArea" class="input__text" type="text">
                </div>    
                <div class="about__item">     
                  <span class="subtitle">Количество комнат</span>         
                  <div class="object__rooms"> 
                    <input checked class="button-input" name="reqRoomCount" id="one" type="radio" value="1">
                    <label id="reqRoomCount" class="button-label" for="one">1</label>
                    <input class="button-input" name="reqRoomCount" id="two" type="radio" value="2">
                    <label id="reqRoomCount" class="button-label" for="two">2</label>
                    <input class="button-input" name="reqRoomCount" id="three" type="radio" value="3">
                    <label id="reqRoomCount" class="button-label" for="three">3</label>
                    <input class="button-input" name="reqRoomCount" id="for" type="radio" value="4">
                    <label id="reqRoomCount" class="button-label" for="for">4</label>
                    <input class="button-input" name="reqRoomCount" id="five" type="radio" value="5">
                    <label id="reqRoomCount" class="button-label" for="five">5+</label>
                  </div>
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Этаж</span>
                  <input name="reqFloor" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Этажность</span>
                  <input name="reqFloorCount" class="input__text" type="text">
                </div>                
                <div class="about__item"> 
                  <span class="subtitle">Застройщик</span>
                  <input name="reqHouseDeveloper" class="input__text" type="text">
                </div>               
                <div class="about__item"> 
                  <span class="subtitle">Балкон/лоджия</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqGalleryAvailability" class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqTypeofFlat" class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqTypeofLayout" class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqBathroomType" class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqRepairStatus" class="input__text input__select" type="text" readonly>
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
                  <input name="reqPrice" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Цена в рекламу</span>
                  <input name="reqOverstatePrice" class="input__text" type="text">
                </div>
              </div>
              <span class="title">информация о доме</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Год постройки</span>
                  <input class="input__text" type="date">
                </div> 
                <div class="about__item"> 
                  <span class="subtitle">Материал дома</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqMaterial" class="input__text input__select" type="text" readonly>
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
                  <input name="reqRegion" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Населенный пункт</span>
                  <input name="reqCity" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Район</span>
                  <input name="reqArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Улица</span>
                  <input name="reqStreet" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер дома</span>
                  <input name="reqHouseNumber" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Дополнительный ориентир</span>
                  <input name="reqAdditionalLandmark" class="input__text" type="text">
                </div>
              </div>
              <span class="title">объект недвижимости</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Номер квартиры</span>
                  <input name="reqFlat" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь общая</span>
                  <input name="reqFlatTotalArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь жилая</span>
                  <input name="reqFlatLivingArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь кухни</span>
                  <input name="reqKitchenArea" class="input__text" type="text">
                </div>    
                <div class="about__item">     
                  <span class="subtitle">Количество комнат</span>         
                  <div class="object__rooms"> 
                    <input checked class="button-input" name="reqRoomCount" id="one" type="radio" value="1">
                    <label id="reqRoomCount" class="button-label" for="one">1</label>
                    <input class="button-input" name="reqRoomCount" id="two" type="radio" value="2">
                    <label id="reqRoomCount" class="button-label" for="two">2</label>
                    <input class="button-input" name="reqRoomCount" id="three" type="radio" value="3">
                    <label id="reqRoomCount" class="button-label" for="three">3</label>
                    <input class="button-input" name="reqRoomCount" id="for" type="radio" value="4">
                    <label id="reqRoomCount" class="button-label" for="for">4</label>
                    <input class="button-input" name="reqRoomCount" id="five" type="radio" value="5">
                    <label id="reqRoomCount" class="button-label" for="five">5+</label>
                  </div>
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Этаж</span>
                  <input name="reqFloor" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Этажность</span>
                  <input name="reqFloorCount" class="input__text" type="text">
                </div>                             
                <div class="about__item"> 
                  <span class="subtitle">Балкон/лоджия</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqGalleryAvailability" class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqTypeofFlat" class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqTypeofLayout" class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqBathroomType" class="input__text input__select" type="text" readonly>
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
                  <input name="reqPrice" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Цена в рекламу</span>
                  <input name="reqOverstatePrice" class="input__text" type="text">
                </div>
              </div>
              <span class="title">информация о доме</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Год постройки</span>
                  <input class="input__text" type="date">
                </div> 
                <div class="about__item"> 
                  <span class="subtitle">Материал дома</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqMaterial" class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqHouseType" class="input__text input__select" type="text" readonly>
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
                  <input name="reqRegion" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Населенный пункт</span>
                  <input name="reqCity" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Район</span>
                  <input name="reqArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Улица</span>
                  <input name="reqStreet" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер дома</span>
                  <input name="reqHouseNumber" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Дополнительный ориентир</span>
                  <input name="reqAdditionalLandmark" class="input__text" type="text">
                </div>
              </div>
              <span class="title">объект недвижимости</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Площадь участка в (сотках)</span>
                  <input name="reqLandArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь дома</span>
                  <input name="reqFlatTotalArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь жилая</span>
                  <input name="reqFlatLivingArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь кухни</span>
                  <input name="reqKitchenArea" class="input__text" type="text">
                </div>    
                <div class="about__item">     
                  <span class="subtitle">Количество комнат в доме</span>         
                  <div class="object__rooms"> 
                    <input checked class="button-input" name="reqRoomCount" id="one" type="radio" value="1">
                    <label id="reqRoomCount" class="button-label" for="one">1</label>
                    <input class="button-input" name="reqRoomCount" id="two" type="radio" value="2">
                    <label id="reqRoomCount" class="button-label" for="two">2</label>
                    <input class="button-input" name="reqRoomCount" id="three" type="radio" value="3">
                    <label id="reqRoomCount" class="button-label" for="three">3</label>
                    <input class="button-input" name="reqRoomCount" id="for" type="radio" value="4">
                    <label id="reqRoomCount" class="button-label" for="for">4</label>
                    <input class="button-input" name="reqRoomCount" id="five" type="radio" value="5">
                    <label id="reqRoomCount" class="button-label" for="five">5+</label>
                  </div>
                </div>            
                <div class="about__item"> 
                  <span class="subtitle">Этажность</span>
                  <input name="reqFloorCount" class="input__text" type="text">
                </div>                             
                <div class="about__item"> 
                  <span class="subtitle">Балкон/лоджия</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqGalleryAvailability" class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqBathroomType" class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqHouseType " class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqHouseRoof " class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqHouseHeating " class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqWaterPipes " class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqDrainage " class="input__text input__select" type="text" readonly>
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
                  <input class="input__text" type="date">
                </div>                 
              </div>
              <span class="title">цена, тыс. руб.</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Цена</span>
                  <input name="reqPrice" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Цена в рекламу</span>
                  <input name="reqOverstatePrice" class="input__text" type="text">
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
                  <input name="reqRegion" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Населенный пункт</span>
                  <input name="reqCity" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Район</span>
                  <input name="reqArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Улица</span>
                  <input name="reqStreet" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер дома</span>
                  <input name="reqHouseNumber" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Дополнительный ориентир</span>
                  <input name="reqAdditionalLandmark" class="input__text" type="text">
                </div>
              </div>
              <span class="title">объект недвижимости</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Площадь участка в (сотках)</span>
                  <input name="reqLandArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Садовое общество</span>
                  <input name="reqMunicipality" class="input__text" type="text">
                </div>               
                <div class="about__item"> 
                  <span class="subtitle">Водопровод</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqWaterPipes " class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqWaterPipes" class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqGroundCategory" class="input__text input__select" type="text" readonly>
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
                  <input name="reqPrice" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Цена в рекламу</span>
                  <input name="reqOverstatePrice" class="input__text" type="text">
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
                  <input name="reqRegion" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Населенный пункт</span>
                  <input name="reqCity" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Район</span>
                  <input name="reqArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Улица</span>
                  <input name="reqStreet" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер дома</span>
                  <input name="reqHouseNumber" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Дополнительный ориентир</span>
                  <input name="reqAdditionalLandmark" class="input__text" type="text">
                </div>
              </div>
              <span class="title">объект недвижимости</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Площадь общая</span>
                  <input name="reqFlatTotalArea" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Этаж</span>
                  <input name="reqFloor" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Этажность</span>
                  <input name="reqFloorCount" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер парковочного места</span>
                  <input name="reqFlat" class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Материал стен</span>
                  <div data-check="elem" class="about__container"> 
                    <input data-check="elem" name="reqMaterial" class="input__text input__select" type="text" readonly>
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
                    <input data-check="elem" name="reqGarageType" class="input__text input__select" type="text" readonly>
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
                  <input class="input__text" type="date">
                </div> 
              </div>
              <span class="title">цена, тыс. руб.</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Цена</span>
                  <input name="reqPrice" class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Цена в рекламу</span>
                  <input name="reqOverstatePrice" class="input__text" type="text">
                </div>
              </div>`
  }

  render(){
    return `<div class="client"> 
              <span class="right__title">Клиент</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Фамилия</span>
                  <input class="input__text" type="text" value="${this.item.clients[0].lastName ? this.item.clients[0].lastName : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Имя</span>
                  <input class="input__text" type="text" value="${this.item.clients[0].name ? this.item.clients[0].name : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Отчество</span>
                  <input class="input__text" type="text" value="${this.item.clients[0].secondName ? this.item.clients[0].secondName : ''}">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Телефон</span>
                  <input class="input__text" type="text" value="${this.item.clients[0].tel ? this.item.clients[0].tel : ''}">
                </div>
              </div>
              <div class="comment"> 
                <span class="subtitle">Комментарий</span>
                <textarea class="input__area" rows="10">${this.item.comment ? this.item.comment : ''}</textarea>
              </div>
            </div>
            <div class="object"> 
              ${this.type[this.reqTypeofRealty]}
            </div>
            <div class="info"></div>`
  }
}

