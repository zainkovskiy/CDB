class newBuildingsSeeker {
  constructor(data) {
    this.list = data.data;
    this.timestamp = data.timestamp;
    this.arrayRealtors = [];
    this.filtered = [];
    this.showSend = false;
    this.table = document.querySelector('.container');
    this.inputDev = document.querySelector(`INPUT[name='developer']`);
    this.inputDate = document.querySelector(`INPUT[name='dataCreate']`);
  }
  init(){
    this.setStartValue();
    this.handler();
    this.setStartUpdate();
  }

  //todo если получится переделать инициализацию с учетом сетТаймоута, рендера и получение данных риелтора
  setStartUpdate(){
    setTimeout(() => {
      server.request({
        action: 'getUpdates',
        timestamp: this.timestamp,
      }).then(row => {
        if (row.length > 0){
          this.list.push(...row)
          server.getAllRealtors({
            action: 'getBatch',
            data: this.setArrayRealtors(),
          }).then(data => {
            this.arrayRealtors = data;
            this.renderRows(row);
          });
        }
      })
    }, 30000);
  }

  setStartValue(){
    server.getAllRealtors({
      action: 'getBatch',
      data: this.setArrayRealtors(),
    }).then(data => {
      this.arrayRealtors = data;
      this.showTable(this.list);
    });
  }
  setArrayRealtors(){
    let arrayRealtors = [];
    for (let item of this.list){
      if (!arrayRealtors.find(Applicant => Applicant === item.applicant)){
        arrayRealtors.push(item.applicant);
      }
    }
    return arrayRealtors;
  }
  getApplicant(applicant){
    return this.arrayRealtors.find(realtor => +realtor.UID === +applicant);
  }
  showTable(list){
    if (list.length > 0){
      this.table.querySelector('tbody').innerHTML = '';
      this.renderRows(list);
    } else {
      this.table.querySelector('tbody').innerHTML = '';
    }
  }
  renderRows(list){
    if (this.showSend){
      for (let item of list){
        this.table.querySelector('tbody').insertAdjacentHTML('beforeend', new Render(item, this.getApplicant(item.applicant)).render());
      }
    } else {
      for (let item of list){
        if (item.sendet){
        } else {
          this.table.querySelector('tbody').insertAdjacentHTML('beforeend', new Render(item, this.getApplicant(item.applicant)).render());
        }
      }
    }
  }
  showAllItems(isShow){
    server.request({
      action: `${isShow ? 'getAll' : 'get'}`
    }).then(data => {
      this.list = data.data;
      this.timestamp = data.timestamp;
      this.setStartValue();
    })
  }
  handler(){
    this.table.addEventListener('click', event => {
      if (event.target.type === 'checkbox' && event.target.dataset.req){
        this.setNewValue(event.target.checked, event.target.dataset.req);
      } else if (event.target.type === 'checkbox' && event.target.id === 'showAllCheck'){
        this.showSend = event.target.checked;
        if (this.filtered.length > 0){
          this.showTable(this.filtered);
        } else {
          this.showTable(this.list);
        }
      } else if (event.target.dataset.open === 'deal'){
        this.openCard(event.target.dataset.number);
      } else if (event.target.dataset.open === 'form'){
        this.getFormData(event.target.dataset.uid);
      } else if (event.target.type === 'checkbox' && event.target.id === 'isShowAll'){
        this.showAllItems(event.target.checked);
      }
    })
    this.inputDate.addEventListener('change', () => {
      this.filter(this.inputDate.name, this.inputDate.value);
    })
    this.inputDev.addEventListener('keyup', () => {
      this.filter(this.inputDev.name, this.inputDev.value);
    })
  }


  openCard(number){
    let scrollHeight = Math.max(
      document.body.scrollWidth, document.documentElement.scrollWidth,
      document.body.offsetWidth, document.documentElement.offsetWidth,
      document.body.clientWidth, document.documentElement.clientWidth
    );
    let readyString = `https://crm.centralnoe.ru/crm/deal/details/${number}/`;
    BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: 'scrollHeight'});
    return true;
  }
  setNewValue(isChecked, req){
    server.request({
      action: `${isChecked ? 'sendet' : 'unSendet'}`,
      UID: req,
      loginID: loginID
    })
  }
  getFormData(uid){
    server.request({
      action: 'getForm',
      UID: uid,
    }).then(form => {
      console.log(form)
      this.openModule(form);
    })
  }
  getFile(files){
    let filesTemplate = '';
    if (files && files.length > 0){
      let parseFiles = JSON.parse(files);
      parseFiles.forEach(file => {
        filesTemplate += `<p class="module__text">${file.name} <a download="Паспорт" href="${file.URI}">скачать</a></p>`
      })
    }
    return filesTemplate;
  }
  openModule(form){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");
    const currentY = window.pageYOffset;

    this.table.insertAdjacentHTML('beforebegin',
      `<div style="top: ${currentY}px;" class="module">
                <div class="module__wrap">
                  <div class="module__header"> 
                    <h2 class="module__head">Информация о клиенте</h2>
                    <span data-name="close" class="btn-close"></span>
                  </div>
                  <div class="module__center">
                    <p class="module__text">Фамилия<span>${form.lastName ? form.lastName : ''}</span></p>
                    <p class="module__text">Имя<span>${form.name ? form.name : ''}</span></p>
                    <p class="module__text">Отчество<span>${form.secondName ? form.secondName : ''}</span></p>
                    <p class="module__text">Номер телефона<span>${form.clientPhone ? form.clientPhone : ''}</span></p>
                    <p class="module__text">Застройщик<span>${form.developer ? form.developer : ''}</span></p>
                    <p class="module__text">ЖК<span>${form.complex ? form.complex : ''}</span></p>
                    <p class="module__text">Серия<span>${form.passSeries ? form.passSeries : ''}</span></p>
                    <p class="module__text">Номер<span>${form.passNumber ? form.passNumber : ''}</span></p>
                    <p class="module__text">Этаж<span>${form.floor ? form.floor : ''}</span></p>
                    <p class="module__text">Номер квартиры<span>${form.numberAppartment ? form.numberAppartment : ''}</span></p>
                    <p class="module__text">Площадь квартиры<span>${form.area ? form.area : ''}</span></p>
                    ${this.getFile(form.file)}
                  </div>
                  <div class="module__footer"> 
                    <button data-name="close" class="module__close"><span>Закрыть</span></button>
                  </div>
                </div>                          
              </div>`);
    this.handlerModule();
  }
  handlerModule(){
    const module = document.querySelector('.module');
    module.addEventListener('click', event => {
      if (event.target.dataset.name === 'close'){
        this.closeModule(module);
      }
    })
    document.body.addEventListener('keyup', e => {
      if (e.key === 'Escape' && module){
        this.closeModule(module);
      }
    })
  }
  closeModule(module){
    const htmlDom = document.querySelector('HTML');
    htmlDom.removeAttribute("style");
    module.remove();
  }
  filter(inputSource, value){
    if (this.inputDev.value.length === 0 && this.inputDate.value.length === 0){
      this.filtered = [];
      this.showTable(this.list);
    } else if (this.inputDev.value.length > 0 && this.inputDate.value.length > 0){
      const regExp = new RegExp(value, 'i');
      let doubleFilter = '';
      if (inputSource === 'dataCreate'){
        doubleFilter = this.filtered.filter(item => regExp.test(item.created.split(' ')[0]));
      } else {
        doubleFilter = this.filtered.filter(item => regExp.test(item[inputSource]));
      }
      this.showTable(doubleFilter);
    } else {
      if (value.length > 0) {
        const regExp = new RegExp(value, 'i');
        if(inputSource === 'dataCreate'){
          this.filtered = this.list.filter(item => regExp.test(item.created.split(' ')[0]));
        } else {
          this.filtered = this.list.filter(item => regExp.test(item[inputSource]));
        }
        this.showTable(this.filtered);
      } else {
        const selectInput = {
          developer: this.inputDate,
          dataCreate: this.inputDev,
        }
        const regExp = new RegExp(selectInput[inputSource].value, 'i');
        if (selectInput[inputSource].name === 'dataCreate'){
          this.filtered = this.list.filter(item => regExp.test(item.created.split(' ')[0]));
        } else {
          this.filtered = this.list.filter(item => regExp.test(item[selectInput[inputSource].name]));
        }
        this.showTable(this.filtered);
      }
    }
  }
}

