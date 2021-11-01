class Photo{
  constructor() {
    this.container = document.querySelector('.photo-page');
    this.photos = [];
    this.copyPhotos = [];
    this.handlerPhoto = [];
    this.newFiles = [];
    this.UIDMedia = '';
  }
  init(){
    document.querySelector('.photo-page').scrollIntoView();
    this.container.insertAdjacentHTML('beforeend', new Render(this.photos).render());
    new Handler(this.photos[0], this.container).init();
    new File().init();
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
      this.handlerPhoto = JSON.parse(JSON.stringify(this.photos));
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
  getTable(){
    let table = `<tr class="table__row_header"> 
                  <td class="table__cell"> 
                    <span data-burger="burger" class="burger"></span>            
                    <div class="burger-hide isVisible"> 
                      <div class="burger__btn-group">
                        <button data-burger="web" class="burger__btn">Применить Web для всех фото</button>
                        <button data-burger="notWeb" class="burger__btn">Удалить Web для всех фото</button>
                        <button data-burger="best" class="burger__btn">Применить "Лучшее фото" для всех фото</button>
                        <button data-burger="notBest" class="burger__btn">Удалить "Лучшее фото" для всех фото</button>
                      </div>
                    </div>
                  </td>
                  <td class="table__cell">Тип фото</td>
                  <td class="table__cell">Лучшее</td>
                  <td class="table__cell">Web</td>
                  <td class="table__cell">Модерация</td>
                  <td class="table__cell">Причина</td>
                </tr>`;
    let count = 1;
    for (let item of this.photos){
      table += `<tr class="table__row id${count - 1} UID${item.UIDContent}" data-src="${item.URL}">                 
                  <td data-uid="UID${item.UIDContent}" data-id="id${count - 1}" class="table__cell">${count}</td>
                  <td data-uid="UID${item.UIDContent}" data-id="id${count - 1}" class="table__cell">${item.typeEx}</td>
                  <td data-uid="UID${item.UIDContent}" data-id="id${count - 1}" class="table__cell">
                    <input data-content="${item.UIDContent}" data-checkuid="${item.UIDContent}" data-table="contentType" class="table__checkbox input__contentType" type="checkbox" ${item.contentType === "PhotoMain" ? 'checked' : ''}>
                  </td>
                  <td data-uid="UID${item.UIDContent}" data-id="id${count - 1}" class="table__cell">
                    <input data-web="${item.UIDContent}" data-checkuid="${item.UIDContent}" data-table="web" class="table__checkbox input__web" type="checkbox" ${item.web === "1" ? 'checked' : ''}>
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
    const moderationStatusCount = this.getModerationStatusCount();
    const moderationStatus = this.getModerationStatus();
    const web = this.getWeb();
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
              <a class="ui-btn ui-btn-icon-eye-opened change-page__link" href="../object/?source=${source}&id=${UID}&IDDEAL=${deal}">Объект</a>
              <a class="ui-btn ui-btn-secondary change-page__link" href="../photo/?source=${source}&id=${UID}&IDDEAL=${deal}">Фото</a>
              
              <!-- <a class="ui-btn ui-btn-icon-page change-page__link" href="../agency/?source=${source}&id=${UID}">ДОУ</a> -->
              
              <a class="ui-btn ui-btn-icon-page change-page__link
              ${login === "zainkovskiyaa" || login === 'mischenkoiv' || login === 'osmanovnyu'  || login === 'denishevalf' ? '' : 'isVisible'}" 
              href="../agency/?source=${source}&id=${UID}&IDDEAL=${deal}">ДОУ</a>
              
              <a class="ui-btn change-page__link" href="../promotion/?source=${source}&id=${UID}&IDDEAL=${deal}">Реклама</a>
              <a class="ui-btn ui-btn-icon-done change-page__link disable" href="../buySell/?source=${source}&id=${UID}&IDDEAL=${deal}">ПДКП/ДКП</a>
            </nav>
            <div class="info"> 
              <span>Как работать с фотографиями?</span>
              <button data-info="photo" class="ui-btn ui-btn-primary-dark">инфо</button>
            </div>
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
                </div>
            </div>          
            <div class="table__wrap"> 
              <table class="table">${table}</table>
            </div>`
  }
}

class Handler{
  constructor(photo, container) {
    this.container = container;
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
      if (event.target.dataset.uid && !event.target.dataset.burger){
        const itemUid = document.querySelector(`tr.${event.target.dataset.uid}`);
        document.querySelector('.photo__img').src = itemUid.dataset.src;
        this.currentPhoto = photo.photos.find(photo => photo.URL === itemUid.dataset.src);
        this.setTableCheck(itemUid);
        this.setModeratorStatus();
        this.setReason();
        this.setTypeEx();
      } else if (event.target.dataset.name === 'delete'){
        this.photoDelete();
      } else if (event.target.tagName === "BUTTON" && event.target.dataset.button){
          if (event.target.dataset.button === 'save'){
            document.querySelector('.save-change').classList.add('save-change_close');
            setTimeout(() => {
              this.setFiles();
              this.setLoader();
              this.sendToServer().then(() => {
                this.removeLoader();
              });
            }, 500)
          } else if (event.target.dataset.button === 'cancel'){
            document.querySelector('.save-change').classList.add('save-change_close');
            setTimeout(() => {
              this.resetPage();
            }, 500)
          }
      } else if (event.target.dataset.burger === 'burger'){
        this.checkCurrentOpenBurger();
        const block = document.querySelector(`.burger-hide`);
        if (block === this.currentOpenBurger){
          this.checkCurrentOpenBurger();
          this.currentOpenBurger = '';
        } else {
          block.classList.remove('isVisible');
          this.currentOpenBurger = block;
        }
      } else if (event.target.dataset.burger && event.target.dataset.burger !== 'burger'){
        this.setChangeMainWebForAll(event);
      } else if (event.target.dataset.table){
        this.setChangeMainWebForOne(event);
      } else if (event.target.dataset.info === 'photo'){
        this.openCard();
      }
    })

    document.body.addEventListener('click', event => {
      if (!event.target.dataset.burger){
        this.checkCurrentOpenBurger();
        this.currentOpenBurger = '';
      }
    })
  }
  openCard() {
    let readyString = `https://crm.centralnoe.ru/objectCard/info/photo/index.html`;
    BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: 925, });
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
  resetPage(){
    document.querySelector('.photo-page').remove();
    document.body.insertAdjacentHTML('afterbegin', `<div class="photo-page container"></div>`);
    photo.container = document.querySelector('.photo-page');
    photo.photos = JSON.parse(JSON.stringify(photo.copyPhotos));
    photo.handlerPhoto = JSON.parse(JSON.stringify(photo.copyPhotos));
    photo.newFiles = [];
    photo.init();
  }

  setFiles(){
    if (photo.newFiles.length !== 0){
      for (let file of photo.newFiles){
        this.arrForSend.push(this.appendActionInsert(photo.UIDMedia, Object.values(file)[0]));
      }
    }
  }
  setStartPage(){
    if(this.currentPhoto){
      selectStyle('.type__select', `${this.currentPhoto.typeEx}`);
      this.currentRow = document.querySelector('.id0');
      this.currentRow.classList.add('table__row_active');
    } else {
      selectStyle('.type__select', ` `);
    }
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
  setTypeExInCurrentElem(newType){
    this.currentPhoto.typeEx = newType;
    this.arrForSend.push(this.appendTypeObj(`${this.currentPhoto.UIDContent}`, newType));
  }
  setTableCheck(itemUid){
    if (this.currentRow){
      this.currentRow.classList.remove('table__row_active');
    }
    this.currentRow = itemUid;
    this.currentRow.classList.add('table__row_active');
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
  setTypeEx(){
    const arrSelect = document.querySelector('.select__gap');
    arrSelect.innerHTML = `${this.currentPhoto.typeEx}`;
  }
  photoDelete(){
    let nextPhoto = '';
    if (photo.handlerPhoto.length > 1){
      if (photo.photos[photo.photos.indexOf(this.currentPhoto) + 1]){
        nextPhoto = photo.photos[photo.photos.indexOf(this.currentPhoto) + 1];
      } else if (photo.photos[0]){
        nextPhoto = photo.photos[0];
      }

      document.querySelector('.save-change').classList.add('save-change_active');
      this.arrForSend.push(this.appendDeleteOne(this.currentPhoto.UIDContent));
      const nextRow = document.querySelector(`tr.UID${nextPhoto.UIDContent}`);
      nextRow.classList.add('table__row_active');
      this.currentRow.remove();
      this.currentRow = nextRow;
      document.querySelector('.photo__img').src = nextPhoto.URL;
      photo.handlerPhoto.splice(photo.handlerPhoto.indexOf(this.currentPhoto), 1);
      this.currentPhoto = nextPhoto;
      this.setModeratorStatus();
      this.setReason();
      this.setTypeEx();
    } else {
      document.querySelector('.save-change').classList.add('save-change_active');
      this.arrForSend.push(this.appendDeleteOne(this.currentPhoto.UIDContent));
      this.currentRow.remove();
      this.currentRow = '';
      document.querySelector('.photo__img').src = '';
      photo.handlerPhoto.splice(photo.handlerPhoto.indexOf(this.currentPhoto), 1);
      this.currentPhoto = '';
    }
  }
  checkCurrentOpenBurger(){
    if (this.currentOpenBurger){
      this.currentOpenBurger.classList.add('isVisible');
    }
  }
  setChangeMainWebForAll(event){
    this.checkCurrentOpenBurger();
    for (let item of photo.photos){
      if (event.target.dataset.burger === 'web'){
        item.web = '1';
        document.querySelector(`INPUT[data-web="${item.UIDContent}"]`).checked = true;
        this.arrForSend.push(this.appendSelWeb(item.UIDContent));
      } else if (event.target.dataset.burger === 'notWeb'){
        item.web = '0';
        document.querySelector(`INPUT[data-web="${item.UIDContent}"]`).checked = false;
        this.arrForSend.push(this.appendDeSelWeb(item.UIDContent));
      } else if (event.target.dataset.burger === 'best'){
        item.contentType = "PhotoMain";
        document.querySelector(`INPUT[data-content="${item.UIDContent}"]`).checked = true;
        this.arrForSend.push(this.appendSelMain(item.UIDContent));
      } else if (event.target.dataset.burger === 'notBest'){
        item.contentType = "Photo";
        document.querySelector(`INPUT[data-content="${item.UIDContent}"]`).checked = false;
        this.arrForSend.push(this.appendDeSelMain(item.UIDContent));
      }
    }
    document.querySelector('.save-change').classList.add('save-change_active');
    console.log(photo.photos)
  }
  setChangeMainWebForOne(event){
    const find = photo.photos.find(photo => photo.UIDContent === event.target.dataset.checkuid);

    if (event.target.dataset.table === 'web'){
      if (event.target.checked){
        find.web = '1';
        this.arrForSend.push(this.appendSelWeb(find.UIDContent));
      } else {
        find.web = '0';
        this.arrForSend.push(this.appendDeSelWeb(find.UIDContent));
      }
    } else if (event.target.dataset.table === 'contentType'){
      if (event.target.checked){
        find.contentType = 'PhotoMain';
        this.arrForSend.push(this.appendSelMain(find.UIDContent));
      } else {
        find.contentType = 'Photo';
        this.arrForSend.push(this.appendDeSelMain(find.UIDContent));
      }
    }
    document.querySelector('.save-change').classList.add('save-change_active');
    console.log(photo.photos)
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
    this.container.forEach((e, i) => {
      e.addEventListener("dragenter", this.dragenter, false);
    });

    this.container.forEach((e, i) => {
      e.addEventListener("dragover", this.dragover, false);
    });

    this.container.forEach((e, i) => {
      e.addEventListener("dragleave", this.dragleave, false);
    });

    this.container.forEach((e, i) => {
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
