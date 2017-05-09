var selectedArt = null;
var artAdder = null;

function displayArt(url, x, y) {
    var img = new Image();
    img.onload = function() {
        world.push({
            display: function(ctx) {
                ctx.drawImage(img, x - img.width / 2, y - img.height / 2);
            }});
    };
    img.src = url;
}

var contributestory = {
    id: 'contribute-story',
    steps: [
        {
            title: "Contribute to the wedding!",
            content: 'You can add new objects to the wedding venue.  Soon you will be able to add new behaviors for people to interact with.',
            target: "contribute",
            placement: "right",
            //showCTAButton: true,
            //ctaLabel: "Add Logic",
            fixedElement: true,
            onNext: function() {
                contributestory.i18n.nextBtn = "Next";
            }
        },
        {
            title: "Adding new objects",
            content: 'Please select an item below or upload your own art. <div id="artbox"><img src="images/ajax-loader-large.gif" /></div><div style="clear: both"></div>',
            target: 'contribute',
            placement: 'right',
            'i18n.nextBtn': "Insert Selected",
            showCTAButton: true,
            ctaLabel: "Upload New",
            onShow: function() {
                $.get("data/art.csv",
                      function(data) {
                          var records = $.csv.toArrays(data);
                          $('#artbox').empty();
                          for (var ii = 1; ii < records.length; ii++) {
                              $('#artbox').append('<span class="artobject"><img src="' + records[ii][2] + '" /></span>');
                          }

                          $('.artobject').click(function() {
                              $(this).addClass('selected');
                              selectedArt = $(this).children().attr('src');
                          });
                      });
            },
            onPrev: function() {
                console.log("xX");
                contributestory.i18n.nextBtn = "Add Art";
            },
            onCTA: function() {
                hopscotch.endTour(true);
                hopscotch.startTour(uploadartstory);
            }
        },
        {
            title: "Place the art",
            content: "Please click in the map where you want to place the object.",
            target: "contribute",
            placement: "right",
            onShow: function() {
                $('canvas').css({cursor: 'cell'});
                artAdder = {
                    click: function(x, y) {
                        displayArt(selectedArt, x, y);
                        ws.send("\\//\\turing/art/" + selectedArt + "/" + x + "/" + y);
                        hopscotch.endTour();
                    }
                };
                world.push(artAdder);
            }
        }
    ],
    showPrevButton: true,
    fixedElement: true,
    i18n: {
        nextBtn: "Add Art"
    },
    onEnd: function() {
        $('canvas').css({cursor: ''});
        if (artAdder) {
            world.splice(world.indexOf(artAdder), 1);
            artAdder = null;
        }
    }
};

var uploadartstory = {
    id: 'uploadart-story',
    steps: [
        {
            title: "Drag your image here.",
            content: '<div id="uploader"></div>',
            target: 'contribute',
            placement: 'right',
            fixedElement: true,
            onShow: function() {
                var uploader = new qq.FineUploader({
                    element: document.getElementById("uploader")
                });
            }
        }],
    showPrevButton: true,
    fixedElement: true
};


$(function() {
    $('#contribute').click(function() {
        hopscotch.endTour(true);
        contributestory.i18n.nextBtn = "Add Art";
        hopscotch.startTour(contributestory);
    });

    $.get("data/states.csv",
          function(data) {
              var records = $.csv.toArrays(data);
              for (var ii = 1; ii < records.length; ii++) {
                  if (records[ii][0] == "art")
                      displayArt(records[ii][1], records[ii][2], records[ii][3]);
              }
          });
});

