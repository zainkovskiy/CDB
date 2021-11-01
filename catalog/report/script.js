/**
 * class App
 * Приложение для Отчета покупателя
 */
class App {
  constructor() {
    this.container = document.querySelector('.app');
    this.float = {}
  }

  init(){
    console.log('Получаем объект')
    this.getJson();
  }

  /** getJson()
   * запрашивает объект с сервера
   */
  async getJson() {
    var request1Cnamed = new Object();
    request1Cnamed.reqNumber = a;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    var raw = JSON.stringify(request1Cnamed);
    var requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/sellerStatsOM.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    const logoLoad = document.querySelector('.logo-load');
    logoLoad.remove();

    let jsonA = await response.json();
    this.float = jsonA;
    console.log(this.float);
    if (this.float.promotion){
      this.insertTitle()
      this.render();
    } else {
      window.location.href='https://crm.centralnoe.ru/dealincom/404.php';
    }
  }

  /** insertTitle()
   * меняет заголовок во вкладке страницы
   */
  insertTitle(){
    const head = document.querySelector('head');
    const titleInsert = `<title>${this.float.address}</title>`;
    head.insertAdjacentHTML('beforeend', titleInsert);
  }

  /** render()
   * отрисовывает страницу и график
   */
  render(){
    this.container.insertAdjacentHTML('beforeend', new Float(this.float).render());
    if (this.float.promotionStats){
      new ChartCallView(this.float.promotionStats, this.float.SelectionStats).init();
    }
  }
}

/**
 * class Float разбирает объект на
 * элеметы Dom и отрисовывает их
 */
class Float{
  constructor(float) {
    this.float = float;
    this.promotionImg = {
      'Avito': 'img/place/avito.jpg',
      'CIAN': 'img/place/cian_logo.png',
      'Domclick': 'img/place/dom_logo.jpg',
      'centralnoe': 'img/place/centr_logo.png',
      'Yandex': 'img/place/y_logo.png',
      'BN.ru': 'img/place/bn.png',
      'Мне квартиру': 'img/place/mnekvartiru.png',
      'Multilisting.su': 'img/place/Multilisting.png',
      'REALTYBELL': 'img/place/realtybell.png',
      'Nedvrf.ru': 'img/place/nedvrf.png',
      'Rentzilla': 'img/place/rentzilla.png',
      'Restate.ru': 'img/place/restate.png',
      'Купи.ру': 'img/place/qp.png',
      'Realtymag': 'img/place/realtymag.png',
      'RuCountry': 'img/place/rucountry.png',
      'FLATHOUSE': 'img/place/flathouse.png',
      'HOUSE_2_YOU': 'img/place/house2you.png',
      'Doski': 'img/place/doski.png',
      'MLSPRO': 'img/place/mlspro.png',
      'Росриэлт': 'img/place/rosrielt.png',
      'Sinels.ru': 'img/place/sinels.png',
      'UBU': 'img/place/ubu.png',
      'Esalle': 'img/place/esalle.png',
      'Mesto.ru': 'img/place/mestoru.png',
      'Квадратный метр': 'img/place/metrkv.png',
      'Аркадиа недвижимость': 'img/place/arkadia.png',
      'EIP': 'img/place/eip.png',
      'gde.ru': 'img/place/gde.png',
      'REINPORT': 'img/place/reinport.png',
      'Reforum': 'img/place/reforum.png',
      'bestru.ru': 'img/place/bestru.png',
      'UNIBO': 'img/place/unibo.png',
      'WORLD_REAL_ESTATE': 'img/place/worldrealestate.png',
      'ЮЛА': 'img/place/youla.png',
      'move.ru': 'img/place/move.png',
      'N1': 'img/place/n1_logo.png',
    }
  }

