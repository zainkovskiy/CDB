class Search {
  constructor() {
    this.container = document.querySelector('.main');
    this.tableField = document.querySelector('.table');
    this.inputs = document.querySelectorAll('INPUT');
    this.requestObj = {};
  }
  init(){
    this.container.addEventListener('click', event => {
      if (event.target.tagName === 'BUTTON'){
        this.collectValue();
        this.requestData().then(data => {
          if (data.length > 0){
            console.log(data)
            this.showTable(data);
          } else {
            this.startTable();
          }
        });
      } else if (event.target.dataset.action){
        this.openCard(event.target.dataset.action, event.target.dataset.number)
      }
    })
  }
  collectValue(){
    this.requestObj = {};
    for (let input of this.inputs){
      this.requestObj[input.name] = input.value;
    }
  }
  async requestData(){
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(this.requestObj)
    };

    let response = await fetch("https://50970.vds.miran.ru:553/Servers/Internal/AdmObjSearch.php", requestOptions);

    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    return await response.json();
  }
  showTable(rows){
    this.startTable();
    for (let row of rows){
      this.tableField.insertAdjacentHTML('beforeend', this.getRow(row));
    }
  }
  getRow(row){
    return `<tr class="table__row">                 
              <td><span class="table__link" data-action="card" data-number="${row.reqNumber}">${row.reqNumber}</span></td>
              <td><span class="table__link" data-action="deal" data-number="${row.dealId}">${row.dealId}</span></td>
              <td><span class="table__link" data-action="card" data-number="${row.reqNumber}">${row.addressHash}</span></td>
              <td><span class="table__link">${row.reqResponsibleRealtor}</span></td>
            </tr>`
  }
  startTable(){
    this.tableField.innerHTML = '';
    this.tableField.insertAdjacentHTML('beforeend',
      `<thead>
              <td>Заявка</td>
              <td>Сделка</td>
              <td>Адресс</td>
              <td>Риелтор</td>
            </thead>`);
  }

  openCard(action, number){
    const windowWidth = window.innerWidth * 0.9;
    const readyString = {
      card: `https://crm.centralnoe.ru/CDB/object/card/cardObject.php?login=yes&source=1c&id=${number}`,
      deal: `https://crm.centralnoe.ru/crm/deal/details/${number}/`,
      user: `https://crm.centralnoe.ru/company/personal/user/${number}/`,
    }
    BX.SidePanel.Instance.open(readyString[action], {animationDuration: 300,  width: windowWidth});
    return true;
  }
}

const search = new Search();
search.init();

//todo нцжны id риелторов