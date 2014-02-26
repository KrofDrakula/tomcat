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

    var movementSpeed = 20;
    var trackSpeed    = 40;

    var controller = new KeyboardController;


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

        // add player-specific functionality
        player.velocity = new Vec2(0, 0);

        // the camera should start off behind the player, at a distance
        // of focalLength
        camera = {
            pos : new Vec3(player.pos.x, player.pos.y, player.pos.z - focalLength),
            f   : focalLength
        };

    }

    function update() {
        clouds.forEach(function(cloud) {
            cloud.pos.z -= trackSpeed;
        });

        targets.forEach(function(target) {
            target.pos.z -= trackSpeed;
        });

        player.pos.x += player.velocity.x;
        player.pos.y += player.velocity.y;

        player.render(camera, view);
    }

    function render() {
        clouds.forEach(function(cloud) {
            cloud.render(camera, view);
        });

        targets.forEach(function(target) {
            target.render(camera, view);
        });

        clouds.forEach(function(cloud) {
            var rect = cloud.getBoundingRect();

            // check if the object is completely outside the view frustrum
            if (
                rect.right < -rect.width || rect.left > view.width + rect.width ||
                rect.top < -rect.height || rect.bottom > view.height + rect.height ||
                cloud.pos.z <= camera.pos.z
            ) {
                // reset the cloud's position way forward again
                cloud.pos.z += view.width * 5;
            }
        });

        player.pos.x += player.velocity.x;
        player.pos.y += player.velocity.y;

        player.render(camera, view);
    }


    // prepare the controller
    controller.start(function() {
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
    });


    controller.on('engage', updatePlayer);
    controller.on('disengage', updatePlayer);

    function updatePlayer() {
        var commandSet = controller.getCommandSet();
        if (commandSet.left ^ commandSet.right)
            player.velocity.x = commandSet.left ? -movementSpeed : movementSpeed;
        else
            player.velocity.x = 0;
        
        if (commandSet.up ^ commandSet.down)
            player.velocity.y = commandSet.up ? -movementSpeed : movementSpeed;
        else
            player.velocity.y = 0;
    }



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