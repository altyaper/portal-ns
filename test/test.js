require('should');
var app = require('../app');

var request = require('supertest');
var io = require('socket.io-client');
var socketURL = 'http://127.0.0.1:5000';
var options = {
    transports: ['websocket'],
    'force new connection': true
};


describe('Test connections', function() {

    it('it should emit join when a user is connected', function(done) {
        var client = io.connect(socketURL, options);
        client.on('join', function() {
            client.disconnect();
            done();
        });
    });


    it('it should just two lients to connect', function(done) {

        var client = io.connect(socketURL, options);

        client.on('join', function(current) {

            current.should.equal(1);
            var client2 = io.connect(socketURL, options);

            client2.on('join', function(current) {
                current.should.equal(2);

                client.disconnect();
                client2.disconnect();
                done();
            });

        });

    });

    it('it should redirect when there are more than 2 users', function(done) {
        var client = io.connect(socketURL, options);
        var client2 = io.connect(socketURL, options);
        var client3 = io.connect(socketURL, options);

        client3.on('redirect', function(current) {
            client.disconnect();
            client2.disconnect();
            client3.disconnect();
            done();
        });

    });


    it('it should refresh when a client is disconnected', function(done) {
        var client = io.connect(socketURL, options);
        var client2 = io.connect(socketURL, options);
        client2.disconnect();
        client.on('refresh', function() {
            client.disconnect();
            done();
        });

    });

    it('it should retrun the same message emited', function(done) {

        var client = io.connect(socketURL, options);

        client.emit('message', {type: 'hello',data: 5});

        client.on('message', function(data) {

            data.type.should.equal('hello');
            data.data.should.equal(5);
            client.disconnect();
            done();
        });

    });

    it('it should emit a quite message when gun.js make a post request to /off', function(done) {
        var client = io.connect(socketURL, options);

        request(app)
          .post('/off')
          .expect(200).end();

        client.on('quiet', function() {
            client.disconnect();
            done();
        });

    });


    it('it should emit a quite message when gun.js make a post request to /on', function(done) {
        var client = io.connect(socketURL, options);

        request(app)
          .post('/on')
          .expect(200).end();

        client.on('talk', function() {
            client.disconnect();
            done();
        });

    });





});
