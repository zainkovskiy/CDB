class newBuildingsSeeker {
  constructor(data) {
    this.list = data;
    this.filtered = [];
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
      for (let item of list){
        this.table.querySelector('tbody').insertAdjacentHTML('beforeend', new Render(item).render());
      }
    } else {
      this.table.querySelector('tbody').innerHTML = '';
    }
  }
  handler(){
    this.table.addEventListener('click', event => {
      if (event.target.type === 'checkbox'){
        this.setNewValue(event.target.checked, event.target.dataset.req);
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
              <td class="table__row"><div class="table__row_wrap">${this.row.realtor}</div></td>
              <td class="table__row"><div class="table__row_wrap">${this.row.type}</div></td>
              <td class="table__row"><div class="table__row_wrap">${this.row.dataCreate}</td>
              <td class="table__row">
                <div class="table__row_wrap">
                  <input data-req="${this.row.reqNumber}" class="table__checkbox" type="checkbox" id="${this.row.reqNumber}">
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
        type: 'type',
        dataCreate: '2022-01-01',
        dataSend: '12-01-2022',
        reqNumber: 1
      },
      {
        developer: 'dev2',
        complex: 'complex',
        realtor: 'realtor',
        type: 'type',
        dataCreate: '2020-04-22',
        dataSend: '12-01-2022',
        reqNumber: 2
      },
      {
        developer: 'dev3',
        complex: 'complex',
        realtor: 'realtor',
        type: 'type',
        dataCreate: '2008-08-04',
        dataSend: '12-01-2022',
        reqNumber: 3
      },
      {
        developer: 'dev3',
        complex: 'complex',
        realtor: 'realtor',
        type: 'type',
        dataCreate: '2006-10-10',
        dataSend: '12-01-2022',
        reqNumber: 4
      },
    ]
  }
}

const server = new Server();
server.request().then(data => {
  new newBuildingsSeeker(data).init();
});