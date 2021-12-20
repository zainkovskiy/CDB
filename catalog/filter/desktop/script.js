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
    if (select === '.metro__select'){
      $('<div>',{
        class: 'select__gap metro__gap',
        text: firstWord
      }).insertAfter($this);
    } else {
      $('<div>', {
        class: 'select__gap',
        text: firstWord
      }).insertAfter($this);
    }

    var selectGap = $this.next('.select__gap'),
      caret = selectGap.find('.caret');
    // Add ul list
    if (select === '.metro__select'){
      $('<ul>',{
        class: 'select__list metro__list'
      }).insertAfter(selectGap);
    } else {
      $('<ul>',{
        class: 'select__list'
      }).insertAfter(selectGap);
    }

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
const novosibirsk = 'Новосибирская';
const kemerovo = 'Кемеровская область - Кузбасс';

$("#address").suggestions({
  token: "408e6651c0b9bfc8e2f487383d45353973f3285c",
  type: "ADDRESS",
  bounds: "city-house",
  /* Вызывается, когда пользователь выбирает одну из подсказок */
  onSelect: function(suggestion) {
    if(suggestion.data.region === novosibirsk || suggestion.data.region === kemerovo){
      if (suggestion.data.city || suggestion.data.settlement){
        address.addressValue = suggestion.value;
        address.addressObject = suggestion;
        address.metroArray = [];
        address.districtArray = [];
        for (let key in address.metroValue){
          address.metroValue[key] = false;
        }
        for (let key in address.districtValue){
          address.districtValue[key] = false;
        }
      }
    }
    console.log(suggestion);
  }
});

class AddressHandler {
  constructor() {
    this.container = document.querySelector('.container');
    this.districtNsk = [
      'Дзержинский район',
      'Железнодорожный район',
      'Заельцовский район',
      'Калининский район',
      'Кировский район',
      'Ленинский район',
      'Октябрьский район',
      'Первомайский район',
      'Советский район',
      'Центральный район',
      // 'Авиастроителей',
      // 'Акатуйский',
      // 'Башня',
      // 'Беловежский',
      // 'Береговой_ж/м',
      // 'Березовое',
      // 'Берёзовая_роща',
      // 'Благовещенский',
      // 'Богдана_Хмельницкого',
      // 'Ботанический_ж/м',
      // 'Бугринская_роща',
      // 'Вертковская',
      // 'Вверхняя_зона_Академгородка',
      // 'Весенний',
      // 'Военный_городок',
      // 'Вокзал',
      // 'Волочаевская',
      // 'Волочаевский_ж/м',
      // 'Восточный_МЖК',
      // 'Восход',
      // 'ГПНТБ',
      // 'Гвардейский',
      // 'Горбольница',
      // 'Городской_аэропорт',
      // 'Горский',
      // 'Гэсстроевский',
      // 'ДК_Кирова',
      // 'ДК_Энергия',
      // 'Депутатский',
      // 'Дивногорский',
      // 'Европейский_берег',
      // 'Ерестинский',
      // 'Есенина',
      // 'Закаменский',
      // 'Западный_ж/м',
      // 'Затон',
      // 'Затулинский_ж/м',
      // 'Зеленая_горка',
      // 'Золотая_горка',
      // 'Золотая_нива',
      // 'Иподромский',
      // 'КСМ',
      // 'Каменский',
      // 'Карьер_Мочище',
      // 'Кирова',
      // 'Клюквенный',
      // 'Ключ-Камышенское_плато',
      // 'Ключевой',
      // 'Коминтерна',
      // 'Кропоткинский_ж/м',
      // 'Лесопервалка',
      // 'Линейный',
      // 'Матвеевка',
      // 'Минделеевский',
      // 'Мира_(Расточка)',
      // 'Молодежный',
      // 'Нарымский_сквер',
      // 'Нижняя_Ельцовка',
      // 'Нижняя_зона_Академгородка',
      // 'Никитинский',
      // 'Новомарусино',
      // 'Облбольница',
      // 'ОбьГЭС',
      // 'Огурцово',
      // 'Палласа',
      // 'Памирский',
      // 'Пашино_пос.',
      // 'Пермский',
      // 'Планировочный_ж/м',
      // 'Плановая',
      // 'Плановый_пос.',
      // 'Плехановский_ж/м',
      // 'Площадь_Калинина',
      // 'Площадь_Маркса',
      // 'Площадь_Свердлова',
      // 'Площадь_Станиславского',
      // 'Плющихинсий_ж/м',
      // 'Посёлок_РМЗ',
      // 'Прибрежный',
      // 'Приозёрный',
      // 'Проспект_Дзержинского',
      // 'Просторный_ж/м',
      // 'пос._Геологов',
      // 'Радиостанция',
      // 'Родники_(6-й_мкр)',
      // 'Сад_Дзержинского',
      // 'Сад_Кирова',
      // 'Сад_Мичуринцев',
      // 'Северный_пос.',
      // 'Северо-Чемской_ж/м',
      // 'Снегири_(5-й_мкр)',
      // 'Совсибирь',
      // 'Станиславский_ж/м',
      // 'Сто_домов',
      // 'Стрижи',
      // 'Студенческий',
      // 'Сухарная',
      // 'Сухой_лог',
      // 'ТРЦ_АУРА',
      // 'Телецентр',
      // 'Тихвинский',
      // 'Тихий_центр',
      // 'Троллейный_ж/м',
      // 'Фабричный',
      // 'Фрунзенский',
      // 'Хилокский',
      // 'ЦУМ',
      // 'Центр',
      // 'Центр_(Красный проспект)',
      // 'Центральная_Пермовайка',
      // 'Челюскинский_ж/м',
      // 'Чистая_слобода',
      // 'Шевченский',
      // 'Шлюз',
      // 'Энергостроителей',
      // 'Юбилейный_(4-й_мкр)',
      // 'Юго-Западный_ж/м',
      // 'Южно-Чемской_ж/м',
      // 'Южный_(Ленинский р-н)',
      // 'Южный_(Первомайский р-н)',
    ];
    this.districtKem = [
      'Заводский район',
      'Кедровка район',
      'Кировский район',
      'Ленинский район',
      'Рудничный район',
      'Центральный район',
    ]
    this.districtArray = [];
    this.districtValue = {
      dzerzhinskiy : false,
      zheleznodorozhniy : false,
      zaelovskiy : false,
      kalininskiy : false,
      kirovskiy : false,
      leninskiy : false,
      oktyabrskiy : false,
      pervomayskiy : false,
      sovetskiy : false,
      centralniy : false,
      zavodskoy : false,
      kedrovka : false,
      rudnichiy : false,
    };
    this.metroArray = [];
    this.metroValue = {
      marksa: false,
      student: false,
      vokzal: false,
      oktyabr: false,
      lenina: false,
      krasniy: false,
      gagarin: false,
      zaelcovskaya: false,
      mihalovskogo: false,
      siber: false,
      marshal: false,
      bereza: false,
      niva: false,
    }
    this.metroTime = '';
    this.filter = [];
    this.currentElem = '';
    this.countRoom = [];
    this.objectFilter = {};
    this.addressValue = '';
    this.addressObject = '';
    this.currentRegion = 'Новосибирская обл, ';
    this.cards = [];
    this.copyCards = [];
    this.startPaginat = 0;
    this.countPaginat = 0;
    this.balancePaginat = 0;
    this.currentPaginatActive = 0;
    this.historyFilter = '';
  }
  init(){
    this.handlerSource();
    this.hideButtonStart();
    this.container.addEventListener('click', event => {
      if(event.target.dataset.name === 'metro'){
        document.querySelector('.suggestions-suggestions').setAttribute('style', 'display: none;')
        this.openModule('Поиск по станции метро', this.metroLayout());
        selectStyle('.metro__select', `${this.metroTime ? this.metroTime : '15 минут'}`);
        this.checkCurrentElem();
      } else if (event.target.dataset.name === 'district'){
        document.querySelector('.suggestions-suggestions').setAttribute('style', 'display: none;')
        this.openModule('', this.districtLayout());
        this.checkCurrentElem();
      } else if (event.target.dataset.name === 'extra'){
        this.openModule('Дополнительные фильтры', this.extraOpenLayout());
        this.checkCurrentElem();
        this.handlerExtraInputValue();
      } else if (event.target.dataset.name === 'search') {
        this.setAllValue();
        this.setLoader();
        this.sendToServer().then(data => {
          console.log(data)
          this.setCountCard(data);
          new Cards(data).init();
          this.handlerLinkToStop();
          document.querySelector(`INPUT[name='sort']`).value = `Сортировка по умолчанию`;
          if (data.length > 100){
            this.startPaginat = 0;
            this.currentPaginatActive = 0;
            this.setPagination();
            this.renderPagination();
          } else {
            this.clearPaginationContainer();
          }
          this.removeLoader();
          document.querySelector('#map').innerHTML = '';
          this.initMap(this.cards);
        });
      } else if (event.target.dataset.input === 'reqTypeofRealty'){
        document.querySelector(`INPUT[name='reqTypeofRealty']`).value = event.target.dataset.value;
        this.checkCurrentElem();
      } else if (event.target.dataset.input === 'sort') {
        document.querySelector(`INPUT[name='sort']`).value = event.target.dataset.value;
        this.sortCardsHandler(event.target.dataset.action);
        if (this.cards.length > 100){
          this.startPaginat = 0;
          this.currentPaginatActive = 0;
          this.renderPagination();
        } else {
          this.clearPaginationContainer();
        }
        this.checkCurrentElem();
      } else if (event.target.dataset.room){
        if (event.target.checked){
          this.countRoom.push(event.target);
          this.setRoomValue(event);
        } else {
          const find = this.countRoom.find(item => item === event.target);
          const indexFind = this.countRoom.indexOf(find);
          this.countRoom.splice(indexFind, 1);
          this.setRoomValue(event);
        }
      } else if (event.target.dataset.region === 'reqRegion'){
        this.openModule('Местоположение', this.regionLayout());
      } else if (event.target.dataset.input === 'clear'){
        this.clearInputValue(event);
      } else if (event.target.dataset.direction){
        this.setDirectionPagination(event.target.dataset.direction);
      } else if (event.target.dataset.paginat && !event.target.dataset.border){
        this.setPaginationActive(event);
        this.showNewPartCards(event);
      } else if (event.target.dataset.border){
        this.setPaginationBorder(event);
      } else if (event.target.dataset.arrow === 'up'){
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } else if (event.target.dataset.card === 'reserv'){
        const addFloat = this.cards.find(card => card.reqNumber === event.target.dataset.req);
        const floatInArr = basket.fullness.find(card => card.reqNumber === event.target.dataset.req);
        event.target.classList.toggle('card__btn_select');
        if (floatInArr){
          addFloat.basketAdd = 0;
          document.querySelector(`.btn${event.target.dataset.req}`).classList.remove('card__btn_select');
          basket.fullness.splice(basket.fullness.indexOf(floatInArr), 1);
          basket.init();
        } else {
          const btnFromList = document.querySelector(`.btn${event.target.dataset.req}`);
          btnFromList ? btnFromList.classList.add('card__btn_select') : '';
          addFloat.basketAdd = 1;
          basket.fullness.push(addFloat);
          basket.init();
        }
        document.querySelector('#map').innerHTML = '';
        this.initMap(this.cards);
        console.log(basket.fullness)
      } else if (event.target.dataset.name === 'basket'){
        if (basket.fullness.length > 0){
          const elem = document.querySelector(`.${event.target.dataset.name}__block`);
          if (elem.classList.contains('visible')){
            this.checkCurrentElem();
            elem.classList.remove('visible');
            this.currentElem = elem;
          } else {
            this.checkCurrentElem();
          }
        }
      } else if (event.target.dataset.basket === 'clear'){
        for (let card of basket.fullness){
          const find = this.cards.find(item => item.reqNumber === card.reqNumber);
          find.basketAdd = 0;
          if (document.querySelector(`.btn${find.reqNumber}`)){
            document.querySelector(`.btn${find.reqNumber}`).classList.remove('card__btn_select');
          }
        }
        basket.fullness = [];
        basket.init();
        document.querySelector('#map').innerHTML = '';
        this.initMap(this.cards);
        this.checkCurrentElem();
      } else if (event.target.dataset.basket === 'save'){
        if (activeDeal){
          this.checkCurrentElem();
          this.setLoader();
          this.sendCompilation(activeDeal).then(() => {
            this.clearReserveItem();
            basket.fullness = [];
            basket.init();
            document.querySelector('#map').innerHTML = '';
            this.initMap(this.cards);
            console.log(this.cards)
            document.querySelector('.loader__img').style.backgroundImage='url(https://crm.centralnoe.ru/dealincom/assets/statusOk.gif)'
            setTimeout(() => {
              this.removeLoader();
            }, 500)
          });
        } else {
          let req = {
            action : 'getDeals',
            author : currentUserId,
          }
          this.getDealOrHistory(req).then(data => {
            this.openModule('Выберете сделку', this.dealLayout(data));
            this.checkCurrentElem();
          });
        }
      } else if (event.target.dataset.name === 'story'){
        if (activeDeal){
          let req = {
            action : 'historySearch',
            dealId : 1,
          }
          this.setLoader();
          this.getDealOrHistory(req).then(data => {
            this.historyFilter = data;
            this.openModule('История поиска по сделке', this.historyLayout(data));
            this.removeLoader();
          })
        }
      } else if (event.target.dataset.open === 'openCard'){
        this.openCard(event.target.dataset.req, event.target.dataset.source);
      } else if (event.target.dataset.name === 'map'){
        const heightEmpty = window.innerHeight - document.querySelector('.search-form').offsetHeight + document.querySelector('.search-form').offsetTop - 20;
        if (this.cards.length > 0){
          if(event.target.classList.contains('btn-map_active')){
            document.querySelector('#map').removeAttribute('style');
            document.querySelector('.cards').classList.remove('visible');
            document.querySelector('.pagination').classList.remove('visible');
            document.querySelector('.last-elem').classList.remove('visible');
            document.querySelector('.map__wrapper').classList.add('visible');
            event.target.classList.toggle('btn-map_active');
            document.querySelector('.map__right').innerHTML = '';
            document.querySelector('.map__right').classList.remove('map__bar_open');
          } else {
            document.querySelector('#map').setAttribute('style', `height: ${heightEmpty}px;`);
            document.querySelector('.cards').classList.add('visible');
            document.querySelector('.pagination').classList.add('visible');
            document.querySelector('.last-elem').classList.add('visible');
            document.querySelector('.map__wrapper').classList.remove('visible');
            event.target.classList.toggle('btn-map_active');
          }
        }
      } else if (event.target.dataset.clear === 'filter'){
        location.reload();
      } else if (event.target.dataset.info === 'catalog'){
        this.openInfo();
      } else if (event.target.dataset.alert === 'open'){
        this.openModule('Сообщить об ошибке', this.alertErrorLayout());
        const sound = new Audio('audio/bell-sound.mp3')
        sound.play();
      } else if (event.target.dataset.name === 'add'){
        this.openNewObject();
      }
    });

    for (let input of document.querySelectorAll('.start__input')){
      input.addEventListener('focus', () => {
        this.checkCurrentElem();
          if(input.name === 'address'){
            if (this.addressValue.length === 0){
              input.value = this.currentRegion;
              setTimeout(() => {
                input.selectionStart = input.value.length;
              }, 50)
            } else if (this.addressValue.length > 0){
              input.value = this.addressValue;
            }
            const currentRegion = document.querySelector('.place__text').innerHTML;
            setTimeout(() => {
              const btnGroup = document.querySelector('.address__btn');
              if (!btnGroup){
                if (currentRegion === 'Новосибирская область'){
                  document.querySelector('.suggestions-suggestions').insertAdjacentHTML('beforeend',
                    `<div data-elem="check" class="address__btn">
                      <button data-elem="check" data-name="metro" class="address__btn-item"><span class="address__title">Метро</span><span class="address__arrow"></span></button>
                      <button data-elem="check" data-name="district" class="address__btn-item"><span class="address__title">Район и микрорайон</span><span class="address__arrow"></span></button>
                  </div>`)
                } else if (currentRegion === 'Кемеровская область'){
                  document.querySelector('.suggestions-suggestions').insertAdjacentHTML('beforeend',
                    `<div data-elem="check" class="address__btn">                      
                      <button data-elem="check" data-name="district" class="address__btn-item"><span class="address__title">Район и микрорайон</span><span class="address__arrow"></span></button>
                  </div>`)
                }
              }
            }, 500)
          } else {
            const elem = document.querySelector(`.${input.name}__block`);
            elem.classList.remove('visible');
            this.currentElem = elem;
          }
      })
      if (input.name === 'address'){
        input.addEventListener('keyup', () => {
          const currentRegion = document.querySelector('.place__text').innerHTML;
          setTimeout(() => {
            const btnGroup = document.querySelector('.address__btn');
            if (!btnGroup){
              if (currentRegion === 'Новосибирская область'){
                document.querySelector('.suggestions-suggestions').insertAdjacentHTML('beforeend',
                  `<div data-elem="check" class="address__btn">
                      <button data-elem="check" data-name="metro" class="address__btn-item"><span class="address__title">Метро</span><span class="address__arrow"></span></button>
                      <button data-elem="check" data-name="district" class="address__btn-item"><span class="address__title">Район и микрорайон</span><span class="address__arrow"></span></button>
                  </div>`)
              } else if (currentRegion === 'Кемеровская область'){
                document.querySelector('.suggestions-suggestions').insertAdjacentHTML('beforeend',
                  `<div data-elem="check" class="address__btn">                      
                      <button data-elem="check" data-name="district" class="address__btn-item"><span class="address__title">Район и микрорайон</span><span class="address__arrow"></span></button>
                  </div>`)
              }
            }
          }, 500)
          if (input.value.length === 0){
            this.addressValue = '';
            this.addressObject = '';
            input.value = '';
          }
        })
        input.addEventListener('blur', () => {
          const currentRegion = document.querySelector('.place__text').innerHTML;
          let regionValue = '';
          if (currentRegion === 'Новосибирская область'){
            regionValue = novosibirsk;
          } else if (currentRegion === 'Кемеровская область'){
            regionValue = kemerovo;
          }
          if (this.addressObject){
            if (this.addressObject.data.region === regionValue){
              this.showChangeMetroDistrict();
            } else {
              this.addressValue = '';
              this.addressObject = '';
              input.value = '';
            }
          } else {
            this.showChangeMetroDistrict();
          }
        })
        input.addEventListener('click', () => {
          input.selectionStart = input.value.length;
        })
      }
    }

    document.body.addEventListener('click', event => {
      if (event.target.dataset.elem !== 'check'){
        this.checkCurrentElem();
      }
    })

    this.handlerPriceFilter();
  }
  hideButtonStart(){
    if (activeDeal.length === 0){
      document.querySelector('.btn-story').classList.add('visible');
      document.querySelector('.btn-add').classList.add('visible');
      document.querySelector('.btn-basket').setAttribute('style', 'margin: 0;');
    }
    if (dealClients === 'null'){
      document.querySelector('.btn-add').classList.add('visible');
    }
  }
  clearReserveItem(){
    for (let card of basket.fullness){
      const find = this.cards.find(item => item.reqNumber === card.reqNumber);
      const findFromDOM = document.querySelector(`.btn${find.reqNumber}`);
      find.basketAdd = 0;
      if (findFromDOM){
        findFromDOM.classList.remove('card__btn_select');
      }
    }
  }

