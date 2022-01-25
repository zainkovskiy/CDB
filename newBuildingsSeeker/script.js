class newBuildingsSeeker {
  constructor(data) {
    this.list = data;
    this.filtered = [];
    this.showSend = false;
    this.table = document.querySelector('.table');
    this.inputDev = document.querySelector(`INPUT[name='developer']`);
    this.inputDate = document.querySelector(`INPUT[name='dataCreate']`);
  }
  init(){
    this.showTable(this.list);
    this.handler();
  }
  showTable(list){
    if (list.length > 0){
      this.table.querySelector('tbody').innerHTML = '';
      if (this.showSend){
        for (let item of list){
          this.table.querySelector('tbody').insertAdjacentHTML('beforeend', new Render(item).render());
        }
      } else {
        for (let item of list){
          if (!item.check){
            this.table.querySelector('tbody').insertAdjacentHTML('beforeend', new Render(item).render());
          }
        }
      }
    } else {
      this.table.querySelector('tbody').innerHTML = '';
    }
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
      }
    })
    this.inputDate.addEventListener('change', () => {
      this.filter(this.inputDate.name, this.inputDate.value);
    })
    this.inputDev.addEventListener('keyup', () => {
      this.filter(this.inputDev.name, this.inputDev.value);
    })
  }
  setNewValue(isChecked, req){
    console.log(isChecked, req)
  }
  filter(inputSource, value){
    if (this.inputDev.value.length === 0 && this.inputDate.value.length === 0){
      this.filtered = [];
      this.showTable(this.list);
    } else if (this.inputDev.value.length > 0 && this.inputDate.value.length > 0){
      const regExp = new RegExp(value, 'i');
      const doubleFilter = this.filtered.filter(item => regExp.test(item[inputSource]));
      this.showTable(doubleFilter);
    } else {
      if (value.length > 0) {
        const regExp = new RegExp(value, 'i');
        this.filtered = this.list.filter(item => regExp.test(item[inputSource]));
        this.showTable(this.filtered);
      } else {
        const selectInput = {
          developer: this.inputDate,
          dataCreate: this.inputDev,
        }
        const regExp = new RegExp(selectInput[inputSource].value, 'i');
        this.filtered = this.list.filter(item => regExp.test(item[selectInput[inputSource].name]));
        this.showTable(this.filtered);
      }
    }
  }
}

class Render{
  constructor(row) {
    this.row = row;
  }
  render(){
    return `<tr> 
              <td class="table__row"><div class="table__row_wrap">${this.row.developer}</div></td>
              <td class="table__row"><div class="table__row_wrap">${this.row.complex}</div></td>
              <td class="table__row"><div class="table__row_wrap">${this.row.name}</div></td>
              <td class="table__row"><div class="table__row_wrap">${this.row.phone}</div></td>
              <td class="table__row"><div class="table__row_wrap">${this.row.realtor}</div></td>
              <td class="table__row"><div class="table__row_wrap">${this.row.type}</div></td>
              <td class="table__row"><div class="table__row_wrap">${this.row.dataCreate}</td>
              <td class="table__row">
                <div class="table__row_wrap">
                  <input data-req="${this.row.reqNumber}" class="table__checkbox" type="checkbox" id="${this.row.reqNumber}"
                  ${this.row.check ? 'checked' : ''}>
                  <label class="table__label" for="${this.row.reqNumber}"></label>
                  ${this.row.dataSend}
                </div>
              </td>
            </tr>`
  }
}

class Server {
  constructor() {
  }
  async request(){
    return [
      {
        developer: 'dev1',
        complex: 'complex',
        realtor: 'realtor',
        name: 'name',
        phone: '89997779977',
        type: 'type',
        dataCreate: '2022-01-01',
        dataSend: '2022-01-01',
        reqNumber: 1,
        check: true,
      },
      {
        developer: 'dev2',
        complex: 'complex',
        realtor: 'realtor',
        name: 'name',
        phone: '89997779977',
        type: 'type',
        dataCreate: '2020-04-22',
        dataSend: '2020-04-22',
        reqNumber: 2,
        check: false,
      },
      {
        developer: 'dev3',
        complex: 'complex',
        realtor: 'realtor',
        name: 'name',
        phone: '89997779977',
        type: 'type',
        dataCreate: '2008-08-04',
        dataSend: '2008-08-04',
        reqNumber: 3,
        check: false,
      },
      {
        developer: 'dev3',
        complex: 'complex',
        name: 'name',
        phone: '89997779977',
        realtor: 'realtor',
        type: 'type',
        dataCreate: '2006-10-10',
        dataSend: '2006-10-10',
        reqNumber: 4,
        check: true,
      },
    ]
  }
}

const server = new Server();
server.request().then(data => {
  new newBuildingsSeeker(data).init();
});