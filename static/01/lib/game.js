$(function() {

    var container = $('#viewport');
    
    var view = {
        width  : container.width(),
        height : container.height()
    };

    var clouds      = [];
    var targets     = [];
    var player      = null;
    var camera      = null;
    var focalLength = view.height;

    var cloudCount  = 100;
    var targetCount = 20;
    var trackLength = 2000;


    function init() {
        var i;
        // generate random clouds, front to back
        for (i = 0; i < cloudCount; i++) {
            clouds.push(
                new GameObject(
                    new Vec3(
                        (Math.random() - 0.5) * view.width,
                        (Math.random() - 0.5) * view.height,
                        (i / cloudCount) * 5 * view.width
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
                        (Math.random() - 0.5) * view.width,
                        (Math.random() - 0.5) * view.height,
                        ((i + 1) / targetCount) * view.width * (trackLength / targetCount)
                    ),
                    getImage('target')
                )
            );
        }

        // start the player in the center of the screen and at zero distance
        player = new GameObject(
            new Vec3(0, 0, 0),
            getImage('tomcat')
        );

        // the camera should start off behind the player, at a distance
        // of focalLength
        camera = {
            pos : new Vec3(player.pos.x, player.pos.y, player.pos.z - focalLength),
            f   : focalLength
        };

    }

    function update() {
        clouds.forEach(function(cloud) {
            cloud.pos.z -= 40;
            if (cloud.pos.z <= camera.pos.z)
                cloud.pos.z += view.width * 5;
        });

        targets.forEach(function(target) {
            target.pos.z -= 40;
        });
    }

    function render() {
        clouds.forEach(function(cloud) {
            cloud.render(camera, view);
        });
        targets.forEach(function(target) {
            target.render(camera, view);
        });
        player.render(camera, view);
    }


    // wait for resources to load, then kick off the initialisation & game loop
    preloadImages(
        [
            '/assets/cloud.png',
            '/assets/target.png',
            '/assets/tomcat.png'
        ],
        function() {
            init();
            setInterval(function() {
                update();
                render();
            }, 16);
        }
    );



    // utility functions
    function preloadImages(urls, cb) {
        var deferred = $.Deferred(),
            promises = [];

        urls.forEach(function(url) {
            var img = new Image,
                p = $.Deferred();
            promises.push(p);
            img.onload = p.resolve;
            img.onerror = p.resolve;
            img.src = url;
        });

        $.when.apply($, promises).done(cb);
    }

    function getImage(name) {
        return $('<img class="game-object"/>').attr('src', '/assets/' + name + '.png').appendTo(container);
    }

});