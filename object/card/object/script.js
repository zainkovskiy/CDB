class App{
  constructor() {
    this.container = document.querySelector('.main');
    this.obj = {};
  }

  async getJson() {
    var request1Cnamed = new Object();
    request1Cnamed.user = login;
    request1Cnamed.source = source;
    request1Cnamed.id = UID;

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

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/objectViewer.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    this.obj = jsonA;
    this.init();
  }

  async setChart(){
    var request1Cnamed = new Object();
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

    let jsonA = await response.json();
    return jsonA;
  }

  init(){
    document.querySelector('.main').scrollIntoView();
    this.container.insertAdjacentHTML('beforeend', new Render(this.obj).render());
    this.setTopForStory();
    this.checkSlider();
    if (this.obj.privileges.card === 'full'){
      this.setChart().then(data => {
        if (data.promotionStats){
          new ChartCallView(data.promotionStats, data.SelectionStats).init();
        }
      });
    }
    console.log(btoa(UID))
    new Handler(this.obj).init();
  }

  setTopForStory(){
    const descriptionTop = document.querySelector('.description').getBoundingClientRect().top;
    const chartBottom = document.querySelector('.chart').getBoundingClientRect().bottom;
    document.querySelector('.story').setAttribute('style', `max-height: ${chartBottom - descriptionTop}px`);
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
      const slider = new ChiefSlider('.slider', {
        loop: false
      });
    }
  }
}

