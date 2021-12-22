<?php
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/iHelper.php");

CJSCore::Init();

if($USER->IsAuthorized()){
$APPLICATION->ShowHead();
}
mb_internal_encoding("UTF-8");
$ActiveUser = CUser::GetLogin();
$ActiveUserID = CUser::GetID();
\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.notification");
\Bitrix\Main\UI\Extension::load("ui.buttons.icons");
\Bitrix\Main\UI\Extension::load("ui.tooltip");

CJSCore::Init(['ui','sidepanel','jquery2', 'im']);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
<script>
    let login ='<? echo($ActiveUser); ?>';
    let loginID ='<? echo($ActiveUserID); ?>';
</script>
<script>
    BX24.ready(async () => {
    console.log('Heght' + document.scrollHeight);
        const h = window.screen.availHeight;
        BX24.resizeWindow(window.innerWidth,  h, () => {} );
        })
</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../toolsForProject/chief-slider/chief-slider.css">
    <script src="../toolsForProject/chief-slider/chief-slider.js"></script>
    <link rel="stylesheet" href="scss-css/style.css">
    <title>customerService</title>
</head>
<body>
<div class="main">
    <div class="header">
        <div class="inJob">
            <input class="inJob__checkbox" id="inJob" name="inJob" type="checkbox">
            <label class="inJob__label" for="inJob">Работаю</label>
            <div class="inJob__next">
                <span class="inJob__text">Следующий</span>
                <div class="inJob__load"></div>
            </div>
        </div>
    </div>
    <div class="left">
        <div class="client"></div>
        <div class="control">
            <div class="control__wrap">
                <span data-add="task" class="subtitle subtitle__btn">Добавить задачу/заметку для Риелтора</span>
            </div>
        </div>
    </div>
    <div class="object"></div>
</div>
<script src="js/script.js"></script>
</body>
</html>