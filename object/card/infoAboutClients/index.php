<?php
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CJSCore::Init();

if($USER->IsAuthorized()){
$APPLICATION->ShowHead();}
mb_internal_encoding("UTF-8");
$source = $_GET['action'];
$id = $_GET['id'];
$contact = $_GET['contact'];
$ActiveUser = CUser::GetLogin();
\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.notification");
\Bitrix\Main\UI\Extension::load("ui.buttons.icons");

CJSCore::Init(['ui','sidepanel','jquery2']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<script>
    let UID ='<? echo($id); ?>';
    let login ='<? echo($ActiveUser); ?>';
</script>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="style.css?s=<?=rand(0, 1000000)?>">
    <title>infoAboutClients</title>
</head>
<body>
   <?php echo('<div class="form"></div>'); ?>
   <?php echo('<script src="script.js?G='.rand(0,1000000).'"></script>'); ?>
</body>
</html>