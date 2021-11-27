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
    this.docsFiles = [];
    this.photoFiles = [];
    this.timerUpdateItems = setInterval(() => {
      this.getNewItems();
    }, 300000)
  }
  init(){
    this.container.insertAdjacentHTML('beforeend', this.layout());
    this.currentElem = document.querySelector('.list__item');
    this.currentElem.classList.add('list__item_active');
    this.getItem(this.items[0].reqNumber);
    // todo удалить снизу костыль
    // this.getItem(57424000046);
    this.handler();
  }

  getList(itemsArr){

    let listLayout = '';
    for (let item of itemsArr){
      listLayout += `<div class="list__item" data-item="${item.reqNumber}"> 
                      <div class="list__status"> 
                        <span class="btn__status btn__status_question"></span>
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
  layout(){
    const list = this.getList(this.items);
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

  renderItem(){
    const centerField = document.querySelector('.center-side');
    centerField.innerHTML = '';
    if (this.currentItem){
      centerField.insertAdjacentHTML('beforeend', this.centerLayout())
      this.checkSlider();
    } else {
      centerField.insertAdjacentHTML('beforeend',`<p class="center-side__empty">Нет данных по объекту</p>`);
    }
  }
  sortFilesItem(){
    this.docsFiles = [];
    this.photoFiles = [];
    for (let file of this.currentItem.files){
      if (file.isDoc){
        this.docsFiles.push(file);
      } else {
        this.photoFiles.push(file);
      }
    }
  }
  getStatus(photo){
    switch (photo.status){
      case 'approved':
        return 'btn__status_approved'
      case 'denied':
        return 'btn__status_denied'
      case 'pending':
        return ''
    }
  }
  getPhotoItem(files){
    if (files.length > 0){
      const regExp = new RegExp('pdf', 'i');
      const placeholderPDF = 'https://crm.centralnoe.ru/advertisement/img/default/pdf.png';
      let photos = {
        photoLayout: '',
        startPhoto: regExp.test(files[0].url) ? placeholderPDF : files[0].url,
        startStatus: this.getStatus(files[0]),
      };
      for (let photo of files){
        photos.photoLayout += `<div class="slider__item slider__photo" data-img=${photo.url} style="background-image: url(${regExp.test(photo.url) ? placeholderPDF : photo.url})">
                                  <span class="btn__status ${this.getStatus(photo)} photo__status"></span>
                                </div>`
      }
      return photos;
    } else {
      return ''
    }
  }
  checkSlider(){
    const elms = document.querySelectorAll('.slider');
    for (let i = 0, len = elms.length; i < len; i++) {
      // инициализация elms[i] в качестве слайдера
      new ChiefSlider(elms[i]);
    }
  }
  centerLayout(){
    const photo = this.getPhotoItem(this.docsFiles.length > 0 ? this.docsFiles : this.photoFiles);
    return ` <span class="card__title">
                ${this.currentItem.object.city ? `г. ${this.currentItem.object.city}` : ''} 
                ${this.currentItem.object.street ? `ул.${this.currentItem.object.street}` : ''} 
                ${this.currentItem.object.houseNumber ? `д. ${this.currentItem.object.houseNumber}` : ''} 
                ${this.currentItem.objectRoom ? `кв. ${this.currentItem.objectRoom}` : ''} 
              </span>
            <div class="center-side__top"> 
              <div class="card">
                <div class="card__info"> 
                  <p class="card__info-text">Заявка:<span>${this.currentItem.ad ? this.currentItem.ad : ''} </span></p>
                  <p class="card__info-text">Клиент:<span>${this.currentItem.clients[0] ? 
                    `${this.currentItem.clients[0].secondName ? this.currentItem.clients[0].secondName : ''}
                    ${this.currentItem.clients[0].name ? this.currentItem.clients[0].name : ''}
                    ${this.currentItem.clients[0].lastName ? this.currentItem.clients[0].lastName : ''}`
                    : ''} </span>
                  </p>
                  <p class="card__info-text">Тип отношений:<span>${this.currentItem.type.type ? this.currentItem.type.type : ''} </span></p>
                  <p class="card__info-text">Срок действия:<span>${this.currentItem.publishedAt.stop ? this.currentItem.publishedAt.stop : ''} </span></p>
                  <p class="card__info-text">Тип объекста:<span>${this.currentItem.objectType ? 
                    `${this.currentItem.objectType.type ? this.currentItem.objectType.type : ''}
                    ${this.currentItem.objectType.rooms ? `(${this.currentItem.objectType.rooms}к.)` : ''}`
                    : ''} </span></p>
                  <p class="card__info-text">Комната объекта:<span>${this.currentItem.objectRoom ? this.currentItem.objectRoom : ''} </span></p>
                  <p class="card__info-text">Доля объекта:<span>${this.currentItem.objectShare ? this.currentItem.objectShare : ''} </span></p>
                </div> 
                <div class="card__comment"> 
                  <span class="card__comment-title">Комментарий в рекламу</span>
                  <textarea class="card__comment-field input" cols="30" rows="5">${this.currentItem.comment ? this.currentItem.comment : ''}</textarea>
                </div>
              </div>
              <div class="photo"> 
                <img class="photo__img" src="${photo.startPhoto}" alt="photo">   
              </div>                
            </div>
            <div class="center-side__bottom"> 
              <div class="carousel"> 
                <div class="slider">
                  <div class="slider__container">
                      <div class="slider__wrapper">
                          <div class="slider__items">
                             ${photo.photoLayout}
                          </div>
                      </div>
                  </div>
                <!-- Кнопки для перехода к предыдущему и следующему слайду -->
                <a href="#" class="slider__control" data-slide="prev"></a>
                <a href="#" class="slider__control" data-slide="next"></a>
                </div>
              </div>
            </div>`
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
      if(!Array.isArray(item)){
        this.currentItem = item;
        console.log('this is item')
        console.log(this.currentItem)
        this.sortFilesItem();
        this.renderItem();
      } else {
        this.currentItem = '';
        this.renderItem();
      }
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