class Render{
  constructor(row, applicant) {
    this.row = row;
    this.applicant = applicant;
  }
  getDate(date){
    if (date){
      return date.split(' ')[0].split('-').reverse().join('-');
    } else {
      return ''
    }
  }
  render(){
    return `<tr> 
              <td class="table__row"><div class="table__row_wrap"><span class="table__link" data-open="deal" data-number="${this.row.dealId}">${this.row.dealId ? this.row.dealId : ''}</span></div></td>
              <td class="table__row">
                <div class="table__row_wrap">
                  <span>${this.row.developer ? this.row.developer : ''}</span>
                  <span>${this.row.manager ? this.row.manager : ''}</span>
                  <span>${this.row.managerPhone ? this.row.managerPhone : ''}</span>
                </div>
              </td>
              <td class="table__row"><div class="table__row_wrap">${this.row.complex ? this.row.complex : ''}</div></td>
              <td class="table__row">
                <div class="table__row_wrap">
                  <span>${this.row.price ? this.row.price : ''}<span/>
                  <span>${this.row.priceType ? this.row.priceType : ''}<span/>
                </div>
              </td>
              <td class="table__row">
                <div class="table__row_wrap">
                  <span class="table__link" data-open="form" data-uid="${this.row.UID}">
                    ${this.row.lastName ? this.row.lastName : ''} ${this.row.name ? this.row.name : ''} ${this.row.secondName ? this.row.secondName : ''}
                  </span>
                    ${this.row.clientPhone ? this.row.clientPhone : ''}
                </div>
                </td>
              <td class="table__row"><div class="table__row_wrap">${this.applicant.FULL_NAME ? this.applicant.FULL_NAME : ''}</div></td>
              <td class="table__row"><div class="table__row_wrap">${+this.row.type === 0 ? 'Уведомление' : 'Бронь'}</div></td>
              <td class="table__row"><div class="table__row_wrap">${this.getDate(this.row.created)}</td>
              <td class="table__row">
                <div class="table__row_wrap">
                  <input data-req="${this.row.UID}" class="table__checkbox" type="checkbox" id="${this.row.UID}"
                  ${this.row.sendet ? 'checked' : ''}>
                  <label class="table__label" for="${this.row.UID}"></label>
                  ${this.getDate(this.row.sendet)}
                </div>
              </td>
            </tr>`
  }
}

class Server {
  constructor() {
  }
  async request(request1Cnamed){
    const myHeaders = {
      "Content-Type": "application/json; charset=utf-8"
    };
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: JSON.stringify(request1Cnamed)
    };

    let response = await fetch("https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Object/BookingDriver.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    return await response.json();
  }
  async getAllRealtors(arrayRealtors){
    const myHeaders = {
      "Content-Type": "application/json; charset=utf-8"
    };
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: JSON.stringify(arrayRealtors)
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/connector/Users.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    return await response.json();
  }
}

const server = new Server();
server.request({
  action: 'get'
}).then(data => {
  console.log(data)
  new newBuildingsSeeker(data).init();
});