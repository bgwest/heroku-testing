'use strict';

// development note: - see test.env.js for environment includes

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const userMockObject = require('./lib/user-mock');

describe('testing app.js routes and responses.', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(userMockObject.pCleanNoteMocks);

  test('should respond 200 and return a new user in json.', () => {
    return superagent.post(`http://localhost:${process.env.PORT}/new/user`)
      .set('Content-Type', 'application/json')
      .send({
        username: 'bgwest88',
        title: 'Sysadmin / Junior Developer',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.username).toEqual('bgwest88');
        expect(response.body.title).toEqual('Sysadmin / Junior Developer');

        expect(response.body.timestamp).toBeTruthy();
        expect(response.body._id.toString()).toBeTruthy();
      });
  });
  test('Attempting to POST with no content to send. Should receive 400.', () => {
    return superagent.post(`http://localhost:${process.env.PORT}/new/user`)
      .set('Content-Type', 'application/json')
      .send({})
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('if there is a matching id, should respond with 200 && json a note.', () => {
    let savedUserMock = null;
    return userMockObject.pCreateNoteMock()
      .then((createdMockUser) => {
        savedUserMock = createdMockUser;
        return superagent.get(`http://localhost:${process.env.PORT}/login/${createdMockUser._id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.timestamp).toBeTruthy();
        expect(getResponse.body._id.toString()).toEqual(savedUserMock._id.toString());
        expect(getResponse.body.title).toEqual(savedUserMock.title);
      });
  });
  test('attempt to get valid request with an invalid id and should receive 404.', () => {
    return superagent.get(`http://localhost:${process.env.PORT}/login/invalid-id-au8290aoop1039j`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
  test('testing PUT method. should return updated body && 200 status.', () => {
    let savedUserMock = null;
    return userMockObject.pCreateNoteMock()
      .then((createdMockUser) => {
        savedUserMock = createdMockUser;
        return superagent.put(`http://localhost:${process.env.PORT}/login/${createdMockUser._id}`)
          .set('Content-Type', 'application/json')
          .send('{"username":"testuser","title":"nobody"}');
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.timestamp).toBeTruthy();
        expect(getResponse.body._id.toString()).toEqual(savedUserMock._id.toString());
        expect(getResponse.body.title).toEqual('nobody');
        expect(getResponse.body.username).toEqual('testuser');
      });
  });
  test('testing PUT method in the case where no body content is provided - should return 400.', () => {
    return userMockObject.pCreateNoteMock()
      .then((createdMockUser) => {
        return superagent.put(`http://localhost:${process.env.PORT}/login/${createdMockUser._id}`)
          .then(Promise.reject)
          .catch((response) => {
            expect(response.status).toEqual(404);
          });
      });
  });
  test('attempting user creation and then deletion - successful delete should return 201', () => {
    return userMockObject.pCreateNoteMock()
      .then((createdMockUser) => {
        console.log(createdMockUser);
        return superagent.delete(`http://localhost:${process.env.PORT}/login/${createdMockUser._id}`)
          .then((getResponse) => {
            expect(getResponse.status).toEqual(201);
          });
      });
  });
  test('attempt to delete with bad ID - should return 404', () => {
    return superagent.delete(`http://localhost:${process.env.PORT}/login/hooo-boy-this-id-invalid`)
      .then(Promise.reject)
      .catch((getResponse) => {
        expect(getResponse.status).toEqual(404);
      });
  });
  // test('should respond 400 if there is no job role title.', () => {
  //   return superagent.post(`http://localhost:${API_PORT}/new/user`)
  //     .set('Content-Type', 'application/json')
  //     .send({
  //       username: 'bgwest',
  //     })
  //     .then(Promise.reject)
  //     .catch((response) => {
  //       expect(response.status).toEqual(400);
  //     });
  // });
  // test('should respond with 200 status code and a json note if there is a matching id.', () => {
  //   const originalRequest = {
  //     username: faker.lorem.words(5),
  //     title: faker.lorem.words(5),
  //   };
  //   return superagent.post(`http://localhost:${API_PORT}/new/user`)
  //     .set('Content-Type', 'application/json')
  //     .send(originalRequest)
  //     .then((postResponse) => {
  //       // development note: If you see this code at work, propose the use of MOCK OBJECTS...
  //       originalRequest.id = postResponse.body.id;
  //       return superagent.get(`http://localhost:${API_PORT}/login/${postResponse.body.id}`);
  //     })
  //     .then((getResponse) => {
  //       expect(getResponse.status).toEqual(200);
  //       expect(getResponse.body.timestamp).toBeTruthy();
  //       expect(getResponse.body.id).toEqual(originalRequest.id);
  //       expect(getResponse.body.title).toEqual(originalRequest.title);
  //     });
  // });
  // test('should respond 204 if a user is removed', () => {
  //   const ogRequest = {
  //     username: faker.lorem.words(5),
  //     title: faker.lorem.words(5),
  //   };
  //   return superagent.post(`http://localhost:${API_PORT}/new/user`)
  //     .set('Content-Type', 'application/json')
  //     .send(ogRequest)
  //     .then((postResponse) => {
  //       ogRequest.id = postResponse.body.id;
  //       return superagent.delete(`http://localhost:${API_PORT}/login/${ogRequest.id}`);
  //     })
  //     .then((getResponse) => {
  //       expect(getResponse.status).toEqual(204);
  //     });
  // });
  // test('should respond 404 if user does not exist on delete request.', () => {
  //   return superagent.delete(`http://localhost:${API_PORT}/login/hooo-boy-this-id-invalid`)
  //     .then(Promise.reject)
  //     .catch((getResponse) => {
  //       expect(getResponse.status).toEqual(404);
  //     });
  // });
  // test('if username update for user is successful, should respond 204', () => {
  //   const ogRequest = {
  //     username: faker.lorem.words(5),
  //     title: faker.lorem.words(5),
  //   };
  //   return superagent.post(`http://localhost:${API_PORT}/new/user`)
  //     .set('Content-Type', 'application/json')
  //     .send(ogRequest)
  //     .then((postResponse) => {
  //       ogRequest.id = postResponse.body.id;
  //       return superagent.put(`http://localhost:${API_PORT}/login/${ogRequest.id}`)
  //         .send({
  //           username: 'mrtrey',
  //         });
  //     })
  //     .then((putResponse) => {
  //       expect(putResponse.status).toEqual(200);
  //       expect(putResponse.body.id).toEqual(ogRequest.id);
  //       expect(putResponse.body.username).toEqual('mrtrey');
  //       expect(putResponse.body.content).toEqual(ogRequest.content);
  //     });
  // });
});
