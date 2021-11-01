class Deals {
  constructor() {
    this.deals = [];
    this.container = document.querySelector('.page');
  }
  init(){
    this.container.insertAdjacentHTML('beforeend', new Layout().init());
    new Deal(this.deals).layout();
    new Handler(this.container).init();
  }
  async getDeals(){
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
    this.deals = [];
    for (let deal of Object.values(jsonA)){
      this.deals.push(deal);
    }
    console.log(this.deals)
    return this.deals;
  }
}
class Layout {
  init(){
    return `<header class="header">
                <span class="header__logo"></span>   
            </header> 
            <div class="deals"></div>`
  }
}
class Deal {
  constructor(deals) {
    this.deals = deals;
    this.container = document.querySelector('.deals');
  }
  layout(){
    for (let deal of this.deals){
      this.container.insertAdjacentHTML('beforeend',
        `<div class="deal"> 
                <div class="info"> 
                  <span data-name="deal" data-id="${deal.ID}" class="info__name">${deal.name}</span>
                  <span class="info__cost">${deal.cost}</span>
                  <span class="info__owner">${deal.owner}</span>
                  <div class="business">
                    <span data-id="${deal.ID}" data-name="business" class="business__text">Дела</span>
                    <div class="business__info id${deal.ID} isVisible">
                      <div class="task"> 
                        <span class="task__time">26.08.2021 14:43:22</span>
                        <span class="task__text">Пройти модерацию</span>
                      </div>
                      <div class="business__img"> 
                        <span class="business__done"></span>
                        <span class="business__done-text">задача</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="buttons"> 
                  <a href="tel:${deal.telNumber}" class="buttons__item buttons__phone""></a>
                  <span class="buttons__item buttons__message isVisible"></span>
                  <span class="buttons__item buttons__chat isVisible"></span>
                  <span data-id="${deal.ID}" data-name="contract" class="buttons__item buttons__contract isVisible"></span>
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
      } else if (event.target.dataset.name === 'deal'){
        const deal = deals.deals.find(item => item.ID === +event.target.dataset.id);
        this.openDeal(deal);
      } else if (event.target.dataset.name === 'business'){
        this.checkCurrentBusiness();
        const block = document.querySelector(`.id${event.target.dataset.id}`);
        block.classList.remove('isVisible');
        this.currentBusiness = block;
      } else {
        this.checkCurrentBusiness();
      }
    })
  }
  openDeal(deal){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");
    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="card">
                      <div data-name="close-card" class="return"> 
                        <span class="return__arrow"></span>
                        <span class="return__text">Назад</span>
                      </div>
                    </div>`

    this.container.insertAdjacentHTML('beforeend', layout);
    document.querySelector('.card').classList.add('card_open');
    this.handlerCard('card');
  }
  //todo вставить handlerCard из ../leads/script.js
  openMainPage(){
    window.location.href='../index.html';
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
  closeModule(select){
    document.querySelector('HTML').removeAttribute('style');
    document.querySelector(`.${select}`).remove();
  }
  checkCurrentBusiness(){
    if (this.currentBusiness){
      this.currentBusiness.classList.add('isVisible');
      this.currentBusiness = '';
    }
  }
}

const deals = new Deals();
deals.getDeals().then(() => {
  deals.init();
});