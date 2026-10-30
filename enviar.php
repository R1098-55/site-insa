<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nombre   = strip_tags(trim($_POST['nombre']));
    $email    = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $telefono = isset($_POST['telefono']) ? strip_tags(trim($_POST['telefono'])) : 'No informado';
    $area     = isset($_POST['area']) ? strip_tags(trim($_POST['area'])) : 'Contacto General / Soporte';
    $mensaje  = htmlspecialchars(trim($_POST['mensaje']));
    $lang     = isset($_POST['lang']) ? $_POST['lang'] : 'es';

    $destinatario = "david@alarmasinsa.com";
    $asunto = "Nuevo Mensaje de Contacto - Pagina Web (" . strtoupper($lang) . "): " . $nombre;
    $remetente = "no-reply@alarmasinsa.com";

    $separator = md5(time());

    $headers = "From: Alarmas INSA Web <" . $remetente . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"\r\n";

    $body = "--" . $separator . "\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";

    $body .= "<h2>Nuevo Mensaje de Contacto Recibido (Idioma: " . strtoupper($lang) . ")</h2>";
    $body .= "<p><b>Asunto / Área:</b> " . $area . "</p>";
    $body .= "<p><b>Nombre:</b> " . $nombre . "</p>";
    $body .= "<p><b>Teléfono:</b> " . $telefono . "</p>";
    $body .= "<p><b>Correo Electrónico:</b> " . $email . "</p>";
    $body .= "<p><b>Mensaje:</b><br>" . nl2br($mensaje) . "</p>";
    $body .= "\r\n";

    // Se houver um arquivo anexo (como no trabalhe conosco), ele anexa; senão, segue direto
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
            'sucesso' => '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.',
            'erro' => 'Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.'
        ],
        'ca' => [
            'sucesso' => 'Missatge enviat amb èxit! Ens posarem en contacte aviat.',
            'erro' => 'Hi ha agut un error en enviar el formulari. Si us plau, torneu-ho a provar.'
        ],
        'en' => [
            'sucesso' => 'Message sent successfully! We will contact you soon.',
            'erro' => 'There was an error sending the form. Please try again.'
        ]
    ];

    if (!array_key_exists($lang, $mensagens)) {
        $lang = 'es';
    }

    // Identifica para onde redirecionar após o envio (volta para a página de contacto ou outra)
   
   //* $redirect_page = isset($_POST['redirect_to']) ? $_POST['redirect_to'] : 'contacto.html';

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recolhe os dados normalmente...
    $nombre = $_POST['nombre'] ?? '';
    $email = $_POST['email'] ?? '';
    $mensaje = $_POST['mensaje'] ?? '';

    // Em vez de enviar o e-mail, mostra os dados na tela para teste:
    echo "<h2>Dados recebidos com sucesso no Localhost:</h2>";
    echo "<p><b>Nome:</b> " . htmlspecialchars($nombre) . "</p>";
    echo "<p><b>E-mail:</b> " . htmlspecialchars($email) . "</p>";
    echo "<p><b>Mensagem:</b> " . htmlspecialchars($mensaje) . "</p>";
    exit;
}

    if (mail($destinatario, $asunto, $body, $headers)) {
        echo "<script>alert('" . $mensagens[$lang]['sucesso'] . "'); window.location.href = 'contacto.html';</script>";
    } else {
        echo "<script>alert('" . $mensagens[$lang]['erro'] . "'); window.location.href = 'contacto.html';</script>";
    }
}
?>  