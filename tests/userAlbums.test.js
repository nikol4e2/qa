const axios = require("axios");

const API_URL = "https://graphqlzero.almansi.me/api";

describe("GraphQL API - Users & Albums", () => {
    //USERS
  it("should fetch a user by ID", async () => {
    const query = `
      query {
        user(id: 1) {
          id
          name
          email
        }
      }
    `;

    const res = await axios.post(API_URL, { query }, {
      headers: { "Content-Type": "application/json" }
    });

    expect(res.status).toBe(200);
    expect(res.data.data.user).toHaveProperty("id", "1");
    expect(res.data.data.user).toHaveProperty("name");
    expect(res.data.data.user).toHaveProperty("email");
  });

  //Query Albums
  it("should fetch albums of a user", async () => {
    const query = `
      query {
        user(id: 1) {
          albums {
            data {
              id
              title
            }
          }
        }
      }
    `;

    const res = await axios.post(API_URL, { query }, {
      headers: { "Content-Type": "application/json" }
    });

    expect(res.status).toBe(200);
    expect(res.data.data.user.albums.data.length).toBeGreaterThan(0);
    expect(res.data.data.user.albums.data[0]).toHaveProperty("id");
    expect(res.data.data.user.albums.data[0]).toHaveProperty("title");
  });

  //Mutation
  it("should create a new album", async () => {
    const mutation = `
      mutation {
        createAlbum(input: { title: "My New Album", userId: 1 }) {
          id
          title
          user {
            id
          }
        }
      }
    `;

    const res = await axios.post(API_URL, { query: mutation }, {
      headers: { "Content-Type": "application/json" }
    });

    expect(res.status).toBe(200);
    expect(res.data.data.createAlbum).toHaveProperty("id");
    expect(res.data.data.createAlbum).toHaveProperty("title", "My New Album");
    expect(res.data.data.createAlbum.user).toHaveProperty("id", "1");
  });

  
  //Inavalid queary
  it("should return an error for invalid field", async () => {
    const query = `
      query {
        user(id: 1) {
          nonExistentField
        }
      }
    `;

    try {
      await axios.post(API_URL, { query }, {
        headers: { "Content-Type": "application/json" }
      });
     
      throw new Error("Expected error but got success response");
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.errors).toBeDefined();
      expect(error.response.data.errors[0].message).toContain("Cannot query field");
    }
  });
});
