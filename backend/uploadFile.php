<?php
    function generateRand($length) {
        $characters = '0123456789';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    function normalizeFiles($files = array()) {
        $normalized_array = array();
        foreach($files as $index => $file) {
            if (!is_array($file['name'])) {
                $normalized_array[$index][] = $file;
                continue;
            }
            foreach($file['name'] as $idx => $name) {
                $normalized_array[$index][$idx] = [
                    'name' => $name,
                    'type' => $file['type'][$idx],
                    'tmp_name' => $file['tmp_name'][$idx],
                    'error' => $file['error'][$idx],
                    'size' => $file['size'][$idx]
                ];
            }
        }
        return $normalized_array;
    }

    $uploadedFile = normalizeFiles($_FILES);
    $format = $_REQUEST["format"];

    $file = $uploadedFile["uploadedFile"][0];
    $ext = pathinfo($file["name"], PATHINFO_EXTENSION);

    if($format == "img"){
        $newName = "upload/img/IMG".generateRand(6).".".$ext;
    }else{
        $newName = "upload/aud/AUD".generateRand(6).".".$ext;        
    }
    $path = "../".$newName;
    move_uploaded_file($file["tmp_name"], $path);

    echo json_encode(array(
        "file"=>$uploadedFile,
        "name"=>$file["name"],
        "path"=>$newName
    ));
?>