const UID = atob(objectUID);

class Promotion {
  constructor() {
    this.container = document.querySelector('.promotion');
    this.settingPlatform = '';
  }

  init(){
    document.querySelector('.promotion').scrollIntoView();
    this.container.insertAdjacentHTML('beforeend', new RenderTop(this.settingPlatform.balance).init());
    new Avito(this.settingPlatform['avito-domofond'], this.settingPlatform.render['avito-domofond']).render();
    new HandlerTop(this.container).init();
    // this.setPlatformsClass();
    basket = new Basket();
  }
  // setPlatformsClass(){
  //   for (let key in this.settingPlatform){
  //     if (key === 'avito-domofond'){
  //       new Avito(this.settingPlatform[key]).render();
  //     }
  //   }
  // }
  async getSetting(){
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: {"Content-Type": "application/json; charset=utf-8"},
      body: JSON.stringify({
        reqNumber: UID,
        activeUser: login,
        userId: userId,
      })
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/adFactory.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    let jsonA = await response.json();
    this.settingPlatform = jsonA;
    console.log(jsonA)
  }
}

class RenderTop{
  constructor(balance) {
    this.balance = balance;
  }
  init(){
    return `<div class="save-change">
              <div class="save-change__group"> 
                <button data-save="all" class="ui-btn ui-btn-success">Применить</button>
                <button data-save="no" class="ui-btn ui-btn-link save-change__btn">Отменить</button>
              </div>
            </div>
            <input class="mobile-toggle__input" id="menu__toggle" type="checkbox">
            <label class="mobile-toggle__label" for="menu__toggle"> 
              <span class="mobile-toggle__span"></span>
            </label>
            <div class="header">
            <div class="place">
              <span data-place="avito" class="place__btn place__btn-avito"></span>
              <!-- <span data-place="domclick" class="place__btn place__btn-domclick"></span>
              <span data-place="n1" class="place__btn place__btn-n1"></span>
              <span data-place="yandex" class="place__btn place__btn-yandex"></span>
              <span data-place="yola" class="place__btn place__btn-yula"></span> -->
            </div>
            <div class="header__buttons"> 
              <button data-table="show" class="ui-btn price-btn">${this.balance} руб.</button>
              <span data-basket="show" class="basket__btn"></span>
              <span class="basket__count isVisible"></span>
            </div>
                <div class="basket isVisible"> 
                  <span class="basket__title">Корзина пуста</span>
                  <div class="basket__total"> 
                    <span class="basket__title">Общая сумма:</span>
                    <span class="basket__title">0 руб.</span>
                  </div>
                </div>
            </div>
            <div class="header__container isVisible">
              <table class="header__table"> 
              </table>
              <span data-table="close" class="header__close"></span>
            </div>
            <div class="platforms"></div>`
  }
}
class HandlerTop{
  constructor(container) {
    this.container = container;
    this.platformList = {
      4: "Yula",
      5: "Yandex",
      10: "CIAN",
      11: "DomClick",
      13: "AVITO",
    }
    this.platformListRevers = {
      'AVITO/Domofond' : 13,
    }
    this.platformNameServer = {
      'AVITO/Domofond': 'avito-domofond',
    }
  }
  init(){
    this.container.addEventListener('click', event => {
      if (event.target.dataset.basket === 'show'){
        document.querySelector('.basket').classList.toggle('isVisible');
      } else if (event.target.dataset.place === 'avito'){
        new Avito(promotion.settingPlatform['avito-domofond'], promotion.settingPlatform.render['avito-domofond']).render();
        this.setAccordion();
      } else if (event.target.dataset.save === 'no'){
        document.querySelector('.save-change').classList.add('save-change_close');
        setTimeout(()=> {
          window.location.reload()
        }, 500);
      } else if (event.target.dataset.save === 'all'){
        if (basket.basket.length > 0){
          if (this.checkPay()){
            document.querySelector('.save-change').classList.add('save-change_close');
            this.setChangePlatform(promotion.settingPlatform.balance);
          }
        } else if (basket.offOption.length > 0){
          this.delOptions();
        }
      } else if (event.target.dataset.table === 'show'){
        let historyBody = new Object();
        historyBody.action = 'getHistory';
        historyBody.reqNumber = UID;
        this.getData(historyBody).then(data => {
          if (data){
            this.showHistory(data);
          }
        });
      } else if (event.target.dataset.table === 'close'){
        document.querySelector('.header__container').classList.toggle('isVisible');
      }
    })
    this.setAccordion();
  }
  checkPay(){
    let countPrice = '';
    for (let item of basket.basket){
      countPrice += item.price;
    }

    let payBody = new Object();
    payBody.action = 'checkCost';
    payBody.price = countPrice;
    payBody.activeUser = login;
    payBody.userId = userId;
    this.getData(payBody).then((data) => {
      // if (data.status === 'Ok'){
      //   document.querySelector('.price-btn').innerHTML = `${data.currentLimit} руб.`;
      //   document.querySelector('.save-change').classList.add('save-change_close');
      //   this.setChangePlatform(data.currentLimit);
      // }
    })
    return countPrice <= promotion.settingPlatform.balance
  }
  setChangePlatform(currentLimit){
    let history = [];
    for (let item of basket.basket){
      let find = promotion.settingPlatform.render[this.platformNameServer[item.platform]].find(itemArr => itemArr.selector === item.options || itemArr.option === item.options);
      history.push({
        'reqNumber': UID,
        'platform': this.platformListRevers[item.platform],
        'options' : item.options,
        'cost': item.price,
        'balance': currentLimit,
        'author': login,
        'estimated': getDate(+find.duration),
        'type': 'Добавление услуги',
      })
    }
    function getDate(countDate){
      let nowDate = new Date();
      let date = new Date (nowDate.setDate(nowDate.getDate() + countDate));
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }
    const bodyPlatform = new Object();
    bodyPlatform.action = 'writeHistory';
    bodyPlatform.history = history;
    bodyPlatform.userId = userId;
    console.log(history);
    this.getData(bodyPlatform).then(()=>{
      window.location.reload()
    })
  }
  delOptions(){
    let history = [];
    for (let item of basket.offOption){
      history.push({
        'reqNumber': UID,
        'platform': this.platformListRevers[item.platform],
        'options' : item.options,
        'author': login,
        'type': 'Отключение услуги',
      })
    }
    const bodyPlatform = new Object();
    bodyPlatform.action = 'delOption';
    bodyPlatform.history = history;
    console.log(history);
    this.getData(bodyPlatform).then(()=>{
      window.location.reload()
    })
  }
  async getData(request1Cnamed){
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

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/adFactory.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    let jsonA = await response.json();
    return jsonA;
  }

