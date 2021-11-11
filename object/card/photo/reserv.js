class Photo{
  constructor() {
    this.container = document.querySelector('.photo-page');
    this.photos = [];
    this.copyPhotos =[];
    this.newFiles = [];
    this.UIDMedia = '';
  }
  init(){
    document.querySelector('.photo-page').scrollIntoView();
    this.container.insertAdjacentHTML('beforeend', new Render(this.photos).render());
    if (this.photos.length !== 0){
      this.checkSlider();
    }
    new Handler(this.photos[0]).init();
    new File().init();
    selectStyle('.aply_change', 'Применить Web');
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

  async getJson() {
    const getPhoto =
      {
        "action" : "get",
        "params" :
          {
            "reqNumber" : UID
          }
      }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: JSON.stringify(getPhoto),
    };
    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/photoManager.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    if (jsonA[0].updateTS === null){
      this.photos = [];
      this.copyPhotos = [];
      this.UIDMedia = jsonA[0].UIDMedia;
    } else {
      this.photos = jsonA;
      this.copyPhotos = JSON.parse(JSON.stringify(this.photos));
      this.UIDMedia = jsonA[0].UIDMedia;
    }
    console.log('это приходит с сервера');
    console.log(this.photos)
    this.init();
  }
}

class Render{
  constructor(photos) {
    this.photos = photos;
  }
  getModerationStatusCount(){
    let accepted = 0;
    for (let photo of this.photos){
      if (photo.moderationStatus === "Accepted"){
        accepted++;
      }
    }
    return accepted;
  }
  getModerationStatus(){
    let moderationStatus = '';
    if (this.photos.length === 0){
      return moderationStatus;
    }
    if (this.photos[0].moderationStatus === 'Accepted'){
      moderationStatus = 'photo__moderator_active';
    } else {
      return moderationStatus;
    }
    return moderationStatus;
  }
  getWeb(){
    let one = 0;
    for (let photo of this.photos){
      if (photo.web === '1'){
        one++;
      }
    }
    return one;
  }
  getPhoto(){
    let photoElem = '';
    let photoStyle = '';
    if (this.photos.length === 3){
      photoStyle = 'slider__item_50';
    } else if (this.photos.length === 4){
      photoStyle = 'slider__item_33';
    }else if (this.photos.length === 5){
      photoStyle = 'slider__item_25';
    }

    for (let item of this.photos){
      photoElem += `<div class="slider__item ${photoStyle}">
          <img data-set="photo" class="slider__photo UID${item.UIDContent}" src="${item.URL}" alt="photo">
          <span class="slider__icon UIDweb${item.UIDContent} ${item.web === '1' ? 'slider__item_web' : ''}"></span>
          <span class="slider__icon UIDphoto${item.UIDContent} ${item.contentType === 'PhotoMain' ? 'slider__item_main' : ''}"></span>
          <span class="slider__icon UIDphoto${item.UIDContent} ${item.moderationStatus === 'Accepted' ? 'slider__item_moderator' : ''}"></span>
          </div>`;
    }
    return photoElem;
  }
  getChecked(){
    const check = {
      contentType: '',
      web: '',
    }
    if (this.photos.length === 0){
      return check;
    }
    if (this.photos[0].contentType === "PhotoMain"){
      check.contentType = 'checked';
    }
    if (this.photos[0].web === "1"){
      check.web = 'checked';
    }
    return check
  }
  getTable(){
    let table = `<tr class="table__row_header"> 
                  <td class="table__cell"></td>
                  <td class="table__cell"> 
                    <span data-burger="burger" data-uid="All" class="burger"></span>            
                    <div class="burger-hide isVisible blockAll"> 
                      <div class="burger__btn-group">
                        <button data-burger="web" class="burger__btn">Применить Web</button>
                        <button data-burger="notWeb" class="burger__btn">Удалить Web</button>
                        <button data-burger="best" class="burger__btn">Применить "Лучшее фото"</button>
                        <button data-burger="notBest" class="burger__btn">Удалить "Лучшее фото"</button>
                        <button data-burger="remove" class="burger__btn">Удалить выбранные фото</button>
                      </div>
                    </div>
                  </td>
                  <td class="table__cell"><input data-name="allCheckbox" class="table__checkbox" type="checkbox"></td>
                  <td class="table__cell">Тип фото</td>
                  <td class="table__cell">Лучшее</td>
                  <td class="table__cell">Web</td>
                  <td class="table__cell">Модерация</td>
                  <td class="table__cell">Причина</td>
                </tr>`;
    let count = 1;
    for (let item of this.photos){
      console.log(item)
      table += `<tr class="table__row id${count - 1} UID${item.UIDContent}">                 
                  <td data-uid="UID${item.UIDContent}" data-id="id${count - 1}" class="table__cell">${count}</td>
                  <td data-uid="UID${item.UIDContent}" data-id="id${count - 1}" class="table__cell">
                    <span data-burger="burger" data-uid="UID${item.UIDContent}" class="burger"></span>            
                    <div class="burger-hide isVisible blockUID${item.UIDContent}"> 
                      <div class="burger__btn-group">
                        <button data-burger="web" class="burger__btn">Применить Web</button>
                        <button data-burger="notWeb" class="burger__btn">Удалить Web</button>
                        <button data-burger="best" class="burger__btn">Применить "Лучшее фото"</button>
                        <button data-burger="notBest" class="burger__btn">Удалить "Лучшее фото"</button>
                        <button data-burger="remove" class="burger__btn">Удалить выбранные фото</button>
                      </div>
                    </div>
                   </td>
                  <td data-uid="UID${item.UIDContent}" data-id="id${count - 1}" class="table__cell">
                    <input data-checkuid="${item.UIDContent}" data-id="${count - 1}" data-checkbox="selectRow" class="table__checkbox table__select" type="checkbox">
                  </td>
                  <td data-uid="UID${item.UIDContent}" data-id="id${count - 1}" class="table__cell">${item.typeEx}</td>
                  <td data-uid="UID${item.UIDContent}" data-id="id${count - 1}" class="table__cell">
                    <input disabled data-checkuid="${item.UIDContent}" data-table="contentType" class="table__checkbox input__contentType" type="checkbox" ${item.contentType === "PhotoMain" ? 'checked' : ''}>
                  </td>
                  <td data-uid="UID${item.UIDContent}" data-id="id${count - 1}" class="table__cell">
                    <input disabled data-checkuid="${item.UIDContent}" data-table="web" class="table__checkbox input__web" type="checkbox" ${item.web === "1" ? 'checked' : ''}>
                  </td>
                  <td data-uid="UID${item.UIDContent}" data-id="id${count - 1}" class="table__cell moderator">
                    ${item.moderationStatus === "Accepted" ? '&#10003;' : ''}
                  </td>
                  <td data-uid="UID${item.UIDContent}" data-id="id${count - 1}" class="table__cell">${item.reason ? item.reason : ""}</td>
                </tr>`
      count++;
    }
    return table;
  }
  render(){
    console.log('это приходит в рендер');
    console.log(this.photos)
    const moderationStatusCount = this.getModerationStatusCount();
    const moderationStatus = this.getModerationStatus();
    const web = this.getWeb();
    const photo = this.getPhoto();
    const checked = this.getChecked();
    const table = this.getTable();
    return `<div class="save-change">
                <div class="save-change__group"> 
                  <button data-button="save" class="ui-btn ui-btn-success">Сохранить</button>
                  <button data-button="cancel" class="ui-btn ui-btn-link save-change__btn">Отменить</button>
                </div>
            </div>
            <input class="mobile-toggle__input" id="menu__toggle" type="checkbox">
            <label class="mobile-toggle__label" for="menu__toggle"> 
              <span class="mobile-toggle__span"></span>
            </label>
            <nav class="change-page">
              <a class="ui-btn ui-btn-icon-eye-opened change-page__link" href="../object/?source=${source}&id=${UID}">Объект</a>
              <a class="ui-btn ui-btn-secondary change-page__link" href="../photo/?source=${source}&id=${UID}">Фото</a>
              
              <!-- <a class="ui-btn ui-btn-icon-page change-page__link" href="../agency/?source=${source}&id=${UID}">ДОУ</a> -->
              
              <a class="ui-btn ui-btn-icon-page change-page__link
              ${login === "zainkovskiyaa" || login === 'mischenkoiv' || login === 'osmanovnyu'  || login === 'denishevalf' ? '' : 'isVisible'}" 
              href="../agency/?source=${source}&id=${UID}">ДОУ</a>
              
              <a class="ui-btn change-page__link" href="../promotion/?source=${source}&id=${UID}">Реклама</a>
              <a class="ui-btn ui-btn-icon-done change-page__link disable" href="../buySell/?source=${source}&id=${UID}">ПДКП/ДКП</a>
            </nav>
            <div class="photo"> 
              <div class="photo__container photo__wrap"> 
                <span class="photo__reason">${this.photos.length !== 0 ? this.photos[0].reason ?  `Причина: ${this.photos[0].reason}` : 'Причина:' : ''}</span>
                <div class="photo__img-wrap">
                  <span data-name="delete" class="photo__delete"></span>
                    <img class="photo__img" src="${this.photos.length !== 0 ? this.photos[0].URL : '../img/placeholder.png'}" alt="Загрузите фото">
                  <span class="photo__moderator ${moderationStatus}"></span>
                </div>               
              </div>

                <div class="photo__info photo__wrap"> 
                  <p class="photo__info-text">Всего фото: <span>${this.photos.length}</span></p>
                  <p class="photo__info-text">К выгрузке: <span>${web}</span></p>
                  <p class="photo__info-text">Одобренно: <span>${moderationStatusCount}</span></p>
                </div>
                <div class="photo__btn"> 
                  <div class="photo__upload"> 
                    <input class="photo__upload-input" style="display: none;" id="file" type="file" multiple>
                    <label class="photo__upload-label" for="file"></label>
                    <sapn class="photo__upload-test">Загрузите фото (.jpg/.jpeg)</sapn>
                  </div>
                  <div class="type"> 
                    <span class="type__text">Тип фото:</span>
                    <select class="type__select">    
                        <option>Комнаты</option>
                        <option>Сан.узел</option>
                        <option>Кухня</option>
                        <option>Вид из окна</option>
                        <option>Фасад</option>
                        <option>Планировка</option>
                    </select>
                  </div>
                  <div class="photo__checkbox">
                    <div class="checkbox"> 
                      <input ${checked.contentType} name="contentType" class="checkbox__input" id="main-photo" type="checkbox">
                      <label class="checkbox__text" for="main-photo">Лучшее</label>
                    </div>
                    <div class="checkbox"> 
                      <input ${checked.web} name="web" class="checkbox__input" id="web-photo" type="checkbox">
                      <label class="checkbox__text" for="web-photo">Web</label>
                    </div>
                  </div>
                  <div class="view"> 
                    <input checked class="view-input" id="table" name="viewPhoto" type="radio">
                    <label class="view-label" for="table">Таблица</label>
                    <input class="view-input" id="cell" name="viewPhoto" type="radio">
                    <label class="view-label" for="cell">Плитка</label>
                  </div>
                </div>
            </div>       
            <div class="change change_isActive"> 
              <div class="select__wrap"> 
                <select class="aply_change"> 
                  <option>Применить Web</option>
                  <option>Удалить Web</option>
                  <option>Прменить "Лучшее фото"</option>
                  <option>Удалить "Лучшее фото"</option>
                  <option>Удалить выбранные фото</option>
                </select>
              </div>
              <button data-button="apply" class="ui-btn">Применить</button>
            </div>      
            ${this.photos.length === 0 ? '' :
      `<div class="carousel isVisible"> 
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
            </div>`}
            <div class="table__wrap"> 
              <table class="table">${table}</table>
            </div>`
  }
}

