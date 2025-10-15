<?php
session_start();
include "db.php";

if(isset($_POST['usuario'], $_POST['password'])){
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT id, password FROM usuarios WHERE usuario = ?");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $stmt->store_result();

    if($stmt->num_rows === 1){
        $stmt->bind_result($id, $hash);
        $stmt->fetch();
        if(password_verify($password, $hash)){
            $_SESSION['user_id'] = $id;
            echo "Login correcto";
        } else {
            echo "Contraseña incorrecta";
        }
    } else {
        echo "Usuario no encontrado";
    }
}
?>
