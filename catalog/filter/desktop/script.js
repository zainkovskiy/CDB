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

class AddressHandler {
  constructor() {
    this.container = document.querySelector('.container');
    this.district = [
      'Дзержинский район',
      'Железнодорожный район',
      'Заельцовский район',
      'Калиниский район',
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
    this.address = '';
    this.request = true;
    this.cards = [];
    this.copyCards = [];
    this.startPaginat = 0;
    this.countPaginat = 0;
    this.balancePaginat = 0;
    this.currentPaginatActive = 0;
  }
  init(){
    this.handlerSource();
    this.container.addEventListener('click', event => {
      if(event.target.dataset.name === 'metro'){
        this.openModule('Поиск по станции метро', this.metroLayout());
        selectStyle('.metro__select', `${this.metroTime ? this.metroTime : '15 минут'}`);
        this.checkCurrentElem();
      } else if (event.target.dataset.name === 'district'){
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
          this.setCountCard(data);
          new Cards(data).init();
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
        });
      } else if (event.target.dataset.address === 'street'){
        this.addressValue = event.target.dataset.value;
        this.metroArray = [];
        this.districtArray = [];
        // this.setAddressLayout();
        this.showChangeMetroDistrict();
        this.checkCurrentElem();
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
      } else if (event.target.dataset.card){
        if (event.target.dataset.card === 'alert'){
          this.openAlert(event.target.dataset.req);
        } else if (event.target.dataset.card === 'reserv'){

        }
      }
    });

    for (let input of document.querySelectorAll('.start__input')){
      input.addEventListener('focus', () => {
        if (input.name !== 'houseNumber'){
          this.checkCurrentElem();
          const elem = document.querySelector(`.${input.name}__block`);
          elem.classList.remove('visible');
          this.currentElem = elem;
          if(input.name === 'address'){
            input.value = this.addressValue;
          }
        }
      })
      if (input.name === 'address'){
        input.addEventListener('keyup', () => {
          if(input.value.length > 0){
            this.getStreet(input.value).then(data => {
              if (data.length > 0){
                this.request = false;
                this.renderStreet(data, input, 'streetName');
              }
            });
          } else {
            this.addressValue = '';
            input.value = '';
            this.setAddressLayout();
            this.showChangeMetroDistrict();
          }
        })
        input.addEventListener('blur', () => {
          if (this.addressValue.length === 0 && this.metroArray.length === 0 && this.metroArray.length === 0){
            input.value = '';
          } else {
            input.value = `${this.addressValue.length > 0 ? this.addressValue : ''} ${this.metroArray.length > 0 || this.districtArray.length > 0 ? `Выбрано ${this.metroArray.length + this.districtArray.length}` : ''}`;
          }
        })
      } else if (input.name === 'houseNumber'){
        input.addEventListener('keyup', () => {
          if (input.value.length > 0){
            document.querySelector(`.${input.name}-x`).classList.add('start__input-cross');
          } else {
            document.querySelector(`.${input.name}-x`).classList.remove('start__input-cross');
          }
        })
      }
    }

    document.body.addEventListener('click', event => {
      if (event.target.dataset.elem !== 'check'){
        this.checkCurrentElem();
        this.showChangeMetroDistrict();
      }
    })

