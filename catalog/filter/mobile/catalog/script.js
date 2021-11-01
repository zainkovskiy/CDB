class Catalog{
  constructor() {
    this.container = document.querySelector('.catalog');
    this.name = '';
  }
  init(){
    this.container.insertAdjacentHTML('beforeend', new Layout(this.name).render());
    selectStyle('.type__select', 'Квартиры');
    new Handler().init();
    new Form().handler();
  }
  async getJson() {
    const request1Cnamed = new Object();
    request1Cnamed.client = 'zainkovskiyaa';
    request1Cnamed.action = 'authorization';

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

    let response = await fetch("../script/authorize.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    this.name = jsonA.name;
    console.log(jsonA)

    this.init();
  }
}

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
    if (select === '.metro__select'){
      $('<div>',{
        class: 'select__gap metro__gap',
        text: firstWord
      }).insertAfter($this);
    } else {
      $('<div>', {
        class: 'select__gap',
        text: firstWord
      }).insertAfter($this);
    }

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

class Layout{
  constructor(name) {
    this.name = name;
  }
  render(){
    return `<header class="header">
                <span class="header__logo"></span>   
            </header>
            <form class="form">
                <div class="source">
                  <div class="source__wrap"> 
                    <input checked class="source__input" name="1c" id="centr" type="checkbox">
                    <label class="source__label source__label-centr" for="centr"></label>
                  </div> 
                  <div class="source__wrap disabled"> 
                    <input disabled class="source__input" name="mls" id="mls" type="checkbox">
                    <label class="source__label source__label-mls" for="mls"></label>
                  </div>                   
                  <div class="source__wrap"> 
                    <input checked class="source__input" name="pars" id="all" type="checkbox">
                    <label class="source__label source__label-all" for="all"></label>
                  </div>
                </div>
                <div class="owner"> 
                  <input name="private" id="owner" type="checkbox">
                  <label for="owner">Только собственник</label>
                </div>
                <select class="type__select">
                  <option value="app" selected>Квартиры</option>
                  <option value="room">Комнаты</option>
                  <option value="house">Дома, коттеджи, дачи</option>
                  <option value="ground">Земля</option>
                  <option value="garage">Гаражи, парковки</option>
                </select>
                <div class="from-to margin">
                  <span class="from-to__text title">Цена</span>
                  <div class="from-to__wrap"> 
                    <div class="field field_left"> 
                      <input class="field__input" name="price" type="text" id="price-from" autocomplete="off" value="" aria-labelledby="placeholder-field">
                      <label class="field__placeholder" for="price-from" id="placeholder-field"> 
                        <div class="field__text">От</div>
                      </label>
                    </div>
                    <span>&#8212;</span>
                    <div class="field field_right"> 
                      <input class="field__input" name="price" type="text" id="price-to" autocomplete="off" value="" aria-labelledby="placeholder-field">
                      <label class="field__placeholder" for="price-to" id="placeholder-field"> 
                        <div class="field__text">До</div>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="count-room"> 
                  <span class="count-room__text title">Комнат</span>
                  <div class="count-room__wrap"> 
                    <input class="count-room__input" name="1" id="one" type="checkbox">
                    <label class="count-room__label" for="one">1</label>
                  </div>
                  <div class="count-room__wrap"> 
                    <input class="count-room__input" name="2" id="two" type="checkbox">
                    <label class="count-room__label" for="two">2</label>
                  </div>                  
                  <div class="count-room__wrap"> 
                    <input class="count-room__input" name="3" id="three" type="checkbox">
                    <label class="count-room__label" for="three">3</label>
                  </div>                  
                  <div class="count-room__wrap"> 
                    <input class="count-room__input" name="4" id="for" type="checkbox">
                    <label class="count-room__label" for="for">4</label>
                  </div>                  
                  <div class="count-room__wrap"> 
                    <input class="count-room__input" name="5" id="five" type="checkbox">
                    <label class="count-room__label" for="five">5+</label>
                  </div>
                </div>
                <div class="from-to margin">
                  <span class="from-to__text title">Площадь</span>
                  <div class="from-to__wrap"> 
                    <div class="field field_left"> 
                      <input class="field__input" name="area" type="text" id="area-from" autocomplete="off" value="" aria-labelledby="placeholder-field">
                      <label class="field__placeholder" for="area-from" id="placeholder-field"> 
                        <div class="field__text">От</div>
                      </label>
                    </div>
                    <span>&#8212;</span>
                    <div class="field field_right"> 
                      <input class="field__input" name="area" type="text" id="area-to" autocomplete="off" value="" aria-labelledby="placeholder-field">
                      <label class="field__placeholder" for="area-to" id="placeholder-field"> 
                        <div class="field__text">До</div>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="change"> 
                  <span class="change__text title">Указать</span>
                  <button disabled class="change__btn btn disabled">Метро</button>
                  <button disabled class="change__btn btn disabled">Район</button>
                </div>
                <div class="field margin"> 
                  <input class="field__input search__field" name="street" type="text" id="street" autocomplete="off" value="" aria-labelledby="placeholder-field">
                  <label class="field__placeholder" for="street" id="placeholder-field">
                    <div class="field__text">Улица</div>
                  </label>
                  <div class="search__items visible"></div>
                </div>
                <div class="from-to">
                  <span class="from-to__text title">Этаж</span>
                  <div class="from-to__wrap"> 
                    <div class="field field_left"> 
                      <input class="field__input" name="floors" type="text" id="floors-from" autocomplete="off" value="" aria-labelledby="placeholder-field">
                      <label class="field__placeholder" for="floors-from" id="placeholder-field"> 
                        <div class="field__text">От</div>
                      </label>
                    </div>
                    <span>&#8212;</span>
                    <div class="field field_right"> 
                      <input class="field__input" name="floors" type="text" id="floors-to" autocomplete="off" value="" aria-labelledby="placeholder-field">
                      <label class="field__placeholder" for="floor-to" id="placeholder-field"> 
                        <div class="field__text">До</div>
                      </label>
                    </div>
                  </div>
                </div>
                <button disabled class="btn margin disabled">На карте</button>
                <button data-show="show" data-count="0" class="btn btn__show hidden">Показать объекты</button>
                <button data-name="clear" type="reset" class="btn margin_last">Очистить фильтр</button>
            </form>
            <button class="btn__filter btn visible">Открыть фильтр</button>
            <div class="iframe-box"> 
                <span data-frame="close" class="iframe-close"></span>
                <iframe frameborder="0" class="iframe" name="iFrame"></iframe>
            </div>`
  }
}

class Handler{
  constructor() {
    this.catalog = document.querySelector('.catalog');
    this.currentElem = '';
  }

  init(){
    this.catalog.addEventListener('click', event => {
      const e = event.target;
      if (e.classList.contains('header__logo')){
        this.openMainPage();
      } else if (e.dataset.show === 'show'){
        event.preventDefault();
        new Visible().isFormClose();
        new Form().setCard();
      } else if (e.classList.contains('btn__filter')){
        new Visible().isFormOpen();
      } else if (e.dataset.name === 'alert'){
        this.checkElem();
        this.openIsVisibleBlock(e.dataset.req);
      } else if (e.dataset.alerttype){
          this.sendAlert('zainkovskiyaa', e.dataset.alerttype, e.dataset.req);
        this.checkElem();
      } else if (e.dataset.card === 'openlink') {
          this.openFrame();
      } else if (e.dataset.frame === 'close'){
          this.closeFrame();
      } else {
        this.checkElem();
      }
    })
  }
  openFrame(){
    const currentY = window.pageYOffset;
    document.body.setAttribute('style', 'overflow: hidden;');
    document.documentElement.setAttribute('style', 'overflow: hidden;');
    document.querySelector('.iframe-box').setAttribute('style', `z-index: 10; opacity: 1; top: ${currentY}px`);
    this.catalog.classList.remove('catalog');
  };

  closeFrame(){
    document.querySelector('.iframe-box').removeAttribute('style');
    document.body.removeAttribute('style');
    document.documentElement.removeAttribute('style');
    this.catalog.classList.add('catalog');
  }

  openMainPage(){
    window.location.href='../index.html';
  }

  checkElem(){
    if (this.currentElem){
      this.currentElem.classList.add('visible');
      this.currentElem = '';
    }
  }

  openIsVisibleBlock(data){
    const allBtn = document.querySelectorAll('.card__alert');

    for (let item of allBtn){
      if (data === item.dataset.req){
        item.classList.remove('visible');
        this.currentElem = item;
      }
    }
  }

  async sendAlert(author, alertType, UID) {
    const request1Cnamed = new Object();
    request1Cnamed.author = author;
    request1Cnamed.alertType = alertType;
    request1Cnamed.UID = UID;

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
    // let jsonA = await response.json();
  }
}

class Form {
  constructor() {
    this.form = document.querySelector('.form');
    this.formPack = {
      private: 0,
    };
    this.count = 0;
    this.request = true;
    this.currentStreet = '';
    this.streetContainer = document.querySelector('.search__items');
  }
  handler(){
    this.form.addEventListener('click', event => {
      if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox'){
        this.setLoader();
        this.init();
        this.getCount();
        console.log(this.formPack)
      } else if (event.target.dataset.name === 'clear'){
        for (let item of allInput){
          item.setAttribute("value", '');
          this.setDataToButton(0);
        }
      }
    });

    const selectInput = this.form.querySelector('.select__gap');
    const observer = new MutationObserver(event => {
      this.setLoader();
      this.init();
      this.getCount();
      console.log(this.formPack)
    })
    observer.observe(selectInput, {childList: true});

    const allInput = this.form.querySelectorAll('INPUT[type=text]');
    for (let item of allInput){
      item.addEventListener('change', () => {
        setTimeout(()=>{
          this.setLoader();
          this.init();
          this.getCount();
          console.log(this.formPack)
        },500)
      });
    }

    for (let item of allInput){
      item.addEventListener("keyup", event => {
        item.setAttribute("value", item.value);
        if (item.id === 'street'){
          const regStreet = new RegExp('ул', 'i');
          const regDistrict = new RegExp('мкр', 'i');
          const regLane = new RegExp('пер', 'i');
          if (item.value === ''){
            this.streetContainer.classList.add('visible');
          } else if (regStreet.test(item.value) || regDistrict.test(item.value) || regLane.test(item.value)){
            this.streetContainer.classList.remove('visible');
            const numberHouse = parseInt(event.target.value.replace(this.currentStreet, ''));
            this.renderFullAddress(numberHouse);
          } else {
            if (this.request){
              this.getStreet(event.target.value).then(data => {
                this.renderStreet(data);
              });
              this.request = false;
            }
          }
        }
      })
    }

    this.streetContainer.addEventListener('click', event => {
      let searchInput = '';
      for (let item of allInput){
        if (item.id === 'street'){
          searchInput = item;
        }
      }
      if (event.target.dataset.street){
        searchInput.value = event.target.dataset.street;
        this.currentStreet = event.target.dataset.street;
        currentValueInside = event.target.dataset.street;
        this.streetContainer.classList.add('visible');
      } else if (event.target.dataset.full){
        searchInput.value = event.target.dataset.full;
        this.currentStreet = event.target.dataset.full;
        currentValueInside = event.target.dataset.full;
        this.streetContainer.classList.add('visible');
      }
    })
  }

  init(){
    this.getCheckbox();
    this.getSelect();
    this.getInput();
    this.isForm();
  }

  async getStreet(value){
    let response = await fetch(`https://crm.centralnoe.ru/dealincom/factory/getaddress.php?req=${value}`);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    let jsonA = await response.json();
    return jsonA;
  }
  renderStreet(data){
    this.streetContainer.innerHTML = '';
    if (data.length === 0){
      this.streetContainer.classList.add('visible');
      this.request = true;
    } else {
      for (let street of data){
        this.streetContainer.insertAdjacentHTML('beforeend',
          `<p data-street="${street.prefix}${street.streetName}" class="search__item">${street.prefix}${street.streetName}</p>`)
      }
      this.streetContainer.classList.remove('visible');
      this.request = true;
    }
  }
  renderFullAddress(numberHouse){
    this.streetContainer.innerHTML = '';
    if (numberHouse){
      this.streetContainer.insertAdjacentHTML('beforeend',
        `<p data-full="${this.currentStreet}, ${numberHouse}" class="search__item">${this.currentStreet}, ${numberHouse}</p>`)
      for (let i = 0; i < 5; i++){
        this.streetContainer.insertAdjacentHTML('beforeend',
          `<p data-full="${this.currentStreet}, ${numberHouse}${i}" class="search__item">${this.currentStreet}, ${numberHouse}${i}</p>`)
      }
    } else {
      for (let i = 1; i < 6; i++){
        this.streetContainer.insertAdjacentHTML('beforeend',
          `<p data-full="${this.currentStreet}, ${i}" class="search__item">${this.currentStreet}, ${i}</p>`)
      }
    }
  }

  getCheckbox(){
    this.formPack.source = [];
    this.formPack.rooms = [];
    const checkbox = this.form.querySelectorAll('INPUT[type=checkbox]');
      for (let item of checkbox){
        if (item.classList.contains('source__input')){
          if (item.checked){
            this.formPack.source.push(item.name);
          }
        } else if (item.name === 'private'){
          if (item.checked){
            this.formPack.private = 1;
          } else {
            this.formPack.private = 0;
          }
        } else if (item.classList.contains('count-room__input')){
          if (item.checked){
            this.formPack.rooms.push(item.name);
          }
        }
      }
  }
  getSelect(){
    this.formPack.type = [];
    const select = this.form.querySelector('.type__select');
    this.formPack.type.push(select.value);
  }
  getInput(){
    this.formPack.price = [];
    this.formPack.area = [];
    this.formPack.floors = [];
    this.formPack.street = '';
    this.formPack.house = '';
    const allInput = this.form.querySelectorAll('INPUT[type=text]');
    //todo плохо работает (особенно с / и буквами
    // и если не выбирать номер дома из списка)
    for (let item of allInput){
      if (item.name === 'street'){
          if(item.value.includes(',')){
            console.log(this.currentStreet)
            let arrString = item.value.split(' ');
            arrString.splice(0,1);
            const house = arrString.splice(arrString.length -1, 1);
            this.formPack.house = house.join();
            let street = arrString.join().split(',');
            this.formPack.street = street.join(' ');
          } else {
            let arrString = item.value.split(' ')
            arrString.splice(0,1);
            this.formPack.street = arrString.join();
          }
      } else {
        if(item.value === ''){
          this.formPack[item.name].push(0);
        } else {
          this.formPack[item.name].push(item.value);
        }
      }
    }
  }

  isForm(){
    for (let key in this.formPack){
      if(this.formPack[key].length === 0){
        delete this.formPack[key]
      }
    }
  }

  setDataToButton(count){
    const btnShow = document.querySelector('.btn__show');

    if (count === 0){
      btnShow.setAttribute('data-count', count);
      // btnShow.setAttribute('disabled', 'disabled');
      btnShow.classList.add('hidden');
    } else {
      btnShow.classList.remove('hidden');
      // btnShow.removeAttribute('disabled');
      btnShow.setAttribute('data-count', count);
    }
    console.log(count)
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

  setCard(){
    this.init();
    this.getCards();
  }

  async getCards(){
    console.log(this.formPack)
      const sendObj = {
        object: this.formPack,
        action: 'get',
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json; charset=utf-8");
      const raw = JSON.stringify(sendObj);
      const requestOptions = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: "include",
        headers: myHeaders,
        body: raw
      };

      let response = await fetch("../script/search.php", requestOptions);
      if (!response.ok) {
        throw new Error('Ответ сети был не ok.');
      }
      const cards = await response.json();
      console.log(cards);

      catalog.container.insertAdjacentHTML('beforeend', new Card(cards).render());
  }

  async getCount(){
    const sendObj = {
      object: this.formPack,
      action: 'count',
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const raw = JSON.stringify(sendObj);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

   let response =  await fetch("../script/search.php", requestOptions)
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    let count = await response.json();

    if (count === null){
      this.setDataToButton(0)
    } else {
      this.setDataToButton(count.count)
    }
    this.removeLoader();
    console.log(count)
  }

}

class Card {
  constructor(cards) {
    this.cards = cards;
  }
  render(){
    const currentCards = document.querySelector('.card-items');
    if (currentCards){
      currentCards.remove();
    }
    const cards = this.isCard();
    return `<div class="card-items">${cards}</div>`
  }

  isPlace(card){
    if (!card.Logo){
      return `<span class="card__logo card__logo-centr"></span>`
    }
  }
  getPriceMeter(card){
    if (card.price && card.AreaTotal){
      return (card.Price / card.AreaTotal).toFixed(3) * 1000;
    } else {
      return '';
    }

  }

  isCard(){
    let cardLayout = ''
    for (let i = 0; i < 20; i++){

      let priceMeter = this.getPriceMeter(this.cards[i]);
      let place = this.isPlace(this.cards[i]);

      cardLayout += `<div class="card">
                        <img  class="card__img" src="${this.cards[i].MainPhoto}" 
                        alt="main-photo" onerror="this.src = '../img/placeholder.png'">
                        <div class="card__wrap"> 
                          <div class="card_left"> 
                            <a data-card="openlink" class="card__street" href="https://crm.centralnoe.ru/objectCard/object/?source=${this.cards[i].source}&id=${this.cards[i].reqNumber}" 
                                target="iFrame">${this.cards[i].Address ? this.cards[i].Address : this.cards[i].City}</a>
                            <p class="card__city">${this.cards[i].City ? this.cards[i].City : '---'}, <span>${this.cards[i].CityArea ? this.cards[i].CityArea : '---'}</span></p>
                            <div class="card__info"> 
                              <span class="card__area">${this.cards[i].AreaTotal ? this.cards[i].AreaTotal : '---'} кв.м.</span>
                              <span class="card__floor">${this.cards[i].Floor ? this.cards[i].Floor : '---'} эт.</span>
                              <span class="card__wall">${this.cards[i].Wall ? this.cards[i].Wall : '---'}</span>
                            </div>
                            <p class="card__price">${this.cards[i].Price ? this.cards[i].Price : '---'} тыс.₽ <span>${priceMeter} тыс.₽/кв.м</span></p>
                          </div>
                          <div class="card__right"> 
                            <a href="tel:${this.cards[i].ownernumber}" class="card__btn"><span class="card__btn-content card__btn-call"></span></a>   
                            <button class="card__btn"><span class="card__btn-content card__btn-selection"></span></button>   
                            <button data-req="${this.cards[i].reqNumber}" data-name="alert" class="card__btn"><span class="card__btn-content card__btn-alert"></span></button> 
                            <div data-req="${this.cards[i].reqNumber}" class="card__alert visible"> 
                              <button data-req="${this.cards[i].reqNumber}" data-alerttype="uncorArea" class="card__alert-btn">Неверная площадь</button>
                              <button data-req="${this.cards[i].reqNumber}" data-alerttype="uncorPrice" class="card__alert-btn">Неверная цена</button>
                              <button data-req="${this.cards[i].reqNumber}" data-alerttype="uncorPhone" class="card__alert-btn">Телефон не доступен</button>
                            </div>  
                          </div>
                          <div class="card__place">${place}</div>
                        </div>
                      </div>`
    }
    return cardLayout;
  }
}

class Visible{
  constructor() {
    this.form = document.querySelector('.form');
    this.btnFilter = document.querySelector('.btn__filter');
  }

  isFormClose(){
    this.form.classList.add('blur-on');
    setTimeout(() => {
      this.form.classList.add('visible');
    }, 500)
    this.btnFilter.classList.remove('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  isFormOpen(){
    this.form.classList.remove('visible');
    setTimeout(() => {
      this.form.classList.add('blur-off');
    }, 300)
    setTimeout(() => {
      this.form.classList.remove('blur-on');
      this.form.classList.remove('blur-off');
    }, 1000)
    this.btnFilter.classList.add('visible');
  }
}

const catalog = new Catalog();
catalog.getJson();

let currentValueInside = '';
document.body.addEventListener('click', event => {
  if (!event.target.classList.contains('search__item') && !event.target.classList.contains('search__field')){

    if (document.querySelector('.search__field').value !== currentValueInside){
      document.querySelector('.search__field').value = ' ';
      document.querySelector('.search__items').classList.add('visible');
    }
  }
})

// window.onscroll = () => {
//   const btn = document.querySelector('.btn__show');
//   const btnTop = btn.getBoundingClientRect().top;
//   const place = document.querySelector('.test');
//   const placeTop = place.getBoundingClientRect().top;
//   console.log('this is btnTop' + btnTop)
//   console.log('this is placeTop' + placeTop)
//   if (btnTop >= placeTop){
//       // btn.classList.add('fix');
//       btn.setAttribute('style', `top: ${placeTop + 10}px; height: fit-content;`)
//   }  else {
//       btn.removeAttribute('style')
//       // btn.classList.remove('fix');
//     }
// }