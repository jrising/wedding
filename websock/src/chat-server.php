<?php
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use ChatApp\Chat;

    require dirname(__DIR__) . '/vendor/autoload.php';

    $server = IoServer::factory(
        new WsServer(
            new Chat()
        )
      , 8090
    );

    $server->run();