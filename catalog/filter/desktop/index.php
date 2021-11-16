<?PHP

// Catalog. Function MAIN
header('Content-Type: text/html; charset=UTF-8');
mb_internal_encoding("UTF-8");

require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

$rawDATA =  base64_decode(file_get_contents('php://input'));
$arrApplicationParams = json_decode($rawDATA, true);
$arrClients = json_encode($arrApplicationParams['dealClients'], true);

    if (!$arrClients) {
              $arrClients = '{}';
    }
// ИНИЦИАЛИЗАЦИЯ ОКРУЖЕНИЯ

CJSCore::Init();

if($USER->IsAuthorized()){
$APPLICATION->ShowHead();}

$userName = CUser::GetLogin();

if ($userName == 'mischenkoiv' || $userName == 'zainkovskiyaa' || $userName == 'osmanovnyu') {

} else {
  header('Location: https://crm.centralnoe.ru');
}

\Bitrix\Main\UI\Extension::load("ui.forms");
\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.hint");
CJSCore::Init(['ui','sidepanel','jquery2']);
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <script src="//api.bitrix24.com/api/v1/"> </script>
    <SCRIPT>
      // UID Текущего пользователя
      let currentUserId = '<? echo($arrApplicationParams['activeUserID']) ;?>';
      // Login текущего пользователя
      let currentUserLogin = '<? echo($arrApplicationParams['activeUserLogin']);?>';
      // Login владельца сделки
      let dealOwnerLogin = '<? echo($arrApplicationParams['dealOwnerLogin']);?>';
      // UID Владельца сделки
      let dealOwnerID = '<? echo($arrApplicationParams['dealOwnerID']);?>';
      // Категория сделки
      let dealCategory = '<? echo($arrApplicationParams['dealCategory']);?>';
      // Номер заявки
      let dealObject = '<? echo($arrApplicationParams['dealObject']);?>';
      // JSON c Клиентами сделки
      let dealClients = '<? echo($arrClients);?>';
        BX24.ready(async () => {
        console.log(window.screen.availHeight);
        console.log(window.innerHeight);
        const h = window.screen.availHeight - 100;
        BX24.resizeWindow(window.innerWidth, h, () => {} );
        });
    </SCRIPT>
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="style.css?s=<?=rand(0, 1000000)?>">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js?s=<?=rand(0, 1000000)?>"></script>
    <link href="https://cdn.jsdelivr.net/npm/suggestions-jquery@21.6.0/dist/css/suggestions.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/suggestions-jquery@21.6.0/dist/js/jquery.suggestions.min.js"></script>
    <script src="https://api-maps.yandex.ru/2.1/?apikey=9b339b12-4d97-4522-b2e5-da5a5da1c7f6&lang=ru_RU" type="text/javascript"></script>
    <title>searchObject</title>