class Handler{
  constructor(photo) {
    this.container = document.querySelector('.photo-page');
    this.currentPhoto = photo;
    this.currentTarget = '';
    this.currentRow = '';
    this.selectElem = [];
    this.arrForSend = [];
    this.clickCount = 0;
    this.currentOpenBurger = '';
  }
  init(){
    this.setStartPage();
    this.handlerSelect();
    this.container.addEventListener('click', event => {
      if (event.target.dataset.set === 'photo'){
        this.clickCount++;
        const find = photo.photos.find(item => item.URL === event.target.src);
        setTimeout(() => {
          if (this.clickCount === 1){
            this.currentPhoto = find;
            if (this.currentTarget){
              this.currentTarget.classList.remove('selectPhoto');
            }
            if (this.selectElem.length > 0){
              for (let item of this.selectElem){
                document.querySelector(`img.UID${item.UIDContent}`).classList.remove('selectPhoto');
                const trRow = document.querySelector(`tr.UID${item.UIDContent}`);
                trRow.classList.remove('table__row_active');
                trRow.querySelector('.table__select').checked = false;
              }
              this.selectElem = [];
              document.querySelector('.change').classList.add('change_isActive');
            }
            document.querySelector('.photo__img').src = event.target.src;
            event.target.classList.add('selectPhoto');
            this.currentTarget = event.target;
            this.setTypeEx();
            this.setModeratorStatus();
            this.setReason();
            this.setCheckbox();
            this.setTableCheck(this.currentPhoto.UIDContent);
          } else if (this.clickCount === 2){
            if (this.currentTarget.classList.contains('selectPhoto')){
              this.currentTarget.classList.remove('selectPhoto');
            }
            if (this.currentRow.classList.contains('table__row_active')){
              this.currentRow.classList.remove('table__row_active');
            }
            if (event.target.classList.contains('selectPhoto')){
              const find = this.selectElem.find(item => item.URL === event.target.src);
              this.selectElem.splice(this.selectElem.indexOf(find), 1);
              event.target.classList.remove('selectPhoto');
              const trRow = document.querySelector(`tr.UID${find.UIDContent}`);
              trRow.classList.remove('table__row_active');
              trRow.querySelector('.table__select').checked = false;
              if (this.selectElem.length === 0){
                document.querySelector('.change').classList.add('change_isActive');
              }
            } else if (!this.selectElem.find(item => item.URL === event.target.src)){
              this.selectElem.push(find);
              event.target.classList.add('selectPhoto');
              const trRow = document.querySelector(`tr.UID${find.UIDContent}`);
              trRow.classList.add('table__row_active');
              trRow.querySelector('.table__select').checked = true;
              if (this.selectElem.length > 1){
                document.querySelector('.change').classList.remove('change_isActive');
              }
            }

            console.log(this.selectElem)
          }
          this.clickCount = 0;
        }, 300);
      } else if (event.target.name === 'contentType'){
        document.querySelector('.save-change').classList.add('save-change_active');
        this.editContentType(event);
      } else if (event.target.name === 'web'){
        document.querySelector('.save-change').classList.add('save-change_active');
        this.editWeb(event);
      } else if (event.target.name === 'viewPhoto'){
        if(event.target.id === 'cell'){
          document.querySelector('.carousel').classList.remove('isVisible');
          document.querySelector('.table__wrap').classList.add('isVisible');
        } else if (event.target.id === 'table'){
          document.querySelector('.carousel').classList.add('isVisible');
          document.querySelector('.table__wrap').classList.remove('isVisible');
        }
      } else if (event.target.dataset.uid && !event.target.dataset.burger){
        const itemUid = document.querySelectorAll(`.${event.target.dataset.uid}`);
        for (let item of itemUid){
          if (item.classList.contains('slider__photo')){
            if (this.currentTarget){
              this.currentTarget.classList.remove('selectPhoto');
            }
            this.currentTarget = item;
            item.classList.add('selectPhoto');
            document.querySelector('.photo__img').src = item.src;
            this.currentPhoto = photo.photos.find(photo => photo.URL === item.src);
          } else if (item.classList.contains('table__row')){
            this.setTableCheck(this.currentPhoto.UIDContent);
          }
        }
        this.setModeratorStatus();
        this.setReason();
        this.setCheckbox();
      } else if (event.target.dataset.table){
        const photoInArr = photo.photos.find(photo => photo.UIDContent === event.target.dataset.checkuid);
        document.querySelector('.save-change').classList.add('save-change_active');
        if (event.target.dataset.table === 'contentType'){
          if (event.target.checked){
            photoInArr.contentType = 'PhotoMain';
            this.arrForSend.push(this.appendSelMain(event.target.dataset.checkuid));
          } else {
            photoInArr.contentType = 'Photo';
            this.arrForSend.push(this.appendDeSelMain(event.target.dataset.checkuid));
          }
        } else if (event.target.dataset.table === 'web'){
          if (event.target.checked){
            photoInArr.web = '1';
            this.arrForSend.push(this.appendSelWeb(event.target.dataset.checkuid));
          } else {
            photoInArr.web = '0';
            this.arrForSend.push(this.appendDeSelWeb(event.target.dataset.checkuid));
          }
        }
        if (photoInArr.UIDContent === this.currentPhoto.UIDContent){
          this.setCheckbox();
          this.setModeratorStatus();
        }
      } else if (event.target.dataset.checkbox){
        const find = photo.photos.find(photo => photo.UIDContent ===  event.target.dataset.checkuid);
        if (event.target.checked){
          document.querySelector(`tr.UID${event.target.dataset.checkuid}`).classList.add('table__row_active');
          this.selectElem.push(find);
          if (this.selectElem.length > 1){
            document.querySelector('.change').classList.remove('change_isActive');
          }
        } else {
          document.querySelector(`tr.UID${event.target.dataset.checkuid}`).classList.remove('table__row_active');
          this.selectElem.splice(this.selectElem.indexOf(find), 1);
          console.log(this.selectElem.length)
          if (this.selectElem.length === 0){
            document.querySelector('.change').classList.add('change_isActive');
          }
        }
      } else if (event.target.dataset.name === 'allCheckbox'){
        this.selectAll(event.target);
      } else if (event.target.tagName === "BUTTON" && event.target.dataset.button){
        if (event.target.dataset.button === 'apply'){
          document.querySelector('.save-change').classList.add('save-change_active');
          this.setChangeSelectPhoto();
        } else if (event.target.dataset.button === 'save'){
          document.querySelector('.save-change').classList.add('save-change_close');
          if (photo.newFiles.length !== 0){
            for (let file of photo.newFiles){
              this.arrForSend.push(this.appendActionInsert(photo.UIDMedia, Object.values(file)[0]));
            }
          }
          this.setLoader();
          this.sendToServer().then(() => {
            this.removeLoader();
          });
        } else if (event.target.dataset.button === 'cancel'){
          this.resetPage();
        }
      } else if (event.target.dataset.name === 'delete'){
        let nextPhoto = '';
        if (photo.photos[photo.photos.indexOf(this.currentPhoto) + 1]){
          nextPhoto = photo.photos[photo.photos.indexOf(this.currentPhoto) + 1];
        } else if (photo.photos[0]){
          nextPhoto = photo.photos[0];
        } else {
          return
        }
        if(nextPhoto){
          document.querySelector('.save-change').classList.add('save-change_active');
          this.arrForSend.push(this.appendDeleteOne(this.currentPhoto.UIDContent));
          const nextTarget = document.querySelector(`img.UID${nextPhoto.UIDContent}`);
          nextTarget.classList.add('selectPhoto');
          this.currentTarget.parentElement.remove();
          this.currentTarget = nextTarget;
          const nextRow = document.querySelector(`tr.UID${nextPhoto.UIDContent}`);
          nextRow.classList.add('table__row_active');
          this.currentRow.remove();
          this.currentRow = nextRow;
          document.querySelector('.photo__img').src = nextPhoto.URL;
          this.currentPhoto = nextPhoto;
          this.setModeratorStatus();
          this.setReason();
          this.setCheckbox();
        }
      } else if (event.target.dataset.burger === 'burger'){
        this.checkCurrentOpenBurger();
        const block = document.querySelector(`.block${event.target.dataset.uid}`);
        if (block === this.currentOpenBurger){
          this.checkCurrentOpenBurger();
          this.currentOpenBurger = '';
        } else {
          block.classList.remove('isVisible');
          this.currentOpenBurger = block;
        }
      }
    })
    //todo доделать кнопки на бургере
    document.body.addEventListener('click', event => {
      if (!event.target.dataset.burger){
        this.checkCurrentOpenBurger();
        this.currentOpenBurger = '';
      }
    })
  }

