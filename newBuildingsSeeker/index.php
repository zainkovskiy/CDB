<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");


CJSCore::Init();

$APPLICATION->SetTitle("Новостройки");
\Bitrix\Main\UI\Extension::load("ui.forms");
\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.hint");
CJSCore::Init(['ui','sidepanel','jquery2']);


$APPLICATION->IncludeComponent(
'bitrix:crm.control_panel',
'',
array(
'ID'             => 'CENTR_DB',
'ACTIVE_ITEM_ID' => 'CENTR_DB',
)
);

?>

<div style="padding:0px;">
    <script src="//api.bitrix24.com/api/v1/"></script>
    <iframe src="layout.php" width="100%" height="700px" style="border: none">

    </iframe>

</div>