  /** howImage()
   * Проверяет количество фотографий
   * и создает новый элемент для карусели Bootstrap
   * @returns {{button: string, img: string}}
   */
  howImage(){
    let photoFloat = {
      img: '',
      button: ''
    };

    for (let i = 1; i < this.float.photo.length; i++){
      let photo = `<div class="carousel-item">
<!--                      <img src=${this.float.photo[i]} class="d-block w-100" alt="photo" onError="this.src='img/logo/tsan.jpg'">-->
                      <span class="d-block w-100" style="background-image: url(${this.float.photo[i]})"></span>
                  </div>`
      photoFloat.img += photo;
    }

    for (let i = 1; i < this.float.photo.length; i++){
      let btn = `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to=${i} aria-label="Slide ${i+1}"></button>`;
      photoFloat.button += btn;
    }
    return photoFloat;
  };

  /** isPromotion()
   * Отрисовывает ссылки на внешнюю рекламу
   * @returns {string}
   */
  isPromotion(){
    const namePromo = Object.keys(this.float.promotion);

    let promotion = {
      centralnoe: '',
      general: '',
      all: '',
      count: 0,
    }

    for (let item of namePromo){
      if (item === 'centralnoe'){
        const currentX = document.documentElement.clientWidth;
        if (currentX < 500){
          const mobileUser = 'mobile';
          let url = this.float.promotion[item].URL.split('/');
          let newURL = `${url[0]}//${url[2]}/${mobileUser}/${url[3]}/${url[4]}/`;
          promotion.centralnoe += `<a class="production__link" target="_blank" href=${newURL}>
            <img class="production__img" src=${this.promotionImg[item]} alt=${item}></a>`;
        } else {
          promotion.centralnoe += `<a class="production__link" target="_blank" href=${this.float.promotion[item].URL}>
            <img class="production__img" target="_blank" src=${this.promotionImg[item]} alt=${item}></a>`;
        }
      } else if (item === 'CIAN' || item === 'N1' || item === 'Domclick' || item === 'Yandex'){
        promotion.general +=`<a class="production__link" target="_blank" href=${this.float.promotion[item].URL}>
            <img class="production__img" src=${this.promotionImg[item]} alt=${item}></a>`;
      } else {
        promotion.all +=`<a class="production__link" target="_blank" href=${this.float.promotion[item].URL}>
            <img class="production__img" src=${this.promotionImg[item]} alt=${item}></a>`;
      }
      promotion.count++;
    }
    return promotion;
  }

  /** isChart()
   * Подбирает размер контейнера
   * для графика в зависимости от устройства пользователя
   * @returns {string}
   */
  isChart(){
    const currentX = document.documentElement.clientWidth;
    if (currentX < 500){
      return `<div style="width:100%; height:auto;" class="chart container-section">
                <canvas id="myChart" width="320" height="320"></canvas>
              </div>`;
    } else {
      return `<div class="chart container-section">
                <canvas id="myChart"></canvas>
             </div>`;
    }
  };

  /** render()
   * Отрисовывает все приложение на странице
   * @returns {string}
   */

  isDate(){
    return getDateOfISOWeek(new Date().getWeek() - 1, new Date().getFullYear()).toLocaleDateString();;
  }

