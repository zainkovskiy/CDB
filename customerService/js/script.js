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
  }
  init(){
    this.renderItem(this.item, this.item.objectType.type);
    this.handler();
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
      'Дом': this.flat(),
      'Земля': this.flat(),
      'Гараж': this.flat(),
    }
  }
  getPhoto(){
    let photoLayout = '';
    if (this.item.files.length > 0){
      for (let photo of this.item.files){
        photoLayout += `<div class="slider__item slider__photo" style="background-image: url(${photo.url ? photo.url : ''})">
                  </div>`
      }
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
                <label id="reqTypeofRealty" class="button-label" for="second">вторичка</label>
                <input class="button-input" name="feature" id="new" type="radio" value="Новостройка (от застройщика)">
                <label id="reqTypeofRealty" class="button-label" for="new">новостройка</label>
                <input class="button-input" name="feature" id="part" type="radio" value="Переуступка ДДУ">
                <label id="reqTypeofRealty" class="button-label" for="part">переуступка дду</label>
              </div>
              <span class="title">местоположение</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Регион</span>
                  <input class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Населенный пункт</span>
                  <input class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Район</span>
                  <input class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Улица</span>
                  <input class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Номер дома</span>
                  <input class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Дополнительный ориентир</span>
                  <input class="input__text" type="text">
                </div>
              </div>
              <span class="title">объект недвижимости</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Номер квартиры</span>
                  <input class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь общая</span>
                  <input class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь жилая</span>
                  <input class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Площадь кухни</span>
                  <input class="input__text" type="text">
                </div>    
                <div class="about__item">     
                  <span class="subtitle">Количество комнат</span>         
                  <div class="object__rooms"> 
                    <input checked class="button-input" name="reqRoomCount" id="one" type="radio" value="Квартира">
                    <label id="reqRoomCount" class="button-label" for="one">1</label>
                    <input class="button-input" name="reqRoomCount" id="two" type="radio" value="Новостройка (от застройщика)">
                    <label id="reqRoomCount" class="button-label" for="two">2</label>
                    <input class="button-input" name="reqRoomCount" id="three" type="radio" value="Переуступка ДДУ">
                    <label id="reqRoomCount" class="button-label" for="three">3</label>
                    <input class="button-input" name="reqRoomCount" id="for" type="radio" value="Переуступка ДДУ">
                    <label id="reqRoomCount" class="button-label" for="for">4</label>
                    <input class="button-input" name="reqRoomCount" id="five" type="radio" value="Переуступка ДДУ">
                    <label id="reqRoomCount" class="button-label" for="five">5+</label>
                  </div>
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Этаж</span>
                  <input class="input__text" type="text">
                </div>                 
                <div class="about__item"> 
                  <span class="subtitle">Этажность</span>
                  <input class="input__text" type="text">
                </div>                
                <div class="about__item"> 
                  <span class="subtitle">Застройщик</span>
                  <input class="input__text" type="text">
                </div>
              </div>
              <span class="title">цена, тыс. руб.</span>
              <div class="about"> 
                <div class="about__item"> 
                  <span class="subtitle">Цена</span>
                  <input class="input__text" type="text">
                </div>
                <div class="about__item"> 
                  <span class="subtitle">Цена в рекламу</span>
                  <input class="input__text" type="text">
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
                  <input class="input__text" type="text">
                </div>
              </div>`
  }
  room(){
    return `<div>room</div>`
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

