class App {
  constructor() {
    this.container = document.querySelector('.app');
    this.name = '';
  }

  init(){
    this.container.insertAdjacentHTML('beforeend', new Layout(this.name).render())
  }

  async getJson() {
    const request1Cnamed = new Object();
    request1Cnamed.client = 'zainkovskiyaa';
    request1Cnamed.action = 'authorization';

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const raw = JSON.stringify(request1Cnamed);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("script/authorize.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    this.name = jsonA.name;
    console.log(jsonA)

    this.init();
  }
}

class Layout{
  constructor(name) {
    this.name = name;
  }
  render(){
    return `<header class="header">
                <span class="header__logo"></span>       
            </header>
            <section class="main">
                <a href="leads/index.html" data-count="5" class="main__btn">Лиды</a>
                <a href="deals/index.html" data-count="15" class="main__btn">Сделки</a>
                <button data-count="2" class="main__btn">Контакты</button>
                <button data-count="22" class="main__btn">Звонки</button>
                <button data-count="26" class="main__btn">Объекты</button>
                <a href="catalog/index.html" data-count="74" class="main__btn">Каталог</a>
                <button data-count="1" class="main__btn">Подборки</button>
                <button data-count="5" class="main__btn">Магазин</button>
            </section>
            <footer class="footer"> 
                <button class="footer__btn">Сообщить об ошибке</button>
            </footer>`
  }
}

const app = new App();
app.getJson();