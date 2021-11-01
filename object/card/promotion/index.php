<?php
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
  header("Last-Modified: " . gmdate("D, d M Y H:i:s")." GMT");
  header("Cache-Control: no-store,no-cache, must-revalidate");
  header("Cache-Control: post-check=0,pre-check=0", false);
  header("Cache-Control: max-age=0", false);
  header("Pragma: no-cache");
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CJSCore::Init();

if($USER->IsAuthorized()){
$APPLICATION->ShowHead();}
mb_internal_encoding("UTF-8");
$source = $_GET['source'];
$id = $_GET['id'];
$ActiveUser = CUser::GetLogin();
\Bitrix\Main\UI\Extension::load("ui.buttons");

?>
<!DOCTYPE html>
<html lang="ru">
<head>
  <script>
    let source ='<? echo($source); ?>';
    let UID ='<? echo($id); ?>';
    let login ='<? echo($ActiveUser); ?>';
    let deal = '<? echo($_GET['IDDEAL']); ?>';
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
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <link rel="stylesheet" href="../main.css?s=<?=rand(0, 1000000)?>">
  <link rel="stylesheet" href="../select.css?s=<?=rand(0, 1000000)?>">
  <link rel="stylesheet" href="style.css?s=<?=rand(0, 1000000)?>">
  <link rel="stylesheet" href="media.css?s=<?=rand(0, 1000000)?>">
  <title>Реклама</title>
</head>
<body>
<div class="promotion container"></div>
<script src="script.js"></script>

</body>
</html>