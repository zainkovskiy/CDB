const offer = atob(numberOffer);

class App{
  constructor() {
    this.container = document.querySelector('.main');
    this.ON = '';
  }

  init(){
    this.container.insertAdjacentHTML('beforeend', new Render(this.ON).render());

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

    new Handler(this.container, this.ON).init();
  }

  async getJson(raw) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: JSON.stringify(raw)
    };

    let response = await fetch(`https://crm.centralnoe.ru/dealincom/connector/Verification.php`, requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    return await response.json();
  }

}

class Render {
  constructor(obj) {
    this.obj = obj;
  }
  isPhoto(){
    let photoElem = '';
    for (let item of this.obj.photo){
    photoElem += `<div class="slider__item slider__photo" data-img=${item} style="background-image: url(${item})"></div>`
    }
    return photoElem;
  }
  initMap(){
    const cords = this.obj.cords;
    ymaps.ready(init);
    function init(){
      var myMap = new ymaps.Map("map", {
        center: cords,
        zoom: 17,
        controls: ['zoomControl', 'fullscreenControl'],
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
  isInfo(){
    if (this.obj.source === 'pars'){
      return ``
    } else {
      return `<div class="info wrapper">
              <div class="info__left">
                <p class="title info__text">Тип квартиры<span class="text">${this.obj.typeAppartment ? this.obj.typeAppartment : '----'}</span></p>
                <p class="title info__text">Планировка<span class="text">${this.obj.typeLayout ? this.obj.typeLayout : '----'}</span></p>
                <p class="title info__text">Санузел<span class="text">${this.obj.bathroom ? this.obj.bathroom : '----'}</span></p>          
                <p class="title info__text">Состояние<span class="text">----</span></p>          
              </div>
              <div class="info__right">
                <p class="title info__text">Тип собственности<span class="text">----</span></p>
                <p class="title info__text">Год сдачи<span class="text">${this.obj.houseBuildDate ? this.obj.houseBuildDate : '----'}</span></p>
                <p class="title info__text">Материал<span class="text">${this.obj.material ? this.obj.material : '----'}</span></p>          
                <p class="title info__text">Этажей<span class="text">${this.obj.floors ? this.obj.floors : '----'}</span></p>          
              </div>
            </div>`
    }
  }

  render(){
    console.log(this.obj)
    const photo = this.isPhoto();
    const info = this.isInfo();
    this.initMap();

    return `<div class="header"> 
                <div class="header__logo"></div>
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
            <div class="about wrapper"> 
              <div class="about__head"> 
                  <span class="about__title about_bold">${this.obj.city ? this.obj.city : '----'}, ${this.obj.street ? this.obj.street : '----'}</span>
                  <div class="about__price"> 
                    <span class="about__title about__row">${this.obj.price ? this.obj.price : '----'} тыс. ₽</span>           
                    <span class="text text_grey">${this.obj.price && this.obj.area ? ((this.obj.price / this.obj.area) * 1000).toFixed(0) : '----'} ₽/м<sup>2</sup></span>     
                  </div>     
              </div> 
              <div class="about__area"> 
                <div style="height: 300px; width: 100%;" id="map"></div>
                <div class="about__area-items"> 
                  <p class="title title_margin">Общая площадь<span class="about__area-text">${this.obj.area ? this.obj.area : '----'} м<sup>2</sup></span></p>
                  <p class="title title_margin">Жилая площадь<span class="about__area-text">${this.obj.livingArea ? this.obj.livingArea : '----'} м<sup>2</sup></span></p>
                  <p class="title title_margin">Площадь кухни<span class="about__area-text">---- м<sup>2</sup></span></p>
                  <p class="title title_margin">Этаж<span class="about__area-text">${this.obj.floor ? this.obj.floor : '----'}/${this.obj.floors ? this.obj.floors : '----'}</span></p>
                </div>
              </div>                
            </div>
            ${info}
            <div class="description  wrapper">
                <span class="description__title">Описание</span>    
                <p class="description__text text">${this.obj.comment ? this.obj.comment : '----'}</p>
            </div> 
            <div class="offer"> 
              <span class="offer__title">Введите код из СМС</span>
              <span class="offer__code">Проверочный код</span>
              <div class="offer__wrap"> 
                <input class="offer__input" type="text">
                <button data-offer="check" class="offer__btn" type="submit">Подтвердить размещение объекта</button>
              </div>
              <span data-open="offer" class="offer__offer">Публичная оферта</span>
            </div>`
  }
}

class Handler {
  constructor(container, obj) {
    this.container = container;
    this.obj = obj;
    this.carousel = document.querySelector('.carousel');
    this.currentImg = '';
  }

  init() {
    this.container.addEventListener('click', event => {
      if (event.target.classList.contains('slider__photo')){
        if (document.documentElement.clientWidth > 500){
          this.currentImg = event.target;
          this.openModule(this.openImg());
        }
      } else if (event.target.dataset.offer === 'check'){
        this.checkCode();
      } else if (event.target.dataset.open === 'offer'){
        this.openModule(this.offerLayout());
      }
    })
  }

  checkCode(){
    const userInputCode = document.querySelector('.offer__input');
    if (+userInputCode.value === +this.obj.code){
      userInputCode.classList.remove('isValid');
      app.getJson({
        action: 'valid',
        valid: offer,
      }).then(() =>{
        alert('Рекламный договор подтвержден');
        userInputCode.value = '';
      });
    } else {
      userInputCode.classList.add('isValid');
    }
  }
  openModule(layout){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    document.body.insertAdjacentHTML('afterbegin',
                  `<div style="top: ${currentY}px;" class="module">
                          <span class="module__close"></span>
                            ${layout}
                          </div>`);
    this.handlerModule();
  }
  openImg(){
    return `<div class="arrow-left_wrap"> 
              <span class="arrow-left"></span>
            </div>
            <div class="module__img-wrap">                             
              <img class="open-img" src="${this.currentImg.dataset.img}" alt="">                              
            </div>
            <div class="arrow-right_wrap"> 
              <span class="arrow-right"></span>
            </div>`
  }
  offerLayout(){
    return `<div class="module__offer"> 
<p>Публичная оферта</p>
<p>Договор оказания услуг по поиску покупателя</p>
<p>г. Новосибирск</p>
<p>ООО «ЦОК», именуемое в дальнейшем «АГЕНТСТВО», предлагает заключить договор на условиях и в порядке, определенных настоящей офертой, 
содержащей все существенные условия договора на оказание услуг любому юридическому лицу, индивидуальному предпринимателю, 
зарегистрированным в установленном порядке на территории Российской Федерации, а также любому дееспособному физическому лицу, 
именуемым в дальнейшем «ЗАКАЗЧИК», совместно именуемым «Стороны», о нижеследующем:</p>
<p>Общие положения</p>
<p>1.1. Договор-оферта (далее - Оферта) опубликован на официальном сайте АГЕНТСТВА по адресу: http://centralnoe.ru</p>
<p>1.2. Акцептом Оферты является заполнение формы на сайте, указанном в п.1.1. настоящего Договора. Договор-оферта считается заключенным 
с момента акцепта условий настоящей Оферты ЗАКАЗЧИКОМ.</p>
<p>1.3. Осуществляя акцепт Оферты, ЗАКАЗЧИК гарантирует, что ознакомлен, полностью и безоговорочно принимает все условия Оферты.</p>
<p>1.4. Совершая действия по акцепту Оферты, ЗАКАЗЧИК гарантирует, что он имеет законные права вступать в договорные отношения с АГЕНТСТВОМ.</p>
<p>Предмет договора</p>
<p>1.1 Агентство, обязуется оказать Заказчику услугу по поиску покупателя на объект недвижимости- Квартиры (далее объект).</p>
<p>1.2 Стартовая цена продажи объекта устанавливается с учетом пожеланий Заказчика, отраженной в акцепте.</p>
<p>1.3 Срок действия настоящего Договора 3 месяца.</p>
<p>Права и обязанности сторон</p>
<p>2.Агентство обязуется за собственный счет:</p>
<p>2.1 Осуществлять поиск потенциальных покупателей, проводить с ними переговоры, осуществлять прием обращений, анализ спроса, организацию показа объекта</p>
<p>2.2. По требованию Заказчика обеспечить профессиональную фотосъемку объекта с целью использования в рекламных объявлениях.</p>
<p>2.3. Оказать услуги по подбору рекламных площадок и размещению в них рекламных объявлений.</p>
<p>2.4. Проконсультировать Заказчика о необходимых улучшениях, влияющих на стоимость продаваемого Объекта.</p>
<p>3. В целях исполнения настоящего Договора Заказчик обязуется:</p>
<p>3.1. В течение одного года с момента заключения настоящего Договора не совершать сделок с покупателем, предложенным Агентством, 
ни лично, ни через доверенных лиц, до оплаты вознаграждения Агентству.</p>
<p>Особые условия</p>
<p>4.1 Заключая настоящий Договор Заказчик выражает свое согласие на обработку Агентством его персональных данных. 
Под которыми понимаются любые относящиеся к Заказчику сведения и информация на бумажных, которые были или будут переданы 
Агентству лично Заказчиком или поступят (поступили) в Агентство иным способом для заключения договора. 
Под обработкой персональных данных понимаются действия, включая сбор, систематизацию, накопление, хранение, уточнение, использование, 
распространение/передача и уничтожение, в том числе с использованием средств автоматизации. Не допускается публичное обнародование 
Агентством персональных данных Заказчика в СМИ. Стороны пришли к соглашению о том, что согласие может быть отозвано путем направления 
Агентству уведомления об отзыве письмом с уведомлением о вручении либо вручено лично под подпись представителю Агентства.</p>
<p>Агентство:  Центральное агентство недвижимости</p>
<p>Реквизиты : </p>
<p>Общество с ограниченной ответственностью «Центральная Оценочная Компания»</p>
<p>Юридический адрес: 630129, г. Новосибирск, ул. Рассветная, 8</p>
<p>ИНН/КПП: 5409004613/540901001</p>
<p>ОГРН: 1025403908276</p>
<p>Банковские реквизиты: </p>
<p>р/с 40702810316030000859</p>
<p>к/с 30101810200000000777</p>
<p>БИК 040407777</p>
<p>ФИЛИАЛ ПАО БАНК ВТБ В Г. КРАСНОЯРСКЕ Г. КРАСНОЯРСК</p>
<p>Директор: Захарова Татьяна Юрьевна</p>
<p>На основании Устава</p>
</div>`
  }
  handlerModule(){
    const module = document.querySelector('.module');

    module.addEventListener('click', event => {
      if (event.target.className === 'arrow-left'){
        if(this.currentImg.previousElementSibling){
          this.currentImg = this.currentImg.previousElementSibling;
          this.closeModule(module);
          this.openModule(this.openImg());
        } else {
          return;
        }
      } else if (event.target.className === 'arrow-right'){
        if(this.currentImg.nextElementSibling){
          this.currentImg = this.currentImg.nextElementSibling;
          this.closeModule(module);
          this.openModule(this.openImg());
        } else{
          return;
        }
      } else if (event.target.className === 'module__close'){
        this.closeModule(module);
      }
    })
  }
  closeModule(module){
    const htmlDom = document.querySelector('HTML');
    htmlDom.removeAttribute("style");
    module.remove();
  }
}

const app = new App();
app.getJson({
  action : "get",
  valid : offer
}).then(data => {
  if (data.result === 'ok'){
    app.ON = data;
    app.init();
  } else if (data.result === 'error'){
    openError();
    console.log(data);
  } else if (data.result === 'error1'){
    location.reload();
  }
});

function openError(){
  const htmlDom = document.querySelector('HTML');
  htmlDom.setAttribute("style", "overflow-y:hidden;");
  const currentY = window.pageYOffset;
  document.body.insertAdjacentHTML('afterbegin',
    `<div style="top: ${currentY}px;" class="error">
            <img class="error__img" src="img/error.jpg" alt="404">
          </div>`);
}







