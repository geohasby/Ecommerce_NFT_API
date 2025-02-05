class UsersHandler {
  constructor(service, serviceImage, validator, validatorImage) {
    this._service = service;
    this._serviceImage = serviceImage;
    this._validatorImage = validatorImage;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.deleteUserByEmailHandler = this.deleteUserByEmailHandler.bind(this);
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
    this.postUploadProfileImageHandler = this.postUploadProfileImageHandler.bind(this);
    this.postUploadCoverImageHandler = this.postUploadCoverImageHandler.bind(this);
    this.getUsersSaldoHighestHandler = this.getUsersSaldoHighestHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const {
        name, email, phone_number: phoneNumber, nationality, password,
      } = request.payload;
      const userId = await this._service.addUser({
        name, email, phoneNumber, nationality, password,
      });

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getUserByIdHandler(request) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const user = await this._service.getUserById(credentialId);
      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async getUsersByUsernameHandler(request) {
    try {
      const { name } = request.params;
      const user = await this._service.getUsersByName(name);
      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deleteUserByEmailHandler(request) {
    try {
      const { email, password } = request.payload;
      await this._service.deleteUserByEmail(email, password);
      return {
        status: 'success',
        message: 'User berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }

  async postUploadProfileImageHandler(request, h) {
    try {
      const { data } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      this._validatorImage.validateImageHeaders(data.hapi.headers);
      const fileLocation = await this._serviceImage.writeFile(data, data.hapi);
      // console.log(fileLocation);
      await this._service.insertProfileImage(credentialId, fileLocation);
      const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          fileLocation,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async postUploadCoverImageHandler(request, h) {
    try {
      const { data } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      this._validatorImage.validateImageHeaders(data.hapi.headers);
      const fileLocation = await this._serviceImage.writeFile(data, data.hapi);
      // console.log(fileLocation);
      await this._service.insertCoverImage(credentialId, fileLocation);
      const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          fileLocation,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getUsersSaldoHighestHandler() {
    const users = await this._service.getUsersSaldoHighest();
    return {
      status: 'success',
      data: {
        users,
      },
    };
  }
}

module.exports = UsersHandler;
