class Api {
  constructor() {
    this.API = 'https://50970.vds.miran.ru:553/Servers/Internal/AdAdmin.php';
  }
  async getJson(requestNamed){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const raw = JSON.stringify(requestNamed);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch(this.API, requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    return jsonA;
  }
}

class App {
  constructor(data) {
    this.items = data.data;
    this.serverTime = data.serverTime;
    this.container = document.querySelector('.main');
    this.currentItem = '';
    this.currentElem = '';
    this.timerUpdateItems = setInterval(() => {
      this.getNewItems();
    }, 300000);
  }
  init(){
    this.getItem(this.items[0].reqNumber);
    // todo удалить снизу костыль
    // this.getItem(57424000046);
    this.container.insertAdjacentHTML('beforeend', this.layout());
    this.currentElem = document.querySelector('.list__item');
    this.currentElem.classList.add('list__item_active');
    this.handler();
  }
  getStatus(item){
    return 'btn_status_approved'
  }
  getList(itemsArr){

    let listLayout = '';
    for (let item of itemsArr){
      listLayout += `<div class="list__item" data-item="${item.reqNumber}"> 
                      <div class="list__status"> 
                        <span class="btn_status ${this.getStatus(item)}"></span>
                      </div>
                      <div class="list__text_wrap"> 
                        <span class="list__text list__req">${item.reqNumber}</span>
                        <span class="list__text list__location">${item.reqStreet} ${item.reqHouseNumber}</span>
                      </div>
                      <span class="list__text list__type">${item.reqType}</span>
                     </div>`
    }
    return listLayout;
  }
  getCenterLayout(){

  }
  layout(){
    const list = this.getList(this.items);
    const centerLayout = this.getCenterLayout();
    return `<div class="header"></div>
              <div class="left-side">
              <div class="left-side__input"> 
                <input class="input input__search" type="search" placeholder="поиск">
<!--                <div></div>-->
              </div> 
              <div class="list"> 
                ${list}
              </div>
            </div>
            <div class="center-side"> 
            </div>
            <div class="right-side"></div>
            <div class="footer"></div>`
  }

  handler(){
    this.container.addEventListener('click', event => {
      if (event.target.dataset.item){
        this.toggleActive(event.target);
        this.getItem(event.target.dataset.item);
      }
    })
  }
  toggleActive(newElem){
    this.currentElem.classList.remove('list__item_active');
    this.currentElem = newElem;
    this.currentElem.classList.add('list__item_active');
  }

  getItem(reqNumber){
    api.getJson({
      action: 'getItem',
      reqNumber: reqNumber,
    }).then(item => {
      //todo отрисовывать объект в центре
      this.currentItem = item;
      console.log(`this is item`);
      console.log(this.currentItem);
    })
  }
  getNewItems(){
    api.getJson({
      action: 'getUpdates',
      serverTime: this.serverTime,
    }).then(newData => {
      this.serverTime = newData.serverTime;
      if (+newData.items > 0){
        this.items.push(newData.data);
        document.querySelector('.list').insertAdjacentHTML('beforeend', this.getList(newData.data));
      }
      console.log('this is update');
      console.log(newData);
    })
  }
}

const api = new Api();
let app = '';
api.getJson({
  action : "getList"
}).then(data => {
  console.log(data)
  app = new App(data);
  app.init();
})