    this.handlerPriceFilter();
  }
  async sendToServer(){
    this.objectFilter.action = 'get';

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

    let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/catalogFilter.php", requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    let jsonA = await response.json();
    this.cards = jsonA;
    this.copyCards = JSON.parse(JSON.stringify(this.cards));
    return jsonA;
  }

  async getStreet(value){
    let response = await fetch(`https://crm.centralnoe.ru/dealincom/factory/getaddress.php?req=${value}`);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    let jsonA = await response.json();
    return jsonA;
  }
  renderStreet(data, input, valueName){
    const container = document.querySelector(`.${input.name}__text`);
    document.querySelector(`.${input.name}__block`).classList.remove('visible')
    container.innerHTML = '';
    if (data.length === 0){
      // container.classList.add('visible');
      this.request = true;
    } else {
      if (data.length > 3){
        for (let i = 0; i < 3; i++){
          container.insertAdjacentHTML('beforeend',
            `<p data-value="${data[i][valueName]}" data-address="street" data-elem="check" class="search__item">${data[i][valueName]}</p>`)
        }
      } else if (data.length <= 3 && data.length !== 0){
        for (let item of data){
          container.insertAdjacentHTML('beforeend',
            `<p data-value="${item[valueName]}" data-address="street" data-elem="check" class="search__item">${item[valueName]}</p>`)
        }
      }
      // container.classList.remove('visible');
      this.request = true;
    }
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
    }
  }

  setAllValue(){
    this.objectFilter.metroDistance = this.metroTime ? this.metroTime : null;
    this.objectFilter.area = this.districtArray.length === 0 ? null : this.districtArray;
    this.objectFilter.metro = this.metroArray.length === 0 ? null : this.metroArray;
    this.objectFilter.reqRoomCount = [];
    this.objectFilter.street = this.addressValue;
    const houseNumber = document.querySelector(`INPUT[name='houseNumber']`).value;
    this.objectFilter.houseNumber = houseNumber ? houseNumber : null;
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
  setAddressLayout(){
    const addressContainer = document.querySelector('.address__block');
    addressContainer.innerHTML = '';
    addressContainer.insertAdjacentHTML('beforeend',
          `<div data-elem="check" class="address__text">
                    <span data-elem="check">Начните вводить или выберите объект в выпадающем списке</span>
                </div>
                <div data-elem="check" class="address__btn">
                    <button data-elem="check" data-name="metro" class="address__btn-item"><span class="address__title">Метро</span><span class="address__arrow"></span></button>
                    <button data-elem="check" data-name="district" class="address__btn-item"><span class="address__title">Район и микрорайон</span><span class="address__arrow"></span></button>
                </div>`)
  }
  showChangeMetroDistrict(){
    const textContainer = document.querySelector('.address__text');
    if (this.metroArray.length > 0 || this.districtArray.length > 0 || this.addressValue){
      textContainer.innerHTML = '';
      textContainer.insertAdjacentHTML('beforeend', `<span class="address__title" data-elem="check">Поиск в любом из этих мест</span>`);
      if (this.addressValue.length > 0 ){
        document.querySelector(`INPUT[name='address']`).value = this.addressValue;
        textContainer.insertAdjacentHTML('beforeend', `<span data-elem="check">${this.addressValue}</span>`);
      }

      if (this.metroArray.length > 4){
        textContainer.insertAdjacentHTML('beforeend', `<span data-elem="check">${this.metroArray.length} станций метро</span>`);
        document.querySelector(`INPUT[name='address']`).value = `${this.metroArray.length} станций метро`;
      } else if (this.metroArray.length !== 0 && this.metroArray.length <= 4){
        let valueMetro = '';
        for (let value of this.metroArray){
          textContainer.insertAdjacentHTML('beforeend', `<span data-elem="check">${value}</span>`);
          valueMetro += `${value}, `;
        }
        document.querySelector(`INPUT[name='address']`).value = valueMetro.slice(0, -2);
      }

      if (this.districtArray.length > 4){
        textContainer.insertAdjacentHTML('beforeend', `<span data-elem="check">${this.districtArray.length} районов</span>`);
        document.querySelector(`INPUT[name='address']`).value = `${this.districtArray.length} районов`;
      } else if (this.districtArray.length !== 0 && this.districtArray.length <= 4){
        let valueDistrict = '';
        for (let value of this.districtArray){
          textContainer.insertAdjacentHTML('beforeend', `<span data-elem="check">${value}</span>`);
          valueDistrict += `${value}, `;
        }
        document.querySelector(`INPUT[name='address']`).value = valueDistrict.slice(0, -2);
      }
      document.querySelector(`.address-x`).classList.add('start__input-cross');
    } else {
      textContainer.innerHTML = '';
      textContainer.insertAdjacentHTML('beforeend', `<span data-elem="check">Начните вводить или выберите объект в выпадающем списке</span>`);
      document.querySelector(`INPUT[name='address']`).value = '';
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
      this.objectFilter.reqPrice = [];
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
      } else if (event.target.dataset.name === 'sendAlert'){
        this.sendAlert(this.setReqNumber(event.target.dataset.req)).then(() => {
          this.closeModule(module);
        });
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
    this.districtArray = [];
    this.metroTime = metroTime.innerHTML;
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
    this.metroArray = [];
  }
  clearValueDistrict(module){
    const allCheckedInputs = module.querySelectorAll(`INPUT[type='checkbox']`);
    for (let checkbox of allCheckedInputs){
      checkbox.checked = false;
    }
    this.districtArray = [];
  }
  districtFilter(value){
    const regexp = new RegExp(value, 'i');
    this.filter = this.district.filter(district => regexp.test(district));
    this.isVisibleSearch();
  }
  isVisibleSearch(){
    const searchBlock = document.querySelector('.district__hide');

    if (this.filter.length === 0 || this.filter.length === this.district.length){
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
    this.objectFilter.reqFlatTotalArea = [];
    this.objectFilter.reqKitchenArea = [];
    this.objectFilter.reqFlatLivingArea = [];
    this.objectFilter.reqFloor = [];
    this.objectFilter.reqFloorCount = [];
    const allInputs = module.querySelectorAll('INPUT');
    for (let input of allInputs){
      if (input.type === 'radio'){
        if (input.checked){
          if (input.value === "nothing"){
            this.objectFilter[input.name] = null;
          } else if (input.value === "true"){
            this.objectFilter[input.name] = true;
          } else if (input.value === "false") {
            this.objectFilter[input.name] = false;
          } else {
            this.objectFilter[input.name] = input.value;
          }
        }
      } else if (input.type === 'checkbox'){
        this.objectFilter[input.name] = input.checked;
      } else if (input.type === 'text'){
        this.objectFilter[input.name].push(`${input.value.length === 0 ? null : input.value}`);
      }
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
                <span class="region__btn ui-btn" data-region="Новосибирская область">Новосибирская область</span>
                <span class="region__btn ui-btn" data-region="Кемеровская область">Кемеровская область</span>
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
  districtLayout(){
    const currentY = window.pageYOffset;

    return `<div style="top: ${currentY}" class="module">
              <form class="module__form district__form">
                <div class="district">
                  <span data-name="close" class="btn-close"></span>
                    <div class="district__left">
                      <div class="module__header">
                        <h2 class="module__head">Районы</h2>
                      </div>
                      <div class="district__wrap">
                        <label class="module__label">
                          <input name="Дзержинский" type="checkbox">
                          <span>Дзержинский</span>
                        </label>
                        <label class="module__label">
                          <input name="Железнодорожный" type="checkbox">
                          <span>Железнодорожный</span>
                        </label>
                        <label class="module__label">
                          <input name="Заельцовский" type="checkbox">
                          <span>Заельцовский</span>
                        </label>
                        <label class="module__label">
                          <input name="Калиниский" type="checkbox">
                          <span>Калиниский</span>
                        </label>
                        <label class="module__label">
                          <input name="Кировский" type="checkbox">
                          <span>Кировский</span>
                        </label>
                        <label class="module__label">
                          <input name="Ленинский" type="checkbox">
                          <span>Ленинский</span>
                        </label>
                        <label class="module__label">
                          <input name="Октябрьский" type="checkbox">
                          <span>Октябрьский</span>
                        </label>
                        <label class="module__label">
                          <input name="Первомайский" type="checkbox">
                          <span>Первомайский</span>
                        </label>
                        <label class="module__label">
                          <input name="Советский" type="checkbox">
                          <span>Советский</span>
                        </label>
                        <label class="module__label">
                          <input name="Центральный" type="checkbox">
                          <span>Центральный</span>
                        </label>
                      </div>
                    </div>
                    <div class="district__right">
                      <div class="module__header district__header">
                        <h2 class="module__head">Микрорайоны</h2>
                        <div class="district__search-wrap">
                          <input class="district__search" type="text">
                          <div class="district__hide visible"></div>
                        </div>
                      </div>
                      <div class="district__wrap district__wrap-right">
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">А</span>
                          <label class="module__label">
                            <input name="Авиастроителей" type="checkbox">
                            <span>Авиастроителей</span>
                          </label>
                          <label class="module__label">
                            <input name="Акатуйский" type="checkbox">
                            <span>Акатуйский</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Б</span>
                          <label class="module__label">
                            <input name="Башня" type="checkbox">
                            <span>Башня</span>
                          </label>
                          <label class="module__label">
                            <input name="Беловежский" type="checkbox">
                            <span>Беловежский</span>
                          </label>
                          <label class="module__label">
                            <input name="Береговой_ж/м" type="checkbox">
                            <span>Береговой ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="Березовое" type="checkbox">
                            <span>Березовое</span>
                          </label>
                          <label class="module__label">
                            <input name="Берёзовая_роща" type="checkbox">
                            <span>Берёзовая роща</span>
                          </label>
                          <label class="module__label">
                            <input name="Благовещенский" type="checkbox">
                            <span>Благовещенский</span>
                          </label>
                          <label class="module__label">
                            <input name="Богдана_Хмельницкого" type="checkbox">
                            <span>Богдана Хмельницкого</span>
                          </label>
                          <label class="module__label">
                            <input name="Ботанический_ж/м" type="checkbox">
                            <span>Ботанический ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="Бугринская_роща" type="checkbox">
                            <span>Бугринская роща</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">В</span>
                          <label class="module__label">
                            <input name="Вертковская" type="checkbox">
                            <span>Вертковская</span>
                          </label>
                          <label class="module__label">
                            <input name="Вверхняя_зона_Академгородка" type="checkbox">
                            <span>Вверхняя зона Академгородка</span>
                          </label>
                          <label class="module__label">
                            <input name="Весенний" type="checkbox">
                            <span>Весенний</span>
                          </label>
                          <label class="module__label">
                            <input name="Военный_городок" type="checkbox">
                            <span>Военный городок</span>
                          </label>
                          <label class="module__label">
                            <input name="Вокзал" type="checkbox">
                            <span>Вокзал</span>
                          </label>
                          <label class="module__label">
                            <input name="Волочаевская" type="checkbox">
                            <span>Волочаевская</span>
                          </label>
                          <label class="module__label">
                            <input name="Волочаевский_ж/м" type="checkbox">
                            <span>Волочаевский ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="Восточный_МЖК" type="checkbox">
                            <span>Восточный МЖК</span>
                          </label>
                          <label class="module__label">
                            <input name="Восход" type="checkbox">
                            <span>Восход</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Г</span>
                          <label class="module__label">
                            <input name="ГПНТБ" type="checkbox">
                            <span>ГПНТБ</span>
                          </label>
                          <label class="module__label">
                            <input name="Гвардейский" type="checkbox">
                            <span>Гвардейский</span>
                          </label>
                          <label class="module__label">
                            <input name="Горбольница" type="checkbox">
                            <span>Горбольница</span>
                          </label>
                          <label class="module__label">
                            <input name="Городской_аэропорт" type="checkbox">
                            <span>Городской аэропорт</span>
                          </label>
                          <label class="module__label">
                            <input name="Горский" type="checkbox">
                            <span>Горский</span>
                          </label>
                          <label class="module__label">
                            <input name="Гэсстроевский" type="checkbox">
                            <span>Гэсстроевский</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Д</span>
                          <label class="module__label">
                            <input name="ДК_Кирова" type="checkbox">
                            <span>ДК Кирова</span>
                          </label>
                          <label class="module__label">
                            <input name="ДК_Энергия" type="checkbox">
                            <span>ДК Энергия</span>
                          </label>
                          <label class="module__label">
                            <input name="Депутатский" type="checkbox">
                            <span>Депутатский</span>
                          </label>
                          <label class="module__label">
                            <input name="Дивногорский" type="checkbox">
                            <span>Дивногорский</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Е</span>
                          <label class="module__label">
                            <input name="Европейский_берег" type="checkbox">
                            <span>Европейский берег</span>
                          </label>
                          <label class="module__label">
                            <input name="Ерестинский" type="checkbox">
                            <span>Ерестинский</span>
                          </label>
                          <label class="module__label">
                            <input name="Есенина" type="checkbox">
                            <span>Есенина</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">З</span>
                          <label class="module__label">
                            <input name="Закаменский" type="checkbox">
                            <span>Закаменский</span>
                          </label>
                          <label class="module__label">
                            <input name="Западный_ж/м" type="checkbox">
                            <span>Западный ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name=Затон"" type="checkbox">
                            <span>Затон</span>
                          </label>
                          <label class="module__label">
                            <input name="Затулинский_ж/м" type="checkbox">
                            <span>Затулинский ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="Зеленая_горка" type="checkbox">
                            <span>Зеленая горка</span>
                          </label>
                          <label class="module__label">
                            <input name="Золотая_горка" type="checkbox">
                            <span>Золотая горка</span>
                          </label>
                          <label class="module__label">
                            <input name="Золотая_нива" type="checkbox">
                            <span>Золотая нива</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">И</span>
                          <label class="module__label">
                            <input name="Иподромский" type="checkbox">
                            <span>Иподромский</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">К</span>
                          <label class="module__label">
                            <input name="КСМ" type="checkbox">
                            <span>КСМ</span>
                          </label>
                          <label class="module__label">
                            <input name="Каменский" type="checkbox">
                            <span>Каменский</span>
                          </label>
                          <label class="module__label">
                            <input name="Карьер_Мочище" type="checkbox">
                            <span>Карьер Мочище</span>
                          </label>
                          <label class="module__label">
                            <input name="Кирова" type="checkbox">
                            <span>Кирова</span>
                          </label>
                          <label class="module__label">
                            <input name="Клюквенный" type="checkbox">
                            <span>Клюквенный</span>
                          </label>
                          <label class="module__label">
                            <input name="Ключ-Камышенское_плато" type="checkbox">
                            <span>Ключ-Камышенское плато</span>
                          </label>
                          <label class="module__label">
                            <input name="Ключевой" type="checkbox">
                            <span>Ключевой</span>
                          </label>
                          <label class="module__label">
                            <input name="Коминтерна" type="checkbox">
                            <span>Коминтерна</span>
                          </label>
                          <label class="module__label">
                            <input name="Кропоткинский_ж/м" type="checkbox">
                            <span>Кропоткинский ж/м</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Л</span>
                          <label class="module__label">
                            <input name="Лесопервалка" type="checkbox">
                            <span>Лесопервалка</span>
                          </label>
                          <label class="module__label">
                            <input name="Линейный" type="checkbox">
                            <span>Линейный</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">М</span>
                          <label class="module__label">
                            <input name="Матвеевка" type="checkbox">
                            <span>Матвеевка</span>
                          </label>
                          <label class="module__label">
                            <input name="Минделеевский" type="checkbox">
                            <span>Минделеевский</span>
                          </label>
                          <label class="module__label">
                            <input name="Мира_(Расточка)" type="checkbox">
                            <span>Мира (Расточка)</span>
                          </label>
                          <label class="module__label">
                            <input name="Молодежный" type="checkbox">
                            <span>Молодежный</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Н</span>
                          <label class="module__label">
                            <input name="Нарымский_сквер" type="checkbox">
                            <span>Нарымский сквер</span>
                          </label>
                          <label class="module__label">
                            <input name="Нижняя_Ельцовка" type="checkbox">
                            <span>Нижняя Ельцовка</span>
                          </label>
                          <label class="module__label">
                            <input name="Нижняя_зона_Академгородка" type="checkbox">
                            <span>Нижняя зона Академгородка</span>
                          </label>
                          <label class="module__label">
                            <input name="Никитинский" type="checkbox">
                            <span>Никитинский</span>
                          </label>
                          <label class="module__label">
                            <input name="Новомарусино" type="checkbox">
                            <span>Новомарусино</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">О</span>
                          <label class="module__label">
                            <input name="Облбольница" type="checkbox">
                            <span>Облбольница</span>
                          </label>
                          <label class="module__label">
                            <input name="ОбьГЭС" type="checkbox">
                            <span>ОбьГЭС</span>
                          </label>
                          <label class="module__label">
                            <input name="Огурцово" type="checkbox">
                            <span>Огурцово</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">П</span>
                          <label class="module__label">
                            <input name="Палласа" type="checkbox">
                            <span>Палласа</span>
                          </label>
                          <label class="module__label">
                            <input name="Памирский" type="checkbox">
                            <span>Памирский</span>
                          </label>
                          <label class="module__label">
                            <input name="Пашино_пос." type="checkbox">
                            <span>Пашино пос.</span>
                          </label>
                          <label class="module__label">
                            <input name="Пермский" type="checkbox">
                            <span>Пермский</span>
                          </label>
                          <label class="module__label">
                            <input name="Планировочный_ж/м" type="checkbox">
                            <span>Планировочный ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="Плановая" type="checkbox">
                            <span>Плановая</span>
                          </label>
                          <label class="module__label">
                            <input name="Плановый_пос." type="checkbox">
                            <span>Плановый пос.</span>
                          </label>
                          <label class="module__label">
                            <input name="Плехановский_ж/м" type="checkbox">
                            <span>Плехановский ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="Площадь_Калинина" type="checkbox">
                            <span>Площадь Калинина</span>
                          </label>
                          <label class="module__label">
                            <input name="Площадь_Маркса" type="checkbox">
                            <span>Площадь Маркса</span>
                          </label>
                          <label class="module__label">
                            <input name="Площадь_Свердлова" type="checkbox">
                            <span>Площадь Свердлова</span>
                          </label>
                          <label class="module__label">
                            <input name="Площадь_Станиславского" type="checkbox">
                            <span>Площадь Станиславского</span>
                          </label>
                          <label class="module__label">
                            <input name="Плющихинсий_ж/м" type="checkbox">
                            <span>Плющихинсий ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="Посёлок_РМЗ" type="checkbox">
                            <span>Посёлок РМЗ</span>
                          </label>
                          <label class="module__label">
                            <input name="Прибрежный" type="checkbox">
                            <span>Прибрежный</span>
                          </label>
                          <label class="module__label">
                            <input name="Приозёрный" type="checkbox">
                            <span>Приозёрный</span>
                          </label>
                          <label class="module__label">
                            <input name="Проспект_Дзержинского" type="checkbox">
                            <span>Проспект Дзержинского</span>
                          </label>
                          <label class="module__label">
                            <input name="Просторный_ж/м" type="checkbox">
                            <span>Просторный ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="пос._Геологов" type="checkbox">
                            <span>пос. Геологов</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Р</span>
                          <label class="module__label">
                            <input name="Радиостанция" type="checkbox">
                            <span>Радиостанция</span>
                          </label>
                          <label class="module__label">
                            <input name="Родники_(6-й_мкр)" type="checkbox">
                            <span>Родники (6-й мкр)</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">С</span>
                          <label class="module__label">
                            <input name="Сад_Дзержинского" type="checkbox">
                            <span>Сад Дзержинского</span>
                          </label>
                          <label class="module__label">
                            <input name="Сад_Кирова" type="checkbox">
                            <span>Сад Кирова</span>
                          </label>
                          <label class="module__label">
                            <input name="Сад_Мичуринцев" type="checkbox">
                            <span>Сад Мичуринцев</span>
                          </label>
                          <label class="module__label">
                            <input name="Северный_пос." type="checkbox">
                            <span>Северный пос.</span>
                          </label>
                          <label class="module__label">
                            <input name="Северо-Чемской_ж/м" type="checkbox">
                            <span>Северо-Чемской ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="Снегири_(5-й_мкр)" type="checkbox">
                            <span>Снегири (5-й мкр)</span>
                          </label>
                          <label class="module__label">
                            <input name="Совсибирь" type="checkbox">
                            <span>Совсибирь</span>
                          </label>
                          <label class="module__label">
                            <input name="Станиславский_ж/м" type="checkbox">
                            <span>Станиславский ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="Сто_домов" type="checkbox">
                            <span>Сто домов</span>
                          </label>
                          <label class="module__label">
                            <input name="Стрижи" type="checkbox">
                            <span>Стрижи</span>
                          </label>
                          <label class="module__label">
                            <input name="Студенческий" type="checkbox">
                            <span>Студенческий</span>
                          </label>
                          <label class="module__label">
                            <input name="Сухарная" type="checkbox">
                            <span>Сухарная</span>
                          </label>
                          <label class="module__label">
                            <input name="Сухой_лог" type="checkbox">
                            <span>Сухой лог</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Т</span>
                          <label class="module__label">
                            <input name="ТРЦ_АУРА" type="checkbox">
                            <span>ТРЦ АУРА</span>
                          </label>
                          <label class="module__label">
                            <input name="Телецентр" type="checkbox">
                            <span>Телецентр</span>
                          </label>
                          <label class="module__label">
                            <input name="Тихвинский" type="checkbox">
                            <span>Тихвинский</span>
                          </label>
                          <label class="module__label">
                            <input name="Тихий_центр" type="checkbox">
                            <span>Тихий центр</span>
                          </label>
                          <label class="module__label">
                            <input name="Троллейный_ж/м" type="checkbox">
                            <span>Троллейный ж/м</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Ф</span>
                          <label class="module__label">
                            <input name="Фабричный" type="checkbox">
                            <span>Фабричный</span>
                          </label>
                          <label class="module__label">
                            <input name="Фрунзенский" type="checkbox">
                            <span>Фрунзенский</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Х</span>
                          <label class="module__label">
                            <input name="Хилокский" type="checkbox">
                            <span>Хилокский</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Ц</span>
                          <label class="module__label">
                            <input name="ЦУМ" type="checkbox">
                            <span>ЦУМ</span>
                          </label>
                          <label class="module__label">
                            <input name="Центр" type="checkbox">
                            <span>Центр</span>
                          </label>
                          <label class="module__label">
                            <input name="Центр_(Красный_проспект)" type="checkbox">
                            <span>Центр (Красный проспект)</span>
                          </label>
                          <label class="module__label">
                            <input name="Центральная_Пермовайка" type="checkbox">
                            <span>Центральная Пермовайка</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Ц</span>
                          <label class="module__label">
                            <input name="Челюскинский_ж/м" type="checkbox">
                            <span>Челюскинский ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="Чистая_слобода" type="checkbox">
                            <span>Чистая слобода</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Ш</span>
                          <label class="module__label">
                            <input name="Шевченский" type="checkbox">
                            <span>Шевченский</span>
                          </label>
                          <label class="module__label">
                            <input name="Шлюз" type="checkbox">
                            <span>Шлюз</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Э</span>
                          <label class="module__label">
                            <input name="Энергостроителей" type="checkbox">
                            <span>Энергостроителей</span>
                          </label>
                        </div>
                        <div class="microdistrict-list">
                          <span class="microdistrict-title">Ю</span>
                          <label class="module__label">
                            <input name="Юбилейный_(4-й_мкр)" type="checkbox">
                            <span>Юбилейный (4-й мкр)</span>
                          </label>
                          <label class="module__label">
                            <input name="Юго-Западный_ж/м" type="checkbox">
                            <span>Юго-Западный ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="Южно-Чемской_ж/м" type="checkbox">
                            <span>Южно-Чемской ж/м</span>
                          </label>
                          <label class="module__label">
                            <input name="Южный_(Ленинский_р-н)" type="checkbox">
                            <span>Южный (Ленинский р-н)</span>
                          </label>
                          <label class="module__label">
                            <input name="Южный_(Первомайский_р-н)" type="checkbox">
                            <span>Южный (Первомайский р-н)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                </div>
                <div class="module__footer district__footer">
                  <button class="module__save" type="button">Сохранить</button>
                  <button class="module__reset" type="reset"><span>Очистить</span></button>
                </div>
              </form>
            </div>`
  }
  // districtLayout(){
  //   return `<div class="district">
  //             <div class="district__left">
  //               <div class="module__header">
  //                 <h2 class="module__head">Районы</h2>
  //                 <div class="district__search-wrap">
  //                   <input class="district__search" type="text">
  //                   <div class="district__hide visible"></div>
  //                 </div>
  //               </div>
  //               <div class="district__wrap">
  //                 <label class="module__label">
  //                   <input name="dzerzhinskiy" type="checkbox" value="Дзержинский" ${this.districtValue.dzerzhinskiy ? 'checked ' : ''}>
  //                   <span>Дзержинский</span>
  //                 </label>
  //                 <label class="module__label">
  //                   <input name="zheleznodorozhniy" type="checkbox" value="Железнодорожный" ${this.districtValue.zheleznodorozhniy ? 'checked ' : ''}>
  //                   <span>Железнодорожный</span>
  //                 </label>
  //                 <label class="module__label">
  //                   <input name="zaelovskiy" type="checkbox" value="Заельцовский" ${this.districtValue.zaelovskiy ? 'checked ' : ''}>
  //                   <span>Заельцовский</span>
  //                 </label>
  //                 <label class="module__label">
  //                   <input name="kalininskiy" type="checkbox" value="Калиниский" ${this.districtValue.kalininskiy ? 'checked ' : ''}>
  //                   <span>Калиниский</span>
  //                 </label>
  //                 <label class="module__label">
  //                   <input name="kirovskiy" type="checkbox" value="Кировский" ${this.districtValue.kirovskiy ? 'checked ' : ''}>
  //                   <span>Кировский</span>
  //                 </label>
  //                 <label class="module__label">
  //                   <input name="leninskiy" type="checkbox" value="Ленинский" ${this.districtValue.leninskiy ? 'checked ' : ''}>
  //                   <span>Ленинский</span>
  //                 </label>
  //                 <label class="module__label">
  //                   <input name="oktyabrskiy" type="checkbox" value="Октябрьский" ${this.districtValue.oktyabrskiy ? 'checked ' : ''}>
  //                   <span>Октябрьский</span>
  //                 </label>
  //                 <label class="module__label">
  //                   <input name="pervomayskiy" type="checkbox" value="Первомайский" ${this.districtValue.pervomayskiy ? 'checked ' : ''}>
  //                   <span>Первомайский</span>
  //                 </label>
  //                 <label class="module__label">
  //                   <input name="sovetskiy" type="checkbox" value="Советский" ${this.districtValue.sovetskiy ? 'checked ' : ''}>
  //                   <span>Советский</span>
  //                 </label>
  //                 <label class="module__label">
  //                   <input name="centralniy" type="checkbox" value="Центральный" ${this.districtValue.centralniy ? 'checked ' : ''}>
  //                   <span>Центральный</span>
  //                 </label>
  //               </div>
  //             </div>
  //           </div>
  //           <div class="module__footer district__footer">
  //             <button data-form="save" class="module__save">Сохранить</button>
  //             <button class="module__reset" data-form="clear">Очистить</button>
  //           </div>`
  // }
  extraOpenLayout(){
    return `<div class="extra"> 
              <div class="row"> 
                <div class="row__text row__text_bold">Площадь м<sup>2</sup></div>
                <div class="row__items"> 
                  <div class="row__item"> 
                    <div class="row__text">Общая</div>
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
                    ${this.objectFilter.reqTypeofLayout === 'adjacent' ? 'checked' : ''}>
                    <label class="row__label" for="Adjacent">Смежная</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Isolated" name="reqTypeofLayout" type="radio" value="Изолированная" 
                    ${this.objectFilter.reqTypeofLayout === 'isolated' ? 'checked' : ''}>
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
                    ${this.objectFilter.reqBathroomType === 'combined' ? 'checked' : ''}>
                    <label class="row__label" for="Combined">Совмещенный</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Separated" name="reqBathroomType" type="radio" value="Раздельный" 
                    ${this.objectFilter.reqBathroomType === 'separated' ? 'checked' : ''}>
                    <label class="row__label" for="Separated">Раздельный</label>
                  </div>                       
                </div>
              </div>
              <div class="row"> 
                <div class="row__text row__text_bold">Балкон/Лоджия</div>
                <div class="row__items"> 
                  <div class="row__toggle"> 
                    <input class="row__radio" id="nothingGallery" name="reqGalleryAvailability" type="radio" value="nothing"
                    ${this.objectFilter.reqGalleryAvailability === null ? '' : 'checked'}>
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
                    ${this.objectFilter.reqRepairStatus === 'noRenovation' ? 'checked' : ''}>
                    <label class="row__label" for="NoRenovation">Без ремонта</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Cosmetic" name="reqRepairStatus" type="radio" value="Косметический" 
                    ${this.objectFilter.reqRepairStatus === 'cosmetic' ? 'checked' : ''}>
                    <label class="row__label" for="Cosmetic">Косметический</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Renovation" name="reqRepairStatus" type="radio" value="Евроремонт" 
                    ${this.objectFilter.reqRepairStatus === 'renovation' ? 'checked' : ''}>
                    <label class="row__label" for="Renovation">Евроремонт</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="Designer" name="reqRepairStatus" type="radio" value="Дизайнерский" 
                    ${this.objectFilter.reqRepairStatus === 'designer' ? 'checked' : ''}>
                    <label class="row__label" for="Designer">Дизайнерский</label>
                  </div>
                </div>
              </div>
              <div class="row"> 
                <div class="row__text row__text_bold">Этаж</div>
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
                <div class="row__text row__text_bold">Тип объекта</div>
                <div class="row__items"> 
                  <div class="row__toggle"> 
                    <input class="row__radio" id="nothingObject" name="typeObject" type="radio" value="nothing" 
                    ${this.objectFilter.typeObject ? '' : 'checked'}>
                    <label class="row__label" for="nothingObject">Неважно</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="old" name="typeObject" type="radio" value="Вторичка" 
                    ${this.objectFilter.typeObject === 'old' ? 'checked' : ''}>
                    <label class="row__label" for="old">Вторичка</label>
                  </div>
                  <div class="row__toggle"> 
                    <input class="row__radio" id="new" name="typeObject" type="radio" value="Новостройка" 
                    ${this.objectFilter.typeObject === 'new' ? 'checked' : ''}>
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
                    <label class="row__label-check" for="isAgent">Не выводить агентсва</label>
                  </div>  
                </div>
              </div>
            </div>
            <div class="metro__footer module__footer"> 
              <button data-extra="save" class="module__save" type="button">Сохранить</button>
              <button class="module__reset row__input_right" type="reset"><span>Очистить</span></button>
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
      this.sortCardNumberMin('reqUpdateTime')
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
    console.log(this.countPaginat)
    console.log(this.balancePaginat)
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
      if (this.countPaginat > 5){
        container.insertAdjacentHTML('beforeend', `<span class="btn btn-paginat btn-border" data-border="start" data-paginat="0">в начало</span>`);
        container.insertAdjacentHTML('beforeend', `<span class="btn btn-paginat btn-paginat_left" data-direction="prev"></span>`);
        for (let i = this.startPaginat; i < this.startPaginat + 5; i++){
          if (i === +this.currentPaginatActive){
            container.insertAdjacentHTML('beforeend', `<span class="btn btn-count btn-paginat btn_active" data-paginat="${i}">${i+1}</span>`);
          } else {
            container.insertAdjacentHTML('beforeend', `<span class="btn btn-count btn-paginat" data-paginat="${i}">${i+1}</span>`);
          }
        }
        container.insertAdjacentHTML('beforeend', `<span class="btn btn-paginat btn-paginat_right" data-direction="next"></span>`);
        container.insertAdjacentHTML('beforeend', `<span class="btn btn-paginat btn-border" data-border="end" data-paginat="${this.countPaginat - 1}">в конец</span>`);
      } else{
        for (let i = 0; i < this.startPaginat + 5; i++){
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
    const containerCentr = document.querySelector('.count-centr');
    const containerAll = document.querySelector('.count-all');
    let centr = 0;
    let all = 0;
    if (cards.length > 0){
      for (let card of cards){
        if (card.reqType === '1c'){
          centr++;
        } else if (card.reqType === 'pars'){
          all++;
        }
      }
    }
    if (centr > 0){
      containerCentr.classList.remove('visible');
      for (let i = 0; i < centr; i++){
        containerCentr.innerHTML = '';
        containerCentr.innerHTML = centr;
      }
    } else {
      containerCentr.innerHTML = '';
      containerCentr.classList.add('visible');
    }
    if (all > 0){
      containerAll.classList.remove('visible');
      containerAll.innerHTML = '';
      containerAll.innerHTML = all;
    } else {
      containerAll.innerHTML = '';
      containerAll.classList.add('visible');
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
      if (card.reqPrice === '0' || card.reqFlatTotalArea === '0'){
        return `0`
      } else {
        return ((+card.reqPrice / +card.reqFlatTotalArea) * 1000).toFixed(0);
      }
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
                    <img class="card__img" src="${this.cards[i].reqPhoto}" alt="img">
                    <div class="card__wrap">
                        <div class="card__info">
                            <a href="#" class="card__title card__link">
                              ${this.cards[i].reqTypeofRealty === "Квартира" || this.cards[i].reqTypeofRealty === "Дом" || this.cards[i].reqTypeofRealty === "Комната" 
                              ? `${this.cards[i].reqRoomCount ? `${this.cards[i].reqRoomCount}к, ` : ''}`
                              : ''}
                              ${this.cards[i].reqStreet ? `ул. ${this.cards[i].reqStreet}, ` : ''}
                              ${this.cards[i].reqHouseNumber ? `д. ${this.cards[i].reqHouseNumber}` : ''}
                            </a>
                            <span class="card__text">
                              ${this.cards[i].reqCity ? `${this.cards[i].reqCity}, ` : ''}
                              ${this.cards[i].reqRayon ? `${this.cards[i].reqRayon} р-н` : ''}
                            </span>
                            <span class="card__text">
                            ${this.cards[i].nearMetro ? 
                            `<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.56623 0L5 5.22145L2.46689 0L0.364238 6.29837H0V7H2.13576V6.331H1.80464L2.84768 3.50816L4.7351 7H5.24834L7.13576 3.47552L8.19536 6.29837H7.81457V7H10V6.29837H9.6192L7.56623 0Z" fill="#E84533"/>
                            </svg>` : ''}
                            ${this.cards[i].nearMetro ? this.cards[i].nearMetro : ''}
                            ${this.cards[i].metroDistance ? `<span class="card__text card__text_grey">&#183 ${this.cards[i].metroDistance} мин. пешком</span>` : ''}          
                        </span>
                        </div>
                        <div class="card__info">
                            ${this.cards[i].reqFlatTotalArea ? `<span class="card__title">${this.cards[i].reqFlatTotalArea} кв<sup>2</sup></span>` : ''}
                            ${this.cards[i].reqFloor && this.cards[i].reqFloors ? `<span class="card__text">${this.cards[i].reqFloor}/${this.cards[i].reqFloors} эт. </span>` : ''}
                            ${this.cards[i].reqTypeofRealty === "Дом" || this.cards[i].reqTypeofRealty === "Земля" && this.cards[i].reqLandArea ? 
                            `<span class="${this.cards[i].reqFlatTotalArea || this.cards[i].reqFloor ? 'card__text' : 'card__title'}"> 
                                Учаток ${this.cards[i].reqLandArea} сот.
                            </span>` 
                            : ''}
                        </div>
                        <div class="card__info card_right">
                            <span class="card__title">${this.cards[i].reqPrice ? `${this.cards[i].reqPrice} тыс. ₽` : ''}</span>
                            ${this.cards[i].reqTypeofRealty === "Земля" ? '' : `<span class="card__text card__text_grey">${priceMeter} ₽/кв.м</span>`}                           
                            <span class="card__text">
                            ${this.cards[i].reqDocType ? this.cards[i].reqDocType : ''}
                            </span>
                        </div>
                        <div class="card__info card_end">
                            <div class="card__btn-list">
                                <button class="card__btn" data-req="${this.cards[i].reqNumber}" data-card="reserv"> 
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
                                <button class="card__btn" data-req="${this.cards[i].reqNumber}" data-card="alert">
                                  <svg class="event-none" width="30" height="30" fill="#BEC1C0" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                  \t viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                                  <g><g>
                                  <path d="M505.403,406.394L295.389,58.102c-8.274-13.721-23.367-22.245-39.39-22.245c-16.023,0-31.116,8.524-39.391,22.246
                                  \t\t\tL6.595,406.394c-8.551,14.182-8.804,31.95-0.661,46.37c8.145,14.42,23.491,23.378,40.051,23.378h420.028
                                  \t\t\tc16.56,0,31.907-8.958,40.052-23.379C514.208,438.342,513.955,420.574,505.403,406.394z M477.039,436.372
                                  \t\t\tc-2.242,3.969-6.467,6.436-11.026,6.436H45.985c-4.559,0-8.784-2.466-11.025-6.435c-2.242-3.97-2.172-8.862,0.181-12.765
                                  \t\t\tL245.156,75.316c2.278-3.777,6.433-6.124,10.844-6.124c4.41,0,8.565,2.347,10.843,6.124l210.013,348.292
                                  \t\t\tC479.211,427.512,479.281,432.403,477.039,436.372z"/>
                                  </g></g><g><g>
                                  <path d="M256.154,173.005c-12.68,0-22.576,6.804-22.576,18.866c0,36.802,4.329,89.686,4.329,126.489
                                  \t\t\tc0.001,9.587,8.352,13.607,18.248,13.607c7.422,0,17.937-4.02,17.937-13.607c0-36.802,4.329-89.686,4.329-126.489
                                  \t\t\tC278.421,179.81,268.216,173.005,256.154,173.005z"/>
                                  </g></g><g><g>
                                  <path d="M256.465,353.306c-13.607,0-23.814,10.824-23.814,23.814c0,12.68,10.206,23.814,23.814,23.814
                                  \t\t\tc12.68,0,23.505-11.134,23.505-23.814C279.97,364.13,269.144,353.306,256.465,353.306z"/>
                                  </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
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

const address = new AddressHandler();
address.init();

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