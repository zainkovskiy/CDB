<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

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
<script src="//api.bitrix24.com/api/v1/"></script>
<div style="padding:0px;">
  <iframe class="iframe__object" src="https://crm.centralnoe.ru/CDB/object/card/object/<?echo($arrStr);?>&DOMAIN=crm.centralnoe.ru&PROTOCOL=1&LANG=ru&APP_SID=85f058f87260c1b15d0cecac7d8d8062" width="100%" style="border: none">

 </iframe>
</div>
<script>
    const heightWindow = window.innerHeight;
    document.querySelector('.iframe__object').setAttribute('height', `${heightWindow}px`);
</script>