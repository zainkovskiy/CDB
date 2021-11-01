<?php
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/CDBconnection.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/iHelper.php");

mb_internal_encoding("UTF-8");
header("Content-Type: application/json; charset=utf-8");
$rawDATA = file_get_contents('php://input');
$inputJSON = json_decode(urldecode($rawDATA), true);

$user = $inputJSON['client'];
$action = $inputJSON['action'];

if ($action == 'authorization') {
	$dbResult = CUser::GetByLogin($user);
	
	if (is_null($dbResult) || $dbResult == '' || $dbResult == ' '){
		$scriptRes = Array ('result' => 'error');
	} else {
		//Достаем юзера
		$arUser = $dbResult->Fetch();
		$scriptRes = Array ('result' => 'ok',
							'verified' => (int)$arUser['ID'],
							'name' => trim($arUser['LAST_NAME'].' '.$arUser['NAME']));
		
		//Записываем посещение в БД
		$linkCDB = CDBconnection::get();
		$histroryStat = "INSERT into centralnoe_db_realty.objhistoryregister (idclast,typeEvent,sourceEvent) VALUES ('CDBMobile', 'Посещение мобильной СРМ', '".$user."')";
		mysqli_query($linkCDB, $histroryStat);
		$linkCDB ->close();
	}
	echo(json_encode($scriptRes, true));
} else {
	Exit();
}


?>