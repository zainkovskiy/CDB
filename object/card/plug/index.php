<?php
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CJSCore::Init();

if($USER->IsAuthorized()){
$APPLICATION->ShowHead();}
mb_internal_encoding("UTF-8");
$source = $_GET['source'];
$id = $_GET['id'];
$ActiveUser = CUser::GetLogin();
\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.notification");
\Bitrix\Main\UI\Extension::load("ui.buttons.icons");
?>
<!doctype html>
<html lang="en">
<head>
<script>
    let source ='<? echo($source); ?>';
    let objectUID ='<? echo($id); ?>';
    let login ='<? echo($ActiveUser); ?>';
    let deal = '<? echo($_GET['IDDEAL']); ?>';
</script>
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
  <link rel="stylesheet" href="style.css?s=<?=rand(0, 1000000)?>">
  <link rel="stylesheet" href="../main.css?s=<?=rand(0, 1000000)?>">
  <title>ДОУ</title>
</head>
<body>
  <?PHP echo('<div class="container"></div>'); ?>
  <?php echo('<script src="script.js?'.chr(rand(65,90)).chr(rand(65,90)).'='.rand(0,1000000).'"></script>'); ?>
</body>
</html>