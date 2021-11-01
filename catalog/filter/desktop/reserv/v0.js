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
  }
  init(){
    this.container.addEventListener('click', event => {
      if(event.target.dataset.name === 'metro'){
        this.metroOpen();
        this.checkCurrentElem();
      } else if (event.target.dataset.name === 'district'){
        this.districtOpen();
        this.checkCurrentElem();
      } else if (event.target.dataset.name === 'extra'){
        this.extraOpen();
        this.checkCurrentElem();
      } else if (event.target.dataset.name === 'search') {
        this.setAllValue();
      } else if (event.target.dataset.address === 'street'){
        this.addressValue = event.target.dataset.value;
        this.setAddressLayout();
        this.showChangeMetroDistrict();
      } else if (event.target.dataset.input === 'reqTypeofRealty'){
        document.querySelector(`INPUT[name='reqTypeofRealty']`).value = event.target.dataset.value;
        this.checkCurrentElem();
      } else if (event.target.dataset.input === 'sort') {
        document.querySelector(`INPUT[name='sort']`).value = event.target.dataset.value;
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
        this.regionOpen();
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
            input.removeAttribute('value');
          } else {
            input.value = `${this.addressValue.length > 0 ? this.addressValue : ''} ${this.metroArray.length > 0 || this.districtArray.length > 0 ? `Выбрано ${this.metroArray.length + this.districtArray.length}` : ''}`;
          }
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
  async getStreet(value){
    let response = await fetch(`https://crm.centralnoe.ru/dealincom/factory/getaddress.php?req=${value}`);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    let jsonA = await response.json();
    return jsonA;
  }
  renderStreet(data, input, valueName){
    const container = document.querySelector(`.${input.name}__block`);
    container.innerHTML = '';
    if (data.length === 0){
      // container.classList.add('visible');
      this.request = true;
    } else {
      if (data.length > 10){
        for (let i = 0; i < 10; i++){
          container.insertAdjacentHTML('beforeend',
            `<p data-value="${data[i][valueName]}" data-address="street" data-elem="check" class="search__item">${data[i][valueName]}</p>`)
        }
      } else if (data.length <= 10 && data.length !== 0){
        for (let item of data){
          container.insertAdjacentHTML('beforeend',
            `<p data-value="${item[valueName]}" data-address="street" data-elem="check" class="search__item">${item[valueName]}</p>`)
        }
      }
      container.classList.remove('visible');
      this.request = true;
    }
  }

  setAllValue(){
    this.objectFilter.metroDistance = this.metroTime ? this.metroTime : null;
    this.objectFilter.area = this.districtArray.length === 0 ? null : this.districtArray;
    this.objectFilter.metro = this.metroArray.length === 0 ? null : this.metroArray;
    this.objectFilter.reqRoomCount = [];
    this.objectFilter.sreet = this.addressValue;
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
    this.reqRegion = document.querySelector('.place__text').innerHTML;
    console.log(this.objectFilter)
  }
  setRoomValue(event){
    if (this.countRoom.length === 0){
      document.querySelector(`INPUT[name='${event.target.dataset.input}']`).value = 'Любое';
    } else if (this.countRoom.length === 1){
      document.querySelector(`INPUT[name='${event.target.dataset.input}']`).value = this.countRoom[0].dataset.room;
    } else if (this.countRoom.length > 1){
      document.querySelector(`INPUT[name='${event.target.dataset.input}']`).value = `Выбрано ${this.countRoom.length}`
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
      textContainer.insertAdjacentHTML('beforeend', `<span data-elem="check">${this.addressValue}</span>`);
      for (let value of this.metroArray){
        textContainer.insertAdjacentHTML('beforeend', `<span data-elem="check">${value}</span>`);
      }
      for (let value of this.districtArray){
        textContainer.insertAdjacentHTML('beforeend', `<span data-elem="check">${value}</span>`);
      }
      document.querySelector(`INPUT[name='address']`).value = `${this.addressValue.length > 0 ? this.addressValue : ''} ${this.metroArray.length > 0 || this.districtArray.length > 0 ? `Выбрано ${this.metroArray.length + this.districtArray.length}` : ''}`;
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
    this.objectFilter.reqPrice = [];
    this.objectFilter.reqPrice.push(priceFrom.value ? priceFrom.value : null, priceTo.value ? priceTo.value : null);
    document.querySelector(`INPUT[name='reqPrice']`).value =
      `${priceFrom.value ? `от ${priceFrom.value}` : ''} ${priceTo.value ? `до ${priceTo.value}` : ''}`
  }


  regionOpen(){
    const bodyDom = document.querySelector('body');
    bodyDom.setAttribute("style", "overflow-y:hidden;");
    bodyDom.insertAdjacentHTML('afterbegin', this.regionLayout());
    this.regionHandler();
  }
  regionLayout(){
    const currentY = window.pageYOffset;
    const currentPlace = document.querySelector('.place__text').innerHTML;
    return `<div style="top: ${currentY}"  class="module"> 
                <form class="module__form"> 
                  <div class="module__header metro__header"> 
                      <h2 class="module__head">Местоположение</h2>
                      <span data-name="close" class="btn-close"></span>
                  </div>
                  <div class="region"> 
                    <span class="region__title"> 
                      Текущее местоположение ${currentPlace}
                    </span>
                    <div class="region__wrap"> 
                      <span class="region__btn ui-btn" data-region="Новосибирская область">Новосибирская область</span>
                      <span class="region__btn ui-btn" data-region="Кемеровская область">Кемеровская область</span>
                    </div>
                  </div>
                  <div class="metro__footer module__footer"> 
                  </div>
                </form>
            </div>`
  }
  regionHandler(){
    const module = document.querySelector('.module');

    document.body.addEventListener('keydown', event => {
      if (event.key === 'Escape'){
        const bodyDom = document.querySelector('body');
        bodyDom.removeAttribute("style");
        module.remove();
        document.body.removeEventListener('keydown');
      }
    })
    module.addEventListener('click', event => {
      if (event.target.dataset.name === 'close') {
        const bodyDom = document.querySelector('body');
        bodyDom.removeAttribute("style");
        module.remove();
      } else if (event.target.dataset.region){
        document.querySelector('.place__text').innerHTML = event.target.dataset.region;
        const bodyDom = document.querySelector('body');
        bodyDom.removeAttribute("style");
        module.remove();
      }

    });
  }

  metroOpen(){
    const bodyDom = document.querySelector('body');
    bodyDom.setAttribute("style", "overflow-y:hidden;");
    bodyDom.insertAdjacentHTML('afterbegin', this.metroLayout());
    selectStyle('.metro__select', `${this.metroTime ? this.metroTime : '15 минут'}`);
    this.metroHandler();
  }
  metroLayout(){
    const currentY = window.pageYOffset;

    return `<div style="top: ${currentY}"  class="module"> 
                <form class="module__form"> 
                  <div class="module__header metro__header"> 
                      <h2 class="module__head">Поиск по станции метро</h2>
                      <span data-name="close" class="btn-close"></span>
                  </div>
                  <div class="metro__grid">                    
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
                  </div>
                </form>
            </div>`
  }
  metroHandler(){
    const module = document.querySelector('.module');
    const allCheckedInputs = module.querySelectorAll(`INPUT[type='checkbox']`);
    const metroTime = document.querySelector('.metro__gap');

    document.body.addEventListener('keydown', event => {
      if (event.key === 'Escape'){
        const bodyDom = document.querySelector('body');
        bodyDom.removeAttribute("style");
        module.remove();
        document.body.removeEventListener('keydown');
      }
    })

    module.addEventListener('click', event => {
      if (event.target.dataset.name === 'close'){
        const bodyDom = document.querySelector('body');
        bodyDom.removeAttribute("style");
        module.remove();
      } else if (event.target.dataset.name === 'allcheck'){
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
      } else if (event.target.dataset.metro === 'save'){
        this.metroArray = [];
        for (let check of allCheckedInputs){
          if (check.checked && check.dataset.name !== 'allcheck'){
            this.metroArray.push(check.value);
            this.metroValue[check.name] = true;
          } else {
            this.metroValue[check.name] = false;
          }
        }
        this.metroTime = metroTime.innerHTML;
        const bodyDom = document.querySelector('body');
        bodyDom.removeAttribute("style");
        module.remove();
        this.showChangeMetroDistrict();
      } else if (event.target.dataset.metro === 'clear'){
        event.preventDefault();
        for (let checkbox of allCheckedInputs){
          checkbox.checked = false;
          checkbox.disabled = false;
        }
        this.metroArray = [];
        metroTime.innerHTML = '15 минут';
      }
    });
  }

  districtOpen(){
    const bodyDom = document.querySelector('body');
    bodyDom.setAttribute("style", "overflow-y:hidden;");
    bodyDom.insertAdjacentHTML('afterbegin', this.districtLayout());
    this.districtHandler();
  }
  //with district
  // districtLayout(){
  //   const currentY = window.pageYOffset;
  //
  //   return `<div style="top: ${currentY}" class="module">
  //             <form class="module__form district__form">
  //               <div class="district">
  //                 <span data-name="close" class="btn-close"></span>
  //                   <div class="district__left">
  //                     <div class="module__header">
  //                       <h2 class="module__head">Районы</h2>
  //                     </div>
  //                     <div class="district__wrap">
  //                       <label class="module__label">
  //                         <input name="Дзержинский" type="checkbox">
  //                         <span>Дзержинский</span>
  //                       </label>
  //                       <label class="module__label">
  //                         <input name="Железнодорожный" type="checkbox">
  //                         <span>Железнодорожный</span>
  //                       </label>
  //                       <label class="module__label">
  //                         <input name="Заельцовский" type="checkbox">
  //                         <span>Заельцовский</span>
  //                       </label>
  //                       <label class="module__label">
  //                         <input name="Калиниский" type="checkbox">
  //                         <span>Калиниский</span>
  //                       </label>
  //                       <label class="module__label">
  //                         <input name="Кировский" type="checkbox">
  //                         <span>Кировский</span>
  //                       </label>
  //                       <label class="module__label">
  //                         <input name="Ленинский" type="checkbox">
  //                         <span>Ленинский</span>
  //                       </label>
  //                       <label class="module__label">
  //                         <input name="Октябрьский" type="checkbox">
  //                         <span>Октябрьский</span>
  //                       </label>
  //                       <label class="module__label">
  //                         <input name="Первомайский" type="checkbox">
  //                         <span>Первомайский</span>
  //                       </label>
  //                       <label class="module__label">
  //                         <input name="Советский" type="checkbox">
  //                         <span>Советский</span>
  //                       </label>
  //                       <label class="module__label">
  //                         <input name="Центральный" type="checkbox">
  //                         <span>Центральный</span>
  //                       </label>
  //                     </div>
  //                   </div>
  //                   <div class="district__right">
  //                     <div class="module__header district__header">
  //                       <h2 class="module__head">Микрорайоны</h2>
  //                       <div class="district__search-wrap">
  //                         <input class="district__search" type="text">
  //                         <div class="district__hide visible"></div>
  //                       </div>
  //                     </div>
  //                     <div class="district__wrap district__wrap-right">
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">А</span>
  //                         <label class="module__label">
  //                           <input name="Авиастроителей" type="checkbox">
  //                           <span>Авиастроителей</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Акатуйский" type="checkbox">
  //                           <span>Акатуйский</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Б</span>
  //                         <label class="module__label">
  //                           <input name="Башня" type="checkbox">
  //                           <span>Башня</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Беловежский" type="checkbox">
  //                           <span>Беловежский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Береговой_ж/м" type="checkbox">
  //                           <span>Береговой ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Березовое" type="checkbox">
  //                           <span>Березовое</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Берёзовая_роща" type="checkbox">
  //                           <span>Берёзовая роща</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Благовещенский" type="checkbox">
  //                           <span>Благовещенский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Богдана_Хмельницкого" type="checkbox">
  //                           <span>Богдана Хмельницкого</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Ботанический_ж/м" type="checkbox">
  //                           <span>Ботанический ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Бугринская_роща" type="checkbox">
  //                           <span>Бугринская роща</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">В</span>
  //                         <label class="module__label">
  //                           <input name="Вертковская" type="checkbox">
  //                           <span>Вертковская</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Вверхняя_зона_Академгородка" type="checkbox">
  //                           <span>Вверхняя зона Академгородка</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Весенний" type="checkbox">
  //                           <span>Весенний</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Военный_городок" type="checkbox">
  //                           <span>Военный городок</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Вокзал" type="checkbox">
  //                           <span>Вокзал</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Волочаевская" type="checkbox">
  //                           <span>Волочаевская</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Волочаевский_ж/м" type="checkbox">
  //                           <span>Волочаевский ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Восточный_МЖК" type="checkbox">
  //                           <span>Восточный МЖК</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Восход" type="checkbox">
  //                           <span>Восход</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Г</span>
  //                         <label class="module__label">
  //                           <input name="ГПНТБ" type="checkbox">
  //                           <span>ГПНТБ</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Гвардейский" type="checkbox">
  //                           <span>Гвардейский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Горбольница" type="checkbox">
  //                           <span>Горбольница</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Городской_аэропорт" type="checkbox">
  //                           <span>Городской аэропорт</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Горский" type="checkbox">
  //                           <span>Горский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Гэсстроевский" type="checkbox">
  //                           <span>Гэсстроевский</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Д</span>
  //                         <label class="module__label">
  //                           <input name="ДК_Кирова" type="checkbox">
  //                           <span>ДК Кирова</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="ДК_Энергия" type="checkbox">
  //                           <span>ДК Энергия</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Депутатский" type="checkbox">
  //                           <span>Депутатский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Дивногорский" type="checkbox">
  //                           <span>Дивногорский</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Е</span>
  //                         <label class="module__label">
  //                           <input name="Европейский_берег" type="checkbox">
  //                           <span>Европейский берег</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Ерестинский" type="checkbox">
  //                           <span>Ерестинский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Есенина" type="checkbox">
  //                           <span>Есенина</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">З</span>
  //                         <label class="module__label">
  //                           <input name="Закаменский" type="checkbox">
  //                           <span>Закаменский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Западный_ж/м" type="checkbox">
  //                           <span>Западный ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name=Затон"" type="checkbox">
  //                           <span>Затон</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Затулинский_ж/м" type="checkbox">
  //                           <span>Затулинский ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Зеленая_горка" type="checkbox">
  //                           <span>Зеленая горка</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Золотая_горка" type="checkbox">
  //                           <span>Золотая горка</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Золотая_нива" type="checkbox">
  //                           <span>Золотая нива</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">И</span>
  //                         <label class="module__label">
  //                           <input name="Иподромский" type="checkbox">
  //                           <span>Иподромский</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">К</span>
  //                         <label class="module__label">
  //                           <input name="КСМ" type="checkbox">
  //                           <span>КСМ</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Каменский" type="checkbox">
  //                           <span>Каменский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Карьер_Мочище" type="checkbox">
  //                           <span>Карьер Мочище</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Кирова" type="checkbox">
  //                           <span>Кирова</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Клюквенный" type="checkbox">
  //                           <span>Клюквенный</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Ключ-Камышенское_плато" type="checkbox">
  //                           <span>Ключ-Камышенское плато</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Ключевой" type="checkbox">
  //                           <span>Ключевой</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Коминтерна" type="checkbox">
  //                           <span>Коминтерна</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Кропоткинский_ж/м" type="checkbox">
  //                           <span>Кропоткинский ж/м</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Л</span>
  //                         <label class="module__label">
  //                           <input name="Лесопервалка" type="checkbox">
  //                           <span>Лесопервалка</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Линейный" type="checkbox">
  //                           <span>Линейный</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">М</span>
  //                         <label class="module__label">
  //                           <input name="Матвеевка" type="checkbox">
  //                           <span>Матвеевка</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Минделеевский" type="checkbox">
  //                           <span>Минделеевский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Мира_(Расточка)" type="checkbox">
  //                           <span>Мира (Расточка)</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Молодежный" type="checkbox">
  //                           <span>Молодежный</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Н</span>
  //                         <label class="module__label">
  //                           <input name="Нарымский_сквер" type="checkbox">
  //                           <span>Нарымский сквер</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Нижняя_Ельцовка" type="checkbox">
  //                           <span>Нижняя Ельцовка</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Нижняя_зона_Академгородка" type="checkbox">
  //                           <span>Нижняя зона Академгородка</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Никитинский" type="checkbox">
  //                           <span>Никитинский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Новомарусино" type="checkbox">
  //                           <span>Новомарусино</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">О</span>
  //                         <label class="module__label">
  //                           <input name="Облбольница" type="checkbox">
  //                           <span>Облбольница</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="ОбьГЭС" type="checkbox">
  //                           <span>ОбьГЭС</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Огурцово" type="checkbox">
  //                           <span>Огурцово</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">П</span>
  //                         <label class="module__label">
  //                           <input name="Палласа" type="checkbox">
  //                           <span>Палласа</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Памирский" type="checkbox">
  //                           <span>Памирский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Пашино_пос." type="checkbox">
  //                           <span>Пашино пос.</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Пермский" type="checkbox">
  //                           <span>Пермский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Планировочный_ж/м" type="checkbox">
  //                           <span>Планировочный ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Плановая" type="checkbox">
  //                           <span>Плановая</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Плановый_пос." type="checkbox">
  //                           <span>Плановый пос.</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Плехановский_ж/м" type="checkbox">
  //                           <span>Плехановский ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Площадь_Калинина" type="checkbox">
  //                           <span>Площадь Калинина</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Площадь_Маркса" type="checkbox">
  //                           <span>Площадь Маркса</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Площадь_Свердлова" type="checkbox">
  //                           <span>Площадь Свердлова</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Площадь_Станиславского" type="checkbox">
  //                           <span>Площадь Станиславского</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Плющихинсий_ж/м" type="checkbox">
  //                           <span>Плющихинсий ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Посёлок_РМЗ" type="checkbox">
  //                           <span>Посёлок РМЗ</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Прибрежный" type="checkbox">
  //                           <span>Прибрежный</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Приозёрный" type="checkbox">
  //                           <span>Приозёрный</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Проспект_Дзержинского" type="checkbox">
  //                           <span>Проспект Дзержинского</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Просторный_ж/м" type="checkbox">
  //                           <span>Просторный ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="пос._Геологов" type="checkbox">
  //                           <span>пос. Геологов</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Р</span>
  //                         <label class="module__label">
  //                           <input name="Радиостанция" type="checkbox">
  //                           <span>Радиостанция</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Родники_(6-й_мкр)" type="checkbox">
  //                           <span>Родники (6-й мкр)</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">С</span>
  //                         <label class="module__label">
  //                           <input name="Сад_Дзержинского" type="checkbox">
  //                           <span>Сад Дзержинского</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Сад_Кирова" type="checkbox">
  //                           <span>Сад Кирова</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Сад_Мичуринцев" type="checkbox">
  //                           <span>Сад Мичуринцев</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Северный_пос." type="checkbox">
  //                           <span>Северный пос.</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Северо-Чемской_ж/м" type="checkbox">
  //                           <span>Северо-Чемской ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Снегири_(5-й_мкр)" type="checkbox">
  //                           <span>Снегири (5-й мкр)</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Совсибирь" type="checkbox">
  //                           <span>Совсибирь</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Станиславский_ж/м" type="checkbox">
  //                           <span>Станиславский ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Сто_домов" type="checkbox">
  //                           <span>Сто домов</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Стрижи" type="checkbox">
  //                           <span>Стрижи</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Студенческий" type="checkbox">
  //                           <span>Студенческий</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Сухарная" type="checkbox">
  //                           <span>Сухарная</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Сухой_лог" type="checkbox">
  //                           <span>Сухой лог</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Т</span>
  //                         <label class="module__label">
  //                           <input name="ТРЦ_АУРА" type="checkbox">
  //                           <span>ТРЦ АУРА</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Телецентр" type="checkbox">
  //                           <span>Телецентр</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Тихвинский" type="checkbox">
  //                           <span>Тихвинский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Тихий_центр" type="checkbox">
  //                           <span>Тихий центр</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Троллейный_ж/м" type="checkbox">
  //                           <span>Троллейный ж/м</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Ф</span>
  //                         <label class="module__label">
  //                           <input name="Фабричный" type="checkbox">
  //                           <span>Фабричный</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Фрунзенский" type="checkbox">
  //                           <span>Фрунзенский</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Х</span>
  //                         <label class="module__label">
  //                           <input name="Хилокский" type="checkbox">
  //                           <span>Хилокский</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Ц</span>
  //                         <label class="module__label">
  //                           <input name="ЦУМ" type="checkbox">
  //                           <span>ЦУМ</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Центр" type="checkbox">
  //                           <span>Центр</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Центр_(Красный_проспект)" type="checkbox">
  //                           <span>Центр (Красный проспект)</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Центральная_Пермовайка" type="checkbox">
  //                           <span>Центральная Пермовайка</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Ц</span>
  //                         <label class="module__label">
  //                           <input name="Челюскинский_ж/м" type="checkbox">
  //                           <span>Челюскинский ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Чистая_слобода" type="checkbox">
  //                           <span>Чистая слобода</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Ш</span>
  //                         <label class="module__label">
  //                           <input name="Шевченский" type="checkbox">
  //                           <span>Шевченский</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Шлюз" type="checkbox">
  //                           <span>Шлюз</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Э</span>
  //                         <label class="module__label">
  //                           <input name="Энергостроителей" type="checkbox">
  //                           <span>Энергостроителей</span>
  //                         </label>
  //                       </div>
  //                       <div class="microdistrict-list">
  //                         <span class="microdistrict-title">Ю</span>
  //                         <label class="module__label">
  //                           <input name="Юбилейный_(4-й_мкр)" type="checkbox">
  //                           <span>Юбилейный (4-й мкр)</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Юго-Западный_ж/м" type="checkbox">
  //                           <span>Юго-Западный ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Южно-Чемской_ж/м" type="checkbox">
  //                           <span>Южно-Чемской ж/м</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Южный_(Ленинский_р-н)" type="checkbox">
  //                           <span>Южный (Ленинский р-н)</span>
  //                         </label>
  //                         <label class="module__label">
  //                           <input name="Южный_(Первомайский_р-н)" type="checkbox">
  //                           <span>Южный (Первомайский р-н)</span>
  //                         </label>
  //                       </div>
  //                     </div>
  //                   </div>
  //               </div>
  //               <div class="module__footer district__footer">
  //                 <button class="module__save" type="button">Сохранить</button>
  //                 <button class="module__reset" type="reset"><span>Очистить</span></button>
  //               </div>
  //             </form>
  //           </div>`
  // }
  districtLayout(){
    const currentY = window.pageYOffset;

    return `<div style="top: ${currentY}" class="module">
              <form class="module__form district__form">
                <div class="district">
                  <span data-name="close" class="btn-close"></span> 
                    <div class="district__left">                      
                      <div class="module__header"> 
                        <h2 class="module__head">Районы</h2>
                        <div class="district__search-wrap">
                          <input class="district__search" type="text">
                          <div class="district__hide visible"></div>
                        </div>
                      </div>
                      <div class="district__wrap">
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
                          <input name="kalininskiy" type="checkbox" value="Калиниский" ${this.districtValue.kalininskiy ? 'checked ' : ''}>
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
                      </div>   
                    </div>
                </div>
                <div class="module__footer district__footer"> 
                  <button data-form="save" class="module__save">Сохранить</button>
                  <button class="module__reset" data-form="clear">Очистить</button>
                </div>
              </form>
            </div>`
  }
  districtHandler(){
    const module = document.querySelector('.module');
    const searchInput = document.querySelector('.district__search');
    const allCheckedInputs = module.querySelectorAll(`INPUT[type='checkbox']`);

    document.body.addEventListener('keydown', event => {
      if (event.key === 'Escape'){
        const bodyDom = document.querySelector('body');
        bodyDom.removeAttribute("style");
        module.remove();
        document.body.removeEventListener('keydown');
      }
    })

    module.addEventListener('click', event => {
      if (event.target.dataset.name === 'close') {
        const bodyDom = document.querySelector('body');
        bodyDom.removeAttribute("style");
        module.remove();
      } else if (event.target.dataset.form === 'save'){
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

        const bodyDom = document.querySelector('body');
        bodyDom.removeAttribute("style");
        module.remove();
        this.showChangeMetroDistrict();
      } else if (event.target.dataset.form === 'clear'){
        event.preventDefault();
        for (let checkbox of allCheckedInputs){
          checkbox.checked = false;
        }
        this.districtArray = [];
      } else if (event.target.dataset.district){
        const clickName = event.target.dataset.district;

        for (let item of allCheckedInputs){
          if (item.name === clickName){
            item.click();
          }
        }
        searchInput.value = '';
        this.filter = [];
        this.isVisibleSearch();
        searchInput.focus();
      } else {
        searchInput.value = '';
        this.filter = [];
        this.isVisibleSearch();
      }
    });

    searchInput.addEventListener('keyup', event => {
      this.districtFilter(event.target.value);
    })

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

  extraOpen(){
    const bodyDom = document.querySelector('body');
    bodyDom.setAttribute("style", "overflow-y:hidden;");
    bodyDom.insertAdjacentHTML('afterbegin', this.extraOpenLayout());
    this.extraOpenHandler();
  }
  extraOpenLayout(){
    const currentY = window.pageYOffset;
    return `<div style="top: ${currentY}"  class="module"> 
                <form class="module__form" autocomplete="off"> 
                  <div class="module__header metro__header"> 
                      <h2 class="module__head">Дополнительные фильтры</h2>
                      <span data-name="close" class="btn-close"></span>
                  </div>
                  <div class="extra"> 
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
                          <input class="row__radio" id="Adjacent" name="reqTypeofLayout" type="radio" value="adjacent" 
                          ${this.objectFilter.reqTypeofLayout === 'adjacent' ? 'checked' : ''}>
                          <label class="row__label" for="Adjacent">Смежная</label>
                        </div>
                        <div class="row__toggle"> 
                          <input class="row__radio" id="Isolated" name="reqTypeofLayout" type="radio" value="isolated" 
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
                          <input class="row__radio" id="Combined" name="reqBathroomType" type="radio" value="combined" 
                          ${this.objectFilter.reqBathroomType === 'combined' ? 'checked' : ''}>
                          <label class="row__label" for="Combined">Совмещенный</label>
                        </div>
                        <div class="row__toggle"> 
                          <input class="row__radio" id="Separated" name="reqBathroomType" type="radio" value="separated" 
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
                          ${this.objectFilter.reqGalleryAvailability ? '' : 'checked'}>
                          <label class="row__label" for="nothingGallery">Неважно</label>
                        </div>
                        <div class="row__toggle"> 
                          <input class="row__radio" id="Balcony" name="reqGalleryAvailability" type="radio" value="balcony" 
                          ${this.objectFilter.reqGalleryAvailability === 'balcony' ? 'checked' : ''}>
                          <label class="row__label" for="Balcony">Балкон</label>
                        </div>
                        <div class="row__toggle"> 
                          <input class="row__radio" id="Loggia" name="reqGalleryAvailability" type="radio" value="loggia" 
                          ${this.objectFilter.reqGalleryAvailability === 'loggia' ? 'checked' : ''}>
                          <label class="row__label" for="Loggia">Лоджия</label>
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
                          <input class="row__radio" id="NoRenovation" name="reqRepairStatus" type="radio" value="noRenovation" 
                          ${this.objectFilter.reqRepairStatus === 'noRenovation' ? 'checked' : ''}>
                          <label class="row__label" for="NoRenovation">Без ремонта</label>
                        </div>
                        <div class="row__toggle"> 
                          <input class="row__radio" id="Cosmetic" name="reqRepairStatus" type="radio" value="cosmetic" 
                          ${this.objectFilter.reqRepairStatus === 'cosmetic' ? 'checked' : ''}>
                          <label class="row__label" for="Cosmetic">Косметический</label>
                        </div>
                        <div class="row__toggle"> 
                          <input class="row__radio" id="Renovation" name="reqRepairStatus" type="radio" value="renovation" 
                          ${this.objectFilter.reqRepairStatus === 'renovation' ? 'checked' : ''}>
                          <label class="row__label" for="Renovation">Евроремонт</label>
                        </div>
                        <div class="row__toggle"> 
                          <input class="row__radio" id="Designer" name="reqRepairStatus" type="radio" value="designer" 
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
                          value="${this.objectFilter.reqFloor ? this.objectFilter.reqFloor[0] ? this.objectFilter.reqFloor[0]  !== 'null' : '' : ''}">
                          <input name="reqFloor" class="row__input row__input_right" type="text" placeholder="до" autocomplete="off" 
                          value="${this.objectFilter.reqFloor ? this.objectFilter.reqFloor[1] ? this.objectFilter.reqFloor[1]  !== 'null' : '' : ''}">
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
                          <input class="row__radio" id="old" name="typeObject" type="radio" value="old" 
                          ${this.objectFilter.typeObject === 'old' ? 'checked' : ''}>
                          <label class="row__label" for="old">Вторичка</label>
                        </div>
                        <div class="row__toggle"> 
                          <input class="row__radio" id="new" name="typeObject" type="radio" value="new" 
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
                  </div>
                </form>
            </div>`
  }
  extraOpenHandler(){
    const module = document.querySelector('.module');

    document.body.addEventListener('keydown', event => {
      if (event.key === 'Escape'){
        const bodyDom = document.querySelector('body');
        bodyDom.removeAttribute("style");
        module.remove();
        document.body.removeEventListener('keydown');
      }
    })

    module.addEventListener('click', event => {
      if (event.target.dataset.name === 'close'){
        const bodyDom = document.querySelector('body');
        bodyDom.removeAttribute("style");
        module.remove();
      } else if (event.target.dataset.extra === 'save'){
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
        const bodyDom = document.querySelector('body');
        bodyDom.removeAttribute("style");
        module.remove();
        console.log(this.objectFilter)
      }
    })
  }

  checkCurrentElem(){
    if (this.currentElem){
      this.currentElem.classList.add('visible')
      this.currentElem = '';
    }
  }
}

const address = new AddressHandler();
address.init();

const priceLeft = document.querySelector('.price_left');
priceLeft.addEventListener('keyup', event => {
  let leftValue = event.target.value.split(' ').join('');
  event.target.value = leftValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
})

const priceRight = document.querySelector('.price_right');
priceRight.addEventListener('keyup', event => {
  let leftValue = event.target.value.split(' ').join('');
  event.target.value = leftValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
})