  showHistory(data){
    console.log(data)
    const table = document.querySelector('.header__table');
    table.innerHTML = '';
    table.insertAdjacentHTML('beforeend',
      `<thead class="table-header">
        <tr>
        <td>Дата</td>
        <td>Заявка</td>
        <td>Площадка</td>
        <td>Опция</td>
        <td>Сумма</td>
        <td>Остаток</td>
        </tr>
        </thead>`);
    for (let item of data){
      table.insertAdjacentHTML('beforeend',
        `<tr>
          <td data-label="Дата">${item.created.split(" ")[0].split('-').reverse().join('.')}</td>
          <td data-label="Заявка">${item.UID}</td>
          <td data-label="Площадка">${this.platformList[item.platform]}</td>
          <td data-label="Опция">${item.options}</td>
          <td data-label="Сумма">${item.cost}</td>
          <td data-label="Остаток">${item.balance}</td>
        </tr>`);
    }
    document.querySelector('.header__container').classList.toggle('isVisible');
  }
  setAccordion(){
    const acc = document.getElementsByClassName("slider__main");

    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        const panel = this.parentElement.parentElement.nextElementSibling;
        if (panel.style.maxHeight){
          panel.style.maxHeight = null;
          panel.style.overflow = 'hidden';
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
          panel.style.overflow = 'overlay';
          setTimeout(()=>{
            panel.style.overflow = 'visible';
          },300)
        }
      });
    }
  }
}

