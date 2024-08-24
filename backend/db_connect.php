<?php
    
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

    $database = "x_ssdb_7083";
    $host = "localhost"; 
    
    // For localhost
    // $user = "root";
    // $pass = ""; 
    
    // For real host
    // $user = "";
    // $pass = "";

    // For eca host
    $user = "x_ssdb_user"; 
    $pass = "November1";     

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conn = new mysqli($host, $user, $pass, $database);     
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $conn->query("SET NAMES 'utf8'");

    function selectQuery($q, $conn){
        $arr = array();
        $ret = array();
        $result = $conn->query($q);
        
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $arr[] = $row;
            }
        }
        
        if(count($arr) > 0){
            $ret["result"] = true;
            $ret["data"] = $arr;
        }else{
            $ret["result"] = false;
            $ret["data"] = array();
            $ret["message"] = "Sorry, no records found!";
        }

        return $ret;
    }

?>