  render(){
    const imgFloat = this.howImage();
    const prom = this.isPromotion();

    const chartView = this.isChart();
    const dateCreate = this.isDate();
    return `  <div class="date-create container-section">
                Дата создания ${dateCreate}
              </div>  
              <div class="header container-section">
              <img class="logo__img" src="img/logo/cent-text.svg" alt="logo">
              <div class="report_desktop mobile_visible">
                <span onclick="downloadPDF()" class="report__title" title="скачать в PDF">отчет по объекту:</span>
                <div>
                  <span class="report__type">${this.float.type}, </span>
                  <span class="report__address">${this.float.address}</span>
                </div>
              </div>   
              <div class="realtor_desktop mobile_visible">
              <span class="realtor__title title">Ваш риелтор</span>
              <div class="realtor__wrap">
                <span class="realtor__name">${this.float.name}</span>
                <a class="realtor__phone" href=tel:${this.float.rieltorNumber}>${this.float.rieltorNumber}</a>
              </div>
            </div>
            </div>
            <div class="report container-section desktop_visible">
              <span class="report__title">отчет по объекту:</span>
              <span class="report__type">${this.float.type}, </span>
              <span class="report__address">${this.float.address}</span>
            </div>   
            <div id="carouselExampleIndicators" class="carousel slide container-section" data-bs-ride="carousel">
              <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" 
                aria-current="true" aria-label="Slide 1"></button>
                ${imgFloat.button}
              </div>
              <div class="carousel-inner"> 
                <div class="carousel-item active">
                    <span class="d-block w-100" style="background-image: url(${this.float.photo[0]})"></span>
<!--                    <img src=${this.float.photo[0]} class="d-block w-100" alt="photo" onError="this.src='img/logo/tsan.jpg'">-->
                </div>         
                ${imgFloat.img}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"  
              data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Предыдущий</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"  
              data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Следующий</span>
              </button>
            </div>
            <div class="realtor container-section desktop_visible">
                <span class="realtor__title title">Ваш риелтор</span>
                <div class="realtor__wrap">
                    <span class="realtor__name">${this.float.name}</span>
                    <a class="realtor__phone" href=tel:${this.float.rieltorNumber}>${this.float.rieltorNumber}</a>
                </div>
            </div>               
            <div class="accordion accordion-flush container-section" id="accordionFlushExample">
              <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingOne">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                  data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                    Характиристики объекта
                  </button>
                </h2>
                <div class="feature__list">
                  <p class="feature__item">Общая площадь
                    <span>${this.float.features.totalArea ? this.float.features.totalArea : "----"} м.<sup>2</sup></span>
                  </p>
                  <p class="feature__item">Этаж
                    <span>${this.float.features.floors ? this.float.features.floors : "----"}</span>
                  </p>
                  <p class="feature__item">Жилая площадь
                    <span>${this.float.features.livingArea ? this.float.features.livingArea : "----"} м.<sup>2</sup></span>
                  </p>
                  <p class="feature__item">Площадь кухни
                    <span>${this.float.features.kitchenArea ? this.float.features.kitchenArea : "----"} м.<sup>2</sup></span>
                  </p>
                </div>
                <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" 
                data-bs-parent="#accordionFlushExample">
                  <div class="feature__info">
                    <p class="feature__info-item">Планировка
                        <span>${this.float.features.layout ? this.float.features.layout : "----"}</span>
                    </p>
                    <p class="feature__info-item">Санузел
                        <span>${this.float.features.bath ? this.float.features.bath : "----"}</span>
                    </p>
                    <p class="feature__info-item">Материал
                        <span>${this.float.features.material ? this.float.features.material : "----"}</span>
                    </p>
                    <p class="feature__info-item">Лоджия и балкон
                        <span>${this.float.features.gallery ? this.float.features.gallery : "----"}</span>
                    </p>
                  </div>     
                  <p class="feature__price">Цена: <span>${this.float.price} тыс. &#8381</span></p>  
                </div>
              </div>
            </div>    
            
            <div class="accordion accordion-flush container-section" id="accordionPromotion">
              <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingOne">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                  data-bs-target="#promotion-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                    <p class="promotion__title">Продвижение объекта<span>${prom.count}</span></p>
                  </button>
                </h2>
                <div class="production__header">
                  ${prom.centralnoe}
                  ${prom.general}
                </div>
                <div id="promotion-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" 
                data-bs-parent="#accordionPromotion">
                  <div class="production__wrap"> 
                    ${prom.all}
                  </div>
                </div>
              </div>
            </div>   
            ${chartView}`
  }
}

/**
 * class ChartCallView
 * Отрисовывает график "Просмотров" и "Звонков"
 * по библиотеки Charts JS
 */
class ChartCallView{
  constructor(arr, selectState) {
    this.arr = arr;
    this.selectState = selectState;
    this.ctx = document.getElementById('myChart').getContext('2d');
    this.month = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    this.dateChart = [];
    this.countCall = [];
    this.countView = [];
    this.countSelections = [];
    this.newCountView = [];
    this.newCountCall = [];
    this.newCountSelections = [];
  }

