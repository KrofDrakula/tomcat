$(function() {

    var container = $('#viewport');
    
    var width  = container.width();
    var height = container.height();

    var clouds      = [];
    var targets     = [];
    var player      = null;
    var camera      = null;
    var focalLength = height;

    var cloudCount  = 50;
    var targetCount = 20;
    var trackLength = 200;


    function init() {
        var i;
        // generate random clouds, front to back
        for (i = 0; i < cloudCount; i++) {
            clouds.push(
                new GameObject(
                    new Vec3(
                        (Math.random() - 0.5) * width,
                        (Math.random() - 0.5) * height,
                        (i / cloudCount) * width
                    ),
                    getImage('cloud')
                )
            );
        }

        // generate random targets, front to back
        for (i = 0; i < targetCount; i++) {
            targets.push(
                new GameObject(
                    new Vec3(
                        (Math.random() - 0.5) * width,
                        (Math.random() - 0.5) * height,
                        ((i + 1) / targetCount) * width * (trackLength / targetCount)
                    ),
                    getImage('target')
                )
            );
        }

        // start the player in the center of the screen and at zero distance
        player = new Vec3(0, 0, 0);

        // the camera should start off behind the player, at a distance
        // of focalLength
        camera = new Vec3(player.x, player.y, player.z - focalLength);
    }

    function getImage(name) {
        var img = document.createElement('img');
        img.src = '/assets/' + name + '.png';
        container.appendChild(img);
        return img;
    }

    function populateClouds() {
        clouds.forEach(function(cloud) {

        });
    }

});