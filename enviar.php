<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nombre   = strip_tags(trim($_POST['nombre']));
    $email    = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $telefono = strip_tags(trim($_POST['telefono']));
    $area     = strip_tags(trim($_POST['area']));
    $mensaje  = htmlspecialchars(trim($_POST['mensaje']));
    $lang     = isset($_POST['lang']) ? $_POST['lang'] : 'es';

    $destinatario = "david@alarmasinsa.com";
    $asunto = "Nueva Candidatura - Pagina Web (" . strtoupper($lang) . "): " . $area . " - " . $nombre;
    $remetente = "no-reply@alarmasinsa.com";

    $separator = md5(time());

    $headers = "From: Alarmas INSA Web <" . $remetente . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"\r\n";


    $body = "--" . $separator . "\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";

    $body .= "<h2>Nueva Candidatura Recibida (Idioma: " . strtoupper($lang) . ")</h2>";
    $body .= "<p><b>Puesto / Área:</b> " . $area . "</p>";
    $body .= "<p><b>Nombre:</b> " . $nombre . "</p>";
    $body .= "<p><b>Teléfono:</b> " . $telefono . "</p>";
    $body .= "<p><b>Correo Electrónico:</b> " . $email . "</p>";
    $body .= "<p><b>Mensaje:</b><br>" . nl2br($mensaje) . "</p>";
    $body .= "\r\n";

    if (isset($_FILES['cvFile']) && $_FILES['cvFile']['error'] == UPLOAD_ERR_OK) {
        $fileTmpPath   = $_FILES['cvFile']['tmp_name'];
        $fileName      = $_FILES['cvFile']['name'];
        $fileType      = $_FILES['cvFile']['type'];
        $fileContent   = chunk_split(base64_encode(file_get_contents($fileTmpPath)));

        $body .= "--" . $separator . "\r\n";
        $body .= "Content-Type: " . $fileType . "; name=\"" . $fileName . "\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= "Content-Disposition: attachment; filename=\"" . $fileName . "\"\r\n\r\n";
        $body .= $fileContent . "\r\n";
    }

    $body .= "--" . $separator . "--";


    $mensagens = [
        'es' => [
            'sucesso' => '¡Candidatura enviada con éxito! Nos pondremos en contacto pronto.',
            'erro' => 'Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.'
        ],
        'ca' => [
            'sucesso' => 'Candidatura enviada amb èxit! Ens posarem en contacte aviat.',
            'erro' => 'Hi ha agut un error en enviar el formulari. Si us plau, torneu-ho a provar.'
        ],
        'en' => [
            'sucesso' => 'Application sent successfully! We will contact you soon.',
            'erro' => 'There was an error sending the form. Please try again.'
        ]
    ];


    if (!array_key_exists($lang, $mensagens)) {
        $lang = 'es';
    }

    if (mail($destinatario, $asunto, $body, $headers)) {
        echo "<script>
                alert('" . $mensagens[$lang]['sucesso'] . "');
                window.location.href = 'trabaja.html';
              </script>";
    } else {
        echo "<script>
                alert('" . $mensagens[$lang]['erro'] . "');
                window.history.back();
              </script>";
    }
} else {
    header("HTTP/1.0 403 Forbidden");
    echo "Acceso no autorizado.";
}
