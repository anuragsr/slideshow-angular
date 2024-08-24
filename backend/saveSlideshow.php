<?php
    include('db_connect.php');
    $input = json_decode(file_get_contents('php://input'), true);

    $stmt = $conn->prepare("
        INSERT INTO x_slideshow_1913 (
            name,
            author,
            h,
            w
        )
        VALUES ( ?, ?, ?, ? )
    ");
    $stmt->bind_param("ssss",
        $input['show']['name'],
        $input['show']['author'],
        $input['show']['h'],
        $input['show']['w']
    );
	$result = $stmt->execute();
	$slideShowId = $stmt->insert_id;
	
	$slides = $input['slides'];
	$slideIdArr = array();
	for($i = 0; $i < count($slides); $i++){
		$currSlide = $slides[$i];
		$stmt = $conn->prepare("
	        INSERT INTO x_slide_0652 (
	            title,
	            bg_type,
	            bg_value,
	            an_ent,
	            an_ent_dir,
	            an_ex,
	            an_ex_dir,
	            sound
	        )
	        VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )
	    ");
	    $stmt->bind_param("ssssssss",
	        $currSlide["title"],
	        $currSlide["bg"]["type"],
	        $currSlide["bg"]["value"],
	        $currSlide["anim"]["entry"]["type"]["id"],
	        $currSlide["anim"]["entry"]["dir"]["id"],
	        $currSlide["anim"]["exit"]["type"]["id"],
	        $currSlide["anim"]["exit"]["dir"]["id"],
	        $currSlide["sound"]["value"]
	    );
		$stmt->execute();
		$slideId = $stmt->insert_id;
		$slideIdArr[] = $slideId;

		$comps = $currSlide["comps"];
		$compIdArr = array();
		for($j = 0; $j < count($comps); $j++){
			$currComp = $comps[$j];
			$stmt = $conn->prepare("
		        INSERT INTO x_slidecomp_7489 (
		            name,
		            type,
		            value,
		            width,
		            height,
		            x,
		            y,
		            isBold,
		            isItalic,
		            isUnder,
		            delay,
		            an,
		            an_dir,
		            color,
		            font,
		            size
		        )
		        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
		    ");
		    if($currComp["type"] == "text"){		    	
		    	$b = $currComp["style"]["b"]?1:0;
		        $it = $currComp["style"]["i"]?1:0;
		        $u = $currComp["style"]["u"]?1:0;
		        $size = $currComp["size"]["id"];
		        $font = $currComp["font"]["id"];
		        $color = $currComp["color"];
		    }else{
		    	$b = $it = $u = 0;
		        $size = 1;
		        $font = 1;
		        $color = "#000000";
		    }
		    $stmt->bind_param("ssssssssssssssss",
		        $currComp["name"],
		        $currComp["type"],
		        $currComp["value"],
		        $currComp["width"],
		        $currComp["height"],
		        $currComp["x"],
		        $currComp["y"],
		        $b,
		        $it,
		        $u,
		        $currComp["delay"],
		        $currComp["anim"]["id"],
		        $currComp["dir"]["id"],
		        $color,
		        $font,
		        $size
		    );
			$stmt->execute();
			$compId = $stmt->insert_id;
			$compIdArr[] = $compId;
		}

		// Update the slide
		$stmt = $conn->prepare("
		    UPDATE x_slide_0652 
		    SET comps = ?
		    WHERE id = ?
		");

		if(count($compIdArr)){
			$compIdStr = "(".implode($compIdArr, ",").")";
		}else{
			$compIdStr = "";
		}

		$stmt->bind_param("ss", $compIdStr, $slideId);
		$stmt->execute();
	}

	// Update the show
	$stmt = $conn->prepare("
        UPDATE x_slideshow_1913 
        SET slides = ?
        WHERE id = ?
    ");

	if(count($slideIdArr)){
		$slideIdStr = "(".implode($slideIdArr, ",").")";
	}else{
		$slideIdStr = "";
	}

    $stmt->bind_param("ss", $slideIdStr, $slideShowId);
    $result = $result && $stmt->execute();

    echo json_encode(array("input"=>$input, "result"=>$result))
?>