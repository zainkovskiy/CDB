class App{
  constructor() {
    this.container = document.querySelector('.main');
    this.obj = {};
    this.objAPI = 'https://crm.centralnoe.ru/dealincom/factory/objectViewer.php'
    this.additional = '';
    this.additionalAPI = 'https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Object/getState.php';
    this.listUsers = 'https://crm.centralnoe.ru/dealincom/connector/findUsers.php'
  }

  async getJson(API, request1Cnamed) {
    const myHeaders = {
      "Content-Type": "application/json; charset=utf-8",
    };
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: JSON.stringify(request1Cnamed)
    };

    let response = await fetch(API, requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    return await response.json();
  }

  async setChart(){
    var request1Cnamed = {
      reqNumber: UID,
    };
    request1Cnamed.reqNumber = UID;

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

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/sellerStatsOM.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    return await response.json();
  }

  init(){
    document.querySelector('.main').scrollIntoView();
    this.container.insertAdjacentHTML('beforeend', new Render(this.obj, this.additional).render());
    this.checkSlider();
    if (this.obj.privileges.card === 'full' || this.obj.privileges.card === 'ADB'){
      this.setChart().then(data => {
        if (data.promotionStats){
          this.container.insertAdjacentHTML('beforeend', this.isChart());
          new ChartCallView(data.promotionStats, data.SelectionStats).init();
        } else {
          document.querySelector('.main').classList.add('main_without-chart');
        }
        this.setTopForStory();
      });
    }
    if (source === 'pars'){
      document.querySelector('.main').classList.add('main_pars');
    }
    console.log(btoa(UID))
    new Handler(this.obj).init();
    this.initTooltip();
  }

  initTooltip(){
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  }
  isChart(){
    const currentX = document.documentElement.clientWidth;
    if (currentX < 500){
      return `<div class="chart" style="width:100%; height:auto;">
                <canvas id="myChart" width="320" height="320"></canvas>
              </div>`;
    } else {
      return `<div class="chart">
                <canvas id="myChart"></canvas>
             </div>`;
    }
  }

  setTopForStory(){
    if (document.querySelector('.chart')){
      const infoTop = document.querySelector('.info ').getBoundingClientRect().top;
      const chartBottom = document.querySelector('.chart').getBoundingClientRect().bottom;
      document.querySelector('.story').setAttribute('style', `height: ${chartBottom - infoTop}px`);
    } else {
      const infoTop = document.querySelector('.info ').getBoundingClientRect().top;
      const mapWrapBottom = document.querySelector('.map_wrap').getBoundingClientRect().bottom;
      document.querySelector('.story').setAttribute('style', `height: ${mapWrapBottom - infoTop}px`);
    }
  }
  checkSlider(){
    const elms = document.querySelectorAll('.slider');
    const currentX = document.documentElement.clientWidth;
    if (currentX > 500){
      for (let i = 0, len = elms.length; i < len; i++) {
        // инициализация elms[i] в качестве слайдера
        new ChiefSlider(elms[i]);
      }
    } else {
      new ChiefSlider('.slider', {
        loop: false
      });
    }
  }
}

class Render {
  constructor(obj, additional) {
    this.obj = obj;
    this.additional = additional;
  }

