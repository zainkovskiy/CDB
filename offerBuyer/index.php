<?php
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/CDBconnection.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/iHelper.php");
//Подключаем REST
require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/crest.php");

$APPLICATION->SetTitle("objectReport 0.1");

mb_internal_encoding("UTF-8");
$selId = $_REQUEST['selId'];
$offer = $_REQUEST['offer'];
$client = $_REQUEST['client'];
?>

<!DOCTYPE html>
<html lang="ru">
<head>
<script>
    let selId = '<? echo($selId);?>';
    let numberOffer = '<? echo($offer);?>';
    let client = '<? echo($client);?>';
</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script src="https://api-maps.yandex.ru/2.1/?apikey=ваш API-ключ&lang=ru_RU" type="text/javascript"></script>
    <script src="chief-slider.js"></script>
    <link rel="stylesheet" href="chief-slider.css">
    <link rel="stylesheet" href="main.css?s=<?=rand(0, 1000000)?>">
    <link rel="stylesheet" href="style.css?s=<?=rand(0, 1000000)?>">
    <link rel="stylesheet" href="media.css?s=<?=rand(0, 1000000)?>">
    <link rel="icon" href="img/favicon.png" type="image/x-icon">
    <title>offer</title>
</head>
<body>
    <div class="main container"></div>
<script src="script.js?s=<?=rand(0, 1000000)?>"></script>
</body>
</html>
