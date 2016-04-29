require('should');
var app = require('../app');

var request = require('supertest');
var io = require('socket.io-client');
var socketURL = 'http://127.0.0.1:5000';
var options = {
    transports: ['websocket'],
    'force new connection': true
};
var room = 'portal';

function joinRoom(client) {
    client.on('connect', function() {
      client.emit('room', room);
  });
}

describe('Test connections', function() {

    it('it should emit join when a user is connected', function(done) {

        var client = io.connect(socketURL, options);

        joinRoom(client);

        client.on('join', function(current) {
            current.should.equal(1);
            client.disconnect();
            done();
        });
    });


    it('it should connect just two clients', function(done) {

        var client = io.connect(socketURL, options);
        var client2 = io.connect(socketURL, options);

        joinRoom(client);
        joinRoom(client2);

        client2.on('join', function(current) {
            current.should.equal(2);
            client.disconnect();
            client2.disconnect();
            done();
        });

    });

    it('it should redirect when there are more than 2 users', function(done) {
        var client = io.connect(socketURL, options);
        var client2 = io.connect(socketURL, options);
        var client3 = io.connect(socketURL, options);

        joinRoom(client);
        joinRoom(client2);
        joinRoom(client3);

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

        joinRoom(client);
        joinRoom(client2);

        client2.disconnect();

        client.on('refresh', function() {
            client.disconnect();
            done();
        });

    });

    it('it should retrun the same message emited', function(done) {

        var client = io.connect(socketURL, options);

        joinRoom(client);

        client.emit('message', {type: 'hello',data: 5});

        client.on('message', function(data) {

            data.type.should.equal('hello');
            data.data.should.equal(5);
            client.disconnect();
            done();
        });

    });

    it('it should respond 200 when /POST to /off path', function(done){
      request(app)
        .post('/off')
        .expect(200, done);
    });

    it('it should emit a quite message when a request is made to /off', function(done) {

        var client = io.connect(socketURL, options);

        joinRoom(client);

        request(app)
          .post('/off')
          .end(function(err, res) {
            client.on('quiet', function() {
                client.disconnect();
                done();
            });
          });

    });

    // it('it should emit a quite message when gun.js make a post request to /on', function(done) {
    //     var client = io.connect(socketURL, options);
    //
    //     joinRoom(client);
    //
    //     request(app)
    //       .post('/on')
    //       .expect(200).end();
    //
    //     client.on('talk', function() {
    //         client.disconnect();
    //         done();
    //     });
    //
    // });

    // it('it should emit a refresh when a client send a refresh message', function(done) {
    //     var client = io.connect(socketURL, options);
    //     var client2 = io.connect(socketURL, options);
    //     client.emit('refresh');
    //
    //     client2.on('refresh', function() {
    //         client2.disconnect();
    //         client.disconnect();
    //         done();
    //     });
    //
    // });
    //
    // it('it should return a 200 status when /GET in full path', function(done) {
    //
    //     request(app)
    //       .get('/full')
    //       .expect(200)
    //     .end(function(err, res) {
    //         if(err) {
    //             done(err);
    //         }else {
    //             done();
    //         }
    //     });
    //
    // });
    //
    // it('it should return a 200 status when /GET in the root path', function(done) {
    //
    //     request(app)
    //       .get('/')
    //       .expect(200)
    //     .end(function(err, res) {
    //         if(err) {
    //             done(err);
    //         }else {
    //             done();
    //         }
    //     });
    //
    // });

});