class Avito{
  constructor(platform, price) {
    this.container = document.querySelector('.platforms');
    this.platform = platform;
    this.price = price;
    this.sortPrice = { 'Pack': [] };
  }
  getPrice(){
    for (let item of this.price){
      if (item.selector === 'Pack'){
        this.sortPrice[item.selector][item.option] = item.price
      } else {
        this.sortPrice[item.selector] = item.price;
      }
    }
  }
  render(){
    this.getPrice();
    console.log(this.platform);
    console.log(this.sortPrice);
    this.container.innerHTML = '';
    this.container.insertAdjacentHTML('beforeend',
      `<div class="promotion_place avito">
              <div class="accordion">
              ${this.platform.position === 'on' ? `<p class="accordion__text">Размещен до ${this.platform.estimated.split(" ")[0].split('-').reverse().join('.')}</p>` : ''}
                <span class="promotion__logo promotion__logo-avitodom"></span>
                <label class="switch switch_margin">
                  <input data-price="${this.sortPrice.free}" data-options="free" data-action="Размешение на площадке" name="AVITO/Domofond" 
                      class="switch__open" name="AvitoDomofondOnline" type="checkbox" 
                      ${this.platform.position === 'on' ? 'checked' : ''}>
                  <span class="slider slider__main"></span>
                </label>
                <span class="online ${this.platform.status === 'online' ? 'online_green' : ''}">
                  ${this.platform.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              <div class="panel panel__three-column" ${this.platform.position === 'on' ? 'style="max-height: fit-content; overflow: visible;"' : ''}>
                <div class="panel__item">
                  <span class="panel__text">XL</span>
                  <label class="switch">
                    <input data-price="${this.sortPrice.XL}" data-action="XL" data-options="XL" name="AVITO/Domofond" type="checkbox" 
                      ${this.platform.selectors.XL ? 'checked' : ''}
                      ${this.platform.selectors.Highlight || this.platform.selectors.Pack ? 'disabled' : ''}
                      >
                    <span class="slider"></span>
                  </label>
                  <span class="panel__text">${this.sortPrice.XL} ₽</span>
                  <span class="panel__text">${this.platform.selectors.XL
        ? `до ${this.platform.selectors.XL[0].split(" ")[0].split('-').reverse().join('.')}`
        : ''}</span>
                </div>
                <div class="panel__item">
                  <span class="panel__text">Выделение цветом</span>
                  <label class="switch">
                    <input data-price="${this.sortPrice.Highlight}" data-action="Выделение цветом" data-options="Highlight" name="AVITO/Domofond" type="checkbox" 
                      ${this.platform.selectors.Highlight ? 'checked' : ''}
                      ${this.platform.selectors.XL || this.platform.selectors.Pack ? 'disabled' : ''}
                      >
                    <span class="slider"></span>
                  </label>
                  <span class="panel__text">${this.sortPrice.Highlight} ₽</span>
                  <span class="panel__text">${this.platform.selectors.Highlight
        ? `до ${this.platform.selectors.Highlight[0].split(" ")[0].split('-').reverse().join('.')}`
        : ''}</span>
                </div>
                <div class="panel__item isVisible">
                  <span class="panel__text">Премиум на Domofond</span>
                  <label class="switch">
                    <input data-price="520" data-action="Премиум на Domofond" name="Domofond" type="checkbox" 
                      ${this.platform.selectors.premium ? 'checked' : ''}>
                    <span class="slider"></span>
                  </label>
                  <span class="panel__text">520 ₽</span>
                </div>
                <div class="panel__item">
                  <span class="panel__text">Поднятие</span>
                  <select name="AvitoDomofondIncrease" class="panel__select panel-avito">
                    <option selected>Выбрать</option>
                    <option>x10 на 7 дней - 1830 ₽</option>
                    <option>x10 на 1 день - 540 ₽</option>
                    <option>x5 на 7 дней - 1070 ₽</option>
                    <option>x5 на 1 день - 300 ₽</option>
                    <option>x2 на 7 дней - 540 ₽</option>
                    <option>x2 на 1 день - 150 ₽</option>
                  </select>
                  <span class="panel__text">${this.platform.selectors.Pack
        ? `до ${this.platform.selectors.Pack[0].split(" ")[0].split('-').reverse().join('.')}`
        : ''}</span>
                </div>
              </div>
            </div>`)
    new HandlerAvito(this.platform, this.sortPrice.Pack).init();
  }
}
class HandlerAvito{
  constructor(platform, pricePack) {
    this.container = document.querySelector('.avito');
    this.platform = platform;
    this.pricePack = pricePack;
    this.selectValue = {
      'x10_7': `x10 на 7 дней - ${this.pricePack.x10_7} ₽`,
      'x10_1': `x10 на 1 день - ${this.pricePack.x10_1} ₽`,
      'x5_7': `x5 на 7 дней - ${this.pricePack.x5_7} ₽`,
      'x5_1': `x5 на 1 день - ${this.pricePack.x5_1} ₽`,
      'x2_7': `x2 на 7 дней - ${this.pricePack.x2_7} ₽`,
      'x2_1': `x2 на 1 день - ${this.pricePack.x2_1} ₽`,
    };
    this.selectValueRevers = {
      'x10 на 7 дней': 'x10_7',
      'x10 на 1 день': 'x10_1',
      'x5 на 7 дней': 'x5_7',
      'x5 на 1 день': 'x5_1',
      'x2 на 7 дней': 'x2_7',
      'x2 на 1 день': 'x2_1',
    }
  }
  init(){
    this.setSelect();
    this.handlerCheckbox();
    this.handlerSelect();
  }
  setSelect(){
    let valueDisable = '';
    let selectWord = null;
    if (this.platform.selectors.Pack){
      selectWord = this.selectValue[this.platform.selectors.Pack[1]];
    } else if (this.platform.selectors.length !== 0){
      valueDisable = 'eventNone';
    }
    selectStyle('.panel-avito', 'avito-select',`${selectWord ? selectWord : 'Выбрать'}, ${valueDisable}`);
  }
  handlerCheckbox(){
    const allCheckbox = this.container.querySelectorAll(`INPUT[type='checkbox']`);
    for (let check of allCheckbox){
      if (!check.classList.contains('switch__open')){
        check.addEventListener('change', event => {
          if (check.checked) {
            basket.basket.push({
              price: event.target.dataset.price,
              action: event.target.dataset.action,
              platform: event.target.name,
              options: event.target.dataset.options,
            })
            basket.renderBasket();
            document.querySelector('.save-change').classList.add('save-change_active');
            document.querySelector('.place').classList.add('eventNone');
            document.querySelector('.platforms').classList.add('eventNone');
          } else {
            const find = basket.basket.find(item => item.action === event.target.dataset.action && item.platform === event.target.name);
            if (find){
              basket.basket.splice(basket.basket.indexOf(find), 1);
            } else {
              basket.offOption.push({
                options: event.target.dataset.options,
                platform: event.target.name,
              })
              document.querySelector('.save-change').classList.add('save-change_active');
              document.querySelector('.place').classList.add('eventNone');
              document.querySelector('.platforms').classList.add('eventNone');
            }
          }
        })
      } else {
        check.addEventListener('change', event => {
          if (check.checked){
            basket.basket.push({
              price: event.target.dataset.price,
              action: event.target.dataset.action,
              platform: event.target.name,
              options: event.target.dataset.options,
            })
            basket.renderBasket();
            document.querySelector('.save-change').classList.add('save-change_active');
            document.querySelector('.place').classList.add('eventNone');
            document.querySelector('.platforms').classList.add('eventNone');
          } else {
            const find = basket.basket.find(item => item.action === event.target.dataset.action && item.platform === event.target.name);
            if (find){
              basket.basket.splice(basket.basket.indexOf(find), 1);
              basket.renderBasket();
            } else {
              basket.offOption.push({
                options: event.target.dataset.options,
                platform: event.target.name,
              })
              document.querySelector('.save-change').classList.add('save-change_active');
              this.container.querySelector('.accordion').classList.add('eventNone');
              document.querySelector('.place').classList.add('eventNone');
            }
          }
        })
      }
    }
  }
  handlerSelect(){
    const selectInput = document.querySelectorAll('.select__gap');
    for (let item of selectInput){
      const observer = new MutationObserver(event => {
        if (event[0].target.textContent === 'Выбрать'){
          if (this.platform.selectors.Pack){
            basket.offOption.push({
              platform: 'AVITO/Domofond',
              options: this.platform.selectors.Pack[1],
            })
            document.querySelector('.save-change').classList.add('save-change_active');
            document.querySelector('.place').classList.add('eventNone');
            document.querySelector('.platforms').classList.add('eventNone');
          }
        } else {
          const arrSelect = event[0].target.textContent.split(' - ');
          const priceSelect = arrSelect[1].split(' ₽');
          basket.basket.push({
            price: priceSelect[0],
            action: arrSelect[0],
            platform: 'AVITO/Domofond',
            options: this.selectValueRevers[arrSelect[0]],
          })
          basket.renderBasket();
          document.querySelector('.save-change').classList.add('save-change_active');
          document.querySelector('.place').classList.add('eventNone');
          document.querySelector('.platforms').classList.add('eventNone');
        }
      })
      observer.observe(item, {childList: true});
    }
  }
}

