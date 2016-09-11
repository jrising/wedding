<?php
namespace ChatApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
      if (substr($msg, 0, 4) == "\\//\\") {
        $pieces = explode("/", substr($msg, 4));
        switch ($pieces[0]) {
        case "usermgt":
          switch ($pieces[1]) {
          case "new":
            echo getcwd();
            file_put_contents("html/data/users.csv", sprintf("%s,%d,%d,%d,%d,%s\n", $pieces[2], $pieces[3], $pieces[4], $pieces[5], $pieces[6], $pieces[7]), FILE_APPEND);
            break;
          default:
            echo sprintf("Unknown command: %s", substr($msg, 4));
          }
          break;
        default:
          echo sprintf("Unknown command: %s", substr($msg, 4));
        }
        return;
      }

        $numRecv = count($this->clients) - 1;
        echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
            , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

        foreach ($this->clients as $client) {
            if ($from !== $client) {
                // The sender is not the receiver, send to each client connected
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}
