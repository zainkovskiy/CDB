class Leads {
  constructor() {
    this.leads = [];
    this.container = document.querySelector('.page');
  }
  init(){
    this.container.insertAdjacentHTML('beforeend', new Layout().init());
    new Lead(this.leads).layout();
    selectStyle('.change__lead','Новый ЛИД')
    new Handler(this.container).init();
  }
}

class Layout {
  init(){
    return `<header class="header">
                <span class="header__logo"></span>   
            </header> 
            <select class="change__lead"> 
                <option>Новый ЛИД</option>
                <option>Квалифицирован</option>
            </select>
            <div class="leads"></div>`
  }
}

class Lead {
  constructor(leads) {
    this.leads = leads;
    this.container = document.querySelector('.leads');
  }
  layout(){
    for (let lead of this.leads){
      this.container.insertAdjacentHTML('beforeend',
        `<div class="lead"> 
                <div class="info"> 
                  <span data-name="lead" data-id="${lead.ID}" class="info__name">${lead.name}</span>
                  <span class="info__cost">${lead.cost}</span>
                  <span class="info__time">${lead.time && lead.time.split('T')[0].split('-').reverse().join('.')}</span>
                </div>
                <div class="buttons"> 
                  ${(lead.telNumber &&lead.telNumber.length > 0) ?
          `<a href="tel:${lead.telNumber[0].VALUE}" class="buttons__item buttons__phone"></a>`
          : ''
        }
                  <span class="buttons__item buttons__message isVisible"></span>
                  <span class="buttons__item buttons__chat isVisible"></span>
                </div> 
              </div>`)
    }
  }
}

