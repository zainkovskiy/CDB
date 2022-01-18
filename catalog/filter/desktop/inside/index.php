<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");


CJSCore::Init();

$APPLICATION->SetTitle("Каталог недвижимости");
\Bitrix\Main\UI\Extension::load("ui.forms");
\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.hint");
CJSCore::Init(['ui','sidepanel','jquery2']);


$APPLICATION->IncludeComponent(
  'bitrix:crm.control_panel',
  '',
  array(
    'ID'             => 'CATALOG_CAN',
    'ACTIVE_ITEM_ID' => 'CATALOG_CAN',
  )
);

?>

<div style="padding:0px;">
  <iframe src="openCatalog.php" width="100%" height="700px" style="border: none">

 </iframe>

</div>