  initMap(){
    let cords = '';
    for (let item of this.obj.cords){
      if (!item){
        cords = ['55.030204', '82.920430']
      } else {
        cords = this.obj.cords;
      }
    }
    ymaps.ready(init);
    function init(){
      var myMap = new ymaps.Map("map", {
        center: cords,
        zoom: 17,
        controls: [],
      });
      var myGeoObject = new ymaps.GeoObject({
        geometry: {
          type: "Point", // тип геометрии - точка
          coordinates: cords, // координаты точки
        }
      });
      myMap.geoObjects.add(myGeoObject);
      myMap.controls.add('zoomControl');
      myMap.behaviors.disable('scrollZoom');
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        //... отключаем перетаскивание карты
        myMap.behaviors.disable('drag');
      }
    }
  }
  // isChart(){
  //   const currentX = document.documentElement.clientWidth;
  //   if (currentX < 500){
  //     return `<div class="chart" style="width:100%; height:auto;">
  //               <canvas id="myChart" width="320" height="320"></canvas>
  //             </div>`;
  //   } else {
  //     return `<div class="chart">
  //               <canvas id="myChart"></canvas>
  //            </div>`;
  //   }
  // }
  isPhoto(){
    if (this.obj.photo && this.obj.photo.length > 0){
      let photoElem = '';
      for (let item of this.obj.photo){
        photoElem += `<div class="slider__item slider__photo" data-img=${item} style="background-image: url(${item})"></div>`;
      }
      return photoElem;
    } else {
      return `<div class="slider__item slider__photo" data-img='../img/placeholder.png'' style="background-image: url('../img/placeholder.png')"></div>`;
    }
  }
  getDate(date){
    return date.split(" ")[0].split('-').reverse().join('.');
  }
  historyLayout(){
    function getHistory(arr){
      let historyLayout = '';
      for (let item of arr){
        historyLayout += `<div class="story__wrap">
                            <a class="story__link" href="${item[3]}" target="_blank"><img class="story__img" src="${item[4] ? item[4]
          : `../img/placeholder-user.png`}" alt=""></a>
                            <p class="visible story__name">${item[2]}</p>
                            <p class="story__text">[${new Date(item[0]).getHours()}:${new Date(item[0]).getMinutes() < 10 ? `0${new Date(item[0]).getMinutes()}` : new Date(item[0]).getMinutes()}] ${item[1]}</p>
                            <span class="story__border"></span>
                          </div>`
      }
      return historyLayout;
    }

    if (this.obj.history){
      let history = '';
      let sortDate = {};
      let date = '';

      for (let item of this.obj.history){
        if (this.getDate(item[0]) === date){
          sortDate[date].push(item);
        } else {
          date = this.getDate(item[0]);
          sortDate[date] = [];
          sortDate[date].push(item);
        }
      }

      for (let item of Object.keys(sortDate)){
        history += `<div class="story__item"> 
                      <span class="sort__date">${item}</span>
                      ${getHistory(sortDate[item])}
                    </div>`

      }
      return history;
    } else {
      return `нет истории посещений`;
    }
  }
  haveIsLogo(){
    const libraryIconLogos = {
      'Avito': 'https://crm.centralnoe.ru/dealincom/assets/img/avito_logo.png',
      'Cian': 'https://crm.centralnoe.ru/dealincom/assets/img/cian_logo.png',
      'Domclick': 'https://crm.centralnoe.ru/dealincom/assets/img/dom_logo.jpg',
      'Site': '../img/centr_logo.png',
      'Yandex': 'https://crm.centralnoe.ru/dealincom/assets/img/y_logo.png',
      'N1': 'https://crm.centralnoe.ru/dealincom/assets/img/n1_logo.png',
    }
    if (this.additional && this.additional.docType === 'Без договора' || this.additional && this.additional.reqStatus === 'Отмененная'){
      return ''
    }

    if (source === '1c' && this.obj.platform.length > 0){
      let logos = '';
      for (let logo of this.obj.platform){
        if (logo.name === 'Site'){
          logos = `<a class="miscellaneous-information__logo" href='${logo.url}' target="_blank" style="background-image: url(${libraryIconLogos[logo.name]})" title="нажмите чтобы перейти на площадку"></a>` + logos;
        } else {
          logos += `<a class="miscellaneous-information__logo" href='${logo.url}' target="_blank" style="background-image: url(${libraryIconLogos[logo.name]})" title="нажмите чтобы перейти на площадку"></a>`
        }
      }
      return logos
    } else if (source === '1c'){
      return `<span class="miscellaneous-information__logo" style="background-image: url(${this.obj.logo})"></span>`
    } else {
      let logos = '';
      for (let logo of this.obj.advURL){
        logos += `<a class="miscellaneous-information__logo" href='${logo.URL}' target="_blank" style="background-image: url(${logo.logo})" title="нажмите чтобы перейти на площадку"></a>`
      }
      return logos
    }
  }
  getPrice(){
    if (this.obj.price && this.obj.totalArea){
      return ((+this.obj.price / +this.obj.totalArea) * 1000).toFixed(0);
    } else {
      return ``
    }
  }
  getDocType(){
    if (source === '1c'){
      return this.additional.docType ? this.additional.docType : '';
    } else {
      return ''
    }
  }
  getClient(){
    if (source === 'pars' || this.obj.privileges.card === 'full' || this.obj.docType === null || this.obj.docType === 'Без договора'){
      return `<div class="contacts">
                  <span class="text">Владелец</span>
                  <span class="contacts__name text">${this.obj.client ? this.obj.client : 'не указан'}</span>  
                  <span class="text text-phone">
                  <svg class="contacts__phone" xmlns="http://www.w3.org/2000/svg" 
                    \t viewBox="0 0 505.709 505.709" xml:space="preserve">
                    \t\t<path d="M427.554,71.862c-99.206-95.816-256.486-95.816-355.692,0c-98.222,101.697-95.405,263.762,6.292,361.984
                    \t\t\tc99.206,95.816,256.486,95.816,355.692,0C532.068,332.15,529.251,170.084,427.554,71.862z M421.814,421.814l-0.085-0.085
                    \t\t\tc-93.352,93.267-244.636,93.198-337.903-0.154S-9.372,176.94,83.98,83.673s244.636-93.198,337.903,0.153
                    \t\t\tc44.799,44.84,69.946,105.643,69.905,169.028C491.792,316.225,466.622,377.002,421.814,421.814z"/>
                    
                    \t\t<path d="M396.641,325.729l-47.957-47.787c-10.884-10.91-28.552-10.931-39.462-0.047c-0.016,0.016-0.031,0.031-0.047,0.047
                    \t\t\tl-27.477,27.477c-2.079,2.084-5.355,2.372-7.765,0.683c-15.039-10.51-29.117-22.333-42.069-35.328
                    \t\t\tc-11.6-11.574-22.271-24.042-31.915-37.291c-1.748-2.38-1.494-5.68,0.597-7.765l28.16-28.16c10.872-10.893,10.872-28.531,0-39.424
                    \t\t\tl-47.957-47.957c-11.051-10.565-28.458-10.565-39.509,0l-15.189,15.189c-22.939,22.681-31.128,56.359-21.163,87.04
                    \t\t\tc7.436,22.447,17.947,43.755,31.232,63.317c11.96,17.934,25.681,34.628,40.96,49.835c16.611,16.73,35.011,31.581,54.869,44.288
                    \t\t\tc21.83,14.245,45.799,24.904,70.997,31.573c6.478,1.597,13.126,2.399,19.797,2.389c22.871-0.14,44.752-9.346,60.843-25.6
                    \t\t\tl13.056-13.056C407.513,354.26,407.513,336.622,396.641,325.729z M384.557,353.514c-0.011,0.011-0.022,0.023-0.034,0.034
                    \t\t\tl0.085-0.256l-13.056,13.056c-16.775,16.987-41.206,23.976-64.427,18.432c-23.395-6.262-45.635-16.23-65.877-29.525
                    \t\t\tc-18.806-12.019-36.234-26.069-51.968-41.899c-14.477-14.371-27.483-30.151-38.827-47.104
                    \t\t\tc-12.408-18.242-22.229-38.114-29.184-59.051c-7.973-24.596-1.366-51.585,17.067-69.717l15.189-15.189
                    \t\t\tc4.223-4.242,11.085-4.257,15.326-0.034c0.011,0.011,0.023,0.022,0.034,0.034l47.957,47.957
                    \t\t\tc4.242,4.223,4.257,11.085,0.034,15.326c-0.011,0.011-0.022,0.022-0.034,0.034l-28.16,28.16
                    \t\t\tc-8.08,7.992-9.096,20.692-2.389,29.867c10.185,13.978,21.456,27.131,33.707,39.339c13.659,13.718,28.508,26.197,44.373,37.291
                    \t\t\tc9.167,6.394,21.595,5.316,29.525-2.56l27.221-27.648c4.223-4.242,11.085-4.257,15.326-0.034c0.011,0.011,0.022,0.022,0.034,0.034
                    \t\t\tl48.043,48.128C388.765,342.411,388.78,349.272,384.557,353.514z"/>
                    </svg>
                    ${this.obj.clientPhone ? this.obj.clientPhone : 'не указан'}
                  </span>
              </div>`
    } else {
      return ``
    }
  }
  getPhoneOwner(){
    const regExp = new RegExp(/^7/);
    if (this.obj.clientPhone){
      let phone = this.obj.clientPhone.split('(').join('').split(')').join('').split(' ').join('').split('-').join('');
      if (phone.length < 11){
        return `7` + phone;
      } else if (regExp.test(phone)){
        return phone;
      }  else if (!regExp.test(phone)){
        return `7` + phone.slice(1);
      }
    } else {
      return ''
    }
  }

  getTodo(){
    let todoList = '';
    for (let text of this.additional.photoStatus){
      todoList += `<li>${text}</li>`;
    }
    return todoList
  }
  getStamp(){
    const stamp = {
      client: '',
      moderator: ''
    }
    if (this.additional.clientAccepted === "Accepted" && this.additional.docType === "Рекламный договор"){
      stamp.client = `<span class="stamp">Подтверждено клиентом</span>`;
    }

    if (this.additional.docModeration === "inProgress" && this.additional.docType !== "Рекламный договор"){
      stamp.moderator = `<span class="stamp">Документы на проверке</span>`;
    } else if (this.additional.contentModeration === "Accepted"){
      stamp.moderator = `<span class="stamp stamp_accepted">Подтверждено модератором</span>`;
    } else if (this.additional.contentModeration === "inProgress"){
      stamp.moderator = `<span class="stamp">На основной модерации</span>`;
    }
    return stamp;
  }

  render(){
    const photo = this.isPhoto();
    const createdDate = this.obj.created && this.getDate(this.obj.created);
    const updatedDate = this.obj.updated && this.getDate(this.obj.updated);
    let priceMeter = this.getPrice();
    const logo = this.haveIsLogo();
    const historyLayout = this.historyLayout();
    const docType = this.getDocType();
    const client = this.getClient();
    const regExp = new RegExp('зарезервировано', 'i');
    const phoneOwner = this.getPhoneOwner();
    const stamps = this.getStamp();
    this.initMap();
    // const chartView = this.isChart();
    return `<input class="mobile-toggle__input" id="menu__toggle" type="checkbox">
            <label class="mobile-toggle__label" for="menu__toggle"> 
              <span class="mobile-toggle__span"></span>
            </label>
            <nav class="change-page">
              <a class="ui-btn ui-btn-secondary ui-btn-icon-eye-opened change-page__link" href="../object/?source=${source}&id=${UID}&IDDEAL=${deal}">Объект</a>              
              <a class="ui-btn ui-btn-icon-page change-page__link ${this.obj.privileges.card === 'full' || this.obj.privileges.card === 'ADB'
      ? this.obj.privileges.card : 'isVisible'}" href="../agency/?source=${source}&id=${btoa(UID)}">ДОУ</a>
              <a class="ui-btn change-page__link ${this.obj.privileges.card === 'full' || this.obj.privileges.card === 'ADB'
      ? this.obj.privileges.card : 'isVisible'}" href="../photoEditor/?source=${source}&id=${btoa(UID)}&IDDEAL=${deal}">Фото</a>
              <!-- <a class="ui-btn ui-btn-icon-page change-page__link 
              ${login === "zainkovskiyaa" || login === 'mischenkoiv' || login === 'osmanovnyu' || login === 'denishevalf' ? '' : 'isVisible'}" 
              href="../agency/?source=${source}&id=${UID}&IDDEAL=${deal}">ДОУ</a> -->

              <a class="ui-btn change-page__link ${this.obj.privileges.card === 'full' || this.obj.privileges.card === 'ADB'
      ? this.obj.privileges.card : 'isVisible'}" href="../promotion/?source=${source}&id=${btoa(UID)}&IDDEAL=${deal}">Реклама</a>
              <a class="ui-btn ui-btn-icon-done change-page__link ${this.obj.privileges.card === 'ADB'
      ? '' : 'disable'}" href="../buySell/?source=${source}&id=${btoa(UID)}&IDDEAL=${deal}">ПДКП/ДКП</a>
            </nav>
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
            <div class="miscellaneous-information wrapper"> 
                <div class="miscellaneous-information__header"> 
                  <p class="title info__text miscellaneous-information__text">Заявка №<span class="text">${UID ? UID : ''}</span></p>
                  <p class="title info__text miscellaneous-information__text">Сделка
                    <span class="text text_link" data-open="deal" data-deal="${this.obj.deal}">${this.obj.deal ? this.obj.deal : ''}</span>
                  </p>
                  <p class="title info__text miscellaneous-information__text">Создано<span class="text">${createdDate ? createdDate : ''}</span></p>
                  <p class="title info__text miscellaneous-information__text">Статус<span class="text">${this.additional ? `${this.additional.reqStatus ? this.additional.reqStatus : ''}` : ''}</span></p>
                  <p class="title info__text miscellaneous-information__text">Тип договора<span class="text">${docType}</span></p>
                  <p class="title info__text miscellaneous-information__text miscellaneous-information__realtor">Риелтор<span class="text">
                  <a class="contacts__link text" onclick="event.preventDefault()" class="blog-p-user-name" id="bp_R1gY0o5G" href="/company/personal/user/${this.obj.ownerId}" bx-tooltip-user-id="${this.obj.ownerId}">
                            ${this.obj.owner ? this.obj.owner : ''}
                  </a> <i data-choose="responsible" class="miscellaneous-information__btn-choose ${this.obj.isGod && source === '1c' ? '' : 'visible'}"></i></span></p>
                </div>
                <div class="miscellaneous-information__bottom"> 
                  <div class="miscellaneous-information_wrap"> 
                    ${logo}
                  </div>
                  <div class="about__stamp"> 
                    ${source === '1c' ? stamps.client : ''}
                    ${source === '1c' ? stamps.moderator : ''}
                  </div>
                </div>
            </div>
            <div class="about wrapper">
              <div class="about__top"> 
                <div class="about__address">  
                  <span class="text">
                    ${this.obj.typeRealty === 'Гараж' || this.obj.typeRealty === 'Земельный участок' ? '' : `${this.obj.roomCount ? `${this.obj.roomCount} к.` : ''}`}
                    ${this.obj.typeRealty ? this.obj.typeRealty : ''}
                  </span>
                  <span class="about__title about__title-address">${this.obj.street ? this.obj.street : ''}${this.obj.privileges.card === 'ADB' ? `${this.obj.reqFlat ? `-${this.obj.reqFlat}` : ''}` : ''}</span>   
                    <p class="text p_margin">${this.obj.city ? `${this.obj.city}` : ''} ${this.obj.area ? `${this.obj.area} р-н` : ''}</p>
                    ${this.obj.community ? `<p class="text p_margin">${this.obj.community}</p>` : ''}  
                </div>
              </div>
              <div class="attention__wrap ${this.obj.privileges.user !== 'owner' || this.additional.photoStatus.length === 0 ? 'visible' : ''}"> 
                <ol class="attention__list"> 
                  ${source === '1c' &&  this.getTodo()}
                </ol>
              </div>
              <div class="about__bottom"> 
                ${client}
              </div>
            </div>
            <div class="about__price wrapper"> 
                <div> 
                  <div class="about__price_wrap"> 
                    <span class="const-price about__title">${this.obj.price ? `${this.obj.price} тыс. ₽` : ''}</span>  
                    <input class="visibility" 
                      autocomplete="off"
                      name="price" 
                      type="text" 
                      value="${this.obj.price ? this.obj.price : ''}">     
                  </div>
                </div>
                <div class="about__price_wrap reqOverstate ${this.obj.privileges.user === 'owner' && this.obj.reqOverstate === '1' ? '' : 'visibility'}"> 
                  <span class="text text_grey reqOverstateText">В рекламе ${this.obj.reqOverstate === '1' ? `${this.obj.reqOverstatePrice ? this.obj.reqOverstatePrice : this.obj.price}` : this.obj.price}</span>
                  <i class="description__status question"                   
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Применено завышение. Указанная цена для выгрузки" ></i>
                  <input class="visibility" 
                      autocomplete="off"
                      name="reqOverstatePrice" 
                      type="text" 
                      value="${this.obj.reqOverstate === '1' ? `${this.obj.reqOverstatePrice ? this.obj.reqOverstatePrice : this.obj.price}` : this.obj.price}">     
                </div>
                <div class="${this.obj.privileges.card === 'full' || this.obj.privileges.card === 'ADB' || this.obj.privileges.user === 'owner' ? '' : 'visible'}"> 
                  <div class="about__toggle visibility"> 
                    <div class="about__price_wrap">
                      <span class="text text_grey">Завышение</span>
                      <i class="description__status question"                
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Стирает историю изменения цены для рекламных площадок. Объект выходит в рекламу под новым номером с новой ценой" ></i>
                    </div>
                    <label class="switch">
                      <input data-overstate="toggle" class="switch__open" type="checkbox" ${this.obj.reqOverstate === '1' ? 'checked' : ''}>
                      <span class="slider__toggle slider__main"></span>
                    </label>
                  </div>
                <span class="edit-btn" data-price="edit">редактировать цену</span>
                </div> 
            </div>   
            <div class="info wrapper">
                  <div class="info__area mobile-margin_bottom">
                    <p class="title p_margin">Общая площадь<span class="info__area-text info__area-text_left">
                    ${this.obj.typeRealty === 'Земельный участок' ? `${this.obj.totalArea ? `${this.obj.totalArea} соток` : ''}` : `${this.obj.totalArea ? `${this.obj.totalArea} кв.м.` : ''}`}
                    </span></p>
                    <p class="title p_margin">Жилая площадь<span class="info__area-text info__area-text_right">${this.obj.livingArea ? `${this.obj.livingArea} кв.м.` : ''}</span></p>
                  </div>                 
                  <div class="info__area">
                    <p class="title p_margin">Площадь кухни<span class="info__area-text info__area-text_left">${this.obj.kitchenArea ? `${this.obj.kitchenArea} кв.м.` : ''}</span></p>
                    <p class="title p_margin">Этаж<span class="info__area-text info__area-text_right">${this.obj.floor ? this.obj.floor : ''}</span></p>
                  </div>
                  <div class="info__info"> 
                    <p class="title info__text margin_top">Тип квартиры<span class="text text_right">${this.obj.typeOfFlat ? this.obj.typeOfFlat : ''}</span></p>
                    <p class="title info__text margin_top">Планировка<span class="text text_right">${this.obj.typeLayout ? this.obj.typeLayout : ''}</span></p>
                    <p class="title info__text margin_top">Санузел<span class="text text_right">${this.obj.bathroom ? this.obj.bathroom : ''}</span></p>          
                    <p class="title info__text margin_top">Балкон<span class="text text_right">${this.obj.gallery ? this.obj.gallery : ''}</span></p>
                  </div>
                  <div class="info__info"> 
                    <p class="title info__text margin_top">Этажей<span class="text text_right">${this.obj.totalFloors ? this.obj.totalFloors : ''}</span></p> 
                    <p class="title info__text margin_top">Материал<span class="text text_right">${this.obj.material ? this.obj.material : ''}</span></p>      
                    <p class="title info__text margin_top"l>Год сдачи<span class="text text_right">${this.obj.buildDate ? this.obj.buildDate : ''}</span></p>    
                    ${this.obj.metroDistance ? this.obj.metroDistance >= 60 ? '' :
      `<p class="title info__text margin_top">
                    <span>
                    ${this.obj.metro ? this.obj.metro : ''}
                    <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.41193 0L5.8457 4.47552L3.31259 0L1.20994 
                                  5.3986H0.845703V6H2.98146V5.42657H2.65034L3.69339 3.00699L5.5808 6H6.09405L7.98146 
                                  2.97902L9.04107 5.3986H8.66027V6H10.8457V5.3986H10.4649L8.41193 0Z" fill="#E84533"/>
                    </svg>
                    </span>
                    <span class="text text_right">${this.obj.metroDistance ? this.obj.metroDistance : ''} мин. пешком</span>
                  </p>` : ''}
                    <p class="title info__text margin_top">Стоимость кв.м.<span class="text text_right">${priceMeter}</span></p> 
                  </div>
            </div>
            <div class="btn-group wrapper mobile_visible"> 
              <button data-name="openCard" data-open="reservation" class="btn_edit ui-btn ui-btn-primary-dark 
                    ${this.obj.docType === 'Эксклюзивный договор' || this.obj.docType === 'Рекламный договор'
    || regExp.test(this.obj.docType) ? 'isVisible' : ''}">
                    Зарезервировать
              </button>
              <a class="btn_edit ui-btn ui-btn-primary-dark ${this.obj.privileges.user === 'owner' ? this.obj.privileges.user : 'isVisible'}"
              href="https://crm.centralnoe.ru/CDB/object/card/add/?login=yes&action=old&id=${this.obj.reqNumber}&contact=${phoneOwner}&curdeal=${deal}">
              Редактировать</a>
              
              <a class="btn_edit ui-btn ui-btn-primary-dark ${this.obj.privileges.user === 'owner' ? this.obj.privileges.user : 'disable'}" 
              href="https://crm.centralnoe.ru/CDB/catalog/report/index.php?offerid=${this.obj.reqNumber}" target="_blank">Отчет продавцу</a>
              
              <button class="btn_edit ui-btn ui-btn-primary
                ${this.obj.privileges.user !== 'owner' || this.obj.docType === 'Без договора' ? 'isVisible' : this.obj.privileges.user}"
                data-name="photoOrder">Фотосъемка</button>
              <button data-name="alert" class="btn_edit ui-btn ui-btn-danger-light">${this.obj.privileges.card === 'ADB' ? 'статус' : 'сообщить о проблеме'}</button>
            </div>
            <div class="story wrapper mobile_visible ${this.obj.privileges.card === 'full' || this.obj.privileges.card === 'ADB' ? this.obj.privileges.card
      : 'isVisible'}">${historyLayout}</div>
            <div class="description wrapper">
              <div class="description__header"> 
                <div class="description__header_wrap"> 
                  <span class="description__title">Описание</span>  
                  ${source === '1c' ?
      `<span
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="${+this.additional.commentAccepted === 1 ? 'одобрено модератором' : 'не одобрено модератором'}" 
                  class="description__status 
                ${+this.additional.commentAccepted === 1 ? 'description__status_accept' : 'description__status_reject'}
                ">
                </span>` : ''} 
                </div>
                ${this.obj.privileges.user === 'owner' ? `<span data-description="edit" class="edit-btn">редактировать</span>` : ''}                   
              </div>
              <textarea rows="10" class="description__text text" disabled>${this.obj.comment ? this.obj.comment : ' '}</textarea>
            </div>
            <div class="map_wrap"><div style="height: 400px; width: 100%" id="map"></div></div>`
  }

}

