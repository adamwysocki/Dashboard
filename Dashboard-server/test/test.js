"use strict";

var server              = require('../dashboard.js'),
    should              = require('chai').should(),
    expect              = require('chai').expect,
    supertest           = require('supertest'),
    api                 = supertest('http://localhost:9090');

describe('Sessions Route', function() {

  var path = "/sessions";

  it('should return a 200 response and success should be true', function(done) {
    api.get(path)
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, response){
      expect(response.body.success).to.equal(true);
      done();
    });
  });

  it('should contain a result with 2 arrays of 30 items each', function(done) {
    api.get(path)
    .set('Accept', 'application/json')
    .end(function(err, response){
      expect(response.body.current.length).to.equal(30);
      expect(response.body.previous.length).to.equal(30);
      done();
    });
  });

})

describe('Users Route', function() {

  var path = "/users";

  it('should return a 200 response and success should be true', function(done) {
    api.get(path)
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, response){
      expect(response.body.success).to.equal(true);
      done();
    });
  });

  it('should contain a result with 2 arrays of 30 items each', function(done) {
    api.get(path)
    .set('Accept', 'application/json')
    .end(function(err, response){
      expect(response.body.current.length).to.equal(30);
      expect(response.body.previous.length).to.equal(30);
      done();
    });
  });

})

describe('Pageviews Route', function() {

  var path = "/pageviews";

  it('should return a 200 response and success should be true', function(done) {
    api.get(path)
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, response){
      expect(response.body.success).to.equal(true);
      done();
    });
  });

  it('should contain a result with 2 arrays of 30 items each', function(done) {
    api.get(path)
    .set('Accept', 'application/json')
    .end(function(err, response){
      expect(response.body.current.length).to.equal(30);
      expect(response.body.previous.length).to.equal(30);
      done();
    });
  });

})