</head>
<body>
<div class="container">
    <div class="methodical">
      <span>Как работать с каталогом?</span>
      <button data-info="catalog" class="ui-btn ui-btn-primary-dark">инфо</button>
    </div>
    <div class="search-form">
        <span class="search-form__title">Тип недвижимости</span>
        <div class="place">
            <span title="выберете регион" class="search-form__title place__text" data-region="reqRegion">Новосибирская область</span>
            <span class="place__icon"></span>
        </div>
        <span class="search-form__title">Комнаты</span>
        <span class="search-form__title">Цена в тыс. руб.</span>
        <span class="filter-clear" data-clear='filter'>Сбросить все фильтры</span>
        <div class="type">
            <input data-elem="check" class="start__input" name="reqTypeofRealty" type="text" value="Квартиры" autocomplete="new-password" readonly>
            <span class='start__input-arrow'></span>
            <div data-elem="check" class="type__wrap reqTypeofRealty__block visible">
                <span data-input="reqTypeofRealty" data-value="Квартиры" data-elem="check" class="type__select">Квартиры</span>
                <span data-input="reqTypeofRealty" data-value="Комнаты" data-elem="check" class="type__select">Комнаты</span>
                <span data-input="reqTypeofRealty" data-value="Дома, коттеджи, дачи" data-elem="check" class="type__select">Дома, коттеджи, дачи</span>
                <span data-input="reqTypeofRealty" data-value="Земля" data-elem="check" class="type__select">Земля</span>
                <span data-input="reqTypeofRealty" data-value="Гаражи, парковки" data-elem="check" class="type__select">Гаражи, парковки</span>
            </div>
        </div>
        <div class="address">
            <input id='address' data-elem="check" class="start__input" type="text" name="address" placeholder="Район, мкр, улица, метро" autocomplete="new-password">
            <span data-input="clear" data-name="address" class='start__input-arrow address-x'></span>
        </div>
        <div class="room">
            <input data-elem="check" class="start__input" name="reqRoomCount" type="text" placeholder="Любое" autocomplete="new-password" readonly>
            <span data-input="clear" data-name="reqRoomCount" class='start__input-arrow reqRoomCount-x'></span>
            <div data-elem="check" class="room__check reqRoomCount__block visible">
                <label data-elem="check" class="room__label" for="one">
                    <input data-input="reqRoomCount" data-room="1-комнатные" data-elem="check" id="one" type="checkbox" value="1">
                    <span data-elem="check" class="room__text">1-комнатные</span>
                </label>
                <label data-elem="check" class="room__label" for="two">
                    <input data-input="reqRoomCount" data-room="2-комнатные" data-elem="check" id="two" type="checkbox" value="2">
                    <span data-elem="check" class="room__text">2-комнатные</span>
                </label>
                <label data-elem="check" class="room__label" for="three">
                    <input data-input="reqRoomCount" data-room="3-комнатные" data-elem="check" id="three" type="checkbox" value="3">
                    <span data-elem="check" class="room__text">3-комнатные</span>
                </label>
                <label data-elem="check" class="room__label" for="for">
                    <input data-input="reqRoomCount" data-room="4-комнатные" data-elem="check" id="for" type="checkbox" value="4">
                    <span data-elem="check" class="room__text">4-комнатные</span>
                </label>
                <label data-elem="check" class="room__label" for="lot">
                    <input data-input="reqRoomCount" data-room="Многокомнатные" data-elem="check" id="lot" type="checkbox" value="5">
                    <span data-elem="check" class="room__text">Многокомнатные</span>
                </label>
            </div>
        </div>
        <div class="price">
            <input data-elem="check" class="start__input" name="reqPrice" type="text" placeholder="Любая" autocomplete="new-password" readonly>
            <span data-input="clear" data-name="reqPrice" class='start__input-arrow reqPrice-x'></span>
            <div data-elem="check" class="price__wrap-all reqPrice__block visible">
                <div data-elem="check" class="price__wrap-input">
                    <input data-input="reqPrice" data-elem="check" class="price__input price_left" name="from" type="text" placeholder="От">
                    <span data-elem="check">&#8212;</span>
                    <input data-input="reqPrice" data-elem="check" class="price__input price_right" name="to" type="text" placeholder="До">
                </div>
            </div>
        </div>
        <div class="buttons">
                  <div class="source__wrap">
                    <input checked class="source__input" name="1c" id="centr" type="checkbox">
                    <label class="source__label source__label-centr" for="centr"></label>
                  </div>
                  <div class="source__wrap">
                    <input class="source__input" name="pars" id="all" type="checkbox">
                    <label class="source__label source__label-all" for="all"></label>
                  </div>
              <div class='btn__wrap-extra'>
              <button title="Еще фильтры" class="btn btn-setting" data-name="extra"></button>
              <span class='count count-extra visible'></span>
            </div>
            <button title="Поиск" class="ui-btn btn-search" data-name="search">найти</button>
        </div>
    </div>
    <div class='setting'>
        <div class="sort">
            <span class="search-form__title">Выберете сортировку</span>
            <input data-elem="check" class="start__input" name='sort' value="Сортировка по умолчанию" readonly>
            <span class='start__input-arrow start__input-arrow_sort'></span>
            <div data-elem="check" class="sort__wrap sort__block visible">
                <span data-action="default" data-input="sort" data-value="Сортировка по умолчанию" data-elem="check" class="type__select">Сортировка по умолчанию</span>
                <span data-action="newOld" data-input="sort" data-value="Дата публикации от новых к старым" data-elem="check" class="type__select">Дата публикации от новых к старым</span>
                <span data-action="priceLow" data-input="sort" data-value="Цена от низкой к высокой" data-elem="check" class="type__select">Цена от низкой к высокой</span>
                <span data-action="priceHigh" data-input="sort" data-value="Цена от высокой к низкой" data-elem="check" class="type__select">Цена от высокой к низкой</span>
                <span data-action="areaLow" data-input="sort" data-value="Площадь от меньшей к большей" data-elem="check" class="type__select">Площадь от меньшей к большей</span>
                <span data-action="areaHigh" data-input="sort" data-value="Площадь от большей к меньшей" data-elem="check" class="type__select">Площадь от большей к меньшей</span>
                <span data-action="wordFirst" data-input="sort" data-value="Адрес от А до Я" data-elem="check" class="type__select">Адрес от А до Я</span>
                <span data-action="wordLast" data-input="sort" data-value="Адрес от Я до А" data-elem="check" class="type__select">Адрес от Я до А</span>
            </div>
        </div>
        <p class='quantity'></p>
        <div class='basket'>
            <button title="Карта" class="btn btn-map" data-name="map"></button>
            <button title="Корзина" data-elem="check" class="btn btn-basket" data-name="basket"></button>
            <button title="Сохраненные фильтры" class="btn btn-story" data-name="story"></button>
            <span class='count count-basket visible'></span>
            <div data-elem="check" class="basket__wrap basket__block visible">
                <div data-elem="check" class='basket__items'>

                </div>
                <div class='basket__btn-wrap'>
                    <button data-elem="check" class="ui-btn" data-basket="save">сохранить</button>
                    <button data-elem="check" class="ui-btn ui-btn-danger-dark" data-basket="clear">очистить</button>
                </div>
            </div>
        </div>
    </div>
    <div class='pagination visible'></div>
    <div class="map__wrapper visible">
        <div id="map"></div>
        <div class="map__right"></div>
    </div>
    <div class='cards'>
    </div>
    <div class='pagination last-elem visible'></div>
</div>
<script src="script.js?s=<?=rand(0, 1000000)?>"></script>
</body>
</html>