class Handler {
  constructor(obj) {
    this.obj = obj;
    this.carousel = document.querySelector('.carousel');
    this.btnGroup = document.querySelector('.btn-group');
    this.main = document.querySelector('.main');
    this.currentImg = '';
    this.statusImg = false;
  }
  handlerImg(){
    const currentX = document.documentElement.clientWidth;
    if (currentX > 500){
      this.carousel.addEventListener('click', event => {
        if (event.target.classList.contains('slider__photo')){
          this.currentImg = event.target;
          this.openImg();
        }
      })
    }
  }
  handlerBtn(){
    this.btnGroup.addEventListener('click', event => {
      if (event.target.dataset.name === 'alert'){
        this.openAlert();
      } else if (event.target.dataset.name === 'openCard'){
        this.openCard(UID, 'reservation');
      } else if (event.target.dataset.name === 'photoOrder'){
        let field = `<div class="module__wrap">
                    <textarea placeholder="Введите коментарий для фотографа" class="form-alert__area" 
                      name="" id="" cols="30" rows="10"></textarea>    
                      <button data-name="sendOrderPhoto" class="ui-btn ui-btn-light-border">Отправить</button>
                      <button data-name="cancelOrderPhoto" class="ui-btn ui-btn-light-border">Отменить</button>
                    </div>`;
        this.openModule(field);
      }
    });
  }
  openCard(idReq, path) {
    if (path === 'deal'){
      let readyString = `https://crm.centralnoe.ru/crm/deal/details/${idReq}/`;
      BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: 925, });
    } else {
      if (source === '1c'){
        location = `https://crm.centralnoe.ru/CDB/object/card/applicationForOneself/?id=${UID}&deal=${deal}`;
      } else {
        let readyString = `https://crm.centralnoe.ru/CDB/object/card/infoAboutClients/?id=${idReq}&deal=${deal}`;
        BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: 925, });
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

  openModule(field){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="module">
                          <span class="module__close"></span>
                          ${field}
                    </div>`
    this.main.insertAdjacentHTML('beforebegin', layout);
    this.handlerModule();
  }
  handlerModule(){
    const module = document.querySelector('.module');
    module.addEventListener('click', event => {
      if (event.target.className === 'arrow-left'){
        this.previousImg(module);
      } else if (event.target.className === 'arrow-right'){
        this.nextImg(module);
      } else if (event.target.classList.contains('module__close')) {
        this.closeModule(module);
        this.statusImg = false;
      } else if (event.target.dataset.type === 'object') {
        this.openObjectAlert(module);
      } else if (event.target.dataset.type === 'promo') {
        this.openPromoAlert(module);
      } else if (event.target.dataset.name === 'sendAlert'){
        this.setAlertValue(event, module);
      } else if (event.target.dataset.name === 'cancelAlert'){
        this.closeModule(module);
      } else if (event.target.dataset.name === 'sendOrderPhoto'){
        this.setLoader();
        this.sendOrderPhoto(module).then(() => {
          this.removeLoader();
          alert('Заявка принята');
          this.closeModule(module);
        })
      } else if (event.target.dataset.name === 'cancelOrderPhoto'){
        this.closeModule(module);
      } else if (event.target.dataset.btn === 'search'){
        this.renderResponsible(module);
      } else if (event.target.dataset.responsible === 'select'){
        this.closeModule(module);
        this.setNewResponsible(event.target.dataset.login);
      }
    })
    document.onkeydown = (event) => {
      if (this.statusImg){
        if (event.code === 'ArrowRight'){
          this.nextImg(module);
        } else if (event.code === 'ArrowLeft'){
          this.previousImg(module);
        }
      }
      if (event.code === 'Escape'){
        this.closeModule(module);
        this.statusImg = false;
      } else if (event.key === 'Enter' && module.querySelector('.responsible__list')){
        this.renderResponsible(module);
      }
    }
  }
  setNewResponsible(loginResponsible){
    app.getJson(app.objAPI, {
      action: 'newResponsible',
      reqNumber: UID,
      responsible: loginResponsible,
      author: login,
    }).then(data => {
      data.result === 'ok' && location.reload();
    })
  }
  renderResponsible(module){
    const inputs = module.querySelectorAll('INPUT[type="search"]');
    const response = {};
    let checkInputValue = '';
    for (let input of inputs){
      response[input.name] = input.value;
      checkInputValue += input.value;
    }
    if (checkInputValue.length === 0) {
      return
    }
    app.getJson(app.listUsers, response).then(data => {
      module.querySelector('.responsible__list').innerHTML = '';
      console.log(data)
      for (let item of data){
        module.querySelector('.responsible__list').insertAdjacentHTML('beforeend',
          `<p class="responsible__item" 
                        data-responsible="select" 
                        data-login="${item.LOGIN}">
                        ${item.LAST_NAME} ${item.NAME}
                        <span>
                          ${item.WORK_DEPARTMENT}
                        </span>
                    </p>`)
      }
    })
  }
  closeModule(module){
    module.remove();
    const htmlDom = document.querySelector('HTML');
    htmlDom.removeAttribute("style");
  }

  openImg(){
    const layoutImg = `<div class="arrow__wrap-left">
                          <span class="arrow-left"></span>
                        </div>
                        <div class="module__img-wrap">
                          <img class="open-img" src="${this.currentImg.dataset.img}" alt="">                            
                        </div>
                        <div class="arrow__wrap-right">
                          <span class="arrow-right"></span>
                        </div>`
    this.openModule(layoutImg);
    this.statusImg = true;
  }
  previousImg(module){
    if(this.currentImg.previousElementSibling){
      this.currentImg = this.currentImg.previousElementSibling;
      module.remove();
      this.openImg();
    }
  }
  nextImg(module){
    if(this.currentImg.nextElementSibling){
      this.currentImg = this.currentImg.nextElementSibling;
      module.remove();
      this.openImg();
    }
  }

  setAlertValue(event, module){
    if (event.target.dataset.action === 'ADB'){
      if (document.querySelector('.select__gap').innerHTML !== 'Выбрать'){
        this.setLoader();
        this.sendADB().then(() => {
          this.removeLoader();
          this.closeModule(module);
        })
      }
    } else if (event.target.dataset.action === 'объект'){
      const requestAlert = {
        source: source,
        sourceId: UID,
        applicant: loginID,
        type: event.target.dataset.action,
        subtype: '',
        extype: '',
        reason: ''
      }
      const reason = document.querySelector('.form-alert__area');
      if (reason.value.length > 0){
        requestAlert.reason = document.querySelector('.form-alert__area').value;
        const subtype = document.querySelector('.select__subtype ');
        if (subtype.innerHTML !== 'Выбрать'){
          if (subtype.innerHTML === 'Ошибка в информации по объекту' || subtype.innerHTML === 'Что-то другое...'){
            const extype = document.querySelector('.select__extype');
            if (extype.innerHTML !== 'Выбрать'){
              requestAlert.subtype = subtype.innerHTML;
              requestAlert.extype = extype.innerHTML;
              this.setLoader();
              this.sendAlert(requestAlert).then(() => {
                this.removeLoader();
                this.closeModule(module);
              })
            }
          } else {
            requestAlert.subtype = subtype.innerHTML;
            console.log(requestAlert)
            this.setLoader();
            this.sendAlert(requestAlert).then(() => {
              this.removeLoader();
              this.closeModule(module);
            })
          }
        }
      }
    } else if (event.target.dataset.action === 'реклама'){
      const requestAlert = {
        source: source,
        sourceId: UID,
        applicant: loginID,
        type: event.target.dataset.action,
        subtype: '',
        extype: '',
        reason: '',
      }
      const reasonComment = document.querySelector('.form-alert__area');
      if (reasonComment.value.length > 0){
        const subtype = document.querySelector('.select__subtype ');
        if (subtype.innerHTML !== 'Выбрать'){
          if (subtype.innerHTML === 'Нет в рекламе'){
            const extypePromo = document.querySelector('.select__extype-promo');
            if (extypePromo.innerHTML !== 'Выбрать'){
              requestAlert.subtype = subtype.innerHTML;
              requestAlert.extype = extypePromo.innerHTML;
              requestAlert.reason = reasonComment.value;
              this.setLoader();
              this.sendAlert(requestAlert).then(() => {
                this.removeLoader();
                this.closeModule(module);
              })
            }
          } else if (subtype.innerHTML === 'Не верная информация в рекламе'){
            const extypeInfo = document.querySelector('.select__extype-info');
            if (extypeInfo.innerHTML !== 'Выбрать'){
              const reason = document.querySelector('.select__reason');
              if (reason.innerHTML !== 'Выбрать'){
                requestAlert.subtype = subtype.innerHTML;
                requestAlert.extype = extypeInfo.innerHTML;
                requestAlert.reason = reason.innerHTML;
                requestAlert.reason = reason.innerHTML + '. ' + reasonComment.value;
                this.setLoader();
                this.sendAlert(requestAlert).then(() => {
                  this.removeLoader();
                  this.closeModule(module);
                })
              }
            }
          }
        }
      }
    }
  }
  openAlert(){
    this.openModule(this.obj.privileges.card === 'ADB' ? this.alertADBLayout() : this.alertUserLayout());
    selectStyle('.form-alert__select', 'Выбрать');
  }
  alertADBLayout(){
    return `<div class="module__wrap">
              <div class="module__header">
                  <span class="module-title">Выберите причину</span>
              </div>
              <div class="form-alert">
                <div class="form-alert__wrap">
                  <select class="form-alert__select">
                    <option>Активная</option>
                    <option>Отмененная</option>
                    <option>Отложенная</option>
                    <option>Предварительно отменена</option>
                    <option>Выполненная</option>
                    <option>Ожидание сделки</option>
                  </select>  
                </div>                
                  <textarea placeholder="Введите коментарий" class="form-alert__area" 
                  name="" id="" cols="30" rows="10"></textarea>    
              </div>
              <button data-action="ADB" data-name="sendAlert" class="ui-btn ui-btn-light-border">Отправить</button>
              <button data-name="cancelAlert" class="ui-btn ui-btn-light-border">Отменить</button>
            </div>`
  }
  alertUserLayout(){
    return `<div class="module__wrap">
            <div class="module__header">
                <span class="module-title">Укажите причину</span>
            </div>
            <div class="module__alert">
              <div class="module__alert-item" data-type="object">Проблема с объектом</div>
              <div class="module__alert-item" data-type="promo">Проблема с рекламой</div>
            </div>
              <button data-name="cancelAlert" class="ui-btn ui-btn-danger-dark">Отменить</button>
            </div>`;
  }
  openObjectAlert(module){
    module.innerHTML = '';
    module.insertAdjacentHTML('beforeend',
      `<div class="module__wrap">
                                <div class="module__header">
                                    <span class="module-title">Проблема с объектом</span>
                                </div>
                                <div class="form-alert">
                                  <div class="form-alert__wrap">
                                    <select class="form-alert__subtype">
                                      <option>Дубль</option>
                                      <option>Смена ответственного</option>
                                      <option>Смена статуса</option>
                                      <option>Ошибка в информации по объекту</option>
                                      <option>Что-то другое...</option>
                                    </select>  
                                    <select class="form-alert__extype">
                                      <option>В адресе</option>
                                      <option>В фото или описание</option>
                                      <option>В характеристиках объекта</option>
                                    </select>  
                                  </div>                
                                    <textarea placeholder="Введите коментарий" class="form-alert__area" 
                                    name="" id="" cols="30" rows="10"></textarea>    
                                </div>
                                <button data-action="объект" data-name="sendAlert" class="ui-btn ui-btn-light-border">Отправить</button>
                                <button data-name="cancelAlert" class="ui-btn ui-btn-danger-dark">Отменить</button>
                                </div>`)
    selectStyle('.form-alert__subtype', 'Выбрать', 'select__subtype', '');
    selectStyle('.form-alert__extype', 'Выбрать', 'select__extype', 'isDisable-select');
    this.handlerSelectAlertObject();
  }
  handlerSelectAlertObject(){
    const allSelect = document.querySelectorAll('.select__gap');
    for (let select of allSelect){
      const observer = new MutationObserver(() => {
        const extype = document.querySelector('.select__extype');
        if (select.classList.contains('select__subtype')){
          if (select.innerHTML === 'Ошибка в информации по объекту' || select.innerHTML === 'Что-то другое...'){
            extype.classList.remove('isDisable-select');
            extype.innerHTML = 'Выбрать';
          } else {
            extype.classList.add('isDisable-select');
            extype.innerHTML = 'Выбрать';
          }
        }
      })
      observer.observe(select, {childList: true});
    }
  }
  openPromoAlert(module){
    module.innerHTML = '';
    module.insertAdjacentHTML('beforeend',
      `<div class="module__wrap">
                                <div class="module__header">
                                    <span class="module-title">Проблема с рекламой</span>
                                </div>
                                <div class="form-alert">
                                  <div class="form-alert__wrap">
                                    <select class="form-alert__subtype">
                                      <option>Нет в рекламе</option>
                                      <option>Не верная информация в рекламе</option>
                                    </select>  
                                    <select class="form-alert__extype-promo">
                                      <option>На N1</option>
                                      <option>На Циан</option>
                                      <option>На Яндекс-Недвижимости</option>
                                      <option>На Домклик</option>
                                      <option>Вообще нет в рекламе</option>
                                    </select>  
                                    <select class="form-alert__extype-info">
                                      <option>В адресе</option>
                                      <option>В фото или описание</option>
                                      <option>В цене</option>
                                      <option>В характеристиках объекта</option>
                                    </select>  
                                    <select class="form-alert__reason">
                                      <option>На N1</option>
                                      <option>На Циан</option>
                                      <option>На Яндекс-Недвижимости</option>
                                      <option>На Домклик</option>
                                      <option>Вообще везде</option>
                                    </select>  
                                  </div>                
                                    <textarea placeholder="Введите коментарий" class="form-alert__area" 
                                    name="" id="" cols="30" rows="10"></textarea>    
                                </div>
                                <button data-action="реклама" data-name="sendAlert" class="ui-btn ui-btn-light-border">Отправить</button>
                                <button data-name="cancelAlert" class="ui-btn ui-btn-danger-dark">Отменить</button>
                                </div>`)
    selectStyle('.form-alert__subtype', 'Выбрать', 'select__subtype', '');
    selectStyle('.form-alert__extype-promo', 'Выбрать', 'select__extype-promo', 'isDisable-select');
    selectStyle('.form-alert__extype-info', 'Выбрать', 'select__extype-info', 'isDisable-select');
    selectStyle('.form-alert__reason', 'Выбрать', 'select__reason', 'isDisable-select');
    this.handlerSelectAlertPromo();
  }
  handlerSelectAlertPromo(){
    const allSelect = document.querySelectorAll('.select__gap');
    for (let select of allSelect){
      const observer = new MutationObserver(() => {
        const extypePromo = document.querySelector('.select__extype-promo');
        const extypeInfo = document.querySelector('.select__extype-info');
        const reason = document.querySelector('.select__reason');
        if (select.classList.contains('select__subtype')){
          if (select.innerHTML === 'Нет в рекламе'){
            extypePromo.classList.remove('isDisable-select');
            extypeInfo.classList.add('isDisable-select');
            extypeInfo.innerHTML = 'Выбрать';
            reason.classList.add('isDisable-select');
            reason.innerHTML = 'Выбрать';
          } else if (select.innerHTML === 'Не верная информация в рекламе'){
            extypeInfo.classList.remove('isDisable-select');
            reason.classList.remove('isDisable-select');
            extypePromo.classList.add('isDisable-select');
            extypePromo.innerHTML = 'Выбрать';
          }
        }
      })
      observer.observe(select, {childList: true});
    }
  }

  async sendADB(){
    const obj = {
      action: 'setStatus',
      status: document.querySelector('.select__gap').innerHTML,
      comment: document.querySelector('.form-alert__area').value,
      id: this.obj.reqNumber,
      user: login,
    };
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    let raw = JSON.stringify(obj);
    let requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/objectViewer.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
  }
  async sendAlert(requestAlert){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    let raw = JSON.stringify(requestAlert);
    let requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Support/Help.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    alert('Форма отправлена');
  }

  async sendOrderPhoto(container){
    const text = container.querySelector('TEXTAREA').value;

    const request1Cnamed = {
      action: 'makePhotoCall',
      id: this.obj.reqNumber,
      user: login,
      comment: text,
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

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/notifyMaker.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
  }

  init() {
    this.handlerImg();
    this.handlerBtn();
    this.main.addEventListener('click', event => {
      if (event.target.dataset.description === 'edit'){
        event.target.dataset.description = 'save';
        event.target.innerHTML = 'сохранить';
        document.querySelector('.description__text').removeAttribute('disabled');
      } else if (event.target.dataset.description === 'save'){
        const comment = document.querySelector('.description__text');
        comment.setAttribute('disabled', 'disabled');
        event.target.innerHTML = 'Идет сохранение ...';
        event.target.classList.add('btn-loading');
        app.getJson(app.objAPI, {
          action: 'setComment',
          reqComment: comment.value.replace(/\n/g, ` *EOL `),
          id: UID,
        }).then(data => {
          console.log(data)
          event.target.dataset.description = 'edit';
          event.target.innerHTML = 'редактировать';
          event.target.classList.remove('btn-loading');
        })
      } else if (event.target.dataset.price === 'edit'){
        event.target.dataset.price = 'save';
        event.target.innerHTML = 'сохранить';
        document.querySelector(`INPUT[name='price']`).classList.toggle('visibility');
        document.querySelector(`INPUT[name='reqOverstatePrice']`).classList.toggle('visibility');
        document.querySelector(`.about__toggle `).classList.toggle('visibility');
      } else if (event.target.dataset.price === 'save'){
        document.querySelector(`INPUT[name='price']`).classList.toggle('visibility');
        document.querySelector(`INPUT[name='reqOverstatePrice']`).classList.toggle('visibility');
        document.querySelector(`.about__toggle `).classList.toggle('visibility');
        this.handleChange(event.target);
      } else if (event.target.dataset.overstate === 'toggle'){
        document.querySelector('.reqOverstate').classList.toggle('visibility');
      } else if (event.target.dataset.open === 'deal'){
        event.target.dataset.deal !== 'null' && this.openCard(event.target.dataset.deal, event.target.dataset.open);
      } else if (event.target.dataset.choose === "responsible"){
        this.openModule(this.chooseResponsible());
      }
    })
  }
  chooseResponsible(){
    return `<div class="responsible">
              <div class="responsible__header">Поиск</div>
              <div class="responsible__search">
                <label class="responsible__label"> 
                  Фамилия
                  <input name="name" class="responsible__input" type="search">
                </label>
                <label class="responsible__label">
                  Филиал
                  <input name="department" class="responsible__input" type="search">
                </label>
                <button data-btn="search" class="responsible__search-btn"></button>
              </div>
              <div class="responsible__title">
                <span>Ответственный</span>
                <span>Филиал</span>
              </div>
              <div class="responsible__list"></div>
            </div>`
  }
  handleChange(elem){
    const priseInput = document.querySelector(`INPUT[name='price']`);
    const overstatePriseInput = document.querySelector(`INPUT[name='reqOverstatePrice']`);
    const toggleOverstate = document.querySelector(`.switch__open`);

    document.querySelector('.const-price').innerHTML = `${priseInput.value} тыс. ₽`;
    document.querySelector('.reqOverstateText').innerHTML = `В рекламе ${overstatePriseInput.value}`;

    if (toggleOverstate.checked && +this.obj.reqOverstate === 0 || !toggleOverstate.checked && +this.obj.reqOverstate === 1){
      this.sendOverstateChange(overstatePriseInput, toggleOverstate, elem);
    } else if (+this.obj.reqOverstatePrice !== +overstatePriseInput.value){
      this.sendOverstateChange(overstatePriseInput, toggleOverstate, elem);
    }

    if (+this.obj.price !== +priseInput.value){
      elem.innerHTML = 'Идет сохранение ...';
      elem.classList.add('btn-loading');
      app.getJson(app.objAPI, {
        action: 'setPrice',
        reqPrice: priseInput.value.split(' ').join(''),
        id: UID,
      }).then(data =>{
        console.log(data)
        elem.dataset.price = 'edit';
        elem.innerHTML = 'редактировать цену';
        elem.classList.remove('btn-loading');
      })
    }
  }

  sendOverstateChange(price, toggle, elem){
    elem.innerHTML = 'Идет сохранение ...';
    elem.classList.add('btn-loading');
    app.getJson(app.objAPI, {
      action: 'setOverstate',
      reqOverstate: toggle.checked ? '1' : '0',
      reqOverstatePrice: price.value,
      id: UID,
    }).then(data =>{
      console.log(data)
      elem.dataset.price = 'edit';
      elem.innerHTML = 'редактировать цену';
      elem.classList.remove('btn-loading');
    })
  }
}

class ChartCallView{
  constructor(arr, selectState) {
    this.arr = arr;
    this.selectState = selectState;
    this.ctx = document.getElementById('myChart').getContext('2d');
    this.month = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    this.dateChart = [];
    this.countCall = [];
    this.countView = [];
    this.countSelections = [];
    this.newCountView = [];
    this.newCountCall = [];
    this.newCountSelections = [];
  }

  /** init()
   * разбирает объект на данные
   * подготавливает график для отрисовки
   */
  init(){
    if (this.selectState){
      this.selectState.sort((a, b) => {
        return a.date - b.date;
      })
      for (let item of this.selectState){
        this.countSelections.push(item.countSelections);
      }
    }

    for (let item of this.arr) {
      const dayDot = getDateOfISOWeek(item.date, 2021).getDate();
      const monthDot = this.month[getDateOfISOWeek(item.date, 2021).getMonth()];
      let fullDate = dayDot + '. ' + monthDot;

      this.dateChart.push(fullDate);
      this.countCall.push(item.countCall);
      this.countView.push(item.countView);
    }
    this.newCountView = this.setPercent(this.countView);
    this.newCountCall = this.setPercent(this.countCall);
    this.newCountSelections = this.setPercent(this.countSelections);

    document.myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.dateChart, //Номер недели в нашем случае
        datasets: [],
        oldDataset: [],
      },
      options: {
        animations: {
          radius: {
            duration: 400,
            easing: 'linear',
            loop: (context) => context.active
          }
        },
        hoverRadius: 10,
        hoverBackgroundColor: 'white',
        interaction: {
          mode: 'nearest',
          intersect: false,
          axis: 'x'
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        },
        plugins: {
          legend:{
            position: 'bottom',
            labels: {
              usePointStyle: true,
            }
          },
          title: {
            display: true,
            text: 'Статистика просмотров на площадках'
          },
          interaction: {
            intersect: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label} ${context.dataset.oldDataset[context.dataIndex]}`;
              }
            }
          },
        },
      }
    });

    this.addDataset("Звонки", this.newCountCall, this.countCall, '#ffc600', '#ffc600',);
    this.addDataset("Просмотры", this.newCountView, this.countView,  '#102684',  '#102684',);
    this.addDataset("Подборки", this.newCountSelections, this.countSelections, '#2a9d15','#2a9d15');
  }

  /** setPercent(arr)
   * Переводит значения в процентное соотношение
   * @param arr
   * @returns {*[]}
   */
  setPercent(arr){
    let number = 0;
    let newArr = [];

    for (let item of arr){
      if (item > number){
        number = item;
      }
    }
    for (let item of arr){
      newArr.push((item*100/number).toFixed(2));
    }
    return newArr;
  }

  /** addDataset()
   * Заполняет график данными тем самым отрисовывая его
   * @param nameDataset массив(ось X)
   * @param dataDataset массив значений в процентах (ось Y)
   * @param oldDataset массив значений с начальными данными
   * @param colorV цвет Точки
   * @param colorL цвет линии
   */
  addDataset(nameDataset, dataDataset, oldDataset, colorV, colorL){
    const newDataset = {
      label: nameDataset,
      backgroundColor: colorV,
      borderColor: colorL,
      borderWidth: 5,
      data: dataDataset,
      oldDataset: oldDataset,
      pointRadius: 5,
      pointStyle: 'circle',
    };
    document.myChart.data.datasets.push(newDataset);
    document.myChart.data.oldDataset.push(newDataset);
    document.myChart.update();

  }
}

const app = new App();
app.getJson(app.objAPI, {
  user: login,
  userId: loginID,
  source: source,
  id: UID,
}).then(data => {
  console.log(data)
  app.obj = data;
  if (source === '1c'){
    app.getJson(app.additionalAPI, {
      reqNumber: UID
    }).then(data => {
      if (data.result === 'ok'){
        console.log(data.state)
        app.additional = data.state;
        app.init();
      }
    })
  } else {
    app.init();
  }
});

function selectStyle(select, firstWord, secondClass, isDisable){
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
      class: `select__gap ${secondClass} ${isDisable}`,
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

function getDateOfISOWeek(w, y) {  //функция перевода недели года в дату
  const simple = new Date(y, 0, 1 + (w - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4)
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}
