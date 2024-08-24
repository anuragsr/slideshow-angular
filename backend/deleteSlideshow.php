<?php
    include('db_connect.php');
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input["id"];

    $q1 = "SELECT slides FROM x_slideshow_1913 WHERE id = '$id'";
    $r1 = selectQuery($q1, $conn)["data"];
	$slideIds = $r1[0]["slides"];

	$q2 = "SELECT comps FROM x_slide_0652 WHERE id IN $slideIds";
    $r2 = selectQuery($q2, $conn)["data"];
    for($i = 0; $i < count($r2); $i++){
		$currComps = $r2[$i]["comps"];
		if($currComps != ""){				
			$q = "DELETE FROM x_slidecomp_7489 WHERE id IN $currComps";
		    $conn->query($q);
		}
    }

    $q = "DELETE FROM x_slide_0652 WHERE id IN $slideIds";
    $conn->query($q);

    $q = "DELETE FROM x_slideshow_1913 WHERE id = '$id'";
    $conn->query($q);

    echo json_encode(array("input"=>$input, "result"=>true))
?>