  openInfo(){
    let readyString = `https://crm.centralnoe.ru/CDB/object/card/info/catalog/index.html`;
    BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: 925, });
  }
  handlerLinkToStop(){
    const linkALl = document.querySelectorAll('A');
    for (let link of linkALl){
      link.addEventListener('click', e => {
        e.preventDefault();
      })
    }
  }
  initMap(cards){
    ymaps.ready(function () {
      var myMap = new ymaps.Map('map', {
          center: [55.030204, 82.920430],
          zoom: 11,
          controls: [],
        }, {
          // searchControlProvider: 'yandex#search'
        }),
        /**
         * Создадим кластеризатор, вызвав функцию-конструктор.
         * Список всех опций доступен в документации.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#constructor-summary
         */
        clusterer = new ymaps.Clusterer({
          /**
           * Через кластеризатор можно указать только стили кластеров,
           * стили для меток нужно назначать каждой метке отдельно.
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage.xml
           */
          // preset: 'islands#invertedVioletClusterIcons',
          openBalloonOnClick: false,
          /**
           * Ставим true, если хотим кластеризовать только точки с одинаковыми координатами.
           */
          groupByCoordinates: false,
          /**
           * Опции кластеров указываем в кластеризаторе с префиксом "cluster".
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark.xml
           */
          clusterDisableClickZoom: true,
          clusterHideIconOnBalloonOpen: false,
          geoObjectHideIconOnBalloonOpen: false,
          // Макет метки кластера pieChart.
          clusterIconLayout: 'default#pieChart',
          // Радиус диаграммы в пикселях.
          clusterIconPieChartRadius: 25,
          // Радиус центральной части макета.
          clusterIconPieChartCoreRadius: 10,
          // Ширина линий-разделителей секторов и внешней обводки диаграммы.
          clusterIconPieChartStrokeWidth: 3,
          // Определяет наличие поля balloon.
          hasBalloon: false
        }),
        /**
         * Функция возвращает объект, содержащий данные метки.
         * Поле данных clusterCaption будет отображено в списке геообъектов в балуне кластера.
         * Поле balloonContentBody - источник данных для контента балуна.
         * Оба поля поддерживают HTML-разметку.
         * Список полей данных, которые используют стандартные макеты содержимого иконки метки
         * и балуна геообъектов, можно посмотреть в документации.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject.xml
         */
        getPointData = function (point) {
          return {
            reqNumber: point[2]
          };
        },
        /**
         * Функция возвращает объект, содержащий опции метки.
         * Все опции, которые поддерживают геообъекты, можно посмотреть в документации.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject.xml
         */
        getPointOptions = function (point) {
          const find = cards.find(item => item.reqNumber === point[2]);
          if (find && find.basketAdd === 1){
            return {
              // preset: 'islands#violetIcon',
              iconColor: `#00d438`,
              reqNumber: point[2]
            };
          } else if (point[3] === '1c'){
            return {
              // preset: 'islands#violetIcon',
              iconColor: `#0c54a0`,
              reqNumber: point[2]
            };
          } else if (point[3] === 'pars'){
            return {
              // preset: 'islands#violetIcon',
              iconColor: `#DB425A`,
              reqNumber: point[2]
            };
          }

          // if (point[3] === '1c'){
          //   return {
          //     // preset: 'islands#violetIcon',
          //     iconColor: `#0c54a0`,
          //     reqNumber: point[2]
          //   };
          // } else if (point[3] === 'pars'){
          //   return {
          //     // preset: 'islands#violetIcon',
          //     iconColor: `#DB425A`,
          //     reqNumber: point[2]
          //   };
          // }
        },
        points = [],
        geoObjects = [];
      /**
       * заполняем points (метки) акутальными данными
       */
      for (let point of cards){
        if (point.lat && point.lng){
          let cordsPoint = [];
          cordsPoint.push(point.lat);
          cordsPoint.push(point.lng);
          cordsPoint.push(point.reqNumber);
          cordsPoint.push(point.reqType);
          points.push(cordsPoint);
        }
      }
      /**
       * Данные передаются вторым параметром в конструктор метки, опции - третьим.
       * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark.xml#constructor-summary
       */
      for(var i = 0, len = points.length; i < len; i++) {
        geoObjects[i] = new ymaps.Placemark(points[i], getPointData(points[i]), getPointOptions(points[i]));
      }

      /**
       * Можно менять опции кластеризатора после создания.
       */
      clusterer.options.set({
        gridSize: 80,
        clusterDisableClickZoom: true
      });

      /**
       * В кластеризатор можно добавить javascript-массив меток (не геоколлекцию) или одну метку.
       * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#add
       */
      clusterer.add(geoObjects);
      myMap.geoObjects.add(clusterer);

      myMap.geoObjects.events.add('click', function (e) {
        var object = e.get('target');
        if (object.options._name === 'geoObject'){
          document.querySelector('.map__right').innerHTML = '';
          document.querySelector('.map__right').classList.add('map__bar_open');
          renderCard(findCard(object.properties._data.reqNumber));
        } else if (object.options._name === 'cluster'){
          document.querySelector('.map__right').innerHTML = '';
          document.querySelector('.map__right').classList.add('map__bar_open');
          for (let item of object.properties._data.geoObjects){
            renderCard(findCard(item.properties._data.reqNumber));
          }
        }
      });

      myMap.events.add('click', function (e) {
        console.log(window.pageYOffset)
        if (document.querySelector('.map__right').innerHTML === ''){
          return
        } else {
          document.querySelector('.map__right').classList.add('map__bar_close');
          setTimeout(() => {
            document.querySelector('.map__right').innerHTML = '';
            document.querySelector('.map__right').classList.remove('map__bar_open');
            document.querySelector('.map__right').classList.remove('map__bar_close');
          }, 500)
        }
      });

    });
    function findCard(reqNumber){
      return cards.find(item => item.reqNumber === reqNumber)
    }
    function renderCard(card){
      document.querySelector('.map__right').insertAdjacentHTML('beforeend', 
        `<div class="map-card"> 
                <img data-open="openCard" data-req="${card.reqNumber}"
                  data-source="${card.reqType}" class="map-card__photo" src="${card.reqPhoto}" alt="photo"> 
                <span data-open="openCard" data-req="${card.reqNumber}"
                  data-source="${card.reqType}" class="map-card__street">
                  ${card.reqTypeofRealty === "Квартира" || card.reqTypeofRealty === "Дом"
                  || card.reqTypeofRealty === "Комната"
                  ? `${card.reqRoomCount ? `${card.reqRoomCount}к, ` : ''}`
                  : ''}
                  ${card.reqStreet ? `ул. ${card.reqStreet}, ` : ''}
                  ${card.reqHouseNumber ? `д. ${card.reqHouseNumber}` : ''}
                </span>            
                <span class="map-card__city">
                  ${card.reqCity ? `${card.reqCity}, ` : ''}
                  ${card.reqRayon ? `${card.reqRayon} р-н` : ''}
                </span>
                <div class="map-card__wrap">
                  ${card.reqFlatTotalArea ? `<span class="map-card__flat">${card.reqFlatTotalArea} кв<sup>2</sup></span>` : ''}
                  ${card.reqFloor && card.reqFloors ? `<span class="map-card__floor">${card.reqFloor}/${card.reqFloors} эт. </span>` : ''}
                  ${card.reqTypeofRealty === "Дом" || card.reqTypeofRealty === "Земля" && card.reqLandArea ?
                  `<span class="map-card__flat">
                      Учаток ${card.reqLandArea} сот.
                  </span>`
                  : ''}
                </div>
                <div class="map-card__wrap">
                  <span class="map-card__price">${card.reqPrice ? `${card.reqPrice} тыс. ₽` : ''}</span>
                  ${card.reqTypeofRealty === "Земля" ? '' : `<span class="map-card__price-meter">${getPriceMeter(card)} ₽/кв.м</span>`}
                </div>
                <div class="map-card__wrap map-card__wrap_between"> 
                  <img class="map-card__logo" src="${card.reqLogo}" alt="logo">
                  <button class="card__btn ${card.basketAdd === 1 ? 'card__btn_select' : ''} btn${card.reqNumber}" data-req="${card.reqNumber}" data-card="reserv"> 
                    <svg class="event-none" width="30" height="30" fill="#BEC1C0" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    \t viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                    <g id="Layer_1_1_">
                    <polygon points="21.707,8.707 20.293,7.293 12,15.586 8.707,12.293 7.293,13.707 12,18.414 \t"/>
                    <rect x="25" y="12" width="18" height="2"/>
                    <polygon points="21.707,20.707 20.293,19.293 12,27.586 8.707,24.293 7.293,25.707 12,30.414 \t"/>
                    <rect x="25" y="24" width="18" height="2"/>
                    <polygon points="21.707,32.707 20.293,31.293 12,39.586 8.707,36.293 7.293,37.707 12,42.414 \t"/>
                    <rect x="25" y="36" width="18" height="2"/>
                    </g>
                    </svg>
                  </button>
                </div>
              </div>`)
    }
    function getPriceMeter(card){
      if (card.reqPrice && card.reqFlatTotalArea){
        if (card.reqPrice === '0' || card.reqFlatTotalArea === '0'){
          return `0`
        } else {
          return ((+card.reqPrice / +card.reqFlatTotalArea) * 1000).toFixed(0);
        }
      }
    }
  }
  openCard(idReq, source) {
    const typeA = source;
    let ScrW = window.screen.width*0.95;
    let readyString = "https://crm.centralnoe.ru/CDB/object/card/cardObject.php?source="+typeA+"&id="+idReq;
    BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: 925, });
    return true;
  }
  openNewObject(){
    let readyString = `https://crm.centralnoe.ru/CDB/object/card/add/?curdeal=${activeDeal}&action=new&contact=${JSON.parse(dealClients)[0].PHONE}`
    BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: 1100, });
    return true;
  }

  async sendToServer(){
    this.objectFilter.action = 'get';
    this.objectFilter.dealId = activeDeal;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const raw = JSON.stringify(this.objectFilter);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("https://50970.vds.miran.ru:553/Servers/Search/Catalog.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    this.cards = jsonA;
    this.copyCards = JSON.parse(JSON.stringify(this.cards));
    return jsonA;
  }
  async getDealOrHistory(req){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const raw = JSON.stringify(req);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/newSelectionDeamon.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    console.log(jsonA)
    return jsonA;
  }
  async sendCompilation(dealNumber){
    let req = {
      action : 'makeOffer',
      dealId : dealNumber,
      offers : this.setCompilationObject(),
    }
    console.log(req)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const raw = JSON.stringify(req);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/newSelectionDeamon.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
  }

  setCompilationObject(){
    let compilationArr = [];
    for (let item of basket.fullness){
      compilationArr.push({
        "source" : `${item.reqType}`,
        "reqNumber" : `${item.reqNumber}`,
        "reqType" : `${item.reqTypeofRealty}`
      })
    }
    return compilationArr;
  }

  handlerSource(){
    const sourceInputs = document.querySelectorAll('.source__input');
    let countCheckSource = 0;
    for (let input of sourceInputs){
      input.addEventListener('change', () => {
        countCheckSource = 0;
        for (let inputCheck of sourceInputs){
          if (inputCheck.checked){
            countCheckSource ++;
          }
        }
        if (countCheckSource > 0){
          document.querySelector('.btn-search').removeAttribute('disabled');
        } else {
          document.querySelector('.btn-search').setAttribute('disabled', 'disabled');
        }
      })
    }
  }

  clearInputValue(event){
    document.querySelector(`INPUT[name="${event.target.dataset.name}"]`).value = '';
    event.target.classList.remove('start__input-cross');
    if (event.target.dataset.name === 'reqRoomCount'){
      this.countRoom = [];
      const block = document.querySelector(`.${event.target.dataset.name}__block`);
      const allCheckbox = block.querySelectorAll(`INPUT[type='checkbox']`);
      for (let check of allCheckbox){
        check.checked = false;
      }
    } else if (event.target.dataset.name === 'reqPrice'){
      document.querySelector('.price_left').value = '';
      document.querySelector('.price_right').value = '';
      this.objectFilter.reqPrice = [];
    } else if (event.target.dataset.name === 'address'){
      this.addressValue = '';
      this.metroArray = [];
      this.districtArray = [];
      this.addressObject = '';
      for (let key in this.districtValue){
        this.districtValue[key] = false;
      }
      for (let key in this.metroValue){
        this.metroValue[key] = false;
      }
    }
  }

  setAllValue(){
    this.objectFilter.fullAddress = this.addressValue ? this.addressValue : null;
    this.objectFilter.metroDistance = this.metroTime ? this.metroTime : null;
    this.objectFilter.area = this.districtArray.length === 0 ? null : this.districtArray;
    this.objectFilter.metro = this.metroArray.length === 0 ? null : this.metroArray;
    this.objectFilter.reqRoomCount = [];
    this.objectFilter.street = this.addressObject ? this.addressObject.data.street ? this.addressObject.data.street : null : null;
    this.objectFilter.dadataMetro = this.addressObject ? this.addressObject.data.street_type_full === 'метро' ? this.addressObject.data.street : null : null;
    this.objectFilter.dadataArea = this.addressObject ? this.addressObject.data.city_district ? this.addressObject.data.city_district : null : null;
    this.objectFilter.city = this.addressObject ? this.addressObject.data.city ? this.addressObject.data.city : null : null;
    this.objectFilter.settlement = this.addressObject ? this.addressObject.data.settlement ? this.addressObject.data.settlement : null : null;
    this.objectFilter.houseNumber = this.addressObject ? this.addressObject.data.house ? this.addressObject.data.house : null : null;
    for (let room of this.countRoom){
      this.objectFilter.reqRoomCount.push(room.value);
    }
    this.objectFilter.reqTypeofRealty = document.querySelector(`INPUT[name='reqTypeofRealty']`).value;
    const sourceAll = document.querySelectorAll('.source__input');
    this.objectFilter.source = [];
    for (let source of sourceAll){
      if (source.checked){
        this.objectFilter.source.push(source.name);
      }
    }
    this.objectFilter.reqRegion = document.querySelector('.place__text').innerHTML;
    this.objectFilter.dealId = activeDeal;
    console.log(this.objectFilter)
  }
  setRoomValue(event){
    if (this.countRoom.length === 0){
      document.querySelector(`INPUT[name='${event.target.dataset.input}']`).value = 'Любое';
      document.querySelector(`.${event.target.dataset.input}-x`).classList.remove('start__input-cross');
    } else if (this.countRoom.length === 1){
      document.querySelector(`INPUT[name='${event.target.dataset.input}']`).value = this.countRoom[0].dataset.room;
      document.querySelector(`.${event.target.dataset.input}-x`).classList.add('start__input-cross');
    } else if (this.countRoom.length > 1){
      document.querySelector(`INPUT[name='${event.target.dataset.input}']`).value = `Выбрано ${this.countRoom.length}`;
      document.querySelector(`.${event.target.dataset.input}-x`).classList.add('start__input-cross');
    }
  }
  showChangeMetroDistrict(){
    if (this.metroArray.length > 0 || this.districtArray.length > 0 || this.addressValue.length > 0){
      if (this.addressValue.length > 0 ){
        setTimeout(() => {
          document.querySelector(`INPUT[name='address']`).value = this.addressValue;
        },200)
      }

      if (this.metroArray.length > 4){
        setTimeout(() => {
          document.querySelector(`INPUT[name='address']`).value = `${this.metroArray.length} станций метро`;
        },200)
      } else if (this.metroArray.length !== 0 && this.metroArray.length <= 4){
        setTimeout(() => {
          let valueMetro = '';
          for (let value of this.metroArray){
            valueMetro += `${value}, `;
          }
          document.querySelector(`INPUT[name='address']`).value = valueMetro.slice(0, -2);
        },200)
      }

      if (this.districtArray.length > 4){
        setTimeout(() => {
          document.querySelector(`INPUT[name='address']`).value = `${this.districtArray.length} районов`;
        },200)
      } else if (this.districtArray.length !== 0 && this.districtArray.length <= 4){
        setTimeout(() => {
          let valueDistrict = '';
          for (let value of this.districtArray){
            valueDistrict += `${value}, `;
          }
          document.querySelector(`INPUT[name='address']`).value = valueDistrict.slice(0, -2);
        },200)
      }
      setTimeout(() => {
        document.querySelector(`.address-x`).classList.add('start__input-cross');
      }, 200)
    } else {
      setTimeout(() => {
        document.querySelector(`INPUT[name='address']`).value = '';
      },200)
    }
  }

  handlerPriceFilter(){
    const priceFrom = document.querySelector('.price_left');
    const priceTo = document.querySelector('.price_right');

    priceFrom.addEventListener('blur', () =>{
      this.setPriceFilter(priceFrom, priceTo)
    })
    priceTo.addEventListener('blur', () =>{
      this.setPriceFilter(priceFrom, priceTo)
    })
  }
  setPriceFilter(priceFrom, priceTo){
    if (priceFrom.value.length === 0 && priceTo.value.length === 0){
      document.querySelector(`INPUT[name='reqPrice']`).value = '';
      document.querySelector(`.${event.target.dataset.input}-x`).classList.remove('start__input-cross');
    } else {
      this.objectFilter.reqPrice = [];
      this.objectFilter.reqPrice.push(priceFrom.value ? priceFrom.value : null, priceTo.value ? priceTo.value : null);
      document.querySelector(`INPUT[name='reqPrice']`).value =
        `${priceFrom.value ? `от ${priceFrom.value}` : ''} ${priceTo.value ? `до ${priceTo.value}` : ''}`;
      document.querySelector(`.${event.target.dataset.input}-x`).classList.add('start__input-cross');
    }
  }

  openModule(title, field){
    document.querySelector('HTML').setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}"  class="module"> 
                      <form class="module__form"> 
                        <div class="module__header metro__header"> 
                            <h2 class="module__head">${title}</h2>
                            <span data-name="close" class="btn-close"></span>
                        </div>
                        ${field}
                      </form>
                  </div>`
    document.body.insertAdjacentHTML('beforebegin', layout);
    this.handlerModule();
  }
  handlerModule(){
    const module = document.querySelector('.module');
    const searchInput = document.querySelector('.district__search');

    document.querySelector('HTML').addEventListener('keydown', event => {
      if (event.key === 'Escape'){
        if(module){
          this.closeModule(module);
        }
      }
    })

    module.addEventListener('click', event => {
      if (event.target.dataset.name === 'close') {
        this.closeModule(module);
      } else if (event.target.dataset.region){
        document.querySelector('.place__text').innerHTML = event.target.dataset.region;
        this.currentRegion = event.target.dataset.value;
        this.closeModule(module);
      } else if (event.target.dataset.name === 'allcheck'){
        this.setCheckboxMetro(module, event);
      } else if (event.target.dataset.metro === 'save'){
        event.preventDefault();
        this.setValueMetro(module);
        this.closeModule(module);
        this.showChangeMetroDistrict();
      } else if (event.target.dataset.metro === 'clear'){
        event.preventDefault();
        this.clearValueMetro(module);
      } else if (event.target.dataset.form === 'save'){
        event.preventDefault();
        this.setValueDistrict(module);
        this.closeModule(module);
        this.showChangeMetroDistrict();
      } else if (event.target.dataset.form === 'clear'){
        event.preventDefault();
        this.clearValueDistrict(module);
      } else if (event.target.dataset.district){
        const allCheckedInputs = module.querySelectorAll(`INPUT[type='checkbox']`);
        const clickName = event.target.dataset.district;

        for (let item of allCheckedInputs){
          if (item.value === clickName){
            item.click();
          }
        }
        searchInput.value = '';
        this.filter = [];
        this.isVisibleSearch();
        searchInput.focus();
      } else if (!event.target.dataset.district && searchInput){
        searchInput.value = '';
        this.filter = [];
        this.isVisibleSearch();
      } else if (event.target.dataset.extra === 'save'){
        this.setValueExtra(module);
        this.closeModule(module);
      } else if (event.target.dataset.extra === 'clear'){
        event.preventDefault();
        this.clearValueExtra(module);
      } else if (event.target.dataset.name === 'sendAlert'){
        this.sendAlert(this.setReqNumber(event.target.dataset.req)).then(() => {
          this.closeModule(module);
        });
      } else if (event.target.dataset.deal === 'item'){
        this.closeModule(module);
        this.setLoader();
        this.sendCompilation(event.target.dataset.id).then(() => {
          this.clearReserveItem();
          document.querySelector('#map').innerHTML = '';
          this.initMap(this.cards);
          console.log(this.cards)
          basket.fullness = [];
          basket.init();
          document.querySelector('.loader__img').style.backgroundImage='url(https://crm.centralnoe.ru/dealincom/assets/statusOk.gif)'
          setTimeout(() => {
            this.removeLoader();
          }, 500)
        });
      } else if (event.target.dataset.history){
        this.objectFilter = JSON.parse(this.historyFilter[event.target.dataset.history].data);
        this.objectFilter.fromHistory = true;
        console.log(this.objectFilter)
        this.closeModule(module);
        this.setLoader();
        this.sendToServer().then(data => {
          this.setHistoryValue(data);
          this.removeLoader();
        });
      } else if (event.target.dataset.input === 'error'){
        this.currentElem = document.querySelector(`.block-${event.target.dataset.error}`);
        this.currentElem.classList.toggle('visible');
      } else if (event.target.dataset.parrent){
        document.querySelector(`.input-${event.target.dataset.parrent}`).innerHTML = event.target.innerHTML;
        this.checkCurrentElem();
      } else if (event.target.dataset.error === 'close'){
        this.closeModule(module);
      } else if (event.target.dataset.error === 'send'){
        const textarea = module.querySelector('.error-information__area');
        if (textarea.value.length === 0){
          textarea.classList.add('isValid');
        } else {
          const moduleValue = {
            source: module.querySelector('.input-source').innerHTML,
            reason: module.querySelector('.input-reason').innerHTML,
            text: module.querySelector('.error-information__area').value,
          }
          this.sayThanks();
          textarea.classList.remove('isValid');
          this.alertErrorSend(moduleValue).then(() => {
            this.closeModule(module);
          });
        }
      } else {
        this.checkCurrentElem();
      }
    })

    if(searchInput){
      searchInput.addEventListener('keyup', event => {
        this.districtFilter(event.target.value);
      })
    }
  }
  closeModule(module){
    document.querySelector('HTML').removeAttribute("style");
    module.remove();
  }

  async alertErrorSend(moduleValue){
    const errorInformation = {
      source: moduleValue.source,
      reason: moduleValue.reason,
      text: moduleValue.text,
      author: currentUserLogin,
      deal: `${activeDeal.length === 0 ? 0 : activeDeal}`,
    }
    const raw = JSON.stringify(errorInformation);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");

    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw,
    };
    let response  = await fetch("https://crm.centralnoe.ru/dealincom/factory/errorMaker.php", requestOptions);
  }
  alertErrorLayout(){
    return `<div class="error-information"> 
              <span class="error-information__text">Заполните обязательные поля формы обратной связи, после чего нажмите кнопку "Отправить"</span>
              <div class="error-information__wrap"> 
                <span class="error-information__title">Выберете истоник ошибки</span> 
                <div class="error-information__select"> 
                  <div class="error-information__input input-source" data-input="error" data-error="source">Каталог ОН</div>
                  <div class="error-information__block visible block-source"> 
                    <span data-parrent="source" class="error-information__block-item">Каталог ОН</span>
                    <span data-parrent="source" class="error-information__block-item">Подборки ОН</span>
                    <span data-parrent="source" class="error-information__block-item">Отчет продавцу</span>
                  </div>
                </div>
              </div>            
              <div class="error-information__wrap"> 
                <span class="error-information__title">Выберете причину обращения</span>
                <div class="error-information__select"> 
                  <div class="error-information__input input-reason" data-input="error" data-error="reason">Некорректный результат поиска</div>
                  <div class="error-information__block visible block-reason"> 
                    <span data-parrent="reason" class="error-information__block-item">Некорректный результат поиска</span>
                    <span data-parrent="reason" class="error-information__block-item">Ошибка на станице</span>
                    <span data-parrent="reason" class="error-information__block-item">Консультация</span>
                  </div>
                </div>
              </div>
              <div class="error-information__wrap-area">
                <span class="error-information__title">Опишите что произошло</span>
                <textarea class="error-information__area" cols="30" rows="10"></textarea>
              </div>  
            </div>            
            <div class="metro__footer module__footer"> 
              <button data-error="send" class="module__save" type="button">Отправить</button>
              <button data-error="close" class="module__reset row__input_right"><span>Отменить</span></button>
            </div>`
  }
  sayThanks(){
    const errorBlock = document.querySelector('.error-information');
    errorBlock.innerHTML = '';
    errorBlock.insertAdjacentHTML('beforeend' ,
      '<p class="error-information__text error-information__thanks">Сообщение об ошибке отправлено. Cпасибо что помогаете нам стать лучше!</p>');
    document.querySelector('.module__footer').innerHTML = '';
  }

  setHistoryValue(data){
    this.setCountCard(data);
    new Cards(data).init();
    document.querySelector('#map').innerHTML = '';
    this.initMap(this.cards);

    document.querySelector(`INPUT[name='sort']`).value = `Сортировка по умолчанию`;
    document.querySelector(`INPUT[name='reqTypeofRealty']`).value = `${this.objectFilter.reqTypeofRealty}`;
    document.querySelector(`INPUT[name='address']`).value = `${this.objectFilter.fullAddress ? this.objectFilter.fullAddress : ''}`;
    this.objectFilter.fullAddress ? this.addressValue = this.objectFilter.fullAddress : this.addressValue = '';
    this.objectFilter.fullAddress ? document.querySelector('.address-x').classList.add('start__input-cross') : '';

    if (this.objectFilter.extraFilter){
      document.querySelector('.count-extra').innerHTML = `${this.objectFilter.extraFilter}`;
      document.querySelector('.count-extra').classList.remove('visible');
    } else {
      document.querySelector('.count-extra').innerHTML = ``;
      document.querySelector('.count-extra').classList.add('visible');
    }

    if (this.objectFilter.reqRoomCount){
      const checkboxAll = document.querySelector('.room__check').querySelectorAll(`INPUT[type='checkbox']`);
      for (let checkbox of checkboxAll){
        for (let value of this.objectFilter.reqRoomCount){
          if (checkbox.value === value){
            this.countRoom.push(checkbox);
            checkbox.checked = true;
          }
        }
      }
      document.querySelector(`INPUT[name='reqRoomCount']`).value = `Выбрано ${this.countRoom.length}`;
      document.querySelector('.reqRoomCount-x').classList.add('start__input-cross');
    }

    if(this.objectFilter.reqPrice){
      document.querySelector(`INPUT[name='reqPrice']`).value =
        `${this.objectFilter.reqPrice[0] ? `от ${this.objectFilter.reqPrice[0]}` : ''} ${this.objectFilter.reqPrice[1] ? `до ${this.objectFilter.reqPrice[1]}` : ''}`;
      document.querySelector(`.reqPrice-x`).classList.add('start__input-cross');
    }

    if (data.length > 100){
      this.startPaginat = 0;
      this.currentPaginatActive = 0;
      this.setPagination();
      this.renderPagination();
    } else {
      this.clearPaginationContainer();
    }
  }

  setCheckboxMetro(module, event){
    const allCheckedInputs = module.querySelectorAll(`INPUT[type='checkbox']`);
    if (event.target.checked){
      for (let item of allCheckedInputs){
        if (item.dataset.name !== 'allcheck'){
          item.checked = true;
          item.disabled = true;
        }
      }
    } else {
      for (let item of allCheckedInputs){
        if (item.dataset.name !== 'allcheck'){
          item.checked = false;
          item.disabled = false;
        }
      }
    }
  }
  setValueMetro(module){
    const allCheckedInputs = module.querySelectorAll(`INPUT[type='checkbox']`);
    const metroTime = document.querySelector('.metro__gap');
    this.metroArray = [];
    for (let check of allCheckedInputs){
      if (check.checked && check.dataset.name !== 'allcheck'){
        this.metroArray.push(check.value);
        this.metroValue[check.name] = true;
      } else {
        this.metroValue[check.name] = false;
      }
    }
    this.addressValue = '';
    this.addressObject = '';
    this.districtArray = [];
    this.metroTime = metroTime.innerHTML;
    for (let key in this.districtValue){
      this.districtValue[key] = false;
    }
  }
  clearValueMetro(module){
    const allCheckedInputs = module.querySelectorAll(`INPUT[type='checkbox']`);
    const metroTime = document.querySelector('.metro__gap');
    for (let checkbox of allCheckedInputs){
      checkbox.checked = false;
      checkbox.disabled = false;
    }
    this.metroArray = [];
    metroTime.innerHTML = '15 минут';
  }

  setValueDistrict(module){
    const allCheckedInputs = module.querySelectorAll(`INPUT[type='checkbox']`);
    this.districtArray = [];

    for (let checkbox of allCheckedInputs){
      if (checkbox.checked){
        this.districtArray.push(checkbox.value);
        this.districtValue[checkbox.name] = true;
      } else {
        this.districtValue[checkbox.name] = false;
      }
    }
    this.addressValue = '';
    this.addressObject = '';
    this.metroArray = [];
    for (let key in this.metroValue){
      this.metroValue[key] = false;
    }
  }
  clearValueDistrict(module){
    const allCheckedInputs = module.querySelectorAll(`INPUT[type='checkbox']`);
    for (let checkbox of allCheckedInputs){
      checkbox.checked = false;
    }
    this.districtArray = [];
  }
  clearValueExtra(module){
    document.querySelector('.count-extra').innerHTML = '';
    document.querySelector('.count-extra').classList.add('visible');
    const allInputs = module.querySelectorAll('INPUT');
    for (let input of allInputs){
      if (input.type === 'text'){
        input.value = '';
      } else if (input.type === 'radio' || input.type === 'checkbox'){
        if (input.value === 'nothing'){
          input.checked = true;
        } else {
          input.checked = false;
        }
      }
    }
  }
  districtFilter(value){
    const regexp = new RegExp(value, 'i');
    const currentRegion = document.querySelector('.place__text').innerHTML;
    if (currentRegion === 'Новосибирская область'){
      this.filter = this.districtNsk.filter(district => regexp.test(district));
    } else if (currentRegion === 'Кемеровская область'){
      this.filter = this.districtKem.filter(district => regexp.test(district));
    }
    this.isVisibleSearch();
  }
  isVisibleSearch(){
    const searchBlock = document.querySelector('.district__hide');

    if (this.filter.length === 0){
      if (!searchBlock.classList.contains('visible')){
        searchBlock.classList.add('visible');
      }
    } else {
      let filterNew = [];

      for (let i = 0; i < 7; i++){
        filterNew.push(this.filter[i]);
      }

      searchBlock.classList.remove('visible');
      searchBlock.innerHTML = '';
      for (let i = 0; i < filterNew.length; i++){
        if (this.filter[i]){
          searchBlock.insertAdjacentHTML('beforeend', `<div data-district=${this.filter[i]} class="district__search-item">${this.filter[i].split('_').join(' ')}</div>`)
        }
      }

    }
  }

  setValueExtra(module){
    let countFilter = 0;
    this.objectFilter.reqFlatTotalArea = [];
    this.objectFilter.reqKitchenArea = [];
    this.objectFilter.reqFlatLivingArea = [];
    this.objectFilter.reqFloor = [];
    this.objectFilter.reqFloorCount = [];
    const allInputs = module.querySelectorAll('INPUT');
    for (let input of allInputs) {
      if (input.type === 'radio') {
        if (input.checked) {
          if (input.value === "nothing") {
            this.objectFilter[input.name] = null;
          } else if (input.value === "true") {
            countFilter++;
            this.objectFilter[input.name] = true;
          } else if (input.value === "false") {
            this.objectFilter[input.name] = false;
          } else {
            this.objectFilter[input.name] = input.value;
            countFilter++;
          }
        }
      } else if (input.type === 'checkbox') {
        this.objectFilter[input.name] = input.checked;
        if (input.checked) {
          countFilter++;
        }
      } else if (input.type === 'text') {
        this.objectFilter[input.name].push(`${input.value.length === 0 ? null : input.value}`);
        if (input.value.length > 0) {
          countFilter++;
        }
      }
    }
    if (countFilter > 0){
      document.querySelector('.count-extra').innerHTML = `${countFilter}`;
      document.querySelector('.count-extra').classList.remove('visible');
      this.objectFilter.extraFilter = countFilter;
    } else {
      document.querySelector('.count-extra').classList.add('visible');
    }
    console.log(this.objectFilter);
  }

  regionLayout(){
    const currentPlace = document.querySelector('.place__text').innerHTML;
    return `<div class="region"> 
              <span class="region__title"> 
                Текущее местоположение ${currentPlace}
              </span>
              <div class="region__wrap"> 
                <span class="region__btn ui-btn" data-region="Новосибирская область" data-value="Новосибирская обл, ">Новосибирская область</span>
                <span class="region__btn ui-btn" data-region="Кемеровская область" data-value="Кемеровская область - Кузбасс, ">Кемеровская область</span>
              </div>
            </div>                        
            <div class="metro__footer module__footer"> 
            </div>`
  }
  metroLayout(){
    return `<div class="metro__grid">                    
              <div class="metro__line"> 
                <span class="metro__title">Ленинская линия<span class="metro__circle red"></span></span>
                <label class="module__label">
                  <input name="marksa" type="checkbox" value="Площадь Маркса" ${this.metroValue.marksa ? 'checked' : ''}>
                  <span>Площадь Маркса</span>
                </label>
                <label class="module__label">
                  <input name="student" type="checkbox" value="Студенческая" ${this.metroValue.student ? 'checked' : ''}>
                  <span>Студенческая</span>
                </label>  
                <label class="module__label">
                  <input name="vokzal" type="checkbox" value="Речной вокзал" ${this.metroValue.vokzal ? 'checked' : ''}>
                  <span>Речной вокзал</span>
                </label>
                <label class="module__label">
                  <input name="oktyabr" type="checkbox" value="Октябрьская" ${this.metroValue.oktyabr ? 'checked' : ''}>
                  <span>Октябрьская</span>
                </label>
                <label class="module__label">
                  <input name="lenina" type="checkbox" value="Площадь Ленина" ${this.metroValue.lenina ? 'checked' : ''}>
                  <span>Площадь Ленина</span>
                </label>    
                <label class="module__label">
                  <input name="krasniy" type="checkbox" value="Красный проспект" ${this.metroValue.krasniy ? 'checked' : ''}>
                  <span>Красный проспект</span>
                </label>    
                <label class="module__label">
                  <input name="gagarin" type="checkbox" value="Гагаринская" ${this.metroValue.gagarin ? 'checked' : ''}>
                  <span>Гагаринская</span>
                </label> 
                <label class="module__label">
                  <input name="zaelcovskaya" type="checkbox" value="Заельцовская" ${this.metroValue.zaelcovskaya ? 'checked' : ''}>
                  <span>Заельцовская</span>
                </label>                                                     
              </div>
              <div class="metro__line">
                <span class="metro__title">Дзержинская линия<span class="metro__circle green"></span></span>
                <label class="module__label">
                  <input name="mihalovskogo" type="checkbox" value="Площадь Гарина-Михайловского" ${this.metroValue.mihalovskogo ? 'checked' : ''}>
                  <span>Площадь Гарина-Михайловского</span>
                </label>                         
                <label class="module__label">
                  <input name="siber" type="checkbox" value="Сибирская" ${this.metroValue.siber ? 'checked' : ''}>
                  <span>Сибирская</span>
                </label>                         
                <label class="module__label">
                  <input name="marshal" type="checkbox" value="Маршала Покрышкина" ${this.metroValue.marshal ? 'checked' : ''}>
                  <span>Маршала Покрышкина</span>
                </label>                        
                <label class="module__label">
                  <input name="bereza" type="checkbox" value="Берёзовая роща" ${this.metroValue.bereza ? 'checked' : ''}>
                  <span>Берёзовая роща</span>
                </label>                        
                <label class="module__label">
                  <input name="niva" type="checkbox" value="Золотая нива" ${this.metroValue.niva ? 'checked' : ''}>
                  <span>Золотая нива</span>
                </label>        
              </div>
              <div class="metro__time"> 
                <span class="metro__title">Время до метро</span>
                <div class="metro__walk">                       
                  <select class="metro__select"> 
                    <option selected>15 минут</option>
                    <option>10 минут</option>
                    <option>5 минут</option>
                  </select>
                  <span class="metro__walk-text">пешком</span>
                </div>
                <label class="module__label metro_nearby">
                  <input data-name="allcheck" type="checkbox">
                  <p>Рядом с метро<span>(Выбрать все)</span></p>                       
                </label>     
              </div>
            </div>                  
            <div class="metro__footer module__footer"> 
              <button class="module__save" data-metro="save">Сохранить</button>
              <button class="module__reset" data-metro="clear">Очистить</button>
            </div>`
  }
  getArea(){
    const currentRegion = document.querySelector('.place__text').innerHTML;
    if (currentRegion === 'Новосибирская область'){
      return `<div class="district__wrap">
                  <label class="module__label">
                    <input name="dzerzhinskiy" type="checkbox" value="Дзержинский" ${this.districtValue.dzerzhinskiy ? 'checked ' : ''}>
                    <span>Дзержинский</span>
                  </label>   
                  <label class="module__label">
                    <input name="zheleznodorozhniy" type="checkbox" value="Железнодорожный" ${this.districtValue.zheleznodorozhniy ? 'checked ' : ''}>
                    <span>Железнодорожный</span>
                  </label>   
                  <label class="module__label">
                    <input name="zaelovskiy" type="checkbox" value="Заельцовский" ${this.districtValue.zaelovskiy ? 'checked ' : ''}>
                    <span>Заельцовский</span>
                  </label>                         
                  <label class="module__label">
                    <input name="kalininskiy" type="checkbox" value="Калининский" ${this.districtValue.kalininskiy ? 'checked ' : ''}>
                    <span>Калиниский</span>
                  </label>
                  <label class="module__label">
                    <input name="kirovskiy" type="checkbox" value="Кировский" ${this.districtValue.kirovskiy ? 'checked ' : ''}>
                    <span>Кировский</span>
                  </label>                          
                  <label class="module__label">
                    <input name="leninskiy" type="checkbox" value="Ленинский" ${this.districtValue.leninskiy ? 'checked ' : ''}>
                    <span>Ленинский</span>
                  </label>                          
                  <label class="module__label">
                    <input name="oktyabrskiy" type="checkbox" value="Октябрьский" ${this.districtValue.oktyabrskiy ? 'checked ' : ''}>
                    <span>Октябрьский</span>
                  </label>                          
                  <label class="module__label">
                    <input name="pervomayskiy" type="checkbox" value="Первомайский" ${this.districtValue.pervomayskiy ? 'checked ' : ''}>
                    <span>Первомайский</span>
                  </label>                          
                  <label class="module__label">
                    <input name="sovetskiy" type="checkbox" value="Советский" ${this.districtValue.sovetskiy ? 'checked ' : ''}>
                    <span>Советский</span>
                  </label>                          
                  <label class="module__label">
                    <input name="centralniy" type="checkbox" value="Центральный" ${this.districtValue.centralniy ? 'checked ' : ''}>
                    <span>Центральный</span>
                  </label>
                </div>`
    } else if (currentRegion === 'Кемеровская область'){
      return `<div class="district__wrap">
                  <label class="module__label">
                    <input name="zavodskoy" type="checkbox" value="Заводский" ${this.districtValue.zavodskoy ? 'checked ' : ''}>
                    <span>Заводский</span>
                  </label>   
                  <label class="module__label">
                    <input name="kedrovka" type="checkbox" value="Кедровка" ${this.districtValue.kedrovka ? 'checked ' : ''}>
                    <span>Кедровка</span>
                  </label>   
                  <label class="module__label">
                    <input name="kirovskiy" type="checkbox" value="Кировский" ${this.districtValue.kirovskiy ? 'checked ' : ''}>
                    <span>Кировский</span>
                  </label>                         
                  <label class="module__label">
                    <input name="leninskiy" type="checkbox" value="Ленинский" ${this.districtValue.leninskiy ? 'checked ' : ''}>
                    <span>Ленинский</span>
                  </label>
                  <label class="module__label">
                    <input name="rudnichiy" type="checkbox" value="Рудничный" ${this.districtValue.rudnichiy ? 'checked ' : ''}>
                    <span>Рудничный</span>
                  </label>                          
                  <label class="module__label">
                    <input name="centralniy" type="checkbox" value="Центральный" ${this.districtValue.centralniy ? 'checked ' : ''}>
                    <span>Центральный</span>
                  </label>
                </div>`
    }
  }
  districtLayout(){
    const area = this.getArea();
    return `<div class="district">
              <div class="district__left">                      
                <div class="module__header"> 
                  <h2 class="module__head">Районы</h2>
                  <div class="district__search-wrap">
                    <input class="district__search" type="text">
                    <div class="district__hide visible"></div>
                  </div>
                </div>
                ${area}   
              </div>
            </div>
            <div class="module__footer district__footer"> 
              <button data-form="save" class="module__save">Сохранить</button>
              <button class="module__reset" data-form="clear">Очистить</button>
            </div>`
  }
  extraOpenLayout(){
    return `<div class="extra"> 
              <div class="row"> 
                <div class="row__text row__text_bold">Площадь м<sup>2</sup></div>
                <div class="row__items"> 
                  <div class="row__item"> 
                    <div class="row__text">Общая<i class="i">*</i></div>
                    <div class="row__inputs">
                      <input name="reqFlatTotalArea" class="row__input row__input_left" type="text" 
                      placeholder="от" autocomplete="off" 
                      value="${this.objectFilter.reqFlatTotalArea ? this.objectFilter.reqFlatTotalArea[0] !== 'null' ? this.objectFilter.reqFlatTotalArea[0] : '' : ''}">
                      <input name="reqFlatTotalArea" class="row__input row__input_right" type="text" 
                      placeholder="до" autocomplete="off" 
                      value="${this.objectFilter.reqFlatTotalArea ? this.objectFilter.reqFlatTotalArea[1] !== 'null' ? this.objectFilter.reqFlatTotalArea[1] : '' : ''}">
                    </div>
                  </div>
                  <div class="row__item"> 
                    <div class="row__text">Кухня</div>
                    <div class="row__inputs">
                      <input name="reqKitchenArea" class="row__input row__input_left" type="text" placeholder="от" 
                      autocomplete="off" value="${this.objectFilter.reqKitchenArea ? this.objectFilter.reqKitchenArea[0] !== 'null' ? this.objectFilter.reqKitchenArea[0] : '' : ''}">
                      <input name="reqKitchenArea" class="row__input row__input_right" type="text" placeholder="до" 
                      autocomplete="off" value="${this.objectFilter.reqKitchenArea ? this.objectFilter.reqKitchenArea[1] !== 'null' ? this.objectFilter.reqKitchenArea[1] : '' : ''}">
                    </div>
                  </div>                      
                  <div class="row__item"> 
                    <div class="row__text">Жилая</div>
                    <div class="row__inputs">
                      <input name="reqFlatLivingArea" class="row__input row__input_left" type="text" placeholder="от" 
                      autocomplete="off" value="${this.objectFilter.reqFlatLivingArea ? this.objectFilter.reqFlatLivingArea[0] !== 'null' ? this.objectFilter.reqFlatLivingArea[0] : '' : ''}">
                      <input name="reqFlatLivingArea" class="row__input row__input_right" type="text" placeholder="до" 
                      autocomplete="off" value="${this.objectFilter.reqFlatLivingArea ? this.objectFilter.reqFlatLivingArea[1] !== 'null' ? this.objectFilter.reqFlatLivingArea[1] : '' : ''}">
                    </div>
                  </div>
                </div>
              </div>
              <div class="row"> 
                <div class="row__text row__text_bold">Планировка</div>
                <div class="row__items"> 
                  <div class="row__toggle"> 
                    <input class="row__radio" id="nothingLayout" name="reqTypeofLayout" type="radio" value="nothing"
                    ${this.objectFilter.reqTypeofLayout ? '' : 'checked'}>
                    <label class="row__label" for="nothingLayout">Неважно</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Adjacent" name="reqTypeofLayout" type="radio" value="Смежная" 
                    ${this.objectFilter.reqTypeofLayout === 'Смежная' ? 'checked' : ''}>
                    <label class="row__label" for="Adjacent">Смежная</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Isolated" name="reqTypeofLayout" type="radio" value="Изолированная" 
                    ${this.objectFilter.reqTypeofLayout === 'Изолированная' ? 'checked' : ''}>
                    <label class="row__label" for="Isolated">Изолированная</label>
                  </div>
                </div>
              </div>
              <div class="row"> 
                <div class="row__text row__text_bold">Санузел</div>
                <div class="row__items"> 
                  <div class="row__toggle"> 
                    <input class="row__radio" id="nothingBathroom" name="reqBathroomType" type="radio"  value="nothing" 
                    ${this.objectFilter.reqBathroomType ? '' : 'checked'}>
                    <label class="row__label" for="nothingBathroom">Неважно</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Combined" name="reqBathroomType" type="radio" value="Совмещенный" 
                    ${this.objectFilter.reqBathroomType === 'Совмещенный' ? 'checked' : ''}>
                    <label class="row__label" for="Combined">Совмещенный</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Separated" name="reqBathroomType" type="radio" value="Раздельный" 
                    ${this.objectFilter.reqBathroomType === 'Раздельный' ? 'checked' : ''}>
                    <label class="row__label" for="Separated">Раздельный</label>
                  </div>                       
                </div>
              </div>
              <div class="row"> 
                <div class="row__text row__text_bold">Балкон/Лоджия</div>
                <div class="row__items"> 
                  <div class="row__toggle"> 
                    <input class="row__radio" id="nothingGallery" name="reqGalleryAvailability" type="radio" value="nothing"
                    ${this.objectFilter.reqGalleryAvailability ? '' : 'checked'}>
                    <label class="row__label" for="nothingGallery">Неважно</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Balcony" name="reqGalleryAvailability" type="radio" value="true" 
                    ${this.objectFilter.reqGalleryAvailability === true ? 'checked' : ''}>
                    <label class="row__label" for="Balcony">Есть</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Loggia" name="reqGalleryAvailability" type="radio" value="false" 
                    ${this.objectFilter.reqGalleryAvailability === false ? 'checked' : ''}>
                    <label class="row__label" for="Loggia">Нет</label>
                  </div>
                </div>
              </div>
              <div class="row"> 
                <div class="row__text row__text_bold">Ремонт</div>
                <div class="row__items"> 
                  <div class="row__toggle"> 
                    <input class="row__radio" id="nothingRepair" name="reqRepairStatus" type="radio" value="nothing" 
                    ${this.objectFilter.reqRepairStatus ? '' : 'checked'}>
                    <label class="row__label" for="nothingRepair">Неважно</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="NoRenovation" name="reqRepairStatus" type="radio" value="Без ремонта" 
                    ${this.objectFilter.reqRepairStatus === 'Без ремонта' ? 'checked' : ''}>
                    <label class="row__label" for="NoRenovation">Без ремонта</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Cosmetic" name="reqRepairStatus" type="radio" value="Косметический" 
                    ${this.objectFilter.reqRepairStatus === 'Косметический' ? 'checked' : ''}>
                    <label class="row__label" for="Cosmetic">Косметический</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Renovation" name="reqRepairStatus" type="radio" value="Евроремонт" 
                    ${this.objectFilter.reqRepairStatus === 'Евроремонт' ? 'checked' : ''}>
                    <label class="row__label" for="Renovation">Евроремонт</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Designer" name="reqRepairStatus" type="radio" value="Дизайнерский" 
                    ${this.objectFilter.reqRepairStatus === 'Дизайнерский' ? 'checked' : ''}>
                    <label class="row__label" for="Designer">Дизайнерский</label>
                  </div>
                </div>
              </div>
              <div class="row"> 
                <div class="row__text row__text_bold">Этаж<i class="i">*</i></div>
                <div class="row__items"> 
                  <div class="row__item"> 
                    <input name="reqFloor" class="row__input row__input_left" type="text" placeholder="от" autocomplete="off" 
                    value="${this.objectFilter.reqFloor ? this.objectFilter.reqFloor[0] !== 'null' ? this.objectFilter.reqFloor[0] : '' : ''}">
                    <input name="reqFloor" class="row__input row__input_right" type="text" placeholder="до" autocomplete="off" 
                    value="${this.objectFilter.reqFloor ? this.objectFilter.reqFloor[1] !== 'null' ? this.objectFilter.reqFloor[1] : '' : ''}">
                  </div>  
                  <div class="row__item"> 
                    <input name="notFloorFirst" class="row__checkbox" type="checkbox" id="notFirst" 
                    ${this.objectFilter.notFloorFirst ? 'checked' : ''}>
                    <label class="row__label-check" for="notFirst">Не первый</label>
                  </div>  
                  <div class="row__item"> 
                    <input name="notFloorLast" class="row__checkbox" type="checkbox" id="notLast" 
                    ${this.objectFilter.notFloorLast ? 'checked' : ''}>
                    <label class="row__label-check" for="notLast">Не последний</label>
                  </div>                 
                </div>                 
                </div>
              <div class="row"> 
                <div class="row__text row__text_bold">Этажей в доме</div>
                <div class="row__items"> 
                  <div class="row__item"> 
                    <input name="reqFloorCount" class="row__input row__input_left" type="text" placeholder="от" autocomplete="off" 
                    value="${this.objectFilter.reqFloorCount ? this.objectFilter.reqFloorCount[0] !== 'null' ? this.objectFilter.reqFloorCount[0] : '' : ''}">
                    <input name="reqFloorCount" class="row__input row__input_right" type="text" placeholder="до" autocomplete="off" 
                    value="${this.objectFilter.reqFloorCount ? this.objectFilter.reqFloorCount[1] !== 'null' ? this.objectFilter.reqFloorCount[1] : '' : ''}">
                  </div>                 
                </div>                 
                </div>
              <div class="row"> 
                <div class="row__text row__text_bold">Тип объекта<i class="i">*</i></div>
                <div class="row__items"> 
                  <div class="row__toggle"> 
                    <input class="row__radio" id="nothingObject" name="typeObject" type="radio" value="nothing" 
                    ${this.objectFilter.typeObject ? '' : 'checked'}>
                    <label class="row__label" for="nothingObject">Неважно</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="old" name="typeObject" type="radio" value="Вторичка" 
                    ${this.objectFilter.typeObject === 'Вторичка' ? 'checked' : ''}>
                    <label class="row__label" for="old">Вторичка</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="new" name="typeObject" type="radio" value="Новостройка" 
                    ${this.objectFilter.typeObject === 'Новостройка' ? 'checked' : ''}>
                    <label class="row__label" for="new">Новостройка</label>
                  </div>
                </div>
              </div>                    
              <div class="row"> 
                <div class="row__text row__text_bold"></div>
                <div class="row__items"> 
                  <div class="row__item"> 
                    <input name="isShowAgent" class="row__checkbox" type="checkbox" id="isAgent"
                    ${this.objectFilter.isShowAgent ? 'checked' : ''}>
                    <label class="row__label-check" for="isAgent">Не выводить агенства<i class="i">*</i></label>
                  </div>
                  <div class="row__item"> 
                    <input name="isReserve" class="row__checkbox" type="checkbox" id="isReserve"
                    ${this.objectFilter.isReserve ? 'checked' : ''}>
                    <label class="row__label-check" for="isReserve">Не выводить зарезервированные</label>
                  </div>    
                </div>
              </div>
            </div>
            <p class="extra__about">При поиске по внешней базе недвижимости (по рекламным площадкам) будут учитываться только фильтры отмеченные звездочкой <i class="i">*</i></p>
            <div class="metro__footer module__footer"> 
              <button data-extra="save" class="module__save" type="button">Сохранить</button>
              <button data-extra="clear" class="module__reset row__input_right"><span>Очистить</span></button>
            </div>`
  }
  handlerExtraInputValue(){
    const module = document.querySelector('.module');
    const allInputsText = module.querySelectorAll(`INPUT[type="text"]`);
    for (let input of allInputsText){
      input.addEventListener('keyup', event => {
        event.target.value = event.target.value.replace(/[^\d]/g, '');
      })
    }
  }
  getDealItems(data){
    let items = '';
    for (let item of data){
      items += `<p class="deal__text">${item.TITLE} <span data-deal="item" data-id="${item.ID}" class="ui-btn">выбрать</span></p>`
    }
    return items;
  }
  dealLayout(data){
    const dealItem = this.getDealItems(data);
    return `<div class="deal">
              ${dealItem} 
            </div>            
            <div class="metro__footer module__footer"> 
            </div>`
  }
  getTableBody(data){
    let body = '';
    let indexHistory = 0;
    for (let row of data){
      const dataRow = JSON.parse(row.data);
      body += `<tr> 
                <td>${row.createdDate.split(" ")[0].split('-').reverse().join('.')} ${row.createdDate.split(" ")[1].split('.')[0]}</td>
                <td>${dataRow.reqTypeofRealty}</td>
                <td>${dataRow.street ? dataRow.street : ''}</td>
                <td>
                    ${dataRow.reqFlatTotalArea ? dataRow.reqFlatTotalArea[0] && dataRow.reqFlatTotalArea[0] !== 'null' ? `от ${dataRow.reqFlatTotalArea[0]} ` : '' : ''}
                    ${dataRow.reqFlatTotalArea ? dataRow.reqFlatTotalArea[1] && dataRow.reqFlatTotalArea[1] !== 'null' ? `до ${dataRow.reqFlatTotalArea[1]} ` : '' : ''}
                </td>
                <td>
                    ${dataRow.reqPrice ? dataRow.reqPrice[0] ? `от ${dataRow.reqPrice[0]} ` : '' : ''}
                    ${dataRow.reqPrice ? dataRow.reqPrice[1] ? `до ${dataRow.reqPrice[1]} ` : '' : ''}
                </td>
                <td class="history_last"><span class="ui-btn" data-history="${indexHistory}">применить</span></td>
              </tr>`
      indexHistory++;
    }
    return body;
  }
  historyLayout(data){
    const tableBody = this.getTableBody(data);
    return `<div class="history">
              <table class="history__table"> 
                <thead class="history__head"> 
                  <tr> 
                    <td>Дата</td>
                    <td>Тип недвижимости</td>
                    <td>Улица</td>
                    <td>Площадь</td>
                    <td>Цена</td>
                    <td></td>
                  </tr>
                </thead>
                ${tableBody}
              </table>
            </div> 
            <div class="metro__footer module__footer">
            </div>`
  }

  checkCurrentElem(){
    if (this.currentElem){
      this.currentElem.classList.add('visible')
      this.currentElem = '';
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

  sortCardsHandler(action){
    if (action === 'default'){
      new Cards(this.cards).init();
    } else if (action === 'newOld'){
      this.sortCardNumberMax('reqUpdateTime')
      new Cards(this.copyCards).init();
    } else if (action === 'priceLow'){
      this.sortCardNumberMin('reqPrice')
      new Cards(this.copyCards).init();
    } else if (action === 'priceHigh'){
      this.sortCardNumberMax('reqPrice')
      new Cards(this.copyCards).init();
    } else if (action === 'areaLow'){
      if (document.querySelector(`INPUT[name='reqTypeofRealty']`).value === 'Земля'){
        this.sortCardNumberMin('reqLandArea')
        new Cards(this.copyCards).init();
      } else{
        this.sortCardNumberMin('reqFlatTotalArea')
        new Cards(this.copyCards).init();
      }
    } else if (action === 'areaHigh'){
      if (document.querySelector(`INPUT[name='reqTypeofRealty']`).value === 'Земля'){
        this.sortCardNumberMax('reqLandArea')
        new Cards(this.copyCards).init();
      } else{
        this.sortCardNumberMax('reqFlatTotalArea')
        new Cards(this.copyCards).init();
      }
    } else if (action === 'wordFirst'){
      this.sortCardsMin('reqStreet')
      new Cards(this.copyCards).init();
    } else if (action === 'wordLast'){
      this.sortCardsMax('reqStreet')
      new Cards(this.copyCards).init();
    }
  }
  sortCardsMin(nameKey){
    this.copyCards.sort((a, b) => {
      if (a[nameKey] < b[nameKey]){
        return -1
      } else if (a[nameKey] > b[nameKey]){
        return 1;
      } else {
        return 0;
      }
    })
  }
  sortCardsMax(nameKey){
    this.copyCards.sort((a, b) => {
      if (a[nameKey] > b[nameKey]){
        return -1
      } else if (a[nameKey] < b[nameKey]){
        return 1;
      } else {
        return 0;
      }
    })
  }
  sortCardNumberMin(nameKey){
    this.copyCards.sort((a, b) => {
      return +a[nameKey] - +b[nameKey]
    })
  }
  sortCardNumberMax(nameKey){
    this.copyCards.sort((a, b) => {
      return +b[nameKey] - +a[nameKey]
    })
  }

  setPagination(){
    this.countPaginat = Math.floor(this.copyCards.length / 100);
    this.balancePaginat = this.copyCards.length % 100;
    if (this.balancePaginat > 0){
      this.countPaginat++
    }
  }
  setPaginationActive(event){
    const allPagination = document.querySelectorAll('.btn-count');
    const activePagination = document.querySelectorAll(`span[data-paginat='${event.target.dataset.paginat}']`);
    for (let item of allPagination){
      if (item.classList.contains('btn_active')){
        item.classList.remove('btn_active');
      }
    }
    for (let active of activePagination){
      active.classList.add('btn_active');
    }
  }

  renderPagination(){
    const paginationContainer = document.querySelectorAll('.pagination')
    for (let container of paginationContainer){
      container.innerHTML = '';
      if (document.querySelector('.map__wrapper').classList.contains('visible')){
        container.classList.remove('visible');
      }
      if (this.countPaginat > 5){
        container.insertAdjacentHTML('beforeend', `<span class="btn btn-paginat btn-border" data-border="start" data-paginat="0">Первая</span>`);
        container.insertAdjacentHTML('beforeend', `<span class="btn btn-paginat btn-paginat_left" data-direction="prev"></span>`);
        for (let i = this.startPaginat; i < this.startPaginat + 5; i++){
          if (i === +this.currentPaginatActive){
            container.insertAdjacentHTML('beforeend', `<span class="btn btn-count btn-paginat btn_active" data-paginat="${i}">${i+1}</span>`);
          } else {
            container.insertAdjacentHTML('beforeend', `<span class="btn btn-count btn-paginat" data-paginat="${i}">${i+1}</span>`);
          }
        }
        container.insertAdjacentHTML('beforeend', `<span class="btn btn-paginat btn-paginat_right" data-direction="next"></span>`);
        container.insertAdjacentHTML('beforeend', `<span class="btn btn-paginat btn-border" data-border="end" data-paginat="${this.countPaginat - 1}">Последняя</span>`);
      } else{
        for (let i = 0; i < this.countPaginat; i++){
          if (i === +this.currentPaginatActive){
            container.insertAdjacentHTML('beforeend', `<span class="btn btn-count btn-paginat btn_active" data-paginat="${i}">${i+1}</span>`);
          } else {
            container.insertAdjacentHTML('beforeend', `<span class="btn btn-count btn-paginat" data-paginat="${i}">${i+1}</span>`);
          }
        }
      }
    }
  }
  setDirectionPagination(direction){
    if (direction === 'prev'){
      if (this.startPaginat > 0){
        this.startPaginat--;
        this.renderPagination();
      }
    } else if (direction === 'next'){
      if (this.startPaginat < this.countPaginat - 5){
        this.startPaginat++;
        this.renderPagination();
      }
    }
  }
  setPaginationBorder(event){
    if (event.target.dataset.border === 'start'){
      this.startPaginat = +event.target.dataset.paginat;
      this.showNewPartCards(event);
      this.renderPagination();
    } else if (event.target.dataset.border === 'end'){
      this.startPaginat = +event.target.dataset.paginat - 4;
      this.showNewPartCards(event);
      this.renderPagination();
    }
  }
  clearPaginationContainer(){
    const paginationContainer = document.querySelectorAll('.pagination');
    for (let container of paginationContainer){
      container.innerHTML = '';
      container.classList.add('visible');
    }
  }

  showNewPartCards(event){
    this.currentPaginatActive = +event.target.dataset.paginat;
    const currentCountStart = +event.target.dataset.paginat * 100;
    if (+event.target.dataset.paginat + 1 === this.countPaginat){
      let cards = [];
      const containerCards = document.querySelector('.cards');
      for (let i = currentCountStart; i < currentCountStart + this.balancePaginat; i++){
        cards.push(this.copyCards[i]);
      }
      containerCards.innerHTML = '';
      new Cards(cards).init();
    } else {
      const currentCountEnd = currentCountStart + 100;
      let cards = [];
      const containerCards = document.querySelector('.cards');
      for (let i = currentCountStart; i < currentCountEnd; i++){
        cards.push(this.copyCards[i]);
      }
      containerCards.innerHTML = '';
      new Cards(cards).init();
    }
  }

  openAlert(req){
    const layoutAlert = `<div class="module__wrap-alert">
                          <form class="form-alert">
                            <div class="form-alert__wrap">
                              <select class="form-alert__select">
                                  <option>Изменить ответственного Риелтора</option>
                                  <option>Изменить статус</option>
                                  <option>Изменить цену</option>
                                  <option>Иные причины</option>
                                  <option>Пожаловаться на дубль Заявки</option>
                                  <option>Проблема с адресом</option>
                                  <option>Проблема с выгрузкой в рекламу</option>
                                  <option>Проблема с информацией в Заявке</option>
                              </select>  
                            </div>                
                              <textarea placeholder="Введите коментарий для модератора" class="form-alert__area" 
                              name="" id="" cols="30" rows="14"></textarea>    
                          </form>
                          <button data-name="sendAlert" data-req="${req}" class="ui-btn ui-btn-light-border">Отправить</button>
                          <button data-name="close" class="ui-btn ui-btn-light-border">Отменить</button>
                          </div>`
    this.openModule('Вниманию модератора', layoutAlert);
    selectStyle('.form-alert__select', 'Изменить ответственного Риелтора');
  }
  async sendAlert(req){
    const obj = this.setAlert(req);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    let raw = JSON.stringify(obj);
    let requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };

    let response = await fetch("https://crm.centralnoe.ru/dealincom/exchange/modNotify.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    alert('Форма отправлена');
  }
  setAlert(req){
    const textField = document.querySelector('.form-alert__area');
    const selectField = document.querySelector('.form-alert__select');
    const sendObj = {
      userName: currentUserLogin,
      cardId: req,
      selectInput: selectField.options[selectField.selectedIndex].text,
      comment: textField.value,
    };
    console.log(sendObj);
    return sendObj;
  }
  setReqNumber(req){
    if (req.length < 11){
      req = '0' + req;
      this.setReqNumber(req);
    }
    return req;
  }

  setCountCard(cards){
    const quantity = document.querySelector('.quantity');
    if (cards.length < 5000){
      quantity.innerHTML = `Найдено <span>${cards.length}</span> объектов`;
    } else {
      quantity.innerHTML = `Найдено <span>5000+</span> объектов`;
    }
  }
}

class Cards {
  constructor(cards) {
    this.cards = cards;
    this.container = document.querySelector('.cards');
  }
  init() {
    this.container.innerHTML = '';
    if (this.cards.length > 0){
      this.container.insertAdjacentHTML('beforeend', this.render());
      this.container.insertAdjacentHTML('beforeend', `<span data-arrow="up" class='arrow-up'></span>`);
    } else {
      this.container.insertAdjacentHTML('beforeend', `<p>Нет объектов</p>`);
    }
  }
  getPriceMeter(card){
    if (card.reqPrice && card.reqFlatTotalArea){
      if (card.reqPrice === '0' || card.reqFlatTotalArea === '0' || card.reqTypeofRealty === "Земельный участок"){
        return ``
      } else {
        return `<span class="card__text card__text_grey">${((+card.reqPrice / +card.reqFlatTotalArea) * 1000).toFixed(0)}  ₽/кв.м</span>`;
      }
    } else {
      return ''
    }
  }
  getDate(card){
    const data = new Date(card.reqUpdateTime * 1000);
    return `${data.getDate() < 10 ? `0${data.getDate()}` : data.getDate()}-${data.getMonth()+1 < 10 ? `0${data.getMonth()+1}` : data.getMonth()+1}-${data.getFullYear()}`
  }
  render(){
    let layout = '';
    let maxCount = 100;
    if (this.cards.length < 100){
      maxCount = this.cards.length;
    }
    console.log(this.cards)
    for (let i = 0; i < maxCount; i++){
      const priceMeter = this.getPriceMeter(this.cards[i]);
      const actualDate = this.getDate(this.cards[i]);
      layout += `<div class="card">
                    <img data-open="openCard" data-req="${this.cards[i].reqNumber}" data-source="${this.cards[i].reqType}" class="card__img" src="${this.cards[i].reqPhoto}" alt="img" onerror="errorImg(this)">
                    <div class="card__wrap">
                        <div class="card__info">                 
                            <a href="https://crm.centralnoe.ru/CDB/object/card/cardObject.php?source=${this.cards[i].reqType}&id=${this.cards[i].reqNumber}" 
                            data-open="openCard" data-req="${this.cards[i].reqNumber}" 
                            data-source="${this.cards[i].reqType}" class="card__title card__link" onclick="event.preventDefault()">
                              ${this.cards[i].reqTypeofRealty === "Квартира" || this.cards[i].reqTypeofRealty === "Дом" 
                              || this.cards[i].reqTypeofRealty === "Комната"
                              ? `${this.cards[i].reqRoomCount ? `${this.cards[i].reqRoomCount}к ` : ''}`
                              : ''}
                              ${this.cards[i].reqStreet ? `ул. ${this.cards[i].reqStreet} ` : ''}
                              ${this.cards[i].reqTypeofRealty === 'Дом' || this.cards[i].reqTypeofRealty === 'Земля' || this.cards[i].reqTypeofRealty === 'Гараж' ? '' 
                              : this.cards[i].reqHouseNumber ? `д. ${this.cards[i].reqHouseNumber}` : ''}
                            </a>
                            <span class="card__text">
                              ${this.cards[i].reqCity ? `${this.cards[i].reqCity} ` : ''}
                              ${this.cards[i].reqRayon ? `${this.cards[i].reqRayon} р-н` : ''}
                            </span>
                            <span class="card__text">
                            ${this.cards[i].nearMetro ?
        `                    <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.56623 0L5 5.22145L2.46689 0L0.364238 6.29837H0V7H2.13576V6.331H1.80464L2.84768 3.50816L4.7351 7H5.24834L7.13576 3.47552L8.19536 6.29837H7.81457V7H10V6.29837H9.6192L7.56623 0Z" fill="#E84533"/>
                            </svg>` : ''}
                            ${this.cards[i].nearMetro ? this.cards[i].nearMetro : ''}
                            ${this.cards[i].metroDistance ? `<span class="card__text card__text_grey">&#183 ${this.cards[i].metroDistance} мин. пешком</span>` : ''}          
                        </span>
                        </div>
                        <div class="card__info">
                            ${this.cards[i].reqFlatTotalArea ? `<span class="card__title">${this.cards[i].reqFlatTotalArea} кв<sup>2</sup></span>` : ''}
                            ${this.cards[i].reqFloor && this.cards[i].reqFloors ? `<span class="card__text">${this.cards[i].reqFloor}/${this.cards[i].reqFloors} эт. </span>` : ''}
                            ${this.cards[i].reqTypeofRealty === "Дом" || this.cards[i].reqTypeofRealty === "Земля" || this.cards[i].reqTypeofRealty === "Земельный участок" && this.cards[i].reqLandArea ?
                            `<span class="${this.cards[i].reqFlatTotalArea || this.cards[i].reqFloor ? 'card__text' : 'card__title'}"> 
                                Учаток ${this.cards[i].reqLandArea} сот.
                            </span>`
                            : ''}
                        </div>
                        <div class="card__info card_right">
                            <span class="card__title">${this.cards[i].reqPrice ? `${this.cards[i].reqPrice} тыс. ₽` : ''}</span>
                            ${priceMeter}                           
                            <span class="card__text">
                            ${this.cards[i].reqDocType ? this.cards[i].reqDocType : ''}
                            </span>
                        </div>
                        <div class="card__info card_end">
                            <div class="card__btn-list">
                                <button class="card__btn btn${this.cards[i].reqNumber}" data-req="${this.cards[i].reqNumber}" data-card="reserv" title="добавить в подборку"> 
                                  <svg class="event-none" width="30" height="30" fill="#BEC1C0" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                  \t viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                                  <g id="Layer_1_1_">
                                  <polygon points="21.707,8.707 20.293,7.293 12,15.586 8.707,12.293 7.293,13.707 12,18.414 \t"/>
                                  <rect x="25" y="12" width="18" height="2"/>
                                  <polygon points="21.707,20.707 20.293,19.293 12,27.586 8.707,24.293 7.293,25.707 12,30.414 \t"/>
                                  <rect x="25" y="24" width="18" height="2"/>
                                  <polygon points="21.707,32.707 20.293,31.293 12,39.586 8.707,36.293 7.293,37.707 12,42.414 \t"/>
                                  <rect x="25" y="36" width="18" height="2"/>
                                  </g>
                                  </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card__info card_last card_between card_right">
                            <span class="card__text card__text_grey">Актуализировано <span class="card__data">${actualDate}</span></span>
                            <img class="card__logo" src="${this.cards[i].reqLogo}" alt="logo">
                        </div>
                    </div>
                </div>`
    }

    return layout;
  }
}
function errorImg(img){
  img.src = 'https://crm.centralnoe.ru/dealincom/assets/empty_photo.jpg';
}

class Basket {
  constructor() {
    this.fullness = [];
    this.countContainer = document.querySelector('.count-basket');
    this.itemsContainer = document.querySelector('.basket__items');
  }
  init() {
    if (this.fullness.length > 0){
      this.countContainer.innerHTML = `${this.fullness.length}`;
      this.countContainer.classList.remove('visible');
    } else {
      this.countContainer.innerHTML = ``;
      this.countContainer.classList.add('visible');
    }
    this.renderItems();
  }
  renderItems(){
    this.itemsContainer.innerHTML = '';
    for (let item of this.fullness){
      this.itemsContainer.insertAdjacentHTML('beforeend',
        `<p class="basket__item" data-elem="check">
                ${item.reqStreet ? `ул. ${item.reqStreet}, ` : ''}
                ${item.reqHouseNumber ? `д. ${item.reqHouseNumber}` : ''}
                <span data-elem="check">${item.reqPrice ? `${item.reqPrice } тыс. ₽` : ''}</span>
              </p>`)
    }
  }
}

const address = new AddressHandler();
address.init();
const basket = new Basket();

const priceLeft = document.querySelector('.price_left');
priceLeft.addEventListener('keyup', event => {
  event.target.value = event.target.value.replace(/[^\d]/g, '');
  let leftValue = event.target.value.split(' ').join('');
  event.target.value = leftValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
})

const priceRight = document.querySelector('.price_right');
priceRight.addEventListener('keyup', event => {
  event.target.value = event.target.value.replace(/[^\d]/g, '');
  let rightValue = event.target.value.split(' ').join('');
  event.target.value = rightValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
})
setTimeout(()=>{
  document.querySelector('.container').scrollIntoView();
}, 1000)

/**
 * garland, garlandStart
 * герлянда
 */
function garland(){
  const nums = document.getElementById('nums_1').innerHTML;
  if (+nums === 1) {
    document.getElementById('garland').className = 'garland_1';
    document.getElementById('nums_1').innerHTML = '2'
  }
  if (+nums === 2) {
    document.getElementById('garland').className = 'garland_2';
    document.getElementById('nums_1').innerHTML = '3'
  }
  if (+nums === 3) {
    document.getElementById('garland').className = 'garland_3';
    document.getElementById('nums_1').innerHTML = '4'
  }
  if (+nums === 4) {
    document.getElementById('garland').className = 'garland_4';
    document.getElementById('nums_1').innerHTML = '1'
  }
}
function garlandStart(){
  setInterval(() => {
    garland();
  }, 600);
}

garlandStart();