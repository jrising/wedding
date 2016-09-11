var Selector = {
    html:
    '<table>' +
        '  <tr>' +
        '    <td><button id="prevHead">&lt;</button></td>' +
        '    <td rowspan="2"><canvas id="canvasSelect" width="200" height="200"/></td>' +
        '    <td><button id="nextHead">&gt;</button></td>' +
        '  </tr>' +
        '  <tr>' +
        '    <td><button id="prevBody">&lt;</button></td>' +
        '    <td><button id="nextBody">&gt;</button></td>' +
        '  </tr>' +
        '</table>' +
        '<button id="go">Go!</button>',

    create: function($div, avatar) {
	    $div.html(Selector.html);
	    var ctx = $div.find('#canvasSelect')[0].getContext('2d');
	    avatar.display(ctx, 100, 100, 0, 0);
	    $div.find('#prevHead').click(Selector.makeOnClick(-1, 'head', avatar, ctx));
	    $div.find('#nextHead').click(Selector.makeOnClick(1, 'head', avatar, ctx));
	    $div.find('#prevBody').click(Selector.makeOnClick(-1, 'body', avatar, ctx));
	    $div.find('#nextBody').click(Selector.makeOnClick(1, 'body', avatar, ctx));
	    $div.find('#go').click(function() {
	        $div.empty();
	        go(avatar);
	    });
    },

    getSprite: function(index) {
	    // this is all to deal with javascripts handling of negative modulus
	    var len = sprites.length;
	    return sprites[((index % len) + len) % len];
    },

    makeOnClick: function(shift, type, avatar, ctx) {
	    return function() {
	        var index = sprites.indexOf(avatar[type]);
	        index += shift;
	        while (Selector.getSprite(index).type != type)
		        index += shift;

	        avatar.setPart(type, Selector.getSprite(index));
	        avatar.ready(function() {
		        ctx.clearRect(0, 0, 200, 200);
		        avatar.display(ctx, 100, 100, 0, 0);
	        });
	    };
    }
};
