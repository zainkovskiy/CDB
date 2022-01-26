<? require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="style.css?s=<?=rand(0, 1000000)?>">
    <title>objectSeeker</title>
</head>
<body>
<div class="main" data-candy="s<?=rand(0, 1000000)?>">
    <div class="container">
        <div class="search">
            <div class="search__wrap">
                <span class="search__title">Заявка</span>
                <input class="search__input" type="text" autocomplete="off" name="reqNumber">
            </div>
            <div class="search__wrap">
                <span class="search__title">Сделка</span>
                <input class="search__input" type="text" autocomplete="off" name="dealNumber">
            </div>
            <div class="search__wrap">
                <span class="search__title">Адресс</span>
                <input class="search__input" type="text" autocomplete="off" name="address">
            </div>
            <button type="submit" class="search__btn">найти</button>
        </div>
        <div class="table-field">
            <table class="table">
                <thead>
                    <td>Заявка</td>
                    <td>Сделка</td>
                    <td>Адрес</td>
                    <td>Риелтор</td>
                </thead>
            </table>
        </div>
    </div>
</div>
   <?php echo('<script src="script.js?G='.rand(0,1000000).'"></script>'); ?>
</body>
</html>