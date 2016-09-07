var invitestory = {
    id: 'invite-story',
    steps: [
        {
            title: "Welcome!  Find your invitation.",
            content: '<p id="invite-story1">This is the check-in desk.  Please select your name here.</p>',
            target: "target-invite",
            placement: "right",
            onShow: function() {
                $('.select2-dropdown').css({zIndex: 1000000});
                $('#invite-story1').after($('#invite-form'));
            },
            onNext: function() {
                $('body').after($('#invite-form'));
            }
        },
        {
            title: "Please wait...",
            content: "We're finding your invitation.",
            target: 'target-invite',
            placement: 'right',
            onShow: function() {
                finduser($('#invite-list').val(), function(record) {
                    if (record == null)
                        hopscotch.nextStep();
                    else
                        hopscotch.endTour();
                });
            }
        },
        {
            title: "Select your avatar.",
            content: "Since this is your first time here, it's time to select your avatar.",
            target: "target-invite",
            placement: "right",
        }
    ],
    showPrevButton: true
};

$(function() {
    $.get("data/invites.csv",
          function(data) {
              var records = $.csv.toArrays(data);

              $('#invite-list').empty();

              var currentperson = "";
              var currentgroup = "";
              var $optgroup = null;
              for (var ii = 1; ii < records.length; ii++) {
                  if (!records[ii][2])
                      continue;

                  if (records[ii][0] != "")
                      currentperson = records[ii][0];

                  if (records[ii][1] != "") {
                      var groupname = currentperson + ': ' + records[ii][1];
                      if (groupname != currentgroup) {
                          $optgroup = $('<optgroup label="' + groupname + '"></optgroup>');
                          $('#invite-list').append($optgroup);
                      }
                  }

                  if (records[ii][5] == "1")
                      $optgroup.append('<option value="' + records[ii][2] + '">' + records[ii][2] + '</option>');
              }

              hopscotch.startTour(invitestory);
          });
});

function finduser(name, callback) {
    $.get("data/users.csv",
          function(data) {
              var records = $.csv.toArrays(data);

              for (var ii = 1; ii < records.length; ii++) {
                  if (records[ii][0] == name)
                      return callback(records[ii]);
              }

              return callback(null);
          });
}
