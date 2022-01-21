<? require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="style.css">
    <title>newBuildingSeeker</title>
</head>
<body>
<div class="container">
    <table class="table">
        <thead>
            <td><div class="table__td-header">Застройщик <input class="table__input" type="text" autocomplete="off" name="developer"></div></td>
            <td><div class="table__td-header">ЖК</div></td>
            <td><div class="table__td-header">Риелтор</div></td>
            <td><div class="table__td-header">Тип</div></td>
            <td><div class="table__td-header">Дата создания <input class="table__input" type="date" autocomplete="off" name="dataCreate"></div></td>
            <td><div class="table__td-header">Дата отправки</div></td>
        </thead>
        <tbody></tbody>
    </table>
</div>
<script src="script.js"></script>
</body>
</html>