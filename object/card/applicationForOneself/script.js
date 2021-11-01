class Application{
  constructor() {
    this.container = document.querySelector('.application');
  }
  init(){
    this.container.insertAdjacentHTML('beforeend',
  `<p class="application__text">
        При резервировании заявки на Себя, у Вас будет 3 дня, на то что перевести её в статус Рекламного договора или СК
        </p>
        <div class="application__buttons">
            <button data-name="back" class="application__button">Отмена</button>
            <button data-name="forward" class="application__button">Далее</button>
        </div>`);
    new Handler(this.container).init();
  }
  initFalse(){
    this.container.insertAdjacentHTML('beforeend',
      `<p class="application__text application__error">
            ОШИБКА Техническая поддержка ужу уведомлена о возникшей проблеме
            </p>`)
  }
  initTooMany(){
    this.container.insertAdjacentHTML('beforeend',
      `<p class="application__text application__error">
            Превышено максимальное количество заявок в резерве
            </p>`)
  }
  async getJson() {
    const request1Cnamed = {
      user: login,
      id: UID,
      action: 'makeReservation',
    };
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

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/objectViewer.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    return jsonA;
  }
}

class Handler{
  constructor(container) {
    this.container = container;
  }
  init(){
    this.container.addEventListener('click', event => {
      if (event.target.tagName === 'BUTTON'){
        if (event.target.dataset.name === 'back'){
          history.back(1);
        } else if (event.target.dataset.name === 'forward'){
          application.getJson().then(data => {
            if (data.status === "success"){
              location = `https://crm.centralnoe.ru/objectCard/object/?source=1c&id=${UID}`;
            } else if (data.status === "toomany") {
              this.container.innerHTML = '';
              application.initTooMany();
            } else{
              this.container.innerHTML = '';
              application.initFalse();
            }
          })
        }
      } else {
        return
      }
    })
  }
}

const application = new Application();
application.init();