  /** init()
   * разбирает объект на данные
   * подготавливает график для отрисовки
   */
  init(){
    if (this.selectState){
      this.selectState.sort((a, b) => {
        return a.date - b.date;
      })
      for (let item of this.selectState){
        this.countSelections.push(item.countSelections);
      }
    }

    for (let item of this.arr) {
      const dayDot = getDateOfISOWeek(item.date, 2021).getDate();
      const monthDot = this.month[getDateOfISOWeek(item.date, 2021).getMonth()];
      let fullDate = dayDot + '. ' + monthDot;

      this.dateChart.push(fullDate);
      this.countCall.push(item.countCall);
      this.countView.push(item.countView);
    }
    this.newCountView = this.setPercent(this.countView);
    this.newCountCall = this.setPercent(this.countCall);
    this.newCountSelections = this.setPercent(this.countSelections);

    document.myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.dateChart, //Номер недели в нашем случае
        datasets: [],
        oldDataset: [],
      },
      options: {
        animations: {
          radius: {
            duration: 400,
            easing: 'linear',
            loop: (context) => context.active
          }
        },
        hoverRadius: 10,
        hoverBackgroundColor: 'white',
        interaction: {
          mode: 'nearest',
          intersect: false,
          axis: 'x'
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        },
        plugins: {
          legend:{
            position: 'bottom',
            labels: {
              usePointStyle: true,
            }
          },
          title: {
            display: true,
            text: 'Статистика просмотров на площадках'
          },
          interaction: {
            intersect: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = ` ${context.dataset.label} ${context.dataset.oldDataset[context.dataIndex]}`;
                return label;
              }
            }
          },
        },
      }
    });

    this.addDataset("Просмотры объявления", this.newCountView, this.countView,  '#102684',  '#102684',);
    this.addDataset("Открытия номера телефона", this.newCountCall, this.countCall, '#ffc600', '#ffc600',);
    this.addDataset("Попадания в подборки", this.newCountSelections, this.countSelections, '#2a9d15','#2a9d15');
  }

  /** setPercent(arr)
   * Переводит значения в процентное соотношение
   * @param arr
   * @returns {*[]}
   */
  setPercent(arr){
    let number = 0;
    let newArr = [];

    for (let item of arr){
      if (item > number){
        number = item;
      }
    }
    for (let item of arr){
      newArr.push((item*100/number).toFixed(2));
    }
    return newArr;
  }

  /** addDataset()
   * Заполняет график данными тем самым отрисовывая его
   * @param nameDataset массив(ось X)
   * @param dataDataset массив значений в процентах (ось Y)
   * @param oldDataset массив значений с начальными данными
   * @param colorV цвет Точки
   * @param colorL цвет линии
   */
  addDataset(nameDataset, dataDataset, oldDataset, colorV, colorL){
    const newDataset = {
      label: nameDataset,
      backgroundColor: colorV,
      borderColor: colorL,
      borderWidth: 5,
      data: dataDataset,
      oldDataset: oldDataset,
      pointRadius: 5,
      pointStyle: 'circle',
    };
    document.myChart.data.datasets.push(newDataset);
    document.myChart.data.oldDataset.push(newDataset);
    document.myChart.update();

  }
}

/**
 * Инициальзирует Арр
 */
const appStart = new App();
appStart.init();

/** downloadPDF
 * переводит html страницу в pdf
 * скачивает её пользователю
 * */
function downloadPDF(){
  html2canvas(document.querySelector("#app")).then(canvas => {
    const app = document.querySelector('.app');
    const doc = new jsPDF('l', 'pt', [app.clientWidth, app.clientHeight]);

    let imgData = canvas.toDataURL("image/jpeg", 1.0);

    doc.addImage(imgData, 'JPEG', 0, 0, app.clientWidth, app.clientHeight);
    doc.save("download.pdf");
  });
}

/**
 * устанавливает свойство в объек дата
 * нахлждение номера недели
 * @returns {number}
 */
Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

/** getDateOfISOWeek(w, y)
 *  функция перевода недели года в дату
 * @param w (число недели)
 * @param y (год)
 * @returns {Date}
 */
function getDateOfISOWeek(w, y) {  //функция перевода недели года в дату
  const simple = new Date(y, 0, 1 + (w - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4)
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}
