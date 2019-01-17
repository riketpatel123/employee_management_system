<?php
try {
    $dbh = new PDO("mysql:hostname;dbname,username,password");
} catch (Exception $ex) {
    die("ERROR: CONNECTION FAILED {$e->getMessage()}");
}
$json = file_get_contents('php://input');
$obj = json_decode($json,true);
if (($obj['method']) === 'search'){
    $input = $obj['input'];
    $command = "SELECT employeeID, firstname, lastname, position, age, description FROM employeedetails WHERE firstname LIKE '%{$input}%'";
    $stmt = $dbh->prepare($command);
    $stmt->execute();
    $result = $stmt->fetchAll();
    echo json_encode($result);
}else{
if ($obj['method'] === 'delete') {
    $id = $obj['id'];
    $sql = "DELETE FROM employeedetails WHERE employeeID= :id";
    $statement = $dbh->prepare($sql);
    $statement->bindValue(':id', $id);
    $statement->execute();
}

if (($obj['method']) === 'insert'){
    $firstname = $obj['firstname'];
    $lastname= $obj['lastname'];
    $position= $obj['position'];
    $age= $obj['age'];
    $description= $obj['description'];
    $employeeID='';
    $userParams = array($employeeID, $firstname , $lastname, $position, $age, $description);
    $command = "INSERT INTO employeedetails (employeeID, firstname, lastname, position, age, description) VALUES (?,?,?,?,?,?)";
    $stmt = $dbh->prepare($command);
    $stmt->execute($userParams);
}
if (($obj['method']) === 'update'){
    $firstname = $obj['firstname'];
    $lastname= $obj['lastname'];
    $position= $obj['position'];
    $age= $obj['age'];
    $description= $obj['description'];
    $employeeID= $obj['id'];
    $userParams = array($firstname , $lastname, $position, $age, $description);
    $command = "UPDATE employeedetails SET firstname=?, lastname=? , position=?, age=?, description=? WHERE employeeID=". $employeeID;
    $stmt = $dbh->prepare($command);
    $stmt->execute($userParams);
}
$command = "SELECT * FROM employeedetails";
$stmt = $dbh->prepare($command);
$stmt->execute();
$result = $stmt->fetchAll();
echo json_encode($result);
}
?>
