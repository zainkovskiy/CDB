<?php header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
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
$source = $_GET['action'];
$id = $_GET['id'];
$ActiveUser = CUser::GetLogin();
\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.notification");
\Bitrix\Main\UI\Extension::load("ui.buttons.icons");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <script>
      let action ='<? echo($source); ?>';
      let UID ='<? echo($id); ?>';
      let login ='<? echo($ActiveUser); ?>';
    </script>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="../main.css?s=<?=rand(0, 1000000)?>">
    <link rel="stylesheet" href="style.css?s=<?=rand(0, 1000000)?>">
    <title>applicationForOneself</title>
</head>
<body>
    <?php echo('<div class="application"></div>'); ?>
   <?php echo('<script src="script.js?G='.rand(0,1000000).'"></script>'); ?>
</body>
</html>