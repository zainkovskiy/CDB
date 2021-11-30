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

let transformImage = {
  rotate: 0,
  height: 100,
}

class App {
  constructor(data) {
    this.items = data.data;
    this.serverTime = data.serverTime;
    this.container = document.querySelector('.main');
    this.currentItem = '';
    this.currentItemActive = '';
    this.slideActive = '';
    this.currentPhoto = '';
    this.docsFiles = [];
    this.photoFiles = [];
    this.timerUpdateItems = setInterval(() => {
      this.getNewItems();
    }, 300000)
  }
  init(){
    this.container.insertAdjacentHTML('beforeend', this.layout());
    this.currentItemActive = document.querySelector('.list__item');
    this.currentItemActive.classList.add('list__item_active');
    this.getItem(this.items[0].reqNumber);
    this.handler();
    this.handlerKeyboard();
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
      this.setStartSlideSelect();
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
        return 'btn__status_pending'
    }
  }
  getPhotoItem(files){
    if (files.length > 0){
      this.currentPhoto = files[0];
      const placeholderPDF = 'https://crm.centralnoe.ru/advertisement/img/default/pdf.png';
      let photos = {
        photoLayout: '',
        startPhoto: files[0].type === 'pdf' ? placeholderPDF : files[0].url,
        startStatus: this.getStatus(files[0]),
      };
      for (let photo of files){
        photos.photoLayout += `<div data-photo_id="${photo.id}" class="slider__item slider__photo" data-img=${photo.url} style="background-image: url(${photo.type === 'pdf' ? placeholderPDF : photo.url})">
                                  <span class="btn__status ${this.getStatus(photo)} slider__status"></span>
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
      new ChiefSlider(elms[i], {
        loop: false,
      });
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
                <img data-open="photo" class="photo__img" src="${photo.startPhoto}" alt="photo">
                <span class="btn__status ${photo.startStatus} photo__status"></span>   
              </div>                
            </div>
            <div class="center-side__bottom"> 
              <div class="bottom"> 
                <div class="bottom__left"> 
                  <button class="button" data-get="photos">фото ${this.photoFiles.length}</button>
                  <button class="button" data-get="docs">док. ${this.docsFiles.length}</button>
                </div>
                <div class="bottom__center"> 
                  <button class="button button_approved">одобрить все</button>
                  <button class="button button_approved">одобрить</button>
                  <button class="button button_denied">отказать</button>
                  <button class="button button_denied">отказать все</button>
                </div>
                <div> 
                  <input class="input" type="text">
                </div>
              </div>
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
      } else if (event.target.dataset.get === 'photos'){
          if (this.photoFiles.length > 0){
            this.setSliderPhoto(this.photoFiles);
            this.setMainPhoto();
            this.setStartSlideSelect();
          }
      } else if (event.target.dataset.get === 'docs'){
          if (this.docsFiles.length > 0){
            this.setSliderPhoto(this.docsFiles);
            this.setMainPhoto();
            this.setStartSlideSelect();
          }
      } else if (event.target.dataset.photo_id){
        this.currentPhoto = this.currentItem.files.find(item => item.id === event.target.dataset.photo_id);
        this.setMainPhoto();
        this.setNewSlideSelect(event.target);
      } else if (event.target.dataset.open === 'photo'){
        transformImage.rotate = 0;
        transformImage.height = 100;
        this.openPhotoFullScreen();
      }
    })
  }
  openPhotoFullScreen(){
    if (this.currentPhoto){
      if (this.currentPhoto.type === 'jpg'){
        this.openJPG();
      } else if (this.currentPhoto.type === 'pdf'){
        this.openPDF();
      }
    }
  }
  openJPG(){
    document.querySelector('HTML').setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}"  class="module">
                      <span data-name="close" class="module__close"></span>
                      <img class="module__img" src="${this.currentPhoto.url}" alt="photo"> 
                      <div class="module__controller"> 
                        <span data-rotate="left" class="module__btn module__left"></span>
                        <span data-rotate="right" class="module__btn module__right"></span>
                        <span data-scale="plus" class="module__btn module__zoom-plus"></span>
                        <span data-scale="minus" class="module__btn module__zoom-minus"></span>
                        <a href="${this.currentPhoto.url}" target="_blank" download class="module__btn module__download""></a>
                      </div>
                  </div>`
    document.body.insertAdjacentHTML('beforebegin', layout);
    this.handlerOpenJPG();
  }
  openPDF(){
    document.querySelector('HTML').setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}"  class="module">
                      <span data-name="close" class="module__close"></span>
                      <div id="my_pdf_viewer"> 
                        <div id="canvas_container">
                            <canvas id="pdf_renderer"></canvas>
                        </div>
                        <div id="navigation_controls">
                            <button id="go_previous">Previous</button>
                            <input id="current_page" value="1" type="number"/>
                            <button id="go_next">Next</button>
                        </div>
                        <div id="zoom_controls">  
                            <button id="zoom_in">+</button>
                            <button id="zoom_out">-</button>
                        </div>
                      </div>
                  </div>`
    document.body.insertAdjacentHTML('beforebegin', layout);
    this.callPDFjs();
    this.handlerOpenJPG();
  }
  callPDFjs(){
    const myState = {
      pdf: null,
      currentPage: 1,
      zoom: 1
    }
    pdfjsLib.getDocument(`img/New_Horizons.pdf`).then((pdf) => {
      console.log(pdf)
      myState.pdf = pdf;
      render();
    });
    function render() {
      myState.pdf.getPage(myState.currentPage).then((page) => {
        const canvas = document.getElementById("pdf_renderer");
        const ctx = canvas.getContext('2d');

        const viewport = page.getViewport(myState.zoom);
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        page.render({
          canvasContext: ctx,
          viewport: viewport
        })
      });
    }
    document.getElementById('go_previous')
      .addEventListener('click', (e) => {
        if(myState.pdf == null
          || myState.currentPage === 1) return;
        myState.currentPage -= 1;
        document.getElementById("current_page")
          .value = myState.currentPage;
        render();
      });

    document.getElementById('go_next')
      .addEventListener('click', (e) => {
        if(myState.pdf == null
          || myState.currentPage > myState.pdf
            ._pdfInfo.numPages)
          return;

        myState.currentPage += 1;
        document.getElementById("current_page")
          .value = myState.currentPage;
        render();
      });

    document.getElementById('current_page')
      .addEventListener('keypress', (e) => {
        if(myState.pdf == null) return;

        // Get key code
        var code = (e.keyCode ? e.keyCode : e.which);

        // If key code matches that of the Enter key
        if(code === 13) {
          var desiredPage =
            document.getElementById('current_page')
              .valueAsNumber;

          if(desiredPage >= 1
            && desiredPage <= myState.pdf
              ._pdfInfo.numPages) {
            myState.currentPage = desiredPage;
            document.getElementById("current_page")
              .value = desiredPage;
            render();
          }
        }
      });

    document.getElementById('zoom_in')
      .addEventListener('click', (e) => {
        if(myState.pdf === null) return;
        myState.zoom += 0.5;
        render();
      });

    document.getElementById('zoom_out')
      .addEventListener('click', (e) => {
        if(myState.pdf == null) return;
        myState.zoom -= 0.5;
        render();
      });
  }
  handlerOpenJPG(){
    const module = document.querySelector('.module');
    module.addEventListener('click', event => {
      if (event.target.dataset.name === 'close'){
        this.closeOpenJPG(module);
      } else if(event.target.dataset.rotate === 'left'){
        transformImage.rotate === 270 || transformImage.rotate === -270 ? transformImage.rotate = 0 : transformImage.rotate -= 90;
        document.querySelector('.module__img').setAttribute('style', `transform: rotate(${transformImage.rotate}deg); height: ${transformImage.height}%`)
      } else if(event.target.dataset.rotate === 'right'){
        transformImage.rotate === 270 || transformImage.rotate === -270 ? transformImage.rotate = 0 : transformImage.rotate += 90;
        document.querySelector('.module__img').setAttribute('style', `transform: rotate(${transformImage.rotate}deg); height: ${transformImage.height}%`)
      } else if(event.target.dataset.scale === 'plus'){
        transformImage.height += 5;
        document.querySelector('.module__img').setAttribute('style', `transform: rotate(${transformImage.rotate}deg); height: ${transformImage.height}%`);
      } else if(event.target.dataset.scale === 'minus'){
        transformImage.height -= 5;
        document.querySelector('.module__img').setAttribute('style', `transform: rotate(${transformImage.rotate}deg); height: ${transformImage.height}%`);
      }
    })
  }
  closeOpenJPG(module){
    document.querySelector('HTML').removeAttribute("style");
    module.remove();
  }
  handlerKeyboard(){
    document.body.addEventListener('keyup', event => {
      if (event.code === 'ArrowRight'){
        const nextElem = this.slideActive.nextElementSibling;
        if (nextElem){
          const nextArrow = document.querySelector(`.slider__control[data-slide='next']`);
          nextArrow.click();
          this.currentPhoto = this.currentItem.files.find(item => item.id === nextElem.dataset.photo_id);
          this.setMainPhoto();
          this.setNewSlideSelect(nextElem);
        }
      } else if (event.code === 'ArrowLeft'){
        const prevElem = this.slideActive.previousElementSibling;
        if (prevElem){
          const prevArrow = document.querySelector(`.slider__control[data-slide='prev']`);
          prevArrow.click();
          this.currentPhoto = this.currentItem.files.find(item => item.id === prevElem.dataset.photo_id);
          this.setMainPhoto();
          this.setNewSlideSelect(prevElem);
        }
      } else if (event.code === 'Escape'){
        const module = document.querySelector('.module');
        if (module){
          this.closeOpenJPG(module);
        }
      }
    })
  }
  setSliderPhoto(files){
    const sliderContainer = document.querySelector('.slider__items');
    sliderContainer.innerHTML = '';
    const photos = this.getPhotoItem(files);
    sliderContainer.insertAdjacentHTML('beforeend', photos.photoLayout);
    this.checkSlider();
  }
  setMainPhoto(){
    document.querySelector('.photo__img').src = this.currentPhoto.url;
    this.setStatus(document.querySelector('.photo__status'));
  }
  setStatus(elem){
    elem.classList.remove('btn__status_approved');
    elem.classList.remove('btn__status_denied');
    elem.classList.remove('btn__status_pending');
    elem.classList.add(`${this.getStatus(this.currentPhoto)}`);
  }
  setStartSlideSelect(){
    this.slideActive = document.querySelector('.slider__photo ');
    this.slideActive.classList.add('slider__select');
  }
  setNewSlideSelect(select){
    this.slideActive.classList.remove('slider__select');
    this.slideActive = select;
    this.slideActive.classList.add('slider__select');
  }
  toggleActive(newElem){
    this.currentItemActive.classList.remove('list__item_active');
    this.currentItemActive = newElem;
    this.currentItemActive.classList.add('list__item_active');
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