class Basket {
  constructor() {
    this.basket = [];
    this.offOption = [];
  }
  renderBasket(){
    const basket = document.querySelector('.basket');
    let basketEmpty = ''
    if (this.basket.length !== 0){
      basketEmpty = 'Корзина';
      document.querySelector('.basket__count').classList.remove('isVisible');
    } else {
      basketEmpty = 'Корзина пуста';
      document.querySelector('.basket__count').classList.add('isVisible');
    }
    let countPrice = 0;
    basket.innerHTML = '';
    basket.insertAdjacentHTML('beforeend', `<span class="basket__title">${basketEmpty}</span>`);
    document.querySelector('.basket__count').innerHTML = this.basket.length;
    for (let item of this.basket){
      basket.insertAdjacentHTML('beforeend',
        `<div class="basket__item">
              <span class="basket__item-text">${item.platform}</span> 
              <span class="basket__item-text">${item.action}</span> 
              <span class="basket__item-text">${item.price} руб.</span> 
            <div>`);
      countPrice += +item.price;
    }
    const isFull = countPrice > promotion.settingPlatform.balance ? 'basket__title_red' : '';
    basket.insertAdjacentHTML("beforeend",
      `<div class="basket__total"> 
              <span class="basket__title">Общая сумма:</span>
              <span class="basket__title ${isFull}">${countPrice} руб.</span>
            </div>`)
  }
}

let basket = '';
const promotion = new Promotion();
promotion.getSetting().then(()=>{
  promotion.init();
})
function selectStyle(select, newSelect, firstWord, disable){
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
      class: `select__gap ${newSelect} ${disable}`,
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
};