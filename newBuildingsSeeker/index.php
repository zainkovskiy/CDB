<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");


CJSCore::Init();

$APPLICATION->SetTitle("Уведомления и брони");
\Bitrix\Main\UI\Extension::load("ui.forms");
\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.hint");
CJSCore::Init(['ui','sidepanel','jquery2']);
?>

<div style="padding:0px;">
    <script src="//api.bitrix24.com/api/v1/"></script>
    <iframe src="layout.php" width="100%" height="700px" style="border: none">

    </iframe>

</div>
