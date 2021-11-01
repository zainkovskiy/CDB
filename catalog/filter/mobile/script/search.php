<?php

require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/CDBconnection.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/dealincom/class/iHelper.php");

mb_internal_encoding("UTF-8");
header("Content-Type: application/json; charset=utf-8");
$rawDATA = file_get_contents('php://input');
$inputJSON = json_decode(urldecode($rawDATA), true);

$action = $inputJSON['action'];


function getSQLStatement($trasferObj){
 		//if ($trasferObj['action'] == 'get'){
 			//Формирование строки для 1с
 			if (array_search('1c', $trasferObj['object']['source'])){
 				if (count($trasferObj['object']['type']) == 5 || count($trasferObj['object']['type']) == 0){

 				} else {
 						$typeObjStat = '';
 						foreach ($trasferObj['object']['type'] as $typeObj) {
 							switch ($typeObj) {
 								case 'app':
 									$tmpS = "'Квартира' , 'Переуступка ДДУ' , 'Новостройка (от застройщика)'";
 								break;
 								
 								case 'room':
 									$tmpS = "'Комната'";
 								break;

 								case 'house':
 									$tmpS = "'Дом'";
 								break;

 								case 'ground':
 									$tmpS = "'Земельный участок'";
 								break;

 								case 'garage':
 									$tmpS = "'Гараж'";
 								break;
 							}
 						if ($typeObj == "") {
								    		$typeObjStat = " reqTypeofRealty IN (".$tmpS;
								    	} else {
								    		$typeObjStat = $typeObjStat." , ".$tmpS;
								    	}
 						}
 					$typeObj = $typeObj.") ";

 				}
 			}
 			//Конец формирование строки по типу недвижимости

 			if (count($trasferObj['object']['price']) > 0){
 				//Строка по ценнику
 				$PriceObjStat = "reqPrice BETWEEN ".$trasferObj['object']['price'][0]." AND ".$trasferObj['object']['price'][1];

 			}
 			//Конец формирование строки по ценнику


 			if (count($trasferObj['object']['area']) > 0){
 				//Строка по Площади
 				$AreaObjStat = "reqFlatTotalArea BETWEEN ".$trasferObj['object']['area'][0]." AND ".$trasferObj['object']['area'][1];
 			}

 			//Конец формирование строки по площади


 			if (count($trasferObj['object']['floors']) > 0){
 				//Строка по Этажу
 				$FloorObjStat = "reqFloor BETWEEN ".$trasferObj['object']['floors'][0]." AND ".$trasferObj['object']['floors'][1];
 			}

 			//Конец формирование строки по этажу


 			//Строка по комнатности
 			if (count($trasferObj['object']['rooms']) > 0){
 				$countRooms = "";
 				foreach ($trasferObj['object']['rooms'] as $valueRooms) {
 					switch ($valueRooms){
    			    //Квартира
			        case '1':
			        		$tmpS = "'1'";
			        break;
			        //Комната
			        case '2':
			        		$tmpS = "'2'";
			        break;
			        //Дом коттедж дача
			        case '3':
			        		$tmpS = "'3'";
			        break;
			        //Земля
			        case '4':
			        		$tmpS = "'4'";
			        break;
			        //Гараж
			        case '5':
			        		$tmpS = "'5','6','7'";
			        break;	                			        			        			       			        
    			}
    			if ($countRooms == "") {
							    		$countRooms = "reqRoomCount IN (".$tmpS;
							    	} else {
							    	$countRooms = $countRooms." , ".$tmpS;
							    	}

 				}
 				$countRooms = $countRooms." , NULL)";
 			}

 			//Поиск по метро

 			if (count($trasferObj['object']['metro']) > 0){
 				$objMetro = '';
 				foreach ($trasferObj['object']['metro'] as $valueMetro) {
 						if ($objMetro == "") {
								    		$objMetro = "clasteredhouse.nearMetro IN ('". $valueMetro."'";
								    	} else {
								    	$objMetro = $objMetro." , '".$tmpS."'";
						}
 				}

 				$objMetro = $objMetro.") AND clasteredhouse.metroDistance < ".($trasferObj['object']['metrodist']/1000);

 			}

 			//Конец формирования строки по метро

 			//Поиск по району

 			if (count($trasferObj['object']['block']) > 0) {
 				$areaObj = '';
 				foreach ($trasferObj['object']['block'] as $valueBlock) {
 					if ($areaObj == "") {
								    		$areaObj = "reqArea IN ('".$valueBlock."'";
								    	} else {
								    		$areaObj = $areaObj." , '".$valueBlock."'";
								    	}
 				}
 			$areaObj = $areaObj." , NULL) AND reqCity = 'Новосибирск'";	
 			}

 			//Конец формирования строки по району

 			//Строка УЛИЦА

 			if (strlen($trasferObj['object']['street']) > 0){
 				$streetStat = "reqStreet = '".$trasferObj['object']['street']."'";
 			}

 			//Номер дома
 			if (strlen($trasferObj['object']['housenumber']) > 0){
 				$HouseNumberStat = "reqHouseNumber = '".$trasferObj['object']['housenumber']."'";
 			}


 		//СОБИРАЕМ ИТОГОВЫЙ ФИЛЬТР
 		$statement1cWHERE = '';

 		if (strlen($typeObjStat) > 0){
 			$statement1cWHERE = $typeObjStat;
 		}

 		if (strlen($PriceObjStat) > 0){
			    if (strlen($statement1cWHERE) > 0){
			 			$statement1cWHERE = $statement1cWHERE." AND ".$PriceObjStat;
			    } else {
			    		$statement1cWHERE = $PriceObjStat;
		    	}
		}

		if (strlen($AreaObjStat) > 0){
			    if (strlen($statement1cWHERE) > 0){
			 			$statement1cWHERE = $statement1cWHERE." AND ".$AreaObjStat;
			    } else {
			    		$statement1cWHERE = $AreaObjStat;
		    	}
		}


		if (strlen($FloorObjStat) > 0){
			    if (strlen($statement1cWHERE) > 0){
			 			$statement1cWHERE = $statement1cWHERE." AND ".$FloorObjStat;
			    } else {
			    		$statement1cWHERE = $FloorObjStat;
		    	}
		}


		if (strlen($countRooms) > 0){
			    if (strlen($statement1cWHERE) > 0){
			 			$statement1cWHERE = $statement1cWHERE." AND ".$countRooms;
			    } else {
			    		$statement1cWHERE = $countRooms;
		    	}
		}

		if (strlen($objMetro) > 0){
			    if (strlen($statement1cWHERE) > 0){
			 			$statement1cWHERE = $statement1cWHERE." AND ".$objMetro;
			    } else {
			    		$statement1cWHERE = $objMetro;
		    	}
		}

		if (strlen($areaObj) > 0){
			    if (strlen($statement1cWHERE) > 0){
			 			$statement1cWHERE = $statement1cWHERE." AND ".$areaObj;
			    } else {
			    		$statement1cWHERE = $areaObj;
		    	}
		}

		if (strlen($streetStat) > 0){
			    if (strlen($statement1cWHERE) > 0){
			 			$statement1cWHERE = $statement1cWHERE." AND ".$streetStat;
			    } else {
			    		$statement1cWHERE = $streetStat;
		    	}
		}

		if (strlen($HouseNumberStat) > 0){
			    if (strlen($statement1cWHERE) > 0){
			 			$statement1cWHERE = $statement1cWHERE." AND ".$HouseNumberStat;
			    } else {
			    		$statement1cWHERE = $HouseNumberStat;
		    	}
		}

 		//Конец отбора по типу GET ДЛЯ 1С

 	return $statement1cWHERE;

 }

