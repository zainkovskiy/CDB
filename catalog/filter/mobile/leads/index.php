<?php
    require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
    $ActiveUserID = CUser::GetID();
?>

<!doctype html>
<html lang="en">
<head>
<script>
    let loginID ='<? echo($ActiveUserID); ?>';
</script>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="../select.css">
    <title>leads</title>
</head>
<body>
<div class="page"></div>

<script src="script.js"></script>
</body>
</html>