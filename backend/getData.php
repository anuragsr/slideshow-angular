<?php
    include('db_connect.php');  

    $q = "SELECT * FROM x_fonts";
	$ret = array("fonts" => selectQuery($q, $conn)["data"]);

    $q = "SELECT * FROM x_font_size";
	$ret["fontSizes"] = selectQuery($q, $conn)["data"];

	$q = "SELECT * FROM x_an_types";
	$ret["animTypes"] = selectQuery($q, $conn)["data"];

	$q = "SELECT * FROM x_an_dir";
	$ret["animDir"] = selectQuery($q, $conn)["data"];

    echo json_encode($ret);
?>