  checkCurrentOpenBurger(){
    if (this.currentOpenBurger){
      this.currentOpenBurger.classList.add('isVisible');
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
  async sendToServer(){
    if (this.arrForSend.length !== 0){
      for (let item of this.arrForSend){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json; charset=utf-8");
        var raw = JSON.stringify(item);
        var requestOptions = {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: "include",
          headers: myHeaders,
          body: raw
        };
        await fetch("https://crm.centralnoe.ru/dealincom/factory/photoManager.php", requestOptions)
      }
    }
    document.querySelector('.photo-page').remove();
    document.body.insertAdjacentHTML('afterbegin', `<div class="photo-page container"></div>`);
    photo.container = document.querySelector('.photo-page');
    photo.getJson();
    photo.newFiles = [];
  }
  setChangeSelectPhoto(){
    let selectText = '';
    const arrSelect = document.querySelectorAll('.select__gap');
    for (let item of arrSelect){
      if(item.previousElementSibling.classList.contains('aply_change')){
        selectText = item.innerHTML
      }
    }
    switch (selectText){
      case 'Применить Web':
        for (let item of this.selectElem){
          item.web = '1';
          this.arrForSend.push(this.appendSelWeb(item.UIDContent));
          document.querySelector(`tr.UID${item.UIDContent}`).querySelector('.input__web').checked = true;
        }
        break
      case 'Удалить Web':
        for (let item of this.selectElem){
          item.web = '0';
          this.arrForSend.push(this.appendDeSelWeb(item.UIDContent));
          document.querySelector(`tr.UID${item.UIDContent}`).querySelector('.input__web').checked = false;
        }
        break
      case 'Прменить "Лучшее фото"':
        for (let item of this.selectElem){
          item.contentType = 'PhotoMain';
          this.arrForSend.push(this.appendSelMain(item.UIDContent));
          document.querySelector(`tr.UID${item.UIDContent}`).querySelector('.input__contentType').checked = true;
        }
        break
      case 'Удалить "Лучшее фото"':
        for (let item of this.selectElem){
          item.contentType = 'Photo';
          this.arrForSend.push(this.appendDeSelMain(item.UIDContent));
          document.querySelector(`tr.UID${item.UIDContent}`).querySelector('.input__contentType').checked = false;
        }
        break
      case 'Удалить выбранные фото':
        for (let item of this.selectElem){
          item.contentType = 'Photo';
          this.arrForSend.push(this.appendDeleteOne(item.UIDContent));
          document.querySelector(`tr.UID${item.UIDContent}`).querySelector('.input__contentType').checked = false;
        }
        break
    }
  }
  resetPage(){
    document.querySelector('.photo-page').remove();
    document.body.insertAdjacentHTML('afterbegin', `<div class="photo-page container"></div>`);
    photo.container = document.querySelector('.photo-page');
    photo.photos = JSON.parse(JSON.stringify(photo.copyPhotos));
    photo.newFiles = [];
    photo.init();
  }

  handlerSelect(){
    const selectInput = document.querySelectorAll('.select__gap');
    for (let item of selectInput){
      if (item.previousElementSibling.classList.contains('type__select')){
        const observer = new MutationObserver(event => {
          const newType = event[event.length - 1].target.innerHTML;
          if (newType !== this.currentPhoto.typeEx){
            document.querySelector('.save-change').classList.add('save-change_active');
            this.setTypeExInCurrentElem(newType)
          }
        })
        observer.observe(item, {childList: true});
      }
    }
  }

  setStartPage(){
    if(this.currentPhoto){
      selectStyle('.type__select', `${this.currentPhoto.typeEx}`);
      this.currentTarget = document.querySelector('.slider__photo');
      this.currentTarget.classList.add('selectPhoto');
      this.currentRow = document.querySelector('.id0');
      this.currentRow.classList.add('table__row_active');
    } else {
      selectStyle('.type__select', ` `);
    }
  }
  setTypeEx(){
    const arrSelect = document.querySelectorAll('.select__gap');
    for (let item of arrSelect){
      if(item.previousElementSibling.classList.contains('type__select')){
        item.innerHTML = `${this.currentPhoto.typeEx}`;
      }
    }
  }
  setModeratorStatus(){
    if (this.currentPhoto.moderationStatus === "Accepted"){
      document.querySelector('.photo__moderator').classList.add('photo__moderator_active');
    } else {
      document.querySelector('.photo__moderator').classList.remove('photo__moderator_active');
    }
  }
  setReason(){
    document.querySelector('.photo__reason').innerHTML = this.currentPhoto.reason ? `Причина: ${this.currentPhoto.reason}` : 'Причина:';
  }
  setCheckbox(){
    const boxCheckbox = document.querySelector('.photo__checkbox');
    for (let check of boxCheckbox.querySelectorAll('INPUT')){
      if (check.name === 'contentType'){
        if (this.currentPhoto[check.name] === "PhotoMain"){
          check.checked = true;
        } else {
          check.checked = false;
        }
      } else if(check.name === 'web'){
        if (this.currentPhoto[check.name] === "1"){
          check.checked = true;
        } else {
          check.checked = false;
        }
      }
    }
  }
  setTableCheck(UID){
    if (this.currentRow){
      if (!this.currentRow.querySelector('input.table__select').checked){
        this.currentRow.classList.remove('table__row_active');
      }
    }
    const row = document.querySelector(`tr.UID${UID}`);
    this.currentRow = row;
    this.currentRow.classList.add('table__row_active');
  }
  selectAll(check){
    const checkboxArr = this.container.querySelectorAll('.table__select');
    const rowArr =  this.container.querySelectorAll('.table__row');
    if (check.checked){
      for (let item of checkboxArr){
        item.checked = true;
      }
      for (let item of rowArr){
        item.classList.add('table__row_active');
      }
      document.querySelector('.change').classList.remove('change_isActive');
      this.selectElem = JSON.parse(JSON.stringify(photo.photos));
      console.log(this.selectElem)
    } else {
      for (let item of checkboxArr){
        item.checked = false;
      }
      for (let item of rowArr){
        item.classList.remove('table__row_active');
      }
      document.querySelector('.change').classList.add('change_isActive');
      this.selectElem = [];
    }
  }
  setTypeExInCurrentElem(newType){
    this.currentPhoto.typeEx = newType;
    this.arrForSend.push(this.appendTypeObj(`${this.currentPhoto.UIDContent}`, newType));
  }

  editContentType(event){
    if (!event.target.checked){
      photo.photos[photo.photos.indexOf(this.currentPhoto)].contentType = 'Photo';
      this.currentRow.querySelector(`.input__contentType`).checked = false;
      document.querySelector(`span.UIDphoto${this.currentPhoto.UIDContent}`).classList.remove('slider__item_main');
      this.arrForSend.push(this.appendDeSelMain(this.currentPhoto.UIDContent));
    } else {
      photo.photos[photo.photos.indexOf(this.currentPhoto)].contentType = 'PhotoMain';
      this.currentRow.querySelector(`.input__contentType`).checked = true;
      document.querySelector(`span.UIDphoto${this.currentPhoto.UIDContent}`).classList.add('slider__item_main');
      this.arrForSend.push(this.appendSelMain(this.currentPhoto.UIDContent));
    }
  }
  editWeb(event){
    if (!event.target.checked){
      photo.photos[photo.photos.indexOf(this.currentPhoto)].web = '0';
      document.querySelector(`span.UIDweb${this.currentPhoto.UIDContent}`).classList.remove('slider__item_web');
      this.currentRow.querySelector('.moderator').innerHTML = '';
      this.currentRow.querySelector(`.input__web`).checked = false;
      this.arrForSend.push(this.appendDeSelWeb(this.currentPhoto.UIDContent));
    } else {
      photo.photos[photo.photos.indexOf(this.currentPhoto)].web = '1';
      if (this.currentPhoto.moderationStatus === 'Accepted'){
        // document.querySelector('.photo__moderator').classList.add('photo__moderator_active');
        this.currentRow.querySelector('.moderator').innerHTML = '&#10003;';
      }
      document.querySelector(`span.UIDweb${this.currentPhoto.UIDContent}`).classList.add('slider__item_web');
      this.currentRow.querySelector(`.input__web`).checked = true;
      this.arrForSend.push(this.appendSelWeb(this.currentPhoto.UIDContent));
    }
  }

  appendTypeObj(UIDContent, typeObjEx){
    let objForSend = {
      params: {}
    };
    objForSend.action = 'setTypeEx';
    objForSend.author = login;

    objForSend.params.UIDContent = UIDContent;
    objForSend.params.typeEx = typeObjEx;

    return objForSend;
  }
  appendActionInsert(mediaUID, URL){
    let objForSend = {
      params: {}
    };
    objForSend.action = 'insertNew';
    objForSend.author = login;

    objForSend.params.UIDMedia = mediaUID;
    objForSend.params.URL = URL;

    return objForSend;
  }
  appendDeleteOne(UIDContent){
    let objForSend = {
      params: {}
    };
    objForSend.action = 'deleteOne';
    objForSend.author = login;

    objForSend.params.UIDContent = UIDContent;

    return objForSend;
  }
  appendSelWeb(UIDContent){
    let objForSend = {
      params: {}
    };
    objForSend.action = 'selWeb';
    objForSend.author = login;

    objForSend.params.UIDContent = UIDContent;

    return objForSend;
  }
  appendSelMain(UIDContent){
    let objForSend = {
      params: {}
    };
    objForSend.action = 'selMain';
    objForSend.author = login;

    objForSend.params.UIDContent = UIDContent;

    return objForSend;
  }
  appendDeSelWeb(UIDContent){
    let objForSend = {
      params: {}
    };
    objForSend.action = 'deselWeb';
    objForSend.author = login;

    objForSend.params.UIDContent = UIDContent;

    return objForSend;
  }
  appendDeSelMain(UIDContent){
    let objForSend = {
      params: {}
    };
    objForSend.action = 'deselMain';
    objForSend.author = login;

    objForSend.params.UIDContent = UIDContent;

    return objForSend;
  }
}

class File {
  constructor() {
    this.container = document.querySelectorAll('.photo__upload');
  }
  init(){
    this.fileInputs.forEach((e, i) => {
      e.addEventListener("dragenter", this.dragenter, false);
    });

    this.fileInputs.forEach((e, i) => {
      e.addEventListener("dragover", this.dragover, false);
    });

    this.fileInputs.forEach((e, i) => {
      e.addEventListener("dragleave", this.dragleave, false);
    });

    this.fileInputs.forEach((e, i) => {
      e.addEventListener("drop", this.drop, false);
    });

    document.querySelectorAll('.photo__upload-input').forEach((e)=>{
      e.addEventListener("change", this.handleInput, false);
    });
  }

  dragenter(e){
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('photo__upload')) {
      e.target.style.background = "#E5E5E5";
    }
  }
  dragover(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('photo__upload')) {
      e.target.style.background = "#E5E5E5";
    }
  }
  dragleave(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('photo__upload')) {
      e.target.style.background = "";
    }
  }
  drop(e) {
    e.stopPropagation();
    e.preventDefault();
    document.querySelector('.save-change').classList.add('save-change_active');
    let files = e.dataTransfer.files;
    new SendFile(files).init();
  }

  handleInput(e){
    e.path[1].style.background = "#E5E5E5";
    document.querySelector('.save-change').classList.add('save-change_active');
    const files = this.files;
    new SendFile(files).init();
  }
}

class SendFile{
  constructor(files) {
    this.files = files;
  }
  async init(){
    let data = new FormData();

    for (let item of this.files){
      if(item.type === 'image/jpeg'){
        data.append('photo[]', item)
      }
    }

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    let requestOptions = {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: data
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/uploader.php", requestOptions);
    if (response){
      const jsonA = await response.json();
      photo.newFiles.push(...jsonA);
      document.querySelector('.photo__upload-photo').innerHTML = `Загруженных файлов: ${photo.newFiles.length}`;
    }
  }
}

const photo = new Photo();
photo.getJson().catch(() => {
  photo.init();
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
    $('<div>', {
      class: 'select__gap',
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
}