class Render {
  constructor(obj) {
    this.obj = obj;
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
      myMap.behaviors.disable('scrollZoom');
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        //... отключаем перетаскивание карты
        myMap.behaviors.disable('drag');
      }
    }
  }
  isChart(){
      const currentX = document.documentElement.clientWidth;
      if (currentX < 500){
        return `<div div class="chart" style="width:100%; height:auto;">
                <canvas id="myChart" width="320" height="320"></canvas>
              </div>`;
      } else {
        return `<div class="chart">
                <canvas id="myChart"></canvas>
             </div>`;
      }
  };
  isPhoto(){
    if (this.obj.photo){
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
    if (source === '1c'){
      return `<span class="about__logo-item" style="background-image: url(${this.obj.logo})"></span>`
    } else {
      let logos = '';
      for (let logo of this.obj.advURL){
        logos += `<a class="about__logo-item" href='${logo.URL}' target="_blank" style="background-image: url(${logo.logo})" title="нажмите чтобы перейти на площадку"></a>`
      }
      return logos
    }
  }
  getPrice(){
    if (this.obj.price === '0' || this.obj.totalArea === '0'){
      return `0`
    } else {
      return ((this.obj.price / this.obj.totalArea) * 1000).toFixed(0);
    }
  }
  getDocType(){
    if (source === '1c'){
      return this.obj.docType ? this.obj.docType : '';
    } else {
      return ''
    }
  }
  getClient(){
    console.log(this.obj)
    if (source === 'pars' || this.obj.privileges.card === 'full' || this.obj.docType === null || this.obj.docType === 'Без договора'){
      return `<div class="contacts__wrap">
                  <span class="title">Владелец</span>
                  <div class="contacts__name"> 
                    <img class="contacts__img" src="${this.obj.clientPhoto ? this.obj.clientPhoto : `../img/placeholder-user.png`}" alt="">
                    <span class="text">${this.obj.client ? this.obj.client : 'не указан'}</span>  
                  </div> 
                  <span class="text text-phone">
                  <svg class="contacts__phone" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.50224 7.77605C5.08572 8.96893 6.05266 9.93147 7.24818 10.5095C7.33565 10.551 7.4324 10.5689 7.52892 10.5616C7.62544 10.5543 7.71839 10.522 7.79863 10.4679L9.55895 9.29405C9.63681 9.24213 9.72638 9.21046 9.81956 9.2019C9.91275 9.19334 10.0066 9.20816 10.0926 9.24502L13.3858 10.6564C13.4977 10.7039 13.5911 10.7865 13.652 10.8917C13.7128 10.997 13.7378 11.1191 13.7232 11.2398C13.6191 12.0543 13.2217 12.8029 12.6054 13.3455C11.9891 13.8881 11.1961 14.1874 10.375 14.1875C7.83887 14.1875 5.40661 13.18 3.61329 11.3867C1.81997 9.59337 0.8125 7.16111 0.8125 4.62498C0.812543 3.80385 1.11189 3.01089 1.65448 2.39458C2.19707 1.77826 2.94571 1.38086 3.76021 1.27677C3.88088 1.26216 4.00302 1.28717 4.10824 1.34802C4.21346 1.40887 4.29605 1.50227 4.34357 1.61414L5.75619 4.91024C5.79272 4.9955 5.80761 5.08847 5.79952 5.18087C5.79144 5.27327 5.76062 5.36224 5.70983 5.43985L4.54008 7.22718C4.48684 7.30758 4.45537 7.40042 4.44874 7.49662C4.4421 7.59283 4.46054 7.6891 4.50224 7.77605V7.77605Z" stroke="#BDBDBD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  ${this.obj.clientPhone ? this.obj.clientPhone : 'не указан'}</span>
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

  render(){
    const photo = this.isPhoto();
    const createdDate = this.getDate(this.obj.created);
    const updatedDate = this.getDate(this.obj.updated);
    let priceMeter = this.getPrice();
    const logo = this.haveIsLogo();
    const historyLayout = this.historyLayout();
    const docType = this.getDocType();
    const client = this.getClient();
    const regExp = new RegExp('зарезервировано', 'i');
    const phoneOwner = this.getPhoneOwner();

    this.initMap();
    const chartView = this.isChart();
    return `<input class="mobile-toggle__input" id="menu__toggle" type="checkbox">
            <label class="mobile-toggle__label" for="menu__toggle"> 
              <span class="mobile-toggle__span"></span>
            </label>
            <nav class="change-page">
              <a class="ui-btn ui-btn-secondary ui-btn-icon-eye-opened change-page__link" href="../object/?source=${source}&id=${UID}&IDDEAL=${deal}">Объект</a>              
              <a class="ui-btn ui-btn-icon-page change-page__link ${this.obj.privileges.card === 'full'
      ? this.obj.privileges.card : 'isVisible'}" href="../agency/?source=${source}&id=${btoa(UID)}">ДОУ</a>
              <a class="ui-btn change-page__link ${this.obj.privileges.card === 'full'
      ? this.obj.privileges.card : 'isVisible'}" href="../photo/?source=${source}&id=${btoa(UID)}&IDDEAL=${deal}">Фото</a>
              <!-- <a class="ui-btn ui-btn-icon-page change-page__link 
              ${login === "zainkovskiyaa" || login === 'mischenkoiv' || login === 'osmanovnyu' || login === 'denishevalf' ? '' : 'isVisible'}" 
              href="../agency/?source=${source}&id=${UID}&IDDEAL=${deal}">ДОУ</a> -->

              <a class="ui-btn change-page__link ${this.obj.privileges.card === 'full'
      ? this.obj.privileges.card : 'isVisible'}" href="../promotion/?source=${source}&id=${btoa(UID)}&IDDEAL=${deal}">Реклама</a>
              <a class="ui-btn ui-btn-icon-done change-page__link ${this.obj.privileges.card === 'full'
      ? this.obj.privileges.card : 'isVisible'}" href="../buySell/?source=${source}&id=${btoa(UID)}&IDDEAL=${deal}">ПДКП/ДКП</a>
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
            <div class="about wrapper">
              <div class="about__date">
                <div class="about__header">                  
                  <p class="about__type p_margin title">Тип: 
                    <span class="text"> 
                        ${this.obj.roomCount ? `${this.obj.roomCount} к.` : ''}
                        ${this.obj.typeRealty ? this.obj.typeRealty : ''}
                    </span>
                  </p>              
                  <p class="about__type p_margin title">Заявка № 
                  <span class="text"> 
                      ${this.obj.reqNumber ? this.obj.reqNumber : ''}
                  </span>
                  </p>
                  <p class="title p_margin">Создано
                    <span class="text text_grey text_right">
                      ${createdDate ? createdDate : ''}
                    </span>
                  </p>    
                  <p class="title p_margin">Акутуализированно
                    <span class="text text_grey text_right">
                      ${updatedDate ? updatedDate : ''}
                    </span>
                  </p>
                </div>         
              </div>
              <div>
                <span class="about__title">${this.obj.street ? this.obj.street : ''}</span>
                <div class="about__address">     
                  <p class="text p_margin">${this.obj.city ? `${this.obj.city}` : ''} ${this.obj.area ? `${this.obj.area} р-н` : ''}</p>
                  ${this.obj.metroDistance ? this.obj.metroDistance >= 60 ? '' :
                    `<p class="text p_margin">
                    <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.41193 0L5.8457 4.47552L3.31259 0L1.20994 
                                  5.3986H0.845703V6H2.98146V5.42657H2.65034L3.69339 3.00699L5.5808 6H6.09405L7.98146 
                                  2.97902L9.04107 5.3986H8.66027V6H10.8457V5.3986H10.4649L8.41193 0Z" fill="#E84533"/>
                    </svg>
                    ${this.obj.metro ? this.obj.metro : ''}
                    <span class="text text_grey text_right">&#8226;  ${this.obj.metroDistance ? this.obj.metroDistance : ''} мин. пешком</span>
                  </p>` : ''}
                </div>
                ${this.obj.community ? `<p class="text p_margin">${this.obj.community}</p>` : ''}       
              </div>
              <div class="about__right">
                  <div class="about__price"> 
                    ${this.obj.reqOverstate === '1' ? `<span class="about__title">${this.obj.reqOverstatePrice ? this.obj.reqOverstatePrice : ''} тыс. ₽</span>` : ''}          
                    ${this.obj.reqOverstate === '1' ? `<span class="text text_grey">с завышением</span>` : ''}
                    <span class="${this.obj.reqOverstate === '1'? 'info__area-text strikethrough' : 'about__title'}">${this.obj.price ? this.obj.price : ''} тыс. ₽</span>  
                    <span class="text text_grey">${priceMeter} ₽/кв.м
                    </span>     
                  </div>                                
              </div>
              <div class="about__logo">${logo}</div>
              <span class="text about__logo-doc">${docType}</span>   
            </div>
            <div class="contacts wrapper">
              ${client}
              <span class="contacts__border ${source === 'pars' || client.length === 0 ? 'visible' : ''}"></span>
              <div class="contacts__wrap ${source === 'pars' ? 'visible' : ''}">
                  <span class="title">Риелтор</span> 
                  <div class="contacts__name"> 
                    <img class="contacts__img" src="${this.obj.ownerPhoto ? this.obj.ownerPhoto : `../img/placeholder-user.png`}" alt="photo">    
                    <a class="contacts__link text" onclick="event.preventDefault()" class="blog-p-user-name" id="bp_R1gY0o5G" href="/company/personal/user/${this.obj.ownerId}" bx-tooltip-user-id="${this.obj.ownerId}">
                        ${this.obj.owner ? this.obj.owner : ''}
                    </a>  
                  </div>                                         
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
                    <p class="title info__text margin_top">Год сдачи<span class="text text_right">${this.obj.buildDate ? this.obj.buildDate : ''}</span></p>
                    <p class="title info__text margin_top">Материал<span class="text text_right">${this.obj.material ? this.obj.material : ''}</span></p>          
                    <p class="title info__text margin_top">Этажей<span class="text text_right">${this.obj.totalFloors ? this.obj.totalFloors : ''}</span></p> 
                  </div>
            </div>
            <div class="btn-group wrapper mobile_visible"> 
              <button data-name="openCard" class="btn_edit ui-btn ui-btn-primary-dark 
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
              <button data-name="alert" class="btn_edit ui-btn ui-btn-danger-light">Вниманию модератора</button>
            </div>
            <div class="story wrapper mobile_visible ${this.obj.privileges.card === 'full' ? this.obj.privileges.card
      : 'isVisible'}">${historyLayout}</div>
            <div class="description wrapper">
                <span class="description__title">Описание</span>    
                <p class="description__text text p_margin">${this.obj.comment ? this.obj.comment : ' '}</p>
            </div>
            <div style="height: 400px" id="map"></div>
            ${chartView}`
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
        this.openCard(UID);
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
  openCard(idReq) {
    if (source === '1c'){
      location = `https://crm.centralnoe.ru/CDB/object/card/applicationForOneself/?id=${UID}&deal=${deal}`;
    } else {
      let readyString = `https://crm.centralnoe.ru/CDB/object/card/infoAboutClients/?id=${idReq}&deal=${deal}`;
      BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: 925, });
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
      } else if (event.target.dataset.name === 'sendAlert'){
        this.setLoader();
        this.sendAlert().then(() => {
          this.removeLoader();
          this.closeModule(module);
        })
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
      }
    })
    document.onkeydown = (event) => {
      if (this.statusImg){
        if (event.code === 'ArrowRight'){
          this.nextImg(module);
        } else if (event.code === 'ArrowLeft'){
          this.previousImg(module);
        } else if (event.code === 'Escape'){
          this.closeModule(module);
          this.statusImg = false;
        }
      }
    }
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
    } else {
      return;
    }
  }
  nextImg(module){
    if(this.currentImg.nextElementSibling){
      this.currentImg = this.currentImg.nextElementSibling;
      module.remove();
      this.openImg();
    } else {
      return;
    }
  }

  openAlert(){
    const layoutAlert = `<div class="module__wrap">
                          <div class="module__header">
                              <span class="module-title">Выберете причину</span>
                          </div>
                          <form class="form-alert">
                            <div class="form-alert__wrap">
                              <select class="form-alert__select">
                                  <option>Изменить ответственного Риелтора</option>
                                  <option>Изменить статус</option>
                                  <option>Изменить цену</option>
                                  <option>Иные причины</option>
                                  <option>Пожаловаться на дубль Заявки</option>
                                  <option>Проблема с адресом</option>
                                  <option>Проблема с выгрузкой в рекламу</option>
                                  <option>Проблема с информацией в Заявке</option>
                              </select>  
                            </div>                
                              <textarea placeholder="Введите коментарий для модератора" class="form-alert__area" 
                              name="" id="" cols="30" rows="10"></textarea>    
                          </form>
                          <button data-name="sendAlert" class="ui-btn ui-btn-light-border">Отправить</button>
                          <button data-name="cancelAlert" class="ui-btn ui-btn-light-border">Отменить</button>
                          </div>`
    this.openModule(layoutAlert);
    selectStyle('.form-alert__select', 'Изменить ответственного Риелтора');
  }
  async sendAlert(){
    const obj = this.setAlert();
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

    let response = await fetch("https://crm.centralnoe.ru/dealincom/exchange/modNotify.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    alert('Форма отправлена');
  }
  setAlert(){
    const textField = document.querySelector('.form-alert__area');
    const selectField = document.querySelector('.form-alert__select');
    const sendObj = {
      userName: login,
      cardId: this.obj.reqNumber,
      selectInput: selectField.options[selectField.selectedIndex].text,
      comment: textField.value,
    };
    return sendObj;
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
                let label = ` ${context.dataset.label} ${context.dataset.oldDataset[context.dataIndex]}`;
                return label;
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
app.getJson();

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
    if (select === '.metro__select'){
      $('<ul>',{
        class: 'select__list metro__list'
      }).insertAfter(selectGap);
    } else {
      $('<ul>',{
        class: 'select__list'
      }).insertAfter(selectGap);
    }

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
