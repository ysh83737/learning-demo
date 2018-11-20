<?php
    $name = $_POST['name'];
    $age = $_POST['age'];
    $json = array('code' => 0, 'method' => 'POST', 'data' => array('name' => $name, 'age' => $age));
    echo json_encode($json);
?>