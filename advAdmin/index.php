<?php
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/iHelper.php");

CJSCore::Init();

if($USER->IsAuthorized()){
    $APPLICATION->ShowHead();}
mb_internal_encoding("UTF-8");
$ActiveUser = CUser::GetLogin();
\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.notification");
\Bitrix\Main\UI\Extension::load("ui.buttons.icons");
\Bitrix\Main\UI\Extension::load("ui.tooltip");

CJSCore::Init(['ui','sidepanel','jquery2', 'im']);
?>

<!DOCTYPE html>
<html lang="ru">
<head>
<script src="//api.bitrix24.com/api/v1/"></script>
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
    <script src="//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.min.js"></script>
    <link rel="stylesheet" href="scss-css/style.css">
    <title>Moderator</title>
</head>
<body>
<div class="main"></div>
<script src="js/script.js"></script>
</body>
</html>