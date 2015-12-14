// TODO:
// * Balance game
// * Sounds
// * Music
// * Enemies animation
// * GUI
// * Splash screen and credits
// * Find a way to paint plant yellow when dry
var App = (function () {
    function App() {
        this.game = new Phaser.Game(1200, 600, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render,
            allowPassThrough: this.allowPassThrough
        });
    }
    App.prototype.preload = function () {
        this.game.load.image('cow', 'img/cow.png');
        this.game.load.image('plant', 'img/plant.png');
        this.game.load.image('day', 'img/day.png');
        this.game.load.image('night', 'img/night.png');
        this.game.load.image('cloud', 'img/cloud.png');
        this.game.load.image('ground', 'img/ground.png');
    };
    App.prototype.create = function () {
        this.pivot = new Phaser.Point(this.game.world.centerX, this.game.world.height);
        this.enemies = [];
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.applyGravity = false;
        this.game.physics.p2.applyDamping = false;
        this.game.physics.p2.applySpringForces = false;
        this.day = new Period(this.game, 'day', 0, 0, 0, 2);
        this.day.body.debug = true;
        this.night = new Period(this.game, 'night', 0, 0, 180, 2);
        this.night.body.debug = true;
        this.plant = new Plant(this.game, this.game.world.centerX, this.game.world.centerY + 30);
        var ground = this.game.add.sprite(0, 0, 'ground');
        ground.position.setTo(this.pivot.x - ground.width / 2, this.pivot.y - ground.height);
        this.cloud = new Cloud(this.game, this.pivot, 400, 0.2);
        this.cloud.body.debug = true;
        this.player = new Player(this.game, this.day, this.night, this.cloud);
        var cow = new Enemy(this.game, this.day, this.pivot, 'cow', 270, 0.2, -90);
        cow.body.debug = true;
        this.cow = cow;
        this.ai = new AI(cow);
        this.enemies.push(cow);
        window['game'] = this;
        this.game.physics.p2.setPostBroadphaseCallback(this.allowPassThrough, this);
    };
    App.prototype.allowPassThrough = function (obj1, obj2) {
        return false;
    };
    App.prototype.update = function () {
        this.player.update();
        this.ai.update(this);
        var dayPolygon = new BoundingPolygon(this.day);
        var nightPolygon = new BoundingPolygon(this.night);
        var cloudPolygon = new BoundingPolygon(this.cloud);
        var plantPolygon = this.plant.createPolygon();
        if (dayPolygon.containPolygon(plantPolygon)) {
            this.plant.collidedDay();
        }
        else if (nightPolygon.containPolygon(plantPolygon)) {
            this.plant.collidedNight();
        }
        if (cloudPolygon.overlapPolygon(plantPolygon)) {
            this.plant.collidedRain();
        }
    };
    App.prototype.render = function () {
        // this.game.debug.pointer(this.game.input.activePointer);
        // this.game.debug.spriteInputInfo(this.cow, 32, 32);
        // this.game.debug.spriteCoords(this.cow, 32, 128);
        // this.game.debug.spriteInfo(this.cow, 32, 200);
        // this.game.debug.spriteBounds(this.cow);
        // this.game.debug.body(this.cow);
        // this.game.debug.spriteBounds(this.plant);
        // this.game.debug.body(this.plant);
        var _this = this;
        // this.game.debug.spriteBounds(this.player);
        // this.game.debug.body(this.player, 'red');
        // this.game.debug.spriteBounds(this.player);
        // this.game.debug.body(this.night, 'green');
        // this.game.debug.spriteBounds(this.day);
        // this.game.debug.body(this.day, 'green');
        this.game.debug.text("Energy: " + this.plant.energy, 700, 32);
        this.game.debug.text("Water: " + this.plant.water, 700, 64);
        this.game.debug.text("Growth: " + this.plant.growth, 700, 96);
        this.game.debug.text("speed: " + this.cloud.orbit.angularSpeed, this.cloud.x, this.cloud.y);
        var dayPolygon = new BoundingPolygon(this.day);
        var plantPolygon = this.plant.createPolygon();
        var cowPolygon = new BoundingPolygon(this.cow);
        // this.game.debug.geom(plantPolygon.polygon, 'red', true);
        for (var i = 1; i < dayPolygon.points.length - 1; i++) {
            var point = dayPolygon.points[i];
            var previousPoint = dayPolygon.points[i - 1];
            this.game.debug.geom(new Phaser.Line(point.x, point.y, previousPoint.x, previousPoint.y), 'green');
        }
        dayPolygon.points.forEach(function (point) {
            _this.game.debug.geom(new Phaser.Circle(point.x, point.y, 10), 'blue', true);
            _this.game.debug.text('(' + point.x + ',' + point.y + ')', point.x - 20, point.y - 20, 'white');
        });
        plantPolygon.points.forEach(function (point) {
            var color = dayPolygon.polygon.contains(point.x, point.y) ? 'green' : 'red';
            _this.game.debug.geom(new Phaser.Circle(point.x, point.y, 10), color, true);
            _this.game.debug.text('(' + point.x + ',' + point.y + ')', point.x - 20, point.y - 20, 'white');
        });
        cowPolygon.points.forEach(function (point) {
            var color = dayPolygon.polygon.contains(point.x, point.y) ? 'green' : 'red';
            _this.game.debug.geom(new Phaser.Circle(point.x, point.y, 10), color, true);
            _this.game.debug.text('(' + point.x + ',' + point.y + ')', point.x - 20, point.y - 20, 'white');
        });
    };
    return App;
})();
window.onload = function () {
    var game = new App();
};
