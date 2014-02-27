(function() {

    var container = document.querySelector('#viewport');
    
    var view = {
        width  : container.offsetWidth,
        height : container.offsetHeight
    };

    var clouds      = [];
    var targets     = [];
    var player      = null;
    var camera      = null;
    var focalLength = view.height;

    var cloudCount  = 100;
    var targetCount = 20;
    var trackLength = 2000;

    var movementSpeed = 5;
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

    function moveObjectAlongTrack(obj) { obj.pos.z -= trackSpeed; }

    function update() {
        clouds.forEach(moveObjectAlongTrack);

        targets.forEach(moveObjectAlongTrack);

        player.pos.x += player.velocity.x;
        player.pos.y += player.velocity.y;

        player.render(camera, view);
    }

    function renderGameObject(obj) { obj.render(camera, view); }

    function checkBounds(obj) {
        if (obj.pos.z <= camera.pos.z)
            obj.pos.z += view.width * 5;
    }

    function render() {
        clouds.forEach(renderGameObject);

        targets.forEach(renderGameObject);

        clouds.forEach(checkBounds);

        player.pos.x += player.velocity.x;
        player.pos.y += player.velocity.y;

        player.render(camera, view);
    }

    function tick() {
        nextFrame(tick);
        update();
        render();
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
                tick();
            }
        );
    });


    controller.on('engage', updatePlayer);
    controller.on('disengage', updatePlayer);

    function updatePlayer() {
        var commandSet = controller.getCommandSet();
        if (commandSet.left ^ commandSet.right) {
            player.velocity.x = commandSet.left ? -movementSpeed : movementSpeed;
            player.rotation = commandSet.left ? -25 : 25;
        } else {
            player.velocity.x = player.rotation = 0;
        }
        
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
        var img = document.createElement('img');
        img.className = 'game-object';
        img.src = '/assets/' + name + '.png';
        container.appendChild(img);
        return img;
    }

    // Lazy requestAnimationFrame polyfill.
    // For a better polyfill, see http://shitwebkitdoes.tumblr.com/post/47186945856/native-requestanimationframe-broken-on-ios-6
    var nextFrame = (function() {
        var lastTriggerTime = null;
        return window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) {
            if (lastTriggerTime === null)
                lastTriggerTime = Date.now();
            return setTimeout(function() {
                fn(Date.now() - lastTriggerTime);
                lastTriggerTime = Date.now();
            }, 16);
        };
    })();

})();