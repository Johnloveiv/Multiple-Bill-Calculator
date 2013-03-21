<?php

//setup database
try {
        $dbh = new PDO("mysql:host=localhost;dbname=test" , 'root', 'likes69');
    }
catch(PDOException $e)
    {
        echo $e->getMessage();
    }

$q = $dbh->prepare("select * from calc");

$q->execute();

$results = $q->fetchAll(PDO::FETCH_ASSOC);

$arr = array();

foreach ($results as $r) {
    $arr[] = array('max_sentence'=>$r['max_sentence'], 'offense' => $r['offense']);
}

$data = json_encode($arr);

file_put_contents('data.json',$data);
