class Add {
  constructor() {
    this.container = document.querySelector('.add');
    this.obj = '';
    this.developerId = '';
  }
  init(){
    this.container.insertAdjacentHTML('beforeend', new Header(this.obj.reqTypeofRealty).render());
    if (add.obj.Rights === 'Full'){
      selectStyle('.reqStatus', 'reqStatus',
        `${add.obj.reqStatus ? add.obj.reqStatus : 'Выберете'}`);
      selectStyle('.onModeration', 'onModeration',
        `${add.obj.onModeration === '1' ? 'Да' : 'Нет'}`);
    } else {
      selectStyle('.reqStatus', 'select_disabled',
        `${add.obj.reqStatus ? add.obj.reqStatus : 'Выберете'}`);
      selectStyle('.onModeration', 'select_disabled',
        `${add.obj.onModeration === '1' ? 'Да' : 'Нет'}`);
    }
    selectStyle('.reqNumber', 'select_reqNumber',
      `${add.obj.reqNumber ? add.obj.reqNumber : ''}`);
    if (action === 'old' || action === 'frompars'){
      this.obj.reqRegion ? storySearch.push(this.obj.reqRegion) : 'reqRegion';
      this.obj.reqCity ? storySearch.push(this.obj.reqCity) : 'reqCity';
      this.obj.reqArea ? storySearch.push(this.obj.reqArea) : 'reqArea';
      this.obj.reqStreet ? storySearch.push(this.obj.reqStreet) : 'reqStreet';
      this.obj.reqHouseDeveloper ? storySearch.push(this.obj.reqHouseDeveloper) : 'reqHouseDeveloper';
      this.setStartPage();
    } else if (action === 'new' && !contact){
      document.querySelector('.error__text').innerHTML = 'Нет контакта ¯\\_(ツ)_/¯ Укажите его в сделке';
      document.querySelector('.error__text').setAttribute('style', 'color: red;');
      document.querySelector('.error').classList.add('error_active');
      document.querySelector('.header').setAttribute('style', 'pointer-events: none;');
    } else {
      storySearch.push('Новосибирская область');
    }
    new Handler().init();
  }
  getAction(){
    if (action === 'new'){
      const request1Cnamed = {
        action: 'new',
        author: login,
      };
      this.getJson(request1Cnamed).then(data => {
        this.obj = data;
        console.log(this.obj)
        this.init();
      })
    } else if (action === 'old'){
      const request1Cnamed = {
        action: 'old',
        reqNumber: UID,
        author: login,
      };
      this.getJson(request1Cnamed).then(data => {
        this.obj = data;
        console.log(this.obj)
        this.init();
      })
    } else if (action === 'frompars'){
      const request1Cnamed = {
        action: 'frompars',
        reqNumber: UID,
        author: login,
        phone: contact,
      };
      this.getJson(request1Cnamed).then(data => {
        this.obj = data;
        console.log(this.obj)
        this.init();
      })
    }
  }
  async getJson(request1Cnamed){
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

    let response = await fetch("https://crm.centralnoe.ru/dealincom/object/reqMaker.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    if (!jsonA){
      this.container.insertAdjacentHTML('beforeend', `<p class="error">Объект не найден</p>`)
    } else {
      return jsonA;
    }
  }
  setStartPage(){
    const form = document.querySelector('.form');
    if (this.obj.reqTypeofRealty === 'Квартира' || this.obj.reqTypeofRealty === 'Переуступка ДДУ' || this.obj.reqTypeofRealty === 'Новостройка (от застройщика)') {
      form.insertAdjacentHTML('beforeend', new Float().render());
      new Search().init();
      this.initMap(this.obj.lat, this.obj.lng);
      selectStyle('.reqGalleryAvailability', 'reqGalleryAvailability',
        `${add.obj.reqGalleryAvailability ? add.obj.reqGalleryAvailability : 'Выберете'}`);
      selectStyle('.reqTypeofFlat', 'reqTypeofFlat',
        `${add.obj.reqTypeofFlat ? add.obj.reqTypeofFlat : 'Выберете'}`);
      selectStyle('.reqTypeofLayout', 'reqTypeofLayout',
        `${add.obj.reqTypeofLayout ? add.obj.reqTypeofLayout : 'Выберете'}`);
      selectStyle('.reqBathroomType', 'reqBathroomType',
        `${add.obj.reqBathroomType ? add.obj.reqBathroomType : 'Выберете'}`);
      selectStyle('.reqRepairStatus', 'reqRepairStatus',
        `${add.obj.reqRepairStatus ? add.obj.reqRepairStatus : 'Выберете'}`);
      selectStyle('.reqMaterial', 'reqMaterial',
        `${add.obj.reqMaterial ? add.obj.reqMaterial : 'Выберете'}`);
    } else if (this.obj.reqTypeofRealty === 'Комната') {
      form.insertAdjacentHTML('beforeend', new Room().render());
      new Search().init();
      this.initMap(this.obj.lat, this.obj.lng);
      selectStyle('.reqGalleryAvailability', 'reqGalleryAvailability',
        `${add.obj.reqGalleryAvailability ? add.obj.reqGalleryAvailability : 'Выберете'}`);
      selectStyle('.reqTypeofFlat', 'reqTypeofFlat',
        `${add.obj.reqTypeofFlat ? add.obj.reqTypeofFlat : 'Выберет'}`);
      selectStyle('.reqTypeofLayout', 'reqTypeofLayout',
        `${add.obj.reqTypeofLayout ? add.obj.reqTypeofLayout : 'Выберет'}`);
      selectStyle('.reqBathroomType', 'reqBathroomType',
        `${add.obj.reqBathroomType ? add.obj.reqBathroomType : 'Выберете'}`);
      selectStyle('.reqMaterial', 'reqMaterial',
        `${add.obj.reqMaterial ? add.obj.reqMaterial : 'Выберете'}`);
      selectStyle('.reqHouseType', 'reqHouseType',
        `${add.obj.reqHouseType ? add.obj.reqHouseType : 'Выберете'}`);
    } else if (this.obj.reqTypeofRealty === 'Дом') {
      form.insertAdjacentHTML('beforeend', new House().render());
      new Search().init();
      this.initMap(this.obj.lat, this.obj.lng);
      selectStyle('.reqHouseType', 'reqHouseType',
        `${add.obj.reqHouseType ? add.obj.reqHouseType : 'Выберете'}`);
      selectStyle('.reqGalleryAvailability', 'reqGalleryAvailability',
        `${add.obj.reqGalleryAvailability ? add.obj.reqGalleryAvailability : 'Выберете'}`);
      selectStyle('.reqBathroomType', 'reqBathroomType',
        `${add.obj.reqBathroomType ? add.obj.reqBathroomType : 'Выберете'}`);
      selectStyle('.reqHouseRoof', 'reqHouseRoof',
        `${add.obj.reqHouseRoof ? add.obj.reqHouseRoof : 'Выберете'}`);
      selectStyle('.reqHouseHeating', 'reqHouseHeating',
        `${add.obj.reqHouseHeating ? add.obj.reqHouseHeating : 'Выберете'}`);
      selectStyle('.reqWaterPipes', 'reqWaterPipes',
        `${add.obj.reqWaterPipes ? add.obj.reqWaterPipes : 'Выберете'}`);
      selectStyle('.reqDrainage', 'reqDrainage',
        `${add.obj.reqDrainage ? add.obj.reqDrainage : 'Выберете'}`);
    } else if (this.obj.reqTypeofRealty === 'Земельный участок') {
      form.insertAdjacentHTML('beforeend', new Ground().render());
      new Search().init();
      this.initMap(this.obj.lat, this.obj.lng);
      selectStyle('.reqWaterPipes', 'reqWaterPipes',
        `${add.obj.reqWaterPipes ? add.obj.reqWaterPipes : 'Выберете'}`);
      selectStyle('.reqDrainage', 'reqDrainage',
        `${add.obj.reqDrainage ? add.obj.reqDrainage : 'Выберете'}`);
      selectStyle('.reqGroundCategory', 'reqGroundCategory',
        `${add.obj.reqGroundCategory ? add.obj.reqGroundCategory : 'Выберете'}`);
    } else if (this.obj.reqTypeofRealty === 'Гараж') {
      form.insertAdjacentHTML('beforeend', new Garage().render());
      new Search().init();
      this.initMap(this.obj.lat, this.obj.lng);
      selectStyle('.reqMaterial', 'reqMaterial',
        `${add.obj.reqMaterial ? add.obj.reqMaterial : 'Выберете'}`);
      selectStyle('.reqGarageType', 'reqGarageType',
        `${add.obj.reqGarageType ? add.obj.reqGarageType : 'Выберете'}`);
    }
  }
  initMap(x, y){
    let cords = [];
    if (x && y){
      cords.push(x);
      cords.push(y);
    } else {
      cords = ['55.030204', '82.920430'];
    }
    ymaps.ready(init);
    function init(){
      var myMap = new ymaps.Map('map', {
          center: cords,
          zoom: 15,
          controls: [],
        }, {
          // searchControlProvider: 'yandex#search',
          suppressMapOpenBlock: true
        }),

        // Создаём макет содержимого.
        MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
          '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        ),

        myPlacemarkWithContent = new ymaps.Placemark(cords, {
        }, {
          // Опции.
          // Необходимо указать данный тип макета.
          iconLayout: 'default#imageWithContent',
          // Своё изображение иконки метки.
          iconImageHref: '../img/centr-small.png',
          // Размеры метки.
          iconImageSize: [20, 20],
          // Смещение левого верхнего угла иконки относительно
          // её "ножки" (точки привязки).
          iconImageOffset: [-24, -24],
          // Смещение слоя с содержимым относительно слоя с картинкой.
          iconContentOffset: [15, 15],
          // Макет содержимого.
          iconContentLayout: MyIconContentLayout
        });
      myMap.geoObjects.add(myPlacemarkWithContent);

      myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        if (document.querySelector(`INPUT[name='lat']`) && document.querySelector(`INPUT[name='lng']`)){
          document.querySelector(`INPUT[name='lat']`).value = coords[0];
          document.querySelector(`INPUT[name='lng']`).value = coords[1];
          myPlacemarkWithContent.geometry.setCoordinates(coords);

          //todo функция возвращает адресс по координатам в console
          getAddress(coords[0], coords[1])
          async function getAddress(x, y){
            const API = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${x}+${y}&format=json&limit=1`
            const webClient = {
              Headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0",
                "Referer": "crm.centralnoe.ru"
              }
            };

            let response = await fetch(API, webClient);
            if (!response.ok) {
              throw new Error('Ответ сети был не ok.');
            }
            let jsonA = await response.json();
            console.log(jsonA)
            }
      }
      });
    }
  }
}

class Header {
  constructor(type) {
    this.type = type;
  }

  render(){
    return `<div class="save-change">
                <p class="save-change__text"></p>
                <div class="save-change__group"> 
                  <button data-save="all" class="ui-btn ui-btn-success save-change__btn">Сохранить</button>
                  <button data-save="no" class="ui-btn ui-btn-danger-dark save-change__btn">Отменить</button>
                </div>
            </div>
            <div class="error">   
                <p class="error__text"></p>
            </div>
            <div class="methodical"> 
              <span>Как работать с объектом?</span>
              <button data-info="add" class="ui-btn ui-btn-primary-dark">инфо</button>
            </div>
            <div class="header"> 
              <div class="header__wrap"> 
                <span class="header__title">Объект недвижимости</span>
                <a href="../object/?source=1c&id=${UID}&IDDEAL=${deal}" class="header__back ${action === 'new' && !contact ? 'inVisible' : ''}">Вернуться к объекту</a>
                <span onclick="BX.SidePanel.Instance.close([immediately=false])" class="header__back">Закрыть вкладку</span>
              </div>
              <div class="change-obj"> 
                <input 
                    ${this.type === 'Квартира' ||  this.type === 'Переуступка ДДУ'  || this.type === 'Новостройка (от застройщика)' ? 'checked' : ''} 
                    class="change-obj__input" name="reqTypeofRealty" id="float" type="radio" value="Квартира">
                <label for="float">Квартира</label>
                <input ${this.type === 'Комната' ? 'checked' : ''} class="change-obj__input" 
                name="reqTypeofRealty" id="room" type="radio" value="Комната">
                <label for="room">Комната</label>
                <input ${this.type === 'Дом' ? 'checked' : ''} class="change-obj__input" 
                name="reqTypeofRealty" id="house" type="radio" value="Дом">
                <label for="house">Дом, коттедж, дача</label>
                <input ${this.type === 'Земельный участок' ? 'checked' : ''} class="change-obj__input" 
                name="reqTypeofRealty" id="ground" type="radio" value="Земельный участок">
                <label for="ground">Земля</label>
                <input ${this.type === 'Гараж' ? 'checked' : ''} class="change-obj__input" 
                name="reqTypeofRealty" id="garage" type="radio" value="Гараж">
                <label for="garage">Гараж</label>
              </div>
            </div> 
            <div class="status ${action === 'new' || action === 'frompars' ? 'isVisible' : ''}"> 
              <div class="status__wrap"> 
                <span class="status__text status__text_margin">Статус</span>
                <select class="reqStatus" name="reqStatus">
                    <option>Активная</option>
                    <option>Отмененная</option>
                    <option>Отложенная</option>
                    <option>Предварительно отменена</option>
                    <option>Выполненная</option>
                    <option>Ожидание сделки</option>
                </select>
              </div>
              <div class="status__wrap status_center"> 
                <span class="status__text">Номер заявки</span>
                <select class="reqNumber" name="reqStatus">
                </select>
              </div>     
              <div class="status__wrap"> 
                <span class="status__text">На модерации</span>
                <select class="onModeration" name="onModeration">
                    <option>Да</option>
                    <option>Нет</option>
                </select>
              </div>     
            </div>
            <form class="form" autocomplete="new-password"></form>`
  }
}
class Handler{
  constructor() {
    this.radioSelect = document.querySelectorAll('.change-obj__input');
    this.saveChange = document.querySelector('.save-change');
    this.form = document.querySelector('.form');
  }
  init(){
    for (let radio of this.radioSelect){
      radio.addEventListener('change', event => {
        const blockSave = document.querySelector('.error');
        if (blockSave.classList.contains('error_active')){
          document.querySelector('.save-change__text').innerHTML = '';
          blockSave.classList.add('error_close');
          setTimeout(() => {
            blockSave.classList.remove('error_active');
            blockSave.classList.remove('error_close');
          }, 500)
        }
        switch (event.target.id) {
          case 'float':
            this.form.innerHTML = '';
            this.form.insertAdjacentHTML('beforeend', new Float().render());
            new Search().init();
            add.initMap(add.obj.lat, add.obj.lng);
            selectStyle('.reqGalleryAvailability', 'reqGalleryAvailability',
              `${add.obj.reqGalleryAvailability ? add.obj.reqGalleryAvailability : 'Выберете'}`);
            selectStyle('.reqTypeofFlat', 'reqTypeofFlat',
              `${add.obj.reqTypeofFlat ? add.obj.reqTypeofFlat : 'Выберете'}`);
            selectStyle('.reqTypeofLayout', 'reqTypeofLayout',
              `${add.obj.reqTypeofLayout ? add.obj.reqTypeofLayout : 'Выберете'}`);
            selectStyle('.reqBathroomType', 'reqBathroomType',
              `${add.obj.reqBathroomType ? add.obj.reqBathroomType : 'Выберете'}`);
            selectStyle('.reqRepairStatus', 'reqRepairStatus',
              `${add.obj.reqRepairStatus ? add.obj.reqRepairStatus : 'Выберете'}`);
            selectStyle('.reqMaterial', 'reqMaterial',
              `${add.obj.reqMaterial ? add.obj.reqMaterial : 'Выберете'}`);
            this.handlerPrice();
            break
          case 'room':
            this.form.innerHTML = '';
            this.form.insertAdjacentHTML('beforeend', new Room().render());
            new Search().init();
            add.initMap(add.obj.lat, add.obj.lng);
            selectStyle('.reqGalleryAvailability', 'reqGalleryAvailability',
              `${add.obj.reqGalleryAvailability ? add.obj.reqGalleryAvailability : 'Выберете'}`);
            selectStyle('.reqTypeofFlat', 'reqTypeofFlat',
              `${add.obj.reqTypeofFlat ? add.obj.reqTypeofFlat : 'Выберете'}`);
            selectStyle('.reqTypeofLayout', 'reqTypeofLayout',
              `${add.obj.reqTypeofLayout ? add.obj.reqTypeofLayout : 'Выберете'}`);
            selectStyle('.reqBathroomType', 'reqBathroomType',
              `${add.obj.reqBathroomType ? add.obj.reqBathroomType : 'Выберете'}`);
            selectStyle('.reqMaterial', 'reqMaterial',
              `${add.obj.reqMaterial ? add.obj.reqMaterial : 'Выберете'}`);
            selectStyle('.reqHouseType', 'reqHouseType',
              `${add.obj.reqHouseType ? add.obj.reqHouseType : 'Выберете'}`);
            this.handlerPrice();
            break
          case 'house':
            this.form.innerHTML = '';
            this.form.insertAdjacentHTML('beforeend', new House().render());
            new Search().init();
            add.initMap(add.obj.lat, add.obj.lng);
            selectStyle('.reqHouseType', 'reqHouseType',
              `${add.obj.reqHouseType ? add.obj.reqHouseType : 'Выберете'}`);
            selectStyle('.reqGalleryAvailability', 'reqGalleryAvailability',
              `${add.obj.reqGalleryAvailability ? add.obj.reqGalleryAvailability : 'Выберете'}`);
            selectStyle('.reqBathroomType', 'reqBathroomType',
              `${add.obj.reqBathroomType ? add.obj.reqBathroomType : 'Выберете'}`);
            selectStyle('.reqHouseRoof', 'reqHouseRoof',
              `${add.obj.reqHouseRoof ? add.obj.reqHouseRoof : 'Выберете'}`);
            selectStyle('.reqHouseHeating', 'reqHouseHeating',
              `${add.obj.reqHouseHeating ? add.obj.reqHouseHeating : 'Выберете'}`);
            selectStyle('.reqWaterPipes', 'reqWaterPipes',
              `${add.obj.reqWaterPipes ? add.obj.reqWaterPipes : 'Выберете'}`);
            selectStyle('.reqDrainage', 'reqDrainage',
              `${add.obj.reqDrainage ? add.obj.reqDrainage : 'Выберете'}`);
            this.handlerPrice();
            break
          case 'ground':
            this.form.innerHTML = '';
            this.form.insertAdjacentHTML('beforeend', new Ground().render());
            new Search().init();
            add.initMap(add.obj.lat, add.obj.lng);
            selectStyle('.reqWaterPipes', 'reqWaterPipes',
              `${add.obj.reqWaterPipes ? add.obj.reqWaterPipes : 'Выберете'}`);
            selectStyle('.reqDrainage', 'reqDrainage',
              `${add.obj.reqDrainage ? add.obj.reqDrainage : 'Выберете'}`);
            selectStyle('.reqGroundCategory', 'reqGroundCategory',
              `${add.obj.reqGroundCategory ? add.obj.reqGroundCategory : 'Выберете'}`);
            this.handlerPrice();
            break
          case 'garage':
            this.form.innerHTML = '';
            this.form.insertAdjacentHTML('beforeend', new Garage().render());
            new Search().init();
            add.initMap(add.obj.lat, add.obj.lng);
            selectStyle('.reqMaterial', 'reqMaterial',
              `${add.obj.reqMaterial ? add.obj.reqMaterial : 'Выберете'}`);
            selectStyle('.reqGarageType', 'reqGarageType',
              `${add.obj.reqGarageType ? add.obj.reqGarageType : 'Выберете'}`);
            this.handlerPrice();
            break
        }
      })
    }

    this.form.addEventListener('submit', event => {
      event.preventDefault();
      const allInput = this.form.querySelectorAll(`INPUT:not([type='radio'])`);
      const allRadio = document.querySelectorAll(`INPUT[type='radio']`);
      const allSelect = this.form.querySelectorAll('SELECT');
      const textArea = this.form.querySelector('TEXTAREA');
      if (this.isValid(allRadio, allInput, allSelect)){
        const blockSave = document.querySelector('.error');
        if (blockSave.classList.contains('error_active')){
          document.querySelector('.error__text').innerHTML = '';
          blockSave.classList.add('error_close');
          setTimeout(() => {
            blockSave.classList.remove('error_active');
            blockSave.classList.remove('error_close');
          }, 500)
        }
        this.setChange(allInput, allSelect, allRadio);
        add.obj[textArea.name] = textArea.value;
        if (action === 'old'){
          document.querySelector('.save-change__text').innerHTML = 'Объект подлежит повторной модерации';
          document.querySelector('.save-change').classList.add('save-change_active');
          if (add.obj.Rights === 'Full'){
            this.setStatusAndModeration();
          }
        } else if (action === 'new' || action === 'frompars'){
          add.obj.reqEditor = login;
          add.obj.clientTelNumber = contact;
          add.obj.deal = deal;
          if (add.obj.Rights === 'Full'){
            this.setStatusAndModeration();
          } else {
            add.obj.reqStatus = 'Активная';
          }
          const request1Cnamed = {
            action: 'saveNew',
            data: add.obj,
          };
          if (deal !== ''){
            request1Cnamed.deal = deal;
          }
          if(action === 'frompars'){
            add.obj.transferFromPars = UID;
          }
          this.setLoader();
          this.sendEditObject(request1Cnamed).then(data => {
            this.removeLoader();
            if (data.result === 'ok'){
              document.querySelector('.error__text').innerHTML = `Заявка успешно создана, номер заявки: ${data.reqNumber}`;
              document.querySelector('.error').classList.add('error_active');
              setTimeout(() => {
                location=`https://crm.centralnoe.ru/CDB/object/card/cardObject.php?source=1c&id=${data.reqNumber}`;
              }, 3000);
            } else if (data.result === 'error' && data.reason === 'has dublicate'){
              document.querySelector('.error__text').innerHTML = `Найден дубликат: <span class="error__dublicate" data-dublicate="openCard">${data.dublicate[0]}</span>`;
              document.querySelector('.error').classList.add('error_active');
              setTimeout(() => {
                this.openCard(data.dublicate[0]);
              }, 2000);
              document.querySelector('.error').addEventListener('click', event => {
                if (event.target.dataset.dublicate === 'openCard'){
                  this.openCard(data.dublicate[0]);
                }
              })
            }
          });
        }
      } else{
        document.querySelector('.isValid').scrollIntoView({block: "center", behavior: "smooth"});
        document.querySelector('.error__text').innerHTML = 'Заполните обязательные поля';
        document.querySelector('.error').classList.add('error_active');
      }
    })

    this.form.addEventListener('reset', () => {
      window.location.reload();
    })

    this.saveChange.addEventListener('click', event => {
      if (event.target.tagName === 'BUTTON'){
        if (event.target.dataset.save === 'all'){
          add.obj.onModeration = '1';
          add.obj.reqEditor = login;
          add.obj.clientTelNumber = contact;
          const request1Cnamed = {
            action: 'saveNew',
            data: add.obj,
          };
          this.setLoader();
          this.sendEditObject(request1Cnamed).then(data => {
            const blockSave = document.querySelector('.save-change');
            blockSave.classList.add('save-change_close');
            setTimeout(() => {
              blockSave.classList.remove('save-change_active');
              blockSave.classList.remove('save-change_close');
            }, 500);
            document.querySelector('.save-change__text').innerHTML = '';
            this.removeLoader();
            if (data.result === 'error' && data.reason === 'has dublicate'){
              document.querySelector('.error__text').innerHTML = `Найден дубликат: <span class="error__dublicate" data-dublicate="openCard">${data.dublicate[0]}</span>`;
              document.querySelector('.error').classList.add('error_active');
              setTimeout(() => {
                this.openCard(data.dublicate[0]);
              }, 2000);
              document.querySelector('.error').addEventListener('click', event => {
                if (event.target.dataset.dublicate === 'openCard'){
                  this.openCard(data.dublicate[0]);
                }
              })
            } else {
              this.openQuestion();
            }
          });
        } else if (event.target.dataset.save === 'no'){
          window.location.reload();
        }
      }
    })
    document.querySelector('.methodical').addEventListener('click', event => {
      if (event.target.dataset.info === 'add'){
        this.openInfo();
      }
    })
    this.handlerPrice();
  }
  handlerPrice(){
    const price = document.querySelector(`INPUT[name='reqPrice']`);
    if (price){
      const overstatePrice = document.querySelector(`INPUT[name='reqOverstatePrice']`);
      price.addEventListener('keyup', () => {
        overstatePrice.value = price.value;
      })
    }
  }
  async sendEditObject(request1Cnamed){
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

    let response = await fetch("https://crm.centralnoe.ru/dealincom/object/reqMaker.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    return await response.json();
  }
  openInfo(){
    let readyString = `https://crm.centralnoe.ru/CDB/object/card/info/add/index.html`;
    BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: 925, });
  }
  openCard(idReq) {
    const typeA = '1c';
    const windowWidth = window.innerWidth * 0.9;
    let readyString = "https://crm.centralnoe.ru/CDB/object/card/cardObject.php?source="+typeA+"&id="+idReq;
    BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: windowWidth, });
    return true;
  }

  openQuestion(){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="module">
                          <div class="module__wrap"> 
                            <p class="module__text">Перейти к объекту</p>
                            <div class="module__buttons">
                              <a href="../object/?source=1c&id=${UID}&IDDEAL=${deal}" data-answer="yes" class="ui-btn ui-btn-danger-light">Да</a>                           
                              <button data-answer="no"  class="ui-btn ui-btn-primary-dark">Нет</button>                           
                            </div>
                          </div>                          
                    </div>`
    document.body.insertAdjacentHTML('beforebegin', layout);
    this.handlerQuestion();
  }
  handlerQuestion(){
    const module = document.querySelector('.module');
    module.addEventListener('click', event => {
      if (event.target.dataset.answer === 'no'){
        this.closeQuestion(module);
      }
    })
  }

  closeQuestion(module){
    const htmlDom = document.querySelector('HTML');
    htmlDom.removeAttribute("style");
    module.remove();
  }

  isValid(allRadio, allInput, allSelect){
    const library = {
      radio: true,
      input: true,
      select: true,
    }
    library.radio = this.isValidRadio(allRadio);
    library.input = this.isValidInput(allInput);
    library.select = this.isValidSelect(allSelect);
    let countTrue = 0;
    for (let key in library){
      if (library[key] === true){
        countTrue++;
      }
    }
    return countTrue === Object.keys(library).length;
  }
  isValidRadio(allRadio){
    const library = {
      reqTypeofRealty: true,
      reqRoomCount: true,
      reqRoomsForSaleCheck: true,
      reqRoomsForSaleMore: true,
    }
    const reqTypeofRealty = [];

    const objectType = [];
    let objectTypeChecked = '';

    const reqRoomCount = [];
    let reqRoomCountChecked = '';

    const reqRoomsForSale = [];
    let reqRoomsForSaleChecked = '';

    for (let radio of allRadio){
      if (radio.classList.contains('reqTypeofRealty')){
        reqTypeofRealty.push(radio);
      } else if (radio.classList.contains('change-obj__input')){
        objectType.push(radio);
        if (radio.checked){
          objectTypeChecked = radio.value;
        }
      } else if (radio.classList.contains('reqRoomCount')){
        reqRoomCount.push(radio);
        if (radio.checked){
          reqRoomCountChecked = radio.value;
        }
      } else if(radio.classList.contains('reqRoomsForSale')){
        reqRoomsForSale.push(radio);
        if (radio.checked) {
          reqRoomsForSaleChecked = radio.value;
        }
      }
    }

    if (objectTypeChecked === 'Квартира'){
        let countCheckType = 0;
        let countCheckRoom = 0;
        for (let item of reqTypeofRealty){
          if (item.checked){
            countCheckType++;
          }
        }
        library.reqTypeofRealty = countCheckType > 0;
        if (library.reqTypeofRealty){
          setValidCheckbox(reqTypeofRealty, 'remove');
        } else {
          setValidCheckbox(reqTypeofRealty, 'add');
        }

        for (let item of reqRoomCount){
          if (item.checked){
            countCheckRoom++;
          }
        }
        library.reqRoomCount = countCheckRoom > 0;
        if (library.reqRoomCount){
          setValidCheckbox(reqRoomCount, 'remove');
        } else {
          setValidCheckbox(reqRoomCount, 'add');
        }

    } else if (objectTypeChecked === 'Комната'){
      let countCheckRoom = 0;
      let countForSale = 0;
      for (let item of reqRoomCount){
        if (item.checked){
          countCheckRoom++;
        }
      }
      library.reqRoomCount = countCheckRoom > 0;
      if (library.reqRoomCount){
        setValidCheckbox(reqRoomCount, 'remove');
      } else {
        setValidCheckbox(reqRoomCount, 'add');
      }
      for (let item of reqRoomsForSale){
        if (item.checked){
          countForSale++;
        }
      }
      library.reqRoomsForSaleCheck = countForSale > 0;
      library.reqRoomsForSaleMore = +reqRoomsForSaleChecked <= +reqRoomCountChecked;
      if (library.reqRoomsForSaleCheck && library.reqRoomsForSaleMore){
        setValidCheckbox(reqRoomsForSale, 'remove');
      } else {
        setValidCheckbox(reqRoomsForSale, 'add');
      }
    } else if (objectTypeChecked === 'Дом'){
      let countCheckRoom = 0;
      for (let item of reqRoomCount){
        if (item.checked){
          countCheckRoom++;
        }
      }
      library.reqRoomCount = countCheckRoom > 0;
      if (library.reqRoomCount){
        setValidCheckbox(reqRoomCount, 'remove');
      } else {
        setValidCheckbox(reqRoomCount, 'add');
      }
    }
    function setValidCheckbox(arr, action){
      for (let item of arr){
        document.querySelector(`label.${item.id}`).classList[action]('isValid')
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

  isValidInput(allInput){
    const library = {
      reqRegion: true,
      reqCity: true,
      reqArea: true,
      reqStreet: true,
      reqHouseNumber: true,
      reqHouseDeveloper: true,
      reqFlat: true,
      reqFlatTotalArea: true,
      reqFlatLivingArea: true,
      reqKitchenArea: true,
      reqFloor: true,
      reqFloorCount: true,
      reqPrice: true,
      reqHouseBuildDate: true,
      lat: true,
      lng: true,
      reqMunicipality: true,
      reqAreaForSell: true,
      reqAreaForSell2: true,
      reqAreaForSell3: true,
      reqShareForSale: true,
      reqShareForAll: true,
      reqOverstatePrice: true,
      reqAdditionalLandmark: true,
    }
    const libraryRegExp = {
      reqRegion: /(.|\s)*\S(.|\s)*/,
      reqCity: /(.|\s)*\S(.|\s)*/,
      reqArea: /^[А-ЯЁа-яё]*$/,
      reqStreet: /(.|\s)*\S(.|\s)*/,
      reqHouseNumber: /^-?\d[\/\dА-ЯЁа-яё]*?$/,
      reqHouseDeveloper: /\.*/,
      reqFlat: /^\d{1,6}$/,
      reqFlatTotalArea: /^\d*\.?\d*?$/,
      reqFlatLivingArea: /^\d*\.?\d*?$/,
      reqKitchenArea: /^\d*\.?\d*?$/,
      reqFloor: /^\d*$/,
      reqFloorCount: /^\d*$/,
      reqPrice: /^\d{1,6}$/,
      reqOverstatePrice: /^\d{1,6}$/,
      reqHouseBuildDate: /(.|\s)*\S(.|\s)*/,
      reqLandArea: /^\d*\.?\d*?$/,
      reqFlatArea: /^\d*\.?\d*?$/,
      lat: /^\d{2}\.\d*$/,
      lng: /^\d{2}\.\d*$/,
      reqMunicipality: /\.*/,
      reqAreaForSell: /^\d*\.?\d*?$/,
      reqAreaForSell2: /^\d*\.?\d*?$/,
      reqAreaForSell3: /^\d*\.?\d*?$/,
      reqShareForSale: /^\d*$/,
      reqShareForAll: /^\d*$/,
      reqAdditionalLandmark: /\.*/,
    }
    for (let item of allInput){
      if (!item.classList.contains('ymaps-2-1-79-searchbox-input__input') && !item.disabled && !item.classList.contains('room__radio')){
        if (item.name === 'reqShareForSale' || item.name === 'reqShareForAll'){
          if (document.querySelector(`INPUT[type=checkbox]`).checked){
            if (item.value.length === 0){
              library[item.name] = false;
              item.classList.add('isValid');
            } else {
              if (libraryRegExp[item.name].test(item.value)){
                library[item.name] = true;
                item.classList.remove('isValid');
              } else {
                library[item.name] = false;
                item.classList.add('isValid');
              }
            }
          }
        } else if (item.name === 'reqHouseBuildDate'){
          const dateValue = new Date(item.value).getFullYear();
          const currentDate = new Date().getFullYear();
          if (+dateValue > +currentDate + 20 || +dateValue < 1900){
            library[item.name] = false;
            item.classList.add('isValid');
          } else {
            library[item.name] = true;
            item.classList.remove('isValid');
          }
        } else {
          if (item.name !== 'reqArea' && item.name !== 'reqHouseDeveloper' && item.name !== 'reqAdditionalLandmark'){
            if (item.value.length === 0){
              library[item.name] = false;
              item.classList.add('isValid');
            } else {
              if (libraryRegExp[item.name].test(item.value)){
                library[item.name] = true;
                item.classList.remove('isValid');
              } else {
                library[item.name] = false;
                item.classList.add('isValid');
              }
            }
          }
        }
      }
    }
    const reqCity = document.querySelector(`INPUT[name='reqCity']`);
    const reqArea = document.querySelector(`INPUT[name='reqArea']`);
    if (reqCity.value === 'Новосибирск' || reqCity.value === 'Кемерово'){
      if (reqArea.value.length === 0){
        library.reqArea = false;
        reqArea.classList.add('isValid');
      } else {
        library.reqArea = true;
      }
    }

    for (let item of this.radioSelect){
      const reqFlatTotalArea = document.querySelector(`INPUT[name='reqFlatTotalArea']`);
      const reqFlatLivingArea = document.querySelector(`INPUT[name='reqFlatLivingArea']`);
      const reqKitchenArea = document.querySelector(`INPUT[name='reqKitchenArea']`);
      const reqFloor = document.querySelector(`INPUT[name='reqFloor']`);
      const reqFloorCount = document.querySelector(`INPUT[name='reqFloorCount']`);
      const reqShareForSale = document.querySelector(`INPUT[name='reqShareForSale']`);
      const reqShareForAll = document.querySelector(`INPUT[name='reqShareForAll']`);
      const reqHouseNumber = document.querySelector(`INPUT[name='reqHouseNumber']`);
      const reqFlat = document.querySelector(`INPUT[name='reqFlat']`);

      if (item.checked){
        if (item.value === 'Квартира'){
          if (+reqFlatTotalArea.value <= +reqFlatLivingArea.value + +reqKitchenArea.value){
            library.reqFlatTotalArea = false;
            reqFlatTotalArea.classList.add('isValid');
          } else {
            library.reqFlatTotalArea = true;
          }

          if(+reqFloor.value > +reqFloorCount.value){
            library.reqFloor = false;
            reqFloor.classList.add('isValid');
          } else {
            library.reqFloor = true;
          }
          if(+reqHouseNumber.value === 0){
            library.reqHouseNumber = false;
            reqHouseNumber.classList.add('isValid');
          }

          if(+reqFlat.value === 0){
            library.reqFlat = false;
            reqFlat.classList.add('isValid');
          }

        } else if (item.value === 'Комната'){
          if (+reqFlatTotalArea.value <= +reqFlatLivingArea.value + +reqKitchenArea.value){
            library.reqFlatTotalArea = false;
            reqFlatTotalArea.classList.add('isValid');
          } else {
            library.reqFlatTotalArea = true;
          }

          if(+reqFloor.value > +reqFloorCount.value){
            library.reqFloor = false;
            reqFloor.classList.add('isValid');
          } else {
            library.reqFloor = true;
          }

          if(+reqHouseNumber.value === 0){
            library.reqHouseNumber = false;
            reqHouseNumber.classList.add('isValid');
          }

          if(+reqFlat.value === 0){
            library.reqFlat = false;
            reqFlat.classList.add('isValid');
          }

          if (!reqShareForSale.disabled && !reqShareForAll.disabled){
            if(+reqShareForAll.value <= +reqShareForSale.value){
              library.reqShareForAll = false;
              reqShareForAll.classList.add('isValid');
            } else {
              library.reqShareForAll = true;
            }
          } else {
            library.reqShareForAll = true;
            reqShareForAll.classList.remove('isValid');
          }
        } else if (item.value === 'Дом'){

          if(+reqHouseNumber.value === 0){
            library.reqHouseNumber = false;
            reqHouseNumber.classList.add('isValid');
          }

          if (+reqFlatTotalArea.value <= +reqFlatLivingArea.value + +reqKitchenArea.value){
            library.reqFlatTotalArea = false;
            reqFlatTotalArea.classList.add('isValid');
          } else {
            library.reqFlatTotalArea = true;
          }

          if (!reqShareForSale.disabled && !reqShareForAll.disabled){
            if(+reqShareForAll.value <= +reqShareForSale.value){
              library.reqShareForAll = false;
              reqShareForAll.classList.add('isValid');
            } else {
              library.reqShareForAll = true;
            }
          } else {
            library.reqShareForAll = true;
            reqShareForAll.classList.remove('isValid');
          }
        } else if (item.value === 'Земельный участок'){

          if(+reqHouseNumber.value === 0){
            library.reqHouseNumber = false;
            reqHouseNumber.classList.add('isValid');
          }

          if (!reqShareForSale.disabled && !reqShareForAll.disabled){
            if(+reqShareForAll.value <= +reqShareForSale.value){
              library.reqShareForAll = false;
              reqShareForAll.classList.add('isValid');
            } else {
              library.reqShareForAll = true;
            }
          } else {
            library.reqShareForAll = true;
            reqShareForAll.classList.remove('isValid');
          }
        } else if (item.value === 'Гараж'){

          if(+reqHouseNumber.value === 0){
            library.reqHouseNumber = false;
            reqHouseNumber.classList.add('isValid');
          }

          if(+reqFloor.value > +reqFloorCount.value){
            library.reqFloor = false;
            reqFloor.classList.add('isValid');
          } else {
            library.reqFloor = true;
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
  isValidSelect(allSelect){
    let library = {
      reqGalleryAvailability: true,
      reqTypeofFlat: true,
      reqTypeofLayout: true,
      reqBathroomType: true,
      reqRepairStatus: true,
      reqMaterial: true,
    }
    for (let select of allSelect){
      let currentDiv = document.querySelector(`DIV.${select.name}`);
      if (currentDiv.innerHTML === 'Выберете'){
        library[currentDiv.id] = false;
        currentDiv.classList.add('isValid');
      } else {
        library[currentDiv.id] = true;
        currentDiv.classList.remove('isValid');
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

  setChange(allInput, allSelect, allRadio){
    for (let radio of allRadio){
      if (radio.checked){
        add.obj[radio.name] = radio.value;
        if (radio.id === 'roomPart'){
          add.obj.reqRoomSellType = 1;
        } else if (radio.id === 'roomFull'){
          add.obj.reqRoomSellType = 0;
        }
      }
    }

    for (let input of allInput){
      if (input.name === 'reqHouseDeveloper'){
        if (input.value.length > 0){
          add.obj.reqHouseDeveloper = add.developerId;
          add.obj.reqContractor = add.developerId;
        }
      } else {
        add.obj[input.name] = input.value;
      }
    }

    for (let select of allSelect){
      let currentDiv = document.querySelector(`DIV.${select.name}`);
      if (currentDiv.innerHTML === 'Выберете'){
        add.obj[currentDiv.id] = null;
      } else {
        add.obj[currentDiv.id] = currentDiv.innerHTML;
      }
    }
    console.log(add.obj)
  }
  setStatusAndModeration(){
    add.obj.reqStatus = document.querySelector('DIV.reqStatus').innerHTML;
    const onMod = document.querySelector('DIV.onModeration').innerHTML;
    if (onMod === 'Да'){
      add.obj.onModeration = '1';
    } else if (onMod === 'Нет'){
      add.obj.onModeration = '0';
    }
  }

  setLoader(){
    const currentY = window.pageYOffset;
    const loader = `<div style="top: ${currentY}px" class="loader"><div class="loader__img"></div><div>`;
    document.body.insertAdjacentHTML('beforeend', loader);
    const htmlDOM = document.querySelector('HTML');
    htmlDOM.setAttribute('style', 'overflow: hidden;');
  }
  removeLoader(){
    document.querySelector('.loader').remove();
    const htmlDOM = document.querySelector('HTML');
    htmlDOM.removeAttribute('style');
  }
}

let storySearch = [];
class Search{
  constructor() {
    this.searchInputAll = document.querySelectorAll(`INPUT[type='search']`);
    this.containerAll = document.querySelectorAll('.search__field');
    this.region = document.querySelector(`INPUT[name='reqRegion']`);
    this.city = document.querySelector(`INPUT[name='reqCity']`);
    this.street = document.querySelector(`INPUT[name='reqStreet']`);
    this.houseNumber = document.querySelector(`INPUT[name='reqHouseNumber']`);
    this.request = true;
  }
  init(){
    this.setInputMap();

    for (let input of this.searchInputAll){
      input.addEventListener('keyup', () =>{
        if (input.value === ''){
          document.querySelector(`.${input.name}__items`).classList.add('isVisible');
        } else if (this.request){
          if (input.name === 'reqRegion'){
            this.getRegion(input.value).then(data => {
              this.request = false;
              this.renderStreet(data, input, 'regionName');
            });
          } else if (input.name === 'reqCity'){
            const region = document.querySelector('.reqRegion').value;
            if (region){
              this.getRegion(region).then(data => {
                this.getCity(input.value, data[0].regionNumber).then(city => {
                  this.renderStreet(city, input, 'cityName');
                });
                this.request = false;
              })
            }
          } else if (input.name === 'reqArea'){
            const city = document.querySelector('.reqCity').value;
            const areaNovosibirsk = [
              {areaName: 'Кировский'},
              {areaName: 'Ленинский'},
              {areaName: 'Советский'},
              {areaName: 'Первомайский'},
              {areaName: 'Дзержинский'},
              {areaName: 'Центральный'},
              {areaName: 'Калининский'},
              {areaName: 'Заельцовский'},
              {areaName: 'Октябрьский'},
              {areaName: 'Железнодорожный'},
            ]
            const areaKemerovo = [
              {areaName: 'Заводский'},
              {areaName: 'Кедровка'},
              {areaName: 'Кировский'},
              {areaName: 'Ленинский'},
              {areaName: 'Рудничный'},
              {areaName: 'Центральный'},
            ]
            if (city && city === 'Новосибирск'){
              const regExp = new RegExp(input.value, 'i');
              let filterArea = areaNovosibirsk.filter(area => regExp.test(area.areaName));
              this.request = false;
              this.renderStreet(filterArea, input, 'areaName');
            } else if (city && city === 'Кемерово'){
              const regExp = new RegExp(input.value, 'i');
              let filterArea = areaKemerovo.filter(area => regExp.test(area.areaName));
              this.request = false;
              this.renderStreet(filterArea, input, 'areaName');
            }
          } else if (input.name === 'reqStreet'){
            this.getStreet(input.value).then(data => {
              this.request = false;
              this.renderStreet(data, input, 'streetName');
            });
          }  else if (input.name === 'reqHouseDeveloper'){
              this.getDeveloper().then(data => {
                const regExp = new RegExp(input.value, 'i');
                let filterArea = data.filter(area => regExp.test(area.name));
                this.request = false;
                this.renderStreet(filterArea, input, 'name');
              });
          }
        }
      })
    }

    for (let box of this.containerAll){
      box.addEventListener('click', event => {
        if (event.target.tagName === 'P'){
          document.querySelector(`.${event.target.dataset.input}`).value = event.target.dataset.value;
          storySearch.push(event.target.dataset.value);
          event.target.parentElement.classList.add('isVisible');
          if (event.target.dataset.input === 'reqCity' || event.target.dataset.input === 'reqStreet'){
            this.getCords(this.region.value, this.city.value, this.street.value, this.houseNumber.value).then(data => {
              if (data.length > 0){
                add.obj.lat = data[0].lat;
                add.obj.lng = data[0].lon;
                document.querySelector(`INPUT[name='lat']`) ? document.querySelector(`INPUT[name='lat']`).value = data[0].lat : '';
                document.querySelector(`INPUT[name='lng']`) ? document.querySelector(`INPUT[name='lng']`).value = data[0].lon : '';
                document.querySelector('#map').innerHTML = '';
                add.initMap(data[0].lat, data[0].lon);
              }
            });
          } else if (event.target.dataset.input === 'reqHouseDeveloper'){
            add.developerId = event.target.dataset.id1c;
            console.log(add)
          }
        }
      })
    }
    this.checkRoomPart();
    this.countRoomForSale();
  }
  async getRegion(value){
    let response = await fetch(`https://crm.centralnoe.ru/dealincom/factory/getRegion.php?req=${value}`);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    return await response.json();
  }
  async getCity(value, number){
    let response = await fetch(`https://crm.centralnoe.ru/dealincom/factory/getCity.php?req=${value}&regionNumber=${number}`);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    return await response.json();
  }
  async getStreet(value){
    let response = await fetch(`https://crm.centralnoe.ru/dealincom/factory/getaddress.php?req=${value}`);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    return await response.json();
  }
  async getDeveloper(){
    const request1Cnamed = {
      action: 'getDevelopers',
    };

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
    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/newbfactory.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    return await response.json();
    // console.log(jsonA)
    // for (let dev of jsonA){
    //   this.developers.push({name: dev.name, inn: dev.inn});
    // }
  }

  setInputMap(){
    // todo рендер: reqHouseNumber на blur reqCity и reqStreet по выбору из списка
    this.houseNumber.addEventListener('blur', () => {
      this.getCords(this.region.value, this.city.value, this.street.value, this.houseNumber.value).then(data => {
        if (data.length > 0){
          add.obj.lat = data[0].lat;
          add.obj.lng = data[0].lon;
          document.querySelector(`INPUT[name='lat']`) ? document.querySelector(`INPUT[name='lat']`).value = data[0].lat : '';
          document.querySelector(`INPUT[name='lng']`) ? document.querySelector(`INPUT[name='lng']`).value = data[0].lon : '';
          document.querySelector('#map').innerHTML = '';
          add.initMap(data[0].lat, data[0].lon);
        }
      });
    })

  }
  async getCords(region, city, street, houseNumber){
    const API = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${region}+${city}+${street}+${houseNumber}&format=json&limit=1`
    const webClient = {
      Headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0",
      "Referer": "crm.centralnoe.ru"
      }
    };

    let response = await fetch(API, webClient);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    return await response.json();
  }

  checkRoomPart(){
    const checkBoxRoom = document.querySelector(`INPUT[type='checkbox']`);
    if (checkBoxRoom){
      checkBoxRoom.addEventListener('change', event => {
        if (event.target.checked){
          document.querySelector('.reqShareForSale').removeAttribute('disabled');
          document.querySelector('.reqShareForAll').removeAttribute('disabled');
        } else {
          document.querySelector('.reqShareForSale').setAttribute('disabled', 'disabled');
          document.querySelector('.reqShareForAll').setAttribute('disabled', 'disabled');
          document.querySelector('.reqShareForSale').value = '';
          document.querySelector('.reqShareForAll').value = '';
        }
      })
    }
  }
  countRoomForSale(){
    const countRoomSale = document.querySelectorAll('.reqRoomsForSale');
    if (countRoomSale.length !== 0) {
      for (let item of countRoomSale){
        item.addEventListener('click', event => {
          for (let item of document.querySelectorAll(`.reqAreaForSell`)){
            item.setAttribute('disabled', 'disabled');
            item.value = '';
          }
          let currentCount = event.target.value;
          for (let i = 0; currentCount > i; currentCount--){
            document.querySelector(`.reqAreaForSell${currentCount}`).removeAttribute('disabled');
          }
        })
      }
    }
  }

  renderStreet(data, input, valueName){
    const container = document.querySelector(`.${input.name}__items`);
    container.innerHTML = '';
    if (data.length === 0){
      container.classList.add('isVisible');
      this.request = true;
    } else {
      if (data.length > 10){
        for (let i = 0; i < 10; i++){
          container.insertAdjacentHTML('beforeend',
            `<p data-id1c="${data[i].Id1C ? data[i].Id1C : ''}" data-value="${data[i][valueName]}" data-input="${input.name}" class="search__item">${data[i][valueName]}</p>`)
        }
      } else if (data.length <= 10 && data.length !== 0){
        for (let item of data){
          container.insertAdjacentHTML('beforeend',
            `<p data-id1c="${item.Id1C ? item.Id1C : ''}" data-value="${item[valueName]}" data-input="${input.name}" class="search__item">${item[valueName]}</p>`)
        }
      }
      container.classList.remove('isVisible');
      this.request = true;
    }
  }
}
document.body.addEventListener('click', event => {
  if (!event.target.classList.contains('search__input') && !event.target.classList.contains('search__field')){
      const containerAll = document.querySelectorAll('.search__field');
      const searchInputAll = document.querySelectorAll('.search__input');
      for (let box of containerAll){
        box.classList.add('isVisible');
      }
      for (let input of searchInputAll){
        if (!storySearch.includes(input.value)){
          input.value = '';
        }
      }
  }
})

function getPartOrFull(){
  if (add.obj.reqShareForSale && add.obj.reqShareForAll){
    return `<div class="form__item form_width room__field"> 
              <div class="room__wrap"> 
                <input name="room" class="room__radio" id="roomPart" type="checkbox" checked>
                <label class="room__label" for="roomPart">Долевая собственность</label>
              </div>
                <span class="form__subtitle">Доля на продажу</span>   
                <input 
                value="${add.obj.reqShareForSale ? add.obj.reqShareForSale : ''}"
                class="form__input reqShareForSale room__input" name="reqShareForSale" type="text">
                <span class="form__subtitle">Доля всего</span>   
                <input 
                value="${add.obj.reqShareForAll ? add.obj.reqShareForAll : ''}"
                class="form__input reqShareForAll room__input" name="reqShareForAll" type="text">
              </div>`
  } else {
    return `<div class="form__item form_width room__field"> 
              <div class="room__wrap"> 
                <input name="room" class="room__radio" id="roomPart" type="checkbox">
                <label class="room__label" for="roomPart">Долевая собственность</label>
              </div>
                <span class="form__subtitle">Доля на продажу</span>   
                <input class="form__input reqShareForSale room__input" name="reqShareForSale" type="text" disabled>
                <span class="form__subtitle">Доля всего</span>   
                <input  class="form__input reqShareForAll room__input" name="reqShareForAll" type="text" disabled>
            </div>`
  }
}

class Float{
  render(){
    return `<div class="buttons"> 
              <input ${add.obj.reqTypeofRealty === 'Квартира' ? 'checked' : ''} 
              class="buttons__input reqTypeofRealty" name="reqTypeofRealty" id="second" type="radio" value="Квартира">
              <label id="reqTypeofRealty" class="buttons__label buttons__label_margin second" for="second">вторичка</label>
              <input ${add.obj.reqTypeofRealty === 'Новостройка (от застройщика)' ? 'checked' : ''} 
              class="buttons__input buttons__input_margin reqTypeofRealty" name="reqTypeofRealty" id="new" type="radio" value="Новостройка (от застройщика)">
              <label id="reqTypeofRealty" class="buttons__label buttons__label_margin new" for="new">новостройка</label>
              <input ${add.obj.reqTypeofRealty === 'Переуступка ДДУ' ? 'checked' : ''} 
              class="buttons__input reqTypeofRealty" name="reqTypeofRealty" id="part" type="radio" value="Переуступка ДДУ">
              <label id="reqTypeofRealty" class="buttons__label part" for="part">переуступка дду</label>
            </div> 
            <div class="place"> 
              <span class="form__title">местоположение<i class="i">*<p class="guid">дополнительный ориентир не обязательно поле. для города Новосибирск и Кемерово - обязательно указание всех реквизитов адреса. Для остальных - Указание района - не требуется.</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Регион</span> 
                <input name="reqRegion" id="reqRegion" class="form__input search__input reqRegion" type="search" value="${add.obj.reqRegion ? add.obj.reqRegion : 'Новосибирская область'}" autocomplete="new-password">
                <div class="reqRegion__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Населенный пункт</span> 
                <input name="reqCity" id="reqCity" class="form__input search__input reqCity" type="search" value="${add.obj.reqCity ? add.obj.reqCity : ''}" autocomplete="new-password">
                <div class="reqCity__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Район</span> 
                <input name="reqArea" id="reqArea" class="form__input search__input reqArea" type="search" value="${add.obj.reqArea ? add.obj.reqArea : ''}" autocomplete="new-password">
                <div class="reqArea__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Улица</span> 
                <input name="reqStreet" id="reqStreet" class="form__input search__input reqStreet" type="search" value="${add.obj.reqStreet ? add.obj.reqStreet : ''}" autocomplete="new-password">                
                <div class="reqStreet__items search__field isVisible"></div>
              </div>              
              <div class="form__item">
                <span class="form__subtitle">Номер дома</span> 
                <input name="reqHouseNumber" id="reqHouseNumber" class="form__input" type="text" value="${add.obj.reqHouseNumber ? add.obj.reqHouseNumber : ''}" autocomplete="new-password">
              </div>
              <div class="form__item">
                <span class="form__subtitle">Дополнительный ориентир</span> 
                <input name="reqAdditionalLandmark" id="reqAdditionalLandmark" class="form__input" type="text" value="${add.obj.reqAdditionalLandmark ? add.obj.reqAdditionalLandmark : ''}" autocomplete="new-password">
              </div>
              <div id="map"></div>   
            </div>          
            <div class="info"> 
              <span class="form__title">информация об объекте недвижимости<i class="i">*<p class="guid">Обязательны к заполнению все поля, кроме Застройщика</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Номер квартиры</span> 
                <input name="reqFlat" id="reqFlat" class="form__input" type="text" value="${add.obj.reqFlat ? add.obj.reqFlat : ''}" autocomplete="new-password">
              </div>
              <div class="form__item">
                <span class="form__subtitle">Площадь m<sup>2</sup> &nbsp (общая/жилая/кухня) <i class="simbol">*</i> разделитель точка</span> 
                <div class="form__item_wrap"> 
                  <input name="reqFlatTotalArea" id="reqFlatTotalArea" class="form__input form__input_width" type="text" placeholder="пример 11.1" 
                  value="${add.obj.reqFlatTotalArea ? add.obj.reqFlatTotalArea : ''}" autocomplete="new-password">
                  <input name="reqFlatLivingArea" id="reqFlatLivingArea" class="form__input form__input_width" type="text" placeholder="жилая" 
                  value="${add.obj.reqFlatLivingArea ? add.obj.reqFlatLivingArea : ''}" autocomplete="new-password">
                  <input name="reqKitchenArea" id="reqKitchenArea" class="form__input form__input_width" type="text" placeholder="кухня" 
                  value="${add.obj.reqKitchenArea ? add.obj.reqKitchenArea : ''}" autocomplete="new-password">
                </div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Количество комнат</span> 
                <div class="form__countRooms"> 
                  <input ${add.obj.reqRoomCount === '1' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="one" type="radio" value="1">
                  <label id="reqRoomCount" class="buttons__label form__countRooms-item one" for="one">1</label>
                  <input ${add.obj.reqRoomCount === '2' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="two" type="radio" value="2">
                  <label id="reqRoomCount" class="buttons__label form__countRooms-item two" for="two">2</label>
                  <input ${add.obj.reqRoomCount === '3' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="three" type="radio" value="3">
                  <label id="reqRoomCount" class="buttons__label form__countRooms-item three" for="three">3</label>
                  <input ${add.obj.reqRoomCount === '4' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="for" type="radio" value="4">
                  <label id="reqRoomCount" class="buttons__label form__countRooms-item for" for="for">4</label>
                  <input ${add.obj.reqRoomCount === '5' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="five" type="radio" value="5">
                  <label id="reqRoomCount" class="buttons__label form__countRooms-item five" for="five">5+</label>
                </div>
              </div>              
              <div class="form__item">
                <span class="form__subtitle">Этаж</span> 
                <div class="form__item_wrap"> 
                  <input name="reqFloor" class="form__input form__input_40" type="text" value="${add.obj.reqFloor ? add.obj.reqFloor : ''}" autocomplete="new-password">
                  <span class="form__from">из</span>
                  <input name="reqFloorCount" class="form__input form__input_40" type="text" value="${add.obj.reqFloorCount ? add.obj.reqFloorCount : ''}" autocomplete="new-password">
                </div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Застройщик</span> 
                <input name="reqHouseDeveloper" class="form__input search__input reqHouseDeveloper" type="search" value="${add.obj.reqHouseDeveloper ? add.obj.reqHouseDeveloper : ''}" autocomplete="new-password">
                <div class="reqHouseDeveloper__items search__field isVisible"></div>
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Балкон/лоджия</span> 
                <select class="reqGalleryAvailability" name="reqGalleryAvailability"> 
                  <option value="empty" ${!add.obj.reqGalleryAvailability ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqGalleryAvailability === '1 балкон' ? 'selected' : ''}>1 балкон</option>
                  <option ${add.obj.reqGalleryAvailability === '1 лоджия' ? 'selected' : ''}>1 лоджия</option>
                  <option ${add.obj.reqGalleryAvailability === '1 балкон 1 лоджия' ? 'selected' : ''}>1 балкон 1 лоджия</option>
                  <option ${add.obj.reqGalleryAvailability === '2 балкона' ? 'selected' : ''}>2 балкона</option>
                  <option ${add.obj.reqGalleryAvailability === '2 лоджии' ? 'selected' : ''}>2 лоджии</option>
                  <option ${add.obj.reqGalleryAvailability === '2 балкона лоджия' ? 'selected' : ''}>2 балкона лоджия</option>
                  <option ${add.obj.reqGalleryAvailability === '2 лоджии балкон' ? 'selected' : ''}>2 лоджии балкон</option>
                  <option ${add.obj.reqGalleryAvailability === '2 балкона 2 лоджии' ? 'selected' : ''}>2 балкона 2 лоджии</option>
                  <option ${add.obj.reqGalleryAvailability === '3 балкона' ? 'selected' : ''}>3 балкона</option>
                  <option ${add.obj.reqGalleryAvailability === '3 лоджии' ? 'selected' : ''}>3 лоджии</option>
                  <option ${add.obj.reqGalleryAvailability === '4 балкона' ? 'selected' : ''}>4 балкона</option>
                  <option ${add.obj.reqGalleryAvailability === '4 лоджии' ? 'selected' : ''}>4 лоджии</option>
                  <option ${add.obj.reqGalleryAvailability === 'Отсутствует' ? 'selected' : ''}>Отсутствует</option>
                  <option ${add.obj.reqGalleryAvailability === 'Не указано' ? 'selected' : ''}>Не указано</option>
                  <option ${add.obj.reqGalleryAvailability === 'Терраса' ? 'selected' : ''}>Терраса</option>
                </select>
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Тип квартиры</span> 
                <select class="reqTypeofFlat" name="reqTypeofFlat"> 
                  <option value="empty" ${!add.obj.reqTypeofFlat ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqTypeofFlat === 'Прочее' ? 'selected' : ''}>Прочее</option>
                  <option ${add.obj.reqTypeofFlat === 'Хрущёвка' ? 'selected' : ''}>Хрущёвка</option>
                  <option ${add.obj.reqTypeofFlat === 'Апартаменты' ? 'selected' : ''}>Апартаменты</option>
                  <option ${add.obj.reqTypeofFlat === 'Улучшенной планировки' ? 'selected' : ''}>Улучшенной планировки</option>
                  <option ${add.obj.reqTypeofFlat === 'Полногабаритная' ? 'selected' : ''}>Полногабаритная</option>
                  <option ${add.obj.reqTypeofFlat === 'Студия' ? 'selected' : ''}>Студия</option>
                  <option ${add.obj.reqTypeofFlat === 'Типовая' ? 'selected' : ''}>Типовая</option>
                  <option ${add.obj.reqTypeofFlat === 'Малоэтажная' ? 'selected' : ''}>Малоэтажная</option>
                  <option ${add.obj.reqTypeofFlat === 'Ленинградка' ? 'selected' : ''}>Ленинградка</option>
                  <option ${add.obj.reqTypeofFlat === 'Коридорного типа' ? 'selected' : ''}>Коридорного типа</option>
                  <option ${add.obj.reqTypeofFlat === 'Малосемейная' ? 'selected' : ''}>Малосемейная</option>
                  <option ${add.obj.reqTypeofFlat === 'Секционная' ? 'selected' : ''}>Секционная</option>
                  <option ${add.obj.reqTypeofFlat === 'Двухуровневая' ? 'selected' : ''}>Двухуровневая</option>
                  <option ${add.obj.reqTypeofFlat === 'Пентхаус' ? 'selected' : ''}>Пентхаус</option>
                  <option ${add.obj.reqTypeofFlat === 'Элитная' ? 'selected' : ''}>Элитная</option>
                  <option ${add.obj.reqTypeofFlat === 'Типовая' ? 'selected' : ''}>Типовая</option>
              </select>           
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Планировка</span>               
                <select class="reqTypeofLayout" name="reqTypeofLayout"> 
                  <option value="empty" ${!add.obj.reqTypeofLayout ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqTypeofLayout === 'Смежные' ? 'selected' : ''}>Смежные</option>
                  <option ${add.obj.reqTypeofLayout === 'Изолированные' ? 'selected' : ''}>Изолированные</option>
                  <option ${add.obj.reqTypeofLayout === 'Смежно-изолированные' ? 'selected' : ''}>Смежно-изолированные</option>
                  <option ${add.obj.reqTypeofLayout === 'Свободная планировка' ? 'selected' : ''}>Свободная планировка</option>
                </select>
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Санузел</span>               
                <select class="reqBathroomType" name="reqBathroomType"> 
                  <option value="empty" ${!add.obj.reqBathroomType ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqBathroomType === 'Неизвестно' ? 'selected' : ''}>Неизвестно</option>
                  <option ${add.obj.reqBathroomType === 'Два' ? 'selected' : ''}>Два</option>
                  <option ${add.obj.reqBathroomType === '2 ванны' ? 'selected' : ''}>2 ванны</option>
                  <option ${add.obj.reqBathroomType === 'Совместный' ? 'selected' : ''}>Совместный</option>
                  <option ${add.obj.reqBathroomType === 'Без удобств' ? 'selected' : ''}>Без удобств</option>
                  <option ${add.obj.reqBathroomType === 'Без ванны' ? 'selected' : ''}>Без ванны</option>
                  <option ${add.obj.reqBathroomType === 'Душ и туалет' ? 'selected' : ''}>Душ и туалет</option>
                  <option ${add.obj.reqBathroomType === 'Cид. ванна' ? 'selected' : ''}>Cид. ванна</option>
                  <option ${add.obj.reqBathroomType === 'Раздельный' ? 'selected' : ''}>Раздельный</option>
                </select>
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Ремонт</span>               
                <select class="reqRepairStatus" name="reqRepairStatus"> 
                  <option value="empty" ${!add.obj.repair ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqRepairStatus === 'Под ключ' ? 'selected' : ''}>Под ключ</option>
                  <option ${add.obj.reqRepairStatus === 'Черновая отделка' ? 'selected' : ''}>Черновая отделка</option>
                  <option ${add.obj.reqRepairStatus === 'Чистовая отделка' ? 'selected' : ''}>Чистовая отделка</option>
                  <option ${add.obj.reqRepairStatus === 'Дизайнерский ремонт' ? 'selected' : ''}>Дизайнерский ремонт</option>
                  <option ${add.obj.reqRepairStatus === 'Улучшенная отделка' ? 'selected' : ''}>Улучшенная отделка</option>
                  <option ${add.obj.reqRepairStatus === 'Стандартная отделка' ? 'selected' : ''}>Стандартная отделка</option>
                  <option ${add.obj.reqRepairStatus === 'Бабушкино' ? 'selected' : ''}>Бабушкино</option>
                  <option ${add.obj.reqRepairStatus === 'Требует ремонта' ? 'selected' : ''}>Требует ремонта</option>
                  <option ${add.obj.reqRepairStatus === 'Без отделки' ? 'selected' : ''}>Без отделки</option>
                </select>
              </div>
            </div> 
            <div class="price"> 
              <span class="form__title">цена<i class="i">*<p class="guid">При указании "цены в рекламу" отличной от основной, на рекламных площадках N1, CIAN, Domclick будет выгружена "цена в рекламу"</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Цена, тыс руб.</span> 
                <input name="reqPrice" id="reqPrice" class="form__input" type="text" value="${add.obj.reqPrice ? add.obj.reqPrice : ''}" autocomplete="new-password">
              </div> 
              <div class="form__item">
                <span class="form__subtitle">Цена в рекламу, тыс руб.</span> 
                <input name="reqOverstatePrice" id="reqOverstatePrice" class="form__input" type="text" 
                value="${add.obj.reqOverstatePrice ? add.obj.reqOverstatePrice : ''}" 
                autocomplete="new-password">
              </div>
            </div>
            <div class="infoHouse"> 
              <span class="form__title">информация о доме<i class="i">*<p class="guid">все поля обязательны для заполнения</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Год постройки</span> 
                <input name="reqHouseBuildDate" class="form__input" type="date" id="reqHouseBuildDate"
                value="${add.obj.reqHouseBuildDate ? add.obj.reqHouseBuildDate.split('.').reverse().join('-') : ''}">
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Материал дома</span>               
                <select class="reqMaterial" name="reqMaterial"> 
                  <option value="empty" ${!add.obj.reqMaterial ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqMaterial === 'Кирпич' ? 'selected' : ''}>Кирпич</option>
                  <option ${add.obj.reqMaterial === 'Панель' ? 'selected' : ''}>Панель</option>
                  <option ${add.obj.reqMaterial === 'Шлакоблоки' ? 'selected' : ''}>Шлакоблоки</option>
                  <option ${add.obj.reqMaterial === 'Дерево' ? 'selected' : ''}>Дерево</option>
                  <option ${add.obj.reqMaterial === 'Монолит' ? 'selected' : ''}>Монолит</option>
                  <option ${add.obj.reqMaterial === 'Сибит' ? 'selected' : ''}>Сибит</option>
                  <option ${add.obj.reqMaterial === 'Каркасно-засыпной' ? 'selected' : ''}>Каркасно-засыпной</option>
                  <option ${add.obj.reqMaterial === 'Металло-каркассный' ? 'selected' : ''}>Металло-каркассный</option>
                  <option ${add.obj.reqMaterial === 'Кирпично-каркасный' ? 'selected' : ''}>Кирпично-каркасный</option>
                  <option ${add.obj.reqMaterial === 'Камень' ? 'selected' : ''}>Камень</option>
                  <option ${add.obj.reqMaterial === 'Не указано' ? 'selected' : ''}>Не указано</option>
                </select>
              </div>
            </div> 
            <div class="comment"> 
              <span class="form__title">Комментарии<i class="i">*<p class="guid">Обязательно к заполнению. Внимание! Комментарий должен быть "продающим". Запрещено описывать с использованием обилия восклицательных знаков и с использованием CAPS LOCK.</p></i></span>
              <textarea class="comment__input" name="reqComment" cols="30" rows="10">${add.obj.reqComment ? add.obj.reqComment : ''}</textarea>
            </div>
            <div class="buttons-footer"> 
              <button ${add.obj.onModeration === '1' ? 'disabled' : ''} class="buttons-footer__item 
                ${add.obj.onModeration === '1' ? 'buttons-footer__item_disabled' : ''}" type="submit">
                ${add.obj.onModeration === '1' ? 'Объект на модерации' : 'Сохранить'}
              </button>
              <button class="buttons-footer__item" type="reset">отменить</button>
            </div>`
  }
}
class Room{
  render(){
    const partOrFull = getPartOrFull();
    return `<div class="place"> 
              <span class="form__title">местоположение<i class="i">*<p class="guid">дополнительный ориентир не обязательно поле. для города Новосибирск и Кемерово - обязательно указание всех реквизитов адреса. Для остальных - Указание района - не требуется</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Регион</span> 
                <input name="reqRegion" class="form__input search__input reqRegion" type="search" value="${add.obj.reqRegion ? add.obj.reqRegion : 'Новосибирская область'}" autocomplete="new-password">
                <div class="reqRegion__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Населенный пункт</span> 
                <input name="reqCity" class="form__input search__input reqCity" type="search" value="${add.obj.reqCity ? add.obj.reqCity : ''}" autocomplete="new-password">
                <div class="reqCity__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Район</span> 
                <input name="reqArea" class="form__input search__input reqArea" type="search" value="${add.obj.reqArea ? add.obj.reqArea : ''}" autocomplete="new-password">
                <div class="reqArea__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Улица</span> 
                <input name="reqStreet" class="form__input search__input reqStreet" type="search" value="${add.obj.reqStreet ? add.obj.reqStreet : ''}" autocomplete="new-password">                
                <div class="reqStreet__items search__field isVisible"></div>
              </div>              
              <div class="form__item">
                <span class="form__subtitle">Номер дома</span> 
                <input name="reqHouseNumber" class="form__input" type="text" value="${add.obj.reqHouseNumber ? add.obj.reqHouseNumber : ''}" autocomplete="new-password">
              </div>                  
              <div class="form__item">
                <span class="form__subtitle">Дополнительный ориентир</span> 
                <input name="reqAdditionalLandmark" id="reqAdditionalLandmark" class="form__input" type="text" value="${add.obj.reqAdditionalLandmark ? add.obj.reqAdditionalLandmark : ''}" autocomplete="new-password">
              </div>          
              <div id="map"></div>  
            </div>                 
            <div class="info"> 
              <span class="form__title">информация об объекте недвижимости<i class="i">*<p class="guid">все поля обязательны для заполнения. При заполнении ОБЯЗАТЕЛЬНО укажите площадь каждой комнаты на продажу, в соответствующих полях. В случае если комната не является объектом, укажите Долю на продажу и общую долю в помещении.</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Номер квартиры</span> 
                <input name="reqFlat" class="form__input" type="text" value="${add.obj.reqFlat ? add.obj.reqFlat : ''}">
              </div>
              <div class="form__item">
                <span class="form__subtitle">Площадь m<sup>2</sup> &nbsp (общая/жилая/кухня) <i class="simbol">*</i> Разделитель точка</span> 
                <div class="form__item_wrap"> 
                  <input name="reqFlatTotalArea" class="form__input form__input_width" type="text" placeholder="пример 11.1" 
                  value="${add.obj.reqFlatTotalArea ? add.obj.reqFlatTotalArea : ''}">
                  <input name="reqFlatLivingArea" class="form__input form__input_width" type="text" placeholder="жилая" 
                  value="${add.obj.reqFlatLivingArea ? add.obj.reqFlatLivingArea : ''}">
                  <input name="reqKitchenArea" class="form__input form__input_width" type="text" placeholder="кухня" 
                  value="${add.obj.reqKitchenArea ? add.obj.reqKitchenArea : ''}">
                </div>
              </div>
              <div class="form__item form_width">
                <span class="form__subtitle">Количество комнат в квартире</span> 
                <div class="form__countRooms"> 
                  <input ${add.obj.reqRoomCount === '1' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="oneAll" type="radio" value="1">
                  <label class="buttons__label form__countRooms-item oneAll" for="oneAll">1</label>
                  <input ${add.obj.reqRoomCount === '2' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="twoAll" type="radio" value="2">
                  <label class="buttons__label form__countRooms-item twoAll" for="twoAll">2</label>
                  <input ${add.obj.reqRoomCount === '3' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="threeAll" type="radio" value="3">
                  <label class="buttons__label form__countRooms-item threeAll" for="threeAll">3</label>
                  <input ${add.obj.reqRoomCount === '4' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="forAll" type="radio" value="4">
                  <label class="buttons__label form__countRooms-item forAll" for="forAll">4</label>
                  <input ${add.obj.reqRoomCount === '5' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="fiveAll" type="radio" value="5">
                  <label class="buttons__label form__countRooms-item fiveAll" for="fiveAll">5+</label>
                </div>
              </div>  
              <div class="form__item form_width">
                <span class="form__subtitle">Количество комнат на продажу и их площадь <i class="simbol">*</i> Разделитель точка</span> 
                <div class="form__countRooms"> 
                  <div class="form__countRooms-wrap">
                    <input ${add.obj.reqRoomsForSale === '1' ? 'checked' : ''} 
                    class="buttons__input reqRoomsForSale" name="reqRoomsForSale" id="oneSale" type="radio" value="1">
                    <label class="buttons__label buttons__label_border form__countRooms-item oneSale" for="oneSale">1</label>
                    <input class="form__input reqAreaForSell reqAreaForSell1" name="reqAreaForSell" type="text"
                    ${add.obj.reqRoomsForSale === '1' ||  add.obj.reqRoomsForSale === '2' ||  add.obj.reqRoomsForSale === '3'? '' : 'disabled'} 
                    value="${add.obj.reqAreaForSell ? add.obj.reqAreaForSell : ''}" placeholder="площадь комнаты 1">
                  </div>
                  <div class="form__countRooms-wrap">
                    <input ${add.obj.reqRoomsForSale === '2' ? 'checked' : ''} 
                    class="buttons__input reqRoomsForSale" name="reqRoomsForSale" id="twoSale" type="radio" value="2">
                    <label class="buttons__label buttons__label_border form__countRooms-item twoSale" for="twoSale">2</label>
                    <input class="form__input reqAreaForSell reqAreaForSell2" name="reqAreaForSell2" type="text"
                    ${add.obj.reqRoomsForSale === '2' ||  add.obj.reqRoomsForSale === '3'? '' : 'disabled'} 
                    value="${add.obj.reqAreaForSell2 ? add.obj.reqAreaForSell2 : ''}" placeholder="площадь комнаты 2">
                  </div>
                  <div class="form__countRooms-wrap">
                    <input ${add.obj.reqRoomsForSale === '3' ? 'checked' : ''} 
                    class="buttons__input reqRoomsForSale" name="reqRoomsForSale" id="threeSale" type="radio" value="3">
                    <label class="buttons__label buttons__label_border form__countRooms-item threeSale" for="threeSale">3</label>
                    <input class="form__input reqAreaForSell reqAreaForSell3" name="reqAreaForSell3" type="text"
                    ${add.obj.reqRoomsForSale === '3'? '' : 'disabled'} 
                    value="${add.obj.reqAreaForSell3 ? add.obj.reqAreaForSell3 : ''}" placeholder="площадь комнаты 3">
                  </div>
                </div>
              </div>   
              ${partOrFull}                
              <div class="form__item">
                <span class="form__subtitle">Этаж</span> 
                <div class="form__item_wrap"> 
                  <input name="reqFloor" class="form__input form__input_40" type="text" value="${add.obj.reqFloor ? add.obj.reqFloor : ''}">
                  <span class="form__from">из</span>
                  <input name="reqFloorCount" class="form__input form__input_40" type="text" value="${add.obj.reqFloorCount ? add.obj.reqFloorCount : ''}">
                </div>
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Тип квартиры</span> 
                <select class="reqTypeofFlat" name="reqTypeofFlat"> 
                  <option value="empty" ${!add.obj.reqTypeofFlat ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqTypeofFlat === 'Прочее' ? 'selected' : ''}>Прочее</option>
                  <option ${add.obj.reqTypeofFlat === 'Хрущёвка' ? 'selected' : ''}>Хрущёвка</option>
                  <option ${add.obj.reqTypeofFlat === 'Апартаменты' ? 'selected' : ''}>Апартаменты</option>
                  <option ${add.obj.reqTypeofFlat === 'Улучшенной планировки' ? 'selected' : ''}>Улучшенной планировки</option>
                  <option ${add.obj.reqTypeofFlat === 'Полногабаритная' ? 'selected' : ''}>Полногабаритная</option>
                  <option ${add.obj.reqTypeofFlat === 'Студия' ? 'selected' : ''}>Студия</option>
                  <option ${add.obj.reqTypeofFlat === 'Типовая' ? 'selected' : ''}>Типовая</option>
                  <option ${add.obj.reqTypeofFlat === 'Малоэтажная' ? 'selected' : ''}>Малоэтажная</option>
                  <option ${add.obj.reqTypeofFlat === 'Ленинградка' ? 'selected' : ''}>Ленинградка</option>
                  <option ${add.obj.reqTypeofFlat === 'Коридорного типа' ? 'selected' : ''}>Коридорного типа</option>
                  <option ${add.obj.reqTypeofFlat === 'Малосемейная' ? 'selected' : ''}>Малосемейная</option>
                  <option ${add.obj.reqTypeofFlat === 'Секционная' ? 'selected' : ''}>Секционная</option>
                  <option ${add.obj.reqTypeofFlat === 'Двухуровневая' ? 'selected' : ''}></option>
                  <option ${add.obj.reqTypeofFlat === 'Пентхаус' ? 'selected' : ''}>Пентхаус</option>
                  <option ${add.obj.reqTypeofFlat === 'Элитная' ? 'selected' : ''}>Элитная</option>
                  <option ${add.obj.reqTypeofFlat === 'Типовая' ? 'selected' : ''}>Типовая</option>
              </select>         
              </div>  
              <div class="form__item"> 
                <span class="form__subtitle">Планировка</span>               
                <select class="reqTypeofLayout" name="reqTypeofLayout"> 
                  <option value="empty" ${!add.obj.reqTypeofLayout ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqTypeofLayout === 'Смежные' ? 'selected' : ''}>Смежные</option>
                  <option ${add.obj.reqTypeofLayout === 'Изолированные' ? 'selected' : ''}>Изолированные</option>
                  <option ${add.obj.reqTypeofLayout === 'Смежно-изолированные' ? 'selected' : ''}>Смежно-изолированные</option>
                  <option ${add.obj.reqTypeofLayout === 'Свободная планировка' ? 'selected' : ''}>Свободная планировка</option>
                </select>
              </div>            
              <div class="form__item"> 
                <span class="form__subtitle">Балкон/лоджия</span> 
                <select class="reqGalleryAvailability" name="reqGalleryAvailability"> 
                  <option value="empty" ${!add.obj.reqGalleryAvailability ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqGalleryAvailability === '1 балкон' ? 'selected' : ''}>1 балкон</option>
                  <option ${add.obj.reqGalleryAvailability === '1 лоджия' ? 'selected' : ''}>1 лоджия</option>
                  <option ${add.obj.reqGalleryAvailability === '1 балкон 1 лоджия' ? 'selected' : ''}>1 балкон 1 лоджия</option>
                  <option ${add.obj.reqGalleryAvailability === '2 балкона' ? 'selected' : ''}>2 балкона</option>
                  <option ${add.obj.reqGalleryAvailability === '2 лоджии' ? 'selected' : ''}>2 лоджии</option>
                  <option ${add.obj.reqGalleryAvailability === '2 балкона лоджия' ? 'selected' : ''}>2 балкона лоджия</option>
                  <option ${add.obj.reqGalleryAvailability === '2 лоджии балкон' ? 'selected' : ''}>2 лоджии балкон</option>
                  <option ${add.obj.reqGalleryAvailability === '2 балкона 2 лоджии' ? 'selected' : ''}>2 балкона 2 лоджии</option>
                  <option ${add.obj.reqGalleryAvailability === '3 балкона' ? 'selected' : ''}>3 балкона</option>
                  <option ${add.obj.reqGalleryAvailability === '3 лоджии' ? 'selected' : ''}>3 лоджии</option>
                  <option ${add.obj.reqGalleryAvailability === '4 балкона' ? 'selected' : ''}>4 балкона</option>
                  <option ${add.obj.reqGalleryAvailability === '4 лоджии' ? 'selected' : ''}>4 лоджии</option>
                  <option ${add.obj.reqGalleryAvailability === 'Отсутствует' ? 'selected' : ''}>Отсутствует</option>
                  <option ${add.obj.reqGalleryAvailability === 'Не указано' ? 'selected' : ''}>Не указано</option>
                  <option ${add.obj.reqGalleryAvailability === 'Терраса' ? 'selected' : ''}>Терраса</option>
                </select>
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Санузел</span>               
                <select class="reqBathroomType" name="reqBathroomType"> 
                  <option value="empty" ${!add.obj.reqBathroomType ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqBathroomType === 'Неизвестно' ? 'selected' : ''}>Неизвестно</option>
                  <option ${add.obj.reqBathroomType === 'Два' ? 'selected' : ''}>Два</option>
                  <option ${add.obj.reqBathroomType === '2 ванны' ? 'selected' : ''}>2 ванны</option>
                  <option ${add.obj.reqBathroomType === 'Совместный' ? 'selected' : ''}>Совместный</option>
                  <option ${add.obj.reqBathroomType === 'Без удобств' ? 'selected' : ''}>Без удобств</option>
                  <option ${add.obj.reqBathroomType === 'Без ванны' ? 'selected' : ''}>Без ванны</option>
                  <option ${add.obj.reqBathroomType === 'Душ и туалет' ? 'selected' : ''}>Душ и туалет</option>
                  <option ${add.obj.reqBathroomType === 'Cид. ванна' ? 'selected' : ''}>Cид. ванна</option>
                  <option ${add.obj.reqBathroomType === 'Раздельный' ? 'selected' : ''}>Раздельный</option>
                </select>
              </div>
            </div> 
            <div class="price"> 
              <span class="form__title">цена<i class="i">*<p class="guid">При указании "цены в рекламу" отличной от основной, на рекламных площадках N1, CIAN, Domclick будет выгружена "цена в рекламу"</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Цена, тыс руб.</span> 
                <input name="reqPrice" class="form__input" type="text" value="${add.obj.reqPrice ? add.obj.reqPrice : ''}">
              </div>
              <div class="form__item">
                <span class="form__subtitle">Цена в рекламу, тыс руб.</span> 
                <input name="reqOverstatePrice" id="reqOverstatePrice" class="form__input" type="text" 
                value="${add.obj.reqOverstatePrice ? add.obj.reqOverstatePrice : ''}" 
                autocomplete="new-password">
              </div>
            </div>
            <div class="infoHouse"> 
              <span class="form__title">информация о доме<i class="i">*<p class="guid">все поля обязательны для заполнения</p></i></span>
              <div class="form__item"> 
                <span class="form__subtitle">Тип дома</span> 
                <select class="reqHouseType" name="reqHouseType"> 
                  <option value="empty" ${!add.obj.reqHouseType ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqHouseType === 'Прочее' ? 'selected' : ''}>Дача</option>
                  <option ${add.obj.reqHouseType === 'Хрущёвка' ? 'selected' : ''}>Дом</option>
                  <option ${add.obj.reqHouseType === 'Апартаменты' ? 'selected' : ''}>Квартира на земле</option>
                  <option ${add.obj.reqHouseType === 'Улучшенной планировки' ? 'selected' : ''}>Коттедж</option>
                  <option ${add.obj.reqHouseType === 'Полногабаритная' ? 'selected' : ''}>Многоквартирный дом</option>
                  <option ${add.obj.reqHouseType === 'Студия' ? 'selected' : ''}>Незавершенный объект</option>
                  <option ${add.obj.reqHouseType === 'Типовая' ? 'selected' : ''}>Общежитие</option>
                  <option ${add.obj.reqHouseType === 'Малоэтажная' ? 'selected' : ''}>Таунхаус</option>
                  <option ${add.obj.reqHouseType === 'Ленинградка' ? 'selected' : ''}>Часть дома</option>
              </select>         
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Материал дома</span>               
                <select class="reqMaterial" name="reqMaterial"> 
                  <option value="empty" ${!add.obj.reqMaterial ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqMaterial === 'Кирпич' ? 'selected' : ''}>Кирпич</option>
                  <option ${add.obj.reqMaterial === 'Панель' ? 'selected' : ''}>Панель</option>
                  <option ${add.obj.reqMaterial === 'Шлакоблоки' ? 'selected' : ''}>Шлакоблоки</option>
                  <option ${add.obj.reqMaterial === 'Дерево' ? 'selected' : ''}>Дерево</option>
                  <option ${add.obj.reqMaterial === 'Монолит' ? 'selected' : ''}>Монолит</option>
                  <option ${add.obj.reqMaterial === 'Сибит' ? 'selected' : ''}>Сибит</option>
                  <option ${add.obj.reqMaterial === 'Каркасно-засыпной' ? 'selected' : ''}>Каркасно-засыпной</option>
                  <option ${add.obj.reqMaterial === 'Металло-каркассный' ? 'selected' : ''}>Металло-каркассный</option>
                  <option ${add.obj.reqMaterial === 'Кирпично-каркасный' ? 'selected' : ''}>Кирпично-каркасный</option>
                  <option ${add.obj.reqMaterial === 'Камень' ? 'selected' : ''}>Камень</option>
                  <option ${add.obj.reqMaterial === 'Не указано' ? 'selected' : ''}>Не указано</option>
                </select>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Год постройки</span> 
                <input name="reqHouseBuildDate" class="form__input" type="date" 
                value="${add.obj.reqHouseBuildDate ? add.obj.reqHouseBuildDate.split('.').reverse().join('-') : ''}">
              </div>
            </div>     
            <div class="comment"> 
              <span class="form__title">Комментарии<i class="i">*<p class="guid">Обязательно к заполнению. Внимание! Комментарий должен быть "продающим". Запрещено описывать с использованием обилия восклицательных знаков и с использованием CAPS LOCK.</p></i></span>
              <textarea class="comment__input" name="reqComment" cols="30" rows="10">${add.obj.reqComment ? add.obj.reqComment : ''}</textarea>
            </div>       
            <div class="buttons-footer"> 
              <button ${add.obj.onModeration === '1' ? 'disabled' : ''} class="buttons-footer__item 
                ${add.obj.onModeration === '1' ? 'buttons-footer__item_disabled' : ''}" type="submit">
                ${add.obj.onModeration === '1' ? 'Объект на модерации' : 'Сохранить'}
              </button>
              <button class="buttons-footer__item" type="reset">отменить</button>
            </div>`
  }
}
class House{
  render(){
    const partOrFull = getPartOrFull();
    return `<div class="place"> 
              <span class="form__title">местоположение<i class="i">*<p class="guid">дополнительный ориентир не обязательно поле. для города Новосибирск и Кемерово - обязательно указание всех реквизитов адреса. Для остальных - Указание района - не требуется</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Регион</span> 
                <input name="reqRegion" class="form__input search__input reqRegion" type="search" value="${add.obj.reqRegion ? add.obj.reqRegion : 'Новосибирская область'}" autocomplete="new-password">
                <div class="reqRegion__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Населенный пункт</span> 
                <input name="reqCity" class="form__input search__input reqCity" type="search" value="${add.obj.reqCity ? add.obj.reqCity : ''}" autocomplete="new-password">
                <div class="reqCity__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Район</span> 
                <input name="reqArea" class="form__input search__input reqArea" type="search" value="${add.obj.reqArea ? add.obj.reqArea : ''}" autocomplete="new-password">
                <div class="reqArea__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Улица</span> 
                <input name="reqStreet" class="form__input search__input reqStreet" type="search" value="${add.obj.reqStreet ? add.obj.reqStreet : ''}" autocomplete="new-password">                
                <div class="reqStreet__items search__field isVisible"></div>
              </div>              
              <div class="form__item">
                <span class="form__subtitle">Номер дома</span> 
                <input name="reqHouseNumber" class="form__input" type="text" value="${add.obj.reqHouseNumber ? add.obj.reqHouseNumber : ''}" autocomplete="new-password">
              </div>              
              <div class="form__item">
                <span class="form__subtitle">Дополнительный ориентир</span> 
                <input name="reqAdditionalLandmark" id="reqAdditionalLandmark" class="form__input" type="text" value="${add.obj.reqAdditionalLandmark ? add.obj.reqAdditionalLandmark : ''}" autocomplete="new-password">
              </div>
              <div class="form__item">
                <span class="form__subtitle">Координаты X</span> 
                <input name="lat" class="form__input" type="text" value="${add.obj.lat ? add.obj.lat : ''}" autocomplete="new-password">
              </div>
              <div class="form__item">
                <span class="form__subtitle">Координаты Y</span> 
                <input name="lng" class="form__input" type="text" value="${add.obj.lng ? add.obj.lng : ''}" autocomplete="new-password">
              </div>
              <div id="map"></div>
            </div>           
            <div class="info"> 
              <span class="form__title">информация об объекте недвижимости<i class="i">*<p class="guid">все поля обязательны для заполнения. Если на продажу выставляется часть дома, укажите долю на продажу и долю всего.</p></i></span>
              <div class="form__item">
                 <span class="form__subtitle">Площадь участка (в сотках) <i class="simbol">*</i> Разделитель точка</span> 
                <input name="reqLandArea" class="form__input" type="text" value="${add.obj.reqLandArea ? add.obj.reqLandArea : ''}">
              </div>
              <div class="form__item">
                <span class="form__subtitle">Площадь дома m<sup>2</sup> &nbsp;<i class="simbol">*</i> Разделитель точка</span> 
                <input name="reqFlatTotalArea" class="form__input" type="text" value="${add.obj.reqFlatTotalArea ? add.obj.reqFlatTotalArea : ''}" placeholder="пример 11.1">
              </div>     
              <div class="form__item">
                 <span class="form__subtitle">Этажность</span> 
                <input name="reqFloorCount" class="form__input" type="text" value="${add.obj.reqFloorCount ? add.obj.reqFloorCount : ''}">
              </div>  
              <div class="form__item">
                <span class="form__subtitle">Площадь m<sup>2</sup> &nbsp (жилая/кухня) <i class="simbol">*</i> Разделитель точка</span> 
                <div class="form__item_wrap">
                  <input name="reqFlatLivingArea" class="form__input form__input_50" type="text" placeholder="жилая" 
                  value="${add.obj.reqFlatLivingArea ? add.obj.reqFlatLivingArea : ''}" autocomplete="new-password">
                  <input name="reqKitchenArea" class="form__input form__input_50" type="text" placeholder="кухня" 
                  value="${add.obj.reqKitchenArea ? add.obj.reqKitchenArea : ''}" autocomplete="new-password">
                </div>
              </div> 
              <div class="form__item form_width">
                <span class="form__subtitle">Количество комнат в доме</span> 
                <div class="form__countRooms"> 
                  <input ${add.obj.reqRoomCount === '1' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="oneAll" type="radio" value="1">
                  <label class="buttons__label form__countRooms-item oneAll" for="oneAll">1</label>
                  <input ${add.obj.reqRoomCount === '2' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="twoAll" type="radio" value="2">
                  <label class="buttons__label form__countRooms-item twoAll" for="twoAll">2</label>
                  <input ${add.obj.reqRoomCount === '3' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="threeAll" type="radio" value="3">
                  <label class="buttons__label form__countRooms-item threeAll" for="threeAll">3</label>
                  <input ${add.obj.reqRoomCount === '4' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="forAll" type="radio" value="4">
                  <label class="buttons__label form__countRooms-item forAll" for="forAll">4</label>
                  <input ${add.obj.reqRoomCount === '5' ? 'checked' : ''} 
                  class="buttons__input reqRoomCount" name="reqRoomCount" id="fiveAll" type="radio" value="5">
                  <label class="buttons__label form__countRooms-item fiveAll" for="fiveAll">5+</label>
                </div>
              </div>               
              ${partOrFull}
              <div class="form__item"> 
                <span class="form__subtitle">Тип дома</span> 
                <select class="reqHouseType" name="reqHouseType"> 
                  <option value="empty" ${!add.obj.reqHouseType ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqHouseType === 'Прочее' ? 'selected' : ''}>Дача</option>
                  <option ${add.obj.reqHouseType === 'Хрущёвка' ? 'selected' : ''}>Дом</option>
                  <option ${add.obj.reqHouseType === 'Апартаменты' ? 'selected' : ''}>Квартира на земле</option>
                  <option ${add.obj.reqHouseType === 'Улучшенной планировки' ? 'selected' : ''}>Коттедж</option>
                  <option ${add.obj.reqHouseType === 'Полногабаритная' ? 'selected' : ''}>Многоквартирный дом</option>
                  <option ${add.obj.reqHouseType === 'Студия' ? 'selected' : ''}>Незавершенный объект</option>
                  <option ${add.obj.reqHouseType === 'Типовая' ? 'selected' : ''}>Общежитие</option>
                  <option ${add.obj.reqHouseType === 'Малоэтажная' ? 'selected' : ''}>Таунхаус</option>
                  <option ${add.obj.reqHouseType === 'Ленинградка' ? 'selected' : ''}>Часть дома</option>
                  </select>         
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Балкон/лоджия</span> 
                <select class="reqGalleryAvailability" name="reqGalleryAvailability"> 
                  <option value="empty" ${!add.obj.reqGalleryAvailability ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqGalleryAvailability === '1 балкон' ? 'selected' : ''}>1 балкон</option>
                  <option ${add.obj.reqGalleryAvailability === '1 лоджия' ? 'selected' : ''}>1 лоджия</option>
                  <option ${add.obj.reqGalleryAvailability === '1 балкон 1 лоджия' ? 'selected' : ''}>1 балкон 1 лоджия</option>
                  <option ${add.obj.reqGalleryAvailability === '2 балкона' ? 'selected' : ''}>2 балкона</option>
                  <option ${add.obj.reqGalleryAvailability === '2 лоджии' ? 'selected' : ''}>2 лоджии</option>
                  <option ${add.obj.reqGalleryAvailability === '2 балкона лоджия' ? 'selected' : ''}>2 балкона лоджия</option>
                  <option ${add.obj.reqGalleryAvailability === '2 лоджии балкон' ? 'selected' : ''}>2 лоджии балкон</option>
                  <option ${add.obj.reqGalleryAvailability === '2 балкона 2 лоджии' ? 'selected' : ''}>2 балкона 2 лоджии</option>
                  <option ${add.obj.reqGalleryAvailability === '3 балкона' ? 'selected' : ''}>3 балкона</option>
                  <option ${add.obj.reqGalleryAvailability === '3 лоджии' ? 'selected' : ''}>3 лоджии</option>
                  <option ${add.obj.reqGalleryAvailability === '4 балкона' ? 'selected' : ''}>4 балкона</option>
                  <option ${add.obj.reqGalleryAvailability === '4 лоджии' ? 'selected' : ''}>4 лоджии</option>
                  <option ${add.obj.reqGalleryAvailability === 'Отсутствует' ? 'selected' : ''}>Отсутствует</option>
                  <option ${add.obj.reqGalleryAvailability === 'Не указано' ? 'selected' : ''}>Не указано</option>
                  <option ${add.obj.reqGalleryAvailability === 'Терраса' ? 'selected' : ''}>Терраса</option>
                </select>
              </div>          
              <div class="form__item"> 
                <span class="form__subtitle">Санузел</span>               
                <select class="reqBathroomType" name="reqBathroomType"> 
                  <option value="empty" ${!add.obj.reqBathroomType ? 'selected' : ''}>Выберете</option>
                  <option value="Неизвестно" ${add.obj.reqBathroomType === 'Неизвестно' ? 'selected' : ''}>Неизвестно</option>
                  <option value="Два" ${add.obj.reqBathroomType === 'Два' ? 'selected' : ''}>Два</option>
                  <option value="2 ванны" ${add.obj.reqBathroomType === '2 ванны' ? 'selected' : ''}>2 ванны</option>
                  <option value="Совместный" ${add.obj.reqBathroomType === 'Совместный' ? 'selected' : ''}>Совместный</option>
                  <option value="Без удобств" ${add.obj.reqBathroomType === 'Без удобств' ? 'selected' : ''}>Без удобств</option>
                  <option value="Без ванны" ${add.obj.reqBathroomType === 'Без ванны' ? 'selected' : ''}>Без ванны</option>
                  <option value="Душ и туалет" ${add.obj.reqBathroomType === 'Душ и туалет' ? 'selected' : ''}>Душ и туалет</option>
                  <option value="Cид. ванна" ${add.obj.reqBathroomType === 'Cид. ванна' ? 'selected' : ''}>Cид. ванна</option>
                  <option value="Раздельный" ${add.obj.reqBathroomType === 'Раздельный' ? 'selected' : ''}>Раздельный</option>
                </select>
              </div>               
              <div class="form__item"> 
                <span class="form__subtitle">Кровля</span>               
                <select id="reqHouseRoof" class="reqHouseRoof" name="reqHouseRoof"> 
                  <option value="empty" ${!add.obj.reqHouseRoof ? 'selected' : ''}>Выберете</option>
                  <option value="Железо" ${add.obj.reqHouseRoof === 'Железо' ? 'selected' : ''}>Железо</option>
                  <option value="Шифер" ${add.obj.reqHouseRoof === 'Шифер' ? 'selected' : ''}>Шифер</option>
                  <option value="Ондулин" ${add.obj.reqHouseRoof === 'Ондулин' ? 'selected' : ''}>Ондулин</option>
                  <option value="Нержавейка" ${add.obj.reqHouseRoof === 'Нержавейка' ? 'selected' : ''}>Нержавейка</option>
                  <option value="Черепица" ${add.obj.reqHouseRoof === 'Черепица' ? 'selected' : ''}>Черепица</option>
                  <option value="Рубероид" ${add.obj.reqHouseRoof === 'Рубероид' ? 'selected' : ''}>Рубероид</option>
                  <option value="Не указано" ${add.obj.reqHouseRoof === 'Не указано' ? 'selected' : ''}>Не указано</option>
                </select>
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Отопление</span>               
                <select id="reqHouseHeating" class="reqHouseHeating" name="reqHouseHeating"> 
                  <option value="empty" ${!add.obj.reqHouseHeating ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqHouseHeating === 'Печное' ? 'selected' : ''}>Печное</option>
                  <option ${add.obj.reqHouseHeating === 'Газовый котел' ? 'selected' : ''}>Газовый котел</option>
                  <option ${add.obj.reqHouseHeating === 'Электрический котел' ? 'selected' : ''}>Электрический котел</option>
                  <option ${add.obj.reqHouseHeating === 'Центральное' ? 'selected' : ''}>Центральное</option>
                  <option ${add.obj.reqHouseHeating === 'Водяное' ? 'selected' : ''}>Водяное</option>
                  <option ${add.obj.reqHouseHeating === 'Отсутствует' ? 'selected' : ''}>Отсутствует</option>
                  <option ${add.obj.reqHouseHeating === 'Котельная' ? 'selected' : ''}>Котельная</option>
                </select>
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Водопровод</span>               
                <select id="reqWaterPipes" class="reqWaterPipes" name="reqWaterPipes"> 
                  <option value="empty" ${!add.obj.reqWaterPipes ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqWaterPipes === 'Не указано' ? 'selected' : ''}>Не указано</option>
                  <option ${add.obj.reqWaterPipes === 'Отсутствует' ? 'selected' : ''}>Отсутствует</option>
                  <option ${add.obj.reqWaterPipes === 'Зимний' ? 'selected' : ''}>Зимний</option>
                  <option ${add.obj.reqWaterPipes === 'Летний' ? 'selected' : ''}>Летний</option>
                </select>
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Слив</span>               
                <select id="reqDrainage" class="reqDrainage" name="reqDrainage"> 
                  <option value="empty" ${add.obj.reqDrainage ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqDrainage === 'Не указано' ? 'selected' : ''}>Не указано</option>
                  <option ${add.obj.reqDrainage === 'Отсутствует' ? 'selected' : ''}>Отсутствует</option>
                  <option ${add.obj.reqDrainage === 'Канализация' ? 'selected' : ''}>Канализация</option>
                  <option ${add.obj.reqDrainage === 'Слив' ? 'selected' : ''}>Слив</option>
                  <option ${add.obj.reqDrainage === 'Удобства' ? 'selected' : ''}>Удобства</option>
                </select>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Год постройки</span> 
                <input name="reqHouseBuildDate" class="form__input" type="date" 
                value="${add.obj.reqHouseBuildDate ? add.obj.reqHouseBuildDate.split('.').reverse().join('-') : ''}">
              </div>          
            </div> 
            <div class="price"> 
              <span class="form__title">цена<i class="i">*<p class="guid">При указании "цены в рекламу" отличной от основной, на рекламных площадках N1, CIAN, Domclick будет выгружена "цена в рекламу"</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Цена, тыс руб.</span> 
                <input name="reqPrice" class="form__input" type="text" value="${add.obj.reqPrice ? add.obj.reqPrice : ''}">
              </div>
              <div class="form__item">
                <span class="form__subtitle">Цена в рекламу, тыс руб.</span> 
                <input name="reqOverstatePrice" id="reqOverstatePrice" class="form__input" type="text" 
                value="${add.obj.reqOverstatePrice ? add.obj.reqOverstatePrice : ''}" 
                autocomplete="new-password">
              </div>
            </div>                
            <div class="comment"> 
              <span class="form__title">Комментарии<i class="i">*<p class="guid">Обязательно к заполнению. Внимание! Комментарий должен быть "продающим". Запрещено описывать с использованием обилия восклицательных знаков и с использованием CAPS LOCK.</p></i></span>
              <textarea class="comment__input" name="reqComment" cols="30" rows="10">${add.obj.reqComment ? add.obj.reqComment : ''}</textarea>
            </div>        
            <div class="buttons-footer"> 
              <button ${add.obj.onModeration === '1' ? 'disabled' : ''} class="buttons-footer__item 
                ${add.obj.onModeration === '1' ? 'buttons-footer__item_disabled' : ''}" type="submit">
                ${add.obj.onModeration === '1' ? 'Объект на модерации' : 'Сохранить'}
              </button>
              <button class="buttons-footer__item" type="reset">отменить</button>
            </div>`
  }
}
class Ground{
  render(){
    const partOrFull = getPartOrFull();
    return `<div class="place"> 
              <span class="form__title">местоположение<i class="i">*<p class="guid">дополнительный ориентир не обязательно поле. для города Новосибирск и Кемерово - обязательно указание всех реквизитов адреса. Для остальных - Указание района - не требуется</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Регион</span> 
                <input name="reqRegion" class="form__input search__input reqRegion" type="search" value="${add.obj.reqRegion ? add.obj.reqRegion : 'Новосибирская область'}" autocomplete="new-password">
                <div class="reqRegion__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Населенный пункт</span> 
                <input name="reqCity" class="form__input search__input reqCity" type="search" value="${add.obj.reqCity ? add.obj.reqCity : ''}" autocomplete="new-password">
                <div class="reqCity__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Район</span> 
                <input name="reqArea" class="form__input search__input reqArea" type="search" value="${add.obj.reqArea ? add.obj.reqArea : ''}" autocomplete="new-password">
                <div class="reqArea__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Улица</span> 
                <input name="reqStreet" class="form__input search__input reqStreet" type="search" value="${add.obj.reqStreet ? add.obj.reqStreet : ''}" autocomplete="new-password">                
                <div class="reqStreet__items search__field isVisible"></div>
              </div>              
              <div class="form__item">
                <span class="form__subtitle">Номер дома</span> 
                <input name="reqHouseNumber" class="form__input" type="text" value="${add.obj.reqHouseNumber ? add.obj.reqHouseNumber : ''}" autocomplete="new-password">
              </div>              
              <div class="form__item">
                <span class="form__subtitle">Дополнительный ориентир</span> 
                <input name="reqAdditionalLandmark" id="reqAdditionalLandmark" class="form__input" type="text" value="${add.obj.reqAdditionalLandmark ? add.obj.reqAdditionalLandmark : ''}" autocomplete="new-password">
              </div>
              <div class="form__item">
                <span class="form__subtitle">Координаты X</span> 
                <input name="lat" class="form__input" type="text" value="${add.obj.lat ? add.obj.lat : ''}" autocomplete="new-password">
              </div>
              <div class="form__item">
                <span class="form__subtitle">Координаты Y</span> 
                <input name="lng" class="form__input" type="text" value="${add.obj.lng ? add.obj.lng : ''}" autocomplete="new-password">
              </div>
              <div id="map"></div>
            </div>                
            <div class="info"> 
              <span class="form__title">информация об объекте недвижимости<i class="i">*<p class="guid">все поля обязательны для заполнения. Если на продажу выставляется часть земли, укажите долю на продажу и долю всего.</p></i></span>
              <div class="form__item">
                 <span class="form__subtitle">Площадь участка (в сотках) <i class="simbol">*</i> Разделитель точка</span> 
                <input name="reqLandArea" class="form__input" type="text" value="${add.obj.reqLandArea ? add.obj.reqLandArea : ''}">
              </div>     
              <div class="form__item">
                 <span class="form__subtitle">Садовое общество</span> 
                <input name="reqMunicipality" class="form__input" type="text" value="${add.obj.reqMunicipality ? add.obj.reqMunicipality : ''}">
              </div> 
              ${partOrFull}     
              <div class="form__item"> 
                <span class="form__subtitle">Водопровод</span>               
                <select class="reqWaterPipes" name="reqWaterPipes"> 
                  <option value="empty" ${!add.obj.reqWaterPipes ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqWaterPipes === 'Не указано' ? 'selected' : ''}>Не указано</option>
                  <option ${add.obj.reqWaterPipes === 'Отсутствует' ? 'selected' : ''}>Отсутствует</option>
                  <option ${add.obj.reqWaterPipes === 'Зимний' ? 'selected' : ''}>Зимний</option>
                  <option ${add.obj.reqWaterPipes === 'Летний' ? 'selected' : ''}>Летний</option>
                </select>
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Слив</span>               
                <select class="reqDrainage" name="reqDrainage"> 
                  <option value="empty" ${add.obj.reqDrainage ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqDrainage === 'Не указано' ? 'selected' : ''}>Не указано</option>
                  <option ${add.obj.reqDrainage === 'Отсутствует' ? 'selected' : ''}>Отсутствует</option>
                  <option ${add.obj.reqDrainage === 'Канализация' ? 'selected' : ''}>Канализация</option>
                  <option ${add.obj.reqDrainage === 'Слив' ? 'selected' : ''}>Слив</option>
                  <option ${add.obj.reqDrainage === 'Удобства' ? 'selected' : ''}>Удобства</option>
                </select>
              </div>      
              <div class="form__item"> 
                <span class="form__subtitle">Категория земли</span>               
                <select class="reqGroundCategory" name="reqGroundCategory"> 
                  <option value="empty" ${add.obj.reqGroundCategory ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqGroundCategory === 'Не указано' ? 'selected' : ''}>Индивидуального строительства</option>
                  <option ${add.obj.reqGroundCategory === 'Отсутствует' ? 'selected' : ''}>Для садоводчества</option>
                  <option ${add.obj.reqGroundCategory === 'Отсутствует' ? 'selected' : ''}>Другое</option>
                </select>
              </div>         
            </div> 
            <div class="price"> 
              <span class="form__title">цена<i class="i">*<p class="guid">При указании "цены в рекламу" отличной от основной, на рекламных площадках N1, CIAN, Domclick будет выгружена "цена в рекламу"</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Цена, тыс руб.</span> 
                <input name="reqPrice" class="form__input" type="text" value="${add.obj.reqPrice ? add.obj.reqPrice : ''}">
              </div>               
              <div class="form__item">
                <span class="form__subtitle">Цена в рекламу, тыс руб.</span> 
                <input name="reqOverstatePrice" id="reqOverstatePrice" class="form__input" type="text" 
                value="${add.obj.reqOverstatePrice ? add.obj.reqOverstatePrice : ''}" 
                autocomplete="new-password">
              </div>
            </div>                        
            <div class="comment"> 
              <span class="form__title">Комментарии<i class="i">*<p class="guid">Обязательно к заполнению. Внимание! Комментарий должен быть "продающим". Запрещено описывать с использованием обилия восклицательных знаков и с использованием CAPS LOCK.</p></i></span>
              <textarea class="comment__input" name="reqComment" cols="30" rows="10">${add.obj.reqComment ? add.obj.reqComment : ''}</textarea>
            </div>
            <div class="buttons-footer"> 
              <button ${add.obj.onModeration === '1' ? 'disabled' : ''} class="buttons-footer__item 
                ${add.obj.onModeration === '1' ? 'buttons-footer__item_disabled' : ''}" type="submit">
                ${add.obj.onModeration === '1' ? 'Объект на модерации' : 'Сохранить'}
              </button>
              <button class="buttons-footer__item" type="reset">отменить</button>
            </div>`
  }
}
class Garage{
  render(){
    return `<div class="place"> 
              <span class="form__title">местоположение<i class="i">*<p class="guid">дополнительный ориентир не обязательно поле. для города Новосибирск и Кемерово - обязательно указание всех реквизитов адреса. Для остальных - Указание района - не требуется</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Регион</span> 
                <input name="reqRegion" class="form__input search__input reqRegion" type="search" value="${add.obj.reqRegion ? add.obj.reqRegion : 'Новосибирская область'}" autocomplete="new-password">
                <div class="reqRegion__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Населенный пункт</span> 
                <input name="reqCity" class="form__input search__input reqCity" type="search" value="${add.obj.reqCity ? add.obj.reqCity : ''}" autocomplete="new-password">
                <div class="reqCity__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Район</span> 
                <input name="reqArea" class="form__input search__input reqArea" type="search" value="${add.obj.reqArea ? add.obj.reqArea : ''}" autocomplete="new-password">
                <div class="reqArea__items search__field isVisible"></div>
              </div>
              <div class="form__item">
                <span class="form__subtitle">Улица</span> 
                <input name="reqStreet" class="form__input search__input reqStreet" type="search" value="${add.obj.reqStreet ? add.obj.reqStreet : ''}" autocomplete="new-password">                
                <div class="reqStreet__items search__field isVisible"></div>
              </div>              
              <div class="form__item">
                <span class="form__subtitle">Номер дома</span> 
                <input name="reqHouseNumber" class="form__input" type="text" value="${add.obj.reqHouseNumber ? add.obj.reqHouseNumber : ''}" autocomplete="new-password">
              </div>                         
              <div class="form__item">
                <span class="form__subtitle">Дополнительный ориентир</span> 
                <input name="reqAdditionalLandmark" id="reqAdditionalLandmark" class="form__input" type="text" value="${add.obj.reqAdditionalLandmark ? add.obj.reqAdditionalLandmark : ''}" autocomplete="new-password">
              </div>   
              <div class="form__item">
                <span class="form__subtitle">Координаты X</span> 
                <input name="lat" class="form__input" type="text" value="${add.obj.lat ? add.obj.lat : ''}" autocomplete="new-password">
              </div>
              <div class="form__item">
                <span class="form__subtitle">Координаты Y</span> 
                <input name="lng" class="form__input" type="text" value="${add.obj.lng ? add.obj.lng : ''}" autocomplete="new-password">
              </div>
              <div id="map"></div>
            </div>
            <div class="info"> 
              <span class="form__title">информация об объекте недвижимости<i class="i">*<p class="guid">все поля обязательны для заполнения</p></i></span>
              <div class="form__item">
                 <span class="form__subtitle">Площадь m<sup>2</sup> &nbsp;<i class="simbol">*</i> Разделитель точка</span> 
                <input name="reqFlatTotalArea" class="form__input" type="text" value="${add.obj.reqFlatTotalArea ? add.obj.reqFlatTotalArea : ''}" placeholder="пример 11.1">
              </div>                   
              <div class="form__item"> 
                <span class="form__subtitle">Материал стен</span>               
                <select class="reqMaterial" name="reqMaterial"> 
                  <option value="empty" ${!add.obj.reqMaterial ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqMaterial === 'Кирпич' ? 'selected' : ''}>Кирпич</option>
                  <option ${add.obj.reqMaterial === 'Панель' ? 'selected' : ''}>Панель</option>
                  <option ${add.obj.reqMaterial === 'Шлакоблоки' ? 'selected' : ''}>Шлакоблоки</option>
                  <option ${add.obj.reqMaterial === 'Дерево' ? 'selected' : ''}>Дерево</option>
                  <option ${add.obj.reqMaterial === 'Монолит' ? 'selected' : ''}>Монолит</option>
                  <option ${add.obj.reqMaterial === 'Сибит' ? 'selected' : ''}>Сибит</option>
                  <option ${add.obj.reqMaterial === 'Каркасно-засыпной' ? 'selected' : ''}>Каркасно-засыпной</option>
                  <option ${add.obj.reqMaterial === 'Металло-каркассный' ? 'selected' : ''}>Металло-каркассный</option>
                  <option ${add.obj.reqMaterial === 'Кирпично-каркасный' ? 'selected' : ''}>Кирпично-каркасный</option>
                  <option ${add.obj.reqMaterial === 'Камень' ? 'selected' : ''}>Камень</option>
                  <option ${add.obj.reqMaterial === 'Не указано' ? 'selected' : ''}>Не указано</option>
                </select>
              </div>     
              <div class="form__item">
                 <span class="form__subtitle">Этаж</span> 
                <input name="reqFloor" class="form__input" type="text" value="${add.obj.reqFloor ? add.obj.reqFloor : ''}">
              </div>                 
              <div class="form__item">
                 <span class="form__subtitle">Этажность</span> 
                <input name="reqFloorCount" class="form__input" type="text" value="${add.obj.reqFloorCount ? add.obj.reqFloorCount : ''}">
              </div>
              <div class="form__item">
                <span class="form__subtitle">Номер парковочного места</span> 
                <input name="reqFlat" class="form__input" type="text" value="${add.obj.reqFlat ? add.obj.reqFlat : ''}" autocomplete="new-password">
              </div>
              <div class="form__item"> 
                <span class="form__subtitle">Тип гаража</span>               
                <select class="reqGarageType" name="reqMaterial"> 
                  <option value="empty" ${!add.obj.reqGarageType ? 'selected' : ''}>Выберете</option>
                  <option ${add.obj.reqGarageType === 'Кирпич' ? 'selected' : ''}>Гараж</option>
                  <option ${add.obj.reqGarageType === 'Панель' ? 'selected' : ''}>Машиноместо</option>
                  <option ${add.obj.reqGarageType === 'Шлакоблоки' ? 'selected' : ''}>Бокс</option>
                </select>
              </div>   
              <div class="form__item">
                <span class="form__subtitle">Год постройки</span> 
                <input name="reqHouseBuildDate" class="form__input" type="date" 
                value="${add.obj.reqHouseBuildDate ? add.obj.reqHouseBuildDate.split('.').reverse().join('-') : ''}">
              </div>            
            </div> 
            <div class="price"> 
              <span class="form__title">цена<i class="i">*<p class="guid">При указании "цены в рекламу" отличной от основной, на рекламных площадках N1, CIAN, Domclick будет выгружена "цена в рекламу"</p></i></span>
              <div class="form__item">
                <span class="form__subtitle">Цена, тыс руб.</span> 
                <input name="reqPrice" class="form__input" type="text" value="${add.obj.reqPrice ? add.obj.reqPrice : ''}">
              </div>               
              <div class="form__item">
                <span class="form__subtitle">Цена в рекламу, тыс руб.</span> 
                <input name="reqOverstatePrice" id="reqOverstatePrice" class="form__input" type="text" 
                value="${add.obj.reqOverstatePrice ? add.obj.reqOverstatePrice : ''}" 
                autocomplete="new-password">
              </div>
            </div>                        
            <div class="comment"> 
              <span class="form__title">Комментарии<i class="i">*<p class="guid">Обязательно к заполнению. Внимание! Комментарий должен быть "продающим". Запрещено описывать с использованием обилия восклицательных знаков и с использованием CAPS LOCK.</p></i></span>
              <textarea class="comment__input" name="reqComment" cols="30" rows="10">${add.obj.reqComment ? add.obj.reqComment : ''}</textarea>
            </div>
            <div class="buttons-footer"> 
              <button ${add.obj.onModeration === '1' ? 'disabled' : ''} class="buttons-footer__item 
                ${add.obj.onModeration === '1' ? 'buttons-footer__item_disabled' : ''}" type="submit">
                ${add.obj.onModeration === '1' ? 'Объект на модерации' : 'Сохранить'}
              </button>
              <button class="buttons-footer__item" type="reset">отменить</button>
            </div>`
  }
}


const add = new Add();
add.getAction();

function selectStyle(select, selectDiv, firstWord){
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
      class: `select__gap ${selectDiv}`,
      id: `${selectDiv}`,
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