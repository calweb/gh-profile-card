var ajax = require('alite/alite')();

var ghProfileCardProto = Object.create(HTMLElement.prototype);

// lifecycle event callback when element gets created
ghProfileCardProto.createdCallback = function () {

  var shadow = this.createShadowRoot();
  var img = document.createElement('img');
  var link = document.createElement('a');

  var attrs = {
      url: "https://api.github.com/users/",
      username: this.getAttribute('data-username')
  };

  var creds = {
    'Authorization': 'token ' + '571f889576e72ea987d4877ea51de8b644af3415'
  };
    ajax.get(attrs.url + attrs.username, creds)
      .then(function (ghData) {
        img.alt = attrs.username;
        img.width = '150';
        img.height = '150';
        img.className = 'avatar-img';
        img.src = ghData.data.avatar_url;
        link.className = 'avatar-name';
        link.innerText = attrs.username;
        link.href = ghData.data.html_url;

    })
      .catch(function (err) {
        console.log(err);
      });

      shadow.appendChild(img);
      shadow.appendChild(link);
  };


var ghProfileCard = document.registerElement('gh-profile-card', {
  prototype: ghProfileCardProto
});
