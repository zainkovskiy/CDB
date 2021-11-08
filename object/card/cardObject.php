<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/iHelper.php");



CJSCore::Init();


\Bitrix\Main\UI\Extension::load("ui.forms");
\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.hint");
CJSCore::Init(['ui','sidepanel','jquery2']);

$arrStr = Null;

foreach ($_GET as $key => $value) {

  $arrStr = $arrStr.$key.'='.$value.'&';
  // code...
}
$APPLICATION->IncludeComponent(
  'bitrix:crm.control_panel',
  '',
  array(
       'ACTIVE_ITEM_ID' => 'DEAL',
  )
);

$arrStr = '?'.$arrStr;

?>
<script>
    document.querySelector('HTML').setAttribute('style', 'overflow: hidden;');
</script>
<div style="padding:0px;">
  <iframe src="https://crm.centralnoe.ru/objectCard/object/<?echo($arrStr);?>" width="100%" style="border: none">

 </iframe>
</div>
<script>
    const heightWindow = window.innerHeight;
    document.querySelector('iframe').setAttribute('height', `${heightWindow}px`);
</script>