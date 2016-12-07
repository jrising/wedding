// open socket using standard syntax
var ws = $.WebSocket("ws://127.0.0.1:8090/");

var sprites = [
    {
        'src': 'sprites/body-missing.png',
        'type': 'body',
        'anchor': 26,
        'topoff': 4
    },
    {
        'src': 'sprites/head-missing.png',
        'type': 'head',
        'anchor': 41
    },
    {
	'src': 'sprites/body1.png',
	'type': 'body',
	'anchor': 26
    },
    {
	'src': 'sprites/head1.png',
	'type': 'head',
	'anchor': 56
    },
    {
	'src': 'sprites/body2.png',
	'type': 'body',
	'anchor': 30,
	'height': 69
    },
    {
	'src': 'sprites/head2.png',
	'type': 'head',
	'anchor': 54
    },
    {
	'src': 'sprites/body3.png',
	'type': 'body',
	'anchor': 29
    },
    {
	'src': 'sprites/head3.png',
	'type': 'head',
	'anchor': 54,
	'height': 96
    },
    {
	'src': 'sprites/body4.png',
	'type': 'body',
	'anchor': 42,
	'height': 97
    },
    {
	'src': 'sprites/head4.png',
	'type': 'head',
	'anchor': 69
    },
    {
	'src': 'sprites/body5.png',
	'type': 'body',
	'anchor': 37
    },
    {
	'src': 'sprites/head5.png',
	'type': 'head',
	'anchor': 90,
	'width': 143
    },
    {
	'src': 'sprites/body6.png',
	'type': 'body',
	'anchor': 37
    },
    {
	'src': 'sprites/head6.png',
	'type': 'head',
	'anchor': 63
    }
];

var world = [];
var refreshDisplay = false;

function go(avatar) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    loadWalls();

    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 100, 100);
    };
    img.src = 'sprites/body1.png';

    var background = new Image();
    background.onload = function() {
        world.unshift({
            display: function(ctx) {
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
            }
        });
        refreshDisplay = true;
    };
    background.src = 'world/wpvupper.png';

    agent = new Agent(avatar, 320, 550);
    avatar.ready(function() {
        world.push(agent);
    });

    setInterval(function() {
        for (var ii = 0; ii < world.length; ii++) {
            var refresh = refreshDisplay;
            if (world[ii].tick)
                refresh |= world[ii].tick();
        }
        if (refresh) {
		    ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var ii = 0; ii < world.length; ii++)
                if (world[ii].display)
                    world[ii].display(ctx);
        }
	}, 10);

    ws.onopen = function() {
        ws.send("Just joined!");
        console.log('connected!');
    };

    ws.onmessage = function (e) {
        console.log('<: ' + e.data);
        alert(e.data);
    };

    ws.onerror = function (e) {
        console.log('<: ' + e.data);
    };

    ws.onclose = function () {
        console.log('connection closed!');
    };

    return agent;
}

$(function() {
    avatar = new Avatar(sprites[1], sprites[0]);
    var agent = go(avatar);
    $('#canvas').click(function(event) {
	    var posX = $(this).offset().left,
            posY = $(this).offset().top;

        for (var ii = 0; ii < world.length; ii++) {
            if (world[ii].click)
                refreshDisplay |= world[ii].click(event.pageX - posX, event.pageY - posY);
        }
    });
});
