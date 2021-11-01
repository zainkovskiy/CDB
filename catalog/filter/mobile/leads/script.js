class Leads {
  constructor() {
    this.leads = [];
    this.container = document.querySelector('.page');
  }
  init(){
    this.container.insertAdjacentHTML('beforeend', new Layout().init());
    new Lead(this.leads).layout();
    new Handler(this.container).init();
    selectStyle('.change__lead','Выбрать')
  }

  async getLeads(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/leadFactory.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    this.leads = [];
    for (let lead of Object.values(jsonA)){
      this.leads.push(lead);
    }
    console.log(this.leads)
    return this.leads;
  }
}

class Layout {
  init(){
    return `<header class="header">
                <span class="header__logo"></span>   
            </header> 
            <select class="change__lead"> 
                <option>Выбрать</option>
                <option>Новый ЛИД</option>
                <option>В работе</option>
                <option>Квалифицирован</option>
                <option>НЕ целевой лид</option>
                <option>Другой АН</option>
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
                  <span class="info__time">${lead.time}</span>
                  <div class="business">
                    <span data-id="${lead.ID}" data-name="business" class="business__text">Дела</span>
                    <div class="business__info id${lead.ID} isVisible">
                      <div class="missed"> 
                        <span class="missed__time">26.08.2021 14:43:22</span>
                        <span class="missed__call">Входящий от ${lead.telNumber}</span>
                      </div>
                      <div class="business__img"> 
                        <span class="business__phone"></span>
                        <span class="business__phone-text">входящий звонок</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="buttons"> 
                  <a href="tel:${lead.telNumber}" class="buttons__item buttons__phone""></a>
                  <span class="buttons__item buttons__message isVisible"></span>
                  <span class="buttons__item buttons__chat isVisible"></span>
                  <span data-id="${lead.ID}" data-name="contract" class="buttons__item buttons__contract"></span>
                </div> 
              </div>`)
    }
  }
}

class Handler {
  constructor(container) {
    this.container = container
    this.currentBusiness = '';
  }
  init(){
    this.container.addEventListener('click', event => {
      if (event.target.classList.contains('header__logo')){
        this.openMainPage();
      } else if (event.target.dataset.name === 'lead'){
        const lead = leads.leads.find(item => item.ID === +event.target.dataset.id);
        this.openLead(lead);
      } else if (event.target.dataset.name === 'business'){
        this.checkCurrentBusiness();
        const block = document.querySelector(`.id${event.target.dataset.id}`);
        block.classList.remove('isVisible');
        this.currentBusiness = block;
      } else if (event.target.dataset.name === 'contract'){
        this.openContract(event.target.dataset.id);
      } else {
        this.checkCurrentBusiness();
      }
      // todo ниже код перерендера
      // console.log(event)
      // if (event.target.tagName === 'BUTTON'){
      //   document.querySelector('.leads').innerHTML = '';
      //   leads.getLeads().then(data => {
      //     new Lead(data).layout();
      //   });
      // }
    })
  }
  openLead(lead){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");
    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="card">
                      <div class="save-change">
                        <div class="save-change__group"> 
                          <button data-save="yes" class="ui-btn ui-btn-success">Сохранить</button>
                          <button data-save="no" class="ui-btn ui-btn-link save-change__btn">Отменить</button>
                        </div>
                      </div>
                      <div data-name="close-card" class="return"> 
                        <span class="return__arrow"></span>
                        <span class="return__text">Назад</span>
                      </div>
                      <div class="card__info"> 
                        <span class="card__title">Лид</span>
                        <p class="card__subtitle">Имя</p>          
                          <input class="card__name card__name_disabled" type="text" value="" placeholder="не заполнено">
                        <p class="card__subtitle">Телефон
                          <a class="card__subtitle-child" href="tel:${lead.telNumber}">${lead.telNumber}</a>
                        </p>
                        <p class="card__subtitle">Риелтор 
                          <span class="card__subtitle-child">${lead.owner}</span>
                        </p>
                      </div>                      
                      <div class="card__info"> 
                        <span class="card__title">Для аренды</span>
                        <p class="card__subtitle">Передать в аренду?</p>
                          <select class="rent__hand-over"> 
                            <option>Не выбрано</option>
                            <option>Да</option>
                            <option>Нет</option>
                          </select>
                        <p class="card__subtitle">Тип аренды</p>
                          <select class="rent__type"> 
                            <option>Не выбрано</option>
                            <option>Съём</option>
                            <option>Сдача</option>
                          </select>                
                      </div>                      
                      <div class="card__info"> 
                        <span class="card__title">История</span>
                        <p class="card__subtitle">Стутус изменен
                          <span class="card__subtitle-child">В работе</span>
                        </p>  
                        <p class="card__subtitle">Входящий звонок
                          <a class="card__subtitle-child" href="tel:${lead.telNumber}">${lead.telNumber}</a>
                          <audio class="card__audio" src="audio/test.mp3" controls></audio>
                        </p>  
                      </div>
                    </div>`
    this.container.insertAdjacentHTML('beforeend', layout);
    selectStyle('.rent__hand-over', 'Не выбрано');
    selectStyle('.rent__type', 'Не выбрано');
    document.querySelector('.card').classList.add('card_open');
    this.handlerCard('card');
  }
  //todo пересмотреть логику сохранения, в битриксе при нажатии на импут выпадает кнопка сохранить, и импут
  // активный пока не нажмут отмена или не сохранят
  handlerCard(select){
    const editName = document.querySelector('.card__name');
    const saveChange = document.querySelector('.save-change');
    document.querySelector(`.${select}`).addEventListener('click', event => {
      if (event.target.dataset.name === 'close-card'){
        document.querySelector('.card').classList.add('card_close');
        setTimeout(() => {
          this.closeModule(select);
        }, 500);
      } else if (event.target.tagName === 'INPUT'){
        editName.classList.remove('card__name_disabled');
        editName.focus();
      } else if (event.target.dataset.save === 'no'){
        saveChange.classList.add('save-change_close');
        setTimeout(() => {
          saveChange.classList.remove('save-change_active');
          saveChange.classList.remove('save-change_close');
        }, 500)
      }
    })

    editName.addEventListener('change', () => {
      saveChange.classList.add('save-change_active');
    })

    editName.addEventListener('blur', () => {
      editName.classList.add('card__name_disabled');
    })

    const selectInput = document.querySelectorAll('.select__gap');
    for (let item of selectInput){
      const observer = new MutationObserver(event => {
        saveChange.classList.add('save-change_active');
      })
      observer.observe(item, {childList: true});
    }
  }

  openContract(id){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");
    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="module">
                      <div class="module__group">
                        <button data-id="${id}" class="module__btn module__btn_green">Сделку + Контакт</button>
                        <button data-id="${id}" class="module__btn module__btn_red">Не целевой лид</button>
                        <button data-id="${id}" class="module__btn module__btn_red">Другое АН</button>
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
  checkCurrentBusiness(){
    if (this.currentBusiness){
      this.currentBusiness.classList.add('isVisible');
      this.currentBusiness = '';
    }
  }
}

const leads = new Leads();
leads.getLeads().then(()=>{
  leads.init();
});

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