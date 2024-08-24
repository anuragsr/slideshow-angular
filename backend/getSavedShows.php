<?php
    include('db_connect.php');  
    $input = json_decode(file_get_contents('php://input'), true);
    $type = $input["type"];
    if($type == "auth"){
        $auth = $input["cl"];
        $q = "SELECT * FROM x_slideshow_1913 WHERE author = '$auth'";
    }else{        
        $id = $input["id"];
        $q = "SELECT * FROM x_slideshow_1913 WHERE id = '$id'";
    }

    $r = selectQuery($q, $conn)["data"];

    for($i = 0; $i < count($r); $i++){
    	$currShow = $r[$i];
    	$r[$i]["h"] = intval($r[$i]["h"]);
    	$r[$i]["w"] = intval($r[$i]["w"]);
    	$slideIds = $currShow["slides"];
    	$q1 =  "SELECT *,
    				ent_table.name AS an_ent_name,
                    ent_table.value AS an_ent_value,
    				ent_table.subtype AS an_ent_subtype,
    				ent_dir_table.name AS an_ent_dir_name,
    				ent_dir_table.value AS an_ent_dir_value,
    				ex_table.name AS an_ex_name,
                    ex_table.value AS an_ex_value,
    				ex_table.subtype AS an_ex_subtype,
    				ex_dir_table.name AS an_ex_dir_name,
    				ex_dir_table.value AS an_ex_dir_value
				FROM x_slide_0652
    			INNER JOIN x_an_types ent_table 
    				ON x_slide_0652.an_ent = ent_table.id
    			INNER JOIN x_an_dir ent_dir_table 
    				ON x_slide_0652.an_ent_dir = ent_dir_table.id
    			INNER JOIN x_an_types ex_table 
    				ON x_slide_0652.an_ex = ex_table.id
    			INNER JOIN x_an_dir ex_dir_table 
    				ON x_slide_0652.an_ex_dir = ex_dir_table.id
    			WHERE x_slide_0652.id IN $slideIds";
    	$r1 = selectQuery($q1, $conn)["data"];
    	for($j = 0; $j < count($r1); $j++){
    		$currSlide = $r1[$j];
    		$compIds = $currSlide["comps"];
    		if($compIds != ""){    			
	    		$q2 =  "SELECT *,
		    				ent_table.name AS an_ent_name,
                            ent_table.value AS an_ent_value,
		    				ent_table.subtype AS an_ent_subtype,
		    				ent_dir_table.name AS an_ent_dir_name,
		    				ent_dir_table.value AS an_ent_dir_value,
		    				x_fonts.name AS font_name,
		    				x_fonts.value AS font_value,
		    				x_font_size.name AS font_size_name,
		    				x_font_size.value AS font_size_value,
		    				x_slidecomp_7489.value AS comp_value
    					FROM x_slidecomp_7489
		    			INNER JOIN x_an_types ent_table 
		    				ON x_slidecomp_7489.an = ent_table.id
		    			INNER JOIN x_an_dir ent_dir_table 
		    				ON x_slidecomp_7489.an_dir = ent_dir_table.id
		    			INNER JOIN x_fonts 
		    				ON x_slidecomp_7489.font = x_fonts.id
		    			INNER JOIN x_font_size
		    				ON x_slidecomp_7489.size = x_font_size.id
    					WHERE x_slidecomp_7489.id IN $compIds";
	    		$r2 = selectQuery($q2, $conn)["data"];
    		}else{
    			$r2 = array();
    		}
    		$r1[$j]["comps"] = $r2;    		
    	}
    	$r[$i]["slides"] = $r1;
    }

    echo json_encode($r);
?>