$whereStat = getSQLStatement($inputJSON);
$full1cStat = "SELECT  tempexchange1c.lat, tempexchange1c.lng, clientTelNumber,reqTypeofRealty, updatetime, concat(reqRegion, ', г. ',reqCity, ', ул. ', reqStreet, ', д. ', reqHouseNumber ) as address, reqRoomCount, reqArea, reqFlatTotalArea, reqFlatLivingArea, reqMaterial, reqPrice, reqResponsibleRealtor, tempexchange1c.reqNumber, idocconnections.reqStatus, imedia.reqTmpType, icontent.URI, rieltorTelNumber, (select count(*) from icontent where icontent.mediaUID =  imedia.UIDMedia) as countPhoto, reqFloor, reqFloorCount, clasteredhouse.nearMetro, clasteredhouse.metroDistance, imedia.onModeration
                                     FROM tempexchange1c 
                                     LEFT JOIN idocconnections ON tempexchange1c.reqNumber = idocconnections.reqNumber 
                                     LEFT JOIN imedia ON tempexchange1c.reqNumber = imedia.reqTmp
                                     LEFT JOIN icontent ON  icontent.mediaUID =  imedia.UIDMedia
                                     LEFT JOIN clasteredhouse on clasteredhouse.UID = tempexchange1c.curObj WHERE
                                     ".$whereStat." AND idocconnections.reqStatus = 'Активная' GROUP BY tempexchange1c.reqNumber ORDER BY updatetime DESC limit 100";
 $linkCDB = CDBconnection::get();
  $answerSQL = mysqli_query($linkCDB, $full1cStat);
   									     $count = 0;
   									     while ($record = $answerSQL->fetch_array()){
                            if (is_null($record['URI']) || $record['URI'] == ' ') {
                              $mPhoto = '';
							  $allPhoto = '';
                            } else {
                              $mPhoto = 'https://centromir-sc.ru/imagebase/'.$record['reqNumber'].'/Resize/'.$record['reqNumber'].'_'.$record['URI'].'_r.jpg';
                              $allPhoto = 'https://centromir-sc.ru/imagebase/'.$record['reqNumber'].'/Resize/'.$record['reqNumber'].'_'.$record['URI'].'_r.jpg';
                            }

                            if (is_null($record['reqFlatLivingArea']) || $record['reqFlatLivingArea'] == ''){
                                $record['reqFlatLivingArea'] = 0;
                            }


												
   									   			$answer[$count] = array(
   									   				'source' => '1c',
   									   				'reqNumber' => $record['reqNumber'],
													'Address' => $record['address'],
   									   				'CityArea' => $record['reqArea'],
   									   				'MetroName' => $record['nearMetro'],
   									   				'MetroTime' => $record['metroDistance'],
   									   				'AreaTotal' => $record['reqFlatTotalArea'],
   									   				'AreaLive' =>  $record['reqFlatLivingArea'],
   									   				'Floor' => $record['reqFloor'].' из '.$record['reqFloorCount'],
   									   				'Wall' => $record['reqMaterial'],
													'Price' => round($record['reqPrice']),
   									   				'DocType' => $record['reqTmpType'],
   									   				'ActTime' => $record['updatetime'],
   									   				'MainPhoto' => $mPhoto,
                                            		'reqTypeR' => $record['reqTypeofRealty'],
   									   				'PhotoCount' => $record['countPhoto'],
                                            		'Logo' => $record['source'],
   									   				'lng' => $record['lng'],
													'lat' => $record['lat'],
                                                    'owner' => $record['reqResponsibleRealtor'],
                                                    'moderation' => $record['onModeration'],
                                                    'rooms' => $record['reqRoomCount'],
                                                    'ownernumber' => $record['rieltorTelNumber'],
													'clientTelNumber' => $record['clientTelNumber'],
   									   															);
   									    	   $count++;  
   									    }

							   

							   	echo(json_encode($answer));