class Handler {
  constructor(container) {
    this.container = container
  }
  init(){
    this.container.addEventListener('click', event => {
      if (event.target.classList.contains('header__logo')){
        this.openMainPage();
      } else if (event.target.dataset.name === 'lead'){
        this.setLoader();
        getData({
          action: 'getOne',
          UID: event.target.dataset.id,
        }).then(lead => {
          console.log(lead)
          this.openLead(lead);
          this.removeLoader();
        })
      } else if (event.target.dataset.name === 'contract'){
        this.openContract(event.target.dataset.id, event.target.dataset.phone);
      }
    })
    const observer = new MutationObserver(event => {
      console.log(event)
    })
    observer.observe(document.querySelector('.select__gap'), {childList: true});
  }
  sendSelectQualify(inputs, select, id, phone){
    const qualify = {
      phone: phone,
      action: 'setWin',
      category: select.innerHTML,
      UID: id,
      userId: loginID
    }
    inputs.forEach(input => {
      qualify[input.name] = input.value;
    })
    getData(qualify).then(() => {
      location.href = 'index.php';
    })
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
  getCall(timeline){
    let timeLineStory = '';
    for(let item of timeline){
      if (item.PROVIDER_TYPE_ID === "CALL") {
        timeLineStory += `<p class="card__subtitle">${item.SUBJECT}
                            <span class="card__subtitle-child">${item.DESCRIPTION}</span>
                            ${
                              +item.DESCRIPTION !== 3 &&
                              `<audio class="card__audio" src="${item.FILES[0].url}" controls></audio>`
                            }
                           </p>`
      }
    }
    return timeLineStory;
  }
  openLead(lead){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");
    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="card">
                      <div data-name="close-card" class="return"> 
                        <span class="return__arrow"></span>
                        <span class="return__text">Назад</span>
                      </div>
                      <div class="card__info"> 
                        <span data-id="${lead.ID}" ${lead.HAS_PHONE === 'Y' && `data-phone="${lead.PHONE[0].VALUE}"`} data-name="contract" class="btn">квалифицировать</span>
                        <span class="card__title">Лид</span>
                        <p class="card__subtitle">Телефон
                          ${lead.HAS_PHONE === 'Y' ?
      `<a class="card__subtitle-child" href="tel:${lead.PHONE[0].VALUE}">${lead.PHONE[0].VALUE}</a>`
      : ''
    }
                        </p>
                        <p class="card__subtitle">Риелтор 
                          <span class="card__subtitle-child">${lead.owner}</span>
                        </p>
                      </div>                                         
                      <div class="card__info"> 
                        <span class="card__title">История</span>  
                        ${lead.timeline.length > 0 && this.getCall(lead.timeline)}  
                      </div>
                    </div>`
    this.container.insertAdjacentHTML('beforeend', layout);
    document.querySelector('.card').classList.add('card_open');
    this.handlerCard('card');
  }
  handlerCard(select){
    document.querySelector(`.${select}`).addEventListener('click', event => {
      if (event.target.dataset.name === 'close-card') {
        document.querySelector('.card').classList.add('card_close');
        setTimeout(() => {
          this.closeModule(select);
        }, 500);
      }
    })
  }
  openContract(id, phone){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");
    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="module">
                      <div class="module__group">
                        <button data-id="${id}" data-qualify="yes" data-phone=${phone} class="module__btn module__btn_green">Сделку + Контакт</button>
                        <button data-id="${id}" data-qualify="no" data-type="lose" class="module__btn module__btn_red">Не целевой лид</button>
                        <button data-id="${id}" data-qualify="no" data-type="other" class="module__btn module__btn_red">Другое АН</button>
                        <button data-name="close" class="module__btn">Закрыть</button>
                      </div>
                    </div>`
    this.container.insertAdjacentHTML('beforeend', layout);
    this.handlerModule('module');
  }
  handlerModule(select){
    document.querySelector(`.${select}`).addEventListener('click', event => {
      if (event.target.dataset.name === 'close'){
        this.closeModule(select);
      } else if (event.target.dataset.name === 'close-card'){
        document.querySelector('.card').classList.add('card_close');
        setTimeout(() => {
          this.closeModule(select);
        }, 500);
      } else if (event.target.dataset.qualify === 'yes'){
        this.closeModule(select);
        this.openQualifyForm(event.target.dataset.id, event.target.dataset.phone);
      } else if (event.target.dataset.qualify === 'save'){
        const allInputs = document.querySelector(`.${select}`).querySelectorAll('INPUT');
        const selectType = document.querySelector(`.${select}`).querySelector('.select__gap ');
        this.sendSelectQualify(allInputs, selectType, event.target.dataset.id, event.target.dataset.phone);
        this.setLoader();
      } else if (event.target.dataset.qualify === 'no') {
        this.setLoader();
        this.setLoseQualify(event.target.dataset.id, event.target.dataset.type);
      }
    })
  }
  closeModule(select){
    document.querySelector('HTML').removeAttribute('style');
    document.querySelector(`.${select}`).remove();
  }
  openMainPage(){
    window.location.href='../index.html';
  }
  setLoseQualify(id, type){
    getData({
      action: 'setLose',
      UID: id,
      type: type,
    }).then(() => {
      location.href = 'index.php';
    })
  }
  openQualifyForm(id, phone){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");
    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="qualify">
                        <div class="qualify__wrap"> 
                          <span class="qualify__subtitle">Фамилия</span>
                          <input class="qualify__input" type="text" name="LAST_NAME" autocomplete="off">
                        </div>
                        <div class="qualify__wrap"> 
                          <span class="qualify__subtitle">Имя</span>
                          <input class="qualify__input" type="text" name="NAME" autocomplete="off">
                        </div>
                        <div class="qualify__wrap"> 
                          <span class="qualify__subtitle">Отчество</span>
                          <input class="qualify__input" type="text" name="SECOND_NAME" autocomplete="off">
                        </div>
                        <select class="qualify__select"> 
                          <option>Вторичка - Спрос</option>
                          <option>Вторичка - Заявка</option>
                          <option>Новостройка - Спрос</option>
                          <option>Реализация выкупленных объектов</option>
                          <option>Аренда - РКЦ</option>
                          <option>Партнеры для выкупов</option>
                          <option>Выкупы от банков</option>
                          <option>Аренда - Снять</option>
                          <option>Аренда - Сдать</option>
                          <option>ОКН - Продам</option>
                          <option>ОКН - Сдам</option>
                          <option>ОКН - Куплю</option>
                          <option>ОКН - Сниму</option>
                          <option>ОКН - Оценка</option>
                          <option>ОКН - Ипотека</option>
                          <option>ДЭД - Оценка</option>
                          <option>ДЭД - Ипотека</option>
                          <option>СКС - Жалобы</option>
                          <option>Акредитация (ИБ)</option>
                          <option>Воронки и туннели продаж</option>
                      </select>
                      <button data-id=${id} data-qualify="save" data-phone=${phone} class="btn">сохранить</button>
                      <button data-name="close" class="btn btn_red">закрыть</button>
                    </div>`
    this.container.insertAdjacentHTML('beforeend', layout);
    this.handlerModule('qualify');
    selectStyle('.qualify__select', 'Вторичка - Спрос')
  }
}

const leads = new Leads();
getData({
  action: 'getList',
  type: 'qualify',
  userId: loginID,
}).then(data=>{
  console.log(data)
  leads.leads = data;
  leads.init();
});

async function getData(raw){
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

  let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/leadFactory.php", requestOptions);
  if (!response.ok) {
    throw new Error('Ответ сети был не ok.');
  }

  return await response.json();
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