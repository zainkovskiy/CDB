<?
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
$APPLICATION->SetTitle("");
?>
<?
CJSCore::Init();
$ActiveUser = CUser::GetLogin();
$ActiveUserID = CUser::GetID();

$APPLICATION->ShowHead();

$APPLICATION->ShowHeadStrings();
$APPLICATION->ShowHeadScripts();
$APPLICATION->SetTitle("");

\Bitrix\Main\UI\Extension::load("ui.forms");
\Bitrix\Main\UI\Extension::load("ui.buttons");

CJSCore::Init(['ui','sidepanel','jquery2', 'im']);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
<script>
    let loginID ='<? echo($ActiveUserID); ?>';
</script>
<script src="//api.bitrix24.com/api/v1/"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="style.css?s=<?=rand(0, 1000000)?>">
    <title>newBuildingSeeker</title>
</head>
<body>
<div class="container" data-candy="s<?=rand(0, 1000000)?>">
    <!-- <div class="header"><span data-show="all">Показать все</span>
    <label class="switch">
      <input id="isShowAll" class="switch__open" type="checkbox">
      <span class="slider slider__main"></span>
    </label>
    </div> -->
    <table class="table">
        <thead>
            <td><div class="table__td-header">Сделка</div></td>
            <td><div class="table__td-header">Застройщик <input class="table__input" type="text" autocomplete="off" name="developer"></div></td>
            <td><div class="table__td-header">ЖК</div></td>
            <td><div class="table__td-header">Оплата</div></td>
            <td><div class="table__td-header">Клиент</div></td>
            <td><div class="table__td-header">Риелтор</div></td>
            <td><div class="table__td-header">Тип</div></td>
            <td><div class="table__td-header">Дата создания <input class="table__input" type="date" autocomplete="off" name="dataCreate"></div></td>
            <td><div class="table__td-header">Показать отправленные <input class="table__checkbox" type="checkbox" id="showAllCheck"><label class="table__label" for="showAllCheck"></label></div></td>
            <td><div class="table__td-header">Приняты застройщиком</div></td>
        </thead>
        <tbody></tbody>
    </table>
</div>
   <?php echo('<script src="script.js?G='.rand(0,1000000).'"></script>'); ?>
</body>
</html>