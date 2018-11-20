<?php
    $name = $_GET['name'];
    $age = $_GET['age'];
    $json = array('code' => 0, 'method' => 'GET', 'data' => array('name' => $name, 'age' => $age));
    echo json_encode($json);
?>