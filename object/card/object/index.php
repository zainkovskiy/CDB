<?php

$arrParams = $_GET;

$arrParams['reqNumber'] = $arrParams['id'];

header("Location: https://crm.centralnoe.ru/cardObject/?".http_build_query($arrParams));
?>
<!DOCTYPE html>
<html lang="ru">
<head>
<script>
    let source ='<? echo($source); ?>';s
    let UID ='<? echo($id); ?>';
    let login ='<? echo($ActiveUser); ?>';
    let loginID ='<? echo($ActiveUserID); ?>';
    let deal = '<? echo($deal); ?>';
</script>
<script src="//api.bitrix24.com/api/v1/"></script>
<script>
    BX24.ready(async () => {
    console.log('Heght' + document.scrollHeight);
        const h = window.screen.availHeight;
        BX24.resizeWindow(window.innerWidth,  h, () => {} );
        })
</script>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script>
    <script src="https://api-maps.yandex.ru/2.1/?apikey=ваш API-ключ&lang=ru_RU" type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="../../../toolsForProject/chief-slider/chief-slider.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.3.2/dist/chart.min.js"></script>
    <link rel="stylesheet" href="../../../toolsForProject/chief-slider/chief-slider.css">
    <link rel="stylesheet" href="style.css?s=<?=rand(0, 1000000)?>">
    <link rel="stylesheet" href="../main.css?s=<?=rand(0, 1000000)?>">
    <link rel="stylesheet" href="../select.css?s=<?=rand(0, 1000000)?>">
    <link rel="stylesheet" href="media.css?s=<?=rand(0, 1000000)?>">
    <title>Объект</title>
</head>
<body>
   <?php echo('<div class="main container"></div>'); ?>
   <?php echo('<script src="script.js?'.chr(rand(65,90)).chr(rand(65,90)).'='.rand(0,1000000).'"></script>'); ?>